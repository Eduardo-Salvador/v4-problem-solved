import { pool } from "../../database/client.js";
import type { CreateMissionData, FindMissionsParams } from "./mission.schema.js";

export interface MissionRow {
  id: number;
  nome: string;
  astronaut_id: number;
  supply_id: number;
  created_at: Date;
  updated_at: Date;
}

export async function findMissions(params: FindMissionsParams): Promise<MissionRow[]> {
  const limit = params.limit ?? 50;
  const offset = ((params.page ?? 1) - 1) * limit;

  const { rows } = await pool.query<MissionRow>(
    `SELECT * FROM missions ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return rows;
}

export async function createMission(data: CreateMissionData): Promise<MissionRow> {
  const now = new Date();

  const { rows } = await pool.query<MissionRow>(
    `INSERT INTO missions (nome, astronaut_id, supply_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $4)
     RETURNING *`,
    [data.nome, data.astronautId, data.supplyId, now]
  );

  return rows[0];
}