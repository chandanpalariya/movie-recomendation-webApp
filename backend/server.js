import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "./config/db.js";
import recommendRoutes from "./routes/recommend.js";

dotenv.config();

const fastify = Fastify();
fastify.register(cors, { origin: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

fastify.decorate("db", db);
fastify.decorate("gemini", genAI);

fastify.register(recommendRoutes);

fastify.listen({ port: 5000 }, () => {
  console.log(" Backend running on http://localhost:5000");
});
