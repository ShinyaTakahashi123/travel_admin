import { prisma } from "../src/lib/prisma";
import { fetchAndUploadImage } from "./lib/pilot-gen";
import existingPhotoCache from "./photo-cache.json";

type Spot = { name: string; wikiTitle: string; address: string; lat: number; lng: number; memo: string; websiteUrl: string; time: string; stay: number; transit?: { mode: string; min: number; line?: string } };

function toUTCTime(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

const REPLACEMENTS: { oldTitle: string; newTitle: string; newDescription: string; days: Spot[][] }[] = [
  {
    oldTitle: "秋田の街と美術館をじっくり、大人の秋田市内1泊2日",
    newTitle: "秋田市民市場と川反、あきた食文化を満喫するグルメプラン",
    newDescription: "きりたんぽや稲庭うどんなど地元食材が並ぶ秋田市民市場と、郷土料理店が軒を連ねる川反エリア。歴史散策とは違う、秋田の「食」を楽しむプランです。",
    days: [
      [
        { name: "秋田市民市場", wikiTitle: "秋田市", address: "秋田市中通4丁目7-35", lat: 39.7186, lng: 140.1122, memo: "きりたんぽや稲庭うどんなど、秋田の郷土食材・惣菜が並ぶ市民の台所。", websiteUrl: "", time: "10:00", stay: 60 },
        { name: "川反", wikiTitle: "秋田市", address: "秋田市大町・川反", lat: 39.7203, lng: 140.1144, memo: "旭川沿いに郷土料理店が並ぶ、東北屈指の歓楽街・飲食店街。", websiteUrl: "", time: "11:30", stay: 60, transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    oldTitle: "田沢湖畔でのんびり、湖と渓谷を満喫する1泊2日",
    newTitle: "乳頭温泉郷、秘湯の湯めぐりを楽しむ田沢湖1泊2日",
    newDescription: "鶴の湯温泉をはじめとする、日本有数の秘湯・乳頭温泉郷。ブナ林に囲まれた温泉宿を巡り、田沢湖とはまた違う山あいの湯治文化を楽しむ1泊2日です。",
    days: [
      [
        { name: "鶴の湯温泉", wikiTitle: "鶴の湯温泉", address: "仙北市田沢湖田沢字先達沢国有林50", lat: 39.7383, lng: 140.8156, memo: "乳頭温泉郷最古の湯宿。茅葺き屋根の建物と乳白色の湯が有名。", websiteUrl: "", time: "10:30", stay: 90 },
      ],
      [
        { name: "乳頭温泉郷", wikiTitle: "乳頭温泉郷", address: "仙北市田沢湖田沢先達沢", lat: 39.7469, lng: 140.8322, memo: "ブナ林に囲まれた7つの湯宿が点在する、日本有数の秘湯エリア。", websiteUrl: "", time: "9:30", stay: 90 },
      ],
    ],
  },
];

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");
  const imageCache = new Map<string, string | null>(Object.entries(existingPhotoCache as Record<string, string>));

  for (const r of REPLACEMENTS) {
    const it = await prisma.itinerary.findFirst({ where: { title: r.oldTitle } });
    if (!it) { console.log(`見つかりません: ${r.oldTitle}`); continue; }
    console.log(`\n■ ${r.oldTitle} → ${r.newTitle}`);
    for (const [i, day] of r.days.entries()) console.log(`  Day${i + 1}: ` + day.map((s) => `${s.time} ${s.name}`).join(" / "));
    if (!commit) continue;

    await prisma.day.deleteMany({ where: { itineraryId: it.id } });
    let thumbnailUrl: string | null = null;
    for (const [dayIndex, spots] of r.days.entries()) {
      const day = await prisma.day.create({ data: { itineraryId: it.id, dayNumber: dayIndex + 1 } });
      for (const [idx, s] of spots.entries()) {
        const url = await fetchAndUploadImage(imageCache, { name: s.name, address: s.address, lat: s.lat, lng: s.lng, memo: s.memo, websiteUrl: s.websiteUrl, wikiTitle: s.wikiTitle }, "official-areas-11-fix");
        if (!thumbnailUrl && url) thumbnailUrl = url;
        const spotRow = await prisma.spot.create({
          data: {
            dayId: day.id, orderNo: idx + 1, name: s.name, address: s.address, lat: s.lat, lng: s.lng,
            visitTime: toUTCTime(s.time), memo: s.memo, stayDurationMin: s.stay, websiteUrl: s.websiteUrl || null,
            transitMode: s.transit?.mode ?? null, transitDurationMin: s.transit?.min ?? null, transitLine: s.transit?.line ?? null,
          },
        });
        if (url) await prisma.photo.create({ data: { spotId: spotRow.id, url, caption: s.name } });
      }
    }
    await prisma.itinerary.update({ where: { id: it.id }, data: { title: r.newTitle, description: r.newDescription, thumbnailUrl: thumbnailUrl ?? it.thumbnailUrl } });
    console.log(`  更新完了`);
  }
  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
