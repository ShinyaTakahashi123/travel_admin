// page_view.bot_nameの値(db:page_view_bot_name_check制約と、user-siteの
// src/lib/bot-detection.tsのBOT_NAMESに合わせる)を、画面表示用の名前に変換する
export const BOT_NAME_LABEL: Record<string, string> = {
  googlebot: "Googlebot",
  bingbot: "Bingbot",
  gptbot: "GPTBot",
  claudebot: "ClaudeBot",
  other: "その他のロボット",
};

export function botNameLabel(botName: string | null): string {
  if (botName == null) return "不明";
  return BOT_NAME_LABEL[botName] ?? botName;
}
