# Resend メール配信サービス セットアップガイド

Resendは、開発者向けのモダンなメール配信APIです。このガイドでは、enablerdao.comでResendを利用するための設定手順を説明します。

## 目次
1. [アカウント作成](#1-アカウント作成)
2. [API Key取得](#2-api-key取得)
3. [ドメイン認証](#3-ドメイン認証)
4. [DNS設定](#4-dns設定)
5. [ウェルカムメールテンプレート](#5-ウェルカムメールテンプレート)
6. [Vercel環境変数設定](#6-vercel環境変数設定)
7. [テスト送信](#7-テスト送信)

---

## 1. アカウント作成

1. [Resend公式サイト](https://resend.com/)にアクセス
2. 右上の「Sign Up」をクリック
3. 以下の情報を入力:
   - メールアドレス（プロジェクト管理用）
   - パスワード
4. メール認証リンクをクリックして認証完了
5. ダッシュボードにログイン

**料金プラン:**
- Free: 月100通まで無料
- Pro: 月$20で50,000通まで
- enablerdao.comの初期段階ではFreeプランで十分です

---

## 2. API Key取得

1. Resendダッシュボードにログイン
2. 左メニューから「API Keys」をクリック
3. 「Create API Key」ボタンをクリック
4. 以下を設定:
   - **Name**: `enablerdao-production`
   - **Permission**: `Full access` または `Sending access`
   - **Domain**: `enablerdao.com` を選択（ドメイン追加後）
5. 「Create」をクリック
6. 表示されたAPI Keyをコピー（**一度しか表示されません**）

```
re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**重要:**
- API Keyは `.env.local` に保存し、Gitにコミットしない
- 本番環境ではVercel環境変数に設定

---

## 3. ドメイン認証

1. Resendダッシュボードで「Domains」をクリック
2. 「Add Domain」ボタンをクリック
3. ドメイン名を入力: `enablerdao.com`
4. 「Add」をクリック

**サブドメイン設定（推奨）:**

メール専用サブドメインを使用することで、メインドメインのSEO評価に影響を与えません:

```
mail.enablerdao.com
```

または

```
noreply.enablerdao.com
```

---

## 4. DNS設定

ドメイン追加後、Resendが以下のDNSレコードを表示します。DNS管理画面（お名前.com、Cloudflare等）に追加してください。

### 4.1 SPFレコード（TXTレコード）

SPF（Sender Policy Framework）は、送信元サーバーを認証します。

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | `v=spf1 include:_spf.resend.com ~all` | 3600 |

**サブドメイン使用時:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | mail | `v=spf1 include:_spf.resend.com ~all` | 3600 |

### 4.2 DKIMレコード（TXTレコード）

DKIM（DomainKeys Identified Mail）は、メールの改ざん防止を行います。

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | resend._domainkey | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...（長い文字列）` | 3600 |

**注意:** 実際の値はResendダッシュボードに表示されるものをコピーしてください。

### 4.3 DMARCレコード（オプション・推奨）

DMARC（Domain-based Message Authentication, Reporting & Conformance）は、SPFとDKIMの認証失敗時の対応を指定します。

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:dmarc@enablerdao.com` | 3600 |

**ポリシー説明:**
- `p=none`: 認証失敗時もメールを配信（レポートのみ収集）
- `p=quarantine`: 認証失敗時は迷惑メールフォルダへ
- `p=reject`: 認証失敗時は拒否

初期段階では `p=none` を設定し、レポートを確認してから `p=quarantine` に変更することを推奨します。

### 4.4 DNS設定確認

1. DNS設定後、10分〜48時間で反映（通常は10分程度）
2. Resendダッシュボードで「Verify」ボタンをクリック
3. ステータスが「Verified」になれば完了

**確認コマンド（macOS/Linux）:**

```bash
# SPFレコード確認
dig TXT enablerdao.com +short

# DKIMレコード確認
dig TXT resend._domainkey.enablerdao.com +short

# DMARCレコード確認
dig TXT _dmarc.enablerdao.com +short
```

---

## 5. ウェルカムメールテンプレート

React Email形式でウェルカムメールを作成します。

### 5.1 パッケージインストール

```bash
npm install resend react-email @react-email/components
npm install -D @types/react @types/react-dom
```

### 5.2 テンプレートファイル作成

**ファイル:** `src/emails/WelcomeEmail.tsx`

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userEmail: string;
  userName?: string;
}

export const WelcomeEmail = ({
  userEmail,
  userName = 'ユーザー',
}: WelcomeEmailProps) => {
  const previewText = 'enablerDAO へようこそ！';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://enablerdao.com/logo.png"
              width="150"
              height="50"
              alt="enablerDAO"
              style={logo}
            />
          </Section>

          <Heading style={h1}>ようこそ、{userName}さん！</Heading>

          <Text style={text}>
            enablerDAOのニュースレターにご登録いただき、ありがとうございます。
          </Text>

          <Text style={text}>
            最新の柔術技術、トレーニング方法、大会情報などを毎週お届けします。
            このメールアドレス（{userEmail}）に配信されます。
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href="https://enablerdao.com">
              サイトを見る
            </Button>
          </Section>

          <Text style={text}>
            また、以下のコンテンツもご利用いただけます:
          </Text>

          <ul style={list}>
            <li style={listItem}>
              <Link href="https://enablerdao.com/products" style={link}>
                製品カタログ
              </Link>
              {' - おすすめの柔術用品'}
            </li>
            <li style={listItem}>
              <Link href="https://enablerdao.com/articles" style={link}>
                技術記事
              </Link>
              {' - プロの技術解説'}
            </li>
            <li style={listItem}>
              <Link href="https://enablerdao.com/events" style={link}>
                イベント情報
              </Link>
              {' - 大会・セミナー情報'}
            </li>
          </ul>

          <hr style={hr} />

          <Text style={footer}>
            配信停止は
            <Link
              href="https://enablerdao.com/unsubscribe?email={userEmail}"
              style={link}
            >
              こちら
            </Link>
            から。
            <br />
            enablerDAO | 柔術を楽しむすべての人へ
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
};

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const list = {
  padding: '0 48px',
};

const listItem = {
  marginBottom: '10px',
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
};
```

### 5.3 送信関数作成

**ファイル:** `src/lib/resend.ts`

```typescript
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  userEmail: string,
  userName?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'enablerDAO <noreply@enablerdao.com>',
      to: userEmail,
      subject: 'enablerDAOへようこそ！',
      react: WelcomeEmail({ userEmail, userName }),
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return { success: false, error };
  }
}
```

### 5.4 API Route統合

**ファイル:** `src/app/api/newsletter/subscribe/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // TODO: データベースにメールアドレスを保存

    // ウェルカムメール送信
    const result = await sendWelcomeEmail(email, name);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 6. Vercel環境変数設定

### 6.1 ローカル開発環境

1. プロジェクトルートに `.env.local` を作成:

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

2. `.gitignore` に追加されていることを確認:

```
.env.local
```

### 6.2 Vercel本番環境

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクト「enablerdao」を選択
3. 「Settings」→「Environment Variables」をクリック
4. 以下を追加:

| Key | Value | Environments |
|-----|-------|--------------|
| `RESEND_API_KEY` | `re_xxxx...` | Production, Preview, Development |

5. 「Save」をクリック
6. 既存のデプロイメントを再デプロイ:

```bash
vercel --prod
```

---

## 7. テスト送信

### 7.1 ローカルでテスト

```bash
# 開発サーバー起動
npm run dev

# 別ターミナルでテスト送信
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"テストユーザー"}'
```

### 7.2 テストスクリプト作成

**ファイル:** `scripts/test-email.ts`

```typescript
import { sendWelcomeEmail } from '../src/lib/resend';

async function main() {
  const testEmail = process.argv[2] || 'test@example.com';
  const testName = process.argv[3] || 'テストユーザー';

  console.log(`Sending welcome email to ${testEmail}...`);

  const result = await sendWelcomeEmail(testEmail, testName);

  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('Email ID:', result.data?.id);
  } else {
    console.error('❌ Failed to send email');
    console.error('Error:', result.error);
    process.exit(1);
  }
}

main();
```

**package.json にスクリプト追加:**

```json
{
  "scripts": {
    "test:email": "tsx scripts/test-email.ts"
  }
}
```

**実行:**

```bash
npm install -D tsx
npm run test:email your-email@example.com "Your Name"
```

### 7.3 Resendダッシュボードで確認

1. [Resend Dashboard](https://resend.com/emails)の「Emails」タブを開く
2. 送信したメールのステータスを確認:
   - **Delivered**: 配信成功
   - **Bounced**: 配信失敗（存在しないアドレス等）
   - **Complained**: スパム報告された

---

## トラブルシューティング

### メールが届かない場合

1. **DNS設定確認**:
   - Resendダッシュボードでドメインが「Verified」になっているか確認
   - DNS反映に最大48時間かかる場合があります

2. **迷惑メールフォルダ確認**:
   - Gmail等では初回送信時に迷惑メールに分類されることがあります
   - 「迷惑メールでない」をクリックして学習させる

3. **送信元アドレス確認**:
   - `from:` フィールドが認証済みドメインと一致しているか確認
   - 例: `noreply@enablerdao.com`（`enablerdao.com`が認証済み）

4. **APIキー権限確認**:
   - Resendダッシュボードで「Sending access」権限があるか確認

### エラーメッセージ対応

```
Error: Missing required parameter 'from'
```
→ `from` フィールドが未設定です。認証済みドメインを使用してください。

```
Error: Domain not verified
```
→ DNS設定を確認し、Resendで「Verify」をクリックしてください。

```
Error: Invalid API key
```
→ API Keyが正しく設定されているか `.env.local` と Vercel環境変数を確認してください。

---

## 参考リンク

- [Resend公式ドキュメント](https://resend.com/docs)
- [React Email公式ドキュメント](https://react.email/docs/introduction)
- [Next.js + Resend統合ガイド](https://resend.com/docs/send-with-nextjs)
- [SPF/DKIM/DMARC解説](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)
