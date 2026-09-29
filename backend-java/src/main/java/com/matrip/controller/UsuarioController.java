package com.matrip.controller;

import com.matrip.entity.Usuario;
import com.matrip.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ==============================
    // LISTAR USUÁRIOS
    // ==============================
    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Usuario u : usuarios) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("nome", u.getNome());
            map.put("email", u.getEmail());
            map.put("tipo", u.getTipo());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    // ==============================
    // CADASTRAR USUÁRIO
    // ==============================
    @PostMapping("/usuarios")
    public ResponseEntity<?> cadastrarUsuario(@RequestBody CadastroRequest req) {
        if (req.getNome() == null || req.getEmail() == null || req.getSenha() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        Optional<Usuario> existente = usuarioRepository.findByEmail(req.getEmail());
        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "E-mail já cadastrado"));
        }

        try {
            String senhaHash = passwordEncoder.encode(req.getSenha());
            Usuario usuario = new Usuario(req.getNome(), req.getEmail(), senhaHash, "usuario");
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(Map.of("message", "Usuário cadastrado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao cadastrar usuário"));
        }
    }

    // ==============================
    // LOGIN
    // ==============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(req.getEmail());
        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "E-mail ou senha inválidos"));
        }

        Usuario usuario = optUsuario.get();
        if (usuario.getSenha() == null || !passwordEncoder.matches(req.getPassword(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "E-mail ou senha inválidos"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", usuario.getId());
        response.put("nome", usuario.getNome());
        response.put("email", usuario.getEmail());
        response.put("tipo", usuario.getTipo());
        if ("admin".equalsIgnoreCase(usuario.getTipo())) {
            response.put("redirectUrl", "/paginas/admin/index.html");
        }

        return ResponseEntity.ok(response);
    }

    // ==============================
    // ADMIN - LISTAR USUÁRIOS
    // ==============================
    @GetMapping("/admin/usuarios")
    public ResponseEntity<?> listarUsuariosAdmin() {
        List<Usuario> usuarios = usuarioRepository.findByTipoNot("admin");
        List<Map<String, Object>> response = new ArrayList<>();
        for (Usuario u : usuarios) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("nome", u.getNome());
            map.put("email", u.getEmail());
            map.put("tipo", u.getTipo());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    // ==============================
    // ADMIN - ALTERAR TIPO
    // ==============================
    @PutMapping("/admin/usuarios/{id}/tipo")
    public ResponseEntity<?> alterarTipoUsuario(@PathVariable Integer id, @RequestBody TipoRequest req) {
        String tipo = req.getTipo();
        if (tipo == null || (!tipo.equals("admin") && !tipo.equals("usuario") && !tipo.equals("guia"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tipo inválido"));
        }

        Optional<Usuario> optUsuario = usuarioRepository.findById(id);
        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuário não encontrado"));
        }

        Usuario usuario = optUsuario.get();
        usuario.setTipo(tipo);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("message", "Tipo atualizado com sucesso"));
    }

    // DTOs auxiliares
    public static class CadastroRequest {
        private String nome;
        private String email;
        private String senha;

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    public static class LoginRequest {
        private String email;
        private String password; // note: 'password' matches JS frontend request parameter

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class TipoRequest {
        private String tipo;

        public String getTipo() { return tipo; }
        public void setTipo(String tipo) { this.tipo = tipo; }
    }
}
