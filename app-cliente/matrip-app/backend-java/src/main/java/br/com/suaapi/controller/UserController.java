package br.com.suaapi.controller;

import br.com.suaapi.dto.UserProfileResponse;
import br.com.suaapi.model.Usuario;
import br.com.suaapi.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import br.com.suaapi.dto.UpdateEmailRequest;
import br.com.suaapi.dto.UpdatePhoneRequest;
import br.com.suaapi.dto.UpdatePasswordRequest;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        // Pega o e-mail do usuário logado através do token JWT que passou pelo filtro
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Usuario user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .nome(user.getNome())
                .email(user.getEmail())
                .cpf(user.getCpf())
                .contato(user.getContato())
                .tipo(user.getTipo())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestBody UpdateEmailRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (repository.existsByEmail(request.getNewEmail()) && !user.getEmail().equals(request.getNewEmail())) {
            return ResponseEntity.badRequest().body("E-mail já está em uso por outra conta.");
        }

        user.setEmail(request.getNewEmail());
        repository.save(user);
        return ResponseEntity.ok(Map.of("message", "E-mail atualizado com sucesso."));
    }

    @PutMapping("/update-phone")
    public ResponseEntity<?> updatePhone(@RequestBody UpdatePhoneRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        user.setContato(request.getNewPhone());
        repository.save(user);
        return ResponseEntity.ok(Map.of("message", "Telefone atualizado com sucesso."));
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        user.setSenha(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);
        return ResponseEntity.ok(Map.of("message", "Senha atualizada com sucesso."));
    }
}
