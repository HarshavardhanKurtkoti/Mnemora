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

export const fetchOverviewStats = async () => {
  const res = await fetch(`${API_BASE_URL}/stats/overview`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch overview stats');
  return res.json();
};

export const fetchPerformanceStats = async () => {
  const res = await fetch(`${API_BASE_URL}/stats/performance`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch performance stats');
  return res.json();
};

export const fetchRecentQueries = async () => {
  const res = await fetch(`${API_BASE_URL}/queries/recent`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch recent queries');
  return res.json();
};

export const fetchActivityFeed = async () => {
  const res = await fetch(`${API_BASE_URL}/activity`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch activity feed');
  return res.json();
};

export const fetchHealthServices = async () => {
  const res = await fetch(`${API_BASE_URL}/health/services`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch health services');
  return res.json();
};
