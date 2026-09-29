package br.com.suaapi.controller;

import br.com.suaapi.dto.CheckoutRequestDTO;
import br.com.suaapi.dto.PaymentResponseDTO;
import br.com.suaapi.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<PaymentResponseDTO> checkout(
            @Valid @RequestBody CheckoutRequestDTO request,
            Authentication authentication) {
        
        String userEmail = authentication.getName(); // assuming JWT subject is email
        PaymentResponseDTO response = paymentService.processCheckout(request, userEmail);
        return ResponseEntity.ok(response);
    }
}
