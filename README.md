# Operating System Call Behavioral Anomaly Detection & Mitigation System

A real-time, explainable Windows Host Intrusion Detection and Mitigation System (HIDS/EDR) built with **Python (FastAPI, psutil, SQLite)** and a modern **React (Vite, Tailwind CSS, Recharts)** SOC analyst dashboard.

---

## 1. System Architecture & Pipeline

The system continuously observes actual Windows processes running on your laptop, extracts behavioral telemetry, compares observed behavior against learned baseline profiles, detects anomalies, scores risk, and streams updates live over WebSockets and REST APIs.

```text
┌────────────────────────────────────────────────────────┐
│               REAL WINDOWS LAPTOP PROCESSES            │
└───────────────────────────┬────────────────────────────┘
                            │ psutil & OS API polling (2.0s)
                            ▼
┌────────────────────────────────────────────────────────┐
│         OBSERVATION & FEATURE EXTRACTION ENGINE        │
│  - PID, Name, Exe Path, Parent PID, Creation Time      │
│  - CPU & Memory Footprint, Thread Count                │
│  - Active Sockets & Ports (Network Monitor)            │
│  - Open File Handles & Command-Line Files (File Mon)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│          BEHAVIORAL BASELINE LEARNING ENGINE           │
│  - Welford's Algorithm (Running Mean & Variance)       │
│  - Learns normal CPU, RAM, Sockets, Files, Children    │
│  - Computes deviations & z-scores per application      │
│  - Stored in SQLite (`baselines` table)                │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│       STATISTICAL ANOMALY DETECTOR & RISK SCORER       │
│  - Transparent multi-factor deviation scoring          │
│  - Configurable Thresholds: 0-24 LOW, 25-49 MEDIUM,    │
│    50-74 HIGH, 75-100 CRITICAL                         │
│  - Generates clear, human-readable explanations        │
│  - Generates real-time alerts for High/Critical risks  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│       FASTAPI WEBSOCKET / REST BROADCAST & STORAGE     │
│  - Live streaming on `/ws/live` and `/ws/monitor`      │
│  - Parameterized SQLite logging (`soc_system.db`)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             REACT SOC ANALYST DASHBOARD (UI)           │
│  - Real-time updates without manual browser refresh    │
│  - Forensic Process Details & Activity Timelines       │
│  - Safe Demonstration Tests (PASS / FAIL validation)   │
│  - Controlled mitigation with protected-process guard  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
projss/
│
├── backend/
│   ├── main.py                    # FastAPI server entry point, WebSockets & lifespan
│   ├── config.py                  # Risk thresholds, intervals, protected processes
│   ├── requirements.txt           # Python backend dependencies
│   ├── soc_system.db              # SQLite persistent security database
│   │
│   ├── api/                       # Modular FastAPI REST routers
│   │   ├── processes.py           # GET /api/processes, /api/processes/{pid}
│   │   ├── anomalies.py           # GET /api/anomalies
│   │   ├── alerts.py              # GET /api/alerts, resolve & investigate
│   │   ├── logs.py                # GET /api/logs, /api/activity-logs
│   │   ├── tests.py               # POST /api/tests/*, GET /api/test-results
│   │   └── mitigation.py          # Controlled process termination & suspension
│   │
│   ├── monitoring/                # Real-time Windows observation modules
│   │   ├── process_monitor.py     # Safe process scanning via psutil
│   │   ├── behavior_collector.py  # Behavioral feature extraction
│   │   ├── file_activity_monitor.py # Open files & document access detection
│   │   ├── network_monitor.py     # Fast global socket and connection mapping
│   │   ├── monitoring_engine.py   # Continuous background monitoring loop
│   │   └── etw_tracer.py          # Windows ETW kernel system call interface
│   │
│   ├── detection/                 # Anomaly detection & baseline profiling
│   │   ├── baseline.py            # Running baseline statistics (Welford's alg)
│   │   ├── anomaly_detector.py    # Multi-vector behavioral detector
│   │   └── risk_scorer.py         # Explainable 0-100 risk scoring engine
│   │
│   ├── tests/                     # 3 Safe demonstration test cases
│   │   ├── file_activity_test.py  # Test 1: Rapid file operations sandbox
│   │   ├── process_creation_test.py # Test 2: Subprocess creation spikes
│   │   └── network_activity_test.py # Test 3: Localhost socket requests
│   │
│   └── database/                  # Database management & Pydantic models
│       ├── database.py            # SQLite connection & 7 parameterized tables
│       └── models.py              # Pydantic schemas for API requests/responses
│
├── src/                           # React SOC Analyst Frontend (Vite)
│   ├── components/                # Reusable SOC UI components
│   ├── pages/                     # Dashboard, LiveMonitoring, Tests, etc.
│   │   └── DemonstrationTests.jsx # Dedicated Safe Demonstration Tests page
│   ├── context/                   # SecurityContext (WebSocket + REST bridge)
│   └── App.jsx                    # Root layout, routing, and header banner
│
├── package.json                   # Frontend dependencies (React, Vite, Recharts)
└── README.md                      # Comprehensive project documentation
```

