/* ==========================================================================
   app.js — AGC SCADA DocuVault
   Vanilla JS application logic. No frameworks, no build step.
   ========================================================================== */

(() => {
  "use strict";

  /* ---------------------------------------------------------------------
     Constants
     --------------------------------------------------------------------- */

  const CATEGORIES = [
    "Network Architecture",
    "PLC Configurations",
    "HMI/SCADA Design Specs",
    "User Manuals",
    "Site Notes",
  ];

  const AUTHOR_NAME = "Christian Tosita Espinosa";
  const AUTHOR_TITLE = "SCADA Engineer";
  const COMPANY_NAME = "Al Gurg Automation & Controls";
  const AUTOSAVE_DELAY_MS = 1200;

  const TEMPLATES = [
    {
      key: "siemens-ip-table",
      name: "Siemens PLC IP Address Table",
      desc: "Standard IP allocation table for S7 CPUs, HMIs, and switches.",
      category: "PLC Configurations",
      title: "Siemens PLC IP Address Table",
      content:
`# Siemens PLC IP Address Table

**Project:** \`<Project Name>\`
**Panel / Cabinet:** \`<Panel ID>\`
**Prepared by:** ${AUTHOR_NAME}, ${AUTHOR_TITLE}
**Date:** \`<DD-MMM-YYYY>\`

## Network Summary

- **Subnet:** 192.168.0.0/24
- **Default Gateway:** 192.168.0.1
- **Managed Switch:** \`<Model / Asset Tag>\`
- **VLAN:** \`<VLAN ID, if applicable>\`

## Device IP Table

| Device Tag | Device Type        | IP Address     | Subnet Mask      | Rack/Slot | MAC Address         | Notes                  |
|------------|--------------------|----------------|------------------|-----------|---------------------|-------------------------|
| PLC-101    | S7-1500 CPU        | 192.168.0.10   | 255.255.255.0    | 0/1       | 00-1B-1B-00-00-01   | Main process controller |
| PLC-102    | S7-1200 CPU        | 192.168.0.11   | 255.255.255.0    | 0/1       | 00-1B-1B-00-00-02   | Remote skid PLC         |
| HMI-101    | Comfort Panel KTP  | 192.168.0.20   | 255.255.255.0    | —         | 00-1B-1B-00-00-10   | Local operator panel    |
| SW-101     | Scalance Switch    | 192.168.0.2    | 255.255.255.0    | —         | 00-1B-1B-00-00-F0   | 8-port managed          |
| ET200-01   | ET200SP Remote I/O | 192.168.0.30   | 255.255.255.0    | —         | 00-1B-1B-00-00-30   | Distributed I/O node 1  |

## Modbus / Fieldbus Notes

| Register Range | Function               | Data Type | Access     |
|------------------|-----------------------|-----------|------------|
| 40001–40050      | Analog process values | Float32   | Read Only  |
| 40051–40080      | Setpoints              | Float32   | Read/Write |
| 00001–00032      | Digital status bits    | Bool      | Read Only  |

## Revision History

| Rev | Date | Description | By |
|-----|------|-------------|----|
| A   |      | Initial issue |    |

---
*Paste network diagrams or switch topology screenshots below (Ctrl+V):*
`,
    },
    {
      key: "wonderware-architecture",
      name: "Wonderware System Architecture",
      desc: "AVEVA/Wonderware System Platform node & Galaxy layout overview.",
      category: "HMI/SCADA Design Specs",
      title: "Wonderware System Architecture Overview",
      content:
`# Wonderware / AVEVA System Platform — Architecture Overview

**Project:** \`<Project Name>\`
**Galaxy Name:** \`<GalaxyName>\`
**Prepared by:** ${AUTHOR_NAME}, ${AUTHOR_TITLE}
**Date:** \`<DD-MMM-YYYY>\`

## 1. Purpose

Describe the scope of the SCADA system, the process area covered, and the primary control objectives.

## 2. System Node Inventory

| Node Name    | Role                          | OS              | IP Address    | Notes                     |
|--------------|------------------------------|-----------------|---------------|----------------------------|
| GR-SVR-01    | Galaxy Repository (Primary)  | Windows Server  | 192.168.10.10 | Redundant pair with SVR-02 |
| GR-SVR-02    | Galaxy Repository (Standby)  | Windows Server  | 192.168.10.11 | Hot standby                |
| APP-ENG-01   | Application Engine           | Windows Server  | 192.168.10.20 | Runs core control objects  |
| HIST-01      | Historian Server             | Windows Server  | 192.168.10.30 | Wonderware Historian       |
| CLIENT-01    | InTouch Operator Client       | Windows 10       | 192.168.10.40 | Control room station 1     |
| CLIENT-02    | InTouch Operator Client       | Windows 10       | 192.168.10.41 | Control room station 2     |

## 3. Redundancy Strategy

- Galaxy Repository: \`<Active/Standby | Not Redundant>\`
- Application Engine: \`<Failover group name>\`
- I/O Server / DAS: \`<Redundant DAS pair details>\`

## 4. I/O Server / Communication Drivers

| DAS / OI Server     | Protocol   | Target Device      | Poll Rate |
|-----------------------|-----------|----------------------|-----------|
| OI.SiemensS7           | S7 TCP/IP | PLC-101, PLC-102     | 500 ms    |
| OI.Modbus               | Modbus TCP| Remote metering skid | 1000 ms   |

## 5. Network Diagram

*Paste the system architecture diagram / network topology screenshot below (Ctrl+V):*

## 6. Historian Retention Policy

| Data Class        | Resolution | Retention |
|--------------------|-----------|-----------|
| Process trends      | 1 sec     | 90 days   |
| Alarms & events      | Event-based | 1 year  |

## Revision History

| Rev | Date | Description | By |
|-----|------|-------------|----|
| A   |      | Initial issue |    |
`,
    },
    {
      key: "network-architecture",
      name: "Site Network Architecture Diagram Notes",
      desc: "General OT network layout, VLANs, firewalls, and switch documentation.",
      category: "Network Architecture",
      title: "Site Network Architecture",
      content:
`# Site Network Architecture

**Site:** \`<Site Name>\`
**Prepared by:** ${AUTHOR_NAME}, ${AUTHOR_TITLE}
**Date:** \`<DD-MMM-YYYY>\`

## 1. Network Zones (Purdue Model Reference)

| Level | Zone                  | Description                          |
|-------|------------------------|----------------------------------------|
| 0–1   | Field / Control        | PLCs, RTUs, I/O, field instruments     |
| 2     | Supervisory (SCADA/HMI)| HMI servers, engineering workstations  |
| 3     | Site Operations        | Historian, MES interface, site servers |
| 3.5   | DMZ                    | Firewall / data diode to IT            |
| 4–5   | Enterprise IT           | Corporate network                      |

## 2. VLAN Table

| VLAN ID | Name          | Subnet             | Purpose                  |
|---------|---------------|---------------------|---------------------------|
| 10      | OT-Control    | 192.168.10.0/24     | PLC & I/O traffic         |
| 20      | OT-SCADA      | 192.168.20.0/24     | HMI / SCADA servers       |
| 30      | OT-DMZ        | 192.168.30.0/29     | Firewall interconnect     |

## 3. Core Network Equipment

| Device            | Model              | Location       | Management IP  |
|--------------------|--------------------|-----------------|------------------|
| Core Switch         | \`<Model>\`         | MCC Room        | 192.168.20.2     |
| OT Firewall         | \`<Model>\`         | Server Room     | 192.168.30.1     |

## 4. Network Diagram

*Paste the network topology diagram / screenshot below (Ctrl+V):*

## Revision History

| Rev | Date | Description | By |
|-----|------|-------------|----|
| A   |      | Initial issue |    |
`,
    },
    {
      key: "modbus-register-map",
      name: "Modbus Register Map",
      desc: "Blank Modbus holding/input register mapping table for RTU or TCP devices.",
      category: "PLC Configurations",
      title: "Modbus Register Map",
      content:
`# Modbus Register Map

**Device:** \`<Device Tag / Model>\`
**Protocol:** \`<Modbus RTU / Modbus TCP>\`
**Slave ID:** \`<ID>\`
**Prepared by:** ${AUTHOR_NAME}, ${AUTHOR_TITLE}
**Date:** \`<DD-MMM-YYYY>\`

## Holding Registers (Read/Write — Function Code 03/16)

| Register | Description         | Data Type | Scale | Units | Notes |
|----------|-----------------------|-----------|-------|-------|-------|
| 40001    | Setpoint - Flow        | Float32   | x1    | m3/h  |       |
| 40003    | Setpoint - Pressure    | Float32   | x1    | bar   |       |

## Input Registers (Read Only — Function Code 04)

| Register | Description         | Data Type | Scale | Units | Notes |
|----------|-----------------------|-----------|-------|-------|-------|
| 30001    | Process Flow           | Float32   | x1    | m3/h  |       |
| 30003    | Process Pressure       | Float32   | x1    | bar   |       |

## Coils / Discrete Inputs

| Address | Description       | Type            | Notes |
|---------|---------------------|-----------------|-------|
| 00001   | Pump Run Command     | Coil (R/W)      |       |
| 10001   | Pump Running Status  | Discrete Input  |       |

## Revision History

| Rev | Date | Description | By |
|-----|------|-------------|----|
| A   |      | Initial issue |    |
`,
    },
    {
      key: "site-visit-note",
      name: "Site Visit / Commissioning Note",
      desc: "Quick structured template for field visit logs and commissioning notes.",
      category: "Site Notes",
      title: "Site Visit Note",
      content:
`# Site Visit Note

**Site:** \`<Site Name>\`
**Date:** \`<DD-MMM-YYYY>\`
**Engineer:** ${AUTHOR_NAME}, ${AUTHOR_TITLE}
**Purpose of Visit:** \`<Commissioning / Troubleshooting / PM>\`

## Summary

\`<Brief summary of the visit and outcome>\`

## Work Performed

- \`<Item 1>\`
- \`<Item 2>\`

## Issues Found

| Issue | Severity | Root Cause | Action Taken |
|-------|----------|------------|----------------|
|       |          |            |                |

## Photos / Screenshots

*Paste site photos, HMI screenshots, or fault screens below (Ctrl+V):*

## Follow-up Actions

- [ ] \`<Action item>\`
- [ ] \`<Action item>\`

## Sign-off

**Engineer:** ${AUTHOR_NAME}
**Signature:** ______________________
`,
    },
    {
      key: "user-manual",
      name: "HMI User Manual Skeleton",
      desc: "Operator-facing user manual outline for a new HMI screen/system.",
      category: "User Manuals",
      title: "HMI User Manual",
      content:
`# HMI Operator Manual

**System:** \`<System Name>\`
**Prepared by:** ${AUTHOR_NAME}, ${AUTHOR_TITLE}
**Date:** \`<DD-MMM-YYYY>\`

## 1. Overview

Brief description of the process and what this HMI controls.

## 2. Main Screen Layout

*Paste a screenshot of the main HMI overview screen below (Ctrl+V):*

## 3. Operating Procedures

### 3.1 Starting the System

1. Step one
2. Step two

### 3.2 Stopping the System

1. Step one
2. Step two

## 4. Alarm Handling

| Alarm Tag | Description | Operator Action |
|-----------|-------------|-------------------|
|           |             |                   |

## 5. Troubleshooting

| Symptom | Possible Cause | Resolution |
|---------|-----------------|------------|
|         |                 |            |

## Revision History

| Rev | Date | Description | By |
|-----|------|-------------|----|
| A   |      | Initial issue |    |
`,
    },
  ];

  /* ---------------------------------------------------------------------
     State
     --------------------------------------------------------------------- */

  let currentDoc = null; // full document object currently loaded in editor
  let isDirty = false;
  let autosaveTimer = null;
  let allDocsCache = [];

  /* ---------------------------------------------------------------------
     DOM references
     --------------------------------------------------------------------- */

  const el = {
    folderTree: document.getElementById("folder-tree"),
    searchInput: document.getElementById("search-input"),
    btnNewDoc: document.getElementById("btn-new-doc"),
    btnNewTemplate: document.getElementById("btn-new-template"),
    emptyState: document.getElementById("empty-state"),
    workspace: document.getElementById("doc-workspace"),
    docTitle: document.getElementById("doc-title"),
    docCategory: document.getElementById("doc-category"),
    saveIndicator: document.getElementById("save-indicator"),
    btnSave: document.getElementById("btn-save"),
    btnExportPdf: document.getElementById("btn-export-pdf"),
    btnDeleteDoc: document.getElementById("btn-delete-doc"),
    mdEditor: document.getElementById("md-editor"),
    mdPreview: document.getElementById("md-preview"),
    splitContainer: document.getElementById("split-container"),
    splitHandle: document.getElementById("split-handle"),
    templateModal: document.getElementById("template-modal"),
    templateModalClose: document.getElementById("template-modal-close"),
    templateList: document.getElementById("template-list"),
    pdfRoot: document.getElementById("pdf-export-root"),
    storageStatus: document.getElementById("storage-status"),
  };

  /* ---------------------------------------------------------------------
     Toast helper
     --------------------------------------------------------------------- */

  let toastEl = null;
  function toast(message, isError = false) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.toggle("error", isError);
    toastEl.classList.add("show");
    clearTimeout(toastEl._hideTimer);
    toastEl._hideTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* ---------------------------------------------------------------------
     Sidebar rendering
     --------------------------------------------------------------------- */

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  async function loadSidebar(filterText = "") {
    allDocsCache = await DocuVaultDB.getAllDocuments();
    renderSidebar(filterText);
  }

  function renderSidebar(filterText = "") {
    const q = filterText.trim().toLowerCase();
    el.folderTree.innerHTML = "";

    CATEGORIES.forEach((category) => {
      const docsInCat = allDocsCache.filter((d) => {
        const matchCat = d.category === category;
        const matchSearch = !q || d.title.toLowerCase().includes(q);
        return matchCat && matchSearch;
      });

      const catDiv = document.createElement("div");
      catDiv.className = "category";
      catDiv.dataset.category = category;

      const header = document.createElement("div");
      header.className = "category-header";
      header.innerHTML = `
        <span class="cat-icon">▸</span>
        <span class="cat-name">${escapeHtml(category)}</span>
        <span class="cat-count">${docsInCat.length}</span>
      `;
      header.addEventListener("click", () => catDiv.classList.toggle("collapsed"));

      const list = document.createElement("ul");
      list.className = "doc-list";

      if (docsInCat.length === 0) {
        const li = document.createElement("li");
        li.className = "empty-cat";
        li.textContent = q ? "No matches" : "No documents yet";
        list.appendChild(li);
      } else {
        docsInCat.forEach((doc) => {
          const li = document.createElement("li");
          li.dataset.id = doc.id;
          if (currentDoc && currentDoc.id === doc.id) li.classList.add("active");
          const span = document.createElement("span");
          span.className = "doc-title-text";
          span.textContent = doc.title || "Untitled Document";
          li.appendChild(span);
          li.addEventListener("click", () => selectDocument(doc.id));
          list.appendChild(li);
        });
      }

      catDiv.appendChild(header);
      catDiv.appendChild(list);
      el.folderTree.appendChild(catDiv);
    });
  }

  /* ---------------------------------------------------------------------
     Document lifecycle
     --------------------------------------------------------------------- */

  function showWorkspace(show) {
    el.emptyState.classList.toggle("hidden", show);
    el.workspace.classList.toggle("hidden", !show);
  }

  function renderPreview() {
    const raw = el.mdEditor.value;
    el.mdPreview.innerHTML = window.marked ? marked.parse(raw) : raw;
  }

  function setDirty(dirty) {
    isDirty = dirty;
    el.saveIndicator.textContent = dirty ? "Unsaved changes…" : "Saved";
    el.saveIndicator.classList.toggle("dirty", dirty);
    el.saveIndicator.classList.toggle("saved", !dirty);
  }

  async function selectDocument(id) {
    if (isDirty && currentDoc) {
      await persistCurrentDoc(); // flush pending edits before switching
    }
    const doc = await DocuVaultDB.getDocument(id);
    if (!doc) {
      toast("Document not found — it may have been deleted.", true);
      return;
    }
    currentDoc = doc;
    el.docTitle.value = doc.title;
    el.docCategory.value = doc.category;
    el.mdEditor.value = doc.content || "";
    renderPreview();
    setDirty(false);
    showWorkspace(true);
    renderSidebar(el.searchInput.value);
  }

  async function newBlankDocument(category = "Site Notes") {
    const doc = await DocuVaultDB.addDocument({
      title: "Untitled Document",
      category,
      content: "# Untitled Document\n\n",
    });
    await loadSidebar(el.searchInput.value);
    await selectDocument(doc.id);
    el.docTitle.focus();
    el.docTitle.select();
  }

  async function createFromTemplate(templateKey) {
    const tpl = TEMPLATES.find((t) => t.key === templateKey);
    if (!tpl) return;
    const doc = await DocuVaultDB.addDocument({
      title: tpl.title,
      category: tpl.category,
      content: tpl.content,
    });
    closeTemplateModal();
    await loadSidebar(el.searchInput.value);
    await selectDocument(doc.id);
    toast(`Created "${tpl.title}" from template.`);
  }

  async function persistCurrentDoc() {
    if (!currentDoc) return;
    currentDoc.title = el.docTitle.value.trim() || "Untitled Document";
    currentDoc.category = el.docCategory.value;
    currentDoc.content = el.mdEditor.value;
    await DocuVaultDB.updateDocument(currentDoc);
    setDirty(false);
    // Refresh cache entry without a full reload flash
    const idx = allDocsCache.findIndex((d) => d.id === currentDoc.id);
    if (idx > -1) allDocsCache[idx] = { ...currentDoc };
    renderSidebar(el.searchInput.value);
  }

  function scheduleAutosave() {
    setDirty(true);
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      persistCurrentDoc().catch((e) => toast("Autosave failed: " + e.message, true));
    }, AUTOSAVE_DELAY_MS);
  }

  async function deleteCurrentDoc() {
    if (!currentDoc) return;
    const ok = confirm(`Delete "${currentDoc.title}"? This cannot be undone.`);
    if (!ok) return;
    await DocuVaultDB.deleteDocument(currentDoc.id);
    currentDoc = null;
    clearTimeout(autosaveTimer);
    showWorkspace(false);
    await loadSidebar(el.searchInput.value);
    toast("Document deleted.");
  }

  /* ---------------------------------------------------------------------
     Template modal
     --------------------------------------------------------------------- */

  function openTemplateModal() {
    el.templateList.innerHTML = "";
    TEMPLATES.forEach((tpl) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="tpl-name">${escapeHtml(tpl.name)}</span>
        <span class="tpl-desc">${escapeHtml(tpl.desc)} · <em>${escapeHtml(tpl.category)}</em></span>
      `;
      li.addEventListener("click", () => createFromTemplate(tpl.key));
      el.templateList.appendChild(li);
    });
    el.templateModal.classList.remove("hidden");
  }

  function closeTemplateModal() {
    el.templateModal.classList.add("hidden");
  }

  /* ---------------------------------------------------------------------
     Clipboard image paste -> base64 -> markdown insert
     --------------------------------------------------------------------- */

  function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);
    textarea.value = before + text + after;
    const cursorPos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = cursorPos;
  }

  function handlePaste(e) {
    const items = (e.clipboardData || window.clipboardData).items;
    if (!items) return;

    let imageItem = null;
    for (const item of items) {
      if (item.type && item.type.startsWith("image/")) {
        imageItem = item;
        break;
      }
    }
    if (!imageItem) return; // let normal text paste proceed

    e.preventDefault();
    const blob = imageItem.getAsFile();
    if (!blob) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result; // e.g. data:image/png;base64,....
      const placeholder = `![Pasted image](${dataUrl})\n`;
      insertAtCursor(el.mdEditor, placeholder);
      renderPreview();
      scheduleAutosave();
      toast("Image embedded and will be saved with this document.");
    };
    reader.onerror = () => toast("Could not read pasted image.", true);
    reader.readAsDataURL(blob);
  }

  /* ---------------------------------------------------------------------
     Split pane drag resize
     --------------------------------------------------------------------- */

  function initSplitDrag() {
    let dragging = false;

    el.splitHandle.addEventListener("mousedown", (e) => {
      dragging = true;
      el.splitHandle.classList.add("dragging");
      document.body.style.userSelect = "none";
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const rect = el.splitContainer.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      ratio = Math.min(0.85, Math.max(0.15, ratio));
      const leftPct = (ratio * 100).toFixed(2);
      const rightPct = (100 - ratio * 100).toFixed(2);
      el.splitContainer.style.gridTemplateColumns = `${leftPct}fr 6px ${rightPct}fr`;
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      el.splitHandle.classList.remove("dragging");
      document.body.style.userSelect = "";
    });
  }

  /* ---------------------------------------------------------------------
     PDF export — branded letterhead wrap
     --------------------------------------------------------------------- */

  function buildLetterheadHtml(doc) {
    const renderedBody = window.marked ? marked.parse(doc.content || "") : "";
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `
      <div class="pdf-doc">
        <style>
          .pdf-doc {
            font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            padding: 0;
          }
          .pdf-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #0f172a;
            padding-bottom: 14px;
            margin-bottom: 22px;
          }
          .pdf-header .company {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.3px;
          }
          .pdf-header .company .accent { color: #0ea5e9; }
          .pdf-header .company-sub {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
          }
          .pdf-header .doc-meta {
            text-align: right;
            font-size: 11px;
            color: #475569;
            line-height: 1.5;
          }
          .pdf-title-block { margin-bottom: 20px; }
          .pdf-title-block h1 {
            font-size: 20px;
            margin: 0 0 4px;
            color: #0f172a;
          }
          .pdf-title-block .category-tag {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 3px 9px;
            border-radius: 10px;
          }
          .pdf-body { font-size: 12.5px; line-height: 1.6; }
          .pdf-body h1, .pdf-body h2, .pdf-body h3 {
            color: #0f172a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            margin-top: 18px;
          }
          .pdf-body h3 { border-bottom: none; color: #0369a1; }
          .pdf-body code {
            background: #f1f5f9;
            color: #b45309;
            padding: 1px 4px;
            border-radius: 3px;
            font-family: "SFMono-Regular", Consolas, monospace;
            font-size: 0.9em;
          }
          .pdf-body pre {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px;
            overflow-x: auto;
          }
          .pdf-body pre code { background: none; color: #1e293b; }
          .pdf-body blockquote {
            border-left: 3px solid #0ea5e9;
            margin: 0.8em 0;
            padding: 3px 12px;
            color: #475569;
            background: #f8fafc;
          }
          .pdf-body img { max-width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; }
          .pdf-body table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 11.5px; }
          .pdf-body th {
            background: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 6px 9px;
            border: 1px solid #0f172a;
          }
          .pdf-body td { padding: 6px 9px; border: 1px solid #cbd5e1; }
          .pdf-body tr:nth-child(even) td { background: #f1f5f9; }
          .pdf-footer {
            margin-top: 26px;
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            display: flex;
            justify-content: space-between;
            font-size: 9.5px;
            color: #94a3b8;
          }
        </style>

        <div class="pdf-header">
          <div>
            <div class="company">AL GURG <span class="accent">AUTOMATION</span> &amp; CONTROLS</div>
            <div class="company-sub">SCADA · I&amp;C Engineering — Dubai, UAE</div>
          </div>
          <div class="doc-meta">
            Prepared by: <strong>${escapeHtml(AUTHOR_NAME)}</strong><br>
            ${escapeHtml(AUTHOR_TITLE)}<br>
            Date: ${today}
          </div>
        </div>

        <div class="pdf-title-block">
          <h1>${escapeHtml(doc.title || "Untitled Document")}</h1>
          <span class="category-tag">${escapeHtml(doc.category || "")}</span>
        </div>

        <div class="pdf-body">${renderedBody}</div>

        <div class="pdf-footer">
          <span>Al Gurg Automation &amp; Controls — Confidential</span>
          <span>Document ID: ${escapeHtml(doc.id.slice(0, 8))}</span>
        </div>
      </div>
    `;
  }

  async function exportCurrentDocToPdf() {
    if (!currentDoc) return;
    await persistCurrentDoc();

    if (!window.html2pdf) {
      toast("PDF library not loaded — check your internet connection.", true);
      return;
    }

    toast("Generating PDF… Please wait.");

    // 1. AUTO-FIX: Strip the fake placeholder image so it never crashes html2canvas
    let safeContent = currentDoc.content || "";
    safeContent = safeContent.replace(/data:image\/png;base64,PLACEHOLDER_PASTE_YOUR_DIAGRAM_HERE/g, "");

    // Create a temporary document object with the cleaned content
    const safeDoc = { ...currentDoc, content: safeContent };

    // 2. Create the container (Do NOT append it to the body with CSS hacks)
    const container = document.createElement("div");
    container.innerHTML = buildLetterheadHtml(safeDoc);
    
    // Grab the actual wrapper element inside the container
    const elementToPrint = container.firstElementChild;

    const safeName = (safeDoc.title || "document").replace(/[^a-z0-9\-_]+/gi, "_");
    const opt = {
      margin: [12, 12, 16, 12], // top, left, bottom, right (mm)
      filename: `AGC_${safeName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: "#ffffff",
        windowWidth: 800 // Forces standard A4 width calculation
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    try {
      // Pass the element directly to html2pdf, it handles the rest natively
      await html2pdf().set(opt).from(elementToPrint).save();
      toast("PDF exported successfully.");
    } catch (err) {
      console.error(err);
      toast("PDF export failed: " + err.message, true);
    }
  }

  /* ---------------------------------------------------------------------
     Event wiring
     --------------------------------------------------------------------- */

  function wireEvents() {
    el.btnNewDoc.addEventListener("click", () => newBlankDocument());
    el.btnNewTemplate.addEventListener("click", openTemplateModal);
    el.templateModalClose.addEventListener("click", closeTemplateModal);
    el.templateModal.addEventListener("click", (e) => {
      if (e.target === el.templateModal) closeTemplateModal();
    });

    el.searchInput.addEventListener("input", () => renderSidebar(el.searchInput.value));

    el.mdEditor.addEventListener("input", () => {
      renderPreview();
      scheduleAutosave();
    });
    el.mdEditor.addEventListener("paste", handlePaste);

    el.docTitle.addEventListener("input", scheduleAutosave);
    el.docCategory.addEventListener("change", scheduleAutosave);

    el.btnSave.addEventListener("click", () => {
      clearTimeout(autosaveTimer);
      persistCurrentDoc().then(() => toast("Document saved."));
    });

    el.btnExportPdf.addEventListener("click", exportCurrentDocToPdf);
    el.btnDeleteDoc.addEventListener("click", deleteCurrentDoc);

    window.addEventListener("beforeunload", (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    });

    // Keyboard shortcut: Ctrl/Cmd+S to save
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (currentDoc) {
          clearTimeout(autosaveTimer);
          persistCurrentDoc().then(() => toast("Document saved."));
        }
      }
    });
  }

  /* ---------------------------------------------------------------------
     Service worker registration
     --------------------------------------------------------------------- */

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./service-worker.js") 
          .then((reg) => console.log("[DocuVault] Service worker registered:", reg.scope))
          .catch((err) => console.warn("[DocuVault] Service worker registration failed:", err));
      });
    }
  }

  /* ---------------------------------------------------------------------
     Init (Integrated Seed Data Check)
     --------------------------------------------------------------------- */

  async function init() {
    // 1. Initialize Database
    try {
      await DocuVaultDB.init();
      el.storageStatus.textContent = "● IndexedDB ready";
    } catch (err) {
      el.storageStatus.textContent = "● Storage unavailable";
      toast("IndexedDB failed to initialize: " + err.message, true);
      return;
    }

    // 2. Inject sample documents if database is empty (Merged logic)
    if (typeof window.seedDatabase === "function") {
      try {
        const seedResult = await window.seedDatabase();
        if (seedResult && seedResult.seeded) {
          console.log(`[DocuVault] Successfully seeded ${seedResult.count} sample documents.`);
        }
      } catch (err) {
        console.warn("[DocuVault] Seeding failed:", err);
      }
    }

    // 3. Setup UI & Event Listeners
    wireEvents();
    initSplitDrag();
    registerServiceWorker();
    
    // 4. Render App State
    await loadSidebar();
    showWorkspace(false);

    // 5. Support the manifest "New Document" shortcut
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "new") {
      await newBlankDocument();
      // Clean the query string so a refresh doesn't create another blank doc.
      window.history.replaceState({}, "", window.location.pathname);
    }
  }

  // Bind the single initialization logic
  document.addEventListener("DOMContentLoaded", init);

})();
