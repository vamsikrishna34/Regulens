import { secClauses, gdprClauses } from '../data/clauses.js'

const PERMISSIVE = ['may', 'can', 'might', 'could', 'optionally']
const PRESCRIPTIVE = ['shall', 'must', 'will', 'required', 'mandatory']

function keywordScore(text) {
  const lower = text.toLowerCase()
  let score = 0.62
  for (const w of PRESCRIPTIVE) {
    if (lower.includes(w)) score = Math.min(0.97, score + 0.07)
  }
  for (const w of PERMISSIVE) {
    if (lower.includes(w)) score = Math.max(0.28, score - 0.12)
  }
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  if (wordCount < 10) score = Math.max(0.3, score - 0.08)
  return score
}

function labelFor(score) {
  if (score >= 0.8) return { label: 'compliant', status: 'success' }
  if (score >= 0.5) return { label: 'partial', status: 'warning' }
  return { label: 'non-compliant', status: 'error' }
}

function pickEvidence(regulation, text) {
  const lower = text.toLowerCase()
  if (regulation === 'gdpr') {
    if (lower.includes('retain') || lower.includes('store') || lower.includes('keep') || lower.includes('period')) {
      return [gdprClauses.find((c) => c.id === 'art5.1.e'), gdprClauses.find((c) => c.id === 'art5.2')]
    }
    if (lower.includes('secur') || lower.includes('protect') || lower.includes('access')) {
      return [gdprClauses.find((c) => c.id === 'art5.1.f'), gdprClauses.find((c) => c.id === 'art5.1.a')]
    }
    if (lower.includes('minim') || lower.includes('relevant') || lower.includes('necessary')) {
      return [gdprClauses.find((c) => c.id === 'art5.1.c'), gdprClauses.find((c) => c.id === 'art5.1.b')]
    }
    if (lower.includes('accura') || lower.includes('up to date') || lower.includes('rectif')) {
      return [gdprClauses.find((c) => c.id === 'art5.1.d'), gdprClauses.find((c) => c.id === 'art5.2')]
    }
    return [gdprClauses[0], gdprClauses[gdprClauses.length - 1]]
  }
  if (lower.includes('related') || lower.includes('transaction') || lower.includes('party')) {
    return [secClauses[0], secClauses.find((c) => c.id === '404.b')]
  }
  if (lower.includes('debt') || lower.includes('loan') || lower.includes('interest')) {
    return [secClauses.find((c) => c.id === '404.a.5'), secClauses.find((c) => c.id === '404.a.3')]
  }
  return [secClauses[0], secClauses.find((c) => c.id === '404.b')]
}

function buildExplanation(regulation, text, score) {
  const lower = text.toLowerCase()
  if (regulation === 'gdpr') {
    if (lower.includes('retain') || lower.includes('store') || lower.includes('keep')) {
      return "Your clause uses permissive language ('may be retained'), but GDPR requires active justification. Article 5(1)(e) states personal data shall be kept no longer than necessary for the purposes for which it is processed."
    }
    if (lower.includes('secur') || lower.includes('protect')) {
      return 'Clause touches on security but lacks specifics on safeguards. Article 5(1)(f) requires appropriate security against unauthorised or unlawful processing and accidental loss.'
    }
    if (score < 0.5) {
      return 'Clause uses permissive or vague language that does not align with GDPR prescriptive requirements. Replace permissive terms with binding obligations.'
    }
    return 'Clause generally aligns with GDPR principles. Minor refinement recommended for auditability and explicit purpose documentation.'
  }
  if (lower.includes('related') || lower.includes('transaction')) {
    return 'Clause references related-party activity but should explicitly state the disclosure threshold ($120,000) and the review/approval procedure required by SEC Item 404(b).'
  }
  if (score < 0.5) {
    return 'Clause uses permissive language. SEC disclosure requirements are mandatory — replace permissive terms with clear obligations.'
  }
  return 'Clause aligns with SEC Item 404 expectations. Consider adding explicit dollar-value thresholds and the basis for related-person determinations.'
}

function buildRemediation(regulation, text) {
  const lower = text.toLowerCase()
  if (regulation === 'gdpr') {
    if (lower.includes('retain') || lower.includes('store') || lower.includes('keep')) {
      return text
        .replace(/\bmay be retained\b/gi, 'shall be retained only as long as necessary')
        .replace(/\bmay\b/gi, 'shall')
        .replace(/\bcan\b/gi, 'must')
        .replace(/\bretained for up to\b/gi, 'retained no longer than necessary for')
    }
    return text.replace(/\bmay\b/gi, 'shall').replace(/\bcan\b/gi, 'must')
  }
  return text.replace(/\bmay\b/gi, 'shall').replace(/\bcan\b/gi, 'must')
}

export function analyzeCompliance(policyText, regulationKey) {
  const trimmed = policyText.trim()
  if (!trimmed) return null
  const score = keywordScore(trimmed)
  const { label, status } = labelFor(score)
  const evidence = pickEvidence(regulationKey, trimmed)
  return {
    score,
    label,
    status,
    explanation: buildExplanation(regulationKey, trimmed, score),
    evidence,
    remediation: buildRemediation(regulationKey, trimmed)
  }
}
