package com.NayePankh.controller;

import com.NayePankh.model.User;
import com.NayePankh.model.VolunteerProfile;
import com.NayePankh.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "*")
public class VolunteerController {

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findByEmail(email);
    }

    @GetMapping("/dashboard-info")
    public ResponseEntity<?> getDashboardInfo() {
        try {
            User user = getAuthenticatedUser();
            Map<String, Object> response = new HashMap<>();
            response.put("volunteerId", String.format("VOL-%04d", user.getId()));
            response.put("batch", user.getBatch() != null ? user.getBatch().getBatchName() : "Unassigned");
            response.put("status", user.getStatus());
            response.put("joinDate", user.getCreatedAt());
            response.put("firstname", user.getFirstname());
            response.put("lastname", user.getLastname());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            User user = getAuthenticatedUser();
            VolunteerProfile profile = userService.getProfileByUserId(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("firstname", user.getFirstname());
            response.put("lastname", user.getLastname());
            response.put("gender", user.getGender());
            response.put("dob", user.getDob());
            response.put("city", user.getCity());
            response.put("mobile", user.getMobile());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("status", user.getStatus());
            response.put("batch", user.getBatch() != null ? user.getBatch().getBatchName() : "Unassigned");

            response.put("college", profile.getCollege());
            response.put("course", profile.getCourse());
            response.put("skills", profile.getSkills());
            response.put("interests", profile.getInterests());
            response.put("availabilityDays", profile.getAvailabilityDays());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/profile-update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> requestData) {
        try {
            User user = getAuthenticatedUser();
            
            // Convert requested data map to JSON string
            String updatedDataJson = objectMapper.writeValueAsString(requestData);
            
            // Submit profile update request
            userService.submitProfileUpdate(user.getId(), updatedDataJson);
            
            return ResponseEntity.ok(Map.of("message", "Profile update submitted successfully. Pending Admin approval."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
