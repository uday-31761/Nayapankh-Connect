package com.NayePankh.repository;

import com.NayePankh.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Integer> {
    Optional<OtpVerification> findFirstByMobileOrderByExpiryTimeDesc(String mobile);
    void deleteByMobile(String mobile);
}
