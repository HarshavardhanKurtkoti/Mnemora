// API client for FastAPI Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function askMnemora(query: string) {
  // In M1, we are using mock data in the UI. 
  // Future implementation will connect to the FastAPI backend.
  /*
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return res.json();
  */
  console.log("Mock API call to askMnemora:", query);
  return { status: "mocked" };
}

export async function fetchDocuments() {
  /*
  const res = await fetch(`${API_BASE_URL}/documents`);
  return res.json();
  */
  return [];
}
