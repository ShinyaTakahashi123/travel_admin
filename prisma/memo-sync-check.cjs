// read-only: compare record-file memo texts with DB Spot.memo for official published itineraries.
// Handles both half-width and full-width parens around the char count, and optional leading
// "N. " numbering (used in some early record files). Entries that defer to another file
// (e.g. "samples.mdを参照") are reported separately as "deferred" rather than counted as missing.
const path=require("path"),fs=require("fs");
const {createRequire}=require("module");const r=createRequire(path.join(process.cwd(),"package.json"));
r("dotenv").config();const {PrismaClient}=r("@prisma/client");const {PrismaPg}=r("@prisma/adapter-pg");
const p=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
const norm=s=>(s||"").replace(/\s+/g,"").replace(/（訪問時刻[^）]*）$/,"").replace(/[（(]/g,"(").replace(/[）)]/g,")").trim();
const lineRe = /^(?:Day\d+:\s*|　　|\d+\.\s*)?(.+?)[（(](\d+)字[^）)]*[）)]\s*[：:]\s*(.*)$/;
(async()=>{
 const dir=path.join(process.cwd(),"..","docs","content","spot-memo-sources");
 for(const pref of process.argv.slice(2)){
  const txt=fs.readFileSync(path.join(dir,pref+".md"),"utf8");
  const rec=[];const deferred=[];
  for(const line of txt.split(/\r?\n/)){
    const m=line.match(lineRe);
    if(!m) continue;
    const name=m[1].trim();
    const bodyText=m[3].trim();
    if(!bodyText || /samples\.md|を参照。?$|参照$/.test(bodyText)){ deferred.push(name); continue; }
    rec.push({n:name,t:norm(bodyText)});
  }
  const rows=await p.$queryRawUnsafe(`select s.name::text n, s.memo::text m from spot s join day d on d.id=s.day_id join itinerary i on i.id=d.itinerary_id join area a on a.id=i.primary_area_id join planner_account pa on pa.id=i.planner_account_id where a.name=$1 and i.status='published' and pa.is_official`,pref);
  const db=new Set(rows.map(x=>norm(x.m)));const rs=new Set(rec.map(x=>x.t));
  const miss=rec.filter(x=>!db.has(x.t)).map(x=>x.n);
  const extra=rows.filter(x=>!rs.has(norm(x.m))).map(x=>x.n);
  console.log(`${pref}: record ${rec.length} (+${deferred.length} deferred) / db ${rows.length} | record-not-in-db: ${miss.length}${miss.length?" ["+miss.join(",")+"]":""} | db-not-in-record: ${extra.length}${extra.length?" ["+extra.join(",")+"]":""}`);
  if(deferred.length) console.log(`  deferred (no inline text in record, skipped): [${deferred.join(",")}]`);
 }
 await p.$disconnect();
})();
