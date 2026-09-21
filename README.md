
## ReguLens — AI-Powered Regulatory Compliance Assistant
ReguLens is a production-grade, enterprise-ready asynchronous compliance platform designed to automate regulatory gap detection and remediation. By combining the speed and interpretability of XGBoost with the deep reasoning of a Phi-3 + ChromaDB RAG architecture, ReguLens eliminates the "black-box" risks of pure LLM approaches, delivering fully traceable, auditor-credible compliance workflows.

##  Key Features
* Hybrid Compliance Engine: Leverages interpretable XGBoost for lightning-fast initial compliance gap detection alongside an LLM for structured remediation.
* Explainable AI (XAI): Built-in evidence tracing mappings ensure every flagged risk points directly to the underlying SEC or GDPR clause.
* Asynchronous Scalability: Powered by an event-driven core utilizing Java/Spring Boot and Apache Kafka to handle massive streaming audit trails.
* Legal-Aware Feature Engineering: Custom data ingestion pipeline using Regex and Abstract Syntax Tree (AST) heuristics to parse highly complex legal structures.
* Enterprise MLOps & Monitoring: Packaged entirely via Docker with active data drift monitoring, automated versioning pipelines, and continuous CI/CD.

## Architecture Overview
ReguLens is split into three decoupled, highly scalable layers:

[ Ingestion Pipe ] -> (Kafka) -> [ Java/Spring Boot Core ]
                                         │
    ┌────────────────────────────────────┴───────────────────────────────────┐
    ▼                                                                        ▼
[ XGBoost Risk Engine ]                                            [ RAG Remediation Layer ]
(Fast Binary Classification)                                       (Phi-3 Mini + ChromaDB)
    │                                                                        │
    └────────────────────────────────────┬───────────────────────────────────┘
                                         ▼
                             [ Streamlit SaaS Dashboard ]


   1. Ingestion & Processing: Custom ETL pipelines built on Apache Spark ingest and clean real-world regulatory texts. Legal-aware features are extracted using AST/Regex heuristics.
   2. Analysis Core: Data streams through Apache Kafka into the Spring Boot microservice environment. A localized XGBoost model handles sub-millisecond screening, passing high-risk items directly to a localized Phi-3 + ChromaDB Retrieval-Augmented Generation (RAG) loop.
   3. User Interface: A production-ready Streamlit application styled with custom CSS matching modern B2B SaaS standards, giving auditors interactive evidence-tracing views.

##  Tech Stack

* Machine Learning & AI: XGBoost, Hugging Face Transformers (Phi-3-mini), ChromaDB (Vector Store), LangGraph
* Data Engineering: Apache Spark, Pandas, Custom AST/Regex Parsers
* Backend Core: Java, Spring Boot, Apache Kafka
* Frontend: Streamlit, Custom CSS
* DevOps & MLOps: Docker, Docker Compose, GitHub Actions (CI/CD), Evidently AI (Drift Monitoring)

##  Getting Started## Prerequisites

* Docker and Docker Compose installed.
* Python 3.10+ (if running bare-metal components).
* Java 17+ (for local Spring Boot development).

## Quickstart Installation

   1. Clone the repository:
   
   git clone https://github.com
   cd ReguLens
   
   2. Configure Environment Variables:
   Create a .env file in the root directory:
   
   KAFKA_BOOTSTRAP_SERVERS=localhost:9092
   VECTOR_DB_DIR=./data/chromadb
   MODEL_PATH=./models/xgb_compliance_v1.json
   
   3. Spin up the Infrastructure:
   Launch Kafka, Zookeeper, the Spring Boot backend, and ChromaDB via Docker:
   
   docker-compose up -d --build
   
   4. Launch the Streamlit UI:
   
   cd frontend
   pip install -r requirements.txt
   streamlit run app.py
   
   
## 📊 Model & Ingestion Pipeline## Feature Engineering
Unlike naive text ingestion, ReguLens uses legal-aware token extraction:

* AST Parsing: Breaks down corporate policies to evaluate logical structure against statutory requirements.
* Regex Heuristics: Pinpoints cross-references, fine schedules, and deterministic jurisdictional rules (e.g., Article 30 GDPR record-keeping triggers).

## MLOps & Drift Control
The system tracks structural data drift and concept drift on incoming audit text logs via automated profiling. If statistical variations breach a pre-set threshold, alerts trigger an automated retraining workflow within the containerized MLOps runtime.



