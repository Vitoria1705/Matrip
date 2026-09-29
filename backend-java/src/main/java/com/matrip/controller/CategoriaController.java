package com.matrip.controller;

import com.matrip.entity.Categoria;
import com.matrip.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // ==============================
    // LISTAR CATEGORIAS
    // ==============================
    @GetMapping("/categorias")
    public ResponseEntity<?> listarCategorias() {
        List<Categoria> categorias = categoriaRepository.findAllByOrderByNomeAsc();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Categoria c : categorias) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("nome", c.getNome());
            map.put("status", c.getStatus());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    // ==============================
    // CRIAR CATEGORIA
    // ==============================
    @PostMapping("/categorias")
    public ResponseEntity<?> criarCategoria(@RequestBody CategoriaRequest req) {
        if (req.getNome() == null || req.getNome().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome da categoria é obrigatório"));
        }

        String nomeFormatado = req.getNome().trim().toLowerCase();

        Optional<Categoria> existente = categoriaRepository.findByNome(nomeFormatado);
        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Categoria já existe"));
        }

        try {
            Categoria categoria = new Categoria();
            categoria.setNome(nomeFormatado);
            categoriaRepository.save(categoria);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Categoria criada com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // ==============================
    // ATUALIZAR CATEGORIA
    // ==============================
    @PutMapping("/categorias/{id}")
    public ResponseEntity<?> atualizarCategoria(@PathVariable Integer id, @RequestBody CategoriaRequest req) {
        if (req.getNome() == null || req.getNome().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome da categoria é obrigatório"));
        }

        Optional<Categoria> optCategoria = categoriaRepository.findById(id);
        if (optCategoria.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Categoria não encontrada"));
        }

        String nomeFormatado = req.getNome().trim().toLowerCase();

        // Verifica se outra categoria com o mesmo nome já existe
        Optional<Categoria> existente = categoriaRepository.findByNome(nomeFormatado);
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Categoria com esse nome já existe"));
        }

        try {
            Categoria categoria = optCategoria.get();
            categoria.setNome(nomeFormatado);
            categoriaRepository.save(categoria);
            return ResponseEntity.ok(Map.of("message", "Categoria atualizada com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // ==============================
    // BLOQUEAR CATEGORIA
    // ==============================
    @PutMapping("/categorias/{id}/bloquear")
    public ResponseEntity<?> toggleCategoriaStatus(@PathVariable Integer id) {
        Optional<Categoria> optCategoria = categoriaRepository.findById(id);
        if (optCategoria.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Categoria não encontrada"));
        }
        try {
            Categoria categoria = optCategoria.get();
            String currentStatus = categoria.getStatus();
            String newStatus = "ativo".equalsIgnoreCase(currentStatus) ? "bloqueado" : "ativo";
            categoria.setStatus(newStatus);
            categoriaRepository.save(categoria);
            return ResponseEntity.ok(Map.of("id", categoria.getId(), "status", newStatus, "nome", categoria.getNome()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }


    public static class CategoriaRequest {
        private String nome;

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
    }
}
