// 旅のじゅんび(持ち物)の選択肢と、旅のテーマ・目的タグとの組み合わせ。
// 最初はプログラムの中に用意する(ユーザー決定。あとで管理者サイトから編集できるようには
// 今回はしない)。docs/specs/20260925-print-booklet-and-packing.md の B-3 参照

export type PackingCatalogItem = { id: string; label: string };

// いつも入れるもの(選択肢には出さず、常にチェック済みとして表示する)
export const PACKING_COMMON_ITEMS: PackingCatalogItem[] = [
  { id: "common-shoes", label: "歩きやすい靴" },
  { id: "common-phone", label: "スマホ・充電器" },
  { id: "common-cash", label: "小銭・交通系IC" },
];

export const PACKING_CATALOG: PackingCatalogItem[] = [
  { id: "battery", label: "モバイルバッテリー" },
  { id: "rain", label: "雨具(折りたたみ傘)" },
  { id: "hat", label: "帽子" },
  { id: "sunscreen", label: "日焼け止め" },
  { id: "drink", label: "飲み物" },
  { id: "towel", label: "タオル" },
  { id: "change", label: "着替え" },
  { id: "goshuin", label: "御朱印帳" },
  { id: "swimwear", label: "水着" },
  { id: "sandals", label: "サンダル" },
  { id: "coat", label: "上着・防寒具" },
  { id: "gloves", label: "手袋" },
  { id: "handwarmer", label: "カイロ" },
  { id: "hiking-boots", label: "登山靴" },
  { id: "insect", label: "虫よけ" },
  { id: "camera", label: "カメラ" },
  { id: "ecobag", label: "エコバッグ" },
  { id: "medicine", label: "常備薬" },
  { id: "insurance-card", label: "保険証（マイナ保険証など）" },
  { id: "sheet", label: "レジャーシート" },
];

const PACKING_CATALOG_IDS = new Set(PACKING_CATALOG.map((item) => item.id));

export function isValidPackingItemId(id: string): boolean {
  return PACKING_CATALOG_IDS.has(id);
}

export function packingItemLabel(id: string): string | undefined {
  return PACKING_CATALOG.find((item) => item.id === id)?.label;
}

// 旅のテーマ(Tagの名前)・目的タグ(PurposeTagの名前) → 自動でチェックする持ち物ID。
// 実際のDBのタグ名に合わせている(例: テーマ「桜・花見」の実体はpurposeTag「花見・桜」)
const AUTO_PACKING_MAP: Record<string, string[]> = {
  // 旅のテーマ(Tag)
  温泉: ["towel", "change"],
  "海・リゾート": ["swimwear", "sandals", "sunscreen", "hat"],
  冬の旅: ["coat", "gloves", "handwarmer"],
  紅葉: ["coat"],
  絶景: ["camera"],
  家族旅行: ["drink", "hat", "medicine"],
  グルメ: ["ecobag"],
  // 目的タグ(PurposeTag)
  お寺: ["goshuin"],
  神社: ["goshuin"],
  "ハイキング・登山": ["hiking-boots", "drink", "rain", "insect"],
  自然: ["hiking-boots", "drink", "rain", "insect"],
  キャンプ: ["hiking-boots", "drink", "rain", "insect"],
  "ビーチ・海水浴": ["swimwear", "sandals", "sunscreen", "hat"],
  離島: ["swimwear", "sandals", "sunscreen", "hat"],
  "ダイビング・シュノーケリング": ["swimwear", "sandals", "sunscreen", "hat"],
  ウィンタースポーツ: ["coat", "gloves", "handwarmer"],
  紅葉狩り: ["coat"],
  "高原・避暑": ["coat"],
  "絶景・フォトスポット": ["camera"],
  夜景: ["camera"],
  星空観察: ["coat", "camera"],
  "動物園・水族館": ["drink", "hat", "medicine"],
  テーマパーク: ["drink", "hat", "medicine"],
  "花見・桜": ["sheet"],
};

// 選んだテーマ名・目的タグ名から、自動でチェックすべき持ち物IDの一覧(重複なし)を求める
export function autoPackingItemIds(tagNames: string[], purposeTagNames: string[]): string[] {
  const result = new Set<string>();
  for (const name of [...tagNames, ...purposeTagNames]) {
    const ids = AUTO_PACKING_MAP[name];
    if (ids) for (const id of ids) result.add(id);
  }
  return Array.from(result);
}

export const MAX_PACKING_CUSTOM_ITEMS = 20;
export const MAX_PACKING_CUSTOM_ITEM_LENGTH = 20;

// URL・メールアドレス・電話番号の形の言葉は保存を断る(法務 2026-09-25)
const URL_PATTERN = /https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}|\b[a-z0-9-]+\.(com|jp|net|org|io|info|biz|co)\b/i;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /0\d{1,4}[-\s()]{0,3}\d{1,4}[-\s()]{0,3}\d{3,4}|0\d{9,10}/;

export function containsContactInfo(text: string): boolean {
  // 全角の数字・記号(０-９、ｗｗｗ．など)も判定できるよう正規化してから調べる
  const normalized = text.normalize("NFKC");
  return URL_PATTERN.test(normalized) || EMAIL_PATTERN.test(normalized) || PHONE_PATTERN.test(normalized);
}
