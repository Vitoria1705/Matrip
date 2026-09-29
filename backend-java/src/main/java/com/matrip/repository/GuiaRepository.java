package com.matrip.repository;

import com.matrip.entity.Guia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuiaRepository extends JpaRepository<Guia, Integer> {
    Optional<Guia> findByUsuarioId(Integer usuarioId);
}
