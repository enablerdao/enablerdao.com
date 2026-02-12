import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

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
const LOCK_FILE = DATA_FILE + ".lock";
const LOCK_TIMEOUT_MS = 5000;
const LOCK_RETRY_MS = 50;

function ensureDataFile(): void {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

/**
 * Simple file-based lock to prevent race conditions on concurrent writes.
 * Acquires lock by creating a lock file, releases by removing it.
 */
function acquireLock(): void {
  const startTime = Date.now();
  while (existsSync(LOCK_FILE)) {
    // Check if lock is stale (older than timeout)
    try {
      const lockStat = readFileSync(LOCK_FILE, "utf-8");
      const lockTime = parseInt(lockStat, 10);
      if (Date.now() - lockTime > LOCK_TIMEOUT_MS) {
        // Stale lock, remove it
        try { require("fs").unlinkSync(LOCK_FILE); } catch { /* ignore */ }
        break;
      }
    } catch {
      // Lock file disappeared, proceed
      break;
    }

    if (Date.now() - startTime > LOCK_TIMEOUT_MS) {
      // Waited too long, force break stale lock
      try { require("fs").unlinkSync(LOCK_FILE); } catch { /* ignore */ }
      break;
    }

    // Busy-wait (synchronous context in Next.js API routes)
    const waitUntil = Date.now() + LOCK_RETRY_MS;
    while (Date.now() < waitUntil) { /* spin */ }
  }
  writeFileSync(LOCK_FILE, Date.now().toString(), "utf-8");
}

function releaseLock(): void {
  try {
    require("fs").unlinkSync(LOCK_FILE);
  } catch {
    // Lock already released
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
  acquireLock();
  try {
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
  } finally {
    releaseLock();
  }
}

export function answerQuestion(id: string, answer: string): QAItem | null {
  acquireLock();
  try {
    const items = getAllQuestions();
    const index = items.findIndex((q) => q.id === id);
    if (index === -1) return null;

    items[index].answer = answer;
    items[index].answeredAt = new Date().toISOString();
    writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
    return items[index];
  } finally {
    releaseLock();
  }
}

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
