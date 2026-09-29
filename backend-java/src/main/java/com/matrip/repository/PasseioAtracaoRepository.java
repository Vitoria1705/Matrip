package com.matrip.repository;

import com.matrip.entity.PasseioAtracao;
import com.matrip.entity.PasseioAtracaoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasseioAtracaoRepository extends JpaRepository<PasseioAtracao, PasseioAtracaoId> {

    @Query("SELECT pa FROM PasseioAtracao pa " +
           "JOIN FETCH pa.passeio p " +
           "JOIN FETCH pa.atracao a " +
           "JOIN FETCH a.localidade l " +
           "WHERE p.id = :passeioId " +
           "ORDER BY pa.ordemVisita ASC")
    List<PasseioAtracao> findPasseioAtracoesWithDetails(@Param("passeioId") Integer passeioId);
}
