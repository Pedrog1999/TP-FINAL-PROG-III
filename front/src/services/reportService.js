import { fetchAuth } from './authService';

export async function getReportes() { return fetchAuth('/api/reportes'); }
export async function getReporte(id) { return fetchAuth(`/api/reportes/${id}`); }
export async function crearReporte({ title, body }) {
  return fetchAuth('/api/reportes', { method: 'POST', body: JSON.stringify({ title, body }) });
}
export async function eliminarReporte(id) {
  return fetchAuth(`/api/reportes/${id}`, { method: 'DELETE' });
}
export async function getComentarios(reporteId) { return fetchAuth(`/api/reportes/${reporteId}/comentarios`); }
export async function crearComentario(reporteId, body) {
  return fetchAuth(`/api/reportes/${reporteId}/comentarios`, { method: 'POST', body: JSON.stringify({ body }) });
}
export async function eliminarComentario(id) {
  return fetchAuth(`/api/comentarios/${id}`, { method: 'DELETE' });
}