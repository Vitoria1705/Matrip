// URL do backend Spring Boot.
export const API_BASE_URL = "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Para requisições JSON normais (a maioria).
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data: unknown = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `Erro na requisição (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data;
};

// Para cadastrar/editar passeios: o backend espera multipart/form-data
// (por causa do upload de imagens), não JSON.
export const apiFetchForm = async (
  endpoint: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST"
) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    body: formData,
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `Erro na requisição (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data;
};
