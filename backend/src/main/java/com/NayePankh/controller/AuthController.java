package com.NayePankh.controller;

import com.NayePankh.model.User;
import com.NayePankh.model.VolunteerProfile;
import com.NayePankh.security.JwtUtils;
import com.NayePankh.service.EmailService;
import com.NayePankh.service.OtpService;
import com.NayePankh.service.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
private PasswordEncoder passwordEncoder;

@GetMapping("/test-password")
public String testPassword() {

    String hash = "$2a$10$w/rLd7/U03V7740YjD3.P.x3v6vM8pI7oWc4vX720X1c324r3675y";

    boolean result = passwordEncoder.matches("admin123", hash);

    return "Matches = " + result;
}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setFirstname(request.getFirstname());
            user.setLastname(request.getLastname());
            user.setGender(request.getGender());
            user.setDob(LocalDate.parse(request.getDob()));
            user.setCity(request.getCity());
            user.setMobile(request.getMobile());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());

            VolunteerProfile profile = new VolunteerProfile();
            profile.setCollege(request.getCollege());
            profile.setCourse(request.getCourse());
            profile.setSkills(request.getSkills());
            profile.setInterests(request.getInterests());
            profile.setAvailabilityDays(request.getAvailabilityDays());

            User registeredUser = userService.registerVolunteer(user, profile);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful. Please wait for admin approval.");
            response.put("userId", registeredUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/generate-hash")
public String generateHash() {
    return passwordEncoder.encode("admin123");
}

@GetMapping("/check-user")
public String checkUser() {

    User user = userService.findByEmail("admin@nayepankh.org");

    return user.getPassword();
}
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Check if user is registered
            User user;
            try {
                if (request.getUsername().contains("@")) {
                    user = userService.findByEmail(request.getUsername());
                } else {
                    user = userService.findByMobile(request.getUsername());
                }
            } catch (Exception e) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Member not registered. Please complete the registration process.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 2. Validate application status
            if ("PENDING_APPROVAL".equals(user.getStatus())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Your application is under review. Please wait for admin approval.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            if ("REJECTED".equals(user.getStatus())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Application Rejected. Please contact administrator or submit a new application.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            System.out.println("INPUT PASSWORD = " + request.getPassword());
            // 3. Authenticate credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("firstname", user.getFirstname());
            response.put("lastname", user.getLastname());
            response.put("role", user.getRole());
            response.put("status", user.getStatus());

            return ResponseEntity.ok(response);

        } 
        // catch (Exception e) {
        //     Map<String, String> response = new HashMap<>();
        //     response.put("error", "Invalid credentials. Please try again.");
        //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        // }
        catch (Exception e) {
    e.printStackTrace();

    Map<String, String> response = new HashMap<>();
    response.put("error", e.getClass().getName());
    response.put("message", e.getMessage());

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
}
    }

    @PostMapping("/forgot-password/otp")
    public ResponseEntity<?> sendForgotPasswordOtp(@RequestBody Map<String, String> request) {
        try {
            String mobile = request.get("mobile");
            if (mobile == null || mobile.isEmpty()) {
                throw new RuntimeException("Mobile number is required.");
            }

            // Verify if user exists
            User user = userService.findByMobile(mobile);

            // Generate OTP
            String otp = otpService.generateOtp(mobile);

            // Send simulated/real email
            emailService.sendOtpEmail(user.getEmail(), otp);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "OTP sent successfully to your registered email.");
            // Returning OTP in response for development convenience
            response.put("otp", otp); 
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<?> verifyForgotPasswordOtp(@RequestBody Map<String, String> request) {
        try {
            String mobile = request.get("mobile");
            String otp = request.get("otp");

            boolean isValid = otpService.validateOtp(mobile, otp);
            if (!isValid) {
                throw new RuntimeException("Invalid or expired OTP code.");
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP verified successfully. You can now reset your password.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String mobile = request.get("mobile");
            String newPassword = request.get("newPassword");

            userService.resetPassword(mobile, newPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successfully. Please login again.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("firstname", user.getFirstname());
            response.put("lastname", user.getLastname());
            response.put("role", user.getRole());
            response.put("status", user.getStatus());
            response.put("mobile", user.getMobile());
            response.put("gender", user.getGender());
            response.put("dob", user.getDob());
            response.put("city", user.getCity());
            if (user.getBatch() != null) {
                response.put("batch", user.getBatch().getBatchName());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @Data
    public static class RegisterRequest {
        private String firstname;
        private String lastname;
        private String gender;
        private String dob;
        private String city;
        private String mobile;
        private String email;
        private String password;
        private String college;
        private String course;
        private String skills;
        private String interests;
        private String availabilityDays;
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}
