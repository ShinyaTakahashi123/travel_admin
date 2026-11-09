import { Resend } from "resend";

const MAIL_FROM = process.env.MAIL_FROM ?? "しおりえ <noreply@shiorietrip.com>";

// RESEND_API_KEYが未設定のとき（ローカル開発など）は送信せず、内容をログに出すだけにする
// 戻り値(true/false)で送れたかを呼び出し元に返す(セキュリティ指摘2026-11-10: 失敗しても
// 例外を投げない作りのため、呼び出し元が件数を数えるには戻り値が必要)
export async function sendMail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      `[mail] RESEND_API_KEY未設定のため送信せず、内容のみ出力します\nTo: ${to}\nSubject: ${subject}\n\n${text}`
    );
    return true;
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: MAIL_FROM,
      to,
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
    if (result.error) {
      // 宛先・本文はログに出さない。エラー内容もname・messageだけに絞る
      // (セキュリティ指摘2026-11-10: result.errorをそのまま出すと、宛先等を含む恐れがあるため)
      console.error("[mail] Resend送信エラー:", { name: result.error.name, message: result.error.message });
      return false;
    }
    return true;
  } catch (err) {
    const e = err instanceof Error ? { name: err.name, message: err.message } : { name: "unknown", message: String(err) };
    console.error("[mail] Resend送信中に例外が発生しました:", e);
    return false;
  }
}
