package br.com.suaapi.controller;

import br.com.suaapi.dto.AuthRequest;
import br.com.suaapi.dto.AuthResponse;
import br.com.suaapi.dto.RegisterRequest;
import br.com.suaapi.dto.GoogleLoginRequest;
import br.com.suaapi.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(service.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        try {
            return ResponseEntity.ok(service.login(request));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            return ResponseEntity.ok(service.loginWithGoogle(request.getIdToken()));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
