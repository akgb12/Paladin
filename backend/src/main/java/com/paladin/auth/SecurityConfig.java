package com.paladin.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.ClientRegistrations;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${paladin.auth.google.client-id:}")
    private String googleClientId;

    @Value("${paladin.auth.google.client-secret:}")
    private String googleClientSecret;

    @Value("${paladin.auth.google.redirect-uri:{baseUrl}/login/oauth2/code/{registrationId}}")
    private String googleRedirectUri;

    @Value("${paladin.auth.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public boolean isGoogleEnabled() {
        return googleClientId != null && !googleClientId.isBlank()
                && googleClientSecret != null && !googleClientSecret.isBlank();
    }

    public boolean isDevLoginEnabled() {
        return !isGoogleEnabled();
    }

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        if (!isGoogleEnabled()) {
            ClientRegistration placeholder = ClientRegistration
                    .withRegistrationId("google-disabled")
                    .clientId("disabled")
                    .clientSecret("disabled")
                    .authorizationUri("https://example.invalid/auth")
                    .tokenUri("https://example.invalid/token")
                    .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                    .build();
            return new InMemoryClientRegistrationRepository(placeholder);
        }
        ClientRegistration google = ClientRegistrations.fromOidcIssuerLocation("https://accounts.google.com")
                .registrationId("google")
                .clientId(googleClientId)
                .clientSecret(googleClientSecret)
                .scope("openid", "profile", "email")
                .redirectUri(googleRedirectUri)
                .build();
        return new InMemoryClientRegistrationRepository(google);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/api/images/**",
                                "/graphiql",
                                "/error"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((req, res, authentication) -> res.setStatus(HttpServletResponse.SC_NO_CONTENT))
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        if (isGoogleEnabled()) {
            http.oauth2Login(oauth -> oauth
                    .defaultSuccessUrl(frontendUrl, true)
                    .failureUrl(frontendUrl + "/login?error=oauth")
            );
        }

        return http.build();
    }

    UrlBasedCorsConfigurationSource corsSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
