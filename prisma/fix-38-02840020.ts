/**
 * #38 02840020（雲場池の水鏡と旧軽井沢。軽井沢の紅葉さんぽ）企画運営の指摘
 * (2026-09-30)。
 * 1) 最後の「軽井沢・プリンスショッピングプラザ」(85分)は買い物施設で、
 *    お店の宣伝・水増しにあたるため撤去。代わりに、軽井沢駅近くの実在スポット
 *    矢ケ崎公園(実在、園内の池と160mの木造橋、浅間山・離山の眺め、OSM way
 *    651168382)を追加。移動は既存のバス(20分、石の教会→軽井沢駅方面)を
 *    そのまま使い、駅から徒歩6分を加えた計26分。
 * 2) ショー記念礼拝堂→旧三笠ホテルの区間が「徒歩10分」表記でtaxiモードに
 *    なっていた点。調べたところ、草軽交通の路線バス(軽井沢⇔草津温泉線)に
 *    「旧軽井沢→聖パウロ教会前→一本松→三笠パーク入口→三笠」という、まさに
 *    この区間を通る停留所があり、後続の白糸の滝行きと同じ路線バスが使える。
 *    taxiをbusに変更、所要時間はバスの停車を考慮して15分に。本数が限られる
 *    旨も明記。
 * 3) 昼食の一言がなかったため、旧三笠ホテル(12:45〜、館内カフェ)に追加。
 * 4) 帰りの一言は、新しい最終スポット矢ケ崎公園に追加(軽井沢駅から)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHOW_MEMO_TO_MIKASA =
  "軽井沢聖パウロカトリック教会から歩いておよそ10分、軽井沢ショー記念礼拝堂に着きます。宣教師アレキサンダー・クロフト・ショーは1886年、この地で初めて避暑を過ごし、軽井沢の気候を「屋根のない病院」と呼んでその価値を広めたことから、「軽井沢の父」と称されています。現在の礼拝堂の原形は1895年に造られ、1922年頃までの増改築を経て今の姿になったとされ、軽井沢で最も古い教会のひとつに数えられています。隣接するショーハウス記念館は、ショーが建てた最初の別荘を1986年に復元したもので、あわせて見学すると当時の避暑生活の雰囲気がより感じられます。今も礼拝が行われている教会ですので、静かに、敬意をもって見学しましょう。続いては、バスでおよそ15分、旧三笠ホテルへ向かいましょう。";

const MIKASA_MEMO =
  "ショー記念礼拝堂から、草軽交通の路線バスでおよそ15分、旧三笠ホテルに着きます(旧軽井沢からは少し距離があるため、バスの利用がおすすめです。本数が限られるので、事前に時刻を確かめましょう)。実業家・山本直良により1906年に開業し、設計・施工ともに日本人の手による純西洋式の木造建築として、「軽井沢の鹿鳴館」とも呼ばれてきました。1980年には国の重要文化財に指定されています。長らく保存修理の工事が行われていましたが、現在は建物を見学できるようになり、館内にはカフェも新設されており、ここで昼食をとるのもおすすめです。明治から昭和にかけて多くの人々を迎えてきた洋館の意匠と、紅葉に染まる庭の木々との対比も見どころのひとつです。歴史の重みを感じながら、ゆっくりと見学してください。続いては、軽井沢を代表するもうひとつの景勝地、白糸の滝へ向かいましょう。";

const ISHINOKYOKAI_MEMO_TO_YAGASAKI =
  "白糸の滝からバスでおよそ18分、星野エリアにある軽井沢高原教会・石の教会に着きます。軽井沢高原教会は、緑に囲まれた三角屋根が印象的な教会で、すぐそばには、建築家ケンドリック・ケロッグが設計した石の教会(内村鑑三記念堂)が建っています。自然の中にこそ祈りの場があるという、明治期のキリスト教思想家・内村鑑三の考えにもとづいて建てられた、曲線を描く石とガラスの独特な建築です。現役の教会で、挙式が行われていることもあるので、静かに、敬意をもって見学してください。周辺にはハルニレテラスなどのお店もあり、星野エリアならではの散策を楽しめます。続いては、バスと徒歩であわせておよそ26分、矢ケ崎公園へ向かいましょう。";

const YAGASAKI_MEMO =
  "軽井沢高原教会・石の教会から、バスで軽井沢駅方面へおよそ20分、そこから歩いておよそ6分、矢ケ崎公園に着きます。園内中央には大きな池があり、160mの木造の橋が架かっていて、晴れた日には浅間山と離山の両方を望むことができます。紅葉の季節には、色づいた木々が水面に映り込み、雲場池とはまた違った水鏡の景色を楽しめます。散策やランニング、子供の遊び場としても親しまれている、地元の人々にとっても身近な公園です。池のまわりをゆっくりと歩いて、1日の締めくくりのひとときをお過ごしください。雲場池の水鏡から旧軽井沢の教会建築、白糸の滝の清流まで、軽井沢の紅葉と歴史を巡る1日は、ここで終了です。お疲れさまでした。お帰りは、JR軽井沢駅からご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '02840020%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "869112bd-6875-4088-b52e-a3d10f61357a", data: {} }, // 雲場池
    { id: "bca955b7-5718-473b-82e5-ceb3a929f0e5", data: {} }, // 旧軽井沢銀座通り
    { id: "cd0ac62b-c769-4d74-81c7-04e502febfcb", data: {} }, // 軽井沢聖パウロカトリック教会
    {
      id: "df053535-f5d1-4986-bd50-d3b5b9ac0ee7", // 軽井沢ショー記念礼拝堂
      data: { memo: SHOW_MEMO_TO_MIKASA },
    },
    {
      id: "3521fabd-3825-4faf-ae56-6bc15075d866", // 旧三笠ホテル
      data: { memo: MIKASA_MEMO, visitTime: t(12, 45), transitMode: "bus", transitDurationMin: 15 },
    },
    {
      id: "ed0c5873-cd2c-4407-8eb0-3c520fb20862", // 白糸の滝
      data: { visitTime: t(13, 40) },
    },
    {
      id: "778b4a43-dc06-4652-abd8-00f9c231cf96", // 軽井沢高原教会・石の教会
      data: { memo: ISHINOKYOKAI_MEMO_TO_YAGASAKI, visitTime: t(14, 38) },
    },
    {
      create: {
        name: "矢ケ崎公園",
        address: "長野県北佐久郡軽井沢町軽井沢東",
        lat: 36.3449814,
        lng: 138.6375599,
        memo: YAGASAKI_MEMO,
        visitTime: t(15, 44),
        stayDurationMin: 50,
        transitMode: "bus",
        transitDurationMin: 26,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "869112bd-6875-4088-b52e-a3d10f61357a": 45,
    "bca955b7-5718-473b-82e5-ceb3a929f0e5": 60,
    "cd0ac62b-c769-4d74-81c7-04e502febfcb": 20,
    "df053535-f5d1-4986-bd50-d3b5b9ac0ee7": 20,
    "3521fabd-3825-4faf-ae56-6bc15075d866": 40,
    "ed0c5873-cd2c-4407-8eb0-3c520fb20862": 40,
    "778b4a43-dc06-4652-abd8-00f9c231cf96": 40,
  };
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { remove: ["3e189936-60fb-481b-a85b-c2e9076f2d1f"], tx }); // 軽井沢・プリンスショッピングプラザ を削除
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
