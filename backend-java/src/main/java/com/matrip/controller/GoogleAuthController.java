package com.matrip.controller;

import com.matrip.entity.Usuario;
import com.matrip.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.Map;

/**
 * Login com Google real: recebe o token (ID token JWT) que o próprio Google
 * gera no navegador do usuário e confirma a autenticidade dele diretamente
 * com o servidor do Google (endpoint oficial tokeninfo), sem confiar em
 * nada que venha só do frontend.
 */
@RestController
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${google.client-id:REPLACE_WITH_YOUR_CLIENT_ID}")
    private String googleClientId;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/auth/google")
    public ResponseEntity<?> loginComGoogle(@RequestBody Map<String, String> body) {
        String credential = body.get("credential");
        if (credential == null || credential.isBlank()) {
            return erro(HttpStatus.BAD_REQUEST, "Token do Google não informado.");
        }

        Map<String, Object> tokenInfo;
        try {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + credential;
            tokenInfo = restTemplate.getForObject(url, Map.class);
        } catch (RestClientException e) {
            return erro(HttpStatus.UNAUTHORIZED, "Não foi possível validar o token com o Google.");
        }

        if (tokenInfo == null) {
            return erro(HttpStatus.UNAUTHORIZED, "Token do Google inválido.");
        }

        String aud = String.valueOf(tokenInfo.get("aud"));
        if (!googleClientId.equals(aud)) {
            return erro(HttpStatus.UNAUTHORIZED, "Token não pertence a este aplicativo.");
        }

        String emailVerified = String.valueOf(tokenInfo.get("email_verified"));
        if (!"true".equals(emailVerified)) {
            return erro(HttpStatus.UNAUTHORIZED, "E-mail do Google não verificado.");
        }

        String email = (String) tokenInfo.get("email");

        var usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return erro(HttpStatus.NOT_FOUND,
                    "Nenhum acesso encontrado para este e-mail. Peça para um administrador te cadastrar primeiro.");
        }

        Usuario usuario = usuarioOpt.get();

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("id", usuario.getId());
        resposta.put("nome", usuario.getNome());
        resposta.put("email", usuario.getEmail());
        resposta.put("tipo", usuario.getTipo());

        return ResponseEntity.ok(resposta);
    }

    private ResponseEntity<?> erro(HttpStatus status, String mensagem) {
        Map<String, String> body = new HashMap<>();
        body.put("error", mensagem);
        return ResponseEntity.status(status).body(body);
    }
}