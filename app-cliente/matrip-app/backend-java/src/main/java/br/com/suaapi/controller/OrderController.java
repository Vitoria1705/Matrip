package br.com.suaapi.controller;

import br.com.suaapi.model.Order;
import br.com.suaapi.model.Usuario;
import br.com.suaapi.repository.OrderRepository;
import br.com.suaapi.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        String email = authentication.getName();
        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        
        List<Order> myOrders = orderRepository.findByUsuario(user);
        return ResponseEntity.ok(myOrders);
    }
}
