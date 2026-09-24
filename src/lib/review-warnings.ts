// 審査画面の「自動で分かる注意」の計算。判断はせず、気づきを黄色の注意として出すだけ

export type ReviewSpot = {
  dayNumber: number;
  orderNo: number;
  name: string;
  memo: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  visitTimeMinutes: number | null; // 0時からの分数(同じ日の中での前後判定用)
  transitDurationMin: number | null; // このスポットの直前の移動にかかる時間
};

const FAR_DISTANCE_KM = 30;
const MIN_SPOTS_PER_DAY = 2;
const MIN_MEMO_LENGTH = 20;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 文中にURL・電話番号・メールアドレスらしき文字列があるか(A4の確認用の目安)
const URL_LIKE = /https?:\/\/|www\./i;
const PHONE_LIKE = /0\d{1,4}-\d{1,4}-\d{3,4}|0\d{9,10}/;
const EMAIL_LIKE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// PR・招待・提供などの語(A5の確認用。あること自体は問題ではない)
const PR_WORD_LIKE = /PR|ＰＲ|招待|提供|ご招待/;

export function computeReviewWarnings(params: {
  description: string | null;
  spots: ReviewSpot[];
  dayCount: number;
}): string[] {
  const { description, spots, dayCount } = params;
  const warnings: string[] = [];

  // スポットの数が少ない日(1日あたり2か所未満)
  const spotsByDay = new Map<number, ReviewSpot[]>();
  for (const spot of spots) {
    const list = spotsByDay.get(spot.dayNumber) ?? [];
    list.push(spot);
    spotsByDay.set(spot.dayNumber, list);
  }
  const fewSpotDays = Array.from({ length: dayCount }, (_, i) => i + 1).filter(
    (d) => (spotsByDay.get(d)?.length ?? 0) < MIN_SPOTS_PER_DAY
  );
  if (fewSpotDays.length > 0) {
    warnings.push(`スポットの数が少ない日があります(${fewSpotDays.map((d) => `Day${d}`).join("・")})`);
  }

  // 説明(概要メモ・スポットのメモ)がほとんどない
  const totalMemoLength =
    (description?.trim().length ?? 0) + spots.reduce((sum, s) => sum + (s.memo?.trim().length ?? 0), 0);
  if (totalMemoLength < MIN_MEMO_LENGTH) {
    warnings.push("概要メモ・スポットのメモがほとんどありません");
  }

  // 地図の位置が未設定のスポット
  const unlocated = spots.filter((s) => s.lat == null || s.lng == null);
  if (unlocated.length > 0) {
    warnings.push(`地図の位置が未設定のスポットがあります(${unlocated.map((s) => s.name).join("・")})`);
  }

  // スポットの位置が、同じしおりのほかのスポットから大きく離れている(30km以上)
  const located = spots.filter((s): s is ReviewSpot & { lat: number; lng: number } => s.lat != null && s.lng != null);
  if (located.length >= 2) {
    const farSpots = new Set<string>();
    for (let i = 0; i < located.length; i++) {
      let hasNearby = false;
      for (let j = 0; j < located.length; j++) {
        if (i === j) continue;
        const dist = haversineKm(located[i].lat, located[i].lng, located[j].lat, located[j].lng);
        if (dist <= FAR_DISTANCE_KM) {
          hasNearby = true;
          break;
        }
      }
      if (!hasNearby) farSpots.add(located[i].name);
    }
    if (farSpots.size > 0) {
      warnings.push(`ほかのスポットから大きく離れている(30km以上)スポットがあります(${Array.from(farSpots).join("・")})`);
    }
  }

  // 時刻が前後している(同じ日の中で、時刻を設定したスポットの順番が逆転していないか)
  for (const [dayNumber, daySpots] of spotsByDay) {
    const timed = daySpots
      .filter((s): s is ReviewSpot & { visitTimeMinutes: number } => s.visitTimeMinutes != null)
      .sort((a, b) => a.orderNo - b.orderNo);
    for (let i = 1; i < timed.length; i++) {
      if (timed[i].visitTimeMinutes < timed[i - 1].visitTimeMinutes) {
        warnings.push(`Day${dayNumber}の時刻が前後しています(「${timed[i - 1].name}」の次が「${timed[i].name}」)`);
        break;
      }
    }
  }

  // 移動時間が0分なのに、離れた場所に移動している
  for (const daySpots of spotsByDay.values()) {
    const sorted = [...daySpots].sort((a, b) => a.orderNo - b.orderNo);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (
        cur.transitDurationMin === 0 &&
        prev.lat != null &&
        prev.lng != null &&
        cur.lat != null &&
        cur.lng != null
      ) {
        const dist = haversineKm(prev.lat, prev.lng, cur.lat, cur.lng);
        if (dist > 1) {
          warnings.push(`「${prev.name}」から「${cur.name}」の移動時間が0分になっています`);
        }
      }
    }
  }

  // 説明にURL・電話番号・メールアドレスらしき文字がある(A4の確認用)
  const allText = [description ?? "", ...spots.map((s) => s.memo ?? "")].join("\n");
  if (URL_LIKE.test(allText) || PHONE_LIKE.test(allText) || EMAIL_LIKE.test(allText)) {
    warnings.push("説明の中に、URL・電話番号・メールアドレスらしき文字があります(A4を確認してください)");
  }

  // 説明に「PR」「招待」「提供」などの語がある/ない(A5の確認用。あること自体は問題ではない)
  if (PR_WORD_LIKE.test(allText)) {
    warnings.push("説明の中に「PR」「招待」「提供」などの語があります(A5: 表示として十分か確認してください)");
  }

  return warnings;
}
