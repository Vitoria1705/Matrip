package com.matrip.controller;

import com.matrip.entity.*;
import com.matrip.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private GuiaRepository guiaRepository;

    @Autowired
    private PasseioRepository passeioRepository;

    // ==============================
    // LISTAR SERVIÇOS
    // ==============================
    @GetMapping("/servicos")
    public ResponseEntity<?> listarServicos() {
        List<Servico> servicos = servicoRepository.findAllByOrderByCriadoEmDescIdDesc();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Servico s : servicos) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            // IMPORTANTE: Retorna o ID de usuário do guia para bater com o currentUser.id do frontend
            map.put("guia_id", s.getGuia() != null && s.getGuia().getUsuario() != null ? s.getGuia().getUsuario().getId() : null);
            map.put("passeio_id", s.getPasseio() != null ? s.getPasseio().getId() : null);
            map.put("nome", s.getNome());
            map.put("descricao", s.getDescricao());
            map.put("valor", s.getValor());
            map.put("status", s.getStatus());
            map.put("foto", s.getFoto());
            map.put("criado_em", s.getCriadoEm());
            response.add(map);
        }
        
        return ResponseEntity.ok(response);
    }

    // ==============================
    // CADASTRAR SERVIÇO
    // ==============================
    @PostMapping("/servicos")
    public ResponseEntity<?> cadastrarServico(@RequestBody ServicoRequest req) {
        if (req.getGuiaId() == null || req.getPasseioId() == null || req.getNome() == null ||
                req.getDescricao() == null || req.getValor() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados obrigatórios não preenchidos"));
        }

        // O guia_id vindo do front é o ID do Usuário (usuarios.id). Precisamos achar o registro correspondente em guias.
        Optional<Guia> optGuia = guiaRepository.findByUsuarioId(req.getGuiaId());
        if (optGuia.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Guia não encontrado para o usuário informado"));
        }

        Optional<Passeio> optPasseio = passeioRepository.findById(req.getPasseioId());
        if (optPasseio.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passeio não encontrado"));
        }

        try {
            Servico servico = new Servico();
            servico.setGuia(optGuia.get());
            servico.setPasseio(optPasseio.get());
            servico.setNome(req.getNome().trim());
            servico.setDescricao(req.getDescricao().trim());
            servico.setValor(req.getValor());
            servico.setStatus(req.getStatus() != null ? req.getStatus() : "ativo");
            servico.setFoto(req.getFoto());

            Servico salvo = servicoRepository.save(servico);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Serviço cadastrado com sucesso",
                    "id", salvo.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao cadastrar serviço: " + e.getMessage()));
        }
    }

    public static class ServicoRequest {
        private Integer guiaId; // Representa o usuario_id do guia
        private Integer passeioId;
        private String nome;
        private String descricao;
        private BigDecimal valor;
        private String status;
        private String foto;

        // Getters and Setters
        public Integer getGuiaId() { return guiaId; }
        public void setGuiaId(Integer guiaId) { this.guiaId = guiaId; }

        public Integer getPasseioId() { return passeioId; }
        public void setPasseioId(Integer passeioId) { this.passeioId = passeioId; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }

        public BigDecimal getValor() { return valor; }
        public void setValor(BigDecimal valor) { this.valor = valor; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getFoto() { return foto; }
        public void setFoto(String foto) { this.foto = foto; }
    }
}
