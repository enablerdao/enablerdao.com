'use client'
import { useState } from 'react'

const CREDIT_PRESETS = [100, 500, 1000, 5000]
const CHATWEB_API = 'https://api.chatweb.ai'
const TREASURY = 'DK29rBGCvP83LUNjUGVM6xt6qPy6rycBFopXbFkg9XvQ'
const ENAI_MINT = '8CeusiVAeibuBGv5xcf7kt7JQZzqwTS5pD7u2CfyoWnL'

type Step = 'input' | 'send' | 'done'

interface InitiateResult {
  tx_id: string
  enai_amount: number
  enai_amount_raw: string
  treasury_wallet: string
  phantom_deeplink: string
  expires_at: string
}

interface ConfirmResult {
  credits_added: number
  credits_remaining: number
}

export default function EnaiPurchase() {
  const [step, setStep] = useState<Step>('input')
  const [apiKey, setApiKey] = useState('')
  const [credits, setCredits] = useState(1000)
  const [customCredits, setCustomCredits] = useState('')
  const [txId, setTxId] = useState('')
  const [enaiAmount, setEnaiAmount] = useState(0)
  const [phantomDeeplink, setPhantomDeeplink] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [txSig, setTxSig] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ConfirmResult | null>(null)
  const [copied, setCopied] = useState(false)

  const effectiveCredits = customCredits ? parseInt(customCredits, 10) || 0 : credits
  const enaiNeeded = effectiveCredits / 10 // 1 ENAI = 10 credits

  async function handleInitiate() {
    setError('')
    if (!apiKey.trim()) {
      setError('chatweb.ai APIキーを入力してください')
      return
    }
    if (!apiKey.startsWith('cw_')) {
      setError('APIキーは "cw_" から始まる必要があります')
      return
    }
    if (effectiveCredits < 10) {
      setError('最低10クレジット（1 ENAI）から購入できます')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${CHATWEB_API}/api/v1/crypto/enai/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({ credits: effectiveCredits }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (res.status === 401) {
          setError('APIキーが無効です。chatweb.ai でAPIキーを確認してください。')
        } else if (res.status === 400) {
          setError(`リクエストエラー: ${body.error || '不正なパラメータです'}`)
        } else {
          setError(`APIエラー (${res.status}): ${body.error || 'サーバーエラーが発生しました'}`)
        }
        return
      }

      const data: InitiateResult = await res.json()
      setTxId(data.tx_id)
      setEnaiAmount(data.enai_amount)
      setPhantomDeeplink(data.phantom_deeplink)
      setExpiresAt(data.expires_at)
      setStep('send')
    } catch {
      setError('ネットワークエラーが発生しました。インターネット接続を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm() {
    setError('')
    if (!txSig.trim()) {
      setError('Solanaトランザクション署名を入力してください')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${CHATWEB_API}/api/v1/crypto/enai/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({ tx_id: txId, tx_signature: txSig.trim() }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (res.status === 400) {
          const msg = body.error || ''
          if (msg.includes('expired') || msg.includes('期限')) {
            setError('支払いリクエストの期限が切れました。最初からやり直してください。')
          } else if (msg.includes('signature') || msg.includes('verify')) {
            setError('トランザクション署名の検証に失敗しました。正しい署名を入力してください。')
          } else {
            setError(`確認エラー: ${msg || '検証に失敗しました'}`)
          }
        } else if (res.status === 404) {
          setError('支払いリクエストが見つかりません。期限切れの可能性があります。')
        } else {
          const body = await res.json().catch(() => ({}))
          setError(`APIエラー (${res.status}): ${body.error || 'サーバーエラーが発生しました'}`)
        }
        return
      }

      const data: ConfirmResult = await res.json()
      setResult(data)
      setStep('done')
    } catch {
      setError('ネットワークエラーが発生しました。インターネット接続を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText(TREASURY).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleReset() {
    setStep('input')
    setTxId('')
    setEnaiAmount(0)
    setPhantomDeeplink('')
    setExpiresAt('')
    setTxSig('')
    setError('')
    setResult(null)
    setCopied(false)
  }

  const mintShort = `${ENAI_MINT.slice(0, 14)}...${ENAI_MINT.slice(-3)}`

  return (
    <div className="terminal-box p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
        <span className="text-[#555] text-xs">enablerdao@web3:~/enai-purchase$</span>
        <span className="text-[#00ff00] text-xs">./enai-purchase.sh --interactive</span>
      </div>

      {/* Step 1: API Key + Credit selection */}
      {step === 'input' && (
        <div className="space-y-4">
          <h2 className="text-[#4488ff] text-sm">
            # ENAIでchatweb.aiクレジット購入
          </h2>
          <p className="text-[#555] text-[10px] sm:text-xs">
            {`// 1 ENAI = 10 credits | Solana SPL Token`}
          </p>

          {/* API Key input */}
          <div>
            <label className="block text-[#888] text-[10px] sm:text-xs mb-1">
              <span className="text-[#00ffff]">chatweb.ai APIキー</span>
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="cw_xxxxxxxxxx..."
              className="w-full bg-[#0d0d0d] border border-[#1a3a1a] text-[#00ff00] text-xs px-3 py-2 font-mono placeholder-[#333] focus:outline-none focus:border-[#00ff00]/50"
            />
            <p className="text-[#444] text-[9px] sm:text-[10px] mt-1">
              ※{' '}
              <a
                href="https://chatweb.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4488ff] hover:text-[#6699ff] underline"
              >
                chatweb.ai
              </a>{' '}
              にログイン → アカウント → APIキーから取得
            </p>
          </div>

          {/* Credit presets */}
          <div>
            <label className="block text-[#888] text-[10px] sm:text-xs mb-2">
              <span className="text-[#00ffff]">購入クレジット数</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {CREDIT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setCredits(preset)
                    setCustomCredits('')
                  }}
                  className={`px-3 py-1.5 text-xs border transition-colors ${
                    credits === preset && !customCredits
                      ? 'border-[#4488ff]/60 text-[#4488ff] bg-[#4488ff]/10'
                      : 'border-[#1a3a1a] text-[#555] hover:text-[#888] hover:border-[#333]'
                  }`}
                >
                  {preset.toLocaleString()}
                </button>
              ))}
              <input
                type="number"
                value={customCredits}
                onChange={(e) => {
                  setCustomCredits(e.target.value)
                  setCredits(0)
                }}
                placeholder="カスタム"
                min="10"
                step="10"
                className="w-24 bg-[#0d0d0d] border border-[#1a3a1a] text-[#00ff00] text-xs px-2 py-1.5 font-mono placeholder-[#333] focus:outline-none focus:border-[#4488ff]/50"
              />
            </div>

            {/* Rate display */}
            <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-[#555]">必要ENAI:</span>
                <span className="text-[#4488ff] font-bold font-mono">
                  {enaiNeeded % 1 === 0 ? enaiNeeded.toLocaleString() : enaiNeeded.toFixed(1)} ENAI
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs mt-1">
                <span className="text-[#555]">取得クレジット:</span>
                <span className="text-[#00ff00] font-mono">{effectiveCredits.toLocaleString()} credits</span>
              </div>
              <p className="text-[#333] text-[9px] mt-2">レート: 1 ENAI = 10 credits</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-2 border border-[#ff4444]/40 bg-[#ff4444]/5">
              <p className="text-[#ff6666] text-[10px] sm:text-xs">
                <span className="text-[#ff4444]">[ERR] </span>{error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleInitiate}
            disabled={loading || effectiveCredits < 10}
            className="w-full px-4 py-3 bg-[#4488ff]/10 border border-[#4488ff]/30 text-[#4488ff] text-xs hover:bg-[#4488ff]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="text-[#555]">処理中...</span>
            ) : (
              '$ 支払いを開始する'
            )}
          </button>
        </div>
      )}

      {/* Step 2: Send instructions */}
      {step === 'send' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff00]">&#x2713;</span>
            <h2 className="text-[#00ff00] text-sm">支払いリクエスト作成済み</h2>
          </div>
          <p className="text-[#555] text-[10px] sm:text-xs">
            {`// 以下の手順でENAIを送金してください`}
          </p>

          {/* Instructions */}
          <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] space-y-3">
            <div className="flex items-start gap-2 text-[10px] sm:text-xs">
              <span className="text-[#4488ff] flex-shrink-0">1.</span>
              <span className="text-[#888]">Phantomウォレットを開く</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-start gap-2 text-[10px] sm:text-xs">
                <span className="text-[#4488ff] flex-shrink-0">2.</span>
                <span className="text-[#888]">
                  以下のアドレスに{' '}
                  <span className="text-[#4488ff] font-bold font-mono">{enaiAmount} ENAI</span>{' '}
                  を送金:
                </span>
              </div>
              <div className="ml-5 p-2 bg-[#0a0a0a] border border-[#1a3a1a] flex items-center justify-between gap-2">
                <span className="text-[#00ff00] text-[9px] sm:text-[10px] font-mono break-all">
                  {TREASURY}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="flex-shrink-0 px-2 py-1 border border-[#1a3a1a] text-[#555] text-[9px] hover:text-[#888] hover:border-[#333] transition-colors"
                >
                  {copied ? '&#x2713; コピー済' : 'コピー'}
                </button>
              </div>
              <div className="ml-5 text-[9px] text-[#555] font-mono">
                Token: {mintShort}
              </div>
            </div>
            <div className="flex items-start gap-2 text-[10px] sm:text-xs">
              <span className="text-[#4488ff] flex-shrink-0">3.</span>
              <span className="text-[#888]">送金後、Solanaトランザクション署名を入力:</span>
            </div>
          </div>

          {/* TX Signature input */}
          <div>
            <label className="block text-[#888] text-[10px] sm:text-xs mb-1">
              <span className="text-[#00ffff]">tx_signature</span>
            </label>
            <input
              type="text"
              value={txSig}
              onChange={(e) => setTxSig(e.target.value)}
              placeholder="Solanaトランザクション署名（base58）..."
              className="w-full bg-[#0d0d0d] border border-[#1a3a1a] text-[#00ff00] text-xs px-3 py-2 font-mono placeholder-[#333] focus:outline-none focus:border-[#00ff00]/50"
            />
          </div>

          {/* Expiry notice */}
          {expiresAt && (
            <p className="text-[#ffaa00] text-[9px] sm:text-[10px]">
              &#x26A0; 期限: {new Date(expiresAt).toLocaleString('ja-JP')} までに送金してください
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="p-2 border border-[#ff4444]/40 bg-[#ff4444]/5">
              <p className="text-[#ff6666] text-[10px] sm:text-xs">
                <span className="text-[#ff4444]">[ERR] </span>{error}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {phantomDeeplink && (
              <a
                href={phantomDeeplink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#aa66ff]/10 border border-[#aa66ff]/30 text-[#aa66ff] text-xs hover:bg-[#aa66ff]/20 transition-colors"
              >
                Phantom Deeplink で開く &#x2197;
              </a>
            )}
            <a
              href={`https://solscan.io/account/${TREASURY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0d0d0d] border border-[#1a3a1a] text-[#555] text-xs hover:text-[#888] transition-colors"
            >
              Solscan でトレジャリーを確認 &#x2197;
            </a>
          </div>

          <button
            onClick={handleConfirm}
            disabled={loading || !txSig.trim()}
            className="w-full px-4 py-3 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="text-[#555]">確認中...</span>
            ) : (
              '$ 支払いを確認する'
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-full text-[#555] text-[10px] hover:text-[#888] transition-colors py-1"
          >
            &#x2190; 最初からやり直す
          </button>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 'done' && result && (
        <div className="space-y-4">
          <div className="p-4 border border-[#00ff00]/40 bg-[#00ff00]/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#00ff00] text-lg">&#x2713;</span>
              <h2 className="text-[#00ff00] text-sm">支払い確認完了</h2>
            </div>
            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#555]">追加クレジット:</span>
                <span className="text-[#00ff00] font-bold">
                  + {result.credits_added.toLocaleString()} credits
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#555]">残高:</span>
                <span className="text-[#00ffff]">
                  {result.credits_remaining.toLocaleString()} credits
                </span>
              </div>
            </div>
          </div>

          <a
            href="https://chatweb.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4488ff]/10 border border-[#4488ff]/30 text-[#4488ff] text-xs hover:bg-[#4488ff]/20 transition-colors"
          >
            chatweb.ai を開く &#x2192;
          </a>

          <button
            onClick={handleReset}
            className="w-full text-[#555] text-[10px] hover:text-[#888] transition-colors py-1"
          >
            &#x21BB; もう一度購入する
          </button>
        </div>
      )}
    </div>
  )
}
