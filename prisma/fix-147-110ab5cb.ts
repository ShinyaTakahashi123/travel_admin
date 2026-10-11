/**
 * #147 110ab5cb「萬代橋とみなとぴあ、定番の新潟市内さんぽ日帰りプラン」の直し。
 * 1日4か所以上・9時ごろ〜17時ごろの決まりに合わせる。
 *
 * もとは萬代橋・みなとぴあの2か所(09:30〜11:22)、終始案内役の話し方だった。
 * 既存の2本(白山神社・白山公園・新潟県政記念館・りゅーとぴあ・本町市場・旧齋藤家別邸・
 * 新潟市美術館・湊稲荷神社を使うcde2cce6、白山神社・新潟県立植物園・新潟市美術館・萬代橋・
 * 砂丘館を使う2ba1ca12、萬代橋・ぽんしゅ館新潟驛店を使うpendingの6eb0ef87)と重ならない
 * 4か所(朱鷺メッセ展望室・旧小澤家住宅・日和山展望台・マリンピア日本海)を新規に追加。
 *
 * ・萬代橋: 案内役の話し方(皆様/ご案内)を直し、初代(明治19年/1886)→大火で半分焼失
 *   (明治41年/1908)→2代目(明治42年/1909)→3代目(昭和4年/1929)という移り変わりの
 *   切り口に書き直す。次の行き先を朱鷺メッセに変更。
 * ・みなとぴあ: 本館の長期休館(令和8年9月〜令和9年6月末ごろ)は維持しつつ、休館中も
 *   旧新潟税関庁舎・旧第四銀行住吉町支店は見学できることを明記(新潟市公式サイトのPDFで
 *   確認)。滞在を60分→40分に短縮。
 * ・朱鷺メッセ展望室: 地上125m・31階、入場無料(運営会社名は出さない書き方)。「随一」は
 *   同じ文で「とされ」とぼかす。
 * ・旧小澤家住宅: 北前船の時代に新潟で栄えた商家の住宅、新潟市文化財(国の重要文化財では
 *   ない点に注意)。
 * ・日和山展望台: 名前の由来(天候=日和を見た)・明治13年(1880)の大火・昭和52年(1977)
 *   再建の展望塔、日本遺産の構成資産。
 * ・マリンピア日本海: 日本海の生き物中心の水族館、昼食をここで済ませる想定で滞在を
 *   長めに取る。
 *
 * 座標はすべてOSM Nominatimで確認(新潟市中央区): 朱鷺メッセway314690632、
 * 旧小澤家住宅way420474379、日和山展望台node3201036597、マリンピア日本海way81050878。
 *
 * 金額の言及(入場無料など)はしない。安吾 風の館は耐震不足で休館中(令和6年/2024年1月〜)
 * のため候補から除外。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BANDAI_FROM =
  "皆様、本日ご案内するのは萬代橋です。新潟駅からバスでおよそ15分、信濃川に架かるこの橋は、新潟市を象徴するランドマークとして親しまれています。初代の橋は明治19年(1886)に完成し、現在の橋は3代目にあたり、昭和4年(1929)に架け替えられました。平成16年(2004)には、国道にかかる橋としては東京の日本橋に次いで2番目に、国の重要文化財に指定されました。連続する6連のアーチが美しい姿を描き、川面に映るその景観は、新潟を代表する風景として、写真や絵画にもたびたび描かれてきました。信濃川の川風を感じながら、この歴史ある橋をゆっくりと渡ってみてください。散策のあとは、新潟の開港の歴史を伝える、みなとぴあへとご案内いたします。";

const BANDAI_TO =
  "新潟駅からバスでおよそ15分、信濃川に架かる萬代橋に着きます。新潟市を象徴するランドマークとして親しまれているこの橋は、初代が明治19年(1886)に完成しました。もとは民間の有料橋でしたが、明治33年(1900)に新潟県が買い取って無料になりました。明治41年(1908)の大火で半分を焼失し、明治42年(1909)に2代目の橋が架けられ、現在の3代目は昭和4年(1929)に完成しています。平成16年(2004)には、国道にかかる橋としては東京の日本橋に次いで2番目に、国の重要文化財に指定されました。連続する6連のアーチが美しい姿を描き、川面に映る景観は新潟を代表する風景として親しまれています。この後は、歩いておよそ12分、朱鷺メッセへ向かいましょう。";

const MINATOPIA_FROM =
  "続いてご案内するのは新潟市歴史博物館・みなとぴあです。江戸時代末期に開港した5つの港「開港五港」のうち、当時の税関庁舎が今も残っているのは新潟だけといわれ、国の重要文化財に指定された旧新潟税関庁舎を中心に、明治から昭和初期にかけての港町の風情を伝える施設です。移築復元された旧第四銀行住吉町支店や、荷揚げ用の石段、水路なども復元され、当時の港の賑わいをしのぶことができます。本館は令和8年(2026)9月から空調改修工事のため長期休館中で、令和9年(2027)6月末ごろの再開が予定されており、その間は旧第四銀行住吉町支店で企画展を開催しているとのことです。お出かけ前には、開館状況を公式サイトなどで確かめてください。萬代橋と、この開港の歴史を伝える施設、両方から新潟市の成り立ちを感じる散歩をお楽しみいただけたことでしょう。";

const MINATOPIA_TO =
  "朱鷺メッセから歩いておよそ6分、新潟市歴史博物館・みなとぴあに着きます。江戸時代末期に開港した5つの港「開港五港」のうち、当時の税関庁舎が今も残っているのは新潟だけといわれ、国の重要文化財に指定された旧新潟税関庁舎を中心に、明治から昭和初期にかけての港町の風情を伝える施設です。移築復元された旧第四銀行住吉町支店や、荷揚げ用の石段、水路なども復元され、当時の港の賑わいをしのぶことができます。本館は令和8年(2026)9月から空調改修工事のため長期休館中で、令和9年(2027)6月末ごろの再開が予定されていますが、旧新潟税関庁舎と旧第四銀行住吉町支店は休館中も見学できます。お出かけ前には、公式サイトなどで開館状況を確かめてください。この後は、歩いておよそ10分、旧小澤家住宅へ向かいましょう。";

const TOKIMESSE_MEMO =
  "萬代橋から歩いておよそ12分、朱鷺メッセの最上階にある展望室に着きます。地上125mの高さがあり、日本海側では随一の高さだとされています。新潟市街や信濃川の流れ、日本海を見渡せ、晴れた日には佐渡島まで見えることもあります。この後は、歩いておよそ6分、みなとぴあへ向かいましょう。";

const OZAWAKE_MEMO =
  "みなとぴあから歩いておよそ10分、旧小澤家住宅に着きます。江戸時代後期から新潟町で活躍した商家・小澤家の、店舗と住宅を兼ねた建物で、新潟町家の造りを今に伝えています。主屋や蔵、庭などが新潟市の文化財に指定されています。北前船の時代、新潟の港で栄えた商人の暮らしぶりがうかがえます。この後は、歩いておよそ9分、日和山展望台へ向かいましょう。";

const HIYORIYAMA_MEMO =
  "旧小澤家住宅から歩いておよそ9分、日和山展望台に着きます。かつて新潟の港に出入りする船を見張るため、漁師たちが天候(日和)を見ていたことが名前の由来だと伝わります。もとの日和山は明治13年(1880)の大火で焼け、翌年に少し離れた今の場所に再建されて、見晴らしの良い行楽地として知られるようになりました。今の展望塔は昭和52年(1977)に建てられたもので、北前船の時代の歴史を伝える日本遺産の構成資産にもなっています。この後は、タクシーでおよそ7分、マリンピア日本海へ向かいましょう。";

const MARINEPIA_MEMO =
  "日和山展望台からタクシーでおよそ7分、新潟市水族館マリンピア日本海に着きます。日本海の生き物を中心に、およそ600種、2万点の生き物を飼育する水族館です。日本海大水槽の底にはマリントンネルがあり、水中を歩いているような景色を楽しめます。イルカのショーも日替わりで行われています。館内には食事ができる場所もあるので、ここで昼食をとるとよいでしょう。見学の最後には、館のすぐそばに広がる松林と砂浜を少し歩いてみるのもおすすめです。";

const DESCRIPTION =
  "新潟市のシンボル・萬代橋から、開港の歴史を伝える建物や展望スポット、水族館までをめぐる、新潟市内さんぽの日帰りプランです。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '110ab5cb%'`);
  const itinId = rows[0].id;
  const bandai = await findSpotInItinerary(itinId, { spotName: "萬代橋" });
  const minatopia = await findSpotInItinerary(itinId, { spotName: "新潟市歴史博物館（みなとぴあ）" });
  const dayId = bandai.dayId;

  if (!bandai.memo?.includes(BANDAI_FROM)) throw new Error("萬代橋の文言が想定外です");
  if (!minatopia.memo?.includes(MINATOPIA_FROM)) throw new Error("みなとぴあの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });

    const day1: SpotOrderItem[] = [
      {
        id: bandai.id,
        data: {
          visitTime: t(9, 0),
          stayDurationMin: 30,
          memo: bandai.memo!.replace(BANDAI_FROM, BANDAI_TO),
        },
      },
      {
        create: {
          name: "朱鷺メッセ展望室",
          address: "新潟市中央区万代島6番1号",
          lat: 37.9262099,
          lng: 139.0600135,
          visitTime: t(9, 42),
          stayDurationMin: 30,
          memo: TOKIMESSE_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
        },
      },
      {
        id: minatopia.id,
        data: {
          visitTime: t(10, 18),
          stayDurationMin: 40,
          memo: minatopia.memo!.replace(MINATOPIA_FROM, MINATOPIA_TO),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
        },
      },
      {
        create: {
          name: "旧小澤家住宅",
          address: "新潟市中央区上大川前通十二番町2733番地",
          lat: 37.9294347,
          lng: 139.0488230,
          visitTime: t(11, 8),
          stayDurationMin: 40,
          memo: OZAWAKE_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "日和山展望台",
          address: "新潟市中央区本町通十四番町",
          lat: 37.9337132,
          lng: 139.0433846,
          visitTime: t(11, 57),
          stayDurationMin: 20,
          memo: HIYORIYAMA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
        },
      },
      {
        create: {
          name: "マリンピア日本海",
          address: "新潟市中央区西船見町5932-445",
          lat: 37.9236210,
          lng: 139.0279991,
          visitTime: t(12, 24),
          stayDurationMin: 250,
          memo: MARINEPIA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 7 }] },
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
