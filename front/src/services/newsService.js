import { fetchAuth } from './authService';

export async function getNoticias() {
  return fetchAuth('/api/noticias');
}

export async function getNoticia(id) {
  return fetchAuth(`/api/noticias/${id}`);
}

export async function crearNoticia({ title, body, category }) {
  return fetchAuth('/api/noticias', {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  });
}

export async function editarNoticia(id, { title, body, category }) {
  return fetchAuth(`/api/noticias/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, body, category }),
  });
}

export async function eliminarNoticia(id) {
  return fetchAuth(`/api/noticias/${id}`, {
    method: 'DELETE',
  });
}