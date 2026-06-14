package com.NayePankh.controller;

import com.NayePankh.model.Batch;
import com.NayePankh.model.ProfileUpdateRequest;
import com.NayePankh.model.User;
import com.NayePankh.model.VolunteerProfile;
import com.NayePankh.repository.VolunteerProfileRepository;
import com.NayePankh.service.BatchService;
import com.NayePankh.service.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private BatchService batchService;

    @Autowired
    private VolunteerProfileRepository profileRepository;

    @GetMapping("/volunteers")
    public ResponseEntity<?> getAllVolunteers() {
        try {
            List<User> users = userService.getAllUsers().stream()
                    .filter(u -> "ROLE_VOLUNTEER".equals(u.getRole()))
                    .collect(Collectors.toList());

            List<Map<String, Object>> response = new ArrayList<>();
            for (User u : users) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("firstname", u.getFirstname());
                map.put("lastname", u.getLastname());
                map.put("email", u.getEmail());
                map.put("mobile", u.getMobile());
                map.put("gender", u.getGender());
                map.put("dob", u.getDob());
                map.put("city", u.getCity());
                map.put("status", u.getStatus());
                map.put("createdAt", u.getCreatedAt());
                map.put("batch", u.getBatch() != null ? u.getBatch() : null);

                // Fetch profile detail if present
                try {
                    VolunteerProfile vp = userService.getProfileByUserId(u.getId());
                    map.put("college", vp.getCollege());
                    map.put("course", vp.getCourse());
                    map.put("skills", vp.getSkills());
                    map.put("interests", vp.getInterests());
                    map.put("availabilityDays", vp.getAvailabilityDays());
                } catch (Exception e) {
                    map.put("college", "");
                    map.put("course", "");
                    map.put("skills", "");
                    map.put("interests", "");
                    map.put("availabilityDays", "");
                }
                response.add(map);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pending-applications")
    public ResponseEntity<?> getPendingApplications() {
        return ResponseEntity.ok(userService.getPendingApplications());
    }

    @PostMapping("/approve-volunteer/{userId}")
    public ResponseEntity<?> approveVolunteer(@PathVariable Integer userId) {
        try {
            User user = userService.approveVolunteer(userId);
            return ResponseEntity.ok(Map.of("message", "Volunteer approved successfully.", "user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reject-volunteer/{userId}")
    public ResponseEntity<?> rejectVolunteer(@PathVariable Integer userId, @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "No reason provided");
            userService.rejectVolunteer(userId, reason);
            return ResponseEntity.ok(Map.of("message", "Volunteer rejected and data removed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/promote-admin/{userId}")
    public ResponseEntity<?> promoteAdmin(@PathVariable Integer userId) {
        try {
            User user = userService.promoteToAdmin(userId);
            return ResponseEntity.ok(Map.of("message", "Volunteer promoted to admin successfully.", "user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/demote-admin/{userId}")
    public ResponseEntity<?> demoteAdmin(@PathVariable Integer userId) {
        try {
            User user = userService.demoteToVolunteer(userId);
            return ResponseEntity.ok(Map.of("message", "Admin demoted to volunteer successfully.", "user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/remove-volunteer/{userId}")
    public ResponseEntity<?> removeVolunteer(@PathVariable Integer userId) {
        try {
            userService.removeUser(userId);
            return ResponseEntity.ok(Map.of("message", "Volunteer removed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/batches")
    public ResponseEntity<?> getBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @PostMapping("/batches")
    public ResponseEntity<?> createBatch(@RequestBody Map<String, String> body) {
        try {
            String batchName = body.get("batchName");
            if (batchName == null || batchName.isEmpty()) {
                throw new RuntimeException("Batch name cannot be empty.");
            }
            Batch batch = batchService.createBatch(batchName);
            return ResponseEntity.ok(Map.of("message", "Batch created successfully.", "batch", batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/assign-batch")
    public ResponseEntity<?> assignBatch(@RequestBody AssignBatchRequest request) {
        try {
            User user = userService.assignBatch(request.getUserId(), request.getBatchId());
            return ResponseEntity.ok(Map.of("message", "Batch assigned successfully.", "user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pending-profile-updates")
    public ResponseEntity<?> getPendingProfileUpdates() {
        try {
            List<ProfileUpdateRequest> requests = userService.getPendingProfileUpdates();
            List<Map<String, Object>> response = new ArrayList<>();
            for (ProfileUpdateRequest r : requests) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("user", r.getUser());
                map.put("updatedData", r.getUpdatedData());
                map.put("createdAt", r.getCreatedAt());

                try {
                    VolunteerProfile currentProfile = userService.getProfileByUserId(r.getUser().getId());
                    map.put("currentProfile", currentProfile);
                } catch (Exception e) {
                    map.put("currentProfile", null);
                }
                response.add(map);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/approve-profile-update/{requestId}")
    public ResponseEntity<?> approveProfileUpdate(@PathVariable Integer requestId) {
        try {
            userService.approveProfileUpdate(requestId);
            return ResponseEntity.ok(Map.of("message", "Profile updates approved successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reject-profile-update/{requestId}")
    public ResponseEntity<?> rejectProfileUpdate(@PathVariable Integer requestId) {
        try {
            userService.rejectProfileUpdate(requestId);
            return ResponseEntity.ok(Map.of("message", "Profile updates rejected successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/reports-dashboard")
    public ResponseEntity<?> getReportsDashboard() {
        try {
            long totalVolunteers = userService.getTotalVolunteersCount();
            long activeVolunteers = userService.getActiveVolunteersCount();
            long pendingApps = userService.getPendingApplicationsCount();
            long rejectedApps = userService.getRejectedApplicationsCount();
            long totalAdmins = userService.getTotalAdminsCount();

            List<User> volunteers = userService.getAllUsers().stream()
                    .filter(u -> "ROLE_VOLUNTEER".equals(u.getRole()))
                    .collect(Collectors.toList());

            List<VolunteerProfile> profiles = profileRepository.findAll();

            // 1. Volunteers by City
            Map<String, Long> cityCounts = volunteers.stream()
                    .filter(u -> u.getCity() != null && !u.getCity().isEmpty())
                    .collect(Collectors.groupingBy(User::getCity, Collectors.counting()));
            List<Map<String, Object>> byCity = cityCounts.entrySet().stream()
                    .map(e -> Map.<String, Object>of("name", e.getKey(), "value", e.getValue()))
                    .collect(Collectors.toList());

            // 2. Volunteers by College
            Map<String, Long> collegeCounts = profiles.stream()
                    .filter(p -> p.getCollege() != null && !p.getCollege().isEmpty())
                    .collect(Collectors.groupingBy(VolunteerProfile::getCollege, Collectors.counting()));
            List<Map<String, Object>> byCollege = collegeCounts.entrySet().stream()
                    .map(e -> Map.<String, Object>of("name", e.getKey(), "value", e.getValue()))
                    .collect(Collectors.toList());

            // 3. Volunteers by Skills
            Map<String, Long> skillCounts = new HashMap<>();
            for (VolunteerProfile p : profiles) {
                if (p.getSkills() != null && !p.getSkills().isEmpty()) {
                    String[] sks = p.getSkills().split(",");
                    for (String s : sks) {
                        String clean = s.trim();
                        if (!clean.isEmpty()) {
                            skillCounts.put(clean, skillCounts.getOrDefault(clean, 0L) + 1);
                        }
                    }
                }
            }
            List<Map<String, Object>> bySkills = skillCounts.entrySet().stream()
                    .map(e -> Map.<String, Object>of("name", e.getKey(), "value", e.getValue()))
                    .sorted((m1, m2) -> Long.compare((Long) m2.get("value"), (Long) m1.get("value")))
                    .limit(8)
                    .collect(Collectors.toList());

            // 4. Volunteers by Batch
            Map<String, Long> batchCounts = volunteers.stream()
                    .collect(Collectors.groupingBy(
                            u -> u.getBatch() != null ? u.getBatch().getBatchName() : "Unassigned",
                            Collectors.counting()
                    ));
            List<Map<String, Object>> byBatch = batchCounts.entrySet().stream()
                    .map(e -> Map.<String, Object>of("name", e.getKey(), "value", e.getValue()))
                    .collect(Collectors.toList());

            // 5. Monthly Registrations
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
            Map<String, Long> monthlyCounts = volunteers.stream()
                    .filter(u -> u.getCreatedAt() != null)
                    .collect(Collectors.groupingBy(
                            u -> u.getCreatedAt().format(formatter),
                            TreeMap::new, // Sorted order
                            Collectors.counting()
                    ));
            List<Map<String, Object>> monthly = monthlyCounts.entrySet().stream()
                    .map(e -> Map.<String, Object>of("name", e.getKey(), "value", e.getValue()))
                    .collect(Collectors.toList());

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalVolunteers", totalVolunteers);
            stats.put("activeVolunteers", activeVolunteers);
            stats.put("pendingApplications", pendingApps);
            stats.put("rejectedApplications", rejectedApps);
            stats.put("totalAdmins", totalAdmins);
            stats.put("volunteersByCity", byCity);
            stats.put("volunteersByCollege", byCollege);
            stats.put("volunteersBySkills", bySkills);
            stats.put("volunteersByBatch", byBatch);
            stats.put("monthlyRegistrations", monthly);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Data
    public static class AssignBatchRequest {
        private Integer userId;
        private Integer batchId;
    }
}
