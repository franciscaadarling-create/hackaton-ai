import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "results.json");

async function readResults() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeResults(results) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(results, null, 2), "utf-8");
}

import { createNotification } from "@/lib/notifications";

export async function POST(req) {
  const body = await req.json();
  const results = await readResults();
  const entry = { ...body, id: Date.now(), submittedAt: new Date().toISOString() };
  results.push(entry);
  await writeResults(results);
  try {
    if (body.teacherName) {
      await createNotification({ type: "quiz_completed", forUser: body.teacherName, quizId: entry.id, topic: body.topic, studentName: body.studentName, score: body.score, total: body.total });
    }
  } catch {}
  return new Response(JSON.stringify({ success: true }));
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const teacherName = searchParams.get("teacherName");
  let results = await readResults();
  if (teacherName) {
    const quizzesFilePath = path.join(process.cwd(), "data", "quizzes.json");
    let quizzes = [];
    try {
      const raw = await fs.readFile(quizzesFilePath, "utf-8");
      quizzes = JSON.parse(raw);
    } catch {}
    const teacherQuizTopics = new Set(quizzes.filter((q) => q.teacherName === teacherName).map((q) => q.topic));
    results = results.filter((r) => teacherQuizTopics.has(r.topic));
  }
  return new Response(JSON.stringify(results));
}
