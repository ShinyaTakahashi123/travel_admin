/**
 * #97 甘樫丘の絶景と謎の石造物、飛鳥をじっくり歩く1泊2日 の初日・最終日の見直し。
 *
 * - 初日(向原寺)の1か所目が09:00と早すぎたので、入口(橿原神宮前駅、10:30ごろ着→徒歩
 *   実測28分、routed-foot)から組み直し、10:58開始・16:54終了に(10:45〜11:45・
 *   16:30〜17:00の範囲)。タイトルの「じっくり歩く」に合わせ、徒歩の入口とした
 * - 2日目(1泊2日の最終日)は、歩きの区間を実測し直すと軒並み延びる(特に石舞台→高松塚
 *   42分・高松塚→岡寺42分)ため、滞在を短縮して終了を見直す前と同じ16:31に収めた。
 *   1か所目(亀石)に、宿(桜井市内)の最寄りとなる近鉄飛鳥駅からの徒歩(実測25分)を追加
 * - 歩きの区間はすべて routing.openstreetmap.de/routed-foot の道のり(m)÷75m/分で
 *   測り直した。山田寺跡→安倍文殊院の車は router.project-osrm.org で測り直し
 *   (道のり4.7分、もとの20分は道のり×1.5+5分=12.05分を超えるため直す。道のり+駐車5分
 *   で約10分に)
 * - 座標は、企画運営の指示どおり、同じ場所を扱う見直し済みの#84・#17で使った値にそろえた
 *   (甘樫丘→甘樫丘展望台node4049734908、水落遺跡→way813518378、飛鳥寺→
 *   way813386514、酒船石遺跡→way1566437305、高松塚古墳・壁画館→node1423093823。
 *   向原寺・万葉文化館・飛鳥資料館・亀石・橘寺・飛鳥京跡・石舞台古墳・岡寺は、もとから
 *   #84・#17と一致していたので変更なし。山田寺跡・安倍文殊院は#84・#17にないため、
 *   Nominatimで別途確認、もとの値と一致していたので変更なし)
 * - 国営飛鳥歴史公園館(2026-04-01閉館)は、#97のどの文にも出てこないため対応不要
 *   (企画運営に確認済み)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-97-d1f4dd69.ts
 *   反映: npm run prod -- npx tsx prisma/fix-97-d1f4dd69.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const MUKOHARAJI_ID = "beaf46d7-8998-4df1-9de5-7287e5fe5fa0";
const AMAKASHINOOKA_ID = "f6cf5ad2-7059-47f2-9f61-9779631b24e3";
const MIZUOCHI_ID = "5c45c764-4265-4c72-827b-fbfa023d4302";
const ASUKADERA_ID = "650ba03d-ba45-45e7-84ea-588d9bb5306f";
const MANYOBUNKAKAN_ID = "bfccfac6-3150-45ba-a4a8-54d4e5435904";
const ASUKASHIRYOKAN_ID = "61c0f169-74b3-466b-bbac-f2f25b6ea554";
const YAMADADERA_ID = "2fa34160-c69b-4f3a-94fb-dfb952ca70b1";
const ABEMONJUIN_ID = "15a94742-ad3b-4a43-8f51-a08835c8ddc5";

const KAMEISHI_ID = "5dd8e950-3f28-4076-a5f2-18c3f8c24533";
const TACHIBANADERA_ID = "8d4c570b-058f-4d54-a080-0ad4fc9d41c8";
const ASUKAKYOATO_ID = "855f8a37-a4af-45d9-8ee7-d552123fd144";
const SAKAFUNEISHI_ID = "8a3a81a8-68b5-4422-a836-60a5b130b1b6";
const ISHIBUTAI_ID = "34e07932-bfc9-4761-8e99-a7dab244ea02";
const TAKAMATSUZUKA_ID = "d622b5c2-9620-4ebb-943d-6e467e76db0e";
const OKADERA_ID = "1f931004-ff9d-4f2b-9163-94286a8465f7";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const VISIT_TIMES: { id: string; h: number; m: number }[] = [
  { id: MUKOHARAJI_ID, h: 10, m: 58 },
  { id: AMAKASHINOOKA_ID, h: 11, m: 23 },
  { id: MIZUOCHI_ID, h: 12, m: 7 },
  { id: ASUKADERA_ID, h: 12, m: 27 },
  { id: MANYOBUNKAKAN_ID, h: 13, m: 4 },
  { id: ASUKASHIRYOKAN_ID, h: 14, m: 27 },
  { id: YAMADADERA_ID, h: 15, m: 34 },
  { id: ABEMONJUIN_ID, h: 15, m: 59 },
  { id: KAMEISHI_ID, h: 9, m: 30 },
  { id: TACHIBANADERA_ID, h: 9, m: 55 },
  { id: ASUKAKYOATO_ID, h: 10, m: 30 },
  { id: SAKAFUNEISHI_ID, h: 10, m: 56 },
  { id: ISHIBUTAI_ID, h: 11, m: 40 },
  { id: TAKAMATSUZUKA_ID, h: 13, m: 32 },
  { id: OKADERA_ID, h: 15, m: 1 },
];

const STAY_UPDATES: { id: string; label: string; min: number }[] = [
  { id: MUKOHARAJI_ID, label: "向原寺", min: 15 },
  { id: AMAKASHINOOKA_ID, label: "甘樫丘", min: 35 },
  { id: MIZUOCHI_ID, label: "水落遺跡", min: 15 },
  { id: ASUKADERA_ID, label: "飛鳥寺", min: 30 },
  { id: MANYOBUNKAKAN_ID, label: "万葉文化館", min: 65 },
  { id: ASUKASHIRYOKAN_ID, label: "飛鳥資料館", min: 55 },
  { id: YAMADADERA_ID, label: "山田寺跡", min: 15 },
  { id: ABEMONJUIN_ID, label: "安倍文殊院", min: 55 },
  { id: KAMEISHI_ID, label: "亀石", min: 15 },
  { id: TACHIBANADERA_ID, label: "橘寺", min: 25 },
  { id: ASUKAKYOATO_ID, label: "飛鳥京跡", min: 20 },
  { id: SAKAFUNEISHI_ID, label: "酒船石遺跡", min: 25 },
  { id: ISHIBUTAI_ID, label: "石舞台古墳", min: 70 },
  { id: TAKAMATSUZUKA_ID, label: "高松塚古墳・壁画館", min: 47 },
  { id: OKADERA_ID, label: "岡寺", min: 90 },
];

const COORD_UPDATES: { id: string; label: string; lat: number; lng: number }[] = [
  { id: AMAKASHINOOKA_ID, label: "甘樫丘(甘樫丘展望台)", lat: 34.47972, lng: 135.815547 },
  { id: MIZUOCHI_ID, label: "水落遺跡", lat: 34.480312, lng: 135.818279 },
  { id: ASUKADERA_ID, label: "飛鳥寺", lat: 34.478672, lng: 135.820198 },
  { id: SAKAFUNEISHI_ID, label: "酒船石遺跡", lat: 34.475588, lng: 135.823397 },
  { id: TAKAMATSUZUKA_ID, label: "高松塚古墳・壁画館", lat: 34.462456, lng: 135.805551 },
];

const LEG_UPDATES: { spotId: string; label: string; min: number; mode?: string }[] = [
  { spotId: AMAKASHINOOKA_ID, label: "向原寺→甘樫丘", min: 10 },
  { spotId: MIZUOCHI_ID, label: "甘樫丘→水落遺跡", min: 9 },
  { spotId: MANYOBUNKAKAN_ID, label: "飛鳥寺→万葉文化館", min: 7 },
  { spotId: ASUKASHIRYOKAN_ID, label: "万葉文化館→飛鳥資料館", min: 18 },
  { spotId: YAMADADERA_ID, label: "飛鳥資料館→山田寺跡", min: 12 },
  { spotId: ABEMONJUIN_ID, label: "山田寺跡→安倍文殊院(タクシー)", min: 10, mode: "taxi" },
  { spotId: TACHIBANADERA_ID, label: "亀石→橘寺", min: 10 },
  { spotId: ASUKAKYOATO_ID, label: "橘寺→飛鳥京跡", min: 10 },
  { spotId: SAKAFUNEISHI_ID, label: "飛鳥京跡→酒船石遺跡", min: 6 },
  { spotId: ISHIBUTAI_ID, label: "酒船石遺跡→石舞台古墳", min: 19 },
  { spotId: TAKAMATSUZUKA_ID, label: "石舞台古墳→高松塚古墳・壁画館", min: 42 },
  { spotId: OKADERA_ID, label: "高松塚古墳・壁画館→岡寺", min: 42 },
];

const MEMO_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: MUKOHARAJI_ID,
    label: "向原寺(入口の一文)",
    find: "飛鳥めぐりの1日目は、甘樫丘の北にある向原寺(豊浦寺跡)から始めましょう。",
    replace: "橿原神宮前駅に10:30ごろ着いたら、歩いておよそ28分。飛鳥めぐりの1日目は、甘樫丘の北にある向原寺(豊浦寺跡)から始めましょう。",
  },
  {
    id: MUKOHARAJI_ID,
    label: "向原寺(終わりの一文)",
    find: "この後は、歩いておよそ6分、甘樫丘へ向かいましょう。",
    replace: "この後は、歩いておよそ10分、甘樫丘へ向かいましょう。",
  },
  {
    id: AMAKASHINOOKA_ID,
    label: "甘樫丘(書き出し)",
    find: "向原寺から歩いておよそ6分、甘樫丘に着きます。",
    replace: "向原寺から歩いておよそ10分、甘樫丘に着きます。",
  },
  {
    id: AMAKASHINOOKA_ID,
    label: "甘樫丘(終わりの一文)",
    find: "この後は、歩いておよそ5分、水落遺跡へ向かいましょう。",
    replace: "この後は、歩いておよそ9分、水落遺跡へ向かいましょう。",
  },
  {
    id: MIZUOCHI_ID,
    label: "水落遺跡(書き出し)",
    find: "甘樫丘から歩いておよそ5分、水落遺跡に着きます。",
    replace: "甘樫丘から歩いておよそ9分、水落遺跡に着きます。",
  },
  {
    id: ASUKADERA_ID,
    label: "飛鳥寺(終わりの一文)",
    find: "この後は、歩いておよそ5分、奈良県立万葉文化館へ向かいましょう。",
    replace: "この後は、歩いておよそ7分、奈良県立万葉文化館へ向かいましょう。",
  },
  {
    id: MANYOBUNKAKAN_ID,
    label: "万葉文化館(書き出し)",
    find: "飛鳥寺から歩いておよそ5分、奈良県立万葉文化館に着きます。",
    replace: "飛鳥寺から歩いておよそ7分、奈良県立万葉文化館に着きます。",
  },
  {
    id: MANYOBUNKAKAN_ID,
    label: "万葉文化館(終わりの一文)",
    find: "この後は、徒歩またはバスでおよそ13分、奈良文化財研究所飛鳥資料館へ向かいましょう。",
    replace: "この後は、歩いておよそ18分、奈良文化財研究所飛鳥資料館へ向かいましょう。",
  },
  {
    id: ASUKASHIRYOKAN_ID,
    label: "飛鳥資料館(書き出し)",
    find: "万葉文化館から徒歩またはバスでおよそ13分、奈良文化財研究所飛鳥資料館に着きます。",
    replace: "万葉文化館から歩いておよそ18分、奈良文化財研究所飛鳥資料館に着きます。",
  },
  {
    id: ASUKASHIRYOKAN_ID,
    label: "飛鳥資料館(終わりの一文)",
    find: "この後は、歩いておよそ8分、山田寺跡へ向かいましょう。",
    replace: "この後は、歩いておよそ12分、山田寺跡へ向かいましょう。",
  },
  {
    id: YAMADADERA_ID,
    label: "山田寺跡(書き出し)",
    find: "飛鳥資料館から歩いておよそ8分、山田寺跡に着きます。",
    replace: "飛鳥資料館から歩いておよそ12分、山田寺跡に着きます。",
  },
  {
    id: YAMADADERA_ID,
    label: "山田寺跡(終わりの一文)",
    find: "この後は、バスまたは車でおよそ20分、安倍文殊院へ向かいましょう。",
    replace: "この後は、この区間はタクシーを使うと便利です。タクシーでおよそ10分、安倍文殊院へ向かいましょう。",
  },
  {
    id: ABEMONJUIN_ID,
    label: "安倍文殊院(書き出し)",
    find: "山田寺跡からバスまたは車でおよそ20分、1日目最後は安倍文殊院です。",
    replace: "山田寺跡からは、タクシーを使うと便利です。タクシーでおよそ10分で、1日目最後は安倍文殊院です。",
  },
  {
    id: KAMEISHI_ID,
    label: "亀石(宿からの行き方)",
    find: "2日目は、明日香村川原にある亀石から始めましょう。",
    replace: "2日目は、宿を出て、電車で約31分の近鉄飛鳥駅から歩いて約25分の、明日香村川原にある亀石から始めましょう。",
  },
  {
    id: KAMEISHI_ID,
    label: "亀石(終わりの一文)",
    find: "この後は、歩いておよそ8分、橘寺へ向かいましょう。",
    replace: "この後は、歩いておよそ10分、橘寺へ向かいましょう。",
  },
  {
    id: TACHIBANADERA_ID,
    label: "橘寺(書き出し)",
    find: "亀石から歩いておよそ8分、橘寺に着きます。",
    replace: "亀石から歩いておよそ10分、橘寺に着きます。",
  },
  {
    id: TACHIBANADERA_ID,
    label: "橘寺(終わりの一文)",
    find: "この後は、歩いておよそ6分、飛鳥京跡へ向かいましょう。",
    replace: "この後は、歩いておよそ10分、飛鳥京跡へ向かいましょう。",
  },
  {
    id: ASUKAKYOATO_ID,
    label: "飛鳥京跡(書き出し)",
    find: "橘寺から歩いておよそ6分、飛鳥京跡、飛鳥宮跡とも呼ばれる国指定史跡に着きます。",
    replace: "橘寺から歩いておよそ10分、飛鳥京跡、飛鳥宮跡とも呼ばれる国指定史跡に着きます。",
  },
  {
    id: ASUKAKYOATO_ID,
    label: "飛鳥京跡(終わりの一文)",
    find: "この後は、歩いておよそ4分、酒船石遺跡へ向かいましょう。",
    replace: "この後は、歩いておよそ6分、酒船石遺跡へ向かいましょう。",
  },
  {
    id: SAKAFUNEISHI_ID,
    label: "酒船石遺跡(書き出し)",
    find: "飛鳥京跡から歩いておよそ4分、酒船石遺跡に着きます。",
    replace: "飛鳥京跡から歩いておよそ6分、酒船石遺跡に着きます。",
  },
  {
    id: SAKAFUNEISHI_ID,
    label: "酒船石遺跡(終わりの一文)",
    find: "この後は、歩いておよそ13分、石舞台古墳へ向かいましょう。",
    replace: "この後は、歩いておよそ19分、石舞台古墳へ向かいましょう。",
  },
  {
    id: ISHIBUTAI_ID,
    label: "石舞台古墳(書き出し)",
    find: "酒船石遺跡から歩いておよそ13分、石舞台古墳に着きます。",
    replace: "酒船石遺跡から歩いておよそ19分、石舞台古墳に着きます。",
  },
  {
    id: ISHIBUTAI_ID,
    label: "石舞台古墳(終わりの一文)",
    find: "この後は、歩いておよそ32分、高松塚古墳・壁画館へ向かいましょう。",
    replace: "この後は、歩いておよそ42分、高松塚古墳・壁画館へ向かいましょう。",
  },
  {
    id: TAKAMATSUZUKA_ID,
    label: "高松塚古墳・壁画館(書き出し)",
    find: "石舞台古墳から歩いておよそ32分、高松塚古墳・壁画館に着きます。",
    replace: "石舞台古墳から歩いておよそ42分、高松塚古墳・壁画館に着きます。",
  },
  {
    id: TAKAMATSUZUKA_ID,
    label: "高松塚古墳・壁画館(終わりの一文)",
    find: "この後は、歩いておよそ38分、岡寺へ向かいましょう。",
    replace: "この後は、歩いておよそ42分、岡寺へ向かいましょう。",
  },
  {
    id: OKADERA_ID,
    label: "岡寺(書き出し)",
    find: "高松塚古墳・壁画館から歩いておよそ38分、2日目最後は岡寺です。",
    replace: "高松塚古墳・壁画館から歩いておよそ42分、2日目最後は岡寺です。",
  },
  {
    id: OKADERA_ID,
    label: "岡寺(帰りの一文)",
    find: "参拝を終えたら、岡寺前バス停まで歩いておよそ10分、奈良交通のバスでおよそ24分、近鉄橿原神宮前駅へ戻りましょう。",
    replace: "参拝を終えたら、岡寺前バス停まで歩いておよそ9分、奈良交通のバスでおよそ24分、近鉄橿原神宮前駅へ戻りましょう。バスの時刻は公式の案内で確かめましょう。",
  },
  {
    id: MUKOHARAJI_ID,
    label: "向原寺(祈りの一文)",
    find: "今も法灯を受け継ぐ寺院ですので、敬意を持ってお参りしましょう。",
    replace: "今も法灯を受け継ぐ寺院ですので、静かに、敬意を持ってお参りしましょう。",
  },
  {
    id: ASUKADERA_ID,
    label: "飛鳥寺(祈りの一文)",
    find: "今も大切に祀られている祈りの場ですので、敬意を持ってお参りしましょう。",
    replace: "今も大切に祀られている祈りの場ですので、静かに、敬意を持ってお参りしましょう。",
  },
  {
    id: TACHIBANADERA_ID,
    label: "橘寺(祈りの一文)",
    find: "太子ゆかりの祈りの場でもありますので、敬意を持ってお参りしましょう。",
    replace: "太子ゆかりの祈りの場でもありますので、静かに、敬意を持ってお参りしましょう。",
  },
  {
    id: ABEMONJUIN_ID,
    label: "安倍文殊院(祈りの一文)",
    find: "今も信仰を集める祈りの場ですので、敬意を持ってお参りしましょう。",
    replace: "今も信仰を集める祈りの場ですので、静かに、敬意を持ってお参りしましょう。",
  },
  {
    id: OKADERA_ID,
    label: "岡寺(祈りの一文)",
    find: "境内は祈りの場ですので、敬意を持って過ごしましょう。",
    replace: "境内は祈りの場ですので、静かに、敬意を持ってお参りしましょう。",
  },
  {
    id: ISHIBUTAI_ID,
    label: "石舞台古墳(お墓の一文)",
    find: "周囲を囲む巨石の大きさを間近で体感できます。公園内や周辺の食事処で、昼食をとっておきましょう。",
    replace: "周囲を囲む巨石の大きさを間近で体感できます。古墳のまわりでは、静かに過ごしましょう。公園内や周辺の食事処で、昼食をとっておきましょう。",
  },
  {
    id: TAKAMATSUZUKA_ID,
    label: "高松塚古墳・壁画館(お墓の一文)",
    find: "発見当時の姿を再現した模写や石室の模型を見学できます。",
    replace: "発見当時の姿を再現した模写や石室の模型を見学できます。古墳のまわりでは、静かに過ごしましょう。",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(MEMO_PAIRS.map((p) => p.id))];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  for (const p of MEMO_PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  for (const p of MEMO_PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }

  console.log("=== #97 初日・最終日の見直し ===\n");
  console.log("[時刻]");
  for (const v of VISIT_TIMES) {
    console.log(`  ${v.id} => ${String(v.h).padStart(2, "0")}:${String(v.m).padStart(2, "0")}`);
  }
  console.log("\n[滞在(分)]");
  for (const s of STAY_UPDATES) {
    console.log(`  ${s.label}: ${s.min}分`);
  }
  console.log("\n[座標]");
  for (const c of COORD_UPDATES) {
    console.log(`  ${c.label}: ${c.lat},${c.lng}`);
  }
  console.log("\n[移動(分)]");
  for (const l of LEG_UPDATES) {
    console.log(`  ${l.label}: ${l.min}分`);
  }
  console.log("\n[メモ]");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 70));
    console.log();
  }

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    ...VISIT_TIMES.map((v) => prisma.spot.update({ where: { id: v.id }, data: { visitTime: t(v.h, v.m) } })),
    ...STAY_UPDATES.map((s) => prisma.spot.update({ where: { id: s.id }, data: { stayDurationMin: s.min } })),
    ...COORD_UPDATES.map((c) => prisma.spot.update({ where: { id: c.id }, data: { lat: c.lat, lng: c.lng } })),
    ...LEG_UPDATES.map((l) =>
      prisma.spotTransitLeg.updateMany({
        where: { spotId: l.spotId },
        data: { transitDurationMin: l.min, ...(l.mode ? { transitMode: l.mode } : {}) },
      })
    ),
    ...ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } })),
  ]);

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
