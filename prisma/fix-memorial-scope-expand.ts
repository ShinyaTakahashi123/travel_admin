/**
 * 慰霊の印(isMemorial)の範囲拡大(企画運営・法務、2026-10-14決定)。
 *
 * 対象は place_master の id で指定(名前の重複・表記ゆれを避けるため)。
 * 確認モードでは、37件それぞれが1件ずつ実在することだけを確かめ、書き込みはしない。
 * --commit は、法務の最終確認のあと、企画運営から伝えられてから実行する。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-memorial-scope-expand.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-memorial-scope-expand.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const TARGET_IDS: { id: string; note: string }[] = [
  { id: "651ce582-d77f-4f96-aa24-e3cc89e1b7d1", note: "いわき震災伝承みらい館" },
  { id: "7622fda9-9e69-44d6-bf6d-8c222f76a7ee", note: "八重山平和祈念館" },
  { id: "0f989e6a-851f-4f0e-80da-293779d62c51", note: "原爆ドーム" },
  { id: "03b4d8b1-8426-41a1-ab66-ff25cf8eeb9b", note: "平和記念公園" },
  { id: "16d070c0-14f6-499d-ab13-85321b7c8950", note: "平和記念公園レストハウス" },
  { id: "0e4e66c8-cb8f-445a-996c-717af5a1086f", note: "広島平和記念資料館" },
  { id: "3bd94611-bec6-4c98-8695-751a483421b9", note: "知覧特攻平和会館" },
  { id: "e7150b27-dbb3-465b-a741-9c32b6a341ab", note: "神戸港震災メモリアルパーク" },
  { id: "dd71151d-cd93-4a46-bce6-9593e5ad1f27", note: "袋町小学校平和資料館" },
  { id: "394c8551-02c6-498e-a57c-7cbf74fcb138", note: "白虎隊記念館" },
  { id: "2226da00-6d66-40de-8979-187a0624ff59", note: "磐梯山噴火記念館" },
  { id: "191284fc-7dd3-420d-afe3-2bb044ad785e", note: "大久野島毒ガス資料館" },
  { id: "db08b970-d927-44c5-b191-84a67ded5152", note: "旧海軍司令部壕" },
  { id: "e03cc28e-412d-4ba7-af1d-5a7a0a223c09", note: "発電所跡(大久野島)" },
  { id: "dbf0e12d-e825-416f-ad69-81d3550afa01", note: "手柄山平和公園" },
  { id: "b90123f7-f68c-445e-b080-3ea56305206a", note: "宮崎県護国神社" },
  { id: "a13cc742-86d5-4d48-ae4c-364b428781ce", note: "広島護国神社" },
  { id: "7a9c9745-e6dc-41e3-9fa7-202d61db8d75", note: "仁徳天皇陵古墳" },
  { id: "bc4227f7-6411-414c-9f6d-e1c7a5bd00e3", note: "履中天皇陵古墳" },
  { id: "cd973498-56e1-47b6-909a-e3a5fe1a16f7", note: "天武・持統天皇陵" },
  { id: "03e9dfaa-428d-42f0-81e6-b9ea1e2a5ed5", note: "神武天皇陵" },
  { id: "c8566167-6613-4fee-a54b-d08144188eb8", note: "出雲阿国の墓" },
  { id: "469afb24-0689-490f-ae8a-f22576ccddb6", note: "大町桂月の墓" },
  { id: "64becd1b-3acd-4768-9a0f-430edc5e9b1c", note: "徳川慶喜の墓" },
  { id: "1ca6bfae-ba40-445f-b2a5-c4258c4f421b", note: "会津藩主松平家墓所" },
  { id: "fe407fb7-0132-44f9-a70d-44522ab67565", note: "萩藩主毛利家墓所" },
  { id: "bed11f89-89cc-41f0-ad28-6d067e04475d", note: "飯盛山" },
  { id: "237aadc4-5b68-4497-826a-867ddf24f6b9", note: "泉涌寺" },
  { id: "8f17f60a-8e90-4fd2-a030-dbd6e142fe7f", note: "如意輪寺(奈良)" },
  { id: "c8f3a437-70e8-49c4-a581-4328d1175f28", note: "高崎白衣大観音" },
  { id: "dc8aff23-8d44-411a-b7fb-f10c3c758dc1", note: "伏見桃山陵" },
  { id: "2464d451-1a65-4740-8920-ce35ac4e6438", note: "玉陵" },
  { id: "cee37302-2a71-4da4-8938-2f10af389d0e", note: "南洲神社・南洲墓地" },
  { id: "28978058-17cf-4f1f-9e8d-ab2705e50396", note: "外国人墓地(函館)" },
  { id: "be2c32aa-2450-476d-b3e9-f257bd4ad767", note: "横浜外国人墓地" },
  { id: "5a0b22b4-8fed-4c43-a63c-475e5c9701ef", note: "唐人墓(石垣島)" },
  { id: "88c2677b-c063-4294-b420-c523e56e4dd4", note: "禅林寺(東京・太宰治の墓)" },
  { id: "c0f604bf-d29a-481b-998b-3ff8a864446e", note: "対馬丸記念館" },
];

async function main() {
  console.log("[接続先チェック] host:", new URL(process.env.DATABASE_URL!).host);
  console.log(COMMIT ? "=== 本登録モード ===" : "=== 確認モード(書き込みなし) ===");
  console.log(`対象 ${TARGET_IDS.length} 件\n`);

  let okCount = 0;
  let ngCount = 0;

  for (const t of TARGET_IDS) {
    const p = await prisma.placeMaster.findUnique({
      where: { id: t.id },
      select: { id: true, name: true, address: true, isMemorial: true },
    });
    if (!p) {
      console.log(`[NG] id=${t.id}(${t.note}) が見つかりません`);
      ngCount++;
      continue;
    }
    console.log(`[OK] ${p.name} (${p.address ?? "住所なし"})  id=${p.id}  isMemorial=${p.isMemorial}  — ${t.note}`);
    okCount++;

    if (COMMIT) {
      await prisma.placeMaster.update({ where: { id: p.id }, data: { isMemorial: true } });
    }
  }

  console.log(`\n見つかった: ${okCount} / ${TARGET_IDS.length}、見つからず: ${ngCount} / ${TARGET_IDS.length}`);
  if (!COMMIT) {
    console.log("これは確認モードです。書き込みは行っていません。--commit で isMemorial: true にします。");
  } else {
    console.log("COMMITTED");
  }
}

main().finally(() => prisma.$disconnect());
