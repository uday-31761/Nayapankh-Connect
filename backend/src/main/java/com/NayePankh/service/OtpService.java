package com.NayePankh.service;

public interface OtpService {
    String generateOtp(String mobile);
    boolean validateOtp(String mobile, String otp);
}
