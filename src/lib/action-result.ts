// Server Actions は本番ビルドでは、throwしたエラーの文言を画面に渡さない(安全のため、
// digestだけが渡り、本文は開発時にしか見えない)。そのため、利用者に見せたい誤り
// (入力の誤り・権限がない・回数制限など)は、throwではなくこの形の戻り値で返す。
// 画面側は result.ok を見て、falseならresult.errorを表示する。
//
// 予期しないエラー(DBの接続エラーなど)はこれまでどおりthrowのままでよい。
// その場合、画面側はこの UNEXPECTED_ERROR_MESSAGE を表示する(元のエラー文言は
// 本番では取得できないため)。
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

export const UNEXPECTED_ERROR_MESSAGE = "エラーが発生しました。時間をおいてもう一度お試しください。";

// actions.ts内で、利用者に見せたい誤りを知らせるための例外。exportされた各関数は
// これをcatchしてActionResultに変換する。それ以外の例外(予期しないエラー)は
// そのままthrowし直す
export class ActionError extends Error {}

export function fail(message: string): never {
  throw new ActionError(message);
}
