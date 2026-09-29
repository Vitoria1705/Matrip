package com.matrip.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "passeio_imagens")
public class PasseioImagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passeio_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Passeio passeio;

    @Column(length = 255)
    private String caminho;

    public PasseioImagem() {}

    public PasseioImagem(Passeio passeio, String caminho) {
        this.passeio = passeio;
        this.caminho = caminho;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Passeio getPasseio() {
        return passeio;
    }

    public void setPasseio(Passeio passeio) {
        this.passeio = passeio;
    }

    public String getCaminho() {
        return caminho;
    }

    public void setCaminho(String caminho) {
        this.caminho = caminho;
    }
}
