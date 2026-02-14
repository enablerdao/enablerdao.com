# Google Analytics 4 セットアップガイド

Google Analytics 4（GA4）を使用して、enablerdao.comのユーザー行動を分析し、コンバージョンを最適化します。

## 目次
1. [GA4プロパティ作成](#1-ga4プロパティ作成)
2. [測定ID取得](#2-測定id取得)
3. [Next.js統合](#3-nextjs統合)
4. [カスタムイベント設定](#4-カスタムイベント設定)
5. [コンバージョン目標設定](#5-コンバージョン目標設定)
6. [Vercel Analytics統合（オプション）](#6-vercel-analytics統合オプション)
7. [データ確認](#7-データ確認)

---

## 1. GA4プロパティ作成

### 1.1 Googleアカウント準備

1. [Google Analytics](https://analytics.google.com/)にアクセス
2. Googleアカウントでログイン（プロジェクト管理用アカウント推奨）

### 1.2 アカウント作成

1. 左下の「管理」（歯車アイコン）をクリック
2. 「アカウントを作成」をクリック
3. 以下を入力:
   - **アカウント名**: `enablerDAO`
   - **アカウントのデータ共有設定**: デフォルトのまま（チェック推奨）
4. 「次へ」をクリック

### 1.3 プロパティ作成

1. 以下を入力:
   - **プロパティ名**: `enablerdao.com`
   - **レポートのタイムゾーン**: `日本`
   - **通貨**: `日本円（JPY）`
2. 「次へ」をクリック

### 1.4 ビジネス情報入力

1. 以下を選択:
   - **業種**: `スポーツ、フィットネス`
   - **ビジネスの規模**: `小規模（従業員1〜10名）`
   - **利用目的**:
     - ✅ ユーザー行動の分析
     - ✅ コンバージョンの測定
2. 「作成」をクリック
3. 利用規約に同意

---

## 2. 測定ID取得

### 2.1 データストリーム設定

1. 「データストリームを設定」画面で「ウェブ」を選択
2. 以下を入力:
   - **ウェブサイトのURL**: `https://enablerdao.com`
   - **ストリーム名**: `enablerdao.com - Web`
3. 「ストリームを作成」をクリック

### 2.2 測定IDコピー

1. ストリーム作成後、**測定ID**が表示されます:

```
G-XXXXXXXXXX
```

2. この測定IDをコピーして保存（後でNext.jsに設定）

### 2.3 拡張測定機能の有効化

1. ストリーム詳細画面の「拡張測定機能」セクションで以下を確認（デフォルトで有効）:
   - ✅ ページビュー
   - ✅ スクロール数
   - ✅ 離脱クリック
   - ✅ サイト内検索
   - ✅ 動画エンゲージメント
   - ✅ ファイルのダウンロード

これらは自動で計測されます。

---

## 3. Next.js統合

### 3.1 パッケージインストール

Next.js 13+ (App Router) で Google Analytics を使用します。

```bash
npm install @next/third-parties
```

### 3.2 Google Analytics コンポーネント追加

**ファイル:** `src/app/layout.tsx`

既存のlayout.tsxに以下を追加:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  )
}
```

### 3.3 環境変数設定

**ローカル開発（.env.local）:**

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Vercel本番環境:**

1. Vercel Dashboard → Settings → Environment Variables
2. 以下を追加:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Production, Preview |

**注意:** `NEXT_PUBLIC_` プレフィックスはクライアント側で使用するために必須です。

### 3.4 TypeScript型定義（オプション）

**ファイル:** `src/types/gtag.d.ts`

```typescript
export {};

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
```

---

## 4. カスタムイベント設定

enablerdao.com特有のユーザー行動を追跡するカスタムイベントを設定します。

### 4.1 イベント送信用ユーティリティ作成

**ファイル:** `src/lib/analytics.ts`

```typescript
type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

export const trackEvent = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// ニュースレター登録イベント
export const trackNewsletterSignup = (email: string) => {
  trackEvent({
    action: 'newsletter_signup',
    category: 'engagement',
    label: email,
  });
};

// 製品クリックイベント
export const trackProductClick = (productName: string, productPrice: number) => {
  trackEvent({
    action: 'product_click',
    category: 'ecommerce',
    label: productName,
    value: productPrice,
  });
};

// 無料トライアル開始イベント
export const trackFreeTrialStart = (plan: string) => {
  trackEvent({
    action: 'free_trial_start',
    category: 'conversion',
    label: plan,
  });
};

// 料金表示イベント
export const trackPricingView = () => {
  trackEvent({
    action: 'pricing_view',
    category: 'engagement',
  });
};

// 購入完了イベント（拡張eコマース）
export const trackPurchase = (
  transactionId: string,
  value: number,
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'JPY',
      items: items,
    });
  }
};
```

### 4.2 イベント実装例

**ニュースレター登録（src/components/Newsletter.tsx）:**

```typescript
'use client';

import { useState } from 'react';
import { trackNewsletterSignup } from '@/lib/analytics';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        // GA4イベント送信
        trackNewsletterSignup(email);
        alert('登録完了！');
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
      />
      <button type="submit">登録</button>
    </form>
  );
}
```

**製品クリック（src/app/products/page.tsx）:**

```typescript
'use client';

import { trackProductClick } from '@/lib/analytics';

export default function ProductsPage() {
  const products = [
    { id: 1, name: '柔術衣 ホワイト', price: 15000 },
    { id: 2, name: 'ラッシュガード', price: 8000 },
  ];

  const handleProductClick = (product: typeof products[0]) => {
    trackProductClick(product.name, product.price);
    // 製品詳細ページへ遷移等
  };

  return (
    <div>
      {products.map((product) => (
        <div key={product.id} onClick={() => handleProductClick(product)}>
          <h3>{product.name}</h3>
          <p>¥{product.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

**料金表示（src/app/pricing/page.tsx）:**

```typescript
'use client';

import { useEffect } from 'react';
import { trackPricingView } from '@/lib/analytics';

export default function PricingPage() {
  useEffect(() => {
    trackPricingView();
  }, []);

  return (
    <div>
      <h1>料金プラン</h1>
      {/* 料金表示内容 */}
    </div>
  );
}
```

---

## 5. コンバージョン目標設定

カスタムイベントをコンバージョンとしてマークします。

### 5.1 GA4でコンバージョン設定

1. Google Analytics 4 ダッシュボードを開く
2. 左メニュー「管理」→「イベント」をクリック
3. しばらく待つとカスタムイベントが表示されます（初回送信後24時間以内）

**表示されるイベント例:**
- `newsletter_signup`
- `product_click`
- `free_trial_start`
- `pricing_view`
- `purchase`

4. コンバージョンにしたいイベントの右側にある「コンバージョンとしてマークを付ける」トグルをオン

**推奨コンバージョン:**
- ✅ `newsletter_signup` （主要目標）
- ✅ `purchase` （収益目標）
- ✅ `free_trial_start` （エンゲージメント目標）

### 5.2 コンバージョン値設定（収益計測）

`purchase` イベントには自動で収益が記録されますが、他のコンバージョンにも価値を設定できます。

1. 「管理」→「イベント」→「イベントを作成」をクリック
2. 以下のように設定:

**イベント名:** `newsletter_signup_value`

- **一致条件**: `event_name` が `newsletter_signup` に等しい
- **パラメータ変更**: `value` を `500`（仮想価値：500円）に設定

これにより、ニュースレター登録1件あたり500円の価値として計測されます。

---

## 6. Vercel Analytics統合（オプション）

Vercel Analyticsは、より高速でプライバシー重視の分析ツールです。GA4と併用できます。

### 6.1 Vercel Analytics有効化

1. Vercel Dashboard → プロジェクト「enablerdao」
2. 「Analytics」タブをクリック
3. 「Enable Analytics」をクリック

**料金:**
- Hobby: 無料（月10,000イベントまで）
- Pro: $10/月（月100,000イベントまで）

### 6.2 Next.jsに統合

```bash
npm install @vercel/analytics
```

**ファイル:** `src/app/layout.tsx`

```typescript
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
        <Analytics />
      </body>
    </html>
  )
}
```

### 6.3 Vercel vs GA4 比較

| 機能 | Vercel Analytics | Google Analytics 4 |
|------|------------------|-------------------|
| セットアップ | 超簡単 | やや複雑 |
| プライバシー | Cookie不要 | Cookie使用 |
| パフォーマンス | 超高速 | やや重い |
| 詳細分析 | 基本のみ | 非常に詳細 |
| コンバージョン | 制限あり | 柔軟 |
| 料金 | $0-10/月 | 無料 |

**推奨構成:**
- **初期段階**: GA4のみ（無料で詳細分析）
- **トラフィック増加後**: GA4 + Vercel Analytics併用

---

## 7. データ確認

### 7.1 リアルタイムレポート確認

1. Google Analytics 4 ダッシュボードを開く
2. 左メニュー「レポート」→「リアルタイム」をクリック
3. 開発環境でページを開き、アクセスが表示されるか確認

**確認項目:**
- 現在のユーザー数
- ページタイトルとURL
- トラフィックソース

### 7.2 イベントデバッグ

**Google Tag Assistant を使用:**

1. Chrome拡張機能 [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) をインストール
2. enablerdao.com を開く
3. Tag Assistantアイコンをクリック
4. 「Enable」をクリック
5. ページをリロード
6. Google Analytics タグが正常に動作しているか確認

**DebugViewを使用（推奨）:**

1. GA4 ダッシュボードで「管理」→「DebugView」をクリック
2. ローカル開発時に以下のURLパラメータを追加:

```
http://localhost:3000?debug_mode=true
```

3. イベントがリアルタイムで表示されます

### 7.3 カスタムレポート作成

1. 「レポート」→「ライブラリ」をクリック
2. 「カスタムレポートを作成」をクリック
3. 以下のディメンションと指標を追加:

**ニュースレター登録レポート:**
- **指標**: `newsletter_signup` イベント数
- **ディメンション**: 日付、トラフィックソース

**製品クリックレポート:**
- **指標**: `product_click` イベント数
- **ディメンション**: イベントラベル（製品名）、日付

---

## トラブルシューティング

### イベントが記録されない場合

1. **測定IDが正しいか確認**:
   - `.env.local` と Vercel環境変数の `NEXT_PUBLIC_GA_MEASUREMENT_ID` を確認

2. **ブラウザ開発者ツールで確認**:
   ```javascript
   // Consoleで実行
   window.gtag
   ```
   `undefined` の場合、スクリプトが読み込まれていません

3. **広告ブロッカー無効化**:
   - uBlock Origin、AdBlock等がGA4をブロックしている可能性があります

4. **Cookie設定確認**:
   - ブラウザでサードパーティCookieが有効か確認

### リアルタイムレポートに表示されない場合

- **データ反映に最大30秒かかります**
- **localhost からのアクセス**は除外される場合があります（本番URLで確認）

### コンバージョンが表示されない場合

- **初回イベント送信後、24〜48時間待つ必要があります**
- 「管理」→「イベント」で該当イベントが表示されているか確認

---

## ベストプラクティス

### プライバシー対応

1. **プライバシーポリシー更新**:
   - Google Analyticsの使用を明記
   - Cookie使用について説明
   - オプトアウト方法を提供

2. **Cookie同意バナー実装（GDPR対応）**:

```bash
npm install react-cookie-consent
```

**ファイル:** `src/components/CookieConsent.tsx`

```typescript
'use client';

import CookieConsentBanner from 'react-cookie-consent';

export function CookieConsent() {
  return (
    <CookieConsentBanner
      location="bottom"
      buttonText="同意する"
      declineButtonText="拒否"
      enableDeclineButton
      cookieName="enablerdao-analytics-consent"
      style={{ background: '#2B373B' }}
      buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
      expires={365}
    >
      当サイトではサービス向上のためCookieを使用しています。
      詳細は
      <a href="/privacy" style={{ color: '#FFF', textDecoration: 'underline' }}>
        プライバシーポリシー
      </a>
      をご覧ください。
    </CookieConsentBanner>
  );
}
```

### パフォーマンス最適化

1. **Next.js の `@next/third-parties` を使用**（既に実装済み）
2. **スクリプトの遅延読み込み**は自動で最適化されます

---

## 参考リンク

- [Google Analytics 4 公式ドキュメント](https://support.google.com/analytics/answer/9304153)
- [Next.js Third Party Libraries](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)
- [GA4 イベントリファレンス](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Vercel Analytics ドキュメント](https://vercel.com/docs/analytics)
