package br.com.suaapi.service;

import br.com.suaapi.dto.CartItemDTO;
import br.com.suaapi.dto.CheckoutRequestDTO;
import br.com.suaapi.dto.PaymentResponseDTO;
import br.com.suaapi.model.Order;
import br.com.suaapi.model.OrderItem;
import br.com.suaapi.model.Payment;
import br.com.suaapi.model.Usuario;
import br.com.suaapi.repository.OrderItemRepository;
import br.com.suaapi.repository.OrderRepository;
import br.com.suaapi.repository.PaymentRepository;
import br.com.suaapi.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public PaymentResponseDTO processCheckout(CheckoutRequestDTO request, String userEmail) {
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 1. Criar o Pedido (Order)
        Order order = Order.builder()
                .usuario(usuario)
                .total(request.getTotal())
                .serviceFee(request.getServiceFee())
                .grandTotal(request.getGrandTotal())
                .status("PENDING")
                .build();
        order = orderRepository.save(order);

        // 2. Salvar Itens do Pedido
        for (CartItemDTO itemDto : request.getItems()) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .adventureId(itemDto.getAdventureId())
                    .title(itemDto.getTitle())
                    .type(itemDto.getType())
                    .quantity(itemDto.getQuantity())
                    .unitPrice(itemDto.getUnitPrice())
                    .build();
            orderItemRepository.save(item);
        }

        // 3. Processar Pagamento (Mock)
        Payment payment = Payment.builder()
                .order(order)
                .method(request.getPaymentMethod())
                .transactionId(UUID.randomUUID().toString())
                .build();

        PaymentResponseDTO.PaymentResponseDTOBuilder responseBuilder = PaymentResponseDTO.builder()
                .orderId(order.getId())
                .method(request.getPaymentMethod())
                .transactionId(payment.getTransactionId());

        switch (request.getPaymentMethod().toLowerCase()) {
            case "pix":
                payment.setStatus("PENDING");
                payment.setQrCode("00020126580014br.gov.bcb.pix0136" + UUID.randomUUID() + "5204000053039865802BR5910Matrip App6009Sao Luis62070503***6304");
                // Mock base64 image just using a placeholder or returning null so frontend generates it via lib
                payment.setQrCodeBase64(""); 
                responseBuilder.status("PENDING")
                        .qrCode(payment.getQrCode())
                        .message("QR Code gerado com sucesso. Aguardando pagamento.");
                break;
            case "credit":
                // Simulate approval
                payment.setStatus("APPROVED");
                order.setStatus("PAID");
                responseBuilder.status("APPROVED")
                        .message("Pagamento aprovado com sucesso!");
                break;
            case "paypal":
                payment.setStatus("PENDING");
                payment.setCheckoutUrl("https://www.sandbox.paypal.com/checkoutnow?token=" + UUID.randomUUID());
                responseBuilder.status("PENDING")
                        .checkoutUrl(payment.getCheckoutUrl())
                        .message("Redirecione para o PayPal para concluir o pagamento.");
                break;
            default:
                throw new RuntimeException("Método de pagamento inválido");
        }

        paymentRepository.save(payment);
        orderRepository.save(order);

        return responseBuilder.build();
    }
}
