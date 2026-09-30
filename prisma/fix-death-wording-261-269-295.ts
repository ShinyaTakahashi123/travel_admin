/**
 * 法務2026-09-30 23:33「亡くなり方を書いている本文の洗い出し」
 * (docs/legal/20260930-death-wording-scan.md)のうち、制作補助担当の3本。
 * 決まり: 自ら命を絶つこと(自害・自決・殉死など)は歴史上の人物でも書かない
 * (「亡くなった」「最期を迎えた」までにする)。人数・年齢も書かない。
 * 評価の言葉(悲劇・壮絶など)も入れない。
 *
 * #261 瑞鳳殿(1d1afcce): 「家臣15名が殉死してその後を追った」→
 *   殉死と人数を外し「政宗公に仕えた家臣たち」に
 * #295 高館義経堂(49f34e12): 「義経公が妻子とともに自害したと伝えられて
 *   います」→「義経公が最期を迎えた地と伝えられています」
 * #269 飯盛山と白虎隊(28ec8b18): description・飯盛山・鶴ヶ城・会津武家屋敷
 *   の4か所。「自刃」「自らの命を絶った」と「19名」「21名」の人数、
 *   「悲劇」の評価語を外す
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-death-wording-261-269-295.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

async function main() {
  // --- #261 瑞鳳殿 ---
  {
    const ITIN_ID = "1d1afcce-6f77-400a-9a92-04dd868d6e89";
    const s = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "瑞鳳殿" },
    });
    const old = "政宗公が亡くなった際には、家臣15名が殉死してその後を追ったと伝えられ、境内にはその家臣たちを祀る墓所も残されています。";
    const next = "境内には、政宗公に仕えた家臣たちをまつる墓所も残されています。";
    if (s.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
    } else if (!s.memo?.includes("家臣たちをまつる墓所")) {
      throw new Error("#261 瑞鳳殿のmemoが想定と異なります");
    }
  }

  // --- #295 高館義経堂 ---
  {
    const ITIN_ID = "49f34e12-2e9b-40d5-b4ac-f10e85d536f1";
    const s = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "高館義経堂" },
    });
    const old = "文治5年(1189)、頼朝の圧迫を受けた泰衡公の急襲にあい、義経公が妻子とともに自害したと伝えられています。";
    const next = "文治5年(1189)、頼朝の圧迫を受けた泰衡公の急襲にあい、義経公が最期を迎えた地と伝えられています。";
    if (s.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
    } else if (!s.memo?.includes("義経公が最期を迎えた地")) {
      throw new Error("#295 高館義経堂のmemoが想定と異なります");
    }
  }

  // --- #269 飯盛山と白虎隊 ---
  {
    const ITIN_ID = "28ec8b18-c34e-4f95-a166-830976a70133";

    const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
    const oldDesc = "白虎隊士が自刃した飯盛山。幕末の会津戦争の悲劇を伝える史跡を訪ね、会津武家屋敷で藩士の暮らしにふれるプランです。";
    const newDesc = "白虎隊ゆかりの飯盛山。幕末の会津戦争を伝える史跡を訪ね、会津武家屋敷で藩士の暮らしにふれるプランです。";
    if (itin.description === oldDesc) {
      await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDesc } });
    } else if (itin.description !== newDesc) {
      throw new Error("#269 descriptionが想定と異なります: " + itin.description);
    }

    const iimoriyama = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "飯盛山" },
    });
    const oldIimoriyama =
      "遠くに見えた煙を鶴ヶ城の落城と思い込み、主君のためにと、この地で自らの命を絶ったと伝えられています(この経緯には諸説あります)。実際には城は落城しておらず、19名の隊士が命を落とすという悲劇となりました。唯一助かったとされる隊士の証言により、この出来事は今に語り継がれています。山の中腹には、木造建築としては珍しい二重らせん構造を持つ「さざえ堂」も残っています。命を落とした若い隊士たちに思いを馳せ、静かに、敬意をもって見学しましょう。";
    const nextIimoriyama =
      "遠くに見えた煙を鶴ヶ城の落城と思い込み、主君のためにと、この地で亡くなったと伝えられています(この経緯には諸説あります)。実際には城は落城していませんでした。唯一助かったとされる隊士の証言により、この出来事は今に語り継がれています。山の中腹には、木造建築としては珍しい二重らせん構造を持つ「さざえ堂」も残っています。亡くなった若い隊士たちに思いを馳せ、静かに、敬意をもって見学しましょう。";
    if (iimoriyama.memo?.includes(oldIimoriyama)) {
      await updateSpotInItinerary(
        ITIN_ID,
        { spotId: iimoriyama.id },
        { memo: iimoriyama.memo.replace(oldIimoriyama, nextIimoriyama) }
      );
    } else if (!iimoriyama.memo?.includes("この地で亡くなったと伝えられています")) {
      throw new Error("#269 飯盛山のmemoが想定と異なります");
    }

    const tsurugajo = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "鶴ヶ城" },
    });
    const oldTsurugajo = "飯盛山で自ら命を絶った白虎隊士中二番隊が、落城したと思い込んだのが、まさにこの鶴ヶ城です。";
    const nextTsurugajo = "飯盛山で亡くなった白虎隊士中二番隊が、落城したと思い込んだのが、まさにこの鶴ヶ城です。";
    if (tsurugajo.memo?.includes(oldTsurugajo)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: tsurugajo.id }, { memo: tsurugajo.memo.replace(oldTsurugajo, nextTsurugajo) });
    } else if (!tsurugajo.memo?.includes("飯盛山で亡くなった白虎隊士中二番隊")) {
      throw new Error("#269 鶴ヶ城のmemoが想定と異なります");
    }

    const bukeYashiki = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "会津武家屋敷" },
    });
    const oldBuke =
      "頼母の妻子ら一族21名は、敵の手にかかることを良しとせず、その屋敷で自ら命を絶ったと伝えられています。";
    const nextBuke = "頼母の妻子ら一族は、その屋敷で最期を迎えたと伝えられています。";
    let bukeMemo = bukeYashiki.memo ?? "";
    if (bukeMemo.includes(oldBuke)) {
      bukeMemo = bukeMemo.replace(oldBuke, nextBuke);
    } else if (!bukeMemo.includes("その屋敷で最期を迎えたと伝えられています")) {
      throw new Error("#269 会津武家屋敷のmemoが想定と異なります");
    }
    // 「悲劇」は決まりで禁止の評価語のため、この一文からも外す(2026-09-30
    // 自己チェックで気づいた追加分。法務の元の指摘には明記されていなかった)
    const oldBukeHigeki = "会津藩士とその家族が置かれた、戦の悲劇を今に伝える場所として、静かに、敬意をもって見学しましょう。";
    const nextBukeHigeki = "会津藩士とその家族が置かれた、戦乱の歴史を今に伝える場所として、静かに、敬意をもって見学しましょう。";
    if (bukeMemo.includes(oldBukeHigeki)) {
      bukeMemo = bukeMemo.replace(oldBukeHigeki, nextBukeHigeki);
    }
    if (bukeMemo !== bukeYashiki.memo) {
      await updateSpotInItinerary(ITIN_ID, { spotId: bukeYashiki.id }, { memo: bukeMemo });
    }
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
