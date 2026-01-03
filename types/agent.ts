export type PersonStatus = "pending" | "processing" | "completed" | "error";

export interface PersonData {
  name: string;
  university: string;
  email?: string;
  phone?: string;
  faculty?: string;
  status?: PersonStatus;
  error?: string;
}

export interface ProcessPersonRequest {
  name: string;
  university: string;
}

export interface ProcessPersonResponse {
  email: string;
  phone: string;
  faculty: string;
  toolCalls?: number;
  success?: boolean;
  error?: string;
  details?: string;
  rawResponse?: string;
}

export interface ExcelRow {
  name?: string;
  university?: string;
  Name?: string;
  University?: string;
  [key: string]: any;
}

export interface EnrichedExcelRow {
  Name: string;
  University: string;
  Email: string;
  Phone: string;
  Faculty: string;
  Status: string;
}

export interface SearchToolResult {
  success: boolean;
  results?: string;
  sources?: string[];
  error?: string;
  message?: string;
}
