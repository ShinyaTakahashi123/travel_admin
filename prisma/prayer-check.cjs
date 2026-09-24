// スポット名に「神社・寺・宮・堂・院・大社・教会」を含む（=今も参拝・法要がある可能性が高い）スポットの
// 紹介文に、静かに見学する配慮の一文（「静かに」「敬意をもって」「配慮」）があるかをチェックする。
// 誤検知あり（例: 城跡・地名などに「宮」を含む場合）。1件ずつ内容を見て判断すること。
// 使い方: admin-site ディレクトリで `node prisma/prayer-check.cjs <都道府県>`
const {createRequire}=require("module");const r=createRequire(process.cwd()+"/package.json");
r("dotenv").config();const {PrismaClient}=r("@prisma/client");const {PrismaPg}=r("@prisma/adapter-pg");
const p=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
(async()=>{const pref=process.argv[2];
const rows=await p.$queryRawUnsafe(`select i.id::text iid, i.title::text title, d.day_number::int dn, to_char(s.visit_time,$2) tm, s.name::text n, s.memo::text m from spot s join day d on d.id=s.day_id join itinerary i on i.id=d.itinerary_id join area a on a.id=i.primary_area_id join planner_account pa on pa.id=i.planner_account_id where a.name=$1 and i.status=$3 and pa.is_official order by i.id, d.day_number, s.visit_time`,pref,"HH24:MI","published");
const nameRe=/神社|寺|宮|堂|院|大社|教会/;
const careRe=/静かに|敬意をもって|配慮/;
let hits=0;
rows.forEach(s=>{
  if(!nameRe.test(s.n)) return;
  const m=s.m||"";
  if(!careRe.test(m)){
    hits++;
    console.log(`${s.iid.slice(0,8)} D${s.dn} ${s.tm} ${s.n}（${s.title.slice(0,20)}...） → 配慮の一文なし（要確認）`);
  }
});
console.log(pref, "配慮の一文が見当たらないスポット:", hits, "件（誤検知あり。1件ずつ内容を確認すること）");
await p.$disconnect();})();
