import { recommendMovies } from "../controllers/recommendController.js";

export default async function recommendRoutes(fastify) {
  fastify.post("/api/recommend", recommendMovies);
}
