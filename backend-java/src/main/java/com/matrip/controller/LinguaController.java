package com.matrip.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/admin/idiomas")
@CrossOrigin(origins = "*")
public class LinguaController {

    private static final List<Map<String, Object>> idiomas = new CopyOnWriteArrayList<>();
    private static int nextId = 1;

    static {
        // Pre-popula os idiomas padrão
        Map<String, Object> ptBr = new HashMap<>();
        ptBr.put("id", nextId++);
        ptBr.put("ma03nome", "Português (BR)");
        ptBr.put("flag", "br");
        idiomas.add(ptBr);

        Map<String, Object> en = new HashMap<>();
        en.put("id", nextId++);
        en.put("ma03nome", "Inglês");
        en.put("flag", "us");
        idiomas.add(en);

        Map<String, Object> ptPt = new HashMap<>();
        ptPt.put("id", nextId++);
        ptPt.put("ma03nome", "Português (PT)");
        ptPt.put("flag", "pt");
        idiomas.add(ptPt);
    }

    // ==============================
    // LISTAR IDIOMAS
    // ==============================
    @GetMapping
    public ResponseEntity<?> listarIdiomas() {
        return ResponseEntity.ok(idiomas);
    }

    // ==============================
    // CADASTRAR IDIOMA
    // ==============================
    @PostMapping
    public ResponseEntity<?> cadastrarIdioma(@RequestBody Map<String, String> body) {
        String nome = body.get("ma03nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome do idioma é obrigatório"));
        }

        Map<String, Object> novo = new HashMap<>();
        novo.put("id", nextId++);
        novo.put("ma03nome", nome.trim());
        novo.put("flag", "globe"); // default flag fallback
        idiomas.add(novo);

        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    // ==============================
    // ATUALIZAR IDIOMA
    // ==============================
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarIdioma(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String nome = body.get("ma03nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome do idioma é obrigatório"));
        }

        for (Map<String, Object> idioma : idiomas) {
            if (Objects.equals(idioma.get("id"), id)) {
                idioma.put("ma03nome", nome.trim());
                return ResponseEntity.ok(idioma);
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Idioma não encontrado"));
    }

    // ==============================
    // EXCLUIR IDIOMA
    // ==============================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirIdioma(@PathVariable Integer id) {
        boolean removido = idiomas.removeIf(idioma -> Objects.equals(idioma.get("id"), id));
        if (removido) {
            return ResponseEntity.ok(Map.of("message", "Idioma removido com sucesso"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Idioma não encontrado"));
    }
}
