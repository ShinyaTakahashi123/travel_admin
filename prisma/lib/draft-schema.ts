/**
 * 新しい公式しおりの「下書きファイル」(admin-site/prisma/drafts/*.json) の形。
 * docs/specs/20261104-itinerary-draft-and-checker.md のとおり。
 * DBには一切つながない。check-draft.ts / register-draft.ts から読む。
 */

export type TransitMode = "walk" | "train" | "bus" | "car" | "taxi" | "other";

// 駐車場など、区間(leg)の終わりの中継点。1つのスポットに区間が複数あるとき
// (駐車場までの徒歩＋運転など)、このleg自身が終わる場所の点。最後の区間には不要
// (終わりはスポットそのものの点になる)。これがあると、各区間を別々に測り直せる
export type Waypoint = {
  lat: number;
  lng: number;
  note?: string; // 「出雲大社第2駐車場」など
};

export type Leg = {
  mode: TransitMode;
  min: number;
  line?: string; // 路線名(電車・バスのときだけ)。会社名は書かない
  waypoint?: Waypoint;
};

// 点の出どころ。OSMのnode/wayの番号、または国土地理院などの例外とその理由(7章)
export type PointSource =
  | { kind: "osm_node"; id: string; note?: string }
  | { kind: "osm_way"; id: string; note?: string }
  | { kind: "gsi"; reason: string }
  | { kind: "exception"; reason: string };

export type Point = {
  lat: number;
  lng: number;
  source: PointSource;
};

export type PhotoRef = {
  commonsFile: string; // Wikimedia Commonsのファイル名("File:"を含む/含まないどちらでもよい)
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl?: string;
};

// 印(神社・お寺・お墓・古墳・拝所・お昼)。レンタカーの始め・終わりも別に印として持つ
export type Mark =
  | "shrine"
  | "temple"
  | "grave"
  | "kofun"
  | "worship"
  | "lunch"
  | "rental_pickup"
  | "rental_return";

export type Citation = {
  url: string; // 開いたURL
  excerpt: string; // そのページの抜き出し
};

export type Hours = {
  note: string; // 開く・閉まる時刻と休みの日の要約(本文には書かない。記録用)
  sourceUrl: string;
};

export type DraftSpot = {
  name: string;
  address?: string;
  time: string; // "HH:MM"
  stayDurationMin: number;
  memo: string;
  legs: Leg[]; // 前のスポットからの移動。各日の1件目は空配列
  point: Point;
  photos?: PhotoRef[];
  marks?: Mark[];
  hours: Hours;
  citations: Citation[]; // 文ごとの出典一覧(このスポットのメモ全体に対して)
};

export type Season = "spring" | "summer" | "autumn" | "winter";

export type DraftItinerary = {
  title: string;
  description: string;
  nights: number; // 0 = 日帰り
  seasons: Season[];
  tagNames: string[];
  purposeNames: string[];
  prefectureName: string;
  areaNames: string[];
  cover: PhotoRef;
  citations: Citation[]; // 題・説明文の出典一覧
  days: DraftSpot[][];
};

