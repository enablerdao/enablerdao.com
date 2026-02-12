import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface QAItem {
  id: string;
  name: string;
  email: string;
  question: string;
  category: "general" | "technical" | "token" | "contribution" | "partnership";
  answer: string;
  answeredAt: string;
  createdAt: string;
}

const DATA_FILE = join(process.cwd(), "data", "qa.json");

function ensureDataFile(): void {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getAllQuestions(): QAItem[] {
  ensureDataFile();
  try {
    const raw = readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as QAItem[];
  } catch {
    return [];
  }
}

export function getPublicQuestions(): QAItem[] {
  return getAllQuestions().filter((q) => q.answer);
}

export function addQuestion(
  question: Omit<QAItem, "id" | "answer" | "answeredAt" | "createdAt">
): QAItem {
  const items = getAllQuestions();
  const newItem: QAItem = {
    ...question,
    id: generateId(),
    answer: "",
    answeredAt: "",
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
  return newItem;
}

export function answerQuestion(id: string, answer: string): QAItem | null {
  const items = getAllQuestions();
  const index = items.findIndex((q) => q.id === id);
  if (index === -1) return null;

  items[index].answer = answer;
  items[index].answeredAt = new Date().toISOString();
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
  return items[index];
}

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
