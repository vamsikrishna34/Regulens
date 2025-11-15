package com.Regulens.model;

public class ComplianceRequest {
    private String policy;
    private String regulation;

    // Constructors
    public ComplianceRequest() {}
    public ComplianceRequest(String policy, String regulation) {
        this.policy = policy;
        this.regulation = regulation;
    }

    // Getters & Setters
    public String getPolicy() { return policy; }
    public void setPolicy(String policy) { this.policy = policy; }

    public String getRegulation() { return regulation; }
    public void setRegulation(String regulation) { this.regulation = regulation; }
}