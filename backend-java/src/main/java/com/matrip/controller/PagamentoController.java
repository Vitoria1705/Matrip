package com.matrip.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class PagamentoController {

    @Value("${mp.access.token}")
    private String mpAccessToken;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ==============================
    // PAGAMENTO PIX - CRIAR
    // ==============================
    @PostMapping("/api/pix/criar")
    public ResponseEntity<?> criarPix(@RequestBody PixRequest req) {
        if (req.getValor() == null || req.getEmail() == null || req.getPedidoId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos para PIX"));
        }

        try {
            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("transaction_amount", req.getValor());
            bodyMap.put("description", "Pedido " + req.getPedidoId() + " - Matrip");
            bodyMap.put("payment_method_id", "pix");
            bodyMap.put("payer", Map.of("email", req.getEmail()));

            String requestBody = objectMapper.writeValueAsString(bodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.mercadopago.com/v1/payments"))
                    .header("Authorization", "Bearer " + mpAccessToken)
                    .header("Content-Type", "application/json")
                    .header("X-Idempotency-Key", "pix_" + req.getPedidoId() + "_" + System.currentTimeMillis())
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                System.err.println("Erro Mercado Pago Pix: " + response.body());
                JsonNode errNode = objectMapper.readTree(response.body());
                return ResponseEntity.status(response.statusCode()).body(errNode);
            }

            JsonNode data = objectMapper.readTree(response.body());
            
            // Extrair caminhos seguros
            JsonNode pointOfInteraction = data.path("point_of_interaction");
            JsonNode transactionData = pointOfInteraction.path("transaction_data");

            Map<String, Object> resMap = new HashMap<>();
            resMap.put("paymentId", data.path("id").asLong());
            resMap.put("status", data.path("status").asText());
            resMap.put("qrCodeBase64", transactionData.path("qr_code_base64").asText());
            resMap.put("copiaECola", transactionData.path("qr_code").asText());

            return ResponseEntity.ok(resMap);

        } catch (Exception e) {
            System.err.println("ERRO PIX: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao criar pagamento PIX: " + e.getMessage()));
        }
    }

    // ==============================
    // PAGAMENTO PIX - STATUS
    // ==============================
    @GetMapping("/api/pix/status/{id}")
    public ResponseEntity<?> obterStatusPix(@PathVariable String id) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.mercadopago.com/v1/payments/" + id))
                    .header("Authorization", "Bearer " + mpAccessToken)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                JsonNode errNode = objectMapper.readTree(response.body());
                return ResponseEntity.status(response.statusCode()).body(errNode);
            }

            JsonNode data = objectMapper.readTree(response.body());

            Map<String, Object> resMap = new HashMap<>();
            resMap.put("status", data.path("status").asText());
            resMap.put("status_detail", data.path("status_detail").asText());

            return ResponseEntity.ok(resMap);

        } catch (Exception e) {
            System.err.println("Erro status Pix: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao consultar status PIX: " + e.getMessage()));
        }
    }

    // ==============================
    // PAGAMENTO CARTÃO
    // ==============================
    @PostMapping("/api/cartao/pagar")
    public ResponseEntity<?> pagarCartao(@RequestBody CartaoRequest req) {
        if (req.getToken() == null || req.getValor() == null || req.getParcelas() == null ||
                req.getEmail() == null || req.getCpf() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados incompletos"));
        }

        try {
            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("transaction_amount", req.getValor());
            bodyMap.put("token", req.getToken());
            bodyMap.put("description", "Pagamento Matrip");
            bodyMap.put("installments", req.getParcelas());
            bodyMap.put("payment_method_id", "visa"); // Sandbox default
            bodyMap.put("payer", Map.of(
                    "email", req.getEmail(),
                    "identification", Map.of(
                            "type", "CPF",
                            "number", req.getCpf()
                    )
            ));

            String requestBody = objectMapper.writeValueAsString(bodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.mercadopago.com/v1/payments"))
                    .header("Authorization", "Bearer " + mpAccessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                System.err.println("Erro Mercado Pago Cartão: " + response.body());
                JsonNode errNode = objectMapper.readTree(response.body());
                return ResponseEntity.status(response.statusCode()).body(errNode);
            }

            JsonNode data = objectMapper.readTree(response.body());

            Map<String, Object> resMap = new HashMap<>();
            resMap.put("status", data.path("status").asText());
            resMap.put("id", data.path("id").asLong());

            return ResponseEntity.ok(resMap);

        } catch (Exception e) {
            System.err.println("ERRO CARTÃO: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DTOs auxiliares
    public static class PixRequest {
        private Double valor;
        private String email;
        private String pedidoId;

        public Double getValor() { return valor; }
        public void setValor(Double valor) { this.valor = valor; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPedidoId() { return pedidoId; }
        public void setPedidoId(String pedidoId) { this.pedidoId = pedidoId; }
    }

    public static class CartaoRequest {
        private String token;
        private Double valor;
        private Integer parcelas;
        private String email;
        private String cpf;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public Double getValor() { return valor; }
        public void setValor(Double valor) { this.valor = valor; }

        public Integer getParcelas() { return parcelas; }
        public void setParcelas(Integer parcelas) { this.parcelas = parcelas; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getCpf() { return cpf; }
        public void setCpf(String cpf) { this.cpf = cpf; }
    }
}
