export const BACKEND_URL = 'http://localhost:3000';
export const API_BASE_URL = `${BACKEND_URL}/api`;

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response;
};