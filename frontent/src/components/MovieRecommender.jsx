import { useState } from "react";

export default function MovieRecommender() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recommend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMovies([]);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recommend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preference: input }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMovies(data.movies || []);
    } catch (err) {
      console.error(err);
      setError("Unable to get movie recommendations. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg p-6">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          🎬 Movie Recommender
        </h1>
        <p className="text-center text-gray-300 text-sm mb-5">
          Tell us your mood, we’ll suggest movies 
        </p>

        {/* Input */}
        <input
          className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
          placeholder="e.g. comedy movies, romantic bollywood movies"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={recommend}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          {loading ? "Finding movies..." : "🎥 Get Recommendations"}
        </button>

        {/* Loading */}
        {loading && (
          <div className="mt-4 text-center text-gray-300 animate-pulse">
             AI is thinking...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 text-center text-red-400">
            {error}
          </div>
        )}

        {/* Movies List */}
        {movies.length > 0 && (
          <div className="mt-6">
            <h2 className="text-white text-lg font-semibold mb-3">
               Recommended Movies
            </h2>

            <div className="space-y-3">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 rounded-lg p-3 hover:scale-[1.02] transition"
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-white">{movie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && !error && (
          <p className="mt-5 text-center text-gray-400 text-sm">
             Enter a movie preference to get recommendations
          </p>
        )}
      </div>
    </div>
  );
}