---

## 3. Installation & Prerequisites

### Prerequisites
* **Windows 10 or 11 (64-bit)**
* **Python 3.10+** (tested on Python 3.10, 3.11, 3.12)
* **Node.js (v18+)** and **npm**

### Step 1: Install Backend Dependencies
Open a PowerShell terminal in the project directory:
```powershell
pip install -r backend/requirements.txt
```
*(Dependencies: `fastapi`, `uvicorn`, `psutil`, `pydantic`, `websockets`)*

### Step 2: Install Frontend Dependencies
```powershell
npm install
```

---

## 4. Running the Project

### Start the FastAPI Backend
In Terminal 1 (from the project root):
```powershell
cd backend
python main.py
```
* The FastAPI server starts on `http://127.0.0.1:8000`.
* The background monitoring engine immediately begins scanning real Windows processes every 2 seconds.
* Live WebSockets stream at `ws://127.0.0.1:8000/ws/live` and `ws://127.0.0.1:8000/ws/monitor`.
* API documentation is interactively available at `http://127.0.0.1:8000/docs`.

### Start the React SOC Dashboard
In Terminal 2:
```powershell
npm run dev
```
* Open your browser at `http://localhost:5173`.
* The dashboard automatically establishes a WebSocket connection with the backend (`LIVE REAL-TIME WINDOWS PROCESS TELEMETRY`).
* The process table, anomaly alerts, threat gauge, and statistics will stream live without requiring page refreshes!

---

## 5. Behavioral Baseline Learning

When the monitoring engine initializes:
1. It starts in **`LEARNING`** mode.
2. For each running application, it continuously observes:
   * Average CPU usage & peak CPU spikes
   * Average Working Set (Memory RSS in MB)
   * Average thread count
   * Normal child process count (typically 0 for desktop apps)
   * Normal network connection count
   * Normal file activity frequency
3. Once an application has been observed across sufficient cycles (default: 8 cycles), the baseline transitions to **`NORMAL`** / **`ACTIVE`**.
4. All learned metrics are persisted in the SQLite database (`baselines` table) across reboots.

---

## 6. Live Process & File Access Monitoring

### Observing File Opening Events
If you open a file on your laptop (for example, opening `test.txt` in Notepad):
1. The **`FileActivityMonitor`** inspects the process's command line arguments and active file handles.
2. The system associates `test.txt` directly with `notepad.exe` (PID: XXXX).
3. The event is recorded in the `behavior_events` database table and streamed to the dashboard under **System Calls** and **Activity Logs**:
   ```text
   Process: notepad.exe
   PID: 4521
   Activity: File access
   File: test.txt
   Behavior: NORMAL
   Risk: LOW
   ```

---

## 7. Three Safe Demonstration Test Cases (Section 8, 9, 10)

The project includes a dedicated **Safe Demonstration Tests** page (`/demonstration-tests`) accessible from the sidebar and header banner. These tests demonstrate the anomaly detector deterministically and safely.

> [!NOTE]
> **Safety Guarantee**: These tests are 100% safe. They **do not download malware, execute malicious code, or touch user files**. All file activity is confined to an isolated temporary sandbox (`backend/temp_test_dir/`) and cleaned up immediately. Network tests use only loopback localhost (`127.0.0.1`).

### Test 1 — Unusual File Activity
* **Normal Behavior**: Normal background utilities perform 3–5 file operations/min.
* **Test Action**: Generates 100+ rapid file create, write, and read operations in `backend/temp_test_dir/`, then cleans them up.
* **Expected Result**: `ANOMALOUS` (Risk: HIGH / 70+).
* **Reason**: *"File activity significantly exceeds the learned baseline."*
* **API Trigger**: `POST /api/tests/file-activity`

