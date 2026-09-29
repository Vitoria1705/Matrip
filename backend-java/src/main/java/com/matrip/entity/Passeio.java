package com.matrip.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "passeios")
public class Passeio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50)
    private String categoria;

    @Column(name = "local", length = 255)
    private String local;

    @Column(length = 100)
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "valor_adulto", precision = 10, scale = 2)
    private BigDecimal valorAdulto;

    @Column(name = "valor_estudante", precision = 10, scale = 2)
    private BigDecimal valorEstudante;

    @Column(name = "valor_crianca", precision = 10, scale = 2)
    private BigDecimal valorCrianca;

    @Column(name = "valor_final", precision = 10, scale = 2)
    private BigDecimal valorFinal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "guia_id")
    private Usuario guia;

    @Column(name = "data_passeio")
    private LocalDate dataPasseio;

    @Column(columnDefinition = "json")
    private String roteiro;

    @Column(columnDefinition = "json")
    private String inclui;

    @Column(name = "locais_embarque", columnDefinition = "json")
    private String locaisEmbarque;

    @Column(columnDefinition = "json")
    private String horarios;

    @Column(length = 30)
    private String frequencia;

    @Column(length = 10)
    private String classificacao;

    @Column(name = "informacoes_importantes", columnDefinition = "TEXT")
    private String informacoesImportantes;

    @Column(name = "contexto_historico", columnDefinition = "TEXT")
    private String contextoHistorico;

    public Passeio() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String city) {
        this.cidade = city;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValorAdulto() {
        return valorAdulto;
    }

    public void setValorAdulto(BigDecimal valorAdulto) {
        this.valorAdulto = valorAdulto;
    }

    public BigDecimal getValorEstudante() {
        return valorEstudante;
    }

    public void setValorEstudante(BigDecimal valorEstudante) {
        this.valorEstudante = valorEstudante;
    }

    public BigDecimal getValorCrianca() {
        return valorCrianca;
    }

    public void setValorCrianca(BigDecimal valorCrianca) {
        this.valorCrianca = valorCrianca;
    }

    public BigDecimal getValorFinal() {
        return valorFinal;
    }

    public void setValorFinal(BigDecimal valorFinal) {
        this.valorFinal = valorFinal;
    }

    public Usuario getGuia() {
        return guia;
    }

    public void setGuia(Usuario guia) {
        this.guia = guia;
    }

    public LocalDate getDataPasseio() {
        return dataPasseio;
    }

    public void setDataPasseio(LocalDate dataPasseio) {
        this.dataPasseio = dataPasseio;
    }

    public String getRoteiro() {
        return roteiro;
    }

    public void setRoteiro(String roteiro) {
        this.roteiro = roteiro;
    }

    public String getInclui() {
        return inclui;
    }

    public void setInclui(String inclui) {
        this.inclui = inclui;
    }

    public String getLocaisEmbarque() {
        return locaisEmbarque;
    }

    public void setLocaisEmbarque(String locaisEmbarque) {
        this.locaisEmbarque = locaisEmbarque;
    }

    public String getHorarios() {
        return horarios;
    }

    public void setHorarios(String horarios) {
        this.horarios = horarios;
    }

    public String getFrequencia() {
        return frequencia;
    }

    public void setFrequencia(String frequencia) {
        this.frequencia = frequencia;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }

    public String getInformacoesImportantes() {
        return informacoesImportantes;
    }

    public void setInformacoesImportantes(String informacoesImportantes) {
        this.informacoesImportantes = informacoesImportantes;
    }

    public String getContextoHistorico() {
        return contextoHistorico;
    }

    public void setContextoHistorico(String contextoHistorico) {
        this.contextoHistorico = contextoHistorico;
    }
}
