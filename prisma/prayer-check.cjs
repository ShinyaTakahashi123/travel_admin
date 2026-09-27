// スポット名に「神社・寺・宮・堂・院・大社・教会」を含む（=今も参拝・法要がある可能性が高い）スポットの
// 紹介文に、静かに見学する配慮の一文（「静かに」「敬意をもって」「配慮」）があるかをチェックする。
// 誤検知あり（例: 城跡・地名などに「宮」を含む場合）。1件ずつ内容を見て判断すること。
// 使い方:
//   都道府県ごと（公開中のしおりのみが対象。従来どおり）: node prisma/prayer-check.cjs <都道府県>
//   しおりID指定（状態を問わない。承認待ち(pending)のしおりにも使える。2026-09-27 法務の依頼で追加）:
//     node prisma/prayer-check.cjs --id <しおりIDの全体または先頭8文字以上>
const {createRequire}=require("module");const r=createRequire(process.cwd()+"/package.json");
r("dotenv").config();const {PrismaClient}=r("@prisma/client");const {PrismaPg}=r("@prisma/adapter-pg");
const p=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
const nameRe=/神社|寺|宮|堂|院|大社|教会/;
const careRe=/静かに|敬意をもって|配慮/;

function report(label, rows) {
  let hits=0;
  rows.forEach(s=>{
    if(!nameRe.test(s.n)) return;
    const m=s.m||"";
    if(!careRe.test(m)){
      hits++;
      console.log(`${s.iid.slice(0,8)} [${s.status}] D${s.dn} ${s.tm} ${s.n}（${s.title.slice(0,20)}...） → 配慮の一文なし（要確認）`);
    }
  });
  console.log(label, "配慮の一文が見当たらないスポット:", hits, "件（誤検知あり。1件ずつ内容を確認すること）");
}

(async()=>{
  const mode = process.argv[2];
  if (mode === "--id") {
    const idArg = process.argv[3];
    if (!idArg) { console.error("しおりIDを指定してください: node prisma/prayer-check.cjs --id <しおりID>"); process.exit(1); }
    const rows = await p.$queryRawUnsafe(
      `select i.id::text iid, i.title::text title, i.status::text status, d.day_number::int dn, to_char(s.visit_time,$2) tm, s.name::text n, s.memo::text m from spot s join day d on d.id=s.day_id join itinerary i on i.id=d.itinerary_id where i.id::text like $1 order by i.id, d.day_number, s.visit_time`,
      `${idArg}%`, "HH24:MI",
    );
    if (rows.length === 0) { console.log("しおりが見つかりません（IDを確認してください）:", idArg); await p.$disconnect(); return; }
    report(`しおりID ${idArg}`, rows);
  } else {
    const pref = mode;
    const rows = await p.$queryRawUnsafe(
      `select i.id::text iid, i.title::text title, i.status::text status, d.day_number::int dn, to_char(s.visit_time,$2) tm, s.name::text n, s.memo::text m from spot s join day d on d.id=s.day_id join itinerary i on i.id=d.itinerary_id join area a on a.id=i.primary_area_id join planner_account pa on pa.id=i.planner_account_id where a.name=$1 and i.status=$3 and pa.is_official order by i.id, d.day_number, s.visit_time`,
      pref, "HH24:MI", "published",
    );
    report(pref, rows);
  }
  await p.$disconnect();
})();
