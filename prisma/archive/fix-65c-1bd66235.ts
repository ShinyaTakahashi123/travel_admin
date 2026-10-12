/**
 * #65 1bd66235（浦富海岸・鳥取）法務の指摘4点を直す。
 * 1) 岩美町立渚交流館: 「体験は有料・要予約」→「有料」を外す(価格の話にあたるため)。
 * 2) 白兎神社: 「皮膚病や傷の治癒にご利益がある」という効能の言い切りを外し、
 *    「この言い伝えから、古くから信仰を集め」に(縁結び・恋人の聖地の文は維持)。
 * 3) 鳥取県立博物館→仁風閣の徒歩分数の食い違い(3分/2分)を3分にそろえる。
 * 4) 岩井廃寺塔跡: 岩井温泉との一文のつながりを整える。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "岩美町立渚交流館",
    "(体験は有料・要予約のものがあります)",
    "(体験は要予約のものがあります)"
  );

  await replaceMemo(
    "白兎神社・白兎海岸",
    "白兎神社は皮膚病や傷の治癒にご利益があるとされ、うさぎを縁結びの象徴として祀ることから",
    "白兎神社では古くから信仰を集め、うさぎを縁結びの象徴として祀ることから"
  );

  await replaceMemo(
    "仁風閣",
    "鳥取県立博物館から歩いておよそ2分、仁風閣に着きます。",
    "鳥取県立博物館から歩いておよそ3分、仁風閣に着きます。"
  );

  await replaceMemo(
    "岩井廃寺塔跡",
    "1300年ともいわれる歴史を持つ岩井温泉のいわれとも重なり合う、静かに、敬意をもって見学し、この土地の古い歴史に思いをはせてみてください。",
    "岩井温泉は1300年ともいわれる古い歴史を持つ湯どころで、この史跡の古代の趣とも重なり合います。静かに、敬意をもって見学し、この土地の古い歴史に思いをはせてみてください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
