const {createRequire}=require("module");const r=createRequire(process.cwd()+"/package.json");
r("dotenv").config();const {PrismaClient}=r("@prisma/client");const {PrismaPg}=r("@prisma/adapter-pg");
const p=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
(async()=>{const pref=process.argv[2];const rows=await p.$queryRawUnsafe(`select i.id::text iid, d.day_number::int dn, to_char(s.visit_time,$2) tm, s.name::text n, s.memo::text m from spot s join day d on d.id=s.day_id join itinerary i on i.id=d.itinerary_id join area a on a.id=i.primary_area_id join planner_account pa on pa.id=i.planner_account_id where a.name=$1 and i.status=$3 and pa.is_official order by i.id, d.day_number, s.visit_time`,pref,"HH24:MI","published");
const by={};rows.forEach(x=>(by[x.iid]=by[x.iid]||[]).push(x));let issues=[];
for(const [iid,list] of Object.entries(by)){list.forEach((s,k)=>{const nxt=list[k+1];const names=list.map(z=>z.n);const m=s.m||"";
 const refs=names.filter(nm=>nm!==s.n&&m.includes(nm.replace(/（.*$/,"")));
 if(/次は|次の|この後|このあと|最後は/.test(m)){refs.forEach(ref=>{const idx=names.indexOf(ref);if(idx!==k+1&&idx<k) issues.push(`${iid.slice(0,8)} D${s.dn} ${s.tm} ${s.n} → 「次/この後」で前に訪れた「${ref}」に触れている（実際の次:「${nxt?nxt.n:"終わり"}」）`);});}
 if(/締めくく|最後を飾|旅の最後/.test(m)&&nxt&&nxt.dn===s.dn){issues.push(`${iid.slice(0,8)} D${s.dn} ${s.tm} ${s.n} → 「締めくくり」だが同じ日に次「${nxt.n}」がある`);}
 if(/夜景|ライトアップ|夜の/.test(m)&&/(見に|眺め|楽しみ|味わ|向か)/.test(m)){const h=+s.tm.slice(0,2);if(h<15) issues.push(`${iid.slice(0,8)} D${s.dn} ${s.tm} ${s.n} → 夜景・夜の過ごし方に触れているが訪問は${s.tm}（要確認）`);}
});}
console.log(pref,issues.length);issues.forEach(x=>console.log(x));await p.$disconnect();})();
