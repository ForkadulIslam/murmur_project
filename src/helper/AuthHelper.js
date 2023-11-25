export function setToken(token) {
  localStorage.setItem('token', token);
}
  
export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export async function handleUnauthorized() {
  removeToken();
  window.location.href = '/login';
}