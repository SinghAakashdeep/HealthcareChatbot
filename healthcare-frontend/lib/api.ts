const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

export async function apiRequest<TResponse>(
  path: string,
  data?: unknown,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: method === "GET" || data === undefined ? undefined : JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Request failed")
  }

  return res.json()
}

export { BASE_URL }
