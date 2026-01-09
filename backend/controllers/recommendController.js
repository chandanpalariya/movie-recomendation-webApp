export const recommendMovies = async (req, reply) => {
  try {
    const { preference } = req.body;

    if (!preference) {
      return reply.code(400).send({ error: "Preference is required" });
    }

    const model = req.server.gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Suggest 3 to 5 popular BOLLYWOOD (Hindi) movies based on:
"${preference}"

Rules:

-Prefer well-known & highly rated movies
- Avoid repeating movie names
- Return ONLY movie names
`;

    const result = await model.generateContent(prompt);

    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return reply.send({ movies: [] });
    }

    const movies = text
      .split("\n")
      .map(m => m.replace(/^\d+\.?\s*/, "").trim())
      .filter(Boolean);

    // Save to DB (SYNC)
    req.server.db
      .prepare(
        `INSERT INTO recommendations (user_input, recommended_movies)
         VALUES (?, ?)`
      )
      .run(preference, JSON.stringify(movies));

    reply.send({ movies });
  } catch (err) {
    console.error("🔥 GEMINI ERROR:", err);
    reply.code(500).send({ error: "Gemini API error" });
  }
};
