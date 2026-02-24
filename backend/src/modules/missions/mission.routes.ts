import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { createMission, findMissions } from "./mission.repository.js";
import { createMissionBody, findMissionsQuery } from "./mission.schema.js";
import type { MissionRow } from "./mission.repository.js";

function formatMissionRow(row: MissionRow) {
  return {
    id: String(row.id),
    nome: row.nome,
    astronautId: row.astronaut_id,
    supplyId: String(row.supply_id),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString()
  };
}

export async function missionRoutes(app: FastifyInstance): Promise<void> {
  app.get("/missions", async (request, reply) => {
    const query = findMissionsQuery.parse(request.query);
    const result = await findMissions(query);

    return reply.status(200).send({
      data: result.map(formatMissionRow)
    });
  });

  app.post("/missions", async (request, reply) => {
    const body = createMissionBody.parse(request.body);
    const created = await createMission(body);

    return reply.status(201).send(formatMissionRow(created));
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.issues.map((i) => i.message)
      });
    }
    reply.status(500).send({ error: "Internal server error" });
  });
}