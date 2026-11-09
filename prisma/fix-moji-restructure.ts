/**
 * 組み直し、22e33bac（旧門司三井倶楽部と出光美術館、大正ロマン建築をめぐるアート散策）。(6本目/10・v2)
 *
 * v2の測り直し(法務の指摘、2026-11-02 07:39): 展望台→門司港駅のタクシーの分は、展望台の点
 * (33.9577987,130.9671370)がOSRMで関門自動車道に吸い寄せられ、関門トンネルを回って戻る
 * 9.9km・13.4分の道のりになっていた。和布刈公園の一般の道(service、33.957359,130.9675162)
 * を起点に測り直すと、steps に関門自動車道・国道2号は入らず、4.7km・13.5分(ほぼ同じ分数だが
 * 高速を通らない道のり)。車の分+5で19分(変更なし)。
 *
 * v1からの直し(法務・企画運営の指摘、2026-11-02):
 *  1. 昼食をスポットとして追加。旧門司税関(tourism=viewpoint way976479446 33.9477292,130.9635866、
 *     04cfa60bと同じ点。ブルーウィングもじから138m・1.8分)を、ブルーウィングもじの次に挿入。
 *     1階にエントランスホール・カフェ・税関の歴史の展示室があることは mojiko.info/spot/zeikan.html
 *     (公式)で確認。口コミサイトは使わない。約40分、11:38始まりで11:30〜13:30の中
 *  2. 関門海峡ミュージアム→和布刈神社の歩き36分をタクシーに(飛鳥と同じ考え方。OSRM車6.0分+5分=11分)
 *  3. 展望台(終着点)から門司港駅までの帰りの一文を追加(OSRM車13.4分+5分=19分のタクシー)
 *  4. 書き出しの形を「[前]を見学したら、歩いておよそN分、[今]へ向かいましょう」→
 *     「[前]から歩いておよそN分、[今]に着きます」に変更(前の文の終わりと同じ文が2回続くため)
 *  5. 人道「渡ってみるのもよいでしょう」→「渡ってみましょう」、「世界的にも珍しい『海底の県境』
 *     として知られています」→「とされています」(ぼかしを同じ文に)
 *  6. ブルーウィングもじ「その様子は多くの見物客を集めています」(混み具合の言い方)を削除
 *  7. 説明文「はね橋の可動を見られるタイミングも狙い目です」→「はね橋が跳ね上がる時間に
 *     あわせて訪れることもできます」(すすめる言い方を外す)
 *  8. 昼食がスポットに移ったため、九州鉄道記念館に入れていた昼食の一文は削除
 *
 * 旅の足の組み直し(routed-foot/routed-car で測り直し):
 *  門司港駅→三井倶楽部2分、三井倶楽部→出光8分、出光→ブルーウィング6分、
 *  ブルーウィング→旧門司税関2分、旧門司税関→九州鉄道記念館11分、記念館→ミュージアム9分、
 *  ミュージアム→神社(タクシー)11分、神社→人道2分、人道→展望台15分、展望台→門司港駅(タクシー)19分
 *
 * 始まりを08:50に変更(出光美術館の開館10:00に合わせ、終わりが16:30〜17:00に収まるように)。
 * この組み直しで、和布刈公園第二展望台の滞在終わりは16:31(日帰りの発車16:30〜17:00の中)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "22e33bac-7b3c-4cc1-bd56-d225434ade10";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const EKI = "門司港駅";
const MITSUI = "旧門司三井倶楽部";
const IDEMITSU = "出光美術館（門司）";
const BLUEWING = "ブルーウィングもじ";
const TETSUDO = "九州鉄道記念館";
const MUSEUM = "関門海峡ミュージアム";
const JINJA = "和布刈神社";
const TENBOU = "和布刈公園第二展望台";
const TUNNEL = "関門トンネル人道";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const eki = await prisma.spot.findFirstOrThrow({ where: { name: EKI, day: { itineraryId: ITIN_ID } } });
  const mitsui = await prisma.spot.findFirstOrThrow({ where: { name: MITSUI, day: { itineraryId: ITIN_ID } } });
  const idemitsu = await prisma.spot.findFirstOrThrow({ where: { name: IDEMITSU, day: { itineraryId: ITIN_ID } } });
  const bluewing = await prisma.spot.findFirstOrThrow({ where: { name: BLUEWING, day: { itineraryId: ITIN_ID } } });
  const tetsudo = await prisma.spot.findFirstOrThrow({ where: { name: TETSUDO, day: { itineraryId: ITIN_ID } } });
  const museum = await prisma.spot.findFirstOrThrow({ where: { name: MUSEUM, day: { itineraryId: ITIN_ID } } });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { name: JINJA, day: { itineraryId: ITIN_ID } } });
  const tenbou = await prisma.spot.findFirstOrThrow({ where: { name: TENBOU, day: { itineraryId: ITIN_ID } } });
  const tunnel = await prisma.spot.findFirstOrThrow({ where: { name: TUNNEL, day: { itineraryId: ITIN_ID } } });

  // 現在値の確認(このしおりはまだ書き込んでいない前提=もとの値のまま)
  const checks: { name: string; lat: number; lng: number; got: { lat: unknown; lng: unknown } }[] = [
    { name: EKI, lat: 33.945131, lng: 130.961489, got: eki },
    { name: MITSUI, lat: 33.945806, lng: 130.9625, got: mitsui },
    { name: IDEMITSU, lat: 33.947648, lng: 130.965225, got: idemitsu },
    { name: BLUEWING, lat: 33.947801, lng: 130.962743, got: bluewing },
    { name: TETSUDO, lat: 33.943077, lng: 130.961838, got: tetsudo },
    { name: MUSEUM, lat: 33.943962, lng: 130.95929, got: museum },
    { name: JINJA, lat: 33.960644, lng: 130.962311, got: jinja },
    { name: TENBOU, lat: 33.9615, lng: 130.9625, got: tenbou },
    { name: TUNNEL, lat: 33.958204, lng: 130.968201, got: tunnel },
  ];
  for (const c of checks) {
    if (Math.abs(Number(c.got.lat) - c.lat) > 1e-6 || Math.abs(Number(c.got.lng) - c.lng) > 1e-6) {
      throw new Error(`${c.name}: 座標現在値が期待と不一致(現在 ${c.got.lat},${c.got.lng})`);
    }
  }

  const EKI_MEMO_OLD =
    "大正ロマン漂う門司港レトロの建築を巡る旅は、門司港駅からスタートです。明治24年(1891)、九州鉄道の起点となる門司駅として開業し、現在の駅舎は大正3年(1914)に建てられたものです。昭和63年(1988)、鉄道駅舎としては全国で初めて国の重要文化財に指定されました。ネオ・ルネサンス様式を基調とした木造2階建ての駅舎は、大きなマンサード屋根が特徴で、左右対称の造りは「門」の字を表しているともいわれています。平成31年(2019)には6年におよぶ復原工事を終え、大正時代当時の姿がよみがえりました。九州鉄道の起点として本州との連絡を見込んで設計された駅舎は、現役の駅舎として今も多くの旅人を迎え入れています。大正ロマンあふれる木造駅舎の佇まいを、じっくりと眺めてみましょう。見学を終えたら、歩いて旧門司三井倶楽部へ向かいましょう。";
  const EKI_MEMO_NEW =
    "大正ロマン漂う門司港レトロの建築を巡る旅は、門司港駅からスタートです。明治24年(1891)、九州鉄道の起点となる門司駅として開業し、現在の駅舎は大正3年(1914)に建てられたものです。昭和63年(1988)、鉄道駅舎としては全国で初めて国の重要文化財に指定されたとされています。ネオ・ルネサンス様式を基調とした木造2階建ての駅舎は、大きなマンサード屋根が特徴で、左右対称の造りは「門」の字を表しているともいわれています。平成31年(2019)には6年におよぶ復原工事を終え、大正時代当時の姿がよみがえりました。九州鉄道の起点として本州との連絡を見込んで設計された駅舎は、現役の駅舎として今も多くの旅人を迎え入れています。大正ロマンあふれる木造駅舎の佇まいを、じっくりと眺めてみましょう。見学を終えたら、歩いておよそ2分、旧門司三井倶楽部へ向かいましょう。";
  if (eki.memo !== EKI_MEMO_OLD) throw new Error("門司港駅: memo現在値が期待と不一致");

  const MITSUI_MEMO_OLD =
    "門司港駅を見学したら、歩いて旧門司三井倶楽部へ向かいましょう。大正10年(1921)、三井物産の社交倶楽部として建てられた洋館で、大正11年(1922)には、来日中のアインシュタイン博士夫妻が5日間にわたって滞在しました。博士夫妻は滞在中、地元のクリスマス会でヴァイオリンを演奏したり、関門海峡周辺の景色を楽しんだりして過ごしたと伝えられています。館内には、博士が実際に使用した寝室や居間が「アインシュタインメモリアルルーム」として当時の内装のまま復元・保存されており、平成2年(1990)には国の重要文化財に指定されました。世界的な物理学者も心癒された、大正期の優雅な社交空間を楽しみましょう。見学を終えたら、歩いて出光美術館(門司)へ向かいましょう。";
  const MITSUI_MEMO_NEW =
    "門司港駅から歩いておよそ2分、旧門司三井倶楽部に着きます。大正10年(1921)、三井物産の社交倶楽部として建てられた洋館で、大正11年(1922)には、来日中のアインシュタイン博士夫妻が5日間にわたって滞在しました。博士夫妻は滞在中、地元のクリスマス会でヴァイオリンを演奏したり、関門海峡周辺の景色を楽しんだりして過ごしたと伝えられています。館内には、博士が実際に使用した寝室や居間が「アインシュタインメモリアルルーム」として当時の内装のまま復元・保存されており、平成2年(1990)には国の重要文化財に指定されました。世界的な物理学者も心癒された、大正期の優雅な社交空間を楽しみましょう。見学を終えたら、歩いておよそ8分、出光美術館(門司)へ向かいましょう。";
  if (mitsui.memo !== MITSUI_MEMO_OLD) throw new Error("旧門司三井倶楽部: memo現在値が期待と不一致");

  const IDEMITSU_MEMO_OLD =
    "旧門司三井倶楽部を見学したら、歩いて出光美術館(門司)へ向かいましょう。出光興産の創業者・出光佐三が生涯をかけて収集した美術品を中心に展示する美術館で、創業の地であるこの門司に、平成12年(2000)開館しました。平成28年(2016)にはリニューアルを終え、レンガ調の外観と落ち着いた展示空間へと生まれ変わっています。展示は日本の書画、日本・中国の陶磁器が中心で、テーマに沿った展覧会が開催されています。併設の出光創業史料室では、佐三が生涯を通じて実践した「人間尊重」の精神を、当時の資料とともにたどることができます。実業家であり美術品収集家でもあった、一人の人物の審美眼に触れましょう。見学を終えたら、歩いてブルーウィングもじへ向かいましょう。";
  const IDEMITSU_MEMO_NEW =
    "旧門司三井倶楽部から歩いておよそ8分、出光美術館(門司)に着きます。出光興産の創業者・出光佐三が生涯をかけて収集した美術品を中心に展示する美術館で、創業の地であるこの門司に、平成12年(2000)開館しました。平成28年(2016)にはリニューアルを終え、レンガ調の外観と落ち着いた展示空間へと生まれ変わっています。展示は日本の書画、日本・中国の陶磁器が中心で、テーマに沿った展覧会が開催されています。併設の出光創業史料室では、佐三が生涯を通じて実践した「人間尊重」の精神を、当時の資料とともにたどることができます。実業家であり美術品収集家でもあった、一人の人物の審美眼に触れましょう。見学を終えたら、歩いておよそ6分、ブルーウィングもじへ向かいましょう。";
  if (idemitsu.memo !== IDEMITSU_MEMO_OLD) throw new Error("出光美術館（門司）: memo現在値が期待と不一致");

  const BLUEWING_MEMO_OLD =
    "出光美術館(門司)を見学したら、歩いてブルーウィングもじへ向かいましょう。門司港の第一船だまりに架かる、歩行者専用のはね橋としては全国最大級とされる橋で、全長はおよそ108mにおよびます。決まった時間に、橋の中央部が水面に対しておよそ60度の角度に跳ね上がります。時間は現地や公式の案内で確かめてください。その様子は多くの見物客を集めています。跳ね橋が下りて最初にカップルで渡ると幸せになれるという言い伝えから「恋人の聖地」にも認定されており、関門海峡や関門大橋を望むロケーションとあわせて、多くのカップルにも親しまれています。跳ね上がる瞬間のダイナミックな姿と、海峡を望む眺めをあわせて楽しみましょう。見学を終えたら、歩いて九州鉄道記念館へ向かいましょう。";
  const BLUEWING_MEMO_NEW =
    "出光美術館(門司)から歩いておよそ6分、ブルーウィングもじに着きます。門司港の第一船だまりに架かる、歩行者専用のはね橋としては全国最大級とされる橋で、全長はおよそ108mにおよびます。決まった時間に、橋の中央部が水面に対しておよそ60度の角度に跳ね上がります。時間は現地や公式の案内で確かめましょう。跳ね橋が下りて最初にカップルで渡ると幸せになれるという言い伝えから「恋人の聖地」にも認定されており、関門海峡や関門大橋を望むロケーションとあわせて、多くのカップルにも親しまれています。跳ね上がる瞬間のダイナミックな姿と、海峡を望む眺めをあわせて楽しみましょう。見学を終えたら、歩いておよそ2分、旧門司税関へ向かいましょう。";
  if (bluewing.memo !== BLUEWING_MEMO_OLD) throw new Error("ブルーウィングもじ: memo現在値が期待と不一致");

  const ZEIKAN_MEMO_NEW =
    "ブルーウィングもじから歩いておよそ2分、旧門司税関に着きます。明治45年(1912)に建てられた、赤れんが造り2階建ての建物で、門司税関の庁舎として使われていました。1階にはエントランスホールとカフェ、税関の歴史を紹介する展示室があり、3階は関門海峡を見渡せる展望室になっています。ここで昼食にしましょう。見学を終えたら、歩いておよそ11分、九州鉄道記念館へ向かいましょう。";

  const TETSUDO_MEMO_OLD =
    "ブルーウィングもじを見学したら、歩いて九州鉄道記念館へ向かいましょう。かつての九州鉄道本社社屋を活用した赤レンガの建物で、九州の鉄道創世期の貴重な資料や、九州を走ったゆかりの車両、ブルートレインのヘッドマークなどを展示しています。屋外の展示場には、かつて九州各地を走った実物の車両がずらりと並び、戦前型の機械式気動車は国の重要文化財にも指定されています。本格的な複線や信号機を備えたミニ鉄道公園では、実際に運転を体験できるコーナーもあります。見学を終えたら、歩いて関門海峡ミュージアムへ向かいましょう。";
  const TETSUDO_MEMO_NEW =
    "旧門司税関から歩いておよそ11分、九州鉄道記念館に着きます。かつての九州鉄道本社社屋を活用した赤レンガの建物で、九州の鉄道創世期の資料や、九州を走ったゆかりの車両、ブルートレインのヘッドマークなどを展示しています。屋外の展示場には、かつて九州各地を走った実物の車両がずらりと並び、戦前型の機械式気動車は国の重要文化財にも指定されています。本格的な複線や信号機を備えたミニ鉄道公園では、実際に運転を体験できるコーナーもあります。見学を終えたら、歩いておよそ9分、関門海峡ミュージアムへ向かいましょう。";
  if (tetsudo.memo !== TETSUDO_MEMO_OLD) throw new Error("九州鉄道記念館: memo現在値が期待と不一致");

  const MUSEUM_MEMO_OLD =
    "九州鉄道記念館を見学したら、歩いて関門海峡ミュージアムへ向かいましょう。ガラス張りの帆船のような姿をした建物で、関門海峡の歴史・文化・自然を、迫力の映像とインタラクティブ体験で紹介しています。エレベーターで5階の展望デッキまで上がると、関門海峡を一望できます。1階には、大正時代の門司港の街並みを再現した「海峡レトロ通り」もあります。見学を終えたら、歩いて和布刈神社へ向かいましょう。";
  const MUSEUM_MEMO_NEW =
    "九州鉄道記念館から歩いておよそ9分、関門海峡ミュージアムに着きます。ガラス張りの帆船のような姿をした建物で、関門海峡の歴史・文化・自然を、迫力の映像とインタラクティブ体験で紹介しています。エレベーターで5階の展望デッキまで上がると、関門海峡を一望できます。1階には、大正時代の門司港の街並みを再現した「海峡レトロ通り」もあります。見学を終えたら、タクシーでおよそ11分、和布刈神社へ向かいましょう。";
  if (museum.memo !== MUSEUM_MEMO_OLD) throw new Error("関門海峡ミュージアム: memo現在値が期待と不一致");

  const JINJA_MEMO_OLD =
    "関門海峡ミュージアムを見学したら、遊歩道を歩いて和布刈神社へ向かいましょう。社伝によれば仲哀天皇9年(西暦200年)の創建と伝わる、関門橋のたもとに立つ古社です。御祭神は、潮の満ち引きを司る神とされる天照大神の荒魂で、旧暦元日の早朝には、神職が干潮の海に降りてワカメを刈り取り神前に供える「和布刈神事」が今も受け継がれています。今も祈りが続く聖地ですので、境内では静かに、敬意をもってお参りしましょう。参拝を終えたら、歩いて和布刈公園第二展望台へ向かいましょう。";
  const JINJA_MEMO_NEW =
    "関門海峡ミュージアムからタクシーでおよそ11分、和布刈神社に着きます。社伝によれば仲哀天皇9年(西暦200年)の創建と伝わる、関門橋のたもとに立つ古社です。御祭神は、潮の満ち引きを司る神とされる天照大神の荒魂で、旧暦元日の早朝には、神職が干潮の海に降りてワカメを刈り取り神前に供える「和布刈神事」が今も受け継がれています。今も祈りが続く聖地ですので、境内では静かに、敬意をもってお参りしましょう。参拝を終えたら、歩いておよそ2分、関門トンネル人道へ向かいましょう。";
  if (jinja.memo !== JINJA_MEMO_OLD) throw new Error("和布刈神社: memo現在値が期待と不一致");

  const TUNNEL_MEMO_OLD =
    "和布刈公園第二展望台を見学したら、歩いて関門トンネル人道の門司側入口へ向かいましょう。全長およそ780mの海底トンネルで、歩いておよそ15分で本州の下関側まで渡ることができます。トンネルの中ほどには福岡県と山口県の県境があり、世界的にも珍しい「海底の県境」として知られています。時間と体力に余裕があれば、実際にトンネルを歩いて渡ってみるのもよいでしょう。旧門司三井倶楽部と出光美術館、大正ロマン建築をめぐるアート散策は、これで終わりです。";
  const TUNNEL_MEMO_NEW =
    "和布刈神社から歩いておよそ2分、関門トンネル人道の門司側入口に着きます。全長およそ780mの海底トンネルで、歩いておよそ15分で本州の下関側まで渡ることができます。トンネルの中ほどには福岡県と山口県の県境があり、世界的にも珍しい「海底の県境」とされています。時間と体力に余裕があれば、実際にトンネルを歩いて渡ってみましょう。見学を終えたら、歩いておよそ15分、和布刈公園第二展望台へ向かいましょう。";
  if (tunnel.memo !== TUNNEL_MEMO_OLD) throw new Error("関門トンネル人道: memo現在値が期待と不一致");

  const TENBOU_MEMO_OLD =
    "和布刈神社を参拝したら、歩いて和布刈公園第二展望台へ向かいましょう。関門海峡と関門橋を間近に望む展望台で、頭上を通る橋の迫力ある眺めが楽しめます。展望台には、有田焼の陶板およそ1400枚を使った壁画「源平壇之浦合戦絵巻」があり、高さ3m・長さ44mという国内最大級ともいわれる大きさを誇ります。下関市の赤間神宮に伝わる安徳天皇縁起図を参考に描かれたもので、源平最後の合戦・壇之浦の戦いの様子を今に伝えています。関門海峡を舞台にした歴史絵巻を眺めながら、ひと息つきましょう。見学を終えたら、歩いて関門トンネル人道へ向かいましょう。";
  const TENBOU_MEMO_NEW =
    "関門トンネル人道から歩いておよそ15分、旅の最後は和布刈公園第二展望台です。関門海峡と関門橋を間近に望む展望台で、頭上を通る橋の迫力ある眺めが楽しめます。展望台には、有田焼の陶板およそ1400枚を使った壁画「源平壇之浦合戦絵巻」があり、高さ3m・長さ44mという国内最大級ともいわれる大きさを誇ります。下関市の赤間神宮に伝わる安徳天皇縁起図を参考に描かれたもので、源平最後の合戦・壇之浦の戦いの様子を今に伝えています。関門海峡を舞台にした歴史絵巻を眺めながら、ひと息つきましょう。帰りは、タクシーでおよそ19分の門司港駅から、電車に乗りましょう。旧門司三井倶楽部と出光美術館、大正ロマン建築をめぐるアート散策は、これで終わりです。";
  if (tenbou.memo !== TENBOU_MEMO_OLD) throw new Error("和布刈公園第二展望台: memo現在値が期待と不一致");

  console.log(`\n[門司港駅]\n旧: ${EKI_MEMO_OLD}\n新: ${EKI_MEMO_NEW}`);
  console.log(`\n[旧門司三井倶楽部]\n旧: ${MITSUI_MEMO_OLD}\n新: ${MITSUI_MEMO_NEW}`);
  console.log(`\n[出光美術館（門司）]\n旧: ${IDEMITSU_MEMO_OLD}\n新: ${IDEMITSU_MEMO_NEW}`);
  console.log(`\n[ブルーウィングもじ]\n旧: ${BLUEWING_MEMO_OLD}\n新: ${BLUEWING_MEMO_NEW}`);
  console.log(`\n[旧門司税関(新規・昼食)]\n新: ${ZEIKAN_MEMO_NEW}`);
  console.log(`\n[九州鉄道記念館]\n旧: ${TETSUDO_MEMO_OLD}\n新: ${TETSUDO_MEMO_NEW}`);
  console.log(`\n[関門海峡ミュージアム]\n旧: ${MUSEUM_MEMO_OLD}\n新: ${MUSEUM_MEMO_NEW}`);
  console.log(`\n[和布刈神社]\n旧: ${JINJA_MEMO_OLD}\n新: ${JINJA_MEMO_NEW}`);
  console.log(`\n[関門トンネル人道]\n旧: ${TUNNEL_MEMO_OLD}\n新: ${TUNNEL_MEMO_NEW}`);
  console.log(`\n[和布刈公園第二展望台(最後)]\n旧: ${TENBOU_MEMO_OLD}\n新: ${TENBOU_MEMO_NEW}`);

  const DESC_OLD = "門司港レトロの中でも、歴史的建築と美術館に焦点を当てたプラン。はね橋の可動を見られるタイミングも狙い目です。";
  const DESC_NEW = "門司港レトロの中でも、歴史的建築と美術館に焦点を当てたプラン。はね橋が跳ね上がる時間にあわせて訪れることもできます。";
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");
  console.log(`\n[説明文]\n旧: ${DESC_OLD}\n新: ${DESC_NEW}`);

  console.log("\n[書き込む内容(点・時刻・滞在・区間)、1か所ずつ]");
  console.log(`門司港駅: 座標33.945112,130.961481 / 時刻08:50 / 滞在30分(変更なし)`);
  console.log(`旧門司三井倶楽部: 座標33.945724,130.962575 / 時刻09:22 / 滞在40分(変更なし) / incoming walk2分`);
  console.log(`出光美術館（門司）: 座標33.9489100,130.9652760 / 時刻10:10 / 滞在50分(変更なし) / incoming walk8分`);
  console.log(`ブルーウィングもじ: 座標変更なし / 時刻11:06 / 滞在30分(変更なし) / incoming walk6分`);
  console.log(`旧門司税関(新規・昼食): 座標33.9477292,130.9635866 / 時刻11:38 / 滞在40分 / incoming walk2分`);
  console.log(`九州鉄道記念館: 座標33.9432669,130.9617750 / 時刻12:29 / 滞在60分(変更なし) / incoming walk11分`);
  console.log(`関門海峡ミュージアム: 座標33.9437966,130.9567859 / 時刻13:38 / 滞在60分(変更なし) / incoming walk9分`);
  console.log(`和布刈神社: 座標33.9606598,130.9622895 / 時刻14:49 / 滞在30分(変更なし) / incoming taxi11分`);
  console.log(`関門トンネル人道: 座標33.9612865,130.9630471 / 時刻15:21 / 滞在25分 / incoming walk2分`);
  console.log(`和布刈公園第二展望台: 座標33.9577987,130.9671370 / 時刻16:01 / 滞在30分(変更なし) / incoming walk15分`);
  console.log("終わり: 16:01+30分=16:31（日帰りの発車16:30〜17:00の中）。帰りはタクシーでおよそ19分の門司港駅");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = eki.dayId;

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW } });
    await setDaySpotOrder(
      dayId,
      [
        { id: eki.id, data: { memo: EKI_MEMO_NEW, lat: 33.945112, lng: 130.961481, visitTime: t(8, 50) } },
        {
          id: mitsui.id,
          data: {
            memo: MITSUI_MEMO_NEW,
            lat: 33.945724,
            lng: 130.962575,
            visitTime: t(9, 22),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          id: idemitsu.id,
          data: {
            memo: IDEMITSU_MEMO_NEW,
            lat: 33.9489100,
            lng: 130.9652760,
            visitTime: t(10, 10),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
          },
        },
        {
          id: bluewing.id,
          data: {
            memo: BLUEWING_MEMO_NEW,
            visitTime: t(11, 6),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
          },
        },
        {
          create: {
            name: "旧門司税関",
            lat: 33.9477292,
            lng: 130.9635866,
            memo: ZEIKAN_MEMO_NEW,
            visitTime: t(11, 38),
            stayDurationMin: 40,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          id: tetsudo.id,
          data: {
            memo: TETSUDO_MEMO_NEW,
            lat: 33.9432669,
            lng: 130.9617750,
            visitTime: t(12, 29),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
          },
        },
        {
          id: museum.id,
          data: {
            memo: MUSEUM_MEMO_NEW,
            lat: 33.9437966,
            lng: 130.9567859,
            visitTime: t(13, 38),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
        {
          id: jinja.id,
          data: {
            memo: JINJA_MEMO_NEW,
            lat: 33.9606598,
            lng: 130.9622895,
            visitTime: t(14, 49),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 11 }] },
          },
        },
        {
          id: tunnel.id,
          data: {
            memo: TUNNEL_MEMO_NEW,
            lat: 33.9612865,
            lng: 130.9630471,
            visitTime: t(15, 21),
            stayDurationMin: 25,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          id: tenbou.id,
          data: {
            memo: TENBOU_MEMO_NEW,
            lat: 33.9577987,
            lng: 130.9671370,
            visitTime: t(16, 1),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
          },
        },
      ],
      { remove: [], tx }
    );
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
