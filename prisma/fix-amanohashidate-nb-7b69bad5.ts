/**
 * 天橋立・南北の絶景(7b69bad5)の組み直し(2026-11-04)。企画運営・法務のOKに基づく。
 * - 智恩寺・天橋立ビューランド・天橋立(南側入口)・元伊勢籠神社・傘松公園の点を直す
 *   (智恩寺・天橋立・傘松は6ba2fc04と同じ点)
 * - 智恩寺→ビューランドを「歩き(もんじゅ駅まで)+リフト」の2区間に分ける(公式viewland.jp/lift_mono、リフト6分)
 * - ビューランド→天橋立(南側入口)を「リフトで下る+歩き」に分ける(実測)
 * - 天橋立(南側入口)→元伊勢籠神社の「歩き30分」を実測の「歩き44分」に直す(3.6kmの砂州を渡りきる区間。
 *   決まりの「歩きの長すぎる区間も直す」は、町なかの移動でなく渡ること自体が目的のため適用しない。
 *   企画運営・法務のOK、2026-11-04)
 * - 元伊勢籠神社の滞在に入っていた昼食を、新しいスポット「籠神社参道」(バス停の点、店ではない)に分ける
 * - 元伊勢籠神社→傘松公園を「歩き+ケーブルカー」の2区間に分ける(昼食スポットをはさむため)
 * - 傘松公園⇄成相寺の登山バスは、待ち時間(公式の運行間隔から13分)と乗車(7分、公式)を分けて見せる
 * - 成相寺→旧三上家住宅の「バス45分」を4区間(登山バス・ケーブルカー・路線バス・市役所前からの歩き)に分ける。
 *   路線バスの42分は丹海バス伊根・蒲入線の公式時刻表(https://www.tankai.jp/routebus/timetable/、
 *   「府中診療所前」→「市役所前」の同じ便の時刻の差、上り下りとも一致)で確かめた値。
 *   帰りの登山バスの待ちは、成相寺が自分の都合で出る時刻を選べる場所なので区間にせず、
 *   成相寺のメモの終わりに「帰りの登山バスの時刻に合わせて出ましょう」と書く(時刻・本数は書かない)。
 *   これで4区間(7+4+42+8=61分)と実際のvisitTimeの差がなくなる(法務・企画運営 2026-11-04)
 * - 智恩寺・元伊勢籠神社・成相寺の祈りの一文を決まりの形に。「三文殊の一つに数えられる」→「一つとされる」
 * - 始まりを9:00→8:30に早め(8:30〜9:30の中)、待ち時間を見える形にした分を吸収
 * - 天橋立(南側入口)の滞在を25分→12分に短縮(小天橋・廻旋橋をながめる程度、渡ること自体は44分の歩きで表現)
 * - 天橋立(南側入口)の写真(6ba2fc04で外したのと同じ、傘松公園からの見下ろし)を外す
 * - 説明文の「定番」を外す。傘松公園の重複した一文を外す
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "7b69bad5-c0d8-4906-bb6c-a8fba0ca1053";
const DAY_ID = "6b1970e8-a8e0-4c20-8543-1f1fc53cb7ca";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const CHIONJI_ID = "bff377a2-e000-49de-95fd-da8371bcdf3b";
const VIEWLAND_ID = "dde76e6b-1696-46db-b1ed-8d47e6f385c0";
const HASHIDATE_ID = "6ee2a312-0ff9-4f26-9915-9b84edc0af7a";
const KONOJINJA_ID = "3ef89a0d-0d24-4f74-9d33-5d80a6e7acf2";
const KASAMATSU_ID = "09d59aeb-ed38-4af4-ab55-a3a7eb6efe62";
const NARIAIJI_ID = "3e96951f-8841-4091-8caf-dcb7f459ef10";
const MIKAMIKE_ID = "a521622a-ee0a-44c4-a065-dc421b75110b";
const HASHIDATE_PHOTO_ID = "d518c21a-c673-4f85-98ce-ca8c263a59d8";

const DESC_OLD =
  "日本三景・天橋立の名物ビューポイントを南北両側から楽しむ、定番の日帰りプランです。天橋立ビューランドと傘松公園、2つの「股のぞき」を体験できます。";
const DESC_NEW =
  "日本三景・天橋立の名物ビューポイントを南北両側から楽しむ日帰りプランです。天橋立ビューランドと傘松公園、2つの「股のぞき」を体験できます。";

const BEFORE = {
  [CHIONJI_ID]: { lat: "35.558583", lng: "135.183778", visitTime: "09:00" },
  [VIEWLAND_ID]: { lat: "35.5525", lng: "135.18175", visitTime: "09:40", legMin: 10 },
  [HASHIDATE_ID]: { lat: "35.569361", lng: "135.191528", visitTime: "10:55", stay: 70, legMin: 15 },
  [KONOJINJA_ID]: { lat: "35.582814", lng: "135.196669", visitTime: "12:35", legMin: 30 },
  [KASAMATSU_ID]: { lat: "35.5869", lng: "135.1947", visitTime: "13:10", legMin: 5 },
  [NARIAIJI_ID]: { visitTime: "14:07", legMin: 7 },
  [MIKAMIKE_ID]: { visitTime: "15:52", legMin: 45 },
};

const CHIONJI_MEMO =
  "天橋立駅から歩いておよそ8分、天橋立観光の起点となる、日本三文殊の一つとされる古刹・智恩寺(文殊堂)に着きます。寺伝によれば、混沌とした国土を鎮めるため、中国から文殊菩薩を迎えたのが始まりと伝えられ、大同3年(808年)に平城天皇の勅願で創建されたとも、延喜4年(904年)に醍醐天皇から寺号を賜ったとも言われています。「三人寄れば文殊の智恵」という言葉の由来にもなった知恵の仏様として、古くから信仰を集めてきました。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ7分、リフト「もんじゅ」駅へ。リフトで6分、天橋立ビューランドへ向かいましょう。";

const VIEWLAND_MEMO =
  "智恩寺からリフト「もんじゅ」駅まで歩いておよそ7分、リフトで6分、文珠山の山上にある、天橋立を南側から一望できる展望施設、天橋立ビューランドに着きます。1970年に開設され、リフトやモノレールで山頂まで登ります。股の間からのぞき込んで見る眺めは、天橋立が天に舞い上がる龍のように見えることから「飛龍観」と名づけられています。北側の傘松公園から見る「昇龍観」とは、また違った表情の天橋立を楽しめます。この後は、リフトで山を下りておよそ6分、歩いておよそ6分、天橋立の松並木を目指しましょう。";

const HASHIDATE_MEMO =
  "天橋立ビューランドからリフトで山を下りておよそ6分、歩いておよそ6分、天橋立の松並木、小天橋(廻旋橋)のたもとに着きます。ここから、白砂に黒松が連なる全長およそ3.6kmの砂州を、実際に歩いて渡ります。『丹後国風土記』に記された、天と地を結ぶ橋が倒れてできたという伝説の地を、両側に潮風の香る松林を眺めながら進みましょう。砂州の上には木陰が少ないので、日差しや水分補給に気をつけながら歩きましょう。この後は、松並木を歩いて渡りきり、およそ44分、元伊勢籠神社へ向かいましょう。";

const KONOJINJA_MEMO =
  "小天橋から松並木を歩いて渡り、およそ44分、丹後国の一宮、元伊勢籠神社に着きます。「元伊勢」の別名を持つ格式高い神社です。社伝によれば、現在は伊勢神宮に祀られる天照大神・豊受大神は、伊勢に遷る前はこの地に祀られていたと伝えられ、これが「元伊勢」の名の由来です。両神がともに祀られたのはこの地だけとされ、奥宮の眞名井神社とあわせて、伊勢神宮のルーツを感じられる一社です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分、籠神社参道へ向かいましょう。";

const SANDO_MEMO =
  "元伊勢籠神社から歩いておよそ4分、籠神社参道に着きます。参道沿いには食事処が並んでいるので、ここで昼食にしましょう。この後は、歩いておよそ4分、ケーブルカーとあわせておよそ8分、傘松公園へ向かいましょう。";

const KASAMATSU_MEMO =
  "籠神社参道から歩いておよそ4分、ケーブルカーとあわせておよそ8分、天橋立を北側から見る「股のぞき」の名所、傘松公園に着きます。展望台へと続く道にある「傘松」という松にちなんで名づけられたと伝えられ、股の間からのぞくと、天橋立が天に舞い上がる龍のように見える「昇龍観」を楽しめます。この後は、登山バスの待ち時間とあわせておよそ20分、成相寺へ向かいましょう。本数の少ない登山バスなので、最新の時刻は公式の時刻表で確かめましょう。";

const NARIAIJI_MEMO =
  "傘松公園から、登山バスの待ち時間とあわせておよそ20分(本数は多くないので、最新の時刻は公式の時刻表で確かめましょう)、標高569mの成相山の中腹に建つ成相寺に着きます。慶雲元年(704)、文武天皇の勅願を受けた真応上人が開いたと伝わる、西国三十三所観音霊場の第28番札所です。三十三所の中でも最北端に位置する札所として知られています。本尊の聖観世音菩薩は「美人観音」とも呼ばれ、飢えに苦しむ僧のために自らの膝の肉を鹿肉と偽って与えたという「身代わり観音」の伝説も残っています。境内にある2つの展望台からは、傘松公園とはまた違う角度から、天橋立を見下ろす絶景を楽しめます。春の桜・シャクナゲ、秋の紅葉など、四季の花々でも知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、帰りの登山バスの時刻に合わせて、成相寺を出ましょう。登山バスでおよそ7分、傘松駅へ。ケーブルカーでおよそ4分、路線バスでおよそ42分、宮津市街の市役所前へ。そこから歩いておよそ8分、旧三上家住宅へ向かいましょう。最新の時刻は公式の時刻表で確かめましょう。";

const MIKAMIKE_MEMO =
  "成相寺から、帰りの登山バスでおよそ7分、傘松駅へ戻ります。ケーブルカーでおよそ4分、府中へ。路線バスでおよそ42分、宮津市街の市役所前に着き、そこから歩いておよそ8分、旧三上家住宅に着きます。本数の少ない路線バスなので、最新の時刻は公式の時刻表で確かめましょう。江戸時代から昭和にかけて、酒造業や廻船業を営んだ宮津の豪商・三上家の旧宅です。主屋をはじめ8棟の建物が、国の重要文化財に指定されています。式台や座敷、蔵など、往時の繁栄をしのばせる意匠の数々を見学できます。休館日があるので、訪れる前に公式サイトで確かめましょう。天橋立の南北の絶景に、宮津の商家文化を加えた1日をめぐる旅も、ここで終わりです。お帰りは、宮津駅まで歩いておよそ15分です。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { include: { spots: { include: { transitLegs: true }, orderBy: { orderNo: "asc" } } } } },
  });
  if (itin.description !== DESC_OLD) throw new Error("前提確認: 説明文が期待と不一致");
  const day = itin.days.find((d) => d.id === DAY_ID)!;
  const byId = new Map(day.spots.map((s) => [s.id, s]));

  for (const [id, before] of Object.entries(BEFORE)) {
    const s = byId.get(id);
    if (!s) throw new Error(`前提確認: スポット ${id} が見つかりません`);
    if ("lat" in before && (s.lat?.toString() !== before.lat || s.lng?.toString() !== before.lng)) {
      throw new Error(`前提確認: ${s.name} の点が期待と不一致 (now ${s.lat},${s.lng})`);
    }
    const vt = s.visitTime ? s.visitTime.toISOString().slice(11, 16) : null;
    if (vt !== before.visitTime) throw new Error(`前提確認: ${s.name} のvisitTimeが期待と不一致 (now ${vt})`);
    if ("stay" in before && s.stayDurationMin !== before.stay) throw new Error(`前提確認: ${s.name} の滞在が期待と不一致`);
    if ("legMin" in before) {
      const leg = s.transitLegs[0];
      if (!leg || leg.transitDurationMin !== before.legMin) throw new Error(`前提確認: ${s.name} の入りの移動分が期待と不一致`);
    }
  }
  const photo = await prisma.photo.findUniqueOrThrow({ where: { id: HASHIDATE_PHOTO_ID } });
  if (photo.spotId !== HASHIDATE_ID) throw new Error("前提確認: 天橋立の写真のspotIdが期待と不一致");
  console.log("前提の確認OK。7スポット(既存)の値・写真1枚が期待どおりでした。\n");

  // 書き込むデータそのもの(この配列)を、確認モードの表示にも--commitの書き込みにも、同じものを使う
  const SPOTS: { label: string; item: import("./lib/spot-order").SpotOrderItem }[] = [
    {
      label: "智恩寺",
      item: {
        id: CHIONJI_ID,
        data: { lat: "35.558684", lng: "135.184075", visitTime: T(8, 30), memo: CHIONJI_MEMO, transitLegs: { deleteMany: {} } },
      },
    },
    {
      label: "天橋立ビューランド",
      item: {
        id: VIEWLAND_ID,
        data: {
          lat: "35.553087",
          lng: "135.182048",
          visitTime: T(9, 13),
          memo: VIEWLAND_MEMO,
          transitLegs: {
            deleteMany: {},
            create: [
              { orderNo: 1, transitMode: "walk", transitDurationMin: 7 },
              { orderNo: 2, transitMode: "other", transitDurationMin: 6 },
            ],
          },
        },
      },
    },
    {
      label: "天橋立(小天橋)",
      item: {
        id: HASHIDATE_ID,
        data: {
          lat: "35.557851",
          lng: "135.185481",
          address: "京都府宮津市字文珠",
          visitTime: T(10, 25),
          stayDurationMin: 12,
          memo: HASHIDATE_MEMO,
          transitLegs: {
            deleteMany: {},
            create: [
              { orderNo: 1, transitMode: "other", transitDurationMin: 6 },
              { orderNo: 2, transitMode: "walk", transitDurationMin: 6 },
            ],
          },
        },
      },
    },
    {
      label: "元伊勢籠神社",
      item: {
        id: KONOJINJA_ID,
        data: {
          lat: "35.582586",
          lng: "135.196863",
          visitTime: T(11, 21),
          memo: KONOJINJA_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 44 }] },
        },
      },
    },
    {
      label: "籠神社参道(昼食・新規)",
      item: {
        create: {
          name: "籠神社参道",
          address: "京都府宮津市大垣",
          lat: "35.581522",
          lng: "135.196192",
          visitTime: T(11, 55),
          memo: SANDO_MEMO,
          stayDurationMin: 40,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
    },
    {
      label: "傘松公園",
      item: {
        id: KASAMATSU_ID,
        data: {
          lat: "35.586759",
          lng: "135.195117",
          address: "京都府宮津市大垣",
          visitTime: T(12, 43),
          memo: KASAMATSU_MEMO,
          transitLegs: {
            deleteMany: {},
            create: [
              { orderNo: 1, transitMode: "walk", transitDurationMin: 4 },
              { orderNo: 2, transitMode: "other", transitDurationMin: 4 },
            ],
          },
        },
      },
    },
    {
      label: "成相寺",
      item: {
        id: NARIAIJI_ID,
        data: {
          visitTime: T(13, 53),
          memo: NARIAIJI_MEMO,
          transitLegs: {
            deleteMany: {},
            create: [
              { orderNo: 1, transitMode: "other", transitDurationMin: 13 },
              { orderNo: 2, transitMode: "bus", transitDurationMin: 7 },
            ],
          },
        },
      },
    },
    {
      label: "旧三上家住宅",
      item: {
        id: MIKAMIKE_ID,
        data: {
          visitTime: T(15, 54),
          memo: MIKAMIKE_MEMO,
          transitLegs: {
            deleteMany: {},
            create: [
              { orderNo: 1, transitMode: "bus", transitDurationMin: 7 },
              { orderNo: 2, transitMode: "other", transitDurationMin: 4 },
              { orderNo: 3, transitMode: "bus", transitDurationMin: 42 },
              { orderNo: 4, transitMode: "walk", transitDurationMin: 8 },
            ],
          },
        },
      },
    },
  ];

  console.log("=== 書き込むデータ(スポットごと: 点・時刻・滞在・区間) ===");
  for (const { label, item } of SPOTS) {
    if ("id" in item) {
      const d = item.data as Record<string, unknown>;
      const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
      const legs = d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined;
      const legsStr = legs?.create?.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") ?? "(変更なし)";
      console.log(`  [既存 ${item.id}] ${label}: 点=${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"} 着=${vt} 滞在=${d.stayDurationMin ?? "(変更なし)"} 区間=${legsStr}`);
    } else {
      const c = item.create as Record<string, unknown>;
      const legsCreate = (c.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
      const legsStr = legsCreate ? legsCreate.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(なし)";
      const vt = c.visitTime instanceof Date ? c.visitTime.toISOString().slice(11, 16) : String(c.visitTime);
      console.log(`  [新規] ${label}: 点=${c.lat},${c.lng} 着=${vt} 滞在=${c.stayDurationMin} 区間=${legsStr}`);
    }
  }
  console.log("\n  昼食(籠神社参道)着 11:55(11:30〜13:30に収まる) / 最後(旧三上家住宅)発 16:39(16:30〜17:00に収まる)\n");

  if (!commit) {
    console.log("確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW } });
    await tx.photo.delete({ where: { id: HASHIDATE_PHOTO_ID } });
    await setDaySpotOrder(
      DAY_ID,
      SPOTS.map((s) => s.item),
      { tx }
    );
  }, { timeout: 60000 });

  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
