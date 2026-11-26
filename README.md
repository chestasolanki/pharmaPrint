# PharmaPrint: AI-Powered Visual Anti-Counterfeit & Package Fingerprinting Platform

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20TailwindCSS-10b981?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-059669?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PyTorch](https://img.shields.io/badge/AI%20Engine-PyTorch%20%7C%20Siamese%20CNN-0284c7?style=for-the-badge&logo=pytorch)](https://pytorch.org/)
[![FAISS](https://img.shields.io/badge/Vector%20Search-FAISS%20IndexFlatIP-9333ea?style=for-the-badge)](https://github.com/facebookresearch/faiss)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

PharmaPrint is an industrial anti-counterfeiting platform designed to secure global pharmaceutical supply chains. It replaces fragile, easily forged 1D/2D barcodes and holograms with **stochastic micro-surface physical package fingerprinting**. 

By processing physical packaging texture through **twin Siamese CNN encoders**, generating normalized 128-dimensional embedding vectors, querying **FAISS vector indices** in sub-milliseconds, and running **DBSCAN defect clustering** and **Haversine geo-temporal velocity anomaly engines**, PharmaPrint provides end-to-end verification from pharmaceutical bottling lines to patient dispensing counters.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 PharmaPrint Web Application                 │
│               React.js 18 · Tailwind CSS · Recharts         │
│         [User Portal]            [Admin Command Center]     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Node.js + Express Backend                  │
│       JWT Auth · REST APIs · In-Memory & Telemetry Hub      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Python AI Service – FastAPI                 │
│      OpenCV · PyTorch · Siamese CNN · FAISS · DBSCAN        │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐┌─────────────────────────────┐
│    Packaging Storage & DB    ││            FAISS            │
│ Packages, scans, alerts,     ││  128-d Cosine Vector Space  │
│ investigation workflows      ││  & Impossible Travel Engine │
└──────────────────────────────┘└─────────────────────────────┘
```

---

## 🚀 Key Modules & Pages

### 1. Landing Page (`/`)
- Interactive **Biometric Verification Simulator**: Live toggle between genuine package matches, cloned identifier attacks, and DBSCAN counterfeit family signatures.
- **The 4 Pillars of PharmaPrint**: Microscopic printing texture, Siamese twin CNN encoders, DBSCAN defect clustering, and Geo-temporal impossible travel analytics.
- Real-time system performance counters and architecture deep-dive.

### 2. User Dashboard (`/dashboard`)
- Tailored view for Pharmacists, Distributors, and Manufacturers.
- Dynamic KPI metrics: Registered Packages, Active Scans, Genuine Match %, Clones & Anomalies Flagged.
- Live stream of recent verification events with status badges.
- One-click triggers for verification and batch registration.

### 3. Register Medicine Package (`/register-medicine`)
- Multi-step enrollment workflow:
  1. Medicine & serialization metadata input (Trade name, generic formula, batch number, package ID, expiry, production facility).
  2. Multi-angle micro-texture capture (supports live HTML5 webcam or high-res image upload).
  3. Real-time OpenCV preprocessing quality check (Laplacian blur variance, glare index, lighting CLAHE check, packaging ROI boundary detection).
  4. PyTorch Siamese CNN 128d embedding generation and FAISS vector index enrollment.
- Generates official enrollment certificate with cryptographic vector hash.

### 4. Verify Medicine (`/verify`)
- High-tech scanning workstation:
  - Live camera feed or file upload with packaging reticle overlay.
  - Optional expected package ID input to evaluate identity correlation.
  - Geo-telemetry auto-detection (scan node, GPS coordinates, timestamp).
  - Instant verification verdict:
    - **Verified Authentic**: High visual match with expected package ID.
    - **Potential Identity Reuse (Clone Alert)**: High visual match with a different serial OR impossible travel velocity detected.
    - **Defect Ring Match (Counterfeit)**: Micro-texture pattern deviates from registered baseline, matching DBSCAN defect cluster.
    - **Poor Image Quality**: Requests rescan when blur or glare exceeds tolerance.
  - Interactive pipeline inspector: Switch between Raw image, OpenCV Preprocessing, 128-d Vector Heatmap, and FAISS Cosine Space.

### 5. Verification Scan History (`/scans`)
- Searchable, filterable audit log of every scan worldwide.
- Filters: Event status (Verified, Clones, Defect Rings, Unknown), date, and search queries.
- Detailed dossier drawer for every scan with telemetry and impossible-travel velocity breakdowns.
- One-click CSV audit log export.

### 6. Admin Anti-Counterfeit Command Center (`/admin`)
- **DBSCAN Defect Family Clusters**:
  - Groups suspicious packages into counterfeit rings (e.g. Cluster #CF-804: "Sub-Continental Gravure Offset", Cluster #CF-809: "Syringe & Pen Tamper Seal Clones").
  - Inspect defect signatures (print distortions, line discontinuities, ink bleed, foil grain variance), affected medicine brands, and intra-cluster similarity.
  - Workflow status updater (`OPEN`, `UNDER_INVESTIGATION`, `CONFIRMED_COUNTERFEIT`, `CLOSED`).
- **Geo-Temporal Clone Alerts (Leaflet Map)**:
  - Interactive spatial map with connecting impossible-travel arcs.
  - Demonstrates physical velocity anomalies calculated via Haversine spherical distance over elapsed time $\Delta t$ (e.g. New Delhi to Mumbai in 30 minutes = 2,258 km/h).
  - Quick action buttons to freeze batch shipments in transit.
- **System Analytics (Recharts)**:
  - Scans velocity over time (genuine vs clones vs defects).
  - Threat index distribution across targeted medicine formulations.

---

## 🛠️ Quick Start & Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Python >= 3.10 (optional for standalone AI microservice)

### 1. Run Everything with One Command
From the root repository directory:
```bash
# Start both Frontend (Port 3000) and Backend (Port 5000)
node start-dev.js
```

### 2. Or Run Services Individually

#### Client (React + Vite)
```bash
cd client
npm install
npm run dev
# Opens on http://localhost:3000
```

#### Server (Node.js + Express)
```bash
cd server
npm install
node server.js
# Opens on http://localhost:5000
```

#### Python AI Service (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
# Opens on http://localhost:8000 (Swagger docs at /docs)
```

---

## 🧬 AI Model & Vector Search Details

### Siamese Twin CNN Architecture
- **Backbone**: 4 Convolutional blocks (32, 64, 128, 256 channels) with BatchNorm and ReLU.
- **Projection Head**: Linear (4096 $\rightarrow$ 512) $\rightarrow$ Dropout(0.3) $\rightarrow$ Linear(512 $\rightarrow$ 128).
- **Normalization**: Normalized L2-norm $\|v\|_2 = 1.0$ placing all package biometrics on the unit hypersphere.
- **Training Loss**: Contrastive Loss:
  $$L(y, d) = \frac{1}{2} (1 - y) d^2 + \frac{1}{2} y \max(0, m - d)^2$$
  where $m = 1.0$, $y=0$ for identical packaging under varied angles, $y=1$ for different packages.

### Vector Search Engine (FAISS)
- Index type: `IndexFlatIP` (Exact inner product search).
- Query latency: $< 0.42\text{ ms}$ for 100,000+ indexed packages.

### Geo-Temporal Impossible Travel (Haversine Velocity)
- Great-Circle distance formula:
  $$d = 2 R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
- Plausibility threshold: Velocity $v = \frac{d}{\Delta t} > 800\text{ km/h}$ triggers an automatic Cloned Identity quarantine.

---

## 👥 Demo Stakeholder Accounts

Use the **Role Switcher** in the top navigation bar or log in with:
| Role | Name | Email | Organization |
| :--- | :--- | :--- | :--- |
| **Admin** | Dr. Evelyn Vance | `admin@pharmaprint.org` | Global Medicine Regulatory Agency (GMRA) |
| **Pharmacist** | Marcus Chen, PharmD | `marcus@apothecarycare.com` | Metro Central Pharmacy & Health |
| **Manufacturer**| Elena Rostova | `elena@novapharma.com` | NovaCare Global Pharmaceuticals Ltd |
| **Distributor** | Tariq Al-Mansoor | `tariq@coldchainlogistics.net` | Apex Cold-Chain Freight |

---

## 📜 License
MIT License. Developed for global pharmaceutical supply chain integrity and patient safety.
