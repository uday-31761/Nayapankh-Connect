package com.NayePankh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:vudaykiranv761@gmail.com}")
    private String fromEmail;

    @Override
    public void sendApprovalEmail(String toEmail, String name) {
        String subject = "Congratulations! NayePankh Connect Portal Registration Approved";
        String body = "Dear " + name + ",\n\n" +
                "Congratulations!\n" +
                "Your volunteer application has been approved.\n\n" +
                "You can now login to the NayePankh Connect Portal.\n\n" +
                "Best Regards,\n" +
                "NayePankh Foundation";

        sendEmail(toEmail, subject, body);
    }

    @Override
    public void sendRejectionEmail(String toEmail, String name, String reason) {
        String subject = "NayePankh Connect Portal Application Status";
        String body = "Dear " + name + ",\n\n" +
                "Unfortunately your application was not approved.\n\n" +
                "Reason:\n" + reason + "\n\n" +
                "You may submit a new application through our website with the correct details.\n\n" +
                "Best Regards,\n" +
                "NayePankh Foundation";

        sendEmail(toEmail, subject, body);
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Reset Password OTP - NayePankh Connect Portal";
        String body = "Dear User,\n\n" +
                "You requested a password reset. Your OTP verification code is:\n\n" +
                "   " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "Best Regards,\n" +
                "NayePankh Foundation";

        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        System.out.println("\n=== [SIMULATED EMAIL SENT] ===");
        System.out.println("From: " + fromEmail);
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + body);
        System.out.println("=============================\n");

        if (mailSender == null) {
            System.out.println("[WARN] JavaMailSender is not initialized. Using simulated email logs.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("[INFO] Real email successfully sent to " + to);
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send real email via SMTP: " + e.getMessage());
            System.out.println("[INFO] Email simulation fallback executed successfully.");
        }
    }
}
