package br.com.suaapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "adventures")
public class Adventure {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category;
    private String duration;
    private String frequency;
    private String classification;
    private String tourDate;
    
    // Store image path or URL
    @Column(columnDefinition = "TEXT")
    private String image;

    private BigDecimal priceAdult;
    private BigDecimal priceStudent;
    private BigDecimal priceChild;

    @ElementCollection
    @CollectionTable(name = "adventure_includes", joinColumns = @JoinColumn(name = "adventure_id"))
    @Column(name = "include_item")
    private List<String> includes;

    @ElementCollection
    @CollectionTable(name = "adventure_itinerary", joinColumns = @JoinColumn(name = "adventure_id"))
    @Column(name = "itinerary_step", columnDefinition = "TEXT")
    private List<String> itinerary;

    @ElementCollection
    @CollectionTable(name = "adventure_important_info", joinColumns = @JoinColumn(name = "adventure_id"))
    @Column(name = "info", columnDefinition = "TEXT")
    private List<String> importantInfo;
}
