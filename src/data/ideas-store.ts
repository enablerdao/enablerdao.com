// Edge-compatible Ideas store using in-memory storage
// WARNING: Data is NOT persisted in Edge Runtime
// TODO: Migrate to Cloudflare D1 or KV for persistence

export interface Idea {
  id: string;
  title: string;
  category: string;
  detail: string;
  nickname: string;
  email: string;
  likes: number;
  createdAt: string;
}

// In-memory store (will be reset on every deployment)
const ideas: Idea[] = [
  // Seed data to show the concept
  {
    id: "idea-seed-001",
    title: "町内会の回覧板をデジタル化したい",
    category: "daily",
    detail: "紙の回覧板が回ってくるのが遅い。見逃すことも多い。LINEグループだと情報が流れてしまう。専用の掲示板アプリがあれば便利。",
    nickname: "まちの人",
    email: "",
    likes: 12,
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "idea-seed-002",
    title: "確定申告をAIで自動化",
    category: "business",
    detail: "フリーランスの確定申告が毎年大変。レシートを撮影するだけで仕訳してくれるAIツールがほしい。",
    nickname: "フリーランス太郎",
    email: "",
    likes: 8,
    createdAt: "2026-02-10T14:30:00.000Z",
  },
  {
    id: "idea-seed-003",
    title: "子どもの宿題チェッカー",
    category: "education",
    detail: "小学生の算数ドリルの丸付けが面倒。カメラで撮影して自動で丸付け＆間違いの解説をしてくれるアプリがほしい。",
    nickname: "2児のママ",
    email: "",
    likes: 15,
    createdAt: "2026-02-15T09:00:00.000Z",
  },
];

export function getAllIdeas(): Idea[] {
  return [...ideas].sort((a, b) => b.likes - a.likes);
}

export function addIdea(data: {
  title: string;
  category: string;
  detail: string;
  nickname: string;
  email: string;
}): Idea {
  const newIdea: Idea = {
    id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: data.title,
    category: data.category,
    detail: data.detail,
    nickname: data.nickname,
    email: data.email,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  ideas.push(newIdea);
  return newIdea;
}

export function likeIdea(id: string): Idea | null {
  const idea = ideas.find((i) => i.id === id);
  if (!idea) return null;
  idea.likes += 1;
  return idea;
}
