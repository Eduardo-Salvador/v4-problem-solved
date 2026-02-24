import { pool } from "../../database/client.js";
import { resolvePagination, totalPages } from "../../shared/pagination.js";
import type { CreateSupplyData, FindSuppliesParams, UpdateSupplyData } from "./supply.schema.js";

export interface SupplyRow {
  id: number;
  item: string;
  categoria: string;
  estoque: number;
  unidade: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface SuppliesResult {
  data: SupplyRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function findSupplies(params: FindSuppliesParams): Promise<SuppliesResult> {
  const { page, limit, offset } = resolvePagination({ page: params.page, limit: params.limit, maxLimit: 50 });

  const conditions = ["deleted_at IS NULL"];
  const values: unknown[] = [];

  if (params.search?.trim()) {
    values.push(`%${params.search.trim()}%`);
    conditions.push(`item ILIKE $${values.length}`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const countResult = await pool.query<{ count: string }>(`SELECT COUNT(id) AS count FROM supplies ${where}`, values);
  const total = Number(countResult.rows[0].count);

  const dataResult = await pool.query<SupplyRow>(
    `SELECT * FROM supplies ${where} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  );

  return {
    data: dataResult.rows,
    pagination: { total, page, limit, totalPages: totalPages(total, limit) }
  };
}

export async function createSupply(data: CreateSupplyData): Promise<SupplyRow> {
  const now = new Date();

  const { rows } = await pool.query<SupplyRow>(
    `INSERT INTO supplies (item, categoria, estoque, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $4)
     RETURNING *`,
    [data.item, data.categoria, data.estoque, now]
  );

  return rows[0];
}

export async function updateSupply(id: number, data: UpdateSupplyData): Promise<SupplyRow | null> {
  const fields = [];
  const values: unknown[] = [];

  if (data.item) {
    values.push(data.item);
    fields.push(`item = $${values.length}`);
  }
  if (data.categoria) {
    values.push(data.categoria);
    fields.push(`categoria = $${values.length}`);
  }
  if (data.estoque !== undefined) {
    values.push(data.estoque);
    fields.push(`estoque = $${values.length}`);
  }

  values.push(new Date());
  fields.push(`updated_at = $${values.length}`);

  values.push(id);

  const { rows } = await pool.query<SupplyRow>(
    `UPDATE supplies SET ${fields.join(", ")} WHERE id = $${values.length} AND deleted_at IS NULL RETURNING *`,
    values
  );

  return rows[0] ?? null;
}

export async function softDeleteSupply(id: number): Promise<SupplyRow | null> {
  const { rows } = await pool.query<SupplyRow>(
    `UPDATE supplies SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`,
    [id]
  );

  return rows[0] ?? null;
}