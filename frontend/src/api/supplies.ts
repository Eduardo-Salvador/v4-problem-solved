import type { Supply } from "../types/supplies";

const BASE_URL = "http://localhost:3333";

export async function fetchSupplies(): Promise<Supply[]> {
  const response = await fetch(`${BASE_URL}/supplies?limit=50`);
  const json = await response.json();
  return json.data;
}

export async function createSupply(input: { item: string; categoria: string; estoque: number }): Promise<Supply> {
  const response = await fetch(`${BASE_URL}/supplies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return response.json();
}

export async function updateSupply(id: string, input: { item?: string; categoria?: string; estoque?: number }): Promise<Supply> {
  const response = await fetch(`${BASE_URL}/supplies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return response.json();
}

export async function deleteSupply(id: string): Promise<void> {
  await fetch(`${BASE_URL}/supplies/${id}`, {
    method: "DELETE"
  });
}