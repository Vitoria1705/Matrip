package br.com.suaapi.service;

import br.com.suaapi.dto.AuthRequest;
import br.com.suaapi.dto.AuthResponse;
import br.com.suaapi.dto.RegisterRequest;
import br.com.suaapi.model.Usuario;
import br.com.suaapi.repository.UsuarioRepository;
import br.com.suaapi.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${google.client.id:YOUR_WEB_CLIENT_ID}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já está em uso.");
        }
        if (request.getCpf() != null && !request.getCpf().isEmpty() && repository.existsByCpf(request.getCpf())) {
            throw new RuntimeException("CPF já está em uso.");
        }

        var user = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .cpf(request.getCpf())
                .contato(request.getContato())
                .senha(passwordEncoder.encode(request.getSenha()))
                .tipo("usuario")
                .build();
        
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .nome(user.getNome())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );
        
        var user = repository.findByEmail(request.getEmail())
                .orElseGet(() -> repository.findByCpf(request.getEmail()).orElseThrow());
        
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .nome(user.getNome())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<Usuario> userOptional = repository.findByEmail(email);
                Usuario user;
                if (userOptional.isPresent()) {
                    user = userOptional.get();
                } else {
                    // Create new user
                    user = Usuario.builder()
                            .nome(name != null ? name : "Usuário Google")
                            .email(email)
                            .senha(passwordEncoder.encode("GOOGLE_LOGIN_" + System.currentTimeMillis()))
                            .tipo("usuario")
                            .build();
                    repository.save(user);
                }

                String jwtToken = jwtService.generateToken(user);

                return AuthResponse.builder()
                        .token(jwtToken)
                        .nome(user.getNome())
                        .email(user.getEmail())
                        .build();
            } else {
                throw new RuntimeException("Token do Google inválido");
            }
        } catch (Exception e) {
            throw new RuntimeException("Falha na autenticação com o Google: " + e.getMessage());
        }
    }
}
