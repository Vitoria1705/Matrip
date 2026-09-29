package br.com.suaapi.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private Long adventureId;
    private String title;
    private String type; // adulto, estudante, crianca
    private Integer quantity;
    private BigDecimal unitPrice;
}
