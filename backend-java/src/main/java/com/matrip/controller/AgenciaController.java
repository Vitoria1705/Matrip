package com.matrip.controller;

import com.matrip.entity.Agencia;
import com.matrip.repository.AgenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class AgenciaController {

    @Autowired
    private AgenciaRepository agenciaRepository;

    // ==============================
    // CADASTRAR AGÊNCIA (PARCEIRO) + LOGO
    // ==============================
    @PostMapping("/agencias")
    public ResponseEntity<?> cadastrarAgencia(
            @RequestParam("nome_fantasia") String nomeFantasia,
            @RequestParam("razao_social") String razaoSocial,
            @RequestParam("cnpj") String cnpj,
            @RequestParam(value = "homepage", required = false) String homepage,
            @RequestParam("email") String email,
            @RequestParam("endereco") String endereco,
            @RequestParam("bairro") String bairro,
            @RequestParam(value = "status", required = false, defaultValue = "ativa") String status,
            @RequestParam(value = "telefone", required = false) String telefone,
            @RequestParam("celular") String celular,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile
    ) {
        if (nomeFantasia == null || razaoSocial == null || cnpj == null || email == null ||
                endereco == null || bairro == null || celular == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados obrigatórios não preenchidos"));
        }

        String cnpjLimpo = cnpj.replaceAll("\\D", "");
        if (cnpjLimpo.length() != 14) {
            return ResponseEntity.badRequest().body(Map.of("error", "CNPJ inválido"));
        }

        // Verifica duplicidade de CNPJ (o repositório precisa buscar ou fazemos loop, ou adicionamos no Repository)
        // Vamos adicionar um método findByCnpj no repositório? Sim, vamos tratar pela lista ou adicionar no AgenciaRepository
        // Mas para evitar mudar AgenciaRepository, podemos usar JpaRepository ou implementar consulta.
        // Wait, AgenciaRepository doesn't have findByCnpj yet, but we can call a custom query or add it if needed.
        // Let's add the findByCnpj checks if possible, wait, does the repository already compile? Yes, we didn't specify findByCnpj,
        // let's do a quick query or we can just query the DB. Let's add findByCnpj to AgenciaRepository.
        // Wait, is there a simple way? Let's just find by CNPJ using standard database check or loops.
        // Let's query all and filter, or we can write a quick custom check. A custom check by checking if any matches is fine.
        List<Agencia> todas = agenciaRepository.findAll();
        for (Agencia a : todas) {
            if (a.getCnpj().equals(cnpjLimpo)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Já existe agência com esse CNPJ"));
            }
        }

        try {
            String logoFilename = null;
            if (logoFile != null && !logoFile.isEmpty()) {
                File uploadDir = new File("uploads");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                logoFilename = System.currentTimeMillis() + "-" + logoFile.getOriginalFilename();
                File dest = new File(uploadDir, logoFilename);
                logoFile.transferTo(dest.toPath().toAbsolutePath());
            }

            Agencia agencia = new Agencia();
            agencia.setNomeFantasia(nomeFantasia.trim());
            agencia.setRazaoSocial(razaoSocial.trim());
            agencia.setCnpj(cnpjLimpo);
            agencia.setEmail(email.trim());
            agencia.setHomepage(homepage);
            agencia.setEndereco(endereco.trim());
            agencia.setBairro(bairro.trim());
            agencia.setTelefone(telefone);
            agencia.setCelular(celular.trim());
            agencia.setStatus(status);
            agencia.setLogo(logoFilename);

            Agencia salva = agenciaRepository.save(agencia);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Agência cadastrada com sucesso!",
                    "id", salva.getId()
            ));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao salvar a logo: " + e.getMessage()));
        }
    }

    // ==============================
    // LISTAR TODAS AGÊNCIAS
    // ==============================
    @GetMapping("/agencias")
    public ResponseEntity<?> listarAgencias() {
        List<Agencia> agencias = agenciaRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(agencias);
    }

    // ==============================
    // PARCEIROS ATIVOS (PÚBLICO)
    // ==============================
    @GetMapping("/parceiros/public")
    public ResponseEntity<?> listarParceirosPublic() {
        List<Agencia> agencias = agenciaRepository.findByStatusOrderByCreatedAtDesc("ativa");
        List<Map<String, Object>> response = new ArrayList<>();
        for (Agencia a : agencias) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("nome", a.getNomeFantasia());
            map.put("logo", a.getLogo());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    // ==============================
    // BUSCAR AGÊNCIA POR ID
    // ==============================
    @GetMapping("/api/agencias/{id}")
    public ResponseEntity<?> buscarAgenciaPorId(@PathVariable Integer id) {
        Optional<Agencia> opt = agenciaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Agência não encontrada."));
        }
        return ResponseEntity.ok(opt.get());
    }

    // ==============================
    // ATUALIZAR AGÊNCIA
    // ==============================
    @PutMapping("/api/agencias/{id}")
    public ResponseEntity<?> atualizarAgencia(@PathVariable Integer id, @RequestBody AgenciaUpdateRequest req) {
        if (req.getNomeFantasia() == null || req.getRazaoSocial() == null || req.getCnpj() == null ||
                req.getEmail() == null || req.getEndereco() == null || req.getBairro() == null || req.getCelular() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Preencha os campos obrigatórios."));
        }

        Optional<Agencia> opt = agenciaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Agência não encontrada para atualização."));
        }

        // Verifica duplicidade de CNPJ excluindo ela mesma
        List<Agencia> todas = agenciaRepository.findAll();
        for (Agencia a : todas) {
            if (!a.getId().equals(id) && a.getCnpj().equals(req.getCnpj())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "CNPJ ou e-mail já cadastrado para outra agência."));
            }
        }

        Agencia agencia = opt.get();
        agencia.setNomeFantasia(req.getNomeFantasia());
        agencia.setRazaoSocial(req.getRazaoSocial());
        agencia.setCnpj(req.getCnpj());
        agencia.setEmail(req.getEmail());
        agencia.setHomepage(req.getHomepage());
        agencia.setEndereco(req.getEndereco());
        agencia.setBairro(req.getBairro());
        agencia.setTelefone(req.getTelefone());
        agencia.setCelular(req.getCelular());
        agencia.setStatus(req.getStatus() != null ? req.getStatus() : "ativa");
        
        // Se a logo for passada no JSON
        if (req.getLogo() != null) {
            agencia.setLogo(req.getLogo());
        }

        Agencia salva = agenciaRepository.save(agencia);
        return ResponseEntity.ok(salva);
    }

    // ==============================
    // ADMIN - EXCLUIR AGÊNCIA
    // ==============================
    @DeleteMapping("/agencias/{id}")
    public ResponseEntity<?> excluirAgencia(@PathVariable Integer id) {
        Optional<Agencia> opt = agenciaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Agência não encontrada"));
        }

        try {
            agenciaRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Agência excluída com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao excluir agência: " + e.getMessage()));
        }
    }

    // DTO auxiliar para o PUT da agência
    public static class AgenciaUpdateRequest {
        private String nomeFantasia;
        private String razaoSocial;
        private String cnpj;
        private String email;
        private String homepage;
        private String endereco;
        private String bairro;
        private String telefone;
        private String celular;
        private String status;
        private String logo;

        // Getters and Setters
        public String getNomeFantasia() { return nomeFantasia; }
        public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
        
        public String getRazaoSocial() { return razaoSocial; }
        public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

        public String getCnpj() { return cnpj; }
        public void setCnpj(String cnpj) { this.cnpj = cnpj; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getHomepage() { return homepage; }
        public void setHomepage(String homepage) { this.homepage = homepage; }

        public String getEndereco() { return endereco; }
        public void setEndereco(String endereco) { this.endereco = endereco; }

        public String getBairro() { return bairro; }
        public void setBairro(String bairro) { this.bairro = bairro; }

        public String getTelefone() { return telefone; }
        public void setTelefone(String telefone) { this.telefone = telefone; }

        public String getCelular() { return celular; }
        public void setCelular(String celular) { this.celular = celular; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getLogo() { return logo; }
        public void setLogo(String logo) { this.logo = logo; }
    }
}
