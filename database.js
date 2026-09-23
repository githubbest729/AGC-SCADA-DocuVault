/* ==========================================================================
   database.js
   Minimal Promise-based IndexedDB wrapper for AGC SCADA DocuVault.
   Single object store "documents" holding:
     { id, title, category, content (markdown, incl. base64 images), createdAt, updatedAt }
   No separate image store — pasted images are embedded directly as base64
   data URIs inside the markdown content, so a document and its images are
   always saved/exported/deleted together as one atomic record.
   ========================================================================== */

const DocuVaultDB = (() => {
  const DB_NAME = "agc-docuvault-db";
  const DB_VERSION = 1;
  const STORE = "documents";

  let dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB is not supported in this browser."));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("category", "category", { unique: false });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
          store.createIndex("title", "title", { unique: false });
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
      request.onblocked = () => reject(new Error("IndexedDB upgrade blocked by another open tab."));
    });

    return dbPromise;
  }

  function tx(storeMode) {
    return open().then((db) => db.transaction(STORE, storeMode).objectStore(STORE));
  }

  function genId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "doc-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  /** Initialize / warm up the connection. Resolves once DB is ready. */
  function init() {
    return open().then(() => true);
  }

  /** Create a new document record. Returns the full saved object (with id). */
  function addDocument({ title, category, content }) {
    const now = new Date().toISOString();
    const doc = {
      id: genId(),
      title: title || "Untitled Document",
      category: category || "Site Notes",
      content: content || "",
      createdAt: now,
      updatedAt: now,
    };
    return tx("readwrite").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.add(doc);
          req.onsuccess = () => resolve(doc);
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  /** Update an existing document. Pass an object with at least `id`. */
  function updateDocument(doc) {
    doc.updatedAt = new Date().toISOString();
    return tx("readwrite").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.put(doc);
          req.onsuccess = () => resolve(doc);
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  /** Fetch a single document by id. */
  function getDocument(id) {
    return tx("readonly").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  /** Fetch every document, newest-updated first. */
  function getAllDocuments() {
    return tx("readonly").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => {
            const docs = req.result || [];
            docs.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
            resolve(docs);
          };
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  /** Delete a document permanently. */
  function deleteDocument(id) {
    return tx("readwrite").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve(true);
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  /** Rough estimate of total storage used (bytes), for the sidebar status line. */
  async function estimateUsage() {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const { usage, quota } = await navigator.storage.estimate();
        return { usage, quota };
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  return {
    init,
    addDocument,
    updateDocument,
    getDocument,
    getAllDocuments,
    deleteDocument,
    estimateUsage,
  };
})();
