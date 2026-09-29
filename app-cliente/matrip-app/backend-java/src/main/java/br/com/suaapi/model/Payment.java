package br.com.suaapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagamentos")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pedido_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Order order;

    @Column(nullable = false)
    private String method; // pix, credit, paypal

    @Column(nullable = false)
    private String status; // APPROVED, PENDING, REJECTED

    private String transactionId; // ID from MercadoPago or PayPal mock

    private String qrCode; // For Pix
    private String qrCodeBase64; // For Pix image
    private String checkoutUrl; // For PayPal

    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        processedAt = LocalDateTime.now();
    }
}
