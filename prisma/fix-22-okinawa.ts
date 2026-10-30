/**
 * #22 万座毛と沖縄美ら海水族館、恩納村と沖縄本島北部をめぐるレンタカー2泊3日(2678aee0)
 * 初日・最終日の見直し(法務指摘の2回目を含む、2026-10-30)
 *
 * [Day1(初日)] 那覇空港に10:30ごろ着+レンタカー手続き15分+運転52分(OSRM実測46.75分+
 * 駐車5分)で1か所目(座喜味城跡)着11:37。8か所あったが、ユンタンザミュージアム・
 * やちむんの里・残波岬を外し5か所に。座喜味城跡→真栄田岬を直結(OSRM実測14分+駐車5分=
 * 19分、法務指摘)。万座毛→ナビービーチの既存leg(10分)がOSRM実測(3.14分)の1.5倍+5分
 * (9.71分)を超えていたため8分に直す。結果: 座喜味城跡11:37(45)→真栄田岬12:41(30,car19)
 * →おんなの駅13:21(45,car10、昼食)→万座毛14:26(40,car20)→ナビービーチ15:14
 * (80,car8、16:34出発)
 *
 * [Day3(最終日、2泊以上)] 6か所あったうち中村家住宅を外し5か所に。中城城跡→壺屋やちむん
 * 通りを直結(OSRM実測29.41分+駐車5分=34分、点の直しを反映)。美浜→中城城跡の既存leg
 * (30分)がOSRM実測(14.67分、点の直し前)の1.5倍+5分を超えていたため、点を直した後の
 * 実測(15.845分)+駐車5分=21分に直す。結果: 谷茶ビーチ09:00(20)→琉球村09:35(80,car15)→
 * 美浜11:30(60,car35、昼食)→中城城跡12:51(65,car21)→壺屋やちむん通り14:30
 * (30,car34、15:00出発)
 *
 * [座標の確認(法務指摘)] 3日間すべての点をOSMで確認。座喜味城跡(historic=castle
 * way218648820と完全一致)・真栄田岬(展望ポイントnode1993614070と完全一致、メモの
 * 「展望台」に対応)・おんなの駅(shop node)・沖縄美ら海水族館(aquarium way)・
 * ティーヌ浜(viewpoint node)・琉球村(museum way)は、いずれも既存の値が正しいと確認。
 * 下記は点を直す:
 * - 万座毛: natural=cape node2004524873(26.5053825,127.8503534)に微修正(約40m)。
 *   隣接legは変化なし(おんなの駅→万座毛16.08分・万座毛→ナビービーチ3.14分、ともに実測済み)
 * - 谷茶ビーチ: 「谷茶」の集落名(place=quarter)が入っていたため、実際の砂浜way1470043968
 *   「谷茶浜」(26.4697304,127.8289612)に直す(約640m)。隣接legの琉球村までの15分は
 *   実測(11.42分)の範囲内で変更なし
 * - 備瀬のフクギ並木: tourism=attraction node5895799085「Bise Fukugi」
 *   (26.7028431,127.8805700)に直す(約380m)。海洋博公園からの10分は範囲内で変更なし。
 *   ティーヌ浜までのlegは35分→44分(実測39.39分+駐車5分)に直す
 * - 今帰仁城跡: historic=castle way218648052(26.6908894,127.9297334)に直す(約230m)。
 *   ティーヌ浜からのlegは25分→38分(実測33.47分+駐車5分)に直す
 * - 中城城跡: historic=archaeological_site way218650220(26.2839342,127.8011595)に
 *   直す(約230〜300m)。美浜からのlegは30分→21分(実測15.845分+駐車5分)に直す
 * [法務指摘の3回目] 海洋博公園→メモで最初に出るエメラルドビーチ(tourism=attraction
 * node4918629222、26.6995474,127.8784370)に。ナビービーチ→恩納海浜公園の中心でなく、
 * 実際のnatural=beach way232021419「ナビービーチ」(26.5033304,127.8588741、約115m)に。
 * 美浜アメリカンビレッジ→昼食の場所の決まりで、地区名の入った名前つきバス停
 * 「美浜アメリカンビレッジ入口」node5599933722(26.3147157,127.7611347)に。
 * 点の直しに伴いlegを再計算: 美ら海水族館→海洋博公園(エメラルドビーチ)はwalk11分
 * (実測10.55分、徒歩のため駐車の5分は加えない)、海洋博公園→備瀬はcar6分
 * (実測1.38分+駐車5分)、万座毛→ナビービーチは8分で変更なし(実測3.19分+駐車5分)、
 * 琉球村→美浜はcar27分(実測21.82分+駐車5分)、美浜→中城城跡はcar20分
 * (実測14.735分+駐車5分)。法務指摘(4回目)で、美浜の昼食着が11:22と決まり(11:30〜13:30)
 * より早かったため、短くした琉球村の滞在をもとの長さの方へ戻す(80→88分、もとは90分)。
 * 美浜11:30着・中城城跡の滞在66分に
 *
 * [祈り・お墓の一文] 今帰仁城跡の「拝所」は決まりの一文の形と違っていたため直す。
 * 中城城跡の「護佐丸の墓」も、お墓の決まりの一文の形に直す
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const ITINERARY = "2678aee0-3924-4922-9b0d-c0a7608729f2";
const DAY1 = "b33ea49c-21c4-4a28-92f4-b118610b7417";
const DAY2 = "934d2cfb-af38-4283-b802-b2c991573f54";
const DAY3 = "d22062ef-c211-4546-9450-1eaeedcb41b0";

const ZAKIMI = "2fe2650e-48e1-42ff-84cd-df107c558a59";
const YUNTANZA = "3c719003-9d5e-4cd3-b559-2fb5cc4ecfb7";
const YACHIMUN_NO_SATO = "66756b5e-46c7-490b-b0e0-649b4c69ff5b";
const ZANPA = "c9ebd34f-e138-4d7b-8ad4-6804dc4ba254";
const MAEDA = "1159d7eb-4b78-4cc0-ab35-51db5fa4e064";
const ONNA_NO_EKI = "dd81473a-e70e-40d9-b885-faf81155f8f4";
const MANZAMO = "1219bd99-de46-43a2-8084-ff13bafe2ca7";
const NABEE_BEACH = "7d544b42-f9e3-48bf-a667-00544ab68c2c";

const CHURAUMI = "8a33c9e3-253d-4c3e-a2d0-28c1da4ac00a";
const KAIYOHAKU = "618b4ed8-1af2-45f4-a78d-14586b70a7e3";
const BISE = "ac2b7e09-1b27-4a5f-9839-13c4fb15f183";
const TINU_BEACH = "49c1beb2-2b72-4192-ae50-193397f4037f";
const NAKIJIN = "b6a39e38-4af4-4069-bf49-30c1fad3b353";

const TANCHA_BEACH = "4d3cfff5-6bd9-4248-9c71-efd4bc9401d4";
const RYUKYU_MURA = "b9b6b0a2-5270-4851-acc5-ab7aa8a99d34";
const MIHAMA = "f5445e0f-8496-4d4d-96c6-b507c2203fe9";
const NAKAGUSUKU = "ee29a36e-4721-4caf-a198-b95c90fdb4d8";
const NAKAMURA_HOUSE = "ee35799b-3336-4422-8e5c-616c74d2b846";
const TSUBOYA = "7aceb87a-0d55-409f-8919-a18fde524eee";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const DESC_OLD =
  "1日目は世界遺産の座喜味城跡とユンタンザミュージアム、やちむんの里、残波岬、真栄田岬をめぐり、万座毛とナビービーチへ。2日目は沖縄美ら海水族館と海洋博公園、備瀬のフクギ並木、古宇利大橋を渡る古宇利島、世界遺産・今帰仁城跡へ。3日目は琉球村から美浜を経て、護佐丸ゆかりの中城城跡と中村家住宅、那覇の壺屋やちむん通りへ。恩納村に泊まり、レンタカーでめぐる沖縄本島の2泊3日です。";
const DESC_NEW =
  "1日目は世界遺産の座喜味城跡から真栄田岬、おんなの駅を経て、万座毛とナビービーチへ。2日目は沖縄美ら海水族館と海洋博公園、備瀬のフクギ並木、古宇利大橋を渡る古宇利島、世界遺産・今帰仁城跡へ。3日目は琉球村から美浜を経て、護佐丸ゆかりの中城城跡、那覇の壺屋やちむん通りへ。恩納村に泊まり、レンタカーでめぐる沖縄本島の2泊3日です。";

const ZAKIMI_MEMO_OLD =
  "この旅はレンタカーでめぐります。那覇空港の近くで車を借りて、北へ約1時間の読谷村へ。座喜味城跡は、琉球王国が日本や中国、東南アジアとの交易で栄えた15世紀の初めに、築城の名人として知られる読谷山按司・護佐丸が築いた城の跡です。標高120m余りの丘の上にあり、もっとも高い所からは読谷村のほぼ全域を見渡せます。二つの郭からなり、アーチの石門と、重厚で美しい曲線を描く城壁が見どころです。世界遺産「琉球王国のグスク及び関連遺産群」の一つです。城壁の上は柵のない所もあるので足元に気をつけ、立ち入りできない場所には入らないようにしましょう。";
const ZAKIMI_MEMO_NEW =
  "この旅はレンタカーでめぐります。那覇空港に10時30分ごろ着いたら、空港の近くで車を借りて（手続きに15分ほど）、車で約52分の読谷村・座喜味城跡へ。座喜味城跡は、琉球王国が日本や中国、東南アジアとの交易で栄えた15世紀の初めに、築城の名人として知られる読谷山按司・護佐丸が築いた城の跡です。標高120m余りの丘の上にあり、もっとも高い所からは読谷村のほぼ全域を見渡せます。二つの郭からなり、アーチの石門と、重厚で美しい曲線を描く城壁が見どころです。世界遺産「琉球王国のグスク及び関連遺産群」の一つです。城壁の上は柵のない所もあるので足元に気をつけ、立ち入りできない場所には入らないようにしましょう。";

const MAEDA_MEMO_OLD =
  "残波岬から車で約15分。琉球石灰岩が隆起してできた、サンゴ礁の台地の険しい海岸で、岬の先には丸い岩がそびえ、その真下にコバルトブルーの海が広がります。ダイビングやシュノーケルの場所としても知られ、「青の洞窟」には多くの人が訪れます。泳がない人も、展望台から海を眺められます。海に入るときはライフジャケットなどを着け、現地の決まりに従いましょう。";
const MAEDA_MEMO_NEW =
  "座喜味城跡から車で約19分。琉球石灰岩が隆起してできた、サンゴ礁の台地の険しい海岸で、岬の先には丸い岩がそびえ、その真下にコバルトブルーの海が広がります。ダイビングやシュノーケルの場所としても知られ、「青の洞窟」には多くの人が訪れます。泳がない人も、展望台から海を眺められます。海に入るときはライフジャケットなどを着け、現地の決まりに従いましょう。";

const TSUBOYA_MEMO_OLD =
  "中村家住宅から車で約35分の那覇市壺屋へ。石畳の道が400mほど続き、昔ながらの風情のある町並みが残る焼き物の町で、窯元や工房が今も営まれています。戦争の被害が少なかった壺屋には、焼き物にかかわる文化財も残ります。石畳は滑りやすいので足元に気をつけましょう。帰りは車で約20分の那覇空港へ向かい、車を返します。運転に気をつけましょう。3日間の沖縄の旅はここまでです。";
const TSUBOYA_MEMO_NEW =
  "中城城跡から車で約34分の那覇市壺屋へ。石畳の道が400mほど続き、昔ながらの風情のある町並みが残る焼き物の町で、窯元や工房が今も営まれています。戦争の被害が少なかった壺屋には、焼き物にかかわる文化財も残ります。石畳は滑りやすいので足元に気をつけましょう。帰りは車で約20分の那覇空港へ向かい、車を返しましょう（手続きに15分ほど）。運転に気をつけましょう。3日間の沖縄の旅はここまでです。";

const NAKAGUSUKU_MEMO_OLD =
  "美浜から車で約30分。14世紀の中ごろに築かれ始めた城で、1440年、王の命によって護佐丸が、1日目に訪ねた座喜味グスクから移り、三の郭と北の郭を増やしました。六つの郭が連なる城で、自然の岩や地形を生かした美しい曲線の城壁と、石積みの技が見どころです。昭和47年（1972年）に国の史跡となり、2000年に世界遺産「琉球王国のグスク及び関連遺産群」に登録されました。城跡には護佐丸の墓もあるので、静かに、敬意をもって見学しましょう。石段や城壁の上では足元に気をつけてください。";
const NAKAGUSUKU_MEMO_NEW =
  "美浜から車で約20分。14世紀の中ごろに築かれ始めた城で、1440年、王の命によって護佐丸が、1日目に訪ねた座喜味グスクから移り、三の郭と北の郭を増やしました。六つの郭が連なる城で、自然の岩や地形を生かした美しい曲線の城壁と、石積みの技が見どころです。昭和47年（1972年）に国の史跡となり、2000年に世界遺産「琉球王国のグスク及び関連遺産群」に登録されました。城跡には護佐丸の墓もあります。墓のまわりでは、静かに過ごしましょう。石段や城壁の上では足元に気をつけてください。";

const BISE_MEMO_OLD =
  "公園の北どなり、備瀬の集落へ車で約10分。防風林として家を取り囲むように植えられたフクギが連なり、備瀬崎までのおよそ1kmの並木道になっています。かつての沖縄の集落の様子と、ゆったりとした時間の流れを感じられます。今も人が暮らす集落なので、家の敷地には入らず、静かに歩きましょう。";
const BISE_MEMO_NEW =
  "公園の北どなり、備瀬の集落へ車で約6分。防風林として家を取り囲むように植えられたフクギが連なり、備瀬崎までのおよそ1kmの並木道になっています。かつての沖縄の集落の様子と、ゆったりとした時間の流れを感じられます。今も人が暮らす集落なので、家の敷地には入らず、静かに歩きましょう。";

const MIHAMA_MEMO_OLD =
  "琉球村から南へ車で約35分の北谷町美浜。買い物やライブ、食事を一度に楽しめる観光スポットで、異国の雰囲気の街並みが特徴です。ここで昼食にしましょう。";
const MIHAMA_MEMO_NEW =
  "琉球村から南へ車で約27分の北谷町美浜。買い物やライブ、食事を一度に楽しめる観光スポットで、異国の雰囲気の街並みが特徴です。ここで昼食にしましょう。";

const TINU_BEACH_MEMO_OLD =
  "フクギ並木から車で約35分。古宇利島へは、2005年に開通した全長1960mの古宇利大橋を渡ります。沖縄本島の周辺ではもっとも長い橋の一つとされ、橋の上からは青いグラデーションの海が広がります。島の北側のティーヌ浜には、2つの岩が並ぶ「ハートロック」があります。岩場は滑りやすく、潮が満ちると足場がなくなることがあるので、潮の時間に気をつけましょう。";
const TINU_BEACH_MEMO_NEW =
  "フクギ並木から車で約44分。古宇利島へは、2005年に開通した全長1960mの古宇利大橋を渡ります。沖縄本島の周辺ではもっとも長い橋の一つとされ、橋の上からは青いグラデーションの海が広がります。島の北側のティーヌ浜には、2つの岩が並ぶ「ハートロック」があります。岩場は滑りやすく、潮が満ちると足場がなくなることがあるので、潮の時間に気をつけましょう。";

const NAKIJIN_MEMO_OLD =
  "古宇利島から車で約25分。琉球王国が統一される前、北山王の居城だった城の跡です。14世紀には怕尼芝・珉・攀安知の三人の王が現れ、1416年（1422年とする説もあります）に中山の尚巴志に滅ぼされました。その後は北部を治める監守の居城として使われ、1609年の薩摩の琉球侵攻で城は炎上したとされます。世界遺産「琉球王国のグスク及び関連遺産群」の一つです。城跡の中には今も祈りが続く拝所があるので、静かに、敬意をもって見学しましょう。城壁の上や石段では足元に気をつけましょう。帰りは恩納村まで車で約1時間。今夜も恩納村に泊まります。";
const NAKIJIN_MEMO_NEW =
  "古宇利島から車で約38分。琉球王国が統一される前、北山王の居城だった城の跡です。14世紀には怕尼芝・珉・攀安知の三人の王が現れ、1416年（1422年とする説もあります）に中山の尚巴志に滅ぼされました。その後は北部を治める監守の居城として使われ、1609年の薩摩の琉球侵攻で城は炎上したとされます。世界遺産「琉球王国のグスク及び関連遺産群」の一つです。城跡の中には拝所もあり、今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。城壁の上や石段では足元に気をつけましょう。帰りは恩納村まで車で約1時間。今夜も恩納村に泊まります。";

async function main() {
  const day1Ids = [ZAKIMI, YUNTANZA, YACHIMUN_NO_SATO, ZANPA, MAEDA, ONNA_NO_EKI, MANZAMO, NABEE_BEACH];
  const day2Ids = [CHURAUMI, KAIYOHAKU, BISE, TINU_BEACH, NAKIJIN];
  const day3Ids = [TANCHA_BEACH, RYUKYU_MURA, MIHAMA, NAKAGUSUKU, NAKAMURA_HOUSE, TSUBOYA];
  const spots = await prisma.spot.findMany({ where: { id: { in: [...day1Ids, ...day2Ids, ...day3Ids] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
  };
  checkTime(ZAKIMI, 9, 0, "座喜味城跡");
  checkTime(MAEDA, 12, 25, "真栄田岬");
  checkTime(ONNA_NO_EKI, 13, 5, "おんなの駅");
  checkTime(MANZAMO, 14, 20, "万座毛");
  checkTime(NABEE_BEACH, 15, 10, "ナビービーチ");
  checkTime(BISE, 12, 40, "備瀬のフクギ並木");
  checkTime(TINU_BEACH, 14, 0, "ティーヌ浜");
  checkTime(NAKIJIN, 15, 25, "今帰仁城跡");
  checkTime(TANCHA_BEACH, 9, 0, "谷茶ビーチ");
  checkTime(RYUKYU_MURA, 9, 35, "琉球村");
  checkTime(MIHAMA, 11, 40, "美浜アメリカンビレッジ");
  checkTime(NAKAGUSUKU, 13, 25, "中城城跡");
  checkTime(TSUBOYA, 16, 20, "壺屋やちむん通り");
  if (byId.get(ONNA_NO_EKI)!.stayDurationMin !== 55) throw new Error("おんなの駅: 滞在の現在値が期待と不一致");
  if (byId.get(RYUKYU_MURA)!.stayDurationMin !== 90) throw new Error("琉球村: 滞在の現在値が期待と不一致");
  if (byId.get(MIHAMA)!.stayDurationMin !== 75) throw new Error("美浜アメリカンビレッジ: 滞在の現在値が期待と不一致");
  if (byId.get(NAKAGUSUKU)!.stayDurationMin !== 85) throw new Error("中城城跡: 滞在の現在値が期待と不一致");
  if (byId.get(ZAKIMI)!.memo !== ZAKIMI_MEMO_OLD) throw new Error("座喜味城跡: memo現在値が期待と不一致");
  if (byId.get(MAEDA)!.memo !== MAEDA_MEMO_OLD) throw new Error("真栄田岬: memo現在値が期待と不一致");
  if (byId.get(TSUBOYA)!.memo !== TSUBOYA_MEMO_OLD) throw new Error("壺屋やちむん通り: memo現在値が期待と不一致");
  if (byId.get(NAKAGUSUKU)!.memo !== NAKAGUSUKU_MEMO_OLD) throw new Error("中城城跡: memo現在値が期待と不一致");
  if (byId.get(TINU_BEACH)!.memo !== TINU_BEACH_MEMO_OLD) throw new Error("ティーヌ浜: memo現在値が期待と不一致");
  if (byId.get(NAKIJIN)!.memo !== NAKIJIN_MEMO_OLD) throw new Error("今帰仁城跡: memo現在値が期待と不一致");
  if (byId.get(BISE)!.memo !== BISE_MEMO_OLD) throw new Error("備瀬のフクギ並木: memo現在値が期待と不一致");
  if (byId.get(MIHAMA)!.memo !== MIHAMA_MEMO_OLD) throw new Error("美浜アメリカンビレッジ: memo現在値が期待と不一致");
  if (Number(byId.get(MANZAMO)!.lat) !== 26.505 || Number(byId.get(MANZAMO)!.lng) !== 127.850278) {
    throw new Error("万座毛: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(NABEE_BEACH)!.lat) !== 26.502327 || Number(byId.get(NABEE_BEACH)!.lng) !== 127.858359) {
    throw new Error("ナビービーチ: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(KAIYOHAKU)!.lat) !== 26.689698 || Number(byId.get(KAIYOHAKU)!.lng) !== 127.876677) {
    throw new Error("海洋博公園: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(MIHAMA)!.lat) !== 26.316521 || Number(byId.get(MIHAMA)!.lng) !== 127.757364) {
    throw new Error("美浜アメリカンビレッジ: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(TANCHA_BEACH)!.lat) !== 26.464243 || Number(byId.get(TANCHA_BEACH)!.lng) !== 127.830719) {
    throw new Error("谷茶ビーチ: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(BISE)!.lat) !== 26.703044 || Number(byId.get(BISE)!.lng) !== 127.884389) {
    throw new Error("備瀬のフクギ並木: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(NAKIJIN)!.lat) !== 26.692208 || Number(byId.get(NAKIJIN)!.lng) !== 127.927919) {
    throw new Error("今帰仁城跡: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(NAKAGUSUKU)!.lat) !== 26.28564 || Number(byId.get(NAKAGUSUKU)!.lng) !== 127.803301) {
    throw new Error("中城城跡: 座標の現在値が期待と不一致");
  }
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY } });
  if (it.description !== DESC_OLD) throw new Error("説明文: 現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log("[Day1] 座喜味城跡11:37(45)→真栄田岬12:41(30,car19)→おんなの駅13:21(45,car10、昼食)→万座毛14:26(40,car20)→ナビービーチ15:14(80,car8、16:34出発)");
  console.log("[Day2] 沖縄美ら海水族館09:00(120)→海洋博公園(エメラルドビーチ)11:11(85,walk11)→備瀬12:42(45,car6)→ティーヌ浜14:11(60,car44)→今帰仁城跡15:49(65,car38、16:54出発)");
  console.log("[Day3] 谷茶ビーチ09:00(20)→琉球村09:35(88,car15)→美浜11:30(60,car27、昼食)→中城城跡12:50(66,car20)→壺屋やちむん通り14:30(30,car34、15:00出発)");
  console.log("[座標] 万座毛→natural=cape node2004524873。ナビービーチ→natural=beach way232021419。谷茶ビーチ→谷茶浜way1470043968。備瀬→Bise Fukugi node5895799085。海洋博公園→エメラルドビーチnode4918629222。美浜→「美浜アメリカンビレッジ入口」node5599933722。今帰仁城跡→historic=castle way218648052。中城城跡→historic=archaeological_site way218650220");
  console.log("[文] 座喜味城跡の入口の一文を新規追加。真栄田岬・壺屋やちむん通り・中城城跡・ティーヌ浜・今帰仁城跡・備瀬・美浜の書き出しの分数を更新。中城城跡のお墓・今帰仁城跡の拝所を決まりの一文の形に直す。説明文から外した4か所の名前を削除");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY }, data: { description: DESC_NEW } });

      await setDaySpotOrder(
        DAY1,
        [
          { id: ZAKIMI, data: { visitTime: t(11, 37), memo: ZAKIMI_MEMO_NEW } },
          {
            id: MAEDA,
            data: {
              visitTime: t(12, 41),
              memo: MAEDA_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 19 }] },
            },
          },
          { id: ONNA_NO_EKI, data: { visitTime: t(13, 21), stayDurationMin: 45 } },
          {
            id: MANZAMO,
            data: { visitTime: t(14, 26), lat: 26.5053825, lng: 127.8503534 },
          },
          {
            id: NABEE_BEACH,
            data: {
              visitTime: t(15, 14),
              lat: 26.5033304,
              lng: 127.8588741,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
            },
          },
        ],
        { remove: [YUNTANZA, YACHIMUN_NO_SATO, ZANPA], tx }
      );

      await setDaySpotOrder(
        DAY2,
        [
          { id: CHURAUMI, data: {} },
          {
            id: KAIYOHAKU,
            data: {
              visitTime: t(11, 11),
              lat: 26.6995474,
              lng: 127.878437,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
            },
          },
          {
            id: BISE,
            data: {
              visitTime: t(12, 42),
              lat: 26.7028431,
              lng: 127.88057,
              memo: BISE_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6 }] },
            },
          },
          {
            id: TINU_BEACH,
            data: {
              visitTime: t(14, 11),
              memo: TINU_BEACH_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 44 }] },
            },
          },
          {
            id: NAKIJIN,
            data: {
              visitTime: t(15, 49),
              lat: 26.6908894,
              lng: 127.9297334,
              memo: NAKIJIN_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 38 }] },
            },
          },
        ],
        { tx }
      );

      await setDaySpotOrder(
        DAY3,
        [
          { id: TANCHA_BEACH, data: { lat: 26.4697304, lng: 127.8289612 } },
          { id: RYUKYU_MURA, data: { stayDurationMin: 88 } },
          {
            id: MIHAMA,
            data: {
              visitTime: t(11, 30),
              stayDurationMin: 60,
              lat: 26.3147157,
              lng: 127.7611347,
              memo: MIHAMA_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 27 }] },
            },
          },
          {
            id: NAKAGUSUKU,
            data: {
              visitTime: t(12, 50),
              stayDurationMin: 66,
              lat: 26.2839342,
              lng: 127.8011595,
              memo: NAKAGUSUKU_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20 }] },
            },
          },
          {
            id: TSUBOYA,
            data: {
              visitTime: t(14, 30),
              memo: TSUBOYA_MEMO_NEW,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 34 }] },
            },
          },
        ],
        { remove: [NAKAMURA_HOUSE], tx }
      );
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
