package com.NayePankh.service;

import com.NayePankh.model.Batch;
import com.NayePankh.model.ProfileUpdateRequest;
import com.NayePankh.model.User;
import com.NayePankh.model.VolunteerProfile;
import com.NayePankh.repository.BatchRepository;
import com.NayePankh.repository.ProfileUpdateRequestRepository;
import com.NayePankh.repository.UserRepository;
import com.NayePankh.repository.VolunteerProfileRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VolunteerProfileRepository profileRepository;

    @Autowired
    private ProfileUpdateRequestRepository updateRequestRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public User registerVolunteer(User user, VolunteerProfile profile) {
        // Validation for uniqueness
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered. Please login or reset password.");
        }
        if (userRepository.findByMobile(user.getMobile()).isPresent()) {
            throw new RuntimeException("Mobile number is already registered. Please login.");
        }

        // Hashing password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_VOLUNTEER");
        user.setStatus("PENDING_APPROVAL");
        user.setBatch(null); // No batch assigned initially

        User savedUser = userRepository.save(user);

        // Save Volunteer Profile
        // profile.setUserId(savedUser.getId());
        // profile.setUser(savedUser);
        // profileRepository.save(profile);

        profile.setUser(savedUser);
profileRepository.save(profile);

        return savedUser;
    }

    @Override
    @Transactional
    public User approveVolunteer(Integer userId) {
        User user = findById(userId);
        if (!"PENDING_APPROVAL".equals(user.getStatus())) {
            throw new RuntimeException("User application is not pending approval.");
        }

        user.setStatus("APPROVED");
        User updatedUser = userRepository.save(user);

        // Send Approval Email
        emailService.sendApprovalEmail(user.getEmail(), user.getFirstname() + " " + user.getLastname());

        return updatedUser;
    }

    @Override
    @Transactional
    public void rejectVolunteer(Integer userId, String reason) {
        User user = findById(userId);
        if (!"PENDING_APPROVAL".equals(user.getStatus())) {
            throw new RuntimeException("User application is not pending approval.");
        }

        // Send Rejection Email BEFORE deletion
        emailService.sendRejectionEmail(user.getEmail(), user.getFirstname() + " " + user.getLastname(), reason);

        // Delete user and cascade delete volunteer_profile, freeing up mobile and email for re-registration
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public User promoteToAdmin(Integer userId) {
        User user = findById(userId);
        user.setRole("ROLE_ADMIN");
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User demoteToVolunteer(Integer userId) {
        User user = findById(userId);
        user.setRole("ROLE_VOLUNTEER");
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void removeUser(Integer userId) {
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional
    public User assignBatch(Integer userId, Integer batchId) {
        User user = findById(userId);
        if (batchId == null) {
            user.setBatch(null);
        } else {
            Batch batch = batchRepository.findById(batchId)
                    .orElseThrow(() -> new RuntimeException("Batch not found with id: " + batchId));
            user.setBatch(batch);
        }
        return userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Member not registered. Please complete the registration process."));
    }

    @Override
    public User findByMobile(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("Member not registered. Please complete the registration process."));
    }

    @Override
    public User findById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getPendingApplications() {
        return userRepository.findAll().stream()
                .filter(u -> "PENDING_APPROVAL".equals(u.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public VolunteerProfile getProfileByUserId(Integer userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Volunteer profile not found for user id: " + userId));
    }

    @Override
    @Transactional
    public void submitProfileUpdate(Integer userId, String updatedDataJson) {
        User user = findById(userId);
        
        // Save the profile update request
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setUser(user);
        request.setUpdatedData(updatedDataJson);
        request.setStatus("PENDING");
        updateRequestRepository.save(request);

        // Set User status to PROFILE_UPDATE_PENDING
        user.setStatus("PROFILE_UPDATE_PENDING");
        userRepository.save(user);
    }

    @Override
    public List<ProfileUpdateRequest> getPendingProfileUpdates() {
        return updateRequestRepository.findByStatus("PENDING");
    }

    @Override
    @Transactional
    public void approveProfileUpdate(Integer requestId) {
        ProfileUpdateRequest request = updateRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Profile update request not found."));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Profile update request is not pending.");
        }

        try {
            User user = request.getUser();
            VolunteerProfile profile = getProfileByUserId(user.getId());

            // Parse json data and apply updates to User and VolunteerProfile
            Map<String, String> updates = objectMapper.readValue(request.getUpdatedData(), new TypeReference<Map<String, String>>() {});
            
            if (updates.containsKey("firstname")) user.setFirstname(updates.get("firstname"));
            if (updates.containsKey("lastname")) user.setLastname(updates.get("lastname"));
            if (updates.containsKey("gender")) user.setGender(updates.get("gender"));
            if (updates.containsKey("city")) user.setCity(updates.get("city"));
            
            if (updates.containsKey("college")) profile.setCollege(updates.get("college"));
            if (updates.containsKey("course")) profile.setCourse(updates.get("course"));
            if (updates.containsKey("skills")) profile.setSkills(updates.get("skills"));
            if (updates.containsKey("interests")) profile.setInterests(updates.get("interests"));
            if (updates.containsKey("availabilityDays")) profile.setAvailabilityDays(updates.get("availabilityDays"));

            user.setStatus("APPROVED");
            userRepository.save(user);
            profileRepository.save(profile);

            request.setStatus("APPROVED");
            updateRequestRepository.save(request);

        } catch (Exception e) {
            throw new RuntimeException("Failed to approve profile update: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void rejectProfileUpdate(Integer requestId) {
        ProfileUpdateRequest request = updateRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Profile update request not found."));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Profile update request is not pending.");
        }

        User user = request.getUser();
        user.setStatus("APPROVED"); // Revert user back to approved state
        userRepository.save(user);

        request.setStatus("REJECTED");
        updateRequestRepository.save(request);
    }

    @Override
    @Transactional
    public void resetPassword(String mobile, String newPassword) {
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("Member not registered. Please complete the registration process."));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Dashboard Stats implementations
    @Override
    public long getTotalVolunteersCount() {
        return userRepository.findByRole("ROLE_VOLUNTEER").size();
    }

    @Override
    public long getActiveVolunteersCount() {
        return userRepository.findAll().stream()
                .filter(u -> "ROLE_VOLUNTEER".equals(u.getRole()) && ("APPROVED".equals(u.getStatus()) || "PROFILE_UPDATE_PENDING".equals(u.getStatus())))
                .count();
    }

    @Override
    public long getPendingApplicationsCount() {
        return userRepository.countByStatus("PENDING_APPROVAL");
    }

    @Override
    public long getRejectedApplicationsCount() {
        // Users are deleted from DB on rejection, so this is 0 or if we tracked rejection historically.
        // Let's count updates rejected or return 0, since we delete them to allow re-registration.
        return 0; 
    }

    @Override
    public long getTotalAdminsCount() {
        return userRepository.countByRole("ROLE_ADMIN");
    }
}
