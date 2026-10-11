// Browser-only persistent store for uploaded PDFs (IndexedDB).
export interface PageText {
  page: number;
  text: string;
  chars: number;
}
export interface Chunk {
  id: string;
  page: number;
  text: string;
  meta: { document: string; company: string; year: string; page: number; docType: string };
}
export interface StoredDoc {
  id: string;
  file: string;
  company: string;
  year: string;
  type: string;
  size: number;
  uploaded: string;
  pageCount: number;
  pages: PageText[];
  chunks: Chunk[];
  ocrRequired: boolean;
  emptyPages: number;
}

const DB = "finsight-docs";
const STORE = "docs";

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "id" });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

export const saveDoc = (d: StoredDoc) => tx("readwrite", (s) => s.put(d));
export const getDoc = (id: string) => tx<StoredDoc | undefined>("readonly", (s) => s.get(id));
export const deleteDoc = (id: string) => tx("readwrite", (s) => s.delete(id));
export async function listDocs(): Promise<StoredDoc[]> {
  const all = await tx<StoredDoc[]>("readonly", (s) => s.getAll());
  return all.sort((a, b) => b.uploaded.localeCompare(a.uploaded));
}

export function chunkPages(
  pages: PageText[],
  meta: { document: string; company: string; year: string; docType: string },
  size = 1200,
): Chunk[] {
  const out: Chunk[] = [];
  for (const p of pages) {
    if (!p.text.trim()) continue;
    const words = p.text.split(/\s+/);
    let buf: string[] = [];
    let len = 0;
    let n = 0;
    const flush = () => {
      if (!buf.length) return;
      out.push({ id: `p${p.page}-c${n++}`, page: p.page, text: buf.join(" "), meta: { ...meta, page: p.page } });
      buf = [];
      len = 0;
    };
    for (const w of words) {
      buf.push(w);
      len += w.length + 1;
      if (len >= size) flush();
    }
    flush();
  }
  return out;
}

export function searchChunks(doc: StoredDoc, q: string, k = 5) {
  const terms = q.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
  if (!terms.length) return [];
  return doc.chunks
    .map((c) => {
      const t = c.text.toLowerCase();
      const score = terms.reduce((s, term) => s + (t.split(term).length - 1), 0);
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
