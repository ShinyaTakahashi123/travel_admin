/**
 * 8138e945（世界遺産・百舌鳥古墳群と刃物の街、堺の歴史を巡る日帰りプラン）の組み直し（3回目送付）
 * 06d30178 とそろえる（企画運営 11/04・11/05）
 *
 * 【3回目: 企画運営・法務の指摘（11/05）への対応】
 * 1. 滞在の延ばしを戻す: 履中40→35分、妙国寺45→40分（もとの値。延ばさない決まり）
 * 2. 区間の測り直し（法務指摘。点の変更がない区間も含め、OSRM routed-footで測り直した）:
 *    利晶の杜→妙国寺 1246.5秒→21分（もと15）、妙国寺→山口家 702.6秒→12分（もと8）、
 *    山口家→清学院 488.7秒→9分（もと7）
 * 3. 新しい点の見直し:
 *    - いたすけ古墳: 面(archaeological_site way43054912)の中心ではなく、着く側の案内板
 *      node6579472359（34.5540548,135.4857389、6けた34.554055,135.485739）に変更（7章）
 *    - 昼食: 宿院頓宮（神社）ではなく、決まりの順でバス停・電停を使う。阪堺線「宿院」停留所
 *      node7046009196（34.5756292,135.4712072、6けた34.575629,135.471207）に変更
 *    （上の変更にともない、仁徳→いたすけ 846.1秒→15分、いたすけ→履中 1222.3秒→21分、
 *     履中→昼食 車319.8秒→ceil(5.33)+5=11分(タクシー)、昼食→利晶の杜 129.6秒→3分、に測り直し）
 * 4. 06d30178との重なり（仁徳・山口家住宅・堺伝統産業会館の3つ、中心でないのは山口家の1つ）は、
 *    企画運営・法務で合意済み。山口家は残す
 * 5. 時刻: 9:00〜16:32（日帰りの決まり16:30〜17:00の中）。滞在はすべてもとの値に戻し、
 *    区間の測り直しの結果だけで合わせた
 * 6. 仁徳の書き出し:「JR阪和線・百舌鳥駅から徒歩およそ8分。」→「JR阪和線の百舌鳥駅から歩いておよそ
 *    8分、仁徳天皇陵古墳に着きます。」（ほかの文と同じ形にそろえる）
 * 7. 死にふれる・評価の言い方の直し:
 *    - 仁徳「お墓に定めています」→「陵に治定しています」、「仁徳天皇の没年と」→削除（死をふれない）
 *    - 妙国寺「幕末には、土佐藩士たちがこの地で命を落とした『堺事件』の舞台としても知られています」
 *      は削除（死を描く文）
 *    - 伝産会館「なかでも主役といえるのが」→「数ある伝統産業品の中で中心となっているのが」（評価→事実）、
 *      「実感できるはずです」→「実感できます」
 *    - 清学院「初めてヒマラヤを越えチベットに入った日本人として知られる」→「初めてヒマラヤを越え
 *      チベットに入った日本人とされる」（「初めて」に同じ文でぼかしを入れる）
 * 8. 伝産会館「1982年3月に経済産業大臣指定の伝統的工芸品」は、1982年当時の省の名前（通商産業省）の
 *    問題が出るため、大臣の名前を出さない「1982年3月に国の伝統的工芸品に指定されました」に直した
 *    （企画運営11/05）。年月日は堺市公式「経済産業大臣指定年月日 昭和57年(1982年)3月5日」のとおり
 * 10. （4回目の小さな直し。企画運営11/05）利晶の杜「利休作として唯一現存する国宝の茶室」の「唯一」に
 *    ぼかしを追加して「唯一現存するとされる」に。いたすけ古墳「第8位の規模です」→「第8位の規模とされます」
 *    （履中の「3番目の規模とされる」と同じ形にそろえる）
 * 11. （5回目。法務11/05、原文と比べた指摘への対応）
 *    - いたすけ古墳「濠を埋めて造成する工事が計画され」は原文と違うため「土取り工事で」に直した。
 *      橋げたの「名残だと伝えられています」→「名残です」（言い切り。堺市公式itasuke.htmlの原文どおり）
 *    - 清学院「江戸時代後期に修験道の寺院として建てられ」は誤りのため、堺市公式seigakuin.htmlの原文
 *      「元禄2年(1689)の『堺大絵図』に『山伏清学院』の名で記されるなど、修験道の道場としての歴史が
 *      あります」に直した。寺子屋の時期も原文の「江戸後期から明治初期」にそろえた
 *    - 利晶の杜「2015年3月に開業」の日付は、施設公式サイトのトップページ
 *      https://www.sakai-rishonomori.com （確認2026-11-05、「2015年3月20日にオープンしました」）で
 *      確認できたため「2015年3月20日」に直した。「利休作として唯一現存する国宝の茶室」「利休の屋敷跡に
 *      面して建っています」は、施設公式サイトで確認できなかったため削除した
 *    - 山口家「昭和41年(1966)に国の重要文化財に指定」は、堺市公式の指定文化財一覧PDF
 *      https://www.city.sakai.lg.jp/kanko/rekishi/bunkazai/bunkazai/rekimachi/rekimachi_nintei.files/rekimachi_bunkatsu_kanmatsu.pdf
 *      （確認2026-11-05、143ページの表に「重要文化財 山口家住宅 1 江戸前期 堺市 堺区錦之町東
 *      昭和41年6月11日」と明記）で年月日まで確認できたため、そのまま残した
 *    - 仁徳「日本書紀の記す時代と、考古学的に推定される築造の時期には数十年の差があり」は、
 *      国土交通省多言語解説文データベースの原文（即位313〜399年、古墳群は5世紀半ば築造の可能性が高い、
 *      歴史的証拠はないと考える専門家もいる）にこの文そのものがないため削除した
 *    - 伝産会館の1982年の文は、10番の直し（大臣の名前を出さない形）のままで対応済み
 * 12. （6回目。法務11/05、残り1か所）利晶の杜「1階の『千利休茶の湯館』には、京都・妙喜庵に伝わる
 *    国宝の茶室『待庵』を復元した『さかい待庵』があります。ここにあるのはあくまで復元であり、
 *    国宝そのものではありません。」は、「1階」「妙喜庵」「国宝」「復元」をすべて確認できる公式URLが
 *    見つからなかったため、法務の案のとおり「千利休茶の湯館には、茶室『さかい待庵』があります。」に
 *    短くした
 * 13. （7回目。企画運営11/05）同じ文の「2階の『与謝野晶子記念館』」の「2階」を、施設公式
 *    https://sakai-rishonomori.com/yosanoakikokinenkan/ （確認2026-11-05）で確かめたところ、
 *    このページには与謝野晶子記念館が何階にあるかの記載がなかった（1階にあると確認できたのは
 *    千利休茶の湯館のみ）ため、「2階の」を外した
 * 9. 事実ごとの出典の確認（公式のみ。見つからないものは削除・弱めた）:
 *    - 仁徳 486m・国内最大規模・5世紀中頃築造・宮内庁治定: 堺市公式
 *      https://www.city.sakai.lg.jp/kanko/rekishi/dkofun/database/nintokutenno.html （確認2026-11-05）
 *    - 仁徳の築造年代のずれ: 国土交通省多言語解説文データベース
 *      https://www.mlit.go.jp/tagengo-db/common/001554023.pdf （確認2026-11-05）。「50年以上のずれ」
 *      という具体的な数字の公式出典は見つからず「数十年の差」に弱めた。「始皇帝陵・クフ王との比較」は
 *      公式の出典が見つからないため削除
 *    - 履中 365m・3番目・宮内庁管理: 堺市公式
 *      https://www.city.sakai.lg.jp/kanko/rekishi/dkofun/database/richutenno.html （確認2026-11-05）。
 *      このページに拝所の位置（南側・東側）の記載はないため、「南側の拝所」の一文は削除し
 *      「周濠沿いの道」に弱めた
 *    - いたすけ 第8位・埴輪・葺石・濠の橋げた・保存運動: 堺市公式
 *      https://www.city.sakai.lg.jp/kanko/rekishi/bunkazai/bunkazai/shokai/bunya/shiseki/mozukofungun/itasuke.html
 *      （確認2026-11-05）
 *    - 利晶の杜 2015年3月開業: 堺市公式 https://www.city.sakai.lg.jp/kanko/bunka/bunka_kanren/rishou/index.html
 *      （確認2026-11-05）。さかい待庵「利休作として唯一現存する国宝」: 検索で確認した施設の説明
 *      （「最古の茶室」という言い方は確認できず削除）。晶子の実家「駿河屋」の再現・肉声の朗読:
 *      施設公式 https://sakai-rishonomori.com/yosanoakikokinenkan/ （確認2026-11-05、「駿河屋の店先」
 *      ではなく「生家の建物・帳場の再現」だったため文を直した）。「椿の井戸」は出典が見つからず削除。
 *      利休の屋敷跡に面する立地は施設のリーフレット記載
 *    - 妙国寺 永禄5年創建・大蘇鉄(大正13年国天然記念物指定)・信長の言い伝え: 堺市公式
 *      https://www.city.sakai.lg.jp/kanko/sakai/alacarte/jinja.html 、
 *      https://www.city.sakai.lg.jp/kanko/rekishi/bunkazai/bunkazai/shokai/bunya/tennen/sotetsu.html
 *      （確認2026-11-05）。「日珖上人」「樹齢1100年」「家康の滞在」は堺市公式に記載がないため削除
 *    - 山口家 江戸時代初期建築・昭和41年(1966)重要文化財: 堺市公式
 *      https://www.city.sakai.lg.jp/kanko/rekishi/bunkazai/bunkazai/yamaguchike.html （確認2026-11-05）
 *    - 清学院 修験道・清光堂・河口慧海: 堺市公式
 *      https://www.city.sakai.lg.jp/kanko/rekishi/bunkazai/bunkazai/seigakuin.html （確認2026-11-05）
 *    - 伝産会館 1982年3月指定: 堺市公式
 *      https://www.city.sakai.lg.jp/kanko/sakai/keisho/dentosangyo/sakaiuchihamono.html （確認2026-11-05）
 *
 * 確認: 法務・企画運営
 */

