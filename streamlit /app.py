import streamlit as st
from streamlit.components.v1 import html
import json
import random

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    
    /* Base */
    html, body, .stApp {
        background-color: #0f172a !important;
        color: #e2e8f0 !important;
    }
    
    /* Typography */
    * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    
    h1, h2, h3 {
        font-weight: 600 !important;
    }
    
    /* Containers (Cards) */
    .stContainer {
        border-radius: 16px !important;
        border: 1px solid #334155 !important;
        padding: 1.5rem !important;
        background: #1e293b !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
        margin-bottom: 1.5rem !important;
    }
    
    /* Code blocks */
    .stCodeBlock {
        background: #334155 !important;
        border-radius: 10px !important;
        padding: 1.2rem !important;
        font-size: 0.95rem !important;
        line-height: 1.5 !important;
    }
    
    /* Buttons */
    .stButton > button {
        border-radius: 10px !important;
        padding: 0.6rem 1.5rem !important;
        font-weight: 500 !important;
        border: none !important;
        background: #6366f1 !important;
        color: white !important;
        transition: all 0.2s ease !important;
    }
    .stButton > button:hover {
        background: #4f46e5 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
    }
    
    /* Expander */
    .streamlit-expanderHeader {
        font-weight: 500 !important;
    }
    
    /* Input */
    .stTextArea > div > div > textarea {
        background: #1e293b !important;
        border: 1px solid #334155 !important;
        border-radius: 10px !important;
        color: #e2e8f0 !important;
    }
    
    /* Selectbox */
    .stSelectbox > div > div > div {
        background: #1e293b !important;
        border: 1px solid #334155 !important;
        border-radius: 10px !important;
        color: #e2e8f0 !important;
    }
