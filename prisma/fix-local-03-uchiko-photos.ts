/**
 * 内子(承認待ち、212c78fa)の写真の直し。--fill-photosで、wikiTitle「内子町」を使っていた
 * 7スポットすべてに、内子町のWikipedia記事の代表画像(内子座、File:Uchiko-za_ac_(1).jpg)が
 * 誤って付いていた(その場所の写真ではない。企画運営・法務の指摘2026-11-02、
 * docs/content/20261102-kikaku-to-seisaku-notes.md 11)。
 *
 * 誤った写真を削除する: 高昌寺・大村家住宅・本芳我家住宅・内子町ビジターセンター・
 * 商いと暮らし博物館・田丸橋・弓削神社の太鼓橋。上芳我家住宅・道の駅の写真(それぞれ
 * 専用のwikiTitleで取得した正しい写真)は変更しない。
 *
 * 4か所は、Wikimedia Commonsで、ファイルページの説明・カテゴリからその場所の写真だと
 * 確認できたものに差し替える(ファイル名・写っているものを確認済み):
 * - 高昌寺: File:Kousyouzi07.jpg(「高昌寺の涅槃仏」と明記)
 * - 大村家住宅: File:Omura_Residence.jpg(「大村家住宅主屋(内子町内子)」と明記)
 * - 本芳我家住宅: File:Honhaga_House_ac_(1).jpg(Category:Main House, Honhaga Residenceに所属)
 * - 田丸橋: File:Yanetsuki-uchikotamaru.jpg(depictsにTamaru Bridge、Category:Tamaru Bridge)
 * 残り3か所(内子町ビジターセンター・商いと暮らし博物館・弓削神社の太鼓橋)は、
 * Wikimedia Commonsで確認できる写真が見つからなかったため、写真なしのままにする。
 * 4か所ともライセンスは自由利用(CC BY-SA 3.0/4.0)であることを直接確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const commit = process.argv.includes("--commit");
const ITIN_ID = "212c78fa-7224-4b15-9a65-dc3846057584";
const WRONG_SOURCE_URL = "https://commons.wikimedia.org/wiki/File:Uchiko-za_ac_(1).jpg";
const TARGET_NAMES = [
  "高昌寺",
  "大村家住宅",
  "本芳我家住宅",
  "内子町ビジターセンター",
  "商いと暮らし博物館",
  "田丸橋",
  "弓削神社の太鼓橋",
];
const REPLACEMENTS: Record<string, string> = {
  高昌寺: "Kousyouzi07.jpg",
  大村家住宅: "Omura_Residence.jpg",
  本芳我家住宅: "Honhaga_House_ac_(1).jpg",
  田丸橋: "Yanetsuki-uchikotamaru.jpg",
};

const UA = "shiorie-photo-fix/1.0 (contact: st.83.53.abcd@gmail.com)";

async function fetchCommonsImageInfo(fileTitle: string) {
  const res = await fetch(
    `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(`File:${fileTitle}`)}&format=json`,
    { headers: { "User-Agent": UA } }
  );
  if (!res.ok) throw new Error(`imageinfo ${res.status}`);
  const json = await res.json();
  const page: any = Object.values(json.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) throw new Error(`imageinfo not found: ${fileTitle}`);
  const meta = ii.extmetadata ?? {};
  return {
    imageUrl: ii.url as string,
    descriptionUrl: ii.descriptionurl as string,
    license: meta.LicenseShortName?.value as string | undefined,
    author: (meta.Artist?.value as string | undefined)?.replace(/<[^>]+>/g, "").trim(),
    licenseUrl: meta.LicenseUrl?.value as string | undefined,
  };
}

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const spots = await prisma.spot.findMany({
    where: { name: { in: TARGET_NAMES }, day: { itineraryId: ITIN_ID } },
    include: { photos: true },
  });
  if (spots.length !== TARGET_NAMES.length) throw new Error(`スポット数が期待(${TARGET_NAMES.length})と不一致: ${spots.length}`);

  const toDelete: string[] = [];
  for (const s of spots) {
    if (s.photos.length !== 1) throw new Error(`${s.name}: 写真の枚数が期待(1)と不一致(${s.photos.length})`);
    const p = s.photos[0];
    if (p.sourceUrl !== WRONG_SOURCE_URL) throw new Error(`${s.name}: 写真の出典が期待と不一致(${p.sourceUrl})`);
    console.log(`${s.name}: 削除予定 photoId=${p.id} url=${p.url}`);
    toDelete.push(p.id);
  }

  console.log("\n[差し替え]");
  const infos: Record<string, Awaited<ReturnType<typeof fetchCommonsImageInfo>>> = {};
  for (const [name, fileTitle] of Object.entries(REPLACEMENTS)) {
    const info = await fetchCommonsImageInfo(fileTitle);
    if (!info.license || !/cc[\s-]?by/i.test(info.license)) throw new Error(`${name}: ライセンスが自由利用か確認できません(${info.license})`);
    infos[name] = info;
    console.log(`${name}: File:${fileTitle} (${info.license}, ${info.author}) -> ${info.descriptionUrl}`);
  }

  if (!commit) {
    console.log(`\n前提の確認OK(削除${toDelete.length}件、差し替え${Object.keys(REPLACEMENTS).length}件)。--commitで書き込みます。`);
    return;
  }

  // ネットワーク取得(画像ダウンロード+Blobアップロード)はトランザクションの外で済ませてから、
  // DBへの書き込みだけを短いトランザクションにする(既定の5秒タイムアウトに収める)
  const uploaded: { spotId: string; name: string; url: string; info: Awaited<ReturnType<typeof fetchCommonsImageInfo>> }[] = [];
  for (const s of spots) {
    const info = infos[s.name];
    if (!info) continue;
    const imgRes = await fetch(info.imageUrl, { headers: { "User-Agent": UA } });
    if (!imgRes.ok) throw new Error(`${s.name}: 画像取得失敗 ${imgRes.status}`);
    const buf = await toWebJpeg(Buffer.from(await imgRes.arrayBuffer()));
    const blob = await put(`official-local-03-uchiko/${encodeURIComponent(s.name)}-fix.jpg`, buf, {
      access: "public",
      addRandomSuffix: true,
    });
    uploaded.push({ spotId: s.id, name: s.name, url: blob.url, info });
    console.log(`${s.name}: 画像アップロードOK -> ${blob.url}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.photo.deleteMany({ where: { id: { in: toDelete } } });
    for (const u of uploaded) {
      await tx.photo.create({
        data: {
          spotId: u.spotId,
          url: u.url,
          caption: u.name,
          sourceUrl: u.info.descriptionUrl,
          author: u.info.author,
          license: u.info.license,
          licenseUrl: u.info.licenseUrl,
        },
      });
    }
  });
  console.log(`書き込みました(削除${toDelete.length}件、差し替え${uploaded.length}件)。`);
}
main().finally(() => prisma.$disconnect());
