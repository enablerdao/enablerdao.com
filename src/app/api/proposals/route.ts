import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const CHATWEB_API_KEY = process.env.CHATWEB_API_KEY || ''
const CHATWEB_API_URL = 'https://api.chatweb.ai/v1/chat/completions'

async function analyzeProposal(description: string) {
  if (!CHATWEB_API_KEY) {
    return {
      summary: description.slice(0, 200) + '...',
      impact: '分析には CHATWEB_API_KEY が必要です',
      recommendation: 'neutral',
      recommendation_reason: 'APIキー未設定',
      confidence: 0
    }
  }

  try {
    const response = await fetch(CHATWEB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATWEB_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        messages: [{
          role: 'user',
          content: `以下のDAO提案を分析してください。JSON形式で回答してください。

提案内容:
${description}

以下の形式で回答:
{
  "summary": "提案の要約（100字以内）",
  "impact": "財務・コミュニティへの影響分析（200字以内）",
  "recommendation": "for" または "against" または "neutral",
  "recommendation_reason": "推奨理由（100字以内）",
  "confidence": 0.0〜1.0の数値
}`
        }],
        max_tokens: 500
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Parse JSON from AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('AI analysis error:', e)
  }

  return {
    summary: description.slice(0, 200),
    impact: 'AI分析中にエラーが発生しました',
    recommendation: 'neutral',
    recommendation_reason: 'エラー',
    confidence: 0
  }
}

export async function GET() {
  return NextResponse.json({
    proposals: [
      {
        id: 'EDP-001',
        title: '全プロダクトRust + Fly.io + SQLite統一アーキテクチャ移行',
        status: 'active'
      },
      {
        id: 'EDP-002',
        title: 'EBRトークン自動配布システムの導入',
        status: 'pending'
      },
      {
        id: 'EDP-003',
        title: 'StayFlow集中戦略 -- 3スタープロダクトへのリソース再配分',
        status: 'active'
      }
    ]
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { description } = body

  if (!description || typeof description !== 'string') {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }

  const analysis = await analyzeProposal(description)

  return NextResponse.json({
    analysis,
    analyzed_at: new Date().toISOString()
  })
}