</style>
""", unsafe_allow_html=True)


col_title, col_toggle = st.columns([5, 1])
with col_title:
    st.title("🔍 ReguLens")
    st.caption("Real-time regulatory gap detection — *XGBoost + RAG hybrid engine*")
with col_toggle:
    if st.button("🌓", key="theme_toggle", help="Toggle dark/light mode"):
        st.session_state.dark_mode = not st.session_state.get("dark_mode", True)


@st.cache_resource
def load_clauses():
    try:
        with open("../data/sec_item404_clauses.json") as f:
            sec = json.load(f)
        with open("../data/gdpr_art5_clauses.json") as f:
            gdpr = json.load(f)
        return sec, gdpr
    except:
        # Fallback if paths differ
        sec = [
            {"id": "404.a", "title": "Transactions with related persons", "text": "Describe any transaction [...] exceeding $120,000 [...] in which any related person had [...] material interest."},
            {"id": "404.b", "title": "Review, approval or ratification", "text": "Describe the registrant's policies and procedures for the review, approval, or ratification [...]"}
        ]
        gdpr = [
            {"id": "art5.1.e", "principle": "storage limitation", "text": "Personal data shall be kept [...] no longer than is necessary [...]"},
            {"id": "art5.1.c", "principle": "data minimisation", "text": "Personal data shall be adequate, relevant and limited to what is necessary [...]"}
        ]
        return sec, gdpr

sec_clauses, gdpr_clauses = load_clauses()


with st.container():
    st.subheader("📋 Policy Clause")
    policy = st.text_area(
        label="",
        placeholder="e.g., 'Customer data may be retained for up to 24 months for analytics and reporting purposes.'",
        height=120,
        label_visibility="collapsed"
    )
    
    st.subheader("📚 Reference Regulation")
    regulation = st.selectbox(
        "",
        ["SEC Item 404 (Related Party Transactions)", "GDPR Article 5 (Data Principles)"],
        label_visibility="collapsed"
    )
    
    analyze_btn = st.button("🚀 Analyze Compliance", type="primary", use_container_width=True)


def mock_analyze(policy: str, regulation: str):
    # Simulate XGBoost score (higher if 'shall', lower if 'may')
    score = 0.75
    if "shall" in policy.lower():
        score = min(0.95, score + 0.2)
    if "may" in policy.lower() or "can" in policy.lower():
        score = max(0.3, score - 0.3)
    
    # Mock label
    if score >= 0.8:
        label = "compliant"
        color = "🟢"
    elif score >= 0.5:
        label = "partial"
        color = "🟡"
    else:
        label = "non-compliant"
        color = "🔴"
    
    # Mock RAG explanation
    if "retain" in policy.lower() or "store" in policy.lower():
        explanation = (
            "Your clause uses *'may be retained'* (permissive language), but regulations require active justification. "
            "GDPR Art. 5(1)(e) states: *'Personal data shall be kept [...] no longer than is necessary'*. "
            "Recommend: *'shall be retained only as long as necessary for [specific purpose]'*."
        )
        evidence = [
            "[GDPR Art.5.1.e] Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.",
            "[SEC 404.a.4] The approximate dollar value of the amount of the related person's interest in the transaction, which shall be computed without regard to the amount of profit or loss."
        ]
        remediation = "Customer data **shall be retained only as long as necessary** to fulfill the stated purpose, with documented justification for any extension."
    else:
        explanation = "Clause aligns well with regulatory expectations. Minor refinement recommended for auditability."
        evidence = [
            "[GDPR Art.5.2] The controller shall be responsible for, and be able to demonstrate compliance with, paragraph 1.",
            "[SEC 404.b] Describe the registrant's policies and procedures for the review, approval, or ratification [...]"
        ]
        remediation = policy.replace("may", "shall").replace("can", "must") if "may" in policy or "can" in policy else policy + " — fully compliant as written."
    
    return {
        "xgboost_score": score,
        "label": label,
        "color": color,
        "explanation": explanation,
        "evidence": evidence,
        "remediation": remediation
    }


if analyze_btn and policy.strip():
    with st.spinner("🔍 Analyzing with XGBoost + RAG..."):
        import time
        time.sleep(0.8)
        result = mock_analyze(policy, regulation)
    
    # Dual-panel results
    col_a, col_b = st.columns(2)
    
    with col_a:
        with st.container():
            st.subheader("🤖 XGBoost Prediction")
            st.markdown(f"**Confidence**: {result['color']} `{result['xgboost_score']:.2f}`")
            st.progress(result['xgboost_score'])
            st.caption(f"Interpretation: **{result['label'].title()} Compliance**")
    
    with col_b:
        with st.container():
            st.subheader("💡 RAG Explanation")
            st.info(result["explanation"])
    
    # Evidence panel
    with st.expander("🔍 Supporting Regulatory Clauses", expanded=False):
        for i, clause in enumerate(result["evidence"], 1):
            st.markdown(f"**[{i}]**")
            st.code(clause, language="text")
    
    # Actionable output
    with st.container():
        st.subheader("✅ Recommended Revision")
        st.code(result["remediation"], language="text")
        
        
        btn_id = "copy_btn_" + str(hash(result["remediation"]) % 10000)
        safe_text = result["remediation"].replace("`", "\\`").replace("\n", "\\n")
        html(f"""
        <script>
        function copyToClipboard_{btn_id}() {{
            try {{
                navigator.clipboard.writeText(`{safe_text}`);
                document.getElementById('{btn_id}').innerText = '✅ Copied!';
                setTimeout(() => {{
                    document.getElementById('{btn_id}').innerText = '📋 Copy';
                }}, 1500);
            }} catch (err) {{
                console.error('Copy failed:', err);
            }}
        }}
        </script>
        <button id="{btn_id}" onclick="copyToClipboard_{btn_id}()" 
                style="padding: 0.5rem 1.2rem; border-radius: 8px; border: none; 
                       background: #475569; color: white; cursor: pointer; 
                       font-weight: 500; margin-top: 0.5rem;">
            📋 Copy Recommended Revision
        </button>
        """, height=45)

elif analyze_btn:
    st.warning("Please enter a policy clause.")


st.markdown("---")
st.caption("ReguLens v1.0 · Hybrid AI for Explainable Compliance · Built with Streamlit + XGBoost + RAG")