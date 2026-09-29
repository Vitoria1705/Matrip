package com.matrip.repository;

import com.matrip.entity.PasseioImagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PasseioImagemRepository extends JpaRepository<PasseioImagem, Integer> {
    List<PasseioImagem> findByPasseioIdOrderByIdAsc(Integer passeioId);
    
    @Transactional
    void deleteByPasseioId(Integer passeioId);
}