import { prisma } from "../src/lib/prisma";

function t(h: number, m: number): Date {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const ITINERARY_ID = "8138e945-07a7-491e-8239-3422405ebb78";
const DAY_ID = "af875d75-bde4-42b9-ad62-b716d53551ae";

const NINTOKU_ID = "dbac8375-bfd0-47ad-a0c6-5425c1dd1656";
const MUSEUM_ID = "fd4c24c9-284f-4b8e-a8da-c7569eba6270"; // 削除（堺市博物館）
const RICHU_ID = "f0ae6c7d-2da1-4a55-a2df-c28f730fa896";
const NANSHUJI_ID = "7cfe43b3-c258-4900-9a7d-3b27ca52cfbd"; // 削除（南宗寺）
const RISHO_ID = "2b1f0ef7-7656-4d04-a560-0c281fa85872";
const MYOKOKUJI_ID = "0f34aff9-c25b-4c97-a2b4-b57d898766fa";
const YAMAGUCHI_ID = "8704fe00-61b4-4d91-8828-55b8aaaf0f2e";
const SEIGAKUIN_ID = "806234eb-a875-4e07-87b7-a926878047ab";
const DENSANKAIKAN_ID = "bdeefec2-0dd1-407b-a4b1-f7d2ea852153";

const NEW_DESCRIPTION =
  "仁徳天皇陵古墳・履中天皇陵古墳をはじめとする世界遺産の百舌鳥古墳群、市民の保存運動で守られたいたすけ古墳、千利休ゆかりのさかい利晶の杜、伝統の堺打刃物まで。古代から続く「堺」の歴史をたどる日帰りプランです。";

const DELETE_SPOT_IDS = [MUSEUM_ID, NANSHUJI_ID];

const UPDATE_SPOTS: {
  id: string;
  visitTime: Date;
  stayDurationMin: number;
  memo: string;
  lat?: string;
  lng?: string;
  leg?: { transitMode: string; transitDurationMin: number };
}[] = [
  {
    id: NINTOKU_ID,
    visitTime: t(9, 0),
    stayDurationMin: 50,
    lat: "34.560783",
    lng: "135.485042",
    memo:
      "JR阪和線の百舌鳥駅から歩いておよそ8分、仁徳天皇陵古墳に着きます。仁徳天皇陵古墳は、日本最大とされる古墳です。宮内庁は「百舌鳥耳原中陵」として第16代仁徳天皇の陵に治定していますが、学術的には被葬者は確定していません。正式な発掘調査も行われていないため、本当のところは分かっていないのです。考古学の世界では「大仙陵古墳」「大山古墳」とも呼ばれ、世界遺産としての正式な構成資産名も「仁徳天皇陵古墳(大山古墳)」となっています。墳丘の全長は約486mで国内最大規模とされています。宮内庁が管理する陵墓のため、墳丘の中には入れません。広大な周濠沿いを、静かに、敬意をもって歩き、まずは古代へ思いを馳せてみましょう。この後は、歩いておよそ15分、いたすけ古墳へ向かいましょう。",
  },
  {
    id: RICHU_ID,
    visitTime: t(10, 56),
    stayDurationMin: 35,
    lat: "34.554443",
    lng: "135.475450",
    memo:
      "いたすけ古墳からは歩いておよそ21分です。履中天皇陵古墳(ミサンザイ古墳)は、百舌鳥古墳群南部にある前方後円墳で、墳丘長およそ365m、日本で3番目の規模とされる大きさを誇ります。仁徳天皇陵古墳とあわせて、百舌鳥古墳群を代表する巨大古墳の一つです。宮内庁が管理する陵墓のため、墳丘の中には入れませんが、周濠沿いの道から、その規模を実感できます。静かに、敬意をもって、周濠沿いの散策を楽しみましょう。この後は、タクシーでおよそ11分、宿院のあたりへ向かいましょう。",
    leg: { transitMode: "walk", transitDurationMin: 21 },
  },
  {
    id: RISHO_ID,
    visitTime: t(12, 25),
    stayDurationMin: 55,
    memo:
      "宿院停留所のあたりから歩いておよそ3分です。「さかい利晶の杜」は、2015年3月20日に開業した施設で、堺が生んだ二人の偉人、茶人・千利休と歌人・与謝野晶子を紹介しています。千利休茶の湯館には、茶室「さかい待庵」があります。「与謝野晶子記念館」では、晶子の実家「駿河屋」の建物がほぼ実際の大きさで再現されていて、「源氏物語」や自作の短歌を朗読する晶子の肉声も聴くことができます。この後は、歩いておよそ21分、妙国寺へ向かいましょう。",
    leg: { transitMode: "walk", transitDurationMin: 3 },
  },
  {
    id: MYOKOKUJI_ID,
    visitTime: t(13, 41),
    stayDurationMin: 40,
    memo:
      "さかい利晶の杜からは歩いておよそ21分です。妙国寺は、永禄5年(1562)に創建された日蓮宗の寺院です。境内には、大正13年(1924)に国の天然記念物に指定された大蘇鉄があり、織田信長がこの木を安土城に移植したところ、毎夜「堺へ帰りたい」と泣いたため、妙国寺に返したという言い伝えが残っています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ12分、山口家住宅へ向かいましょう。",
    leg: { transitMode: "walk", transitDurationMin: 21 },
  },
  {
    id: YAMAGUCHI_ID,
    visitTime: t(14, 33),
    stayDurationMin: 30,
    memo:
      "妙国寺からは歩いておよそ12分です。堺市立町家歴史館 山口家住宅は、江戸時代初期に建てられ、昭和41年(1966)に国の重要文化財に指定された町家です。当時の堺商人の暮らしぶりを伝える、貴重な建築として公開されています。この後は、歩いておよそ9分、清学院へ向かいましょう。",
    leg: { transitMode: "walk", transitDurationMin: 12 },
  },
  {
    id: SEIGAKUIN_ID,
    visitTime: t(15, 12),
    stayDurationMin: 30,
    memo:
      "山口家住宅からは歩いておよそ9分です。堺市立町家歴史館 清学院は、元禄2年(1689)の『堺大絵図』に『山伏清学院』の名で記されるなど、修験道の道場としての歴史があります。江戸時代後期から明治時代初期にかけては「清光堂」という寺子屋として、地域の子どもたちに読み書きを教えていました。初めてヒマラヤを越えチベットに入った日本人とされる河口慧海も、この寺子屋で学んだと伝えられています。堺の教育の歴史に思いを馳せてみましょう。この後は、歩いておよそ15分、堺伝統産業会館へ向かいましょう。",
    leg: { transitMode: "walk", transitDurationMin: 9 },
  },
  {
    id: DENSANKAIKAN_ID,
    visitTime: t(15, 57),
    stayDurationMin: 35,
    lat: "34.582886",
    lng: "135.477490",
    memo:
      "清学院からは歩いておよそ15分です。堺伝統産業会館(堺伝匠館)は、堺打刃物をはじめ、浪華本染め、堺線香、堺手織緞通、堺五月鯉幟、昆布加工品など、堺に伝わるさまざまな伝統産業品を、見て、体験できる施設になっています。数ある伝統産業品の中で中心となっているのが堺打刃物です。プロの料理人が使う包丁として知られ、その確かな技術は1982年3月に国の伝統的工芸品に指定されました。職人が丁寧に仕上げた一本一本の刃物を間近で見ると、堺という街が古くから「ものづくりの町」として発展してきたことが実感できます。古墳の時代から茶の湯の文化、町家の暮らし、そして伝統産業まで、堺の奥深い歴史をたどる一日の締めくくりに、じっくりと見て回りましょう。帰りは、阪堺線「妙国寺前」駅まで歩いておよそ2分です。",
    leg: { transitMode: "walk", transitDurationMin: 15 },
  },
];

const ITASUKE = {
  id: "7f2a3c9e-5b61-4c8a-9d2e-3a1b6f7c8e01",
  name: "いたすけ古墳",
  orderNo: 2,
  visitTime: t(10, 5),
  stayDurationMin: 30,
  lat: "34.554055",
  lng: "135.485739",
  memo:
    "仁徳天皇陵古墳から歩いておよそ15分、いたすけ古墳に着きます。百舌鳥古墳群のほぼ中央にある3段築成の前方後円墳で、5世紀前半に築造されたと考えられています。墳丘長はおよそ146メートルで、百舌鳥古墳群の中では第8位の規模とされます。周囲には一重の濠がめぐり、埴輪や葺石があったことも確認されています。昭和30年(1955)頃、土取り工事で破壊の危機にひんしましたが、市民による保存運動によって守られ、昭和31年(1956)に国の史跡に指定されました。濠の中に今も残る橋げたは、当時の工事の名残です。仁徳天皇陵古墳・履中天皇陵古墳とは違い、宮内庁の陵墓ではなく、国の史跡です。この後は、歩いておよそ21分、履中天皇陵古墳へ向かいましょう。",
  leg: { transitMode: "walk", transitDurationMin: 15 },
};

const LUNCH = {
  id: "9b4e2d1f-6a73-4e95-8b1c-2d5f9a0e3c42",
  name: "宿院停留所のあたりで昼食",
  orderNo: 4,
  visitTime: t(11, 42),
  stayDurationMin: 40,
  lat: "34.575629",
  lng: "135.471207",
  memo:
    "履中天皇陵古墳からタクシーでおよそ11分、阪堺線「宿院」停留所のあたりに着きます。このあたりで昼食にしましょう。腹ごしらえをしたら、歩いておよそ3分、さかい利晶の杜へ向かいましょう。",
  leg: { transitMode: "taxi", transitDurationMin: 11 },
};

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード ===");

  console.log("[説明文]", NEW_DESCRIPTION);
  console.log("[削除するスポット]", DELETE_SPOT_IDS);

  for (const s of UPDATE_SPOTS) {
    console.log("----");
    console.log("id:", s.id);
    console.log(
      "時刻:",
      `${String(s.visitTime.getUTCHours()).padStart(2, "0")}:${String(s.visitTime.getUTCMinutes()).padStart(2, "0")}`,
      "滞在:",
      s.stayDurationMin,
    );
    if (s.lat) console.log("座標:", s.lat, s.lng);
    console.log("memo:", s.memo);
    if (s.leg) console.log("  区間:", JSON.stringify(s.leg));
  }
  for (const s of [ITASUKE, LUNCH]) {
    console.log("----");
    console.log("名前(新規):", s.name, "orderNo:", s.orderNo);
    console.log(
      "時刻:",
      `${String(s.visitTime.getUTCHours()).padStart(2, "0")}:${String(s.visitTime.getUTCMinutes()).padStart(2, "0")}`,
      "滞在:",
      s.stayDurationMin,
    );
    console.log("座標:", s.lat, s.lng);
    console.log("memo:", s.memo);
    console.log("  区間:", JSON.stringify(s.leg));
  }

  if (!commit) {
    console.log("\n--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: ITINERARY_ID },
      data: { description: NEW_DESCRIPTION },
    });

    for (const id of DELETE_SPOT_IDS) {
      await tx.spot.delete({ where: { id } });
    }

    for (const s of UPDATE_SPOTS) {
      await tx.spot.update({
        where: { id: s.id },
        data: {
          visitTime: s.visitTime,
          stayDurationMin: s.stayDurationMin,
          memo: s.memo,
          ...(s.lat ? { lat: s.lat, lng: s.lng } : {}),
        },
      });
      if (s.leg) {
        await tx.spotTransitLeg.updateMany({
          where: { spotId: s.id, orderNo: 1 },
          data: { transitMode: s.leg.transitMode, transitDurationMin: s.leg.transitDurationMin },
        });
      }
    }

    for (const s of [ITASUKE, LUNCH]) {
      await tx.spot.create({
        data: {
          id: s.id,
          dayId: DAY_ID,
          orderNo: s.orderNo,
          name: s.name,
          lat: s.lat,
          lng: s.lng,
          visitTime: s.visitTime,
          memo: s.memo,
          stayDurationMin: s.stayDurationMin,
          stampCategory: s.name === "いたすけ古墳" ? "other" : "gourmet",
        },
      });
      await tx.spotTransitLeg.create({
        data: {
          spotId: s.id,
          orderNo: 1,
          transitMode: s.leg.transitMode,
          transitDurationMin: s.leg.transitDurationMin,
        },
      });
    }
  });

  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
