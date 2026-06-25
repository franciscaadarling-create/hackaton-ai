import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "quizzes.json");

async function readQuizzes() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeQuizzes(quizzes) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(quizzes, null, 2), "utf-8");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level");
  const subject = searchParams.get("subject");
  let quizzes = await readQuizzes();
  if (level) {
    quizzes = quizzes.filter((q) => !q.level || q.level === level);
  }
  if (subject) {
    quizzes = quizzes.filter((q) => q.subject === subject);
  }
  return new Response(JSON.stringify(quizzes));
}

export async function POST(req) {
  const { topic, questions, deadline, level, subject } = await req.json();
  const quizzes = await readQuizzes();
  const quiz = { id: Date.now(), topic, questions, publishedAt: new Date().toISOString(), deadline: deadline || null, level: level || null, subject: subject || null };
  quizzes.push(quiz);
  await writeQuizzes(quizzes);
  return new Response(JSON.stringify(quiz));
}
