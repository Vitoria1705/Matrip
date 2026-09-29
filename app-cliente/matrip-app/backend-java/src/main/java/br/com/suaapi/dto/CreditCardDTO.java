package br.com.suaapi.dto;

import lombok.Data;

@Data
public class CreditCardDTO {
    private String number;
    private String expiration;
    private String cvv;
    private String holderName;
}
