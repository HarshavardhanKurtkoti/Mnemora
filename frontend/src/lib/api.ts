// API client for FastAPI Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function askMnemora(query: string) {
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
      throw new Error('Failed to ask Mnemora');
  }
  return res.json();
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

export const fetchRecentQueries = async (limit?: number) => {
  const url = limit ? `${API_BASE_URL}/queries/recent?limit=${limit}` : `${API_BASE_URL}/queries/recent`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch recent queries');
  return res.json();
};

export const fetchActivityFeed = async (limit?: number) => {
  const url = limit ? `${API_BASE_URL}/activity?limit=${limit}` : `${API_BASE_URL}/activity`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch activity feed');
  return res.json();
};

export const fetchHealthServices = async () => {
  const res = await fetch(`${API_BASE_URL}/health/services`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch health services');
  return res.json();
};

export const runEvaluation = async () => {
  const res = await fetch(`${API_BASE_URL}/evaluation/run`, { 
    method: 'POST',
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error('Failed to run evaluation');
  return res.json();
};
