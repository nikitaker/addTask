package com.example.spring.server.utils;

public final class Constants {

    private Constants() {
        // restrict instantiation
    }

    public static final String SESSION_COOKIE_NAME = "_sid";
    public static final String JWT_SECRET = "SecretKeyToGenJWTs";
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final int COOKIE_EXPIRATION_TIME = 1800000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String LOG_IN_PAGE_URL = "/signin";
    public static final String REGISTER_URL = "/auth/register";
    public static final String LOG_IN_URL = "/auth/login";
    public static final String LOG_OUT_URL = "/auth/logout";
}
