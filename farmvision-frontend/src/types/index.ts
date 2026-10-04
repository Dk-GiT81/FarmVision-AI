export type UserRole = 'farmer' | 'admin';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface PredictionResult {
  disease: string;
  confidence: number;
  diagnosis: string;
  recommended_pesticide: string;
  precaution: string;
}

export interface HistoryItem {
  user_email: string;
  disease: string;
  confidence: number;
  timestamp: string;
}

export interface DiseaseCount {
  disease: string;
  count: number;
}

export interface AdminStats {
  totalUsers: number;
  totalPredictions: number;
  diseasedCases: number;
  healthyCases: number;
  diseasedPercentage: number;
  healthyPercentage: number;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  user?: User;
  error?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  message?: string;
  error?: string;
}

