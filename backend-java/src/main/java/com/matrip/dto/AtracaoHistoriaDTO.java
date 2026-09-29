package com.matrip.dto;

public class AtracaoHistoriaDTO {
    private String nome;
    private String tipo;
    private String descricao;
    private String historia;
    private String curiosidades;
    private String localidadeNome;
    private String localidadeHistoria;
    private String localidadeCuriosidades;
    private Integer ordemVisita;
    private String observacao;

    public AtracaoHistoriaDTO() {}

    public AtracaoHistoriaDTO(String nome, String tipo, String descricao, String historia, String curiosidades, 
                              String localidadeNome, String localidadeHistoria, String localidadeCuriosidades, 
                              Integer ordemVisita, String observacao) {
        this.nome = nome;
        this.tipo = tipo;
        this.descricao = descricao;
        this.historia = historia;
        this.curiosidades = curiosidades;
        this.localidadeNome = localidadeNome;
        this.localidadeHistoria = localidadeHistoria;
        this.localidadeCuriosidades = localidadeCuriosidades;
        this.ordemVisita = ordemVisita;
        this.observacao = observacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getHistoria() {
        return historia;
    }

    public void setHistoria(String historia) {
        this.historia = historia;
    }

    public String getCuriosidades() {
        return curiosidades;
    }

    public void setCuriosidades(String curiosidades) {
        this.curiosidades = curiosidades;
    }

    public String getLocalidadeNome() {
        return localidadeNome;
    }

    public void setLocalidadeNome(String localidadeNome) {
        this.localidadeNome = localidadeNome;
    }

    public String getLocalidadeHistoria() {
        return localidadeHistoria;
    }

    public void setLocalidadeHistoria(String localidadeHistoria) {
        this.localidadeHistoria = localidadeHistoria;
    }

    public String getLocalidadeCuriosidades() {
        return localidadeCuriosidades;
    }

    public void setLocalidadeCuriosidades(String localidadeCuriosidades) {
        this.localidadeCuriosidades = localidadeCuriosidades;
    }

    public Integer getOrdemVisita() {
        return ordemVisita;
    }

    public void setOrdemVisita(Integer ordemVisita) {
        this.ordemVisita = ordemVisita;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
