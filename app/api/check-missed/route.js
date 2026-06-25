export const dynamic = "force-dynamic";
import { promises as fs } from "fs";
import path from "path";
import { createNotification, getAll } from "@/lib/notifications";

const QUIZ_FILE = path.join(process.cwd(), "data", "quizzes.json");
const RESULT_FILE = path.join(process.cwd(), "data", "results.json");
const USER_FILE = path.join(process.cwd(), "data", "users.json");

async function readJson(file) {
  try { const raw = await fs.readFile(file, "utf-8"); return JSON.parse(raw); } catch { return []; }
}

export async function GET() {
  const [quizzes, results, users, notifs] = await Promise.all([
    readJson(QUIZ_FILE), readJson(RESULT_FILE), readJson(USER_FILE), getAll(),
  ]);
  const students = users.filter((u) => u.role === "student").map((u) => u.username);
  const now = new Date();
  const missed = [];

  for (const quiz of quizzes) {
    if (!quiz.deadline || new Date(quiz.deadline) > now) continue;
    const submittedStudents = results.filter((r) => r.topic === quiz.topic).map((r) => r.studentName);
    for (const student of students) {
      if (submittedStudents.includes(student)) continue;
      const alreadyNotified = notifs.some(
        (n) => n.type === "quiz_missed" && n.quizId === quiz.id && n.studentName === student
      );
      if (!alreadyNotified) {
        await createNotification({ type: "quiz_missed", forUser: "docente", quizId: quiz.id, topic: quiz.topic, studentName: student, deadline: quiz.deadline });
        missed.push({ student, topic: quiz.topic });
      }
    }
  }

  return new Response(JSON.stringify({ missed, count: missed.length }));
}
