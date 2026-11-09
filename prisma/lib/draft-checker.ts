/**
 * 新しい公式しおりの下書きファイル(draft-schema.ts の形)を読んで ⚠ の一覧を出す確認の道具。
 * DBにも本番にもつながない(似たしおりの確認だけ、本番/開発の読み取りが要る。runChecks の skipSimilar で外せる)。
 * 決まりの元は docs/content/itinerary-rules.md(とくに1・2・3・5・7・10章)。
 * 仕様書: docs/specs/20261104-itinerary-draft-and-checker.md
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { DraftItinerary, DraftSpot, Mark, TransitMode } from "./draft-schema";
import wordRules from "./word-rules.json";

export function sha256OfFile(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function sha256OfText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fmt(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function legSum(legs: { min: number }[]): number {
  return legs.reduce((a, l) => a + l.min, 0);
}

// ============================================================
// 1. 座標
// ============================================================
function decimalPlaces(n: number): number {
  const s = n.toString();
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

// 度分秒(DMS)をそのまま小数に直した値は、秒の部分が0.1秒刻みの値にきれいに乗ることが多い。
// 目安であり断定ではない(DBが6けたなので、本物のOSMの点でも付くことがある。7章の注のとおり)
function looksLikeDmsConversion(deg: number): boolean {
  const arcsec = Math.abs(deg) * 3600;
  const tenthArcsec = arcsec * 10;
  const nearestInt = Math.round(tenthArcsec);
  return Math.abs(tenthArcsec - nearestInt) < 0.02;
}

function checkCoordinate(spot: DraftSpot, label: string, warnings: string[]) {
  const { lat, lng, source } = spot.point;
  if (lat < 24 || lat > 46) {
    if (lng >= 24 && lng <= 46) warnings.push(`${label}: 座標 緯度${lat}が範囲外(24〜46)。緯度と経度が入れかわっている疑いがあります`);
    else warnings.push(`${label}: 座標 緯度${lat}が範囲外(24〜46)`);
  }
  if (lng < 122 || lng > 154) {
    if (lat >= 122 && lat <= 154) warnings.push(`${label}: 座標 経度${lng}が範囲外(122〜154)。緯度と経度が入れかわっている疑いがあります`);
    else warnings.push(`${label}: 座標 経度${lng}が範囲外(122〜154)`);
  }
  if (decimalPlaces(lat) > 6) warnings.push(`${label}: 緯度${lat}の小数が6けたを超えています`);
  if (decimalPlaces(lng) > 6) warnings.push(`${label}: 経度${lng}の小数が6けたを超えています`);
  if (decimalPlaces(lat) < 4) warnings.push(`${label}: 緯度${lat}の小数が浅すぎます(目安4けた以上)`);
  if (decimalPlaces(lng) < 4) warnings.push(`${label}: 経度${lng}の小数が浅すぎます(目安4けた以上)`);
  if (looksLikeDmsConversion(lat)) warnings.push(`${label}: 緯度${lat}が度分秒をそのまま直した値(0.1秒きざみ)の疑いがあります。DMS?`);
  if (looksLikeDmsConversion(lng)) warnings.push(`${label}: 経度${lng}が度分秒をそのまま直した値(0.1秒きざみ)の疑いがあります。DMS?`);
  if (source.kind === "osm_node" || source.kind === "osm_way") {
    if (!source.id?.trim()) warnings.push(`${label}: 点の出どころ(${source.kind})のidが空です`);
  } else if (source.kind === "gsi" || source.kind === "exception") {
    if (!source.reason?.trim()) warnings.push(`${label}: 点の出どころ(${source.kind})の理由が空です`);
  } else {
    warnings.push(`${label}: 点の出どころのkindが不明です`);
  }
}

// ============================================================
// 2. 時刻のつながり
// ============================================================
function checkTimeContinuity(day: DraftSpot[], dayNumber: number, warnings: string[]) {
  day.forEach((spot, idx) => {
    const label = `${dayNumber}日目 ${spot.name}`;
    if (idx === 0) {
      if (spot.legs.length > 0) warnings.push(`${label}: この日の1件目なのに移動(legs)が入っています`);
      return;
    }
    const prev = day[idx - 1];
    const expected = toMinutes(prev.time) + prev.stayDurationMin + legSum(spot.legs);
    const actual = toMinutes(spot.time);
    if (expected !== actual) {
      warnings.push(`${label}: 着く時刻が${spot.time}。前(${prev.name})の時刻+滞在+移動から計算すると${fmt(expected)}`);
    }
  });
}

// ============================================================
// 3. 1日の枠
// ============================================================
type DayFrame = { label: string; arrival: [number, number]; departure: [number, number]; minSpots: number };

function dayFrame(dayIndex: number, totalDays: number, nights: number): DayFrame {
  const dayNumber = dayIndex + 1;
  if (nights === 0) return { label: "日帰り", arrival: [8 * 60 + 30, 9 * 60 + 30], departure: [16 * 60 + 30, 17 * 60], minSpots: 4 };
  if (dayNumber === 1) return { label: "泊まりの初日", arrival: [10 * 60 + 45, 11 * 60 + 45], departure: [16 * 60 + 30, 17 * 60], minSpots: 3 };
  const isLastDay = dayNumber === totalDays;
  if (isLastDay) {
    if (nights === 1) return { label: "1泊2日の最終日", arrival: [8 * 60 + 30, 9 * 60 + 30], departure: [16 * 60 + 30, 17 * 60], minSpots: 4 };
    return { label: "2泊以上の最終日", arrival: [8 * 60 + 30, 9 * 60 + 30], departure: [14 * 60 + 30, 15 * 60], minSpots: 3 };
  }
  return { label: "泊まりの中の日", arrival: [8 * 60 + 30, 9 * 60 + 30], departure: [16 * 60 + 30, 17 * 60], minSpots: 4 };
}

function hasMark(spot: DraftSpot, ...marks: Mark[]): boolean {
  return (spot.marks ?? []).some((m) => marks.includes(m));
}

function checkDayFrame(day: DraftSpot[], dayIndex: number, totalDays: number, nights: number, warnings: string[]) {
  const dayNumber = dayIndex + 1;
  const frame = dayFrame(dayIndex, totalDays, nights);
  const first = day[0];
  const last = day[day.length - 1];
  const arriveMin = toMinutes(first.time);
  const departMin = toMinutes(last.time) + last.stayDurationMin;
  const label = `${dayNumber}日目(${frame.label})`;

  if (arriveMin < frame.arrival[0] || arriveMin > frame.arrival[1]) {
    warnings.push(`${label}: 1か所目に着く時刻${first.time}が決まりの範囲外(${fmt(frame.arrival[0])}〜${fmt(frame.arrival[1])})。例外ならチェックリストに書く`);
  }
  if (departMin < frame.departure[0] || departMin > frame.departure[1]) {
    warnings.push(`${label}: 最後の行き先を出る時刻${fmt(departMin)}が決まりの範囲外(${fmt(frame.departure[0])}〜${fmt(frame.departure[1])})。例外ならチェックリストに書く`);
  }
  if (day.length < frame.minSpots) {
    warnings.push(`${label}: 行き先の数が${day.length}か所(${frame.minSpots}か所以上の決まり)`);
  }

  for (const spot of day) {
    if (spot.stayDurationMin > 100) warnings.push(`${label} ${spot.name}: 滞在${spot.stayDurationMin}分(100分以内の決まり)`);
  }

  const lunchSpots = day.filter((s) => hasMark(s, "lunch"));
  if (lunchSpots.length === 0) {
    warnings.push(`${label}: 昼食の印(lunch)が見当たりません`);
  }
  for (const s of lunchSpots) {
    const start = toMinutes(s.time);
    if (start < 11 * 60 + 30 || start > 13 * 60 + 30) warnings.push(`${label} ${s.name}: 昼食の時刻${s.time}が11:30〜13:30の外です`);
    if (s.stayDurationMin < 35 || s.stayDurationMin > 45) warnings.push(`${label} ${s.name}: 昼食の滞在${s.stayDurationMin}分が35〜45分の外です`);
  }
}

// ============================================================
// 4. 区間の分を経路の計算と比べる
// ============================================================
let lastRouteCallAt = 0;
async function throttle(): Promise<void> {
  const wait = lastRouteCallAt + 1100 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRouteCallAt = Date.now();
}

async function routeMeasure(
  lat1: number, lng1: number, lat2: number, lng2: number,
  profile: "foot" | "car",
): Promise<{ distanceM: number; durationS: number } | null> {
  await throttle();
  const base = profile === "foot" ? "https://routing.openstreetmap.de/routed-foot" : "https://router.project-osrm.org";
  const url = `${base}/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "shiorie-draft-checker/1.0 (contact: st.83.53.abcd@gmail.com)" } });
    if (!res.ok) return null;
    const json = await res.json();
    const route = json.routes?.[0];
    if (!route) return null;
    return { distanceM: route.distance, durationS: route.duration };
  } catch {
    return null;
  }
}

async function measureOneLeg(
  label: string,
  leg: { mode: TransitMode; min: number },
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  warnings: string[],
) {
  if (leg.mode === "walk") {
    if (leg.min > 25) warnings.push(`${label}: 徒歩${leg.min}分(25分を超えています)`);
    const measured = await routeMeasure(from.lat, from.lng, to.lat, to.lng, "foot");
    if (measured) {
      const required = Math.ceil(measured.distanceM / 75);
      if (leg.min < required) warnings.push(`${label}: 徒歩${leg.min}分だが、道のり${measured.distanceM.toFixed(0)}m(÷75m/分=${required}分)より短い`);
    } else {
      warnings.push(`${label}: 徒歩の道のりの計算に問い合わせできませんでした(routed-foot)`);
    }
  } else if (leg.mode === "car" || leg.mode === "taxi") {
    const measured = await routeMeasure(from.lat, from.lng, to.lat, to.lng, "car");
    if (measured) {
      const required = Math.ceil(measured.durationS / 60) + 5;
      if (leg.min < required) warnings.push(`${label}: ${leg.mode}${leg.min}分だが、OSRMの所要${(measured.durationS / 60).toFixed(1)}分を切り上げ+5分=${required}分より短い`);
    } else {
      warnings.push(`${label}: 車の道のりの計算に問い合わせできませんでした(OSRM)`);
    }
  }
}

async function checkLegDurations(day: DraftSpot[], dayNumber: number, warnings: string[], notices: string[]) {
  for (let i = 1; i < day.length; i++) {
    const prev = day[i - 1];
    const cur = day[i];
    const label = `${dayNumber}日目 ${prev.name}→${cur.name}`;

    if (cur.legs.length <= 1) {
      for (const leg of cur.legs) await measureOneLeg(label, leg, prev.point, cur.point, warnings);
      continue;
    }

    // レンタカーの駐車場までの徒歩＋運転など、1つのスポットに区間(legs)が複数あるとき。
    // 各legの終わり(駐車場などの中継点)がwaypointとして全て書かれていれば、区間ごとに測り直せる。
    // 書かれていなければ、前後スポット間の全体の道のりをどの区間にも当てると誤判定になるため、
    // 経路の計算は行わず「人が確かめる」注意(⚠とは別)を出す(2026-11-04、企画運営の指摘)
    const allWaypointsPresent = cur.legs.slice(0, -1).every((l) => l.waypoint);
    if (!allWaypointsPresent) {
      for (const leg of cur.legs) if (leg.mode === "walk" && leg.min > 25) warnings.push(`${label}: 徒歩${leg.min}分(25分を超えています)`);
      notices.push(`${label}: 区間が${cur.legs.length}件あり、中継点(waypoint)の記録がないため、経路の計算での確認を飛ばしています。人が確かめてください`);
      continue;
    }
    const segPoints = [prev.point, ...cur.legs.slice(0, -1).map((l) => l.waypoint!), cur.point];
    for (let li = 0; li < cur.legs.length; li++) {
      await measureOneLeg(`${label}(区間${li + 1}/${cur.legs.length})`, cur.legs[li], segPoints[li], segPoints[li + 1], warnings);
    }
  }
}

// ============================================================
// 5. メモの分と区間の分の整合
// ============================================================
function extractMinutesNear(text: string, verbPattern: RegExp): number[] {
  const re = new RegExp(`(?:${verbPattern.source})(?:およそ)?(\\d+)分`, "g");
  const out: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(Number(m[1]));
  return out;
}

// レンタカーの手続き+運転のように、内訳と合計を両方書く形(7章「手続き約15分＋運転」)。
// 「車でおよそ8分(あわせて約15分)」のような文では、実際の移動分は内訳でなく合計に出る
function extractTotalMinutes(text: string): number[] {
  const re = /(?:あわせて|合わせて)(?:およそ|約)?(\d+)分/g;
  const out: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(Number(m[1]));
  return out;
}

function checkMemoMinutesConsistency(day: DraftSpot[], dayNumber: number, warnings: string[]) {
  for (let i = 1; i < day.length; i++) {
    const prev = day[i - 1];
    const cur = day[i];
    const actual = legSum(cur.legs);
    const label = `${dayNumber}日目 ${prev.name}→${cur.name}`;

    // メモが短いと、80字の切り出しに結びの「この後は、…」まで入り込み、次の区間の分を誤って拾う
    const closingInOpening = cur.memo.indexOf("この後は");
    const openingSlice = cur.memo.slice(0, closingInOpening === -1 ? 80 : Math.min(80, closingInOpening));
    const openingMins = [...extractMinutesNear(openingSlice, /歩いて|車で/), ...extractTotalMinutes(openingSlice)];
    if (openingMins.length === 0) {
      warnings.push(`${label}: ${cur.name}の書き出しに移動の分の記載が見当たりません`);
      // 駐車場までの徒歩+運転のように、区間(legs)が複数のときは、内訳をそれぞれ書く形(「車でおよそ9分、
      // 歩いておよそ3分」)もある。合計が実際の移動分と合えば、内訳の書き方として認める
    } else if (!openingMins.includes(actual) && openingMins.reduce((a, b) => a + b, 0) !== actual) {
      warnings.push(`${label}: ${cur.name}の書き出しの分(${openingMins.join("/")})が実際の移動${actual}分とズレています`);
    }

    const closingIdx = prev.memo.lastIndexOf("この後は");
    if (closingIdx === -1) {
      warnings.push(`${label}: ${prev.name}の結びに「この後は、…」の一文が見当たりません`);
    } else {
      const closingTail = prev.memo.slice(closingIdx);
      const closingMins = [...extractMinutesNear(closingTail, /歩いて|車で/), ...extractTotalMinutes(closingTail)];
      if (closingMins.length === 0) {
        warnings.push(`${label}: ${prev.name}の結びに移動の分の記載が見当たりません`);
      } else if (!closingMins.includes(actual) && closingMins.reduce((a, b) => a + b, 0) !== actual) {
        warnings.push(`${label}: ${prev.name}の結びの分(${closingMins.join("/")})が実際の移動${actual}分とズレています`);
      }
    }
  }
}

// ============================================================
// 6. 決まった文
// ============================================================
const PRAYER_RE = /静かに.*敬意.*(お参り(しましょう|ください)|手を合わせましょう)/;
const GRAVE_RE = /のまわりでは、静かに過ごしましょう。/;

function checkFixedSentences(spot: DraftSpot, label: string, warnings: string[]) {
  const marks = spot.marks ?? [];
  const isPrayer = marks.some((m) => m === "shrine" || m === "temple" || m === "worship");
  const isGrave = marks.some((m) => m === "grave" || m === "kofun");

  if (isPrayer && isGrave) {
    // お寺の中のお墓: 1文にまとめる形(別々の決まり文を両方要求しない)
    if (!/静かに/.test(spot.memo) || !/敬意/.test(spot.memo)) {
      warnings.push(`${label}: 祈りの場とお墓を両方持つスポットですが、「静かに」「敬意」を合わせた一文が見当たりません`);
    }
  } else {
    if (isPrayer && !PRAYER_RE.test(spot.memo)) {
      warnings.push(`${label}: 祈りの場の決まりの一文(「静かに、敬意をもってお参りしましょう」など)が見当たりません`);
    }
    if (isGrave) {
      if (!GRAVE_RE.test(spot.memo)) warnings.push(`${label}: お墓・古墳の決まりの一文(「〜のまわりでは、静かに過ごしましょう。」)が見当たりません`);
      if (/楽しみましょう/.test(spot.memo)) warnings.push(`${label}: お墓・古墳のスポットに「楽しみましょう」があります`);
    }
  }

  if (marks.includes("rental_pickup") && !/レンタカーを借りて/.test(spot.memo)) {
    warnings.push(`${label}: レンタカーの始めの決まり文(「レンタカーを借りて」)が見当たりません`);
  }
  if (marks.includes("rental_return") && !/車を返しましょう/.test(spot.memo)) {
    warnings.push(`${label}: レンタカーの終わりの決まり文(「車を返しましょう」)が見当たりません`);
  }
}

// ============================================================
// 7. 使わない言葉・言い切り
// ============================================================
type WordRules = { banned: string[]; bannedExceptions: Record<string, string[]>; absoluteWords: string[]; hedgeWords: string[] };
const rules = wordRules as WordRules;

function checkWords(text: string, label: string, warnings: string[]) {
  for (const word of rules.banned) {
    if (!text.includes(word)) continue;
    const exceptions = rules.bannedExceptions[word] ?? [];
    // この語を含むすべての出現が、許されている決まり文の一部に収まっているかを見る
    const withoutExceptions = exceptions.reduce((t, ex) => t.split(ex).join(""), text);
    if (withoutExceptions.includes(word)) warnings.push(`${label}: 使わない言葉「${word}」があります`);
  }
  const sentences = text.split("。");
  for (const sentence of sentences) {
    for (const word of rules.absoluteWords) {
      if (sentence.includes(word) && !rules.hedgeWords.some((h) => sentence.includes(h))) {
        warnings.push(`${label}: 「${word}」が同じ文の中でぼかされていません(文: ${sentence.slice(0, 40)}...)`);
      }
    }
  }
}

// ============================================================
// 8. 似たしおり(DBの読み取りが要る。ベストエフォート)
// ============================================================
function distanceM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(a));
}

export async function checkSimilarItineraries(draft: DraftItinerary, warnings: string[]): Promise<void> {
  try {
    const { prisma } = await import("../../src/lib/prisma");
    const existing = await prisma.itinerary.findMany({
      where: { status: { in: ["published", "pending"] } },
      select: {
        id: true,
        title: true,
        status: true,
        days: { select: { spots: { select: { name: true, lat: true, lng: true } } } },
      },
    });
    const draftSpots = draft.days.flat();
    const byItinerary = new Map<string, { title: string; status: string; overlaps: string[] }>();
    for (const it of existing) {
      const spots = it.days.flatMap((d) => d.spots);
      for (const ds of draftSpots) {
        for (const es of spots) {
          if (es.lat === null || es.lng === null) continue;
          const sameName = es.name.trim() === ds.name.trim();
          const near = distanceM(ds.point.lat, ds.point.lng, Number(es.lat), Number(es.lng)) <= 200;
          if (sameName || near) {
            const entry = byItinerary.get(it.id) ?? { title: it.title, status: it.status, overlaps: [] };
            const detail = sameName ? `${ds.name}(同じ名前)` : `${ds.name}≈${es.name}(200m以内)`;
            if (!entry.overlaps.includes(detail)) entry.overlaps.push(detail);
            byItinerary.set(it.id, entry);
          }
        }
      }
    }
    for (const [id, e] of byItinerary) {
      warnings.push(`似たしおり: ${id.slice(0, 8)}[${e.status}]「${e.title}」と重なり${e.overlaps.length}件(${e.overlaps.join("、")})`);
    }
  } catch (err) {
    warnings.push(`似たしおりの確認: 本番/開発の読み取りができませんでした(${(err as Error).message.slice(0, 200)})。あとで必ず確認する`);
  }
}

// ============================================================
// 9. 写真
// ============================================================
function checkPhotoRefPresent(photo: { sourceUrl: string; author: string; license: string } | undefined, label: string, warnings: string[]) {
  if (!photo) {
    warnings.push(`${label}: 写真の出典がありません`);
    return;
  }
  if (!photo.sourceUrl.trim() || !photo.author.trim() || !photo.license.trim()) {
    warnings.push(`${label}: 写真の出典(出典URL・撮影者・ライセンス)が欠けています`);
  }
}

function checkPhotos(draft: DraftItinerary, warnings: string[]) {
  checkPhotoRefPresent(draft.cover, "表紙", warnings);
  let photoCount = draft.cover ? 1 : 0;
  draft.days.forEach((day, di) => {
    day.forEach((s) => {
      for (const p of s.photos ?? []) {
        checkPhotoRefPresent(p, `${di + 1}日目 ${s.name}の写真`, warnings);
        photoCount++;
      }
    });
  });
  if (photoCount < 3) warnings.push(`写真の枚数が${photoCount}枚です(表紙を含め3枚以上が目標)`);
}

// ============================================================
// まとめ
// ============================================================
export type RunChecksOptions = { skipSimilar?: boolean };
export type RunChecksResult = { warnings: string[]; notices: string[] };

export async function runChecks(draft: DraftItinerary, opts: RunChecksOptions = {}): Promise<RunChecksResult> {
  const warnings: string[] = [];
  const notices: string[] = [];
  const totalDays = draft.days.length;

  checkWords(draft.title, "題", warnings);
  checkWords(draft.description, "説明文", warnings);

  draft.days.forEach((day, di) => {
    const dayNumber = di + 1;
    day.forEach((spot) => {
      checkCoordinate(spot, `${dayNumber}日目 ${spot.name}`, warnings);
      checkFixedSentences(spot, `${dayNumber}日目 ${spot.name}`, warnings);
      checkWords(spot.memo, `${dayNumber}日目 ${spot.name}のメモ`, warnings);
    });
    checkTimeContinuity(day, dayNumber, warnings);
    checkDayFrame(day, di, totalDays, draft.nights, warnings);
    checkMemoMinutesConsistency(day, dayNumber, warnings);
  });

  for (let di = 0; di < draft.days.length; di++) {
    await checkLegDurations(draft.days[di], di + 1, warnings, notices);
  }

  checkPhotos(draft, warnings);

  if (!opts.skipSimilar) await checkSimilarItineraries(draft, warnings);

  return { warnings, notices };
}
