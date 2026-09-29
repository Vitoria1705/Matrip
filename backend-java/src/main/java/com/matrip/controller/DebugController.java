package com.matrip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/debug-log")
@CrossOrigin(origins = "*")
public class DebugController {

    @PostMapping
    public ResponseEntity<?> receiveLog(@RequestBody Map<String, Object> body) {
        System.out.println("[BROWSER LOG] " + body.get("message"));
        return ResponseEntity.ok().build();
    }
}
