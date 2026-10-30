/**
 * #100 酒蔵めぐりと飛騨高山まちの博物館、大人の高山グルメ1泊2日 の初日・最終日の見直し。
 *
 * 初日: 1か所目が09:00と早すぎたので、入口(JR高山駅、徒歩実測6分)から組み直し、
 * 10:45開始・16:50終了に(10:45〜11:45・16:30〜17:00の範囲)。歩きの区間は
 * routing.openstreetmap.de/routed-foot の道のり(m)÷75m/分で測り直した。
 *
 * 飛騨高山まちの博物館の座標に大きな誤りを発見(逆引きすると、実際の博物館から約900m
 * 離れた高山駅前の道路上の点だった)。正しい点(node2702169062、amenity=community_centre)
 * に直したところ、前後の移動も変わった(飛騨国分寺→まちの博物館3→13分。まちの博物館→
 * 陣屋は偶然もとと同じ7分)。高山祭屋台会館・飛驒高山美術館の座標も、より正確なOSMの点に
 * 細かく直した(各30〜55m)。
 *
 * 2日目(1泊2日の最終日): 屋台会館→飛騨の里の移動(もとは「まちなかに戻って昼食をとった
 * のち、さるぼぼバスで25分ほど」を80分の一つの値にまとめていた)を分け、まちなかに
 * 「高山のまちなかで昼食」のスポットを足した(点は高山濃飛バスターミナル、
 * node4485247589、お店でない名前の点)。バスは、企画運営がYahoo!乗換案内で
 * 2026-11-02 14:00発・飛騨の里14:13着(さるぼぼバス、乗車9分+徒歩2分)を確認
 * (https://transit.yahoo.co.jp/search/result?from=高山濃飛バスセンター&to=飛騨の里&y=2026&m=11&d=02&hh=13&m1=5&m2=0&type=1)。
 * 便の名前は書かず「バスで約13分」とし、本数が限られるため公式の案内で確かめる一文を添えた。
 *
 * 言葉づかい: 「〜てみてください」(飛騨国分寺・まちの博物館・東山遊歩道・宮川朝市)、
 * 「お休みください」(東山遊歩道、宿の一文を標準の形に)、「〜楽しんでください」
 * 「とるとよいでしょう」「食べ歩きグルメ」(さんまち)、「確かめてください」(宮川朝市)を直した。
 *
 * 法務の確認(2026-10-30)で見つかった、見直し範囲外だが決まり違反の直し:
 * ・飛驒高山美術館の終わりの一文にあったブランド名「さるぼぼバス」を削除。
 * ・日枝神社(2日目1か所目)に、宿からの行き方・分数がなかった(決まり71)。高山駅を
 *   宿の目安として、高山駅→日枝神社のrouted-foot実測(約1710m)から「歩いて約23分」を追加。
 * ・飛騨国分寺・日枝神社・桜山八幡宮の祈りの一文が「静かに、敬意をもってお参りください。」
 *   のみで、決まりの「今も祈りが続く場所ですので、」が欠けていたため追加(お参りください、は
 *   10/29決定により直さない)。
 *
 * 座標の出所(法務依頼によるOSM確認、2026-10-30、逆ジオコーディング/Nominatim名称検索):
 * ・まちの博物館: node2702169062(name=飛騨高山まちの博物館)
 * ・屋台会館: way490918179(name=高山屋台会館)
 * ・飛驒高山美術館: node1421002671(name=飛驒高山美術館)
 * ・昼食(新規): node4485247589(name=Takayama Nohi Bus Centre)
 * ・飛騨の里(今回変更なし): way585276392(name=飛騨の里)と現在値が一致、問題なし。
 * ・さんまち(今回変更なし): node4341705794(name=Takayama Old Town, Sanmachi Suji)と一致、問題なし。
 * ・東山遊歩道(今回変更なし): 法務がOSM生API(api.openstreetmap.org/api/0.6/map)で確認。
 *   メモにある素玄寺の点(way549685455、Nominatim 36.143874,137.265353)と現在値が
 *   完全に一致しているため、直す必要なし。
 * ・城山公園(今回変更なし): OSM生API(bbox=137.260,36.134/137.269,36.141)で確認したところ、
 *   メモにある「金森長近の騎馬像」など名前のある物の点はOSMに存在しない(町名の点・店・宿の
 *   点のみ)。地理院の地名検索でも「高山城跡」(岐阜県高山市)は該当なし(他県の同名の城跡のみ)。
 *   現在値はway61933558「城山公園」自体の代表点で、最も近い遊歩道(highway=footway)ノードまで
 *   約25m。企画運営・法務により、#21リトルワールドと同じ「名前のある点がない場所の1件ずつの
 *   例外」として承認済み(2026-10-30)。チェックリストのメモに記録する。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-100-581607ca.ts
 *   反映: npm run prod -- npx tsx prisma/fix-100-581607ca.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const KOKUBUNJI_ID = "94423c06-3725-4d1a-abe9-ae0d0ec0510a";
const MACHIHAKU_ID = "37ecce1e-a2cc-472b-8adf-eb9d43fc8d78";
const JINYA_ID = "59e15e9f-796e-48bb-ab43-62514dfefc5e";
const SHISEIKINENKAN_ID = "1e10daba-321b-4547-a60b-ecdf86862848";
const NAKABASHI_ID = "3a0543c5-ac94-4f89-8ab1-a210ed3e9771";
const SANMACHI_ID = "f7a1fad1-2801-436d-8ed8-1980825c5668";
const SHIROYAMAKOEN_ID = "7c11abdf-7146-473c-8d74-10231c4546fb";
const HIGASHIYAMA_ID = "50bc713e-ca52-4fbe-a33b-0b856e3a2121";

const DAY2_ID = "4a339bda-3a0f-414e-a62f-d51b81930b84";
const HIEJINJA_ID = "0648be8f-885d-4a01-b9a9-425ebceb909a";
const MIYAGAWA_ID = "177f7ed5-a7a4-449a-9b40-f9b5167811e3";
const KUSAKABE_ID = "58761624-f175-48bd-9c8e-8bc00694319b";
const YOSHIJIMA_ID = "53715680-d5df-4fae-b942-e29b5293b7da";
const SAKURAYAMA_ID = "48891e2b-8b5c-4476-8c1d-57c750579908";
const YATAIKAIKAN_ID = "2bedbc95-e9b3-426c-9303-5d32f83ec312";
const HIDANOSATO_ID = "c3b152c2-9775-4cca-ac82-3d9172b1ad63";
const BIJUTSUKAN_ID = "4312d87f-4704-419f-b5f1-02180f297aab";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const VISIT_TIMES: { id: string; h: number; m: number }[] = [
  { id: KOKUBUNJI_ID, h: 10, m: 45 },
  { id: MACHIHAKU_ID, h: 11, m: 19 },
  { id: JINYA_ID, h: 12, m: 4 },
  { id: SHISEIKINENKAN_ID, h: 12, m: 52 },
  { id: NAKABASHI_ID, h: 13, m: 8 },
  { id: SANMACHI_ID, h: 13, m: 20 },
  { id: SHIROYAMAKOEN_ID, h: 15, m: 8 },
  { id: HIGASHIYAMA_ID, h: 16, m: 10 },
  { id: HIEJINJA_ID, h: 8, m: 30 },
  { id: MIYAGAWA_ID, h: 9, m: 16 },
  { id: KUSAKABE_ID, h: 10, m: 5 },
  { id: YOSHIJIMA_ID, h: 10, m: 51 },
  { id: SAKURAYAMA_ID, h: 11, m: 36 },
  { id: YATAIKAIKAN_ID, h: 12, m: 2 },
  { id: HIDANOSATO_ID, h: 14, m: 15 },
  { id: BIJUTSUKAN_ID, h: 15, m: 48 },
];

const STAY_UPDATES: { id: string; label: string; min: number }[] = [
  { id: KOKUBUNJI_ID, label: "飛騨国分寺", min: 21 },
  { id: MACHIHAKU_ID, label: "まちの博物館", min: 38 },
  { id: JINYA_ID, label: "高山陣屋", min: 45 },
  { id: SHISEIKINENKAN_ID, label: "市政記念館", min: 15 },
  { id: SANMACHI_ID, label: "さんまち", min: 95 },
  { id: SHIROYAMAKOEN_ID, label: "城山公園", min: 45 },
  { id: HIGASHIYAMA_ID, label: "東山遊歩道", min: 40 },
  { id: MIYAGAWA_ID, label: "宮川朝市", min: 45 },
  { id: KUSAKABE_ID, label: "日下部民藝館", min: 45 },
  { id: YATAIKAIKAN_ID, label: "高山祭屋台会館", min: 50 },
];

const COORD_UPDATES: { id: string; label: string; lat: number; lng: number }[] = [
  { id: MACHIHAKU_ID, label: "飛騨高山まちの博物館", lat: 36.142156, lng: 137.261282 },
  { id: YATAIKAIKAN_ID, label: "高山祭屋台会館", lat: 36.148418, lng: 137.260099 },
  { id: BIJUTSUKAN_ID, label: "飛驒高山美術館", lat: 36.136936, lng: 137.240937 },
];

const LEG_UPDATES: { spotId: string; label: string; min: number }[] = [
  { spotId: MACHIHAKU_ID, label: "飛騨国分寺→まちの博物館", min: 13 },
  { spotId: SHIROYAMAKOEN_ID, label: "さんまち→城山公園", min: 13 },
  { spotId: HIGASHIYAMA_ID, label: "城山公園→東山遊歩道", min: 17 },
  { spotId: MIYAGAWA_ID, label: "日枝神社→宮川朝市", min: 21 },
  { spotId: KUSAKABE_ID, label: "宮川朝市→日下部", min: 4 },
  { spotId: SAKURAYAMA_ID, label: "吉島家→桜山八幡宮", min: 5 },
  { spotId: BIJUTSUKAN_ID, label: "飛騨の里→美術館", min: 13 },
];

const LUNCH_MEMO =
  "高山祭屋台会館から歩いて約19分、高山濃飛バスターミナルの周辺に着きます。食事処が多く、飛騨牛料理など高山ならではの味も楽しめるので、ここで昼食にしましょう。見学を終えたら、バスで飛騨の里へ向かいましょう(あわせて約13分)。バスの本数は限られるので、時刻を公式の案内で確かめましょう。";

const MEMO_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: KOKUBUNJI_ID,
    label: "飛騨国分寺(入口・言葉づかい)",
    find: "この旅で最初に立ち寄るのは飛騨国分寺です。",
    replace: "JR高山駅に10時40分ごろ着いたら、歩いて約6分。この旅で最初に立ち寄るのは飛騨国分寺です。",
  },
  {
    id: KOKUBUNJI_ID,
    label: "飛騨国分寺(言葉づかい)",
    find: "まちなかの散策を始める前に、静かな境内で心を落ち着けてみてください。",
    replace: "まちなかの散策を始める前に、静かな境内で心を落ち着けましょう。",
  },
  {
    id: MACHIHAKU_ID,
    label: "まちの博物館(書き出し・言葉づかい)",
    find: "飛騨国分寺からは歩いて3分ほどです。明治8年(1875)に建てられた",
    replace: "飛騨国分寺からは歩いて13分ほどです。明治8年(1875)に建てられた",
  },
  {
    id: MACHIHAKU_ID,
    label: "まちの博物館(言葉づかい)",
    find: "まち歩きの前に立ち寄って、高山の歴史の予習をしてみてください。",
    replace: "まち歩きの前に立ち寄って、高山の歴史の予習をしてみましょう。",
  },
  {
    id: SANMACHI_ID,
    label: "さんまち(言葉づかい・食べ歩き・昼食)",
    find: "あわせて、飛騨牛の握りや串焼きといった、食べ歩きグルメも充実しており、昼食もこのあたりでとるとよいでしょう。",
    replace: "あわせて、飛騨牛の握りや串焼きを味わえる食事処も充実しており、このあたりで昼食にしましょう。",
  },
  {
    id: SANMACHI_ID,
    label: "さんまち(言葉づかい)",
    find: "木造・切妻屋根の町家が織りなす、江戸時代さながらの風情のなかで、大人ならではの高山グルメを楽しんでください。",
    replace: "木造・切妻屋根の町家が織りなす、江戸時代さながらの風情のなかで、大人ならではの高山グルメを楽しみましょう。",
  },
  {
    id: SHIROYAMAKOEN_ID,
    label: "城山公園(書き出し)",
    find: "古い町並みからは歩いて7分ほどです。",
    replace: "古い町並みからは歩いて13分ほどです。",
  },
  {
    id: HIGASHIYAMA_ID,
    label: "東山遊歩道(書き出し・言葉づかい・宿)",
    find: "城山公園からは歩いて9分ほどです。",
    replace: "城山公園からは歩いて17分ほどです。",
  },
  {
    id: HIGASHIYAMA_ID,
    label: "東山遊歩道(言葉づかい2)",
    find: "山門など、静かな門前をたどりながら歩いてみてください。",
    replace: "山門など、静かな門前をたどりながら歩いてみましょう。",
  },
  {
    id: HIGASHIYAMA_ID,
    label: "東山遊歩道(宿の一文)",
    find: "今夜は高山の宿でゆっくりお休みください。",
    replace: "この夜は、高山の宿に泊まりましょう。",
  },
  {
    id: MIYAGAWA_ID,
    label: "宮川朝市(書き出し・言葉づかい)",
    find: "日枝神社からは歩いて17分ほどです。",
    replace: "日枝神社からは歩いて21分ほどです。",
  },
  {
    id: MIYAGAWA_ID,
    label: "宮川朝市(言葉づかい2)",
    find: "地元の人との会話を楽しみつつそぞろ歩いてみてください。",
    replace: "地元の人との会話を楽しみつつそぞろ歩いてみましょう。",
  },
  {
    id: MIYAGAWA_ID,
    label: "宮川朝市(言葉づかい3)",
    find: "開催時刻は季節によって変わりますので、お出かけ前に確かめてください。",
    replace: "開催時刻は季節によって変わりますので、お出かけ前に確かめましょう。",
  },
  {
    id: KUSAKABE_ID,
    label: "日下部(書き出し)",
    find: "宮川朝市からは歩いて3分ほどです。",
    replace: "宮川朝市からは歩いて4分ほどです。",
  },
  {
    id: SAKURAYAMA_ID,
    label: "桜山八幡宮(書き出し)",
    find: "吉島家住宅からは歩いて3分ほどです。",
    replace: "吉島家住宅からは歩いて5分ほどです。",
  },
  {
    id: YATAIKAIKAN_ID,
    label: "屋台会館(終わりの一文)",
    find: "高山祭の屋台行事は、国の重要無形民俗文化財に指定されています。",
    replace: "高山祭の屋台行事は、国の重要無形民俗文化財に指定されています。見学を終えたら、歩いておよそ19分の高山濃飛バスターミナルへ。まちなかで昼食をとりましょう。",
  },
  {
    id: HIDANOSATO_ID,
    label: "飛騨の里(書き出し)",
    find: "高山祭屋台会館からは、まちなかに戻って昼食をとったのち、さるぼぼバスで25分ほどです。",
    replace: "高山のまちなかからバスで約13分です。",
  },
  {
    id: BIJUTSUKAN_ID,
    label: "飛驒高山美術館(書き出し)",
    find: "飛騨の里からは歩いて10分ほどです。",
    replace: "飛騨の里からは歩いて13分ほどです。",
  },
  {
    id: BIJUTSUKAN_ID,
    label: "飛驒高山美術館(終わりの一文、ブランド名を消し、タクシーの分数を入れる)",
    find: "ゆっくりと鑑賞を楽しんだら、帰りはさるぼぼバスで高山駅へ向かいましょう。",
    replace:
      "ゆっくりと鑑賞を楽しんだら、タクシーでおよそ8分の高山駅へ向かいましょう。この区間は、タクシーを使うと便利です。",
  },
  {
    id: HIEJINJA_ID,
    label: "日枝神社(2日目の書き出し。決まり71。宿からの行き方)",
    find: "2日目の朝は、日枝神社から始めます。",
    replace: "高山のまちなかの宿を出て、歩いて約23分、日枝神社から2日目を始めます。",
  },
  {
    id: KOKUBUNJI_ID,
    label: "飛騨国分寺(祈りの一文、決まりの形に)",
    find: "静かに、敬意をもってお参りください。",
    replace: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    id: HIEJINJA_ID,
    label: "日枝神社(祈りの一文、決まりの形に)",
    find: "静かに、敬意をもってお参りください。",
    replace: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    id: SAKURAYAMA_ID,
    label: "桜山八幡宮(祈りの一文、決まりの形に)",
    find: "静かに、敬意をもってお参りください。",
    replace: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
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

  console.log("=== #100 初日・最終日の見直し ===\n");
  console.log("[時刻]");
  for (const v of VISIT_TIMES) {
    console.log(`  ${v.id} => ${String(v.h).padStart(2, "0")}:${String(v.m).padStart(2, "0")}`);
  }
  console.log("\n[滞在(分)]");
  for (const s of STAY_UPDATES) {
    console.log(`  ${s.label}: ${s.min}分`);
  }
  console.log("  高山のまちなかで昼食(新規): 45分");
  console.log("\n[座標]");
  for (const c of COORD_UPDATES) {
    console.log(`  ${c.label}: ${c.lat},${c.lng}`);
  }
  console.log("  高山のまちなかで昼食(新規、高山濃飛バスターミナル): 36.142056,137.251476");
  console.log("\n[移動(分)]");
  for (const l of LEG_UPDATES) {
    console.log(`  ${l.label}: ${l.min}分`);
  }
  console.log("  屋台会館→昼食: 19分");
  console.log("  昼食→飛騨の里: 19分(待ち+バス9分+徒歩2分)");
  console.log("\n[メモ]");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 70));
    console.log();
  }

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      for (const v of VISIT_TIMES) {
        await tx.spot.update({ where: { id: v.id }, data: { visitTime: t(v.h, v.m) } });
      }
      for (const s of STAY_UPDATES) {
        await tx.spot.update({ where: { id: s.id }, data: { stayDurationMin: s.min } });
      }
      for (const c of COORD_UPDATES) {
        await tx.spot.update({ where: { id: c.id }, data: { lat: c.lat, lng: c.lng } });
      }
      for (const l of LEG_UPDATES) {
        await tx.spotTransitLeg.updateMany({ where: { spotId: l.spotId }, data: { transitDurationMin: l.min } });
      }
      for (const id of ids) {
        await tx.spot.update({ where: { id }, data: { memo: memoById.get(id)! } });
      }

      // 2日目: 屋台会館と飛騨の里の間に昼食スポットを差し込む
      await setDaySpotOrder(
        DAY2_ID,
        [
          { id: HIEJINJA_ID, data: {} },
          { id: MIYAGAWA_ID, data: {} },
          { id: KUSAKABE_ID, data: {} },
          { id: YOSHIJIMA_ID, data: {} },
          { id: SAKURAYAMA_ID, data: {} },
          { id: YATAIKAIKAN_ID, data: {} },
          {
            create: {
              name: "高山のまちなかで昼食",
              lat: 36.142056,
              lng: 137.251476,
              visitTime: t(13, 11),
              stayDurationMin: 45,
              memo: LUNCH_MEMO,
              transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 19 }] },
            },
          },
          {
            id: HIDANOSATO_ID,
            data: { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 19 }] } },
          },
          { id: BIJUTSUKAN_ID, data: {} },
        ],
        { tx }
      );
    },
    { timeout: 60000 }
  );

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