### Test 2 — Unusual Process Creation
* **Normal Behavior**: A single utility process runs with 0 child processes.
* **Test Action**: Spawns 6 short-lived, harmless Python subprocesses for 1.0 second and terminates them cleanly.
* **Expected Result**: `ANOMALOUS` (Risk: HIGH / 75+).
* **Reason**: *"Process creation significantly exceeds the learned baseline."*
* **API Trigger**: `POST /api/tests/process-creation`

### Test 3 — Unusual Network Activity
* **Normal Behavior**: Basic utilities have 0 active network connections.
* **Test Action**: Sets up an ephemeral localhost server and generates 35 rapid loopback socket handshakes to `127.0.0.1`.
* **Expected Result**: `ANOMALOUS` (Risk: MEDIUM or HIGH).
* **Reason**: *"Network activity significantly exceeds the learned baseline."*
* **API Trigger**: `POST /api/tests/network-activity`

---

## 8. Test Result Validation & Authentic PASS / FAIL

In the **Test Results Validation Panel**:
* Results are recorded in the SQLite `test_results` table.
* **Authentic Evaluation**: The result badge shows **`PASS`** **only if the detector's real classification matches the expected behavior**. If the detector fails to identify the anomaly, it flags **`FAIL`** and provides diagnostic telemetry.

| Test Name | Expected Behavior | Observed Behavior | Risk Score | Detected Classification | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST 1: File Activity** | ANOMALOUS | 100 file operations (120 ops/sec) | 78 / 100 | ANOMALOUS | **PASS** |
| **TEST 2: Process Creation**| ANOMALOUS | Spawned 6 child processes | 82 / 100 | ANOMALOUS | **PASS** |
| **TEST 3: Network Activity**| ANOMALOUS | 35 loopback sockets to 127.0.0.1 | 65 / 100 | ANOMALOUS | **PASS** |

---

## 9. Risk Scoring & Configurable Thresholds

The `RiskScorer` engine computes a transparent score from **0 to 100**:
$$\text{Risk Score} = f(\Delta \text{CPU}, \Delta \text{RAM}, \Delta \text{Children}, \Delta \text{Sockets}, \Delta \text{Files}, \text{Ancestry Heuristics})$$

### Configurable Thresholds (`backend/config.py`):
* **0 – 24**: **`LOW` / `NORMAL`** (Safe, routine system operation)
* **25 – 49**: **`MEDIUM` / `WARNING`** (Noticeable deviation; monitored closely)
* **50 – 74**: **`HIGH RISK`** (Significant deviation or suspicious heuristics; alert generated)
* **75 – 100**: **`CRITICAL RISK`** (Severe deviation, unauthorized process spawning, or restricted path access)

---

## 10. Controlled Mitigation & Protected Process Safeguards

The system strictly avoids unverified automated termination.
1. The analyst reviews the process forensic modal.
2. Clicking **Terminate** triggers a confirmation modal displaying the process name, PID, and anomaly reasons.
3. The backend validates that:
   * The process is still active.
   * The process is **NOT** a protected Windows core system process (`System`, `csrss.exe`, `lsass.exe`, `services.exe`, `explorer.exe`, `svchost.exe`, etc.) or the SOC monitoring engine itself.
4. If valid, the backend terminates the process and creates a permanent entry in `mitigation_actions` and `activity_logs`.

---

## 11. System Call Architecture & Future Windows ETW Integration

This system monitors genuine Windows process telemetry, open handles, and socket states. To transition from process-level observation to raw kernel system-call tracing:

* **Kernel Protection on 64-bit Windows**: Direct SSDT (System Service Descriptor Table) hooking is blocked by Kernel Patch Protection (PatchGuard).
* **The Supported Windows Mechanism**: **Event Tracing for Windows (ETW)** kernel logger:
  * Provider: `Microsoft-Windows-Kernel-Process` (GUID: `{22FB2AD6-0E17-4223-A0E7-219A5EB929DA}`)
  * Provider: `Microsoft-Windows-Kernel-File` (GUID: `{EDD08927-9CC4-4E65-B970-C2560FB5C289}`)
* **Architectural Hook**: The project provides `backend/monitoring/etw_tracer.py` defining the `SystemCallTracerInterface`. This enables dropping in native ETW or KrabsETW bindings for low-level `NtCreateFile` / `NtAllocateVirtualMemory` tracing without refactoring the monitoring engine or frontend.
