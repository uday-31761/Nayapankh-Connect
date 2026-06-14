package com.NayePankh.security;

import com.NayePankh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // @Override
    // public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    //     // Username can be either Email Address or Mobile Number
    //     return userRepository.findByEmailOrMobile(username, username)
    //             .orElseThrow(() -> new UsernameNotFoundException("User not registered with email or mobile: " + username));
    // }

    @Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    System.out.println("LOGIN USERNAME = " + username);

    UserDetails user = userRepository.findByEmailOrMobile(username, username)
            .orElseThrow(() -> new UsernameNotFoundException(
                    "User not registered with email or mobile: " + username));

    System.out.println("FOUND USER = " + user.getUsername());

    return user;
}
}
