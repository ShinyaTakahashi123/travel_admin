/**
 * #178 5d7ccad2「大濠公園と能古島、福岡の自然と離島をのんびり楽しむプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 4か所 09:30〜14:50 で、帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみいただけたことでしょう」）。
 *   もとの本文は「ベイサイドプレイス博多が能古島行きのフェリー乗り場」と書いていたが、能古島へのフェリー（福岡市営渡船）は姪浜渡船場から出る（クロスロードふくおか spot/12460・12340）。
 *   ベイサイドプレイス博多と、ほかの2本（ba8c13f1・1a3f2d39）にもある福岡市博物館は行程から外す（写真も外す）
 * 福岡市のほかのしおり（83450b2a: 能古島・福岡タワー・ベイサイド、ba8c13f1: 大濠公園・福岡城・博物館、1a3f2d39: 櫛田神社・天神など）の本文を読み、使っていない話で書いた
 *   （アイランドパーク: 年間約30種の花・体験と遊び、大濠公園: 中の島の浮見堂と4つの橋・野鳥の森）。福岡市美術館と大濠公園日本庭園はほかのしおりにない
 * フェリー・バス・地下鉄と歩きの旅（天神から。帰りは地下鉄の大濠公園駅）:
 *   のこのしまアイランドパーク 9:30 → 福岡市美術館（昼食）→ 大濠公園日本庭園 → 大濠公園 16:30
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（福岡県の観光サイト クロスロードふくおか https://www.crossroadfukuoka.jp/spot/<番号>）:
 *   12460 能古島（姪浜渡船場からフェリーで約10分）／12340 のこのしまアイランドパーク（周囲約12kmの能古島の北端・年間約30種の花・春は菜の花や桜、夏はひまわり、秋はコスモス、冬は水仙・
 *   アスレチック、ミニ動物園、ロープスキー、ろくろや絵付けの体験・9コースの「のこのこボール」・能古島渡船場からバスで約13分）／12243 福岡市美術館（大濠公園の湖畔・古美術から近現代美術まで16,000点を超える
 *   コレクション・陶磁器や染織も・館内のカフェ・レストランから大濠公園の景色・月曜休館）／12303 大濠公園日本庭園（大濠公園50年を記念して1984年に設けた築山林泉廻遊式の庭園・約12,000平方m・大池と築山の池泉庭、
 *   曲水、枯山水、大小の滝、数寄屋造りの茶屋・月曜休園）／12492 大濠公園（福岡城の外堀に使われた博多湾の入り江を整え1929年に開園・池のまわりに約2kmの周遊道・野鳥の森・4つの橋で結ばれた中の島の浮見堂・
 *   レンタルボート）
 * 座標: OSM — のこのしまアイランドパーク way 705639494・大濠公園日本庭園 way 493428782・大濠公園 way 23344558（Nominatim の中心）／福岡市美術館 relation 14988554（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-178-5d7ccad2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5d7ccad2-e753-4c23-b97d-28f5dc1c5c32";
const DAY_ID = "14e53a37-b66c-4fa6-8f9d-087dd1fb09fb";
const OHORI = "6dac7fd0-44ed-43a9-ab99-20b7203bc087";
const MUSEUM = "c0d3f1ac-a98a-4f3c-be12-b4074445ab36";
const BAYSIDE = "c296d954-18d7-4b3d-b8e7-e4e812140a49";
const NOKO = "7a84d34c-92c9-47a0-ab63-060921ae12e0";
const REMOVE_PHOTOS = ["56834f0c-3574-404b-91d7-b6810cd73293", "4e80d2c0-a3ef-4c3e-8afd-8a5b973d1407"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });

const DESCRIPTION =
  "朝は姪浜からフェリーで能古島へ渡り、季節の花が咲くのこのしまアイランドパークで博多湾を眺めます。昼は大濠公園の湖畔の福岡市美術館で昼食とコレクション鑑賞。午後は大濠公園日本庭園の池と滝をめぐり、中の島の浮見堂へ続く大濠公園の池のまわりを歩く、のんびりした日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(NOKO, { h: 9, m: 30, stay: 120, legs: [], lat: 33.6325208, lng: 130.3010797, address: "福岡県福岡市西区能古",
    memo: "この旅はフェリーとバス、地下鉄、歩きでめぐります。天神からバスで姪浜渡船場へ向かい、市営渡船のフェリーで約10分の能古島へ。島の渡船場からバスで約13分。周囲約12kmの能古島の北の端に広がる公園で、1年を通して約30種の花が咲き、春は菜の花や桜、夏はひまわり、秋はコスモス、冬は水仙が、博多湾を見渡す園内を彩ります。アスレチックやミニ動物園、ろくろや絵付けの体験、9つのコースを回る「のこのこボール」もあります。フェリーに乗るときは、係の人の案内に従いましょう。動物にふれるときは係の人の案内に従い、ふれたあとは手を洗いましょう。" }, "のこのしまアイランドパーク"),
  cre("福岡市美術館（昼食）", { h: 12, m: 21, stay: 100, legs: [bus(13, "西鉄バス（能古島内）"), other(10, "福岡市営渡船（能古島→姪浜）"), bus(10, "西鉄バス（姪浜渡船場→姪浜駅）"), train(8, "福岡市地下鉄空港線"), walk(10)], lat: 33.583939, lng: 130.3797313, address: "福岡県福岡市中央区大濠公園1-6",
    memo: "バスとフェリーで姪浜へ戻り、地下鉄で大濠公園駅へ。駅から池のほとりを歩いて約10分（あわせて約50分）。大濠公園の湖畔に建つ美術館で、館内のカフェ・レストランからは大濠公園の景色が広がります。ここで昼食にしましょう。古美術から近現代美術まで、16,000点を超えるコレクションがあり、絵画や彫刻のほか、陶磁器や染織の作品にもふれられます。休館日は公式の案内で確かめましょう。" }),
  cre("大濠公園日本庭園", { h: 14, m: 6, stay: 40, legs: [walk(5)], lat: 33.5827861, lng: 130.3787469, address: "福岡県福岡市中央区大濠公園1-7",
    memo: "美術館のとなりへ歩いて約5分。大濠公園の50年を記念して、1984年に設けられた、築山と池をめぐる回遊式の日本庭園です。大きな池と築山を中心に、曲がりくねった流れや枯山水、大小の滝、数寄屋造りの茶室と露地庭が配され、園路をたどりながら眺めが移り変わります。休園日は公式の案内で確かめましょう。" }),
  upd(OHORI, { h: 14, m: 51, stay: 99, legs: [walk(5)], lat: 33.5861214, lng: 130.3763612, address: "福岡県福岡市中央区大濠公園1-2",
    memo: "庭園を出て、池のほとりへ歩いて約5分。福岡城の外堀に使われていた博多湾の入り江を整えて、1929年に開かれた、全国でも有数の水景の公園です。池のまわりには約2kmの周遊道があり、4つの橋で結ばれた中の島には、朱色の浮見堂が建っています。公園には野鳥の森もあります。野鳥には近づきすぎず、食べ物を与えないようにしましょう。貸しボートに乗るときは、係の人の案内に従いましょう。帰りは、地下鉄の大濠公園駅まで歩いて約7分です。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [OHORI, MUSEUM, BAYSIDE, NOKO].join()) throw new Error("構成が想定と違います");
  const photos = it.days[0].spots.filter((s) => s.id === MUSEUM || s.id === BAYSIDE).flatMap((s) => s.photos.map((p) => p.id));
  if (photos.sort().join() !== [...REMOVE_PHOTOS].sort().join()) throw new Error(`外す写真が想定と違います: ${photos.join()}`);
  console.log(`外す: 福岡市博物館・ベイサイドプレイス博多と写真 ${photos.length} 枚\n表紙: ${it.thumbnailUrl}`);
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
      await setDaySpotOrder(DAY_ID, DAY, { tx, remove: [MUSEUM, BAYSIDE] });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
