package br.com.suaapi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponseDTO {
    private Long orderId;
    private String status;
    private String method;
    private String transactionId;
    private String qrCode;
    private String qrCodeBase64;
    private String checkoutUrl;
    private String message;
}
