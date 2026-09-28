// 足あと地図のスタンプの種類と同じ一覧(user-site/src/lib/trip.tsのSTAMP_CATEGORY_LABELSと
// そろえる。台帳の種類はここから選ぶ)
export const PLACE_MASTER_CATEGORY_LABELS: Record<string, string> = {
  castle: "お城",
  temple: "お寺",
  shrine: "神社",
  mountain: "山",
  water: "湖・川",
  beach: "海・浜辺",
  onsen: "温泉",
  museum: "美術館・博物館",
  townscape: "町並み",
  park: "公園",
  gourmet: "グルメ",
  craft: "工芸・体験",
  view: "景色・展望",
  sake_brewery: "酒蔵",
  other: "その他",
};

export const PLACE_MASTER_CATEGORIES = Object.keys(PLACE_MASTER_CATEGORY_LABELS);
