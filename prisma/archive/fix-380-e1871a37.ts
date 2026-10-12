/**
 * チェックリスト #380 e1871a37「野口英世記念館と磐梯山噴火記念館、猪苗代の偉人と自然史1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 猪苗代（野口英世記念館・会津民俗館・天鏡閣・長浜・土津神社・亀ヶ城公園・はじまりの美術館、7か所 09:00〜16:40）
 * 2日目: 裏磐梯（磐梯山噴火記念館・五色沼自然探勝路）から会津若松（七日町通り・鶴ヶ城・御薬園）へ（5か所 09:00〜16:45）
 * 既存の2か所はIDのまま直す。説明文の更新と2日分の並べ替えを1つのトランザクションで行う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-380-e1871a37.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e1871a37-9b27-41af-86b5-3d71a64ec4f9";
const DAY1_ID = "028c8948-0d6b-4125-97d0-eaf8a30614a1";
const DAY2_ID = "5109f915-664b-4f0c-93da-c645a6b1a9a9";
const NOGUCHI_ID = "2d266736-fb65-482b-acaf-1f310b3e8614";
const FUNKA_ID = "9919aa76-f724-419d-b7bb-089b55073095";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "世界的な細菌学者・野口英世の生家が残る記念館から、湖畔の洋館・天鏡閣や保科正之をまつる土津神社まで、猪苗代の歴史をたどる1日目。2日目は磐梯山の噴火の記憶を伝える記念館から、噴火でできた五色沼を歩き、会津若松の城下へ。旅の足はバスと鉄道です。";

const MEMO_NOGUCHI =
  "猪苗代駅から会津バスで野口英世記念館前へ、降りてすぐです。世界的な細菌学者・野口英世の生家を保存・公開する記念館です。幼名を清作といった英世は、1歳のときに囲炉裏に落ちて左手に大やけどを負い、指が開かなくなりましたが、16歳で受けた手術で指が動くようになったことに心を動かされ、医学の道を志したと伝えられています。生家には、やけどを負ったその囲炉裏が今も残ります。館内では、アメリカのロックフェラー医学研究所での研究や、黄熱病の研究のため向かった西アフリカのガーナで自らもその病に倒れるまでの歩みを、資料や自筆の手紙でたどれます。";

const MEMO_FUNKA =
  "2日目は裏磐梯へ。猪苗代駅から裏磐梯方面のバスでおよそ30分です。明治21年（1888年）7月15日、磐梯山で水蒸気爆発が起こり、北側の峰・小磐梯が大きく崩れ落ちました。岩なだれがふもとの集落をのみこみ、477人が亡くなったとされる大きな災害になりました。このとき川がせき止められて生まれたのが、桧原湖や五色沼など、今の裏磐梯の数多くの湖や沼です。館内では、当時の様子を伝える錦絵や写真、磐梯山の成り立ちについての展示を見ることができます。美しい景色の裏にある大地の歴史と、亡くなった方々のことを思いながら、静かに見学しましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; line?: string; lat: number; lng: number; address: string; memo: string };

const D1: NewSpot[] = [
  {
    name: "会津民俗館", h: 10, m: 15, stay: 40, mode: "walk", dur: 5, lat: 37.535548, lng: 140.075105, address: "福島県耶麻郡猪苗代町",
    memo:
      "野口英世記念館のすぐとなりにある、会津の山あいで受け継がれてきた暮らしを伝える民俗館です。昔ながらの建物や、農具・生活の道具を見て、ふれて、この地方の人々の暮らしぶりを感じることができます。休館日は季節によって変わり、冬は休む日が多くなるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "天鏡閣", h: 11, m: 15, stay: 60, mode: "bus", dur: 20, line: "会津バス（野口英世記念館前→長浜。長浜から徒歩約10分）",
    lat: 37.521121, lng: 140.04359, address: "福島県耶麻郡猪苗代町翁島",
    memo:
      "長浜のバス停から歩いて約10分、猪苗代湖を見下ろす丘に立つ洋館です。明治41年（1908年）、有栖川宮威仁親王の別邸として建てられ、同じ年に滞在した皇太子嘉仁親王（のちの大正天皇）によって「天鏡閣」と名づけられました。八角形の塔屋や正面の車寄せをもつ優雅な建物で、国の重要文化財に指定されています。窓の外には猪苗代湖が広がります。",
  },
  {
    name: "長浜（猪苗代湖）", h: 12, m: 25, stay: 60, mode: "walk", dur: 10, lat: 37.524015, lng: 140.047802, address: "福島県耶麻郡猪苗代町翁島",
    memo:
      "天鏡閣から歩いて約10分、猪苗代湖の北西の湖岸に広がる長浜です。湖の向こうに磐梯山を望む眺めが楽しめ、湖畔には食事のできる店もあるので、ここで昼食にしましょう。晴れた日の湖面は空を映して青く輝きます。湖に入るときや岸辺を歩くときは、足元と天気の変化に気をつけましょう。",
  },
  {
    name: "土津神社", h: 14, m: 5, stay: 50, mode: "bus", dur: 40, line: "会津バス（長浜→猪苗代駅、約9分。駅から徒歩約20分）",
    lat: 37.570801, lng: 140.101326, address: "福島県耶麻郡猪苗代町見祢山",
    memo:
      "バスで猪苗代駅に戻り、歩いて約20分。会津藩の初代藩主・保科正之をまつる神社です。2代将軍徳川秀忠の子として生まれ、会津藩の礎を築いた正之は、磐梯山のふもとのこの地に葬られ、延宝3年（1675年）、その墓所に神社が造営されました。境内は、秋には紅葉が美しいことでも知られます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "亀ヶ城公園", h: 15, m: 10, stay: 40, mode: "walk", dur: 15, lat: 37.562116, lng: 140.100509, address: "福島県耶麻郡猪苗代町古城跡",
    memo:
      "土津神社から歩いて約15分。鎌倉時代のはじめ、建久2年（1191年）にこの地を治めた猪苗代経連が築いたと伝わる猪苗代城の跡を整えた公園です。猪苗代氏代々の居城でしたが、戊辰戦争で建物は焼け落ち、今は石垣や土塁がその面影を伝えています。城跡は福島県の史跡に指定され、春には桜の名所としてにぎわいます。",
  },
  {
    name: "はじまりの美術館", h: 16, m: 0, stay: 40, mode: "walk", dur: 10, lat: 37.563766, lng: 140.108858, address: "福島県耶麻郡猪苗代町新町",
    memo:
      "亀ヶ城公園から歩いて約10分。およそ140年前に建てられた酒蔵「十八間蔵」を改修して、2014年に生まれた小さな美術館です。蔵の空間で、さまざまな人の表現にふれる展覧会が開かれています。展示の入れ替えの期間や休館日があるので、公式の案内で確かめてから訪れましょう。今夜は猪苗代の宿へ。",
  },
];

const D2: NewSpot[] = [
  {
    name: "五色沼自然探勝路", h: 10, m: 10, stay: 90, mode: "walk", dur: 10, lat: 37.652931, lng: 140.087109, address: "福島県耶麻郡北塩原村桧原",
    memo:
      "噴火記念館の近くの五色沼入口から、毘沙門沼・赤沼・みどろ沼・弁天沼・瑠璃沼・青沼・柳沼などをめぐる約3.6kmの散策路を、1時間10分ほどかけて歩きます。これらの沼は、1888年の噴火で川がせき止められてできたもの。噴火のときの地下水に含まれた成分が、沼の水の中で細かな粒になって光を散らすことで、青や緑に見えるといわれます。水辺の草木が赤茶色に染まって見えるのは、水に含まれる鉄分によるものです。入口の裏磐梯ビジターセンターでは、散策の前に沼の成り立ちを知ることができます。遊歩道から外れず、足元に気をつけて歩きましょう。冬は雪に覆われ、スノーシューなどの装備が要るので、公式の案内で確かめてください。",
  },
  {
    name: "七日町通り", h: 13, m: 20, stay: 60, mode: "train", dur: 100, line: "バス（裏磐梯高原駅→猪苗代駅、約40分）・JR磐越西線（猪苗代→会津若松、約30分）",
    lat: 37.501146, lng: 139.918438, address: "福島県会津若松市七日町",
    memo:
      "柳沼のそばの裏磐梯高原駅からバスで猪苗代駅へ戻り、JR磐越西線で会津若松へ。七日町通りは、毎月7のつく日に市が立ったことから名づけられた町で、江戸時代には越後・米沢・日光へ向かう街道が通る、会津の城下の西の玄関口でした。問屋や旅籠が並んでにぎわった通りには、明治から昭和のはじめに建てられた蔵や洋館、木造の商家が今も残り、大正のころを思わせるレトロな町並みを歩けます。手打ちそばや田楽の店も多いので、ここで昼食にしましょう。",
  },
  {
    name: "鶴ヶ城", h: 14, m: 35, stay: 80, mode: "bus", dur: 15, line: "まちなか周遊バス（七日町→鶴ヶ城）",
    lat: 37.487778, lng: 139.929722, address: "福島県会津若松市追手町1-1",
    memo:
      "七日町から周遊バスで鶴ヶ城へ。1384年に蘆名直盛が築いた館が始まりで、文禄2年（1593年）に蒲生氏郷が石垣と天守をもつ本格的な城に改め、町の名を黒川から若松に、城の名を鶴ヶ城としたと伝えられます。幕末の戊辰戦争では、会津藩の人々がこの城にこもって新政府軍と戦いました。明治7年（1874年）に建物はすべて取り壊され、今の天守は1965年に再建されたもの。2011年には、幕末のころと同じ赤瓦にふき替えられています。石垣の上や天守の階段では、足元に気をつけましょう。",
  },
  {
    name: "御薬園", h: 16, m: 15, stay: 30, mode: "walk", dur: 20, lat: 37.491081, lng: 139.943917, address: "福島県会津若松市花春町8-1",
    memo:
      "鶴ヶ城から歩いて約20分。室町時代に蘆名氏がこの地の霊泉のほとりに別荘を建てたのが始まりと伝わる庭園で、国の名勝「会津松平氏庭園」に指定されています。江戸時代には、藩主が人々を病から救おうと薬草園を設け、のちに朝鮮人参の栽培を広めたことが「御薬園」の名の由来です。心の字をかたどったといわれる池をめぐる回遊式の庭で、今も園内では薬草が育てられています。入園できる時間は公式の案内で確かめてください。2日間の旅はここで締めくくりです。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== NOGUCHI_ID || days[1].spots.map((s) => s.id).join() !== FUNKA_ID) throw new Error("既存スポットが想定と違います");

  const day1 = [
    { id: NOGUCHI_ID, data: { visitTime: t(9, 0), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null, lat: 37.536224, lng: 140.073355, memo: MEMO_NOGUCHI } },
    ...D1.map(toCreate),
  ];
  const day2 = [
    { id: FUNKA_ID, data: { visitTime: t(9, 0), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, memo: MEMO_FUNKA } },
    ...D2.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, arr] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === NOGUCHI_ID ? "野口英世記念館(既存)" : "磐梯山噴火記念館(既存)") : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
