package br.com.suaapi.controller;

import br.com.suaapi.model.Adventure;
import br.com.suaapi.service.AdventureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adventures")
@RequiredArgsConstructor
public class AdventureController {

    private final AdventureService adventureService;

    @GetMapping
    public ResponseEntity<List<Adventure>> getAllAdventures() {
        return ResponseEntity.ok(adventureService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adventure> getAdventureById(@PathVariable Long id) {
        return ResponseEntity.ok(adventureService.findById(id));
    }
}
