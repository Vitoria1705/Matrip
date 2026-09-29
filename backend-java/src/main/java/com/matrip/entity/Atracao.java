package com.matrip.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "atracoes")
public class Atracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "localidade_id")
    private Localidade localidade;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 50)
    private String tipo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String historia;

    @Column(columnDefinition = "TEXT")
    private String curiosidades;

    public Atracao() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Localidade getLocalidade() {
        return localidade;
    }

    public void setLocalidade(Localidade localidade) {
        this.localidade = localidade;
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
}
