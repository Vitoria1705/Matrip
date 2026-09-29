package br.com.suaapi.service;

import br.com.suaapi.model.Adventure;
import br.com.suaapi.repository.AdventureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdventureService {

    private final AdventureRepository adventureRepository;

    public List<Adventure> findAll() {
        return adventureRepository.findAll();
    }

    public Adventure findById(Long id) {
        return adventureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aventura não encontrada"));
    }
}
