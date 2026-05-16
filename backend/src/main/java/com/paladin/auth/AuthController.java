package com.paladin.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CurrentUserProvider currentUserProvider;
    private final SecurityConfig securityConfig;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    public AuthController(CurrentUserProvider currentUserProvider, SecurityConfig securityConfig) {
        this.currentUserProvider = currentUserProvider;
        this.securityConfig = securityConfig;
    }

    @GetMapping("/config")
    public Map<String, Boolean> config() {
        return Map.of(
                "googleEnabled", securityConfig.isGoogleEnabled(),
                "devLoginEnabled", securityConfig.isDevLoginEnabled()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        User user = currentUserProvider.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/dev-login")
    public ResponseEntity<User> devLogin(HttpServletRequest request, HttpServletResponse response) {
        if (!securityConfig.isDevLoginEnabled()) {
            return ResponseEntity.status(403).build();
        }
        User dev = currentUserProvider.mockDevUser();
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                dev, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(auth);
        SecurityContextHolder.setContext(ctx);
        securityContextRepository.saveContext(ctx, request, response);
        return ResponseEntity.ok(dev);
    }
}
