package com.matrip.dto;

import java.util.List;

public class PasseioHistoriaDTO {
    private Integer id;
    private String local;
    private String cidade;
    private String descricao;
    private String contextoHistorico;
    private List<AtracaoHistoriaDTO> atracoes;

    public PasseioHistoriaDTO() {}

    public PasseioHistoriaDTO(Integer id, String local, String cidade, String descricao, String contextoHistorico, List<AtracaoHistoriaDTO> atracoes) {
        this.id = id;
        this.local = local;
        this.cidade = cidade;
        this.descricao = descricao;
        this.contextoHistorico = contextoHistorico;
        this.atracoes = atracoes;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getContextoHistorico() {
        return contextoHistorico;
    }

    public void setContextoHistorico(String contextoHistorico) {
        this.contextoHistorico = contextoHistorico;
    }

    public List<AtracaoHistoriaDTO> getAtracoes() {
        return atracoes;
    }

    public void setAtracoes(List<AtracaoHistoriaDTO> atracoes) {
        this.atracoes = atracoes;
    }
}
