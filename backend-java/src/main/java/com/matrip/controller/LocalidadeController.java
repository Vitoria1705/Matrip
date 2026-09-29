package com.matrip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/localidades")
@CrossOrigin(origins = "*")
public class LocalidadeController {

    private static final List<Map<String, Object>> paises = new CopyOnWriteArrayList<>();
    private static final List<Map<String, Object>> ufs = new CopyOnWriteArrayList<>();
    private static final List<Map<String, Object>> cidades = new CopyOnWriteArrayList<>();
    private static int nextPaisId = 1;
    private static int nextUfId = 1;
    private static int nextCidadeId = 1;

    static {
        // Inicializar dados padrão
        Map<String, Object> brasil = new HashMap<>();
        brasil.put("id", nextPaisId++);
        brasil.put("nome", "Brasil");
        brasil.put("status", "ativo");
        paises.add(brasil);

        Map<String, Object> ma = new HashMap<>();
        ma.put("id", nextUfId++);
        ma.put("nome", "Maranhão");
        ma.put("sigla", "MA");
        ma.put("paisId", 1);
        ma.put("status", "ativo");
        ufs.add(ma);

        Map<String, Object> sl = new HashMap<>();
        sl.put("id", nextCidadeId++);
        sl.put("nome", "São Luís");
        sl.put("ufId", 1);
        sl.put("status", "ativo");
        cidades.add(sl);

        Map<String, Object> ba = new HashMap<>();
        ba.put("id", nextCidadeId++);
        ba.put("nome", "Barreirinhas");
        ba.put("ufId", 1);
        ba.put("status", "ativo");
        cidades.add(ba);
    }

    @GetMapping("/paises")
    public ResponseEntity<?> getPaises() {
        return ResponseEntity.ok(paises);
    }

