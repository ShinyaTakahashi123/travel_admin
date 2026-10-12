/**
 * #363の続き。法務の指摘(記録879f114)も含む: ドッコ沼のほとりに蔵王大権現が
 * 祀られているため、拝む一文とクマへの注意(鈴・決められた道・出会ったら静かに
 * 離れる)を追加する。
 *
 * 企画運営の指摘: fix-363eでドッコ沼への道のりに蔵王中央ロープウェイの
 * 乗車を足したのは誤り。中央ロープウェイのスポットで、すでに鳥兜駅(山上)まで
 * 上っているため、ドッコ沼へは鳥兜駅から歩くだけでよい。逆に、ドッコ沼から
 * 大露天風呂(温泉街・谷側)へは、鳥兜駅へ歩いて戻り、ロープウェイで温泉駅まで
 * 下り、そこから歩く必要がある。本文・transitLegs・時刻を直す。
 *
 * 新しい時刻(14:22に中央ロープウェイ到着のあと):
 * ドッコ沼(歩き8分、14:30開始・35分)→大露天風呂(歩き8分+ロープウェイ8分+歩き9分、
 * 15:30開始・60分→16:30終了)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-363f-ca4cf898.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "ca4cf898-7e26-4db6-89da-0d1af4d45c81";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const dokkonuma = await prisma.spot.findFirstOrThrow({ where: { name: "ドッコ沼", day: { itineraryId: ITIN_ID } } });
  const oldDokkoOpen = "蔵王中央ロープウェイで鳥兜駅まで上り、そこから歩いて8分ほど、次に訪れるのはドッコ沼です。";
  const newDokkoOpen = "蔵王中央ロープウェイから歩いて8分ほど、次に訪れるのはドッコ沼です。";
  const oldDokkoClose = "見学を終えたら、歩いて蔵王温泉大露天風呂へ向かいましょう。";
  const newDokkoClose = "見学を終えたら、歩いて鳥兜駅へ戻り、蔵王中央ロープウェイで温泉駅まで下りて、蔵王温泉大露天風呂へ向かいましょう。";
  const oldDokkoSafety = "新緑に囲まれた沼の水面を眺めながら、静かな時間を過ごしましょう。";
  const newDokkoSafety =
    "新緑に囲まれた沼の水面を眺めながら、静かな時間を過ごしましょう。蔵王大権現が祀られている場所なので、静かに、敬意をもってお参りしましょう。山の中を歩く際は、鈴を鳴らすなどして物音を立て、決められた道を歩き、クマに出会ったときは静かにその場を離れましょう。";
  if (dokkonuma.memo?.includes(oldDokkoOpen) || dokkonuma.memo?.includes(oldDokkoClose) || dokkonuma.memo?.includes(oldDokkoSafety)) {
    let memo = dokkonuma.memo ?? "";
    if (memo.includes(oldDokkoOpen)) memo = memo.replace(oldDokkoOpen, newDokkoOpen);
    if (memo.includes(oldDokkoSafety)) memo = memo.replace(oldDokkoSafety, newDokkoSafety);
    if (memo.includes(oldDokkoClose)) memo = memo.replace(oldDokkoClose, newDokkoClose);
    await updateSpotInItinerary(ITIN_ID, { spotId: dokkonuma.id }, {
      memo,
      visitTime: T(14, 30),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
    });
    console.log("ドッコ沼: 書き出し・結び・transitLegsを修正(中央ロープウェイからは歩きだけ)、拝む一文・クマの注意を追加");
  } else {
    console.log("ドッコ沼: 既に対応済み");
  }

  const rotenburo = await prisma.spot.findFirstOrThrow({ where: { name: "蔵王温泉大露天風呂", day: { itineraryId: ITIN_ID } } });
  const oldRotenOpen = "ドッコ沼から歩いて20分ほど、旅の最後に訪れるのは蔵王温泉大露天風呂です。";
  const newRotenOpen = "ドッコ沼から鳥兜駅へ歩いて戻り、蔵王中央ロープウェイで温泉駅まで下りて歩くこと、旅の最後に訪れるのは蔵王温泉大露天風呂です。";
  if (rotenburo.memo?.includes(oldRotenOpen)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: rotenburo.id }, {
      memo: rotenburo.memo.replace(oldRotenOpen, newRotenOpen),
      visitTime: T(15, 30),
      transitLegs: {
        deleteMany: {},
        create: [
          { orderNo: 1, transitMode: "walk", transitDurationMin: 8 },
          { orderNo: 2, transitMode: "other", transitDurationMin: 8, transitLine: "蔵王中央ロープウェイ" },
          { orderNo: 3, transitMode: "walk", transitDurationMin: 9 },
        ],
      },
    });
    console.log("蔵王温泉大露天風呂: 書き出し・transitLegs(歩き+ロープウェイ下り+歩き)・到着時刻を修正");
  } else {
    console.log("蔵王温泉大露天風呂: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
