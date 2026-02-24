import type { Mission } from "../types/missions";

const BASE_URL = "http://localhost:3333";

export async function fetchMissions(): Promise<Mission[]> {
  const response = await fetch(`${BASE_URL}/missions?limit=50`);
  const json = await response.json();
  return json.data;
}

export async function createMission(input: { nome: string; astronautId: number; supplyId: string }): Promise<Mission> {
  const response = await fetch(`${BASE_URL}/missions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: input.nome,
      astronautId: input.astronautId,
      supplyId: Number(input.supplyId)
    })
  });
  return response.json();
}