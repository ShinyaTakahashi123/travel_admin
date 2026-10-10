// user-site の public/themes/ 配下にある、あらかじめ用意されたテーマの絵。
// admin-siteとuser-siteは別リポジトリ・別デプロイのため、admin-siteから直接ファイル一覧を
// 読むことができない。画像作成が新しい絵をuser-siteのpublic/themes/に追加したら、
// このリストも手で追記する
export const THEME_IMAGE_CATALOG: { path: string; name: string }[] = [
  { path: "/themes/theme-koyo.svg", name: "紅葉" },
  { path: "/themes/theme-winter.svg", name: "冬の旅" },
  { path: "/themes/theme-onsen.svg", name: "温泉" },
  { path: "/themes/theme-zekkei.svg", name: "絶景" },
  { path: "/themes/theme-gourmet.svg", name: "グルメ" },
  { path: "/themes/theme-family.svg", name: "家族旅行" },
  { path: "/themes/theme-solo.svg", name: "一人旅" },
  { path: "/themes/theme-beach.svg", name: "海・リゾート" },
  { path: "/themes/theme-sakura.svg", name: "桜・花見" },
  { path: "/themes/theme-castle.svg", name: "お城めぐり" },
  { path: "/themes/theme-goshuin.svg", name: "御朱印めぐり" },
  { path: "/themes/theme-fruit-picking.svg", name: "味覚狩り" },
  { path: "/themes/theme-classic.svg", name: "定番観光" },
  { path: "/themes/theme-student.svg", name: "学生旅行" },
];
