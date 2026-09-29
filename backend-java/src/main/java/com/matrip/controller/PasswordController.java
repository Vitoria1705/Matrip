package com.matrip.controller;

import com.matrip.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class PasswordController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ==============================
    // RECUPERAR SENHA (SIMULAÇÃO)
    // ==============================
    @PostMapping("/api/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody EmailRequest req) {
        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-mail é obrigatório"));
        }

        String email = req.getEmail().trim();
        System.out.println("Solicitação de recuperação de senha recebida para: " + email);

        // Opcional: verifica se o usuário existe para registrar no log do servidor
        boolean existe = usuarioRepository.findByEmail(email).isPresent();
        if (existe) {
            System.out.println("Usuário encontrado! [SIMULAÇÃO] Enviando link de recuperação para: " + email);
        } else {
            System.out.println("E-mail não cadastrado no banco: " + email);
        }

        // Retorna sucesso de qualquer forma por motivos de segurança (para evitar enumeração de e-mails válidos)
        return ResponseEntity.ok(Map.of("message", "E-mail enviado com sucesso."));
    }

    public static class EmailRequest {
        private String email;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
