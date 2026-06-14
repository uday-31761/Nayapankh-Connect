package com.NayePankh.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "volunteer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerProfile {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    @ToString.Exclude // Prevent circular reference in lombok toString
    private User user;

    private String college;
    private String course;
    
    @Column(columnDefinition = "TEXT")
    private String skills;
    
    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(name = "availability_days")
    private String availabilityDays;
}
