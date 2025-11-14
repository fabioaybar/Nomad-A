import { fallbackDb } from '../lib/fallbackDb';

const API_URL = import.meta.env.VITE_API_URL || '';
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

async function fetchWithTimeout(input: RequestInfo, init?: RequestInit, timeout = TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(input, { ...(init || {}), signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function tryNetwork(method: string, path: string, body?: any) {
  if (!API_URL) throw new Error('No API_URL');
  const url = `${API_URL}${path}`;
  const opts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetchWithTimeout(url, opts);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  return res.json();
}

// Generic helper: attempt network, fallback to local DB
async function networkOrFallback(tableName: string, networkCall: () => Promise<any>, fallbackCall: () => Promise<any>) {
  try {
    return await networkCall();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Network failed, using fallback for', tableName, e);
    await fallbackDb.init();
    return fallbackCall();
  }
}

// Exported API that mirrors basic endpoints used by the frontend
export const fallbackApi = {
  async listAutos() {
    return networkOrFallback('autos', () => tryNetwork('GET', '/autos'), () => fallbackDb.list('autos'));
  },
  async getAuto(id: number) {
    return networkOrFallback('autos', () => tryNetwork('GET', `/autos/${id}`), () => fallbackDb.get('autos', id));
  },
  async listModelos() {
    return networkOrFallback('modelos', () => tryNetwork('GET', `/modelos`), () => fallbackDb.list('modelos'));
  },
  async listVendedores() {
    return networkOrFallback('vendedores', () => tryNetwork('GET', `/vendedores`), () => fallbackDb.list('vendedores'));
  },
  async listReservasByUser(userId: number) {
    return networkOrFallback('reservas', () => tryNetwork('GET', `/usuarios/${userId}/reservas`), () => fallbackDb.query('reservas', (r: any) => r.id_usuario === userId));
  },
  async createReserva(payload: any) {
    return networkOrFallback('reservas', () => tryNetwork('POST', `/reservas`, payload), async () => {
      // Ensure created reserva has an id (auto-increment mimic)
      const all = await fallbackDb.list<any>('reservas');
      const maxId = all.reduce((m, x) => Math.max(m, x.id_reserva || 0), 0);
      const newId = maxId + 1;
      const item = { ...payload, id_reserva: newId, creado_en: new Date().toISOString() };
      await fallbackDb.create('reservas', item);
      return item;
    });
  },
  async updateReserva(id: number, changes: any) {
    return networkOrFallback('reservas', () => tryNetwork('PUT', `/reservas/${id}`, changes), async () => {
      const existing = await fallbackDb.get<any>('reservas', id);
      if (!existing) throw new Error('Not found');
      const updated = { ...existing, ...changes, actualizado_en: new Date().toISOString() };
      await fallbackDb.put('reservas', updated);
      return updated;
    });
  },
  async listDescuentos() {
    return networkOrFallback('descuentos', () => tryNetwork('GET', `/descuentos`), () => fallbackDb.list('descuentos'));
  },
  async listNotificaciones(userId: number) {
    return networkOrFallback('notificaciones', () => tryNetwork('GET', `/usuarios/${userId}/notificaciones`), () => fallbackDb.query('notificaciones', (n: any) => n.id_usuario === userId));
  },
  // extend with other endpoints as needed
};

export default fallbackApi;
