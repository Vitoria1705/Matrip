// URL do backend Spring Boot. Como o app roda no navegador do seu próprio PC
// durante o desenvolvimento, localhost aponta certo para o backend na porta 3000.
export const API_BASE_URL = "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

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
