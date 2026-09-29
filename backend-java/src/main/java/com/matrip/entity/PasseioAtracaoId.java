package com.matrip.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PasseioAtracaoId implements Serializable {

    @Column(name = "passeio_id")
    private Integer passeioId;

    @Column(name = "atracao_id")
    private Integer atracaoId;

    public PasseioAtracaoId() {}

    public PasseioAtracaoId(Integer passeioId, Integer atracaoId) {
        this.passeioId = passeioId;
        this.atracaoId = atracaoId;
    }

    public Integer getPasseioId() {
        return passeioId;
    }

    public void setPasseioId(Integer passeioId) {
        this.passeioId = passeioId;
    }

    public Integer getAtracaoId() {
        return atracaoId;
    }

    public void setAtracaoId(Integer atracaoId) {
        this.atracaoId = atracaoId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PasseioAtracaoId that = (PasseioAtracaoId) o;
        return Objects.equals(passeioId, that.passeioId) &&
               Objects.equals(atracaoId, that.atracaoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(passeioId, atracaoId);
    }
}
