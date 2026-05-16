package com.paladin.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {

    public static final String DEV_USER_ID = "demo";

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof OAuth2User oauthUser) {
            String sub = oauthUser.getAttribute("sub");
            String email = oauthUser.getAttribute("email");
            String name = oauthUser.getAttribute("name");
            String picture = oauthUser.getAttribute("picture");
            return new User(sub, email, name, picture, "google");
        }

        if (principal instanceof User user) {
            return user;
        }

        return null;
    }

    public String getCurrentUserId() {
        User u = getCurrentUser();
        return u != null ? u.getId() : null;
    }

    public User mockDevUser() {
        return new User(DEV_USER_ID, "dev@paladin.local", "Dev Knight", null, "dev");
    }
}
