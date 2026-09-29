package br.com.suaapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoogleLoginRequest {
    @NotBlank(message = "O token do Google é obrigatório")
    private String idToken;
}
