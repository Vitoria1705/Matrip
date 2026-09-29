package br.com.suaapi.repository;

import br.com.suaapi.model.Order;
import br.com.suaapi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsuario(Usuario usuario);
    List<Order> findByUsuarioId(Long usuarioId);
}
