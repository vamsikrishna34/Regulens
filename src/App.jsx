import { useState, useMemo } from 'react'
import { regulations } from './data/clauses.js'
import { analyzeCompliance } from './engine/compliance.js'

const RING_RADIUS = 52
const RING_CIRC = 2 * Math.PI * RING_RADIUS

const STATUS_COLOR = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
}

const STATUS_LABEL = {
  success: 'Compliant',
  warning: 'Partial',
  error: 'Non-compliant'
}

function ScoreRing({ score, status }) {
  const offset = RING_CIRC * (1 - score)
  const color = STATUS_COLOR[status]
  return (
    <div className="score-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle className="score-ring-track" cx="60" cy="60" r={RING_RADIUS} />
        <circle
          className="score-ring-fill"
          cx="60" cy="60" r={RING_RADIUS}
          stroke={color}
          strokeDasharray={RING_CIRC}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-value">
        <span className="num" style={{ color }}>{(score * 100).toFixed(0)}%</span>
        <span className="lbl">Score</span>
      </div>
    </div>
  )
}

function CardTitle({ icon, children }) {
  return (
    <h3 className="card-title">
      {icon}
      {children}
    </h3>
  )
}

export default function App() {
  const [policy, setPolicy] = useState('')
  const [regKey, setRegKey] = useState('sec')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [warn, setWarn] = useState(false)
  const [copied, setCopied] = useState(false)

  const reg = useMemo(() => regulations.find((r) => r.key === regKey), [regKey])

  const handleAnalyze = () => {
    if (!policy.trim()) {
      setWarn(true)
      setResult(null)
      return
    }
    setWarn(false)
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(analyzeCompliance(policy, regKey))
      setLoading(false)
    }, 700)
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.remediation)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <img className="brand-logo" src="/favicon.svg" alt="ReguLens logo" />
          <div className="brand-text">
            <h1>ReguLens</h1>
            <p>AI-Powered Regulatory Compliance Assistant</p>
          </div>
        </div>
        <span className="badge">
          <span className="badge-dot" />
          Engine Online
        </span>
      </header>

      <section className="hero">
        <h2>Detect regulatory gaps before the auditors do.</h2>
        <p>
          Paste a policy clause, pick the reference regulation, and ReguLens scores it
          for compliance, explains the gap, and rewrites the clause for you —
          powered by a hybrid XGBoost + RAG analysis engine.
        </p>
      </section>

      <div className="form-stack">
        <div>
          <label className="field-label" htmlFor="policy">Policy Clause</label>
          <textarea
            id="policy"
            className="policy-input"
            placeholder="e.g. Customer data may be retained for up to 24 months for analytics and reporting purposes."
            value={policy}
            onChange={(e) => { setPolicy(e.target.value); setWarn(false) }}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="regulation">Reference Regulation</label>
          <div className="select-wrap">
            <select
              id="regulation"
              className="reg-select"
              value={regKey}
              onChange={(e) => setRegKey(e.target.value)}
            >
              {regulations.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze Compliance'}
        </button>

        {warn && (
          <div className="warn">
            <WarnIcon />
            Please enter a policy clause to analyze.
          </div>
        )}
      </div>

      {loading && (
        <div className="card loading">
          <div className="spinner" />
          <span>Analyzing with XGBoost + RAG…</span>
        </div>
      )}

      {result && !loading && (
        <div className="results">
          <div className="dual-panel">
            <div className="card">
              <CardTitle icon={<RobotIcon />}>XGBoost Prediction</CardTitle>
              <div className="score-display">
                <ScoreRing score={result.score} status={result.status} />
                <span className={`status-pill ${result.status}`}>
                  <span className="status-dot" />
                  {STATUS_LABEL[result.status]}
                </span>
              </div>
            </div>

            <div className="card">
              <CardTitle icon={<BulbIcon />}>RAG Explanation</CardTitle>
              <div className="explanation-text">{result.explanation}</div>
            </div>
          </div>

          <div className="card">
            <CardTitle icon={<SearchIcon />}>Supporting Regulatory Clauses</CardTitle>
            <ul className="evidence-list">
              {result.evidence.map((c, i) => (
                <li key={c.id} className="evidence-item">
                  <span className="idx">{i + 1}</span>
                  <div className="clause-id">{c.id}</div>
                  <div className="clause-title">{c.title || c.principle}</div>
                  <div className="clause-text">{c.text}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <CardTitle icon={<CheckIcon />}>Recommended Revision</CardTitle>
            <div className="remediation-box">{result.remediation}</div>
            <button
              className={`btn-copy ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? <CheckSmallIcon /> : <CopyIcon />}
              {copied ? 'Copied!' : 'Copy Recommended Revision'}
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        ReguLens v1.0 · Hybrid AI for Explainable Compliance
      </footer>
    </div>
  )
}

function WarnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function RobotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  )
}

function BulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
