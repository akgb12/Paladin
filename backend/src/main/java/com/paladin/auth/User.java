package com.paladin.auth;

public class User {

    private String id;
    private String email;
    private String name;
    private String pictureUrl;
    private String provider;

    public User() {}

    public User(String id, String email, String name, String pictureUrl, String provider) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.pictureUrl = pictureUrl;
        this.provider = provider;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPictureUrl() { return pictureUrl; }
    public void setPictureUrl(String pictureUrl) { this.pictureUrl = pictureUrl; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
}
