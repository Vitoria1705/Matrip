package com.matrip.controller;

import com.matrip.entity.*;
import com.matrip.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class GuiaController {

    @Autowired
    private GuiaRepository guiaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ==============================
    // ADMIN - LISTAR GUIAS
    // ==============================
    @GetMapping("/admin/guias")
    public ResponseEntity<?> listarGuias() {
        List<Guia> guias = guiaRepository.findAll();
        // Ordena por nome do usuário de forma case-insensitive
        guias.sort((g1, g2) -> {
            String n1 = g1.getUsuario() != null ? g1.getUsuario().getNome() : "";
            String n2 = g2.getUsuario() != null ? g2.getUsuario().getNome() : "";
            return n1.compareToIgnoreCase(n2);
        });

        List<Map<String, Object>> response = new ArrayList<>();
        for (Guia g : guias) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("nome", g.getUsuario() != null ? g.getUsuario().getNome() : null);
            map.put("email", g.getEmail());
            map.put("mei", g.getMei());
            map.put("celular", g.getCelular());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    // ==============================
    // ADMIN - DELETAR GUIA
    // ==============================
    @DeleteMapping("/admin/guias/{id}")
    public ResponseEntity<?> deletarGuia(@PathVariable Integer id) {
        Optional<Guia> optGuia = guiaRepository.findById(id);
        if (optGuia.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Guia não encontrado"));
        }

        try {
            guiaRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Guia removido com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao remover guia: " + e.getMessage()));
        }
    }

    // ==============================
    // CADASTRAR GUIA (VÍNCULO)
    // ==============================
    @PostMapping("/guias")
    public ResponseEntity<?> cadastrarGuia(@RequestBody GuiaRequest req) {
        if (req.getUsuarioId() == null || req.getMei() == null || req.getCelular() == null || req.getEmail() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        // 1. Verifica se já existe guia com esse usuario_id
        Optional<Guia> existente = guiaRepository.findByUsuarioId(req.getUsuarioId());
        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Este usuário já está cadastrado como guia"));
        }

        Optional<Usuario> optUsuario = usuarioRepository.findById(req.getUsuarioId());
        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuário não encontrado"));
        }

        try {
            Guia guia = new Guia();
            guia.setUsuario(optUsuario.get());
            guia.setMei(req.getMei().trim());
            guia.setCelular(req.getCelular().trim());
            guia.setEmail(req.getEmail().trim());

            guiaRepository.save(guia);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Guia cadastrado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao cadastrar guia: " + e.getMessage()));
        }
    }

    public static class GuiaRequest {
        private Integer usuarioId;
        private String mei;
        private String celular;
        private String email;

        // Getters and Setters
        public Integer getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

        public String getMei() { return mei; }
        public void setMei(String mei) { this.mei = mei; }

        public String getCelular() { return celular; }
        public void setCelular(String celular) { this.celular = celular; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
