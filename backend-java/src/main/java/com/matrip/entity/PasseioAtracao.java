package com.matrip.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "passeio_atracoes")
public class PasseioAtracao {

    @EmbeddedId
    private PasseioAtracaoId id = new PasseioAtracaoId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("passeioId")
    @JoinColumn(name = "passeio_id")
    private Passeio passeio;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("atracaoId")
    @JoinColumn(name = "atracao_id")
    private Atracao atracao;

    @Column(name = "ordem_visita")
    private Integer ordemVisita;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    public PasseioAtracao() {}

    public PasseioAtracaoId getId() {
        return id;
    }

    public void setId(PasseioAtracaoId id) {
        this.id = id;
    }

    public Passeio getPasseio() {
        return passeio;
    }

    public void setPasseio(Passeio passeio) {
        this.passeio = passeio;
        this.id.setPasseioId(passeio != null ? passeio.getId() : null);
    }

    public Atracao getAtracao() {
        return atracao;
    }

    public void setAtracao(Atracao atracao) {
        this.atracao = atracao;
        this.id.setAtracaoId(atracao != null ? atracao.getId() : null);
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
