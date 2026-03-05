const BASE_URL = "http://localhost:8000"

export async function apiRequest(
  path: string,
  data?: any,
  method: string = "POST"
) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Request failed")
  }

  return res.json()
}
