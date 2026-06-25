import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "users.json");
const TEACHER_CODE = "DOCENTE2024";
const STUDENT_CODE = "ALUMNO2024";

async function readUsers() {
  try { const raw = await fs.readFile(DATA_FILE, "utf-8"); return JSON.parse(raw); } catch { return []; }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
}

async function ensureSeed() {
  try {
    const users = await readUsers();
    if (users.length === 0) {
      await writeUsers([
        { username: "docente", password: "docente123", role: "teacher" },
        { username: "alumno", password: "alumno123", role: "student" },
      ]);
    }
  } catch {}
}

export async function POST(req) {
  try {
    await ensureSeed();
    const { action, username, password, role, code } = await req.json();
    const users = await readUsers();

    if (action === "register") {
      if (users.find((u) => u.username === username)) {
        return new Response(JSON.stringify({ error: "El usuario ya existe" }), { status: 400 });
      }
      if (role === "teacher" && code !== TEACHER_CODE) {
        return new Response(JSON.stringify({ error: "Código de docente incorrecto" }), { status: 400 });
      }
      if (role === "student" && code !== STUDENT_CODE) {
        return new Response(JSON.stringify({ error: "Código de alumno incorrecto" }), { status: 400 });
      }
      users.push({ username, password, role });
      await writeUsers(users);
      return new Response(JSON.stringify({ ok: true }));
    }

    if (action === "login") {
      const user = users.find((u) => u.username === username && u.password === password);
      if (!user) {
        return new Response(JSON.stringify({ error: "Credenciales incorrectas" }), { status: 401 });
      }
      return new Response(JSON.stringify({ ok: true, role: user.role }));
    }

    return new Response(JSON.stringify({ error: "Acción inválida" }), { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
