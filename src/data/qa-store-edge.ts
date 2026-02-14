// Edge-compatible Q&A store using in-memory storage
// WARNING: Data is NOT persisted in Edge Runtime
// This is a temporary fallback for Cloudflare Pages deployment
// TODO: Migrate to Cloudflare D1 or KV for persistence

export interface Question {
  id: string;
  name: string;
  email: string;
  question: string;
  category: string;
  answer: string;
  status: "pending" | "answered";
  createdAt: string;
  answeredAt: string;
}

// In-memory store (will be reset on every deployment)
const questions: Question[] = [];

export function getAllQuestions(): Question[] {
  return questions;
}

export function getPublicQuestions(): Question[] {
  return questions.filter((q) => q.status === "answered");
}

export function addQuestion(data: {
  name: string;
  email: string;
  question: string;
  category: string;
}): Question {
  const newQuestion: Question = {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: data.name,
    email: data.email,
    question: data.question,
    category: data.category,
    answer: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    answeredAt: "",
  };
  questions.push(newQuestion);
  return newQuestion;
}

export function answerQuestion(id: string, answer: string): Question | null {
  const question = questions.find((q) => q.id === id);
  if (!question) return null;
  
  question.answer = answer;
  question.status = "answered";
  question.answeredAt = new Date().toISOString();
  
  return question;
}
