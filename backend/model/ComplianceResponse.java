package com.Regulens.model;

import java.util.List;

public class ComplianceResponse {
    private String requestId;
    private double xgboostScore;
    private String label; // "compliant", "partial", "non-compliant"
    private String explanation;
    private List<String> evidence;
    private String remediation;

    // Constructors
    public ComplianceResponse() {}
    public ComplianceResponse(String requestId, double score, String label, String exp, List<String> ev, String rem) {
        this.requestId = requestId;
        this.xgboostScore = score;
        this.label = label;
        this.explanation = exp;
        this.evidence = ev;
        this.remediation = rem;
    }

    // Getters & Setters (all)
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public double getXgboostScore() { return xgboostScore; }
    public void setXgboostScore(double xgboostScore) { this.xgboostScore = xgboostScore; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getEvidence() { return evidence; }
    public void setEvidence(List<String> evidence) { this.evidence = evidence; }

    public String getRemediation() { return remediation; }
    public void setRemediation(String remediation) { this.remediation = remediation; }
}