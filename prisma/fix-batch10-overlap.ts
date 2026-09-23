import { prisma } from "../src/lib/prisma";
import { fetchAndUploadImage } from "./lib/pilot-gen";
import existingPhotoCache from "./photo-cache.json";

const UA_IGNORE = 0;
type Spot = { name: string; wikiTitle: string; address: string; lat: number; lng: number; memo: string; websiteUrl: string; time: string; stay: number; transit?: { mode: string; min: number; line?: string } };

function toUTCTime(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

const REPLACEMENTS: {
  oldTitle: string;
  newTitle: string;
  newDescription: string;
  days: Spot[][];
}[] = [
  {
    oldTitle: "お釜と温泉、宮城蔵王を満喫するドライブ&湯めぐり1泊2日",
    newTitle: "キツネと動物ふれあい、みやぎ蔵王キツネ村を満喫する家族旅1泊2日",
    newDescription: "100頭以上のキツネが放し飼いにされる、みやぎ蔵王キツネ村でのふれあい体験。2日目は蔵王酪農センターで乳製品づくりも楽しむ、家族連れにおすすめの1泊2日プランです。",
    days: [
      [
        { name: "みやぎ蔵王キツネ村", wikiTitle: "宮城蔵王キツネ村", address: "白石市福岡蔵本錦の木147-1", lat: 38.1206, lng: 140.6169, memo: "100頭以上のキツネが放し飼いにされ、間近でふれあえる人気スポット。", websiteUrl: "", time: "10:00", stay: 90 },
        { name: "蔵王酪農センター", wikiTitle: "蔵王町", address: "刈田郡蔵王町遠刈田温泉北16-1", lat: 38.1381, lng: 140.5967, memo: "チーズやアイスクリームづくりが体験できる、蔵王山麓の牧場施設。", websiteUrl: "", time: "12:30", stay: 60, transit: { mode: "car", min: 20 } },
      ],
      [
        { name: "遠刈田温泉", wikiTitle: "遠刈田温泉", address: "刈田郡蔵王町遠刈田温泉", lat: 38.1381, lng: 140.5967, memo: "2日目の朝は、こけしの里・遠刈田温泉の街をゆっくり散策。", websiteUrl: "", time: "9:30", stay: 60 },
      ],
    ],
  },
  {
    oldTitle: "中尊寺と毛越寺、世界遺産・平泉をじっくり巡る1泊2日",
    newTitle: "厳美渓と猊鼻渓、平泉近くの渓谷美を巡る舟下り1泊2日",
    newDescription: "奇岩と清流が織りなす厳美渓と、船頭の唄が響く猊鼻渓の舟下り。世界遺産の社寺とは違う、一関の自然美を楽しむ1泊2日プランです。",
    days: [
      [
        { name: "厳美渓", wikiTitle: "厳美渓", address: "一関市厳美町字滝ノ上地内", lat: 38.9686, lng: 141.0361, memo: "栗駒山を水源とする磐井川が作り出した、奇岩と渓流の景勝地。名物の「空飛ぶだんご」も人気。", websiteUrl: "", time: "10:00", stay: 70 },
      ],
      [
        { name: "猊鼻渓", wikiTitle: "猊鼻渓", address: "一関市東山町長坂字町467", lat: 38.9928, lng: 141.1719, memo: "高さ50mの断崖が続く渓谷を、船頭の竿さばきと唄で下る舟下り。", websiteUrl: "", time: "9:30", stay: 90 },
      ],
    ],
  },
  {
    oldTitle: "中津川沿いをのんびり、盛岡の街を味わい尽くす1泊2日",
    newTitle: "岩手銀行赤レンガ館と小岩井農場、歴史と牧場を楽しむ盛岡1泊2日",
    newDescription: "明治の面影を残す岩手銀行赤レンガ館から、雄大な岩手山を望む小岩井農場まで。盛岡の歴史的建築と郊外の牧場、両方を楽しむ1泊2日プランです。",
    days: [
      [
        { name: "岩手銀行赤レンガ館", wikiTitle: "岩手銀行赤レンガ館", address: "盛岡市中ノ橋通1丁目2-20", lat: 39.7016, lng: 141.1522, memo: "東京駅を設計した辰野金吾による、明治期の赤レンガ建築。" , websiteUrl: "", time: "10:00", stay: 50 },
      ],
      [
        { name: "小岩井農場まきば園", wikiTitle: "小岩井農場", address: "岩手郡雫石町丸谷地36-1", lat: 39.7719, lng: 140.9967, memo: "岩手山を望む、130年以上の歴史を持つ民間総合農場。動物とのふれあいも楽しめる。", websiteUrl: "", time: "9:30", stay: 120 },
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
    for (const [i, day] of r.days.entries()) {
      console.log(`  Day${i + 1}: ` + day.map((s) => `${s.time} ${s.name}`).join(" / "));
    }
    if (!commit) continue;

    await prisma.day.deleteMany({ where: { itineraryId: it.id } });

    let thumbnailUrl: string | null = null;
    for (const [dayIndex, spots] of r.days.entries()) {
      const day = await prisma.day.create({ data: { itineraryId: it.id, dayNumber: dayIndex + 1 } });
      for (const [idx, s] of spots.entries()) {
        const url = await fetchAndUploadImage(imageCache, { name: s.name, address: s.address, lat: s.lat, lng: s.lng, memo: s.memo, websiteUrl: s.websiteUrl, wikiTitle: s.wikiTitle }, "official-areas-10-fix");
        if (!thumbnailUrl && url) thumbnailUrl = url;
        const spotRow = await prisma.spot.create({
          data: {
            dayId: day.id,
            orderNo: idx + 1,
            name: s.name,
            address: s.address,
            lat: s.lat,
            lng: s.lng,
            visitTime: toUTCTime(s.time),
            memo: s.memo,
            stayDurationMin: s.stay,
            websiteUrl: s.websiteUrl || null,
            transitMode: s.transit?.mode ?? null,
            transitDurationMin: s.transit?.min ?? null,
            transitLine: s.transit?.line ?? null,
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
