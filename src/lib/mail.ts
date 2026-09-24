import { Resend } from "resend";

const MAIL_FROM = process.env.MAIL_FROM ?? "しおりえ <noreply@shiorietrip.com>";

// RESEND_API_KEYが未設定のとき（ローカル開発など）は送信せず、内容をログに出すだけにする
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
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      `[mail] RESEND_API_KEY未設定のため送信せず、内容のみ出力します\nTo: ${to}\nSubject: ${subject}\n\n${text}`
    );
    return;
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
      console.error("[mail] Resend送信エラー:", result.error);
    }
  } catch (err) {
    console.error("[mail] Resend送信中に例外が発生しました:", err);
  }
}
