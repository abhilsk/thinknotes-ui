const API_URL = process.env.THINKNOTES_API_URL || "https://szkyx0aonh.execute-api.us-east-1.amazonaws.com/prod";

export async function POST(request: Request) {
  const body = await request.json();
  const authHeader = request.headers.get("Authorization") || "";

  const response = await fetch(`${API_URL}/generate-notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader && { Authorization: authHeader }),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
