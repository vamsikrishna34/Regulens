package com.Regulens.service;

import com.regulens.model.ComplianceRequest;
import com.regulens.model.ComplianceResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class ComplianceService {

    private final ragService ragService = new RagService();

    public ComplianceResponse analyze(ComplianceRequest request, String requestId) {
        String policy = request.getPolicy();
        String regulation = request.getRegulation();

        // ===== 1. Mock XGBoost Score (Replace with real model later) =====
        double score = 0.75;
        if (policy.toLowerCase().contains("shall")) score = Math.min(0.95, score + 0.2);
        if (policy.toLowerCase().contains("may") || policy.toLowerCase().contains("can")) {
            score = Math.max(0.3, score - 0.3);
        }

        String label = score >= 0.8 ? "compliant" : (score >= 0.5 ? "partial" : "non-compliant");

        // ===== 2. RAG Explanation (Call Python or mock for now) =====
        String explanation;
        List<String> evidence;
        String remediation;

        if (policy.toLowerCase().contains("retain") || policy.toLowerCase().contains("store")) {
            explanation = "Your clause uses *'may be retained'* (permissive language), but regulations require active justification. "
                    + "GDPR Art. 5(1)(e) states: *'Personal data shall be kept [...] no longer than is necessary'*. "
                    + "Recommend: *'shall be retained only as long as necessary for [specific purpose]'*.";
            evidence = Arrays.asList(
                "[GDPR Art.5.1.e] Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.",
                "[SEC 404.a.4] The approximate dollar value of the amount of the related person's interest in the transaction, which shall be computed without regard to the amount of profit or loss."
            );
            remediation = policy.replace("may", "shall").replace("can", "must")
                    + " — specifically, retain only as long as necessary for the stated purpose.";
        } else {
            explanation = "Clause aligns well with regulatory expectations. Minor refinement recommended for auditability.";
            evidence = Arrays.asList(
                "[GDPR Art.5.2] The controller shall be responsible for, and be able to demonstrate compliance with, paragraph 1.",
                "[SEC 404.b] Describe the registrant's policies and procedures for the review, approval, or ratification [...]"
            );
            remediation = policy;
        }

        return new ComplianceResponse(requestId, score, label, explanation, evidence, remediation);
    }
}