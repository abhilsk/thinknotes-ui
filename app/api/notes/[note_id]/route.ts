const API_URL = process.env.THINKNOTES_API_URL || "https://szkyx0aonh.execute-api.us-east-1.amazonaws.com/prod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ note_id: string }> }
) {
  const { note_id } = await params;
  const authHeader = request.headers.get("Authorization") || "";

  const response = await fetch(`${API_URL}/notes/${note_id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authHeader && { Authorization: authHeader }),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
