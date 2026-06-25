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
  const teacherName = searchParams.get("teacherName");
  const studentName = searchParams.get("studentName");
  let quizzes = await readQuizzes();
  if (level) {
    quizzes = quizzes.filter((q) => !q.level || q.level === level);
  }
  if (subject) {
    quizzes = quizzes.filter((q) => q.subject === subject);
  }
  if (teacherName) {
    quizzes = quizzes.filter((q) => q.teacherName === teacherName);
  }
  if (studentName) {
    quizzes = quizzes.filter((q) => !q.forStudent || q.forStudent === studentName);
  }
  return new Response(JSON.stringify(quizzes));
}

export async function POST(req) {
  const { topic, questions, deadline, level, subject, teacherName, forStudent } = await req.json();
  const quizzes = await readQuizzes();
  const quiz = { id: Date.now(), topic, questions, publishedAt: new Date().toISOString(), deadline: deadline || null, level: level || null, subject: subject || null, teacherName: teacherName || null, forStudent: forStudent || null };
  quizzes.push(quiz);
  await writeQuizzes(quizzes);
  return new Response(JSON.stringify(quiz));
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));
  if (!id) return new Response(JSON.stringify({ error: "id requerido" }), { status: 400 });
  let quizzes = await readQuizzes();
  quizzes = quizzes.filter((q) => q.id !== id);
  await writeQuizzes(quizzes);
  return new Response(JSON.stringify({ ok: true }));
}
