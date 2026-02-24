import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { createSupply, findSupplies, softDeleteSupply, updateSupply } from "./supply.repository.js";
import { createSupplyBody, findSuppliesQuery, supplyId, updateSupplyBody } from "./supply.schema.js";
import { formatRow, formatZodError } from "../../shared/utils.js";
import type { SupplyRow } from "./supply.repository.js";

function formatSupplyRow(row: SupplyRow) {
  return {
    ...row,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString()
  };
}

export async function supplyRoutes(app: FastifyInstance): Promise<void> {
  app.get("/supplies", async (request, reply) => {
    const query = findSuppliesQuery.parse(request.query);
    const result = await findSupplies(query);

    return reply.status(200).send({
      data: result.data.map(formatSupplyRow),
      pagination: result.pagination
    });
  });

  app.post("/supplies", async (request, reply) => {
    const body = createSupplyBody.parse(request.body);
    const created = await createSupply(body);

    return reply.status(201).send(formatSupplyRow (created));
  });

  app.put("/supplies/:id", async (request, reply) => {
    const id = supplyId.parse((request.params as { id: string }).id);
    const body = updateSupplyBody.parse(request.body);
    const updated = await updateSupply(id, body);

    if (!updated) {
      return reply.status(404).send({ error: "Supply not found" });
    }

    return reply.status(200).send(formatSupplyRow (updated));
  });

  app.delete("/supplies/:id", async (request, reply) => {
    const id = supplyId.parse((request.params as { id: string }).id);
    const deleted = await softDeleteSupply(id);

    if (!deleted) {
      return reply.status(404).send({ error: "Supply not found" });
    }

    return reply.status(200).send(formatSupplyRow (deleted));
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send(formatZodError(error));
    }
    reply.status(500).send({ error: "Internal server error" });
  });
}