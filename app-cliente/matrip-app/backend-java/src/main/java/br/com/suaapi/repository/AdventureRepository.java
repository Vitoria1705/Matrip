package br.com.suaapi.repository;

import br.com.suaapi.model.Adventure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdventureRepository extends JpaRepository<Adventure, Long> {
}
