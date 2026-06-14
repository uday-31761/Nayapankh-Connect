package com.NayePankh.service;

import com.NayePankh.model.User;
import com.NayePankh.model.VolunteerProfile;
import com.NayePankh.model.ProfileUpdateRequest;
import java.util.List;

public interface UserService {
    User registerVolunteer(User user, VolunteerProfile profile);
    User approveVolunteer(Integer userId);
    void rejectVolunteer(Integer userId, String reason);
    User promoteToAdmin(Integer userId);
    User demoteToVolunteer(Integer userId);
    void removeUser(Integer userId);
    User assignBatch(Integer userId, Integer batchId);
    
    User findByEmail(String email);
    User findByMobile(String mobile);
    User findById(Integer id);
    List<User> getAllUsers();
    List<User> getPendingApplications();
    
    VolunteerProfile getProfileByUserId(Integer userId);
    void submitProfileUpdate(Integer userId, String updatedDataJson);
    List<ProfileUpdateRequest> getPendingProfileUpdates();
    void approveProfileUpdate(Integer requestId);
    void rejectProfileUpdate(Integer requestId);
    
    void resetPassword(String mobile, String newPassword);

    // Dashboard Stats
    long getTotalVolunteersCount();
    long getActiveVolunteersCount();
    long getPendingApplicationsCount();
    long getRejectedApplicationsCount();
    long getTotalAdminsCount();
}
