package com.matrip.repository;

import com.matrip.entity.Passeio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasseioRepository extends JpaRepository<Passeio, Integer> {
    List<Passeio> findByGuiaIdOrderByIdDesc(Integer guiaId);
    List<Passeio> findAllByOrderByIdDesc();
    
    // Para ordenar por categoria e id desc na Home
    List<Passeio> findAllByOrderByCategoriaAscIdDesc();
    
    // Para filtros por cidade/estado
    List<Passeio> findByEstadoAndCidade(String estado, String cidade);
    List<Passeio> findByEstado(String estado);
    List<Passeio> findByCidade(String cidade);
}
