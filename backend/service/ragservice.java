package com.Regulens.service;

import java.util.Arrays;
import java.util.List;

public class ragService {
    public List<String> retrieve(String query) {
        // TODO: Load ChromaDB, embed, query — for now, return static
        return Arrays.asList(
            "[GDPR Art.5.1.e] Personal data shall be kept [...] no longer than is necessary.",
            "[SEC 404.a] Any transaction [...] exceeding $120,000 [...] material interest."
        );
    }
}