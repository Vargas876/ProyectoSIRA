package com.uptc.sira.casosespeciales.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "admin123";
        String hash = encoder.encode(password);
        
        System.out.println("==============================================");
        System.out.println("Password: " + password);
        System.out.println("Hash BCrypt:");
        System.out.println(hash);
        System.out.println("==============================================");
        System.out.println("\nSQL para actualizar:");
        System.out.println("UPDATE usuarios SET password_hash = '" + hash + "' WHERE codigo_usuario = 'admin001';");
        System.out.println("COMMIT;");
    }
}
