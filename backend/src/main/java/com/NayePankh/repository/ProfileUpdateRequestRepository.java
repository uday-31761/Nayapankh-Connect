package com.NayePankh.repository;

import com.NayePankh.model.ProfileUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileUpdateRequestRepository extends JpaRepository<ProfileUpdateRequest, Integer> {
    List<ProfileUpdateRequest> findByStatus(String status);
}
