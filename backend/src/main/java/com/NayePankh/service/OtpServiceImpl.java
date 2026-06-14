package com.NayePankh.service;

import com.NayePankh.model.OtpVerification;
import com.NayePankh.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    private final Random random = new Random();

    @Override
    @Transactional
    public String generateOtp(String mobile) {
        // Delete any existing OTP for this mobile number
        otpRepository.deleteByMobile(mobile);

        // Generate 6-digit OTP code
        String otp = String.format("%06d", random.nextInt(1000000));
        
        OtpVerification verification = new OtpVerification();
        verification.setMobile(mobile);
        verification.setOtp(otp);
        verification.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // Valid for 5 minutes

        otpRepository.save(verification);
        return otp;
    }

    @Override
    @Transactional
    public boolean validateOtp(String mobile, String otp) {
        Optional<OtpVerification> optionalVerification = otpRepository.findFirstByMobileOrderByExpiryTimeDesc(mobile);
        if (optionalVerification.isPresent()) {
            OtpVerification verification = optionalVerification.get();
            if (verification.getOtp().equals(otp) && verification.getExpiryTime().isAfter(LocalDateTime.now())) {
                // OTP is valid. Clean up OTP to prevent reuse.
                otpRepository.deleteByMobile(mobile);
                return true;
            }
        }
        return false;
    }
}
