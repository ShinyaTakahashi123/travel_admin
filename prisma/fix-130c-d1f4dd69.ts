/**
 * #130 d1f4dd69の直し(3回目)。企画運営(2026-10-11)の指摘。
 *
 * 1. 明日香の他のしおり(27a60951・feb07068・0e15e22b・9a719ffb)の
 *    全文を読んで比べた結果、向原寺・甘樫丘・水落遺跡・石舞台古墳・
 *    高松塚古墳・岡寺の文が、取り上げる点・言い回しとも近すぎたため、
 *    それぞれ別の事実を中心に書き直した:
 *    - 向原寺: 「仏像を寺にした経緯」ではなく、物部氏ら排仏派が仏像を
 *      難波の堀江に投げ捨てたという対立の記録を中心に
 *      (buddhism.lib.ntu.edu.tw/en/search/search_detail.jsp?seq=306179
 *      ほかで確認)
 *    - 甘樫丘: 「大和三山の眺め」ではなく、平成6年(1994)の発掘調査で
 *      見つかった、乙巳の変に関連するとみられる焼けた建物跡(甘樫丘
 *      東麓遺跡)を中心に(奈良文化財研究所の発掘資料で確認)
 *    - 水落遺跡: 『日本書紀』の引用文ではなく、中国では漏刻が皇帝だけの
 *      特権だったという史実を中心に
 *    - 石舞台古墳: 「盛り土と石室」の説明ではなく、このあたりが
 *      「島庄」と呼ばれ、蘇我馬子が「嶋大臣」と呼ばれた邸宅・庭園が
 *      あったという『日本書紀』の記述を中心に
 *      (ana.co.jp/zh/tw/japan-travel-planner/nara/0000003.htmlで確認)
 *    - 高松塚古墳: 「壁画の取り出しと保存の努力」ではなく、昭和37年
 *      (1962)ごろの発見のきっかけ(生姜貯蔵の穴掘り)と、平成19年
 *      (2007)の石室解体・保存処置を中心に(imidas.jp/insight/
 *      l-40-005-07-06-g155/ほかで確認)
 *    - 岡寺: 「龍の伝説・厄除け霊場」ではなく、重要文化財の仁王門と、
 *      シャクナゲ・サツキの名所であることを中心に(奈良県文化財保存
 *      事務所「重要文化財岡寺仁王門修理工事報告書」、co-trip.jp等の
 *      花の名所の記事で確認)
 *
 * 2. 山田寺跡の「自害」の語を、法務の決まり(9/30、身を投げる・自ら
 *    命を絶つなどの語は使わない)に沿って削除。法務の指示通り「649年に
 *    石川麻呂が亡くなり、工事が中断しました」に言い換え。
 *
 * 3. 万葉文化館の「2026年3月に国宝指定」について、法務から訂正の指示
 *    (2026-10-11、記録bbaff72)。3月26日は文化審議会の答申で、実際の
 *    指定はそのあと。「2026年に国宝に指定されました」に修正。また、
 *    「特別展示室で富本銭の実物も見学できる」も誤りで、国宝の実物は
 *    飛鳥資料館で展示されているとのことなので、「実物」の語を外し、
 *    レプリカ・資料の展示という表現に修正。
 *
 * 4. 座標2か所の誤り(法務指摘、2026-10-11)。いずれも、OSMの「案内板
 *    (information board)」の点を誤って使っていた:
 *    - 亀石: 案内板の点(node 7599809461)ではなく、史跡本体の点(node
 *      4469534110)の34.471129,135.811577に修正
 *    - 岡寺: 案内板の点(node 4839292628)ではなく、建物(way 491841439)
 *      の中心34.471681,135.828315に修正
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const MUKUHARA_MEMO =
  "飛鳥めぐりの1日目は、甘樫丘の北にある向原寺(豊浦寺跡)から始めましょう。この地はもと蘇我稲目の邸宅があった場所で、欽明13年(552)に百済から伝えられた仏像を、稲目がここに安置したと『日本書紀』に記されています。ところが、物部尾輿らの排仏派がこれに反発し、仏像を難波の堀江に投げ捨てたという対立の記録も残っています。のちに推古天皇が即位した豊浦宮の跡地になったとも伝えられ、今の向原寺は、その跡を受け継ぐ寺院です。今も法灯を受け継ぐ寺院ですので、敬意を持ってお参りしましょう。この後は、歩いておよそ6分、甘樫丘へ向かいましょう。";

const AMAKASHI_MEMO =
  "向原寺から歩いておよそ6分、甘樫丘に着きます。麓では、平成6年(1994)の発掘調査で、焼け焦げた木材や壁土の跡が見つかっており、乙巳の変(645年、中大兄皇子らが蘇我入鹿を討った政変)で焼け落ちた、蘇我氏の邸宅の一部ではないかとみられています。頂上の展望台からは、大和三山と呼ばれる耳成山・畝傍山・天香久山や、二上山まで見渡せます。この一帯は国営飛鳥歴史公園の一部として整備されており、万葉集に詠まれた植物も植えられています。この後は、歩いておよそ5分、水落遺跡へ向かいましょう。";

const MIZUOCHI_MEMO =
  "甘樫丘から歩いておよそ5分、水落遺跡に着きます。斉明天皇6年(660)、当時皇太子だった中大兄皇子(後の天智天皇)が、水時計「漏刻」を造らせた跡とされています。中国の唐では、時を知らせる漏刻を持つことは皇帝だけに許された特権で、日本もこの仕組みを取り入れたと考えられています。発掘調査では、頑丈な建物の土台と、水を一定の速さで送るための精巧な配水の跡が見つかっており、古代の高い技術力がうかがえます。この後は、歩いておよそ5分、飛鳥寺へ向かいましょう。";

const YAMADADERA_FROM =
  "石川麻呂が649年に自害したことで工事が中断しましたが、663年に再開され、685年ごろに主要な建物が完成したと伝えられています。";
const YAMADADERA_TO =
  "649年に石川麻呂が亡くなり、工事が中断しましたが、663年に再開され、685年ごろに主要な建物が完成したと伝えられています。";

const MANYOBUNKAKAN_FROM =
  "2026年3月には、この飛鳥池遺跡から出土した品々が国宝に指定されました。地下の展示室では、映像や模型で万葉の時代の空気を感じられるほか、特別展示室では富本銭の実物やレプリカも見学できます。";
const MANYOBUNKAKAN_TO =
  "2026年には、この飛鳥池遺跡から出土した品々が国宝に指定されました。地下の展示室では、映像や模型で万葉の時代の空気を感じられるほか、特別展示室では富本銭のレプリカや資料も見学できます(国宝の実物は飛鳥資料館で展示されています)。";

const ISHIBUTAI_MEMO =
  "酒船石遺跡から歩いておよそ13分、石舞台古墳に着きます。このあたりは古代、「島庄」と呼ばれ、『日本書紀』には、蘇我馬子が自邸の庭に池と小島を造り、人々から「嶋大臣」と呼ばれたという記述があります。石舞台古墳は、その邸宅のすぐそばにあることから、馬子の墓ではないかという説が有力になっています。天井に使われている一番大きな石はおよそ77トン、石の総重量はおよそ2300トンと伝えられ、盛り土が失われて巨石の石室がむき出しになった、独特の姿で知られています。今も石室の中に入ることができるので、巨石の迫力をゆっくりと楽しみましょう。公園内や周辺の食事処で、昼食をとっておきましょう。この後は、歩いておよそ32分、高松塚古墳・壁画館へ向かいましょう。";

const TAKAMATSUZUKA_MEMO =
  "石舞台古墳から歩いておよそ32分、高松塚古墳・壁画館に着きます。昭和37年(1962)ごろ、地元の人が生姜を貯蔵する穴を掘っていた際に、切石に気づいたことがきっかけとなり、昭和47年(1972)、明日香村と奈良県立橿原考古学研究所による発掘調査で、極彩色の壁画が見つかりました。女子群像や男子群像、四神、天井の天文図などが描かれており、昭和49年(1974)に国宝に指定されています。壁画は保存のため石室ごと取り出され、平成19年(2007)には石室を解体して修理施設に移す保存処置が行われました。ふだんは実物を見ることができませんが、隣接する壁画館で、発見当時の姿を再現した模写や石室の模型を見学できます。この後は、歩いておよそ38分、岡寺へ向かいましょう。";

const OKADERA_MEMO =
  "高松塚古墳・壁画館から歩いておよそ38分、2日目最後は岡寺です。参道の仁王門は、重要文化財に指定されている建物です。境内はシャクナゲやサツキの名所として知られ、花の季節には多くの参拝者でにぎわいます。正式には龍蓋寺という名で、飛鳥時代の高僧・義淵僧正が663年ごろに開いたと伝えられ、悪い龍を法力で池に封じて石で蓋をしたという伝説が、この名の由来とされています。ご本尊の如意輪観音坐像は、奈良時代につくられた土の塑像で、高さはおよそ4.6メートル、この種の塑像としては国内でも屈指の大きさとされています。西国三十三所の第七番札所として、今も多くの参拝者を集めています。境内は祈りの場ですので、敬意を持ってお過ごしください。参拝を終えたら、岡寺前バス停まで歩いておよそ10分、奈良交通のバスでおよそ24分、近鉄橿原神宮前駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1f4dd69%'`);
  const itinId = rows[0].id;

  const amakashi = await findSpotInItinerary(itinId, { spotName: "甘樫丘" });
  const mukuhara = await findSpotInItinerary(itinId, { spotName: "向原寺（豊浦寺跡）" });
  const mizuochi = await findSpotInItinerary(itinId, { spotName: "水落遺跡" });
  const yamadadera = await findSpotInItinerary(itinId, { spotName: "山田寺跡" });
  const manyobunkakan = await findSpotInItinerary(itinId, { spotName: "奈良県立万葉文化館" });
  const ishibutai = await findSpotInItinerary(itinId, { spotName: "石舞台古墳" });
  const takamatsuzuka = await findSpotInItinerary(itinId, { spotName: "高松塚古墳・壁画館" });
  const okadera = await findSpotInItinerary(itinId, { spotName: "岡寺" });
  const kameishi = await findSpotInItinerary(itinId, { spotName: "亀石" });

  if (!yamadadera.memo?.includes(YAMADADERA_FROM)) throw new Error("山田寺跡の文言が想定外です");
  if (!manyobunkakan.memo?.includes(MANYOBUNKAKAN_FROM)) throw new Error("万葉文化館の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: mukuhara.id }, { memo: MUKUHARA_MEMO });
  await updateSpotInItinerary(itinId, { spotId: amakashi.id }, { memo: AMAKASHI_MEMO });
  await updateSpotInItinerary(itinId, { spotId: mizuochi.id }, { memo: MIZUOCHI_MEMO });
  await updateSpotInItinerary(itinId, { spotId: yamadadera.id }, { memo: yamadadera.memo!.replace(YAMADADERA_FROM, YAMADADERA_TO) });
  await updateSpotInItinerary(itinId, { spotId: manyobunkakan.id }, { memo: manyobunkakan.memo!.replace(MANYOBUNKAKAN_FROM, MANYOBUNKAKAN_TO) });
  await updateSpotInItinerary(itinId, { spotId: ishibutai.id }, { memo: ISHIBUTAI_MEMO });
  await updateSpotInItinerary(itinId, { spotId: takamatsuzuka.id }, { memo: TAKAMATSUZUKA_MEMO });
  await updateSpotInItinerary(itinId, { spotId: okadera.id }, { memo: OKADERA_MEMO, lat: 34.471681, lng: 135.828315 });
  await updateSpotInItinerary(itinId, { spotId: kameishi.id }, { lat: 34.471129, lng: 135.811577 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
