/**
 * 近江八幡(承認待ち、c11e9dff)への直し。法務の指摘・企画運営の決定(2026-11-02)を反映する。
 *
 * ①ラコリーナ近江八幡(菓子の会社の店。店・会社の名前を書かない決まりに当たる)を外し、
 *   水郷めぐりの舟の乗り場(amenity=ferry_terminal node5588287888、
 *   35.1462292,136.0935614)に置きかえる(行き先名「西の湖(水郷めぐり)」)。西の湖が
 *   琵琶湖最大の内湖・近畿地方で最大級のヨシ原(およそ109ha)・ラムサール条約登録湿地
 *   であることは、同じ文に「とされる」のぼかしを入れた。出典: 滋賀県庁
 *   (pref.shiga.lg.jp/ippan/kankyoshizen/biwako/329126.html「西の湖は近江八幡市に
 *   位置する琵琶湖最大の内湖であり、ヨシ群落は近畿地方で最大級の109haに及びます」)、
 *   文化庁(重要文化的景観)。舟に乗る時間(およそ60〜80分)は、近江八幡市公式観光サイト
 *   (omi8.com/stories/suigo「乗船時間は、水郷めぐりは60分～80分」)で確認し、滞在90分
 *   の根拠にした。文では「乗り場から舟で」の形にし、運航する協同組合の名前は書かない
 *   (v3: 最初の西の湖の点35.1591562,136.1137732はNominatimの面(湖水)の中心で、
 *   水の上だったため、法務の指摘で直した)
 *   (v4: いったん岸の「よしの大龍神」(node5587219014)に置きかえたが、そこから
 *   乗り場までrouted-footでおよそ23分(1738m)あり、「舟に乗る」行為の場所と点が
 *   大きく離れてしまうため、企画運営の決定で乗り場そのものを点にする形(B案)に
 *   直した。乗り場の名前が運営する協同組合の名前のため、文には書かない)
 * ②新しいエリア「近江八幡」は作らず、横手と同じく滋賀県だけに入れる(企画運営の決定)。
 *   エリア「近江八幡」は、このしおりから外すだけにする(エリア本体の削除は本番データの
 *   削除にあたるため、企画運営がユーザーの了承をもらってから別に行う)
 * ③会社の名前「近江鉄道バス」→「バス」に
 * ④「歩いてすぐ」→「歩いておよそ1分」(新町通りの終わり・旧西川家住宅の書き出し)
 * ⑤新町通りの写真が八幡堀と同じ元画像(File:Hachimanbori07s3200.jpg)だったため削除
 *   (ほかの5か所の写真は残るので、表紙を含め3枚以上の目標は変わらず達成)
 * ⑥旧八幡郵便局「現在はギャラリーとして公開されています」→公開日が限られる施設のため、
 *   「ギャラリーなどに使われています。公開日は公式の案内で確かめましょう」の形に
 *
 * 7章の例外(企画運営の決定2026-11-02): スポット名「西の湖(水郷めぐり)」の点を、
 * 水郷めぐりの舟の乗り場(node5588287888)にする。西の湖自体はOSMの面(湖水)の中心しか
 * 点がなく水の上になり、ほかに名前のある乗り場も見当たらなかったため(一覧
 * docs/content/20261102-daytrip-coord-scan.mdに記録)。
 *
 * ①で浮いた時間の組み直し: 始まりを09:00→09:19に変更(日帰りの範囲8:30〜9:30の中)。
 * 旧八幡郵便局→乗り場はタクシー(OSRM車2.2分+5=8分)。乗り場の滞在は90分(舟に乗る
 * 時間60〜80分を含む、出典どおり)。終わりは16:30(日帰りの発車16:30〜17:00の中)。
 * 帰りはタクシーでおよそ10分(OSRM車4.3分+5)の近江八幡駅へ
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "c11e9dff-0397-486c-b42e-49c3d3b6924c";
const OMIHACHIMAN_AREA_ID = "60c4a8cd-5e5b-4a3a-97c9-defded9194ed";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const HIMUREI = "日牟禮八幡宮";
const KAWARA = "近江八幡市立かわらミュージアム";
const ROPEWAY = "八幡山ロープウェー";
const HACHIMANBORI = "八幡堀";
const SHINMACHI = "新町通り";
const NISHIKAWA = "近江八幡市立資料館(旧西川家住宅)";
const YUBINKYOKU = "旧八幡郵便局";
const RAKORINA = "ラコリーナ近江八幡";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const himurei = await prisma.spot.findFirstOrThrow({ where: { name: HIMUREI, day: { itineraryId: ITIN_ID } } });
  const kawara = await prisma.spot.findFirstOrThrow({ where: { name: KAWARA, day: { itineraryId: ITIN_ID } } });
  const ropeway = await prisma.spot.findFirstOrThrow({ where: { name: ROPEWAY, day: { itineraryId: ITIN_ID } } });
  const hachimanbori = await prisma.spot.findFirstOrThrow({ where: { name: HACHIMANBORI, day: { itineraryId: ITIN_ID } } });
  const shinmachi = await prisma.spot.findFirstOrThrow({ where: { name: SHINMACHI, day: { itineraryId: ITIN_ID } }, include: { photos: true } });
  const nishikawa = await prisma.spot.findFirstOrThrow({ where: { name: NISHIKAWA, day: { itineraryId: ITIN_ID } } });
  const yubinkyoku = await prisma.spot.findFirstOrThrow({ where: { name: YUBINKYOKU, day: { itineraryId: ITIN_ID } } });
  const rakorina = await prisma.spot.findFirstOrThrow({ where: { name: RAKORINA, day: { itineraryId: ITIN_ID } } });

  const omiArea = await prisma.area.findUniqueOrThrow({ where: { id: OMIHACHIMAN_AREA_ID } });
  const otherUsage = await prisma.itineraryArea.count({ where: { areaId: OMIHACHIMAN_AREA_ID, itineraryId: { not: ITIN_ID } } });
  if (otherUsage > 0) throw new Error(`エリア「${omiArea.name}」はほかの${otherUsage}本でも使われているため削除できません`);

  const HIMUREI_MEMO_OLD =
    "JR近江八幡駅から近江鉄道バスでおよそ10分、日牟禮八幡宮に着きます。持統天皇5年(691)にこの地を訪れた藤原不比等が、その風光を愛でて和歌を詠んだことから、「比牟禮社」と名を改めたという言い伝えが残る古社です。古くから近江商人の信仰を集め、毎年3月の左義長まつりと4月の八幡まつりは、ともに国の選択無形民俗文化財となっています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分、近江八幡市立かわらミュージアムへ向かいましょう。";
  const HIMUREI_MEMO_NEW =
    "JR近江八幡駅からバスでおよそ10分、日牟禮八幡宮に着きます。持統天皇5年(691)にこの地を訪れた藤原不比等が、その風光を愛でて和歌を詠んだことから、「比牟禮社」と名を改めたという言い伝えが残る古社です。古くから近江商人の信仰を集め、毎年3月の左義長まつりと4月の八幡まつりは、ともに国の選択無形民俗文化財となっています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分、近江八幡市立かわらミュージアムへ向かいましょう。";
  if (himurei.memo !== HIMUREI_MEMO_OLD) throw new Error("日牟禮八幡宮: memo現在値が期待と不一致");

  const SHINMACHI_MEMO_OLD =
    "八幡堀から歩いておよそ2分、新町通りに着きます。豊臣秀次が天正13年(1585)に八幡山城の城下町を整えた際に区画されたと伝えられる通りで、白壁と格子戸が続く近江商人の本宅が軒を連ねています。平成3年(1991)、国の重要伝統的建造物群保存地区に選定されました。食事ができる店も並んでいるので、ここで昼食にしましょう。この後は、歩いてすぐ、近江八幡市立資料館(旧西川家住宅)へ向かいましょう。";
  const SHINMACHI_MEMO_NEW =
    "八幡堀から歩いておよそ2分、新町通りに着きます。豊臣秀次が天正13年(1585)に八幡山城の城下町を整えた際に区画されたと伝えられる通りで、白壁と格子戸が続く近江商人の本宅が軒を連ねています。平成3年(1991)、国の重要伝統的建造物群保存地区に選定されました。食事ができる店も並んでいるので、ここで昼食にしましょう。この後は、歩いておよそ1分、近江八幡市立資料館(旧西川家住宅)へ向かいましょう。";
  if (shinmachi.memo !== SHINMACHI_MEMO_OLD) throw new Error("新町通り: memo現在値が期待と不一致");

  const NISHIKAWA_MEMO_OLD =
    "新町通りから歩いてすぐ、近江八幡市立資料館の一つ、旧西川家住宅に着きます。近江商人として活躍した西川利右衛門家の住まいで、3代目の西川利右衛門が宝永3年(1706)に建てたと伝えられ、国の重要文化財に指定されています。帳場や中庭、土蔵など、近江商人の暮らしと商いの様子を間近に見ることができます。この後は、歩いておよそ5分、旧八幡郵便局へ向かいましょう。";
  const NISHIKAWA_MEMO_NEW =
    "新町通りから歩いておよそ1分、近江八幡市立資料館の一つ、旧西川家住宅に着きます。近江商人として活躍した西川利右衛門家の住まいで、3代目の西川利右衛門が宝永3年(1706)に建てたと伝えられ、国の重要文化財に指定されています。帳場や中庭、土蔵など、近江商人の暮らしと商いの様子を間近に見ることができます。この後は、歩いておよそ5分、旧八幡郵便局へ向かいましょう。";
  if (nishikawa.memo !== NISHIKAWA_MEMO_OLD) throw new Error("旧西川家住宅: memo現在値が期待と不一致");

  const YUBINKYOKU_MEMO_OLD =
    "旧西川家住宅から歩いておよそ5分、旧八幡郵便局に着きます。近江八幡を拠点に活動したアメリカ出身の建築家・ヴォーリズが設計し、大正10年(1921)に完成した建物です。和風とスペイン風のコロニアル様式を組み合わせた意匠が特徴で、郵便局としての役目を終えたあと、取り壊された玄関部分は、地元のNPO法人の手で復元されました。現在はギャラリーとして公開されています。この後は、歩いておよそ21分、ラコリーナ近江八幡へ向かいましょう。";
  const YUBINKYOKU_MEMO_NEW =
    "旧西川家住宅から歩いておよそ5分、旧八幡郵便局に着きます。近江八幡を拠点に活動したアメリカ出身の建築家・ヴォーリズが設計し、大正10年(1921)に完成した建物です。和風とスペイン風のコロニアル様式を組み合わせた意匠が特徴で、郵便局としての役目を終えたあと、取り壊された玄関部分は、地元のNPO法人の手で復元されました。現在はギャラリーなどに使われています。公開日は公式の案内で確かめましょう。この後は、タクシーでおよそ8分、西の湖(水郷めぐり)へ向かいましょう。";
  if (yubinkyoku.memo !== YUBINKYOKU_MEMO_OLD) throw new Error("旧八幡郵便局: memo現在値が期待と不一致");

  const NISHINOKO_MEMO_NEW =
    "旧八幡郵便局からタクシーでおよそ8分、水郷めぐりの舟の乗り場に着きます。この乗り場から舟に乗り、西の湖に広がるヨシ原の間を進む水路からの眺めを楽しみましょう。西の湖は、琵琶湖で最大とされる内湖で、近畿地方でも最大級とされるおよそ109haのヨシ原が広がり、ラムサール条約の登録湿地にもなっています。八幡堀と同じく、文化庁の重要文化的景観「近江八幡の水郷」の一部です。舟に乗る時間は、およそ60分から80分です。乗船には予約が必要な場合があるので、訪れる前に確認しましょう。旅の締めくくりに、近江八幡らしい水辺の景色をゆっくり眺めましょう。見学を終えたら、タクシーでおよそ10分の近江八幡駅へ戻り、帰路につきましょう。";

  console.log(`\n[日牟禮八幡宮]\n旧: ${HIMUREI_MEMO_OLD}\n新: ${HIMUREI_MEMO_NEW}`);
  console.log(`\n[新町通り]\n旧: ${SHINMACHI_MEMO_OLD}\n新: ${SHINMACHI_MEMO_NEW}`);
  console.log(`\n[近江八幡市立資料館(旧西川家住宅)]\n旧: ${NISHIKAWA_MEMO_OLD}\n新: ${NISHIKAWA_MEMO_NEW}`);
  console.log(`\n[旧八幡郵便局]\n旧: ${YUBINKYOKU_MEMO_OLD}\n新: ${YUBINKYOKU_MEMO_NEW}`);
  console.log(`\n[ラコリーナ近江八幡]\n削除(会社の店のため)`);
  console.log(`\n[西の湖(水郷めぐり、新規)]\n新: ${NISHINOKO_MEMO_NEW}`);
  console.log(`\n[新町通りの写真]\n削除(八幡堀と同じ元画像のため)`);
  console.log(`\n[エリア]\n「近江八幡」エリアをしおりから外す(削除は行わない。使用数1→0を確認済みだが、削除はユーザーの了承後に別に行う)`);

  console.log("\n[書き込む内容(点・時刻・滞在・区間)、1か所ずつ]");
  console.log(`日牟禮八幡宮: 時刻09:00→09:19 / 滞在30分(変更なし)`);
  console.log(`かわらミュージアム: 時刻09:34→09:53 / 滞在40分(変更なし) / incoming walk4分(変更なし)`);
  console.log(`八幡山ロープウェー: 時刻10:23→10:42 / 滞在90分(変更なし) / incoming walk9分(変更なし)`);
  console.log(`八幡堀: 時刻12:05→12:24 / 滞在35分(変更なし) / incoming walk12分(変更なし)`);
  console.log(`新町通り: 時刻12:42→13:01 / 滞在40分(変更なし) / incoming walk2分(変更なし)`);
  console.log(`旧西川家住宅: 時刻13:23→13:42 / 滞在35分(変更なし) / incoming walk1分(もと"すぐ")`);
  console.log(`旧八幡郵便局: 時刻14:03→14:22 / 滞在30分(変更なし) / incoming walk5分(変更なし)`);
  console.log(`西の湖(水郷めぐりの乗り場、新規): 時刻15:00 / 滞在90分 / incoming taxi8分(OSRM2.2分+5)`);
  console.log("終わり: 15:00+90分=16:30（日帰りの発車16:30〜17:00の中）。帰りはタクシーでおよそ10分(OSRM4.3分+5)の近江八幡駅");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = himurei.dayId;

  await prisma.$transaction(async (tx) => {
    // エリアのリンクを外す(エリア本体の削除はリンクを外したあとに行う)
    await tx.itineraryArea.deleteMany({ where: { itineraryId: ITIN_ID, areaId: OMIHACHIMAN_AREA_ID } });
    // 新町通りの写真(八幡堀と同じ元画像)を削除
    for (const p of shinmachi.photos) await tx.photo.delete({ where: { id: p.id } });

    await setDaySpotOrder(
      dayId,
      [
        { id: himurei.id, data: { memo: HIMUREI_MEMO_NEW, visitTime: t(9, 19) } },
        { id: kawara.id, data: { visitTime: t(9, 53) } },
        { id: ropeway.id, data: { visitTime: t(10, 42) } },
        { id: hachimanbori.id, data: { visitTime: t(12, 24) } },
        { id: shinmachi.id, data: { memo: SHINMACHI_MEMO_NEW, visitTime: t(13, 1) } },
        {
          id: nishikawa.id,
          data: {
            memo: NISHIKAWA_MEMO_NEW,
            visitTime: t(13, 42),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
          },
        },
        { id: yubinkyoku.id, data: { memo: YUBINKYOKU_MEMO_NEW, visitTime: t(14, 22) } },
      ],
      {
        remove: [rakorina.id],
        tx,
      }
    );
    // setDaySpotOrderは新規作成も扱えるが、既存の並びを保ったまま最後に1件追加したいだけなので、
    // ラコリーナを削除した直後のorderNo(7)で西の湖を作成する
    await tx.spot.create({
      data: {
        dayId,
        orderNo: 8,
        name: "西の湖(水郷めぐり)",
        lat: 35.1462292,
        lng: 136.0935614,
        memo: NISHINOKO_MEMO_NEW,
        visitTime: t(15, 0),
        stayDurationMin: 90,
        transitLegs: { create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 8 }] },
      },
    });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
