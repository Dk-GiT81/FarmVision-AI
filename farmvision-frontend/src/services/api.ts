import {
  HistoryItem,
  LoginPayload,
  LoginResponse,
  PredictionResult,
  RegisterPayload,
  RegisterResponse,
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const predictDisease = async (file: File, email: string): Promise<PredictionResult & { error?: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
};

export const getHistory = async (email: string, role: string): Promise<HistoryItem[]> => {
  const response = await fetch(
    `${API_BASE_URL}/history?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
};

export const clearHistory = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/clear-history`, {
    method: 'DELETE',
  });
  return response.json();
};
