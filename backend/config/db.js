import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DB_PATH = path.join(__dirname, "../movies.db");


const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(" SQLite connection failed:", err.message);
  } else {
    console.log(" SQLite connected");
  }
});


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_input TEXT NOT NULL,
      recommended_movies TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
