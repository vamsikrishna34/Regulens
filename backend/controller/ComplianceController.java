package com.Regulens.controller;

import com.regulens.model.ComplianceRequest;
import com.regulens.model.ComplianceResponse;
import com.regulens.service.ComplianceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ComplianceController {

    @Autowired
    private ComplianceService complianceService;

    @PostMapping("/analyze")
    public ResponseEntity<ComplianceResponse> analyze(@RequestBody ComplianceRequest request) {
        try {
            String requestId = "req_" + UUID.randomUUID().toString().substring(0, 8);
            ComplianceResponse response = complianceService.analyze(request, requestId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}