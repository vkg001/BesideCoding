package com.example.besideCoding;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.Collections;

@RestController
public class HealthController {
    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        // Returns a simple JSON object: {"status": "UP"}
        return Collections.singletonMap("status", "UP");
    }
}