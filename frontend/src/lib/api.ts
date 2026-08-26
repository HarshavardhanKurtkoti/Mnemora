// API client for FastAPI Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse(res: Response) {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    throw new Error('Invalid JSON response from server');
  }

  if (data && data.status === "error") {
    throw new Error(data.error?.message || "Unknown server error");
  }
  
  if (!res.ok) {
     throw new Error(data.detail || `HTTP Error: ${res.status}`);
  }

  return data.data !== undefined ? data.data : data; 
}

export async function askMnemora(query: string) {
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return handleResponse(res);
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
  return handleResponse(res);
};

export const fetchPerformanceStats = async () => {
  const res = await fetch(`${API_BASE_URL}/stats/performance`, { cache: 'no-store' });
  return handleResponse(res);
};

export const fetchRecentQueries = async (limit?: number) => {
  const url = limit ? `${API_BASE_URL}/queries/recent?limit=${limit}` : `${API_BASE_URL}/queries/recent`;
  const res = await fetch(url, { cache: 'no-store' });
  return handleResponse(res);
};

export const fetchActivityFeed = async (limit?: number) => {
  const url = limit ? `${API_BASE_URL}/activity?limit=${limit}` : `${API_BASE_URL}/activity`;
  const res = await fetch(url, { cache: 'no-store' });
  return handleResponse(res);
};

export const fetchHealthServices = async () => {
  const res = await fetch(`${API_BASE_URL}/health/services`, { cache: 'no-store' });
  return handleResponse(res);
};

export const runEvaluation = async () => {
  const res = await fetch(`${API_BASE_URL}/evaluation/run`, { 
    method: 'POST',
    headers: { "Content-Type": "application/json" }
  });
  return handleResponse(res);
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE_URL}/ingest/file`, {
    method: 'POST',
    body: formData,
  });
  
  return handleResponse(res);
};

export const inspectRetrieval = async (query: string, top_k?: number) => {
  const res = await fetch(`${API_BASE_URL}/retrieval/inspect`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: top_k || 5 }),
  });
  return handleResponse(res);
};

export const fetchSystemDiagnostics = async () => {
  const res = await fetch(`${API_BASE_URL}/system/diagnostics`, { cache: 'no-store' });
  return handleResponse(res);
};

