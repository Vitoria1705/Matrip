package br.com.suaapi.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

@Data
public class CheckoutRequestDTO {
    @NotEmpty(message = "O carrinho não pode estar vazio")
    @Valid
    private List<CartItemDTO> items;

    @NotNull(message = "O total é obrigatório")
    private BigDecimal total;

    @NotNull(message = "A taxa de serviço é obrigatória")
    private BigDecimal serviceFee;

    @NotNull(message = "O total final é obrigatório")
    private BigDecimal grandTotal;

    @NotBlank(message = "O método de pagamento é obrigatório")
    private String paymentMethod; // pix, credit, paypal
    
    @Valid
    private CreditCardDTO creditCard;
}
