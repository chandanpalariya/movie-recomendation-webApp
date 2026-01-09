

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
Suggest 3 to 5 popular ${preference} movies.
Return ONLY movie names, one per line.

Rules:

- Prefer well-known & highly rated movies
- Avoid repeating movie names
- Return ONLY movie names
`;

    const result = await model.generateContent(prompt);

    const candidates = result?.response?.candidates;
    if (!candidates?.length) {
      return reply.send({ movies: [] });
    }

    const text = candidates[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return reply.send({ movies: [] });
    }

    const movies = text
      .split("\n")
      .map(m => m.replace(/^\d+\.?\s*/, "").trim())
      .filter(Boolean);

    req.server.db.run(
      `INSERT INTO recommendations (user_input, recommended_movies)
       VALUES (?, ?)`,
      [preference, JSON.stringify(movies)]
    );

    reply.send({ movies });
  } catch (err) {
    console.error("GEMINI FAILURE:", err);
    reply.code(500).send({ error: "Gemini API error" });
  }
};
