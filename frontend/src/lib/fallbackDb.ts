/*
  Simple IndexedDB-backed fallback DB for the frontend.
  - Seeds data from /SVG_Webpay/DB/seed.json on first run
  - Provides basic CRUD helpers for common tables
  - Intended to be used when network/API (MySQL) is unreachable
*/

type SeedShape = Record<string, any[]>;

const DB_NAME = 'nomada_fallback_db_v1';
const SEED_URL = '/SVG_Webpay/DB/seed.json';

export class FallbackDB {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private stores = [
    'roles','usuarios','vendedores','modelos','autos','reservas','conversaciones','mensajes','mantenimientos','notificaciones','descuentos','metodos_pago','recompensas','resenas'
  ];

  async init() {
    if (!this.dbPromise) {
      this.dbPromise = this.openDB();
      const db = await this.dbPromise;
      // once db opened, seed if necessary
      await this.seedIfEmpty(db);
    }
    return this.dbPromise;
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (ev) => {
        const db = (ev.target as IDBOpenDBRequest).result;
        for (const s of this.stores) {
          if (!db.objectStoreNames.contains(s)) {
            let key = 'id';
            // set key names according to schema conventions
            switch (s) {
              case 'roles': key = 'id_rol'; break;
              case 'usuarios': key = 'id_usuario'; break;
              case 'vendedores': key = 'id_vendedor'; break;
              case 'modelos': key = 'id_modelo'; break;
              case 'autos': key = 'id_auto'; break;
              case 'reservas': key = 'id_reserva'; break;
              case 'conversaciones': key = 'id_conversacion'; break;
              case 'mensajes': key = 'id_mensaje'; break;
              case 'mantenimientos': key = 'id_mantenimiento'; break;
              case 'notificaciones': key = 'id_notificacion'; break;
              case 'descuentos': key = 'id_descuento'; break;
              case 'metodos_pago': key = 'id_metodo'; break;
              case 'recompensas': key = 'id_recompensa'; break;
              case 'resenas': key = 'id_resena'; break;
              default: key = 'id';
            }
            db.createObjectStore(s, { keyPath: key });
          }
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async seedIfEmpty(db: IDBDatabase) {
    try {
      const tx = db.transaction(this.stores, 'readonly');
      const counts = await Promise.all(this.stores.map(s => this.storeCount(tx.objectStore(s))));
      const hasAny = counts.some(c => c > 0);
      if (!hasAny) {
        // fetch seed file and populate
        const res = await fetch(SEED_URL);
        if (!res.ok) return; // no seed available
        const seed: SeedShape = await res.json();
        const wtx = db.transaction(this.stores, 'readwrite');
        for (const storeName of this.stores) {
          const items = seed[storeName] || [];
          const s = wtx.objectStore(storeName);
          for (const it of items) {
            try { s.add(it); } catch (e) { /* ignore duplicates */ }
          }
        }
        await this.txComplete(wtx);
      }
    } catch (e) {
      console.warn('FallbackDB seed failed', e);
    }
  }

  private storeCount(store: IDBObjectStore): Promise<number> {
    return new Promise((res, rej) => {
      const req = store.count();
      req.onsuccess = () => res(req.result as number);
      req.onerror = () => rej(req.error);
    });
  }

  private txComplete(tx: IDBTransaction): Promise<void> {
    return new Promise((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
      tx.onabort = () => rej(tx.error);
    });
  }

  private async getDB() {
    if (!this.dbPromise) await this.init();
    return this.dbPromise as Promise<IDBDatabase>;
  }

  async list<T = any>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => res(req.result as T[]);
      req.onerror = () => rej(req.error);
    });
  }

  async get<T = any>(storeName: string, key: IDBValidKey): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => res(req.result ?? null);
      req.onerror = () => rej(req.error);
    });
  }

  async create<T = any>(storeName: string, item: T): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).add(item);
    return this.txComplete(tx);
  }

  async put<T = any>(storeName: string, item: T): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(item);
    return this.txComplete(tx);
  }

  async remove(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    return this.txComplete(tx);
  }

  // convenience query: filter by predicate in memory
  async query<T = any>(storeName: string, predicate: (item: T) => boolean): Promise<T[]> {
    const all = await this.list<T>(storeName);
    return all.filter(predicate);
  }
}

// singleton instance for easy import
export const fallbackDb = new FallbackDB();
