package com.matrip.controller;

import com.matrip.entity.*;
import com.matrip.repository.*;
import com.matrip.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class PasseioController {

    @Autowired
    private PasseioRepository passeioRepository;

    @Autowired
    private PasseioImagemRepository passeioImagemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasseioAtracaoRepository passeioAtracaoRepository;

    // ==============================
    // CADASTRAR PASSEIO (GUIA) + IMAGENS
    // ==============================
    @PostMapping("/passeios")
    public ResponseEntity<?> cadastrarPasseio(
            @RequestParam("categoria") String categoria,
            @RequestParam("local") String local,
            @RequestParam("cidade") String cidade,
            @RequestParam("estado") String estado,
            @RequestParam("descricao") String descricao,
            @RequestParam(value = "valor_adulto", required = false) BigDecimal valorAdulto,
            @RequestParam(value = "valor_estudante", required = false) BigDecimal valorEstudante,
            @RequestParam(value = "valor_crianca", required = false) BigDecimal valorCrianca,
            @RequestParam("valor_final") BigDecimal valorFinal,
            @RequestParam("guia_id") Integer guiaId,
            @RequestParam(value = "data_passeio", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataPasseio,
            @RequestParam(value = "roteiro", required = false) String roteiro,
            @RequestParam(value = "inclui", required = false) String inclui,
            @RequestParam(value = "locais_embarque", required = false) String locaisEmbarque,
            @RequestParam(value = "horarios", required = false) String horarios,
            @RequestParam(value = "frequencia", required = false) String frequencia,
            @RequestParam(value = "classificacao", required = false) String classificacao,
            @RequestParam(value = "informacoes_importantes", required = false) String informacoesImportantes,
            @RequestParam(value = "imagens", required = false) MultipartFile[] imagens
    ) {
        if (categoria == null || local == null || cidade == null || estado == null ||
                descricao == null || valorFinal == null || guiaId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados obrigatórios não preenchidos"));
        }

        Optional<Usuario> optGuia = usuarioRepository.findById(guiaId);
        if (optGuia.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Guia não encontrado"));
        }

        try {
            Passeio passeio = new Passeio();
            passeio.setCategoria(categoria);
            passeio.setLocal(local);
            passeio.setCidade(cidade);
            passeio.setEstado(estado.trim().toUpperCase());
            passeio.setDescricao(descricao);
            passeio.setValorAdulto(valorAdulto);
            passeio.setValorEstudante(valorEstudante);
            passeio.setValorCrianca(valorCrianca);
            passeio.setValorFinal(valorFinal);
            passeio.setGuia(optGuia.get());
            passeio.setDataPasseio(dataPasseio);
            passeio.setRoteiro(roteiro);
            passeio.setInclui(inclui);
            passeio.setLocaisEmbarque(locaisEmbarque);
            passeio.setHorarios(horarios);
            passeio.setFrequencia(frequencia);
            passeio.setClassificacao(classificacao);
            passeio.setInformacoesImportantes(informacoesImportantes);

            Passeio salvo = passeioRepository.save(passeio);

            // Upload de imagens
            if (imagens != null && imagens.length > 0) {
                File uploadDir = new File("uploads");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                for (MultipartFile img : imagens) {
                    if (!img.isEmpty()) {
                        String filename = System.currentTimeMillis() + "-" + img.getOriginalFilename();
                        File dest = new File(uploadDir, filename);
                        img.transferTo(dest.toPath().toAbsolutePath());

                        PasseioImagem passeioImagem = new PasseioImagem(salvo, filename);
                        passeioImagemRepository.save(passeioImagem);
                    }
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Passeio cadastrado com sucesso!",
                    "id", salvo.getId()
            ));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao salvar as imagens: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==============================
    // LISTAR TODOS PASSEIOS (RESUMO)
    // ==============================
    @GetMapping("/passeios")
    public ResponseEntity<?> listarPasseios() {
        List<Passeio> passeios = passeioRepository.findAllByOrderByIdDesc();
        return ResponseEntity.ok(construirResumoPasseios(passeios));
    }

    // ==============================
    // LISTAR PASSEIOS DO GUIA
    // ==============================
    @GetMapping("/guias/{guiaId}/passeios")
    public ResponseEntity<?> listarPasseiosDoGuia(@PathVariable Integer guiaId) {
        List<Passeio> passeios = passeioRepository.findByGuiaIdOrderByIdDesc(guiaId);
        List<Map<String, Object>> res = new ArrayList<>();
        for (Passeio p : passeios) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("local", p.getLocal());
            map.put("cidade", p.getCidade());
            map.put("estado", p.getEstado());
            map.put("descricao", p.getDescricao());
            map.put("valor_final", p.getValorFinal());

            // Pega a primeira imagem
            List<PasseioImagem> imgs = passeioImagemRepository.findByPasseioIdOrderByIdAsc(p.getId());
            map.put("imagem", imgs.isEmpty() ? null : imgs.get(0).getCaminho());
            res.add(map);
        }
        return ResponseEntity.ok(res);
    }

    // ==============================
    // EXCLUIR PASSEIO
    // ==============================
    @DeleteMapping("/passeios/{id}")
    public ResponseEntity<?> excluirPasseio(@PathVariable Integer id) {
        Optional<Passeio> optPasseio = passeioRepository.findById(id);
        if (optPasseio.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passeio não encontrado"));
        }

        try {
            // Deleta imagens do banco
            passeioImagemRepository.deleteByPasseioId(id);
            // Deleta passeio do banco
            passeioRepository.deleteById(id);

            return ResponseEntity.ok(Map.of("message", "Passeio excluído com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao excluir passeio: " + e.getMessage()));
        }
    }

    // ==============================
    // BUSCAR PASSEIO POR ID (CRU)
    // ==============================
    @GetMapping("/passeios/{id}")
    public ResponseEntity<?> buscarPasseioPorId(@PathVariable Integer id) {
        Optional<Passeio> optPasseio = passeioRepository.findById(id);
        if (optPasseio.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passeio não encontrado"));
        }
        return ResponseEntity.ok(optPasseio.get());
    }

    // ==============================
    // DETALHES DO PASSEIO + IMAGENS
    // ==============================
    @GetMapping("/passeios/{id}/detalhes")
    public ResponseEntity<?> obterDetalhesPasseio(@PathVariable Integer id) {
        Optional<Passeio> optPasseio = passeioRepository.findById(id);
        if (optPasseio.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passeio não encontrado"));
        }

        Passeio p = optPasseio.get();
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("categoria", p.getCategoria());
        map.put("local", p.getLocal());
        map.put("cidade", p.getCidade());
        map.put("estado", p.getEstado());
        map.put("descricao", p.getDescricao());
        map.put("valor_adulto", p.getValorAdulto());
        map.put("valor_estudante", p.getValorEstudante());
        map.put("valor_crianca", p.getValorCrianca());
        map.put("valor_final", p.getValorFinal());
        map.put("data_passeio", p.getDataPasseio());
        map.put("roteiro", p.getRoteiro());
        map.put("inclui", p.getInclui());
        map.put("locais_embarque", p.getLocaisEmbarque());
        map.put("horarios", p.getHorarios());
        map.put("frequencia", p.getFrequencia());
        map.put("classificacao", p.getClassificacao());
        map.put("informacoes_importantes", p.getInformacoesImportantes());

        // Guia info
        if (p.getGuia() != null) {
            map.put("guia_id", p.getGuia().getId());
            map.put("guia_nome", p.getGuia().getNome());
        } else {
            map.put("guia_id", null);
            map.put("guia_nome", null);
        }

        // Listagem de imagens
        List<PasseioImagem> imgs = passeioImagemRepository.findByPasseioIdOrderByIdAsc(id);
        List<String> caminhos = new ArrayList<>();
        for (PasseioImagem img : imgs) {
            caminhos.add(img.getCaminho());
        }
        map.put("imagens", caminhos);

        return ResponseEntity.ok(map);
    }

    // ==============================
    // ATUALIZAR PASSEIO
    // ==============================
    @PutMapping("/passeios/{id}")
    public ResponseEntity<?> atualizarPasseio(
            @PathVariable Integer id,
            @RequestParam("categoria") String categoria,
            @RequestParam("local") String local,
            @RequestParam("cidade") String cidade,
            @RequestParam("estado") String estado,
            @RequestParam("descricao") String descricao,
            @RequestParam(value = "valor_adulto", required = false) BigDecimal valorAdulto,
            @RequestParam(value = "valor_estudante", required = false) BigDecimal valorEstudante,
            @RequestParam(value = "valor_crianca", required = false) BigDecimal valorCrianca,
            @RequestParam("valor_final") BigDecimal valorFinal,
            @RequestParam(value = "data_passeio", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataPasseio,
            @RequestParam(value = "roteiro", required = false) String roteiro,
            @RequestParam(value = "inclui", required = false) String inclui,
            @RequestParam(value = "locais_embarque", required = false) String locaisEmbarque,
            @RequestParam(value = "horarios", required = false) String horarios,
            @RequestParam(value = "frequencia", required = false) String frequencia,
            @RequestParam(value = "classificacao", required = false) String classificacao,
            @RequestParam(value = "informacoes_importantes", required = false) String informacoesImportantes,
            @RequestParam(value = "imagens", required = false) MultipartFile[] imagens
    ) {
        if (categoria == null || local == null || cidade == null || estado == null ||
                descricao == null || valorFinal == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados obrigatórios não preenchidos"));
        }

        Optional<Passeio> optPasseio = passeioRepository.findById(id);
        if (optPasseio.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passeio não encontrado"));
        }

        try {
            Passeio passeio = optPasseio.get();
            passeio.setCategoria(categoria);
            passeio.setLocal(local);
            passeio.setCidade(cidade);
            passeio.setEstado(estado.trim().toUpperCase());
            passeio.setDescricao(descricao);
            passeio.setValorAdulto(valorAdulto);
            passeio.setValorEstudante(valorEstudante);
            passeio.setValorCrianca(valorCrianca);
            passeio.setValorFinal(valorFinal);
            passeio.setDataPasseio(dataPasseio);
            passeio.setRoteiro(roteiro);
            passeio.setInclui(inclui);
            passeio.setLocaisEmbarque(locaisEmbarque);
            passeio.setHorarios(horarios);
            passeio.setFrequencia(frequencia);
            passeio.setClassificacao(classificacao);
            passeio.setInformacoesImportantes(informacoesImportantes);

            Passeio salvo = passeioRepository.save(passeio);

            // Upload de imagens adicionais
            if (imagens != null && imagens.length > 0) {
                File uploadDir = new File("uploads");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                for (MultipartFile img : imagens) {
                    if (!img.isEmpty()) {
                        String filename = System.currentTimeMillis() + "-" + img.getOriginalFilename();
                        File dest = new File(uploadDir, filename);
                        img.transferTo(dest.toPath().toAbsolutePath());

                        PasseioImagem passeioImagem = new PasseioImagem(salvo, filename);
                        passeioImagemRepository.save(passeioImagem);
                    }
                }
            }

            return ResponseEntity.ok(Map.of("message", "Passeio atualizado com sucesso!"));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao salvar as imagens: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==============================
    // HOME - PASSEIOS (INDEX)
    // ==============================
    @GetMapping("/home/passeios")
    public ResponseEntity<?> listarPasseiosHome() {
        List<Passeio> passeios = passeioRepository.findAllByOrderByCategoriaAscIdDesc();
        return ResponseEntity.ok(construirResumoPasseios(passeios));
    }

    // ==============================
    // API - FILTRAR PASSEIOS (ESTADO/CIDADE)
    // ==============================
    @GetMapping("/api/passeios")
    public ResponseEntity<?> buscarPasseiosFiltro(
            @RequestParam(value = "estado", required = false) String estado,
            @RequestParam(value = "cidade", required = false) String cidade
    ) {
        List<Passeio> passeios;
        if (estado != null && !estado.trim().isEmpty() && cidade != null && !cidade.trim().isEmpty()) {
            passeios = passeioRepository.findByEstadoAndCidade(estado.trim().toUpperCase(), cidade.trim());
        } else if (estado != null && !estado.trim().isEmpty()) {
            passeios = passeioRepository.findByEstado(estado.trim().toUpperCase());
        } else if (cidade != null && !cidade.trim().isEmpty()) {
            passeios = passeioRepository.findByCidade(cidade.trim());
        } else {
            passeios = passeioRepository.findAll();
        }

        return ResponseEntity.ok(construirResumoPasseios(passeios));
    }

    // Helper para converter lista de passeios em lista de resumos contendo a primeira imagem
    private List<Map<String, Object>> construirResumoPasseios(List<Passeio> passeios) {
        List<Map<String, Object>> res = new ArrayList<>();
        for (Passeio p : passeios) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("categoria", p.getCategoria());
            map.put("local", p.getLocal());
            map.put("cidade", p.getCidade());
            map.put("estado", p.getEstado());
            map.put("descricao", p.getDescricao());
            map.put("valor_adulto", p.getValorAdulto());
            map.put("valor_estudante", p.getValorEstudante());
            map.put("valor_crianca", p.getValorCrianca());
            map.put("valor_final", p.getValorFinal());

            // Pega a primeira imagem
            List<PasseioImagem> imgs = passeioImagemRepository.findByPasseioIdOrderByIdAsc(p.getId());
            map.put("imagem", imgs.isEmpty() ? null : imgs.get(0).getCaminho());
            res.add(map);
        }
        return res;
    }

    // ==============================
    // GET PASSEIO HISTORIAS
    // ==============================
    @GetMapping("/passeios/{id}/historias")
    public ResponseEntity<?> obterHistoriasPasseio(@PathVariable Integer id) {
        Optional<Passeio> optPasseio = passeioRepository.findById(id);
        if (optPasseio.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Passeio não encontrado"));
        }

        Passeio p = optPasseio.get();
        List<PasseioAtracao> passeioAtracoes = passeioAtracaoRepository.findPasseioAtracoesWithDetails(id);

        List<AtracaoHistoriaDTO> atracoesDTO = new ArrayList<>();
        for (PasseioAtracao pa : passeioAtracoes) {
            Atracao a = pa.getAtracao();
            Localidade l = a.getLocalidade();

            AtracaoHistoriaDTO atracaoDTO = new AtracaoHistoriaDTO(
                a.getNome(),
                a.getTipo(),
                a.getDescricao(),
                a.getHistoria(),
                a.getCuriosidades(),
                l != null ? l.getNome() : null,
                l != null ? l.getHistoria() : null,
                l != null ? l.getCuriosidades() : null,
                pa.getOrdemVisita(),
                pa.getObservacao()
            );
            atracoesDTO.add(atracaoDTO);
        }

        PasseioHistoriaDTO dto = new PasseioHistoriaDTO(
            p.getId(),
            p.getLocal(),
            p.getCidade(),
            p.getDescricao(),
            p.getContextoHistorico(),
            atracoesDTO
        );

        return ResponseEntity.ok(dto);
    }
}
