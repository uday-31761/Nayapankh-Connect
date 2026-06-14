package com.NayePankh.service;

public interface EmailService {
    void sendApprovalEmail(String toEmail, String name);
    void sendRejectionEmail(String toEmail, String name, String reason);
    void sendOtpEmail(String toEmail, String otp);
}
