/**
 * 台帳の写真724件の確認(docs/content/20261012-photo-review-flags.md)で見つかった、
 * 公式しおりの写真の問題を直す・その3(子ども・車のナンバーの残り、計22か所)。
 * 道の駅みしょうMICだけは、Commonsに他の写真が見つからなかったため、差し替えず削除のみ。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofix-20261013-b3";

type Task = {
  photoId: string;
  spotId: string;
  itinId: string;
  isCover: boolean;
  fileTitle: string | null; // nullなら削除のみ(差し替えなし)
  caption: string;
  reason: string;
};

const TASKS: Task[] = [
  { photoId: "7f46a126-0b0b-44e2-a51c-28f34ffd0b0e", spotId: "cd854761-6452-4d34-8723-7f772adf3648", itinId: "3441e3a7-77bd-41a3-a81f-cadf4c6ce23a", isCover: false, fileTitle: "Rinku premium outlets01s3200.jpg", caption: "りんくうプレミアム・アウトレット", reason: "旧写真はベビーカー・子どもの可能性+ブランド看板の近接が目立った" },
  { photoId: "e0e5b005-c716-447a-a050-101105bf27e0", spotId: "03c92399-70d0-4fa5-a88d-8054e6901e1b", itinId: "9489e2e7-3cea-43e3-ac3e-c7577902b0ae", isCover: false, fileTitle: "Meisuihyakusen uchinuki.jpg", caption: "うちぬきの湧き水（うちぬき広場）", reason: "子どもの顔が写った掲示物があった" },
  { photoId: "671333a8-fd0f-4adf-a503-6bb9418f36b3", spotId: "6c72cfbc-3049-4003-9252-b275a316d94e", itinId: "66258009-2007-49b0-a1b5-fdb3131a4b15", isCover: false, fileTitle: "湯布院, Oita Prefecture, Kyushu, Japan - 55117052516.jpg", caption: "湯布院フローラルヴィレッジ", reason: "旧写真は子どもを連れた人物が近距離に写っていた" },
  { photoId: "32622109-120a-4278-982c-007392261035", spotId: "2c720ae5-bd73-455b-9d9d-a64f074fe658", itinId: "6eb0ef87-f3a8-4689-ba24-a2c545d46ccf", isCover: true, fileTitle: "Nuttari Terrace Street ac.jpg", caption: "沼垂テラス商店街", reason: "旧写真は子どもが近距離の市場で写っていた(表紙)" },

  { photoId: "e34f0b9c-8312-4095-b271-f0f52fab9024", spotId: "c3a3230e-abe9-4eb0-9b93-bd74e506f2fc", itinId: "fdf00843-17b7-4c84-9202-d009a8c86e9d", isCover: false, fileTitle: "Aqua World.jpg", caption: "アクアワールド茨城県大洗水族館", reason: "旧写真は駐車中の車のナンバーと子どもが写っていた(1/3)" },
  { photoId: "1c5c200a-dc0c-48f1-98c3-ad9e0203eadd", spotId: "8389248f-a2ac-4ffe-94b1-78b362b459c8", itinId: "c898c3d9-c137-4c2b-98b2-574493f1a572", isCover: false, fileTitle: "Aqua World.jpg", caption: "アクアワールド茨城県大洗水族館", reason: "旧写真は駐車中の車のナンバーと子どもが写っていた(2/3)" },
  { photoId: "6addd441-8703-457d-9a80-02cb08d0ad6b", spotId: "dc70f9b8-1fab-44e5-8a13-4c98cb68396b", itinId: "3a0ab316-a30a-48a6-8cdb-3453683fb365", isCover: false, fileTitle: "Aqua World.jpg", caption: "アクアワールド茨城県大洗水族館", reason: "旧写真は駐車中の車のナンバーと子どもが写っていた(3/3)" },

  { photoId: "5d608f4e-5844-43c8-929e-1f8e93f759f5", spotId: "3f4ab1bc-92b1-4420-94b3-99ddf6fee5d2", itinId: "2d1bfca6-d5ae-42a2-bccb-dd385c3a3177", isCover: false, fileTitle: "Daitsuji (Nagahama) sanmon1.jpg", caption: "大通寺", reason: "旧写真は子どもが近距離の集団に写っていた" },

  { photoId: "f922033b-4aad-4881-8eee-7ca7b5be9fc0", spotId: "89a9a4b2-6287-4054-9298-d66000f13193", itinId: "2eb3162a-bb0d-4f7c-8e0a-b8e9a77d702a", isCover: false, fileTitle: "Nishi-rōmon, Yasaka Shrine from Street-7.jpg", caption: "八坂神社", reason: "旧写真は参道の階段に子どもを含む集団+バンの運転席が写っていた(1/5)" },
  { photoId: "6e120351-b340-4fb3-9124-b6739d06c625", spotId: "23c3479a-c106-47e7-a29e-1e949baae7ea", itinId: "fc54731b-8f4b-4a2a-935a-f1e73fac342f", isCover: false, fileTitle: "Nishi-rōmon, Yasaka Shrine from Street-7.jpg", caption: "八坂神社", reason: "同上(2/5)" },
  { photoId: "1eb6d003-a546-4dd8-afbc-c834a3f0db68", spotId: "848ca4f7-8c85-4172-b265-d6aa00d98824", itinId: "5bb2acee-21b8-4703-97e7-8ba1d3d4988c", isCover: false, fileTitle: "Nishi-rōmon, Yasaka Shrine from Street-7.jpg", caption: "八坂神社", reason: "同上(3/5)" },
  { photoId: "1f6c5db2-2244-4b06-b5ab-4c3aa22f3604", spotId: "3a26b37c-e052-4878-9830-dc5c7b99370c", itinId: "b7de8da7-4621-4e87-bc5c-38071741fcba", isCover: false, fileTitle: "Nishi-rōmon, Yasaka Shrine from Street-7.jpg", caption: "八坂神社", reason: "同上(4/5)" },
  { photoId: "87c1e24d-9c1b-4bca-b847-e3972e1828d3", spotId: "bba8fd25-9b18-4940-9532-3376d52a6239", itinId: "5595cdc0-662e-4c56-bef8-b291c9ae8005", isCover: false, fileTitle: "Nishi-rōmon, Yasaka Shrine from Street-7.jpg", caption: "八坂神社", reason: "同上(5/5・下書き)" },

  { photoId: "a0a12792-dfd6-4b94-ba4e-8830c23e51b5", spotId: "b8f3d177-bfd1-4ae7-8532-ec37d3a7b51d", itinId: "c97e2205-85f0-449e-bb08-a071bc7a534e", isCover: false, fileTitle: "Stone lanterns in Kasuga-taisha-1.jpg", caption: "春日大社", reason: "旧写真は子どもを含む集団が近距離に写っていた(1/4)" },
  { photoId: "7389daf0-944f-422a-861a-ffbcc7ed72a7", spotId: "4d60a64f-b632-4082-8f09-368ffdd8490d", itinId: "a37b8c79-85e0-4c3d-b2c6-94057033f31a", isCover: false, fileTitle: "Stone lanterns in Kasuga-taisha-1.jpg", caption: "春日大社", reason: "同上(2/4)" },
  { photoId: "f3eeb1b8-ad11-42c5-ba79-2c76820db08f", spotId: "473333c4-1805-4dbd-92d9-e5b29bd23bf3", itinId: "443379ac-eac1-427a-859b-34aaece19786", isCover: false, fileTitle: "Stone lanterns in Kasuga-taisha-1.jpg", caption: "春日大社", reason: "同上(3/4)" },
  { photoId: "4dbd3373-775c-412c-9234-7ceeb3e9685b", spotId: "9e0ff62b-6abc-44a3-970d-10d0bbb903a9", itinId: "0c542f79-2811-4a59-bfcb-34816ad72c3e", isCover: false, fileTitle: "Stone lanterns in Kasuga-taisha-1.jpg", caption: "春日大社", reason: "同上(4/4)" },

  { photoId: "479ae738-8baf-4caf-9b1a-8ea46495e1c4", spotId: "53ae9c35-be7b-464b-90f9-3fcc5637c06f", itinId: "d4523cde-7366-46de-812a-1d4f20dc4f75", isCover: false, fileTitle: "Chiba-jinja Tor 01.jpg", caption: "千葉神社", reason: "旧写真は子どもが近距離に写っていた" },
  { photoId: "a5b17506-5b54-4feb-bb30-c95429b192fa", spotId: "c025260c-da97-4576-99d7-0e260ed39cc2", itinId: "ac272e0b-8781-4d47-ad7b-3112e9c6bd53", isCover: false, fileTitle: "140712 Oasahiko-jinja Naruto Tokushima pref Japan01s3.jpg", caption: "大麻比古神社", reason: "旧写真は子どもを連れた女性が近距離に写っていた" },
  { photoId: "fe7ed352-e1a4-4649-91cb-29b3fb5ba08d", spotId: "b0c59569-07dd-4ffd-bb1c-edb2ce39bd60", itinId: "7135a922-0fcf-45b7-bcdc-3b421527da2e", isCover: true, fileTitle: "Giant squid - Echizen Matsushima Aquarium (1).jpg", caption: "越前松島水族館", reason: "旧写真はベビーカー・子ども連れの家族が近距離に写っていた(表紙)" },

  { photoId: "d824deb1-f4a0-4865-8b32-4782bda492e8", spotId: "4d6a838b-1173-4f7f-b7d4-389dfd85ead4", itinId: "53bf1fa8-d837-4f00-84e2-f69b487fda25", isCover: true, fileTitle: "Weathercock House Kobe Kitano Ijinkan 風見鶏の館（旧トーマス住宅）.jpg", caption: "北野異人館街", reason: "旧写真は近距離の車2台のナンバーが読めた(表紙)" },
  { photoId: "0c8fddaf-3751-4831-bd44-2d065cc3e22c", spotId: "0e774d4b-4597-49c0-8c32-fe746c085356", itinId: "45f439eb-8f0f-4dcc-8e02-0a9655e3750d", isCover: true, fileTitle: "Saga Balloon Museum 20171112-2.jpg", caption: "佐賀バルーンミュージアム", reason: "旧写真はタクシーのナンバーが読めた(表紙)" },

  { photoId: "efa543bb-7157-4e48-8d73-777d1370e419", spotId: "dd8bc2b8-ddec-4dea-a2a3-3051173f117d", itinId: "8d044992-9b50-48ea-9beb-05be5076a217", isCover: false, fileTitle: "Omotesando 2007 b.JPG", caption: "表参道", reason: "旧写真は近距離の車のナンバーが読めるおそれがあった(1/3)" },
  { photoId: "c90bad8c-c76f-4728-bb43-b3e52d909e8e", spotId: "3b227569-bd06-408a-ada8-70d515a8999c", itinId: "cf6ae961-1b58-486b-8b4f-fcae6f7e0516", isCover: false, fileTitle: "Omotesando 2007 b.JPG", caption: "表参道", reason: "同上(2/3)" },
  { photoId: "2311930c-62e2-401c-b92c-54b8fa53c22c", spotId: "5644edb3-5e47-4264-8ac9-123fbdf68b27", itinId: "3222c6b2-33b8-43f1-9d56-c31fc594c767", isCover: false, fileTitle: "Omotesando 2007 b.JPG", caption: "表参道", reason: "同上(3/3)" },

  { photoId: "0efee046-c357-430f-8cc4-7a97f1e95323", spotId: "06978285-fe04-4d75-863d-a1557a61c231", itinId: "9822e442-ce98-40e8-8afe-be361795fb09", isCover: true, fileTitle: "Panda Adventure World Shirahama.JPG", caption: "アドベンチャーワールド", reason: "旧写真は近距離の車のナンバーが読めるおそれがあった(表紙・1/2)" },
  { photoId: "58ec6ac9-1a4c-4286-bb7a-9c83a33ba744", spotId: "03cd6cb6-cf2a-4b63-8477-74ea092d3286", itinId: "429aa0c4-7d53-4cb8-b830-cbf7885a1f29", isCover: false, fileTitle: "Panda Adventure World Shirahama.JPG", caption: "アドベンチャーワールド", reason: "同上(2/2)" },

  { photoId: "cf69ab4d-50b4-46ee-a822-a8779f82e6e1", spotId: "43658bf8-af35-44cd-9515-e0ce81d05f56", itinId: "76319c13-42b7-4093-aa4f-6ef2dd45fd0d", isCover: false, fileTitle: "Zenrin Gate (Yokohama Chinatown) 20211212-1.jpg", caption: "横浜中華街", reason: "旧写真は近距離の車複数台のナンバーが読めた" },
  { photoId: "75479307-c293-4f07-b56d-b2e1a1747dee", spotId: "9f4b9493-fe2a-47d7-8381-863b10613468", itinId: "406e5c96-ffef-4536-a312-0204de681b97", isCover: false, fileTitle: "Den Den Town, Osaka (44195719941).jpg", caption: "でんでんタウン", reason: "旧写真は近距離の車複数台のナンバーが読めた" },
  { photoId: "f28a98be-edd7-4191-8290-ca61d658f358", spotId: "76e4d961-43af-4548-991b-9e5fab90bbde", itinId: "15185f58-5c6a-441b-a1a0-321b50f7a606", isCover: false, fileTitle: "Michinoeki Arakawa 01.jpg", caption: "道の駅あらかわ", reason: "旧写真は近距離の車のナンバーが読めた" },
  { photoId: "8a7771ca-109d-4690-8825-6147dc1c63e1", spotId: "4c40dac2-95c3-43a5-b329-326e08455720", itinId: "c3b9522c-ed27-4728-bf23-8eab5f95b521", isCover: false, fileTitle: "Yunokami-onsen station in winter.jpg", caption: "湯野上温泉駅", reason: "旧写真は駐車中の車のナンバーが読めるおそれがあった" },

  { photoId: "5345ce05-776a-4de2-9929-65d0b576573b", spotId: "f5a27cba-96fe-4cbd-b1ec-0b8ccc007e9c", itinId: "f22cbf27-466d-455e-90c5-3b4c6b9f1323", isCover: false, fileTitle: null, caption: "道の駅みしょうMIC", reason: "旧写真はトラック・乗用車のナンバーが読めた。Commonsに他の写真が見つからず、差し替えずに削除" },

  { photoId: "df4af190-4617-4785-b237-4fbbc06d9b38", spotId: "a960129e-1879-47c5-86c6-e780c18443c1", itinId: "c27fe728-37c2-4ca0-9bac-06451d485ff2", isCover: false, fileTitle: "Japan 2024-04-28 (53893216325).jpg", caption: "チームラボプラネッツ", reason: "旧写真は近距離の女性の顔がはっきり写っていた" },
  { photoId: "0d484d91-0530-4931-9dd7-009d4eaf589f", spotId: "7c11abdf-7146-473c-8d74-10231c4546fb", itinId: "581607ca-db3c-489b-8490-50733dcf918d", isCover: false, fileTitle: "Shiroyama Park 20210502.jpg", caption: "城山公園", reason: "旧写真は近距離の車(SUV)のナンバーが読めた" },
];

async function main() {
  for (const t of TASKS) {
    const photo = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!photo) throw new Error(`写真が見つかりません: ${t.photoId}`);
    if (photo.spotId !== t.spotId) throw new Error(`spotIdが想定と違います: ${t.photoId}`);
    const itin = await prisma.itinerary.findUnique({ where: { id: t.itinId }, select: { title: true, thumbnailUrl: true } });
    if (!itin) throw new Error(`しおりが見つかりません: ${t.itinId}`);
    const actualIsCover = itin.thumbnailUrl === photo.url;
    if (actualIsCover !== t.isCover) throw new Error(`表紙かどうかの想定が違います: ${t.photoId} (実際: ${actualIsCover})`);
    console.log(`[確認OK] ${t.caption} (${itin.title}) | 表紙: ${t.isCover} | ${t.fileTitle ? "差し替え" : "削除のみ"} | ${t.reason}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const uploadedByFile = new Map<string, { url: string; credit: any }>();
  for (const t of TASKS) {
    const oldPhoto = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!oldPhoto) throw new Error(`書き込み直前に写真が見つかりません: ${t.photoId}`);

    if (!t.fileTitle) {
      // 削除のみ(差し替え写真なし)。表紙だった場合は想定外なので事前チェックで弾いている
      await prisma.photo.delete({ where: { id: t.photoId } });
      console.log(`  COMMITTED: ${t.caption} (photo ${t.photoId} -> 削除のみ)`);
      continue;
    }

    let result = uploadedByFile.get(t.fileTitle);
    if (!result) {
      result = (await uploadCommonsFile(t.fileTitle, t.caption, BLOB_PREFIX)) ?? undefined;
      if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
      uploadedByFile.set(t.fileTitle, result);
      console.log(`取得: ${result.url}`, result.credit);
    }

    await prisma.photo.delete({ where: { id: t.photoId } });
    await prisma.photo.create({
      data: {
        spotId: t.spotId,
        url: result.url,
        caption: t.caption,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });

    if (t.isCover) {
      await prisma.itinerary.update({ where: { id: t.itinId }, data: { thumbnailUrl: result.url } });
      console.log(`  表紙も更新: ${t.itinId}`);
    }
    console.log(`  COMMITTED: ${t.caption} (photo ${t.photoId} -> 新規作成)`);
  }
}
main().finally(() => prisma.$disconnect());
