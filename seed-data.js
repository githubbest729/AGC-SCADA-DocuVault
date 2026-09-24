/* ==========================================================================
   seed-data.js — AGC SCADA DocuVault
   Realistic, domain-specific sample documents (one per category) used to
   populate IndexedDB on first load, so the Markdown renderer, table
   styling, and PDF export can be exercised immediately without having to
   write real documentation first.

   Depends on: database.js (DocuVaultDB). Load this file AFTER database.js
   and BEFORE app.js in index.html.
   ========================================================================== */

const SEED_DOCUMENTS = [
  /* ------------------------------------------------------------------ */
  /* 1. Network Architecture                                             */
  /* ------------------------------------------------------------------ */
  {
    category: "Network Architecture",
    title: "Jebel Ali WTP - SCADA Ring Topology",
    content: `# Jebel Ali WTP — SCADA Ring Topology

**Project:** Jebel Ali Water Treatment Plant — Phase 1 Expansion
**System:** Redundant Fiber Optic Device-Level Ring (DLR)
**Prepared by:** Christian Tosita Espinosa, SCADA Engineer
**Date:** \`<DD-MMM-YYYY>\`

## 1. Topology Overview

The plant SCADA network is built on a **redundant fiber optic ring** using Allen-Bradley/Rockwell \`Stratix 5700\` managed switches configured for **Device Level Ring (DLR)** protocol. This provides sub-20ms fault recovery in the event of a single fiber break or switch failure, with zero manual intervention required.

- **Ring Supervisor:** SW-RING-01 (Stratix 5700, port Gi1/1 & Gi1/2 configured as ring ports)
- **Media:** 6-core OM3 multimode fiber, LC connectors, ST-to-LC patch panels at each MCC
- **Redundancy Protocol:** DLR (IEC 62439-3 compliant, Rockwell native — NOT Spanning Tree)
- **Backbone Speed:** 1 Gbps fiber uplinks; 100 Mbps copper drops to field I/O

## 2. Network Segments

| Segment | VLAN | Subnet | Purpose |
|---|---|---|---|
| Control Ring | 10 | 172.16.10.0/24 | PLC-to-PLC, PLC-to-remote I/O |
| SCADA/HMI | 20 | 172.16.20.0/24 | SCADA servers, engineering workstations |
| Field HMI | 21 | 172.16.21.0/24 | Local operator panels at MCC rooms |
| DMZ | 30 | 172.16.30.0/29 | Historian replication to IT, firewall interconnect |

## 3. IP Address Assignments

| Device Tag | Description | IP Address | Subnet Mask | Ring Port | Notes |
|---|---|---|---|---|---|
| PLC-101-A | Primary ControlLogix (Intake) | 172.16.10.11 | 255.255.255.0 | Ring Node 1 | Redundant chassis, primary owner |
| PLC-101-B | Redundant ControlLogix (Intake) | 172.16.10.12 | 255.255.255.0 | Ring Node 1 | ControlLogix redundancy module (1756-RM2) |
| PLC-102 | RO Skid PLC | 172.16.10.20 | 255.255.255.0 | Ring Node 2 | Siemens S7-1500 remote rack |
| SCADA-SVR-01 | Wonderware Primary Server | 172.16.20.10 | 255.255.255.0 | — | Active node |
| SCADA-SVR-02 | Wonderware Standby Server | 172.16.20.11 | 255.255.255.0 | — | Hot standby, auto-failover |
| HIST-01 | Historian Server | 172.16.20.15 | 255.255.255.0 | — | Wonderware Historian, 1s resolution |
| HMI-FIELD-01 | Intake Pump Station HMI | 172.16.21.10 | 255.255.255.0 | Ring Node 1 | PanelView Plus 7 |
| HMI-FIELD-02 | RO Skid Local HMI | 172.16.21.11 | 255.255.255.0 | Ring Node 2 | Siemens Comfort Panel |
| SW-RING-01 | Ring Supervisor Switch | 172.16.10.2 | 255.255.255.0 | Supervisor | Stratix 5700, MCC-01 |
| SW-RING-02 | Ring Node Switch | 172.16.10.3 | 255.255.255.0 | Ring Node | Stratix 5700, MCC-02 |

## 4. Fiber Ring Diagram

![DLR fiber ring topology diagram](data:image/png;base64,PLACEHOLDER_PASTE_YOUR_DIAGRAM_HERE)

*(Paste the actual ring topology diagram exported from the network drawing package here — Ctrl+V in the editor.)*

## 5. Failover Behavior

> ⚠️ **Important:** DLR ring supervisor election is automatic. If SW-RING-01 fails, SW-RING-02 assumes the supervisor role within one scan cycle. Do NOT manually force supervisor role changes during live production without a documented MOC (Management of Change).

## 6. Revision History

| Rev | Date | Description | By |
|---|---|---|---|
| A | | Initial issue for construction | C. Espinosa |
`,
  },

  /* ------------------------------------------------------------------ */
  /* 2. PLC Configurations                                                */
  /* ------------------------------------------------------------------ */
  {
    category: "PLC Configurations",
    title: "Siemens TIA Portal V21 & Allen-Bradley Modbus Mapping",
    content: `# Siemens TIA Portal V21 & Allen-Bradley Modbus Mapping

**Project:** Jebel Ali WTP — Phase 1
**Bridge Type:** Allen-Bradley ControlLogix (Master) ↔ Siemens S7-1500 (Remote Slave via Modbus TCP)
**Prepared by:** Christian Tosita Espinosa, SCADA Engineer
**Date:** \`<DD-MMM-YYYY>\`

## 1. Purpose

The RO Skid is supplied as a packaged unit with a native Siemens \`S7-1500\` CPU (TIA Portal V21 project). Since the plant-wide SCADA and process PLCs are Allen-Bradley \`ControlLogix\`, communication between the two platforms is bridged using **Modbus TCP**, with the Siemens CPU acting as the Modbus TCP **server** (slave) and the ControlLogix acting as the Modbus TCP **client** (master) via the \`MSG\` instruction and a Modbus TCP AOI (Add-On Instruction).

## 2. Hardware / Software Versions

| Item | Detail |
|---|---|
| Master PLC | Allen-Bradley ControlLogix 5580, firmware v33 |
| Master Programming Software | Studio 5000 Logix Designer v33 |
| Slave PLC | Siemens S7-1500 CPU 1515-2 PN |
| Slave Programming Software | TIA Portal V21 |
| Modbus Server Block (Siemens) | \`MB_SERVER\` (native S7-1500 instruction, no CP required) |
| Modbus Client AOI (Rockwell) | \`AB_Modbus_TCP_Client\` (Rockwell Sample Code Library) |
| Polling Interval | 500 ms |

## 3. Communication Parameters

- **Siemens S7-1500 IP:** 172.16.10.20, Port 502 (Modbus TCP default)
- **Connection Type:** Modbus TCP, single persistent connection, Unit ID 1
- **Byte Order:** Big-endian (Siemens default) — ⚠️ ControlLogix Modbus AOI must swap word order for 32-bit values

## 4. Modbus Holding Register Map (40001+)

| Register (Modbus) | PLC Tag (Siemens side) | Description | Data Type | R/W | Scale |
|---|---|---|---|---|---|
| 40001 | \`HMI_Pump1_RunCmd\` | Pump 1 Run Command (1 = Run, 0 = Stop) | BOOL (packed) | R/W | — |
| 40002 | \`HMI_Pump2_RunCmd\` | Pump 2 Run Command | BOOL (packed) | R/W | — |
| 40003–40004 | \`HMI_Pump1_SpeedSP\` | Pump 1 VFD Speed Setpoint | REAL (Float32) | R/W | 0–100.0 % |
| 40005–40006 | \`HMI_Pump2_SpeedSP\` | Pump 2 VFD Speed Setpoint | REAL (Float32) | R/W | 0–100.0 % |
| 40007–40008 | \`PV_Pump1_Speed_FBK\` | Pump 1 Actual Speed Feedback | REAL (Float32) | R | 0–100.0 % |
| 40009–40010 | \`PV_Pump2_Speed_FBK\` | Pump 2 Actual Speed Feedback | REAL (Float32) | R | 0–100.0 % |
| 40011 | \`Fault_Pump1_Status\` | Pump 1 Fault Word (bit-mapped) | INT (bitmap) | R | See §5 |
| 40012 | \`Fault_Pump2_Status\` | Pump 2 Fault Word (bit-mapped) | INT (bitmap) | R | See §5 |
| 40013–40014 | \`PV_RO_Feed_Pressure\` | RO Feed Pressure | REAL (Float32) | R | 0–10 bar |
| 40015–40016 | \`PV_RO_Permeate_Flow\` | RO Permeate Flow | REAL (Float32) | R | 0–500 m3/h |

## 5. Fault Word Bit Mapping (Registers 40011 / 40012)

| Bit | Fault Description |
|---|---|
| 0 | Motor overload trip |
| 1 | VFD fault (general) |
| 2 | Low suction pressure interlock |
| 3 | High discharge pressure interlock |
| 4 | Local/Remote switch in Local (SCADA command blocked) |
| 5 | Emergency stop active |

## 6. Configuration Notes

\`\`\`
// ControlLogix MSG instruction configuration (per pump skid connection)
Message Type   : Modbus Read/Write (via AB_Modbus_TCP_Client AOI)
Target IP      : 172.16.10.20
Target Port    : 502
Unit ID        : 1
Timeout        : 2000 ms
Retry Count    : 3
\`\`\`

> ⚠️ **Critical:** Siemens \`MB_SERVER\` block must be called every scan (in \`OB1\` or a cyclic interrupt OB) or the Modbus TCP connection will silently drop after the configured watchdog timeout, causing the SCADA to display stale RO skid data without an obvious comms-fail alarm. Confirm a dedicated Comms Fail alarm is configured in Wonderware independent of the fault word above.

## 7. Revision History

| Rev | Date | Description | By |
|---|---|---|---|
| A | | Initial issue | C. Espinosa |
`,
  },

  /* ------------------------------------------------------------------ */
  /* 3. HMI/SCADA Design Specs                                            */
  /* ------------------------------------------------------------------ */
  {
    category: "HMI/SCADA Design Specs",
    title: "Wonderware System Platform - Graphic & Alarm Philosophy",
    content: `# Wonderware System Platform — Graphic & Alarm Philosophy

**Project:** Jebel Ali WTP — Phase 1
**Standard Reference:** ISA-101 High-Performance HMI / ASM Consortium Guidelines
**Prepared by:** Christian Tosita Espinosa, SCADA Engineer
**Date:** \`<DD-MMM-YYYY>\`

## 1. Purpose

This document defines the graphic design standard and alarm philosophy for all Wonderware System Platform (InTouch) screens on this project, in line with **ISA-101** high-performance HMI principles: minimal color, process-centric layout, and alarms that draw attention only when genuinely abnormal.

## 2. Color Palette (High-Performance HMI)

| Element | Color | Hex | Usage Rule |
|---|---|---|---|
| Screen background | Cool grey | \`#BFC4C9\` | Default for all process graphics — low visual noise |
| Piping (normal/inactive) | Dark grey | \`#5A6069\` | Static, non-animated |
| Piping (active flow) | Blue | \`#1F6FB2\` | Only when flow is confirmed by a live PV, not just a run command |
| Equipment running | Green (muted) | \`#4C8C4A\` | Confirmed running feedback only — never on command alone |
| Equipment stopped | Grey outline | \`#8A8F94\` | Neutral, not alarmed |
| Unacknowledged critical alarm | Bright red (flashing) | \`#E4002B\` | Reserved exclusively for Critical tier — see §3 |
| Acknowledged alarm | Yellow (static) | \`#F2C300\` | No flashing once acknowledged |
| Operator data entry field | White w/ blue border | \`#FFFFFF\` / \`#1F6FB2\` | Clearly distinguishes writable fields from PVs |

> ⚠️ Bright red is **reserved exclusively** for unacknowledged Critical alarms. Do not use red anywhere else in the graphic library (not for "stopped" equipment, not for decorative headers) — overuse of red is the single most common cause of alarm fatigue on legacy SCADA systems.

## 3. Alarm Severity Tiers

| Tier | Color / Indication | Example Condition | Required Operator Response Time |
|---|---|---|---|
| **Critical** | Flashing bright red \`#E4002B\` + horn | Intake wet-well high-high level, RO high pressure trip | Immediate — < 1 minute |
| **High** | Solid orange \`#FF8200\` | Pump fault, single-pump loss with duty standby not yet started | < 5 minutes |
| **Medium** | Solid yellow \`#F2C300\` | Filter differential pressure high, chemical tank low level | < 30 minutes |
| **Low** | Solid cyan \`#00A3C4\` | Instrument out-of-calibration-due reminder, non-critical comms degraded | Next operator round (≤ 4 hours) |

## 4. Alarm Rationalization Rules

- Every alarm must map to a **documented operator action** — alarms with no defined response are to be removed or demoted to an event log entry.
- No more than **6 Critical alarms** should be active plant-wide simultaneously under a single upset condition (per ISA-18.2 alarm flood guidance) — if a single trip cascades into more, sequence/first-out logic must suppress downstream duplicates.
- Alarm setpoints must include hysteresis (deadband) to prevent chattering — minimum 2% of span unless process-specific justification is documented.

## 5. Screen Hierarchy (ASM Level 1–3)

1. **Level 1 — Overview:** Plant-wide mimic, KPI summary, no more than 8 key values visible.
2. **Level 2 — Process Area:** Intake, RO Train, Chemical Dosing, Clearwell — one screen per functional area.
3. **Level 3 — Equipment Detail/Faceplate:** Individual pump/VFD faceplate popup with full control, tuning, and fault detail.

![HMI overview screen mockup](data:image/png;base64,PLACEHOLDER_PASTE_SCREENSHOT_HERE)

## 6. Revision History

| Rev | Date | Description | By |
|---|---|---|---|
| A | | Initial issue | C. Espinosa |
`,
  },

  /* ------------------------------------------------------------------ */
  /* 4. User Manuals                                                      */
  /* ------------------------------------------------------------------ */
  {
    category: "User Manuals",
    title: "GE iFIX Operator Standard Operating Procedure (SOP)",
    content: `# GE iFIX Operator Standard Operating Procedure (SOP)
## Intake Pump Station — Auto to Manual Transition

**Project:** Jebel Ali WTP — Phase 1
**System:** GE Digital iFIX 6.5
**Prepared by:** Christian Tosita Espinosa, SCADA Engineer
**Date:** \`<DD-MMM-YYYY>\`

## 1. Purpose

This SOP describes the standard procedure for a plant operator to log into the GE iFIX SCADA application, navigate to the Intake Pump Station overview screen, and safely transition the main intake pumps from **Auto** to **Manual** control mode.

> 🛑 **SAFETY WARNING — READ BEFORE PROCEEDING**
> Transitioning a pump from Auto to Manual removes it from automatic level/pressure control. The operator assumes full responsibility for monitoring wet-well level continuously while in Manual mode. Do NOT leave a pump in Manual mode unattended. Notify the Shift Supervisor before and after the transition.

## 2. Prerequisites

- Valid iFIX operator login credentials (minimum **Operator** security level)
- Confirm no active Critical alarms on the Intake Pump Station screen before proceeding
- Two-way radio or phone contact with the Shift Supervisor

## 3. Step-by-Step Procedure

### 3.1 Logging In

1. On the SCADA workstation, double-click the **iFIX WorkSpace** icon on the desktop.
2. At the iFIX Startup screen, select **Run** to launch WorkSpace in runtime mode.
3. At the Security Login prompt, enter your assigned **User ID** and **Password**.
4. Confirm your name and security level appear in the top-right status bar of the WorkSpace.

### 3.2 Navigating to the Intake Pump Station Screen

1. From the main navigation menu bar, select **Process Overview**.
2. Click the **Intake Pump Station** navigation button (top-left icon group).
3. Confirm the screen title bar reads: \`INTAKE PUMP STATION — OVERVIEW\`.
4. Verify current wet-well level and both pump statuses are visible and updating (values should not appear frozen/greyed out — greyed values indicate a communications fault, which must be reported before proceeding).

### 3.3 Transitioning Pump 1 from Auto to Manual

1. On the Intake Pump Station screen, click the **Pump 1** graphic to open the equipment faceplate.
2. On the faceplate, locate the **Auto/Manual** toggle control in the top-right of the popup.
3. Before switching, note the current VFD speed feedback displayed on the faceplate — you will need to match this value manually to avoid a sudden process disturbance.
4. Click **Manual**. A confirmation dialog will appear:

   > \`Confirm: Switch Pump 1 to MANUAL control? Operator will assume direct speed control.\`

5. Click **YES** only after confirming with the Shift Supervisor.
6. Once in Manual, use the **Speed Setpoint** entry field on the faceplate to enter the desired speed (0–100%), matching the pre-transition value noted in Step 3 unless directed otherwise.
7. Click **Enter/Apply**. Confirm the **Speed Feedback** value tracks the new setpoint within approximately 5–10 seconds.

### 3.4 Returning to Auto (End of Manual Operation)

1. On the Pump 1 faceplate, click **Auto**.
2. Confirm the dialog:

   > \`Confirm: Return Pump 1 to AUTO control? SCADA will resume automatic level/pressure regulation.\`

3. Click **YES**.
4. Monitor the pump for 2–3 minutes to confirm stable automatic operation before leaving the screen.

## 4. Troubleshooting

| Symptom | Possible Cause | Action |
|---|---|---|
| Faceplate will not open | Insufficient security level | Contact SCADA Engineer to verify user security group |
| Values frozen/greyed out | PLC communications fault | Do NOT attempt mode change — report to SCADA Engineer immediately |
| Manual speed entry rejected | Value outside 0–100% range, or entry field locked by another active session | Verify entry value; check for a second logged-in operator session |

## 5. Sign-Off

**Operator Name:** ______________________
**Date/Time:** ______________________
**Shift Supervisor Notified (Y/N):** ______________________
`,
  },

  /* ------------------------------------------------------------------ */
  /* 5. Site Notes                                                        */
  /* ------------------------------------------------------------------ */
  {
    category: "Site Notes",
    title: "Field Loop Calibration & Punchlist - WTP Phase 1",
    content: `# Field Loop Calibration & Punchlist — WTP Phase 1

**Site:** Jebel Ali Water Treatment Plant
**Date:** \`<DD-MMM-YYYY>\`
**Engineer:** Christian Tosita Espinosa, SCADA Engineer
**Area:** Intake Pump Station & RO Train 1

## 1. Summary

Continued loop calibration and I/O checkout for RO Train 1 instrumentation. Encountered wiring discrepancy on the radar level transmitter (LT-201) requiring vendor drawing revision. VFD parameterization for Pump 1/2 deferred pending updated motor nameplate data from mechanical contractor.

## 2. Loop Checks Completed Today

| Loop Tag | Description | Range | As-Found | As-Left | Result |
|---|---|---|---|---|---|
| PT-101 | Intake Wet Well Pressure | 0–10 bar | 0.02 bar | 0.00 bar | ✅ Pass |
| FT-105 | Intake Flow Transmitter | 0–500 m3/h | 4.6 mA offset | 4.00 mA | ✅ Pass (adjusted zero) |
| LT-201 | RO Feed Tank Radar Level | 0–5 m | — | — | ❌ **Failed — see punchlist item 1** |
| PT-210 | RO Feed Pressure | 0–10 bar | 0.01 bar | 0.00 bar | ✅ Pass |
| TT-301 | RO Permeate Temperature | 0–50 °C | 24.8 °C | 24.9 °C | ✅ Pass (verified vs. reference thermometer) |

## 3. Punchlist — Open Items

- [ ] **LT-201 wiring discrepancy** — radar transmitter terminal block wired per superseded drawing rev; 4–20 mA loop reads open circuit. Vendor to confirm correct terminal assignment (Rev C drawing pending from instrument supplier).
- [ ] **VFD parameter configuration — Pump 1 & Pump 2** — ABB ACS880 drives on-site but not yet parameterized (motor FLA, accel/decel ramps, PID gains pending final motor nameplate confirmation from mechanical contractor).
- [ ] **Faulty radar level transmitter wiring — RO Feed Tank** — duplicate of LT-201 above; flagged separately for E&I subcontractor closeout tracking.
- [ ] **Cable tray labeling** — Instrument cable tray run between MCC-02 and Junction Box JB-14 missing tray labels per drawing E-405.
- [ ] **Junction box JB-09 gland plate** — unused cable glands not yet blanked off; open to weather ingress, flagged to E&I foreman.
- [ ] **HMI-FIELD-02 mounting** — local Siemens Comfort Panel at RO skid physically installed but network drop not yet terminated.

## 4. Notes / Observations

> Field verified that PT-101 and PT-210 transmitters share the same calibration certificate batch — recommend spot-checking one additional unit from the same batch before final loop sign-off, per QA sampling procedure.

- Ambient temperature in MCC-02 room measured at 34°C — slightly above the 30°C VFD derating threshold noted in the ABB ACS880 manual; flagged for HVAC contractor to verify room cooling capacity before full-load commissioning.
- Contractor requested clarification on whether FT-105 zero adjustment requires a formal MOC — confirmed **not required** (calibration within tolerance, not a setpoint or logic change).

## 5. Sign-Off

| Loop Tag | Technician | Witnessed By | Date |
|---|---|---|---|
| PT-101 | | | |
| FT-105 | | | |
| PT-210 | | | |
| TT-301 | | | |

**Prepared by:** Christian Tosita Espinosa, SCADA Engineer
`,
  },
];

