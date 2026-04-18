const BASE = process.env.HAPPYROBOT_BASE_URL!;
const KEY = process.env.HAPPYROBOT_API_KEY!;
export const PHONE_AGENT_ID = process.env.HAPPYROBOT_PHONE_AGENT_ID!;

function authHeaders() {
  return { Authorization: `Bearer ${KEY}` };
}

export interface HRContact {
  id: string;
  type: string;
  value: string;
  contact_summary: string | null;
  extracted_attributes: Record<string, string>;
  created_at: string;
  updated_at: string;
  interactions_count: Record<string, number>;
  tags: string[];
  last_interaction_date: string | null;
  has_blocked_workflows: boolean;
}

export interface HRContactDetail extends Omit<HRContact, "interactions_count"> {
  interaction_count: number;
  memory_count: number;
}

export interface HRInteraction {
  id: string;
  channel: string;
  tags: string[];
  interaction_summary: string;
  extracted_attributes: Record<string, string>;
  timestamp: string;
}

export interface HRMemory {
  id: string;
  content: string;
  communication_event_id: string;
  created_at: string;
}

export interface HRRun {
  id: string;
  status: "completed" | "failed" | "running";
  org_id: string;
  timestamp: string;
  use_case_id: string;
  version_id: string;
  annotation: string | null;
  completed_at: string | null;
  input_tokens: number;
  output_tokens: number;
  execution_environment: string;
  data: Record<string, unknown>;
}

export async function getContacts(): Promise<HRContact[]> {
  const res = await fetch(`${BASE}/contacts`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`HappyRobot contacts: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getContact(id: string): Promise<HRContactDetail> {
  const res = await fetch(`${BASE}/contacts/${id}`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`HappyRobot contact: ${res.status}`);
  return res.json();
}

export async function getContactInteractions(id: string): Promise<HRInteraction[]> {
  const res = await fetch(`${BASE}/contacts/${id}/interactions`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`HappyRobot interactions: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getContactMemories(id: string): Promise<HRMemory[]> {
  const res = await fetch(`${BASE}/contacts/${id}/memories`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`HappyRobot memories: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getPhoneAgentRuns(): Promise<HRRun[]> {
  const res = await fetch(
    `${BASE}/runs?use_case_id=${PHONE_AGENT_ID}&page_size=100`,
    { headers: authHeaders(), next: { revalidate: 30 } }
  );
  if (!res.ok) throw new Error(`HappyRobot runs: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

// Twin DB types

export interface TwinThread {
  id: string;
  account_id: string | null;
  primary_contact_id: string | null;
  title: string | null;
  description: string | null;
  status: "new" | "in_progress" | "confirmed_purchase" | "closed";
  last_call_outcome: string | null;
  created_at: string;
  updated_at: string;
}

export interface TwinPurchase {
  id: string;
  thread_id: string;
  contact_id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  total: string;
  confirmed_at: string;
}

export interface TwinAccount {
  id: string;
  name: string;
  country: string;
  website: string;
  created_at: string;
  updated_at: string;
}

export interface TwinContact {
  id: string;
  account_id: string | null;
  full_name: string | null;
  job_title: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface TwinThreadProduct {
  id: string;
  thread_id: string;
  product_id: string;
  priority: number;
  created_at: string;
}

async function getTwinTable<T>(tableName: string, limit = 100): Promise<T[]> {
  const res = await fetch(`${BASE}/twin/tables/${tableName}?limit=${limit}`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`HappyRobot twin/${tableName}: ${res.status}`);
  const json = await res.json();
  return json.rows ?? [];
}

export const getTwinThreads = () => getTwinTable<TwinThread>("threads");
export const getTwinPurchases = () => getTwinTable<TwinPurchase>("purchases");
export const getTwinAccounts = () => getTwinTable<TwinAccount>("accounts");
export const getTwinContacts = () => getTwinTable<TwinContact>("contacts");
export const getTwinThreadProducts = () => getTwinTable<TwinThreadProduct>("thread_products");
