package br.com.suaapi.config;

import br.com.suaapi.model.Adventure;
import br.com.suaapi.repository.AdventureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdventureRepository adventureRepository;

    @Override
    public void run(String... args) throws Exception {
        if (adventureRepository.count() == 0) {
            System.out.println("Semeando banco de dados com passeios iniciais...");
            
            Adventure a1 = Adventure.builder()
                    .title("Passeio de Barco no Rio Tocantins + Pôr do Sol")
                    .location("Carolina/MA")
                    .description("Passeio guiado de barco com contemplação do pôr do sol e paradas para banho.")
                    .category("Náutico")
                    .duration("3 horas")
                    .frequency("Diariamente")
                    .classification("Livre")
                    .tourDate("2024-05-15")
                    .image("https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3") // Placeholder URL since we can't save require()
                    .priceAdult(new BigDecimal("120.00"))
                    .priceStudent(new BigDecimal("60.00"))
                    .priceChild(new BigDecimal("60.00"))
                    .includes(Arrays.asList("Passeio de barco", "Guia credenciado", "Colete salva-vidas"))
                    .itinerary(Arrays.asList("15:00 - Embarque", "16:00 - Parada para banho", "17:30 - Pôr do sol", "18:00 - Retorno"))
                    .importantInfo(Arrays.asList("Levar protetor solar", "Uso obrigatório do colete"))
                    .build();

            Adventure a2 = Adventure.builder()
                    .title("Cachoeira de São Romão")
                    .location("Carolina/MA")
                    .description("Trilha com acesso a uma das maiores e mais belas cachoeiras da região.")
                    .category("Ecoturismo")
                    .duration("Dia todo")
                    .frequency("Finais de semana")
                    .classification("A partir de 10 anos")
                    .tourDate("2024-05-20")
                    .image("https://images.unsplash.com/photo-1432405972618-c60b02422315?ixlib=rb-4.0.3")
                    .priceAdult(new BigDecimal("150.00"))
                    .priceStudent(new BigDecimal("75.00"))
                    .priceChild(new BigDecimal("75.00"))
                    .includes(Arrays.asList("Transporte 4x4", "Taxa de entrada", "Guia"))
                    .itinerary(Arrays.asList("08:00 - Saída de Carolina", "09:30 - Chegada na trilha", "10:30 - Cachoeira", "15:00 - Retorno"))
                    .importantInfo(Arrays.asList("Trilha de nível médio", "Levar água e lanche"))
                    .build();

            Adventure a3 = Adventure.builder()
                    .title("Expedição de Quadriciclo")
                    .location("Santo Amaro/MA")
                    .description("Passeio radical de quadriciclo pelos Lençóis Maranhenses, passando por lagoas exclusivas.")
                    .category("Aventura")
                    .duration("4 horas")
                    .frequency("Diariamente")
                    .classification("A partir de 18 anos (para pilotar)")
                    .tourDate("2024-06-10")
                    .image("https://images.unsplash.com/photo-1596708761007-8ec9d1cb533d?ixlib=rb-4.0.3")
                    .priceAdult(new BigDecimal("300.00"))
                    .priceStudent(new BigDecimal("300.00"))
                    .priceChild(new BigDecimal("300.00"))
                    .includes(Arrays.asList("Aluguel do quadriciclo", "Guia de rota", "Equipamento de segurança"))
                    .itinerary(Arrays.asList("09:00 - Briefing", "09:30 - Início da trilha", "11:00 - Parada nas lagoas", "13:00 - Retorno"))
                    .importantInfo(Arrays.asList("Necessária CNH categoria B", "Assinar termo de responsabilidade"))
                    .build();

            Adventure a4 = Adventure.builder()
                    .title("Tour Gastronômico Imperatriz")
                    .location("Imperatriz/MA")
                    .description("Experimente o melhor da culinária maranhense com degustações em 3 restaurantes locais.")
                    .category("Cultural")
                    .duration("3 horas")
                    .frequency("Sextas e Sábados")
                    .classification("Livre")
                    .tourDate("2024-05-25")
                    .image("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3")
                    .priceAdult(new BigDecimal("180.00"))
                    .priceStudent(new BigDecimal("180.00"))
                    .priceChild(new BigDecimal("100.00"))
                    .includes(Arrays.asList("Transporte entre os locais", "Degustação (comida)", "Guia local"))
                    .itinerary(Arrays.asList("19:00 - Ponto de encontro", "19:30 - Restaurante 1 (Entrada)", "20:30 - Restaurante 2 (Prato Principal)", "21:30 - Restaurante 3 (Sobremesa)"))
                    .importantInfo(Arrays.asList("Bebidas não inclusas", "Avisar sobre restrições alimentares com antecedência"))
                    .build();

            adventureRepository.saveAll(List.of(a1, a2, a3, a4));
            System.out.println("Passeios semeados com sucesso!");
        }
    }
}