/* ==========================================================================
   seedDatabase()
   Populates IndexedDB with the sample documents above, but ONLY if the
   database is currently empty — this runs safely on every app load without
   ever duplicating or overwriting real documents once you start writing
   your own.
   ========================================================================== */

async function seedDatabase() {
  if (typeof DocuVaultDB === "undefined") {
    console.warn("[seed-data] DocuVaultDB is not loaded — make sure database.js loads before seed-data.js.");
    return { seeded: false, count: 0, reason: "no-db" };
  }

  const existing = await DocuVaultDB.getAllDocuments();
  if (existing.length > 0) {
    return { seeded: false, count: 0, reason: "not-empty" };
  }

  const created = [];
  for (const doc of SEED_DOCUMENTS) {
    // eslint-disable-next-line no-await-in-loop
    const saved = await DocuVaultDB.addDocument({
      title: doc.title,
      category: doc.category,
      content: doc.content,
    });
    created.push(saved);
  }

  return { seeded: true, count: created.length, docs: created };
}

/**
 * forceReseedDatabase()
 * Convenience helper for testing: wipes ALL existing documents and reloads
 * the 5 sample documents from scratch, regardless of current DB state.
 * Not wired to any UI button by default — call it from the browser console
 * (window.forceReseedDatabase()) when you want a clean slate to test
 * Markdown rendering, table styling, or PDF export changes.
 */
async function forceReseedDatabase() {
  if (typeof DocuVaultDB === "undefined") {
    console.warn("[seed-data] DocuVaultDB is not loaded.");
    return { seeded: false, count: 0 };
  }
  const existing = await DocuVaultDB.getAllDocuments();
  for (const doc of existing) {
    // eslint-disable-next-line no-await-in-loop
    await DocuVaultDB.deleteDocument(doc.id);
  }
  const created = [];
  for (const doc of SEED_DOCUMENTS) {
    // eslint-disable-next-line no-await-in-loop
    const saved = await DocuVaultDB.addDocument({
      title: doc.title,
      category: doc.category,
      content: doc.content,
    });
    created.push(saved);
  }
  console.log(`[seed-data] Force-reseeded ${created.length} sample documents.`);
  return { seeded: true, count: created.length, docs: created };
}

// Exposed globally so it can be triggered manually from the browser console
// during testing, without needing a dedicated UI button.
window.forceReseedDatabase = forceReseedDatabase;