function fail(path: string, msg: string): never {
  throw new Error(`下書きの形が違います: ${path} ${msg}`);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function checkPhotoRef(v: any, path: string): PhotoRef {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  if (!isNonEmptyString(v.commonsFile)) fail(path, ".commonsFile が空です");
  if (!isNonEmptyString(v.sourceUrl)) fail(path, ".sourceUrl が空です");
  if (!isNonEmptyString(v.author)) fail(path, ".author が空です");
  if (!isNonEmptyString(v.license)) fail(path, ".license が空です");
  return v as PhotoRef;
}

function checkCitation(v: any, path: string): Citation {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  if (!isNonEmptyString(v.url)) fail(path, ".url が空です");
  if (!isNonEmptyString(v.excerpt)) fail(path, ".excerpt が空です");
  return v as Citation;
}

function checkPointSource(v: any, path: string): PointSource {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  if (v.kind === "osm_node" || v.kind === "osm_way") {
    if (!isNonEmptyString(v.id)) fail(path, ".id が空です");
  } else if (v.kind === "gsi" || v.kind === "exception") {
    if (!isNonEmptyString(v.reason)) fail(path, ".reason が空です");
  } else {
    fail(path, `.kind が不明です(${v.kind})`);
  }
  return v as PointSource;
}

function checkPoint(v: any, path: string): Point {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  if (typeof v.lat !== "number" || !Number.isFinite(v.lat)) fail(path, ".lat が数ではありません");
  if (typeof v.lng !== "number" || !Number.isFinite(v.lng)) fail(path, ".lng が数ではありません");
  checkPointSource(v.source, `${path}.source`);
  return v as Point;
}

function checkWaypoint(v: any, path: string): Waypoint {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  if (typeof v.lat !== "number" || !Number.isFinite(v.lat)) fail(path, ".lat が数ではありません");
  if (typeof v.lng !== "number" || !Number.isFinite(v.lng)) fail(path, ".lng が数ではありません");
  return v as Waypoint;
}

function checkLeg(v: any, path: string): Leg {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  const modes: TransitMode[] = ["walk", "train", "bus", "car", "taxi", "other"];
  if (!modes.includes(v.mode)) fail(path, `.mode が不明です(${v.mode})`);
  if (typeof v.min !== "number" || v.min < 0) fail(path, ".min が数ではありません");
  if (v.waypoint !== undefined) checkWaypoint(v.waypoint, `${path}.waypoint`);
  return v as Leg;
}

function checkHours(v: any, path: string): Hours {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  if (!isNonEmptyString(v.note)) fail(path, ".note が空です");
  if (!isNonEmptyString(v.sourceUrl)) fail(path, ".sourceUrl が空です");
  return v as Hours;
}

function checkSpot(v: any, path: string): DraftSpot {
  if (typeof v !== "object" || v === null) fail(path, "はオブジェクトが要ります");
  if (!isNonEmptyString(v.name)) fail(path, ".name が空です");
  if (!/^\d{2}:\d{2}$/.test(v.time)) fail(path, `.time が "HH:MM" の形ではありません(${v.time})`);
  if (typeof v.stayDurationMin !== "number" || v.stayDurationMin <= 0) fail(path, ".stayDurationMin が数ではありません");
  if (typeof v.memo !== "string") fail(path, ".memo が文字列ではありません");
  if (!Array.isArray(v.legs)) fail(path, ".legs が配列ではありません");
  v.legs.forEach((l: any, i: number) => checkLeg(l, `${path}.legs[${i}]`));
  checkPoint(v.point, `${path}.point`);
  checkHours(v.hours, `${path}.hours`);
  if (!Array.isArray(v.citations) || v.citations.length === 0) fail(path, ".citations が空です");
  v.citations.forEach((c: any, i: number) => checkCitation(c, `${path}.citations[${i}]`));
  if (v.photos !== undefined) {
    if (!Array.isArray(v.photos)) fail(path, ".photos が配列ではありません");
    v.photos.forEach((p: any, i: number) => checkPhotoRef(p, `${path}.photos[${i}]`));
  }
  if (v.marks !== undefined && !Array.isArray(v.marks)) fail(path, ".marks が配列ではありません");
  return v as DraftSpot;
}

export function validateDraftShape(data: unknown): DraftItinerary {
  const v = data as any;
  if (typeof v !== "object" || v === null) fail("$", "はオブジェクトが要ります");
  if (!isNonEmptyString(v.title)) fail("$", ".title が空です");
  if (!isNonEmptyString(v.description)) fail("$", ".description が空です");
  if (typeof v.nights !== "number" || v.nights < 0) fail("$", ".nights が数ではありません");
  if (!Array.isArray(v.seasons)) fail("$", ".seasons が配列ではありません");
  if (!Array.isArray(v.tagNames)) fail("$", ".tagNames が配列ではありません");
  if (!Array.isArray(v.purposeNames)) fail("$", ".purposeNames が配列ではありません");
  if (!isNonEmptyString(v.prefectureName)) fail("$", ".prefectureName が空です");
  if (!Array.isArray(v.areaNames)) fail("$", ".areaNames が配列ではありません");
  checkPhotoRef(v.cover, "$.cover");
  if (!Array.isArray(v.citations) || v.citations.length === 0) fail("$", ".citations が空です");
  v.citations.forEach((c: any, i: number) => checkCitation(c, `$.citations[${i}]`));
  if (!Array.isArray(v.days) || v.days.length === 0) fail("$", ".days が空です");
  v.days.forEach((day: any, di: number) => {
    if (!Array.isArray(day)) fail(`$.days[${di}]`, "は配列ではありません");
    day.forEach((s: any, si: number) => checkSpot(s, `$.days[${di}][${si}]`));
  });
  return v as DraftItinerary;
}
