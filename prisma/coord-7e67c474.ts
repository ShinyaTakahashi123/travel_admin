/**
 * 日帰りの座標の直し（A・B）: 7e67c474（山梨県立美術館とミレー、甲府城跡や武田神社をめぐるアート日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 山梨県立美術館 35.660389,138.537333（秒の形）→ OSM tourism=museum way251145786（Nominatim 35.6602831,138.5374708。2ff3e434・de637e2a と同じ点）
 * - 舞鶴城公園 35.665119,138.571329（way129722779 の面の中心）→ 着く側の名前のある門「山手門」building=roof way419435363（Nominatim 35.6673170,138.5710204）。
 *   メモに「山手御門」が出てくる。甲府駅（バスと徒歩で着く）から約360m、次の藤村記念館（甲府駅北口）の側（7章）
 * - 山梨県立文学館・藤村記念館・信玄ミュージアム・武田神社・大泉寺は、それぞれ OSM の点の6けたの丸めで、直しても変わらない
 * 歩く時間（routed-foot）: 美術館→文学館 150m 2.0分（3のまま）、山手門→藤村記念館 91m 1.2分（5のまま、上限7）。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-7e67c474.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("7e67c474-4ea2-4ca5-9b1e-ed4d053632ff", [
  {
    id: "d084b9e5-7351-46fa-bcdd-e61928b1c4a3",
    label: "山梨県立美術館",
    point: { from: [35.660389, 138.537333], to: [35.6602831, 138.5374708], source: "OSM 山梨県立美術館 tourism=museum way251145786（Nominatim）" },
  },
  {
    id: "d676a457-8467-44c4-b4cd-c2b3ed44594d",
    label: "舞鶴城公園",
    point: { from: [35.665119, 138.571329], to: [35.667317, 138.5710204], source: "OSM 山手門 building=roof way419435363（Nominatim）" },
  },
]);