    @PostMapping("/paises")
    public ResponseEntity<?> addPais(@RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome do país é obrigatório"));
        }
        Map<String, Object> p = new HashMap<>();
        p.put("id", nextPaisId++);
        p.put("nome", nome.trim());
        p.put("status", "ativo");
        paises.add(p);
        return ResponseEntity.ok(p);
    }

    @GetMapping("/ufs/{paisId}")
    public ResponseEntity<?> getUfs(@PathVariable Integer paisId) {
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> uf : ufs) {
            if (Objects.equals(uf.get("paisId"), paisId)) {
                filtered.add(uf);
            }
        }
        return ResponseEntity.ok(filtered);
    }

    @PostMapping("/ufs")
    public ResponseEntity<?> addUf(@RequestBody Map<String, Object> body) {
        String nome = (String) body.get("nome");
        String sigla = (String) body.get("sigla");
        Integer paisId = null;
        if (body.get("paisId") instanceof Number) {
            paisId = ((Number) body.get("paisId")).intValue();
        } else if (body.get("paisId") instanceof String) {
            paisId = Integer.parseInt((String) body.get("paisId"));
        }

        if (nome == null || nome.trim().isEmpty() || sigla == null || sigla.trim().isEmpty() || paisId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        Map<String, Object> uf = new HashMap<>();
        uf.put("id", nextUfId++);
        uf.put("nome", nome.trim());
        uf.put("sigla", sigla.trim().toUpperCase());
        uf.put("paisId", paisId);
        uf.put("status", "ativo");
        ufs.add(uf);
        return ResponseEntity.ok(uf);
    }

    @GetMapping("/cidades/{ufId}")
    public ResponseEntity<?> getCidades(@PathVariable Integer ufId) {
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> c : cidades) {
            if (Objects.equals(c.get("ufId"), ufId)) {
                filtered.add(c);
            }
        }
        return ResponseEntity.ok(filtered);
    }

    @PostMapping("/cidades")
    public ResponseEntity<?> addCidade(@RequestBody Map<String, Object> body) {
        String nome = (String) body.get("nome");
        Integer ufId = null;
        if (body.get("ufId") instanceof Number) {
            ufId = ((Number) body.get("ufId")).intValue();
        } else if (body.get("ufId") instanceof String) {
            ufId = Integer.parseInt((String) body.get("ufId"));
        }

        if (nome == null || nome.trim().isEmpty() || ufId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        Map<String, Object> c = new HashMap<>();
        c.put("id", nextCidadeId++);
        c.put("nome", nome.trim());
        c.put("ufId", ufId);
        c.put("status", "ativo");
        cidades.add(c);
        return ResponseEntity.ok(c);
    }

    // ==============================
    // EDITAR PAÍS
    // ==============================
    @PutMapping("/paises/{id}")
    public ResponseEntity<?> updatePais(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome do país é obrigatório"));
        }
        for (Map<String, Object> p : paises) {
            if (Objects.equals(p.get("id"), id)) {
                p.put("nome", nome.trim());
                return ResponseEntity.ok(p);
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "País não encontrado"));
    }

    // ==============================
    // BLOQUEAR PAÍS
    // ==============================
    @PutMapping("/paises/{id}/bloquear")
    public ResponseEntity<?> togglePaisStatus(@PathVariable Integer id) {
        for (Map<String, Object> p : paises) {
            if (Objects.equals(p.get("id"), id)) {
                String currentStatus = (String) p.getOrDefault("status", "ativo");
                String newStatus = "ativo".equalsIgnoreCase(currentStatus) ? "bloqueado" : "ativo";
                p.put("status", newStatus);
                return ResponseEntity.ok(p);
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "País não encontrado"));
    }

    // ==============================
    // EDITAR ESTADO (UF)
    // ==============================
    @PutMapping("/ufs/{id}")
    public ResponseEntity<?> updateUf(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        String nome = (String) body.get("nome");
        String sigla = (String) body.get("sigla");
        if (nome == null || nome.trim().isEmpty() || sigla == null || sigla.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }
        for (Map<String, Object> uf : ufs) {
            if (Objects.equals(uf.get("id"), id)) {
                uf.put("nome", nome.trim());
                uf.put("sigla", sigla.trim().toUpperCase());
                return ResponseEntity.ok(uf);
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "Estado não encontrado"));
    }

    // ==============================
    // BLOQUEAR ESTADO (UF)
    // ==============================
    @PutMapping("/ufs/{id}/bloquear")
    public ResponseEntity<?> toggleUfStatus(@PathVariable Integer id) {
        for (Map<String, Object> uf : ufs) {
            if (Objects.equals(uf.get("id"), id)) {
                String currentStatus = (String) uf.getOrDefault("status", "ativo");
                String newStatus = "ativo".equalsIgnoreCase(currentStatus) ? "bloqueado" : "ativo";
                uf.put("status", newStatus);
                return ResponseEntity.ok(uf);
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "Estado não encontrado"));
    }

    // ==============================
    // EDITAR CIDADE
    // ==============================
    @PutMapping("/cidades/{id}")
    public ResponseEntity<?> updateCidade(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        String nome = (String) body.get("nome");
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome da cidade é obrigatório"));
        }
        for (Map<String, Object> c : cidades) {
            if (Objects.equals(c.get("id"), id)) {
                c.put("nome", nome.trim());
                return ResponseEntity.ok(c);
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "Cidade não encontrada"));
    }

    // ==============================
    // BLOQUEAR CIDADE
    // ==============================
    @PutMapping("/cidades/{id}/bloquear")
    public ResponseEntity<?> toggleCidadeStatus(@PathVariable Integer id) {
        for (Map<String, Object> c : cidades) {
            if (Objects.equals(c.get("id"), id)) {
                String currentStatus = (String) c.getOrDefault("status", "ativo");
                String newStatus = "ativo".equalsIgnoreCase(currentStatus) ? "bloqueado" : "ativo";
                c.put("status", newStatus);
                return ResponseEntity.ok(c);
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "Cidade não encontrada"));
    }
}
