package com.matrip.repository;

import com.matrip.entity.Agencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgenciaRepository extends JpaRepository<Agencia, Integer> {
    List<Agencia> findAllByOrderByCreatedAtDesc();
    List<Agencia> findByStatusOrderByCreatedAtDesc(String status);
}
