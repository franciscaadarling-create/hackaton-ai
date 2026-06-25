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

export async function POST(req) {
  const body = await req.json();
  const results = await readResults();
  const entry = { ...body, id: Date.now(), submittedAt: new Date().toISOString() };
  results.push(entry);
  await writeResults(results);
  return new Response(JSON.stringify({ success: true }));
}

export async function GET() {
  const results = await readResults();
  return new Response(JSON.stringify(results));
}
