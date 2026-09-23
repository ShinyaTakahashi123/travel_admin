/**
 * 紅葉特集のしおり（2026年秋）
 *
 * 既存のseed-pilot-launch / seed-batch2 はスポットをランダムに日別へ割り振る自動生成だが、
 * 紅葉しおりは検索流入の目玉にするため、ルート・訪問時刻・移動手段を1本ずつ手作りで定義する。
 * 座標・URLの確認、登録、写真補完の処理は prisma/lib/handmade-gen.ts を参照。
 *
 * 実行方法:
 *   npx tsx prisma/seed-koyo-2026.ts               … 確認モード（DBには書き込まない）
 *   npx tsx prisma/seed-koyo-2026.ts --commit      … 登録モード（同名のしおりが既にあればスキップ）
 *   npx tsx prisma/seed-koyo-2026.ts --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  {
    title: "嵯峨野の紅葉めぐり。天龍寺・常寂光寺・祇王寺を歩く秋の嵐山",
    description:
      "世界遺産・天龍寺の庭園から、竹林の小径を抜けて小倉山麓の紅葉の名所を歩いてめぐる日帰りプランです。例年の見頃は11月中旬〜12月上旬。人気の寺院は午前中が比較的空いているので、朝一番の天龍寺からスタートし、最後は夕暮れの渡月橋で締めくくります。",
    nights: 0,
    prefectureName: "京都府",
    areaNames: ["嵐山・嵯峨野"],
    tagNames: ["紅葉", "定番観光", "絶景"],
    purposeNames: ["紅葉狩り", "お寺", "絶景・フォトスポット"],
    days: [
      [
        { name: "天龍寺", wikiTitle: "天龍寺", address: "京都府京都市右京区嵯峨天龍寺芒ノ馬場町68", time: "09:00", stay: 60, websiteUrl: "https://www.tenryuji.com/", memo: "JR嵯峨嵐山駅から徒歩約13分。嵐山を借景にした曹源池庭園は、紅葉に彩られる秋が特に見事。北門から竹林の小径へ抜けられます。" },
        { name: "竹林の小径", wikiTitle: "竹林の小径", address: "京都府京都市右京区嵯峨小倉山田淵山町", time: "10:05", stay: 20, transit: { mode: "walk", min: 5 }, fallbackLatLng: [35.017, 135.6717], memo: "天龍寺北門を出てすぐ。青竹の道は紅葉の季節でも人気で、朝のうちは比較的ゆったり歩けます。" },
        { name: "常寂光寺", wikiTitle: "常寂光寺", address: "京都府京都市右京区嵯峨小倉山小倉町3", time: "10:35", stay: 50, websiteUrl: "https://www.jojakko-ji.or.jp/", transit: { mode: "walk", min: 10 }, memo: "小倉山の中腹に建つ、嵯峨野屈指の紅葉の名所。仁王門から本堂・多宝塔へ続く石段がもみじに包まれます。高台からは京都市街も一望できます。" },
        { name: "二尊院", wikiTitle: "二尊院", address: "京都府京都市右京区嵯峨二尊院門前長神町27", time: "11:30", stay: 40, transit: { mode: "walk", min: 5 }, memo: "総門から続く参道は「紅葉の馬場」と呼ばれ、もみじのトンネルが見事です。" },
        { name: "祇王寺", wikiTitle: "祇王寺", address: "京都府京都市右京区嵯峨鳥居本小坂町32", time: "12:20", stay: 30, transit: { mode: "walk", min: 10 }, memo: "苔むした庭に散りもみじが重なる、しっとりとした風情の小さな尼寺。見頃の終盤は「敷きもみじ」も楽しめます。" },
        { name: "渡月橋", wikiTitle: "渡月橋", address: "京都府京都市右京区嵯峨天龍寺芒ノ馬場町", time: "14:00", stay: 45, transit: { mode: "walk", min: 25 }, fallbackLatLng: [35.0129, 135.6778], memo: "途中で昼食をとってから嵐山のシンボルへ。紅葉に染まる嵐山と桂川の景色は、夕方の柔らかい光の中で眺めるのがおすすめです。" },
      ],
    ],
  },
  {
    title: "もみじの永観堂から哲学の道へ。東山の紅葉名所さんぽ",
    description:
      "「もみじの永観堂」と呼ばれる紅葉の名所を中心に、南禅寺から哲学の道を北へ歩き、銀閣寺・真如堂・金戒光明寺をめぐる日帰りプランです。例年の見頃は11月中旬〜下旬。東山の山すそに沿って歩ける、移動の少ないコースです。",
    nights: 0,
    prefectureName: "京都府",
    areaNames: ["京都市内（清水・祇園・河原町）"],
    tagNames: ["紅葉", "定番観光"],
    purposeNames: ["紅葉狩り", "お寺", "絶景・フォトスポット"],
    days: [
      [
        { name: "南禅寺", wikiTitle: "南禅寺", address: "京都府京都市左京区南禅寺福地町86", time: "09:00", stay: 60, websiteUrl: "https://nanzenji.or.jp/", memo: "地下鉄東西線・蹴上駅から徒歩約10分。巨大な三門の上から見下ろす紅葉と、レンガ造りの水路閣が見どころ。周辺は湯豆腐の名店も多いエリアです。" },
        { name: "永観堂（禅林寺）", wikiTitle: "禅林寺 (京都市)", address: "京都府京都市左京区永観堂町48", time: "10:05", stay: 70, websiteUrl: "https://www.eikando.or.jp/", transit: { mode: "walk", min: 5 }, memo: "古くから「もみじの永観堂」と呼ばれる紅葉の名所。境内のもみじは約3,000本といわれ、放生池の周りや多宝塔からの眺めが見事です。紅葉シーズンは特別拝観となり、例年は夜間のライトアップも行われます。" },
        { name: "哲学の道", wikiTitle: "哲学の道", address: "京都府京都市左京区浄土寺石橋町", time: "11:30", stay: 45, transit: { mode: "walk", min: 15 }, fallbackLatLng: [35.0229, 135.7944], memo: "琵琶湖疏水沿いに続く約2kmの散歩道。南から北へ、紅葉を眺めながらのんびり歩きましょう。道沿いにはカフェや甘味処もあります。" },
        { name: "銀閣寺（慈照寺）", wikiTitle: "慈照寺", address: "京都府京都市左京区銀閣寺町2", time: "12:25", stay: 50, websiteUrl: "https://www.shokoku-ji.jp/ginkakuji/", transit: { mode: "walk", min: 10 }, memo: "哲学の道の北端にある世界遺産。銀沙灘と向月台の砂の造形と、観音殿を包む秋の木々のコントラストが楽しめます。" },
        { name: "真如堂（真正極楽寺）", wikiTitle: "真正極楽寺", address: "京都府京都市左京区浄土寺真如町82", time: "13:55", stay: 45, transit: { mode: "walk", min: 20 }, memo: "銀閣寺周辺で昼食をとってから。観光客が比較的少なく、三重塔と紅葉が重なる景色をゆっくり楽しめる穴場です。" },
        { name: "金戒光明寺", wikiTitle: "金戒光明寺", address: "京都府京都市左京区黒谷町121", time: "14:45", stay: 40, transit: { mode: "walk", min: 5 }, memo: "「くろ谷さん」と親しまれる大きな寺院。山門や三重塔へ続く石段から紅葉と京都市街を見渡せます。帰りは岡崎方面へ歩き、市バスを利用すると便利です。" },
      ],
    ],
  },
  {
    title: "東福寺の通天橋と大原の里。京都の紅葉を満喫する秋の2日間",
    description:
      "1日目は京都屈指の紅葉の名所・東福寺から東山を歩き、夜は清水寺の秋の夜間特別拝観へ。2日目はバスで大原へ足をのばし、三千院や寂光院など山里の紅葉を楽しむ1泊2日プランです。例年の見頃は、大原が11月上旬〜下旬、東山が11月中旬〜12月上旬です。",
    nights: 1,
    prefectureName: "京都府",
    areaNames: ["京都市内（清水・祇園・河原町）"],
    tagNames: ["紅葉", "定番観光", "絶景"],
    purposeNames: ["紅葉狩り", "お寺", "神社", "夜景", "絶景・フォトスポット"],
    days: [
      [
        { name: "東福寺", wikiTitle: "東福寺", address: "京都府京都市東山区本町15-778", time: "09:00", stay: 70, websiteUrl: "https://tofukuji.jp/", memo: "JR・京阪の東福寺駅から徒歩約10分。渓谷に架かる通天橋から見下ろす「洗玉澗」の紅葉は、京都を代表する景色です。見頃の週末はとても混むので、朝早めの到着がおすすめ。" },
        { name: "泉涌寺", wikiTitle: "泉涌寺", address: "京都府京都市東山区泉涌寺山内町27", time: "10:25", stay: 45, websiteUrl: "https://www.mitera.org/", transit: { mode: "walk", min: 15 }, memo: "皇室ゆかりの「御寺（みてら）」。塔頭の今熊野観音寺周辺も紅葉が美しく、東福寺ほど混雑しないので落ち着いて楽しめます。" },
        { name: "高台寺", wikiTitle: "高台寺", address: "京都府京都市東山区高台寺下河原町526", time: "13:00", stay: 50, websiteUrl: "https://www.kodaiji.com/", transit: { mode: "taxi", min: 15 }, memo: "タクシーで移動し、周辺で昼食をとってから拝観を。臥龍池に映り込む紅葉が見どころです。" },
        { name: "八坂神社", wikiTitle: "八坂神社", address: "京都府京都市東山区祇園町北側625", time: "14:15", stay: 40, websiteUrl: "https://www.yasaka-jinja.or.jp/", transit: { mode: "walk", min: 10 }, memo: "ねねの道・円山公園を通って祇園へ。夜間拝観までは、祇園や二寧坂・産寧坂の散策、カフェでの休憩でゆっくり過ごしましょう。" },
        { name: "清水寺", wikiTitle: "清水寺", address: "京都府京都市東山区清水1-294", time: "17:30", stay: 70, websiteUrl: "https://www.kiyomizudera.or.jp/", transit: { mode: "walk", min: 20 }, memo: "例年、紅葉の時期には秋の夜間特別拝観が行われ、ライトアップされた紅葉と舞台が幻想的な景色をつくります。開催期間や時間は年によって異なるため、公式サイトで確認してください。" },
      ],
      [
        { name: "三千院", wikiTitle: "三千院", address: "京都府京都市左京区大原来迎院町540", time: "09:30", stay: 70, websiteUrl: "https://www.sanzenin.or.jp/", memo: "京都駅から京都バス（17系統）で大原まで約1時間。苔の庭と紅葉のコントラストが美しい、大原を代表する寺院です。わらべ地蔵も人気。" },
        { name: "宝泉院", wikiTitle: "宝泉院 (京都市)", address: "京都府京都市左京区大原勝林院町187", time: "10:45", stay: 40, transit: { mode: "walk", min: 5 }, fallbackLatLng: [35.1199, 135.8349], memo: "柱と柱の間を額縁に見立てて庭を眺める「額縁庭園」で知られます。抹茶をいただきながら、額縁の中の紅葉をゆっくり味わえます。" },
        { name: "実光院", wikiTitle: "実光院", address: "京都府京都市左京区大原勝林院町", time: "11:30", stay: 30, transit: { mode: "walk", min: 3 }, fallbackLatLng: [35.1195, 135.8345], memo: "宝泉院のすぐ近く。紅葉と、秋から冬に咲く不断桜が同時に見られることがある珍しいお寺です。" },
        { name: "寂光院", wikiTitle: "寂光院", address: "京都府京都市左京区大原草生町676", time: "13:00", stay: 45, websiteUrl: "https://www.jakkoin.jp/", transit: { mode: "walk", min: 20 }, memo: "大原の里で昼食をとってから、田園風景の中を歩いて向かいます。平家物語ゆかりの静かな尼寺で、参道の石段の紅葉が見事です。帰りは大原バス停から京都バスで京都駅方面へ。" },
      ],
    ],
  },
  {
    title: "いろは坂から奥日光へ。華厳滝と戦場ヶ原の紅葉旅",
    description:
      "世界遺産の社寺をめぐったあと、いろは坂を上って中禅寺湖畔に宿泊。2日目は竜頭ノ滝から戦場ヶ原の自然研究路を歩き、湯元温泉で締めくくる1泊2日プランです。日光の紅葉は標高の高い奥日光から始まり、例年10月上旬の奥日光から、10月中旬〜下旬のいろは坂・中禅寺湖、11月上旬の日光市街へと下っていきます。",
    nights: 1,
    prefectureName: "栃木県",
    areaNames: ["日光"],
    tagNames: ["紅葉", "絶景", "温泉"],
    purposeNames: ["紅葉狩り", "神社", "お寺", "自然", "ハイキング・登山", "温泉"],
    days: [
      [
        { name: "神橋", wikiTitle: "神橋 (日光市)", address: "栃木県日光市上鉢石町", time: "09:30", stay: 15, fallbackLatLng: [36.7533, 139.604], memo: "東武日光駅・JR日光駅からバスで約5分。大谷川に架かる朱塗りの橋で、日光二荒山神社の建造物です。紅葉の渓谷と朱色の橋の組み合わせが絵になります。" },
        { name: "日光山輪王寺", wikiTitle: "輪王寺", address: "栃木県日光市山内2300", time: "09:55", stay: 40, websiteUrl: "https://www.rinnoji.or.jp/", transit: { mode: "walk", min: 10 }, memo: "日光山の総本堂・三仏堂が見どころ。境内の逍遥園は、紅葉の時期に特に美しい日本庭園です。" },
        { name: "日光東照宮", wikiTitle: "日光東照宮", address: "栃木県日光市山内2301", time: "10:45", stay: 90, websiteUrl: "https://www.toshogu.jp/", transit: { mode: "walk", min: 10 }, memo: "徳川家康をまつる世界遺産。陽明門や眠り猫など、豪華な彫刻をじっくり見学しましょう。" },
        { name: "日光二荒山神社", wikiTitle: "日光二荒山神社", address: "栃木県日光市山内2307", time: "12:20", stay: 30, websiteUrl: "https://www.futarasan.jp/", transit: { mode: "walk", min: 5 }, fallbackLatLng: [36.7583, 139.5964], memo: "日光の山々をご神体とする古社。参拝後は周辺で昼食をとり、中禅寺温泉行きのバスへ。" },
        { name: "華厳滝", wikiTitle: "華厳滝", address: "栃木県日光市中宮祠", time: "14:00", stay: 40, transit: { mode: "bus", min: 45, line: "東武バス（中禅寺温泉方面）" }, memo: "バスは紅葉の名所・いろは坂を上ります。見頃の週末は大渋滞することが多いので、時間に余裕をもって。落差97mの滝は、有料エレベーターで下りる観瀑台から間近に見られます。" },
        { name: "中禅寺湖", wikiTitle: "中禅寺湖", address: "栃木県日光市中宮祠", time: "15:00", stay: 60, transit: { mode: "walk", min: 10 }, fallbackLatLng: [36.7385, 139.4965], memo: "男体山のふもとに広がる湖。湖畔の散策や遊覧船で、山肌を彩る紅葉を楽しめます。この日は中禅寺温泉周辺に宿泊します。" },
      ],
      [
        { name: "竜頭ノ滝", wikiTitle: "竜頭の滝", address: "栃木県日光市中宮祠", time: "09:00", stay: 30, fallbackLatLng: [36.7588, 139.4513], memo: "中禅寺温泉からバスで約20分。岩肌を流れ落ちる滝の両側が紅葉に染まる、奥日光を代表する紅葉スポットです。" },
        { name: "戦場ヶ原", wikiTitle: "戦場ヶ原", address: "栃木県日光市中宮祠", time: "10:00", stay: 90, transit: { mode: "walk", min: 30 }, fallbackLatLng: [36.7791, 139.4434], memo: "赤沼から湯滝まで、木道の自然研究路を約1時間半歩きます。草紅葉に染まる湿原と男体山の眺めが見事。平坦な道が中心ですが、歩きやすい靴で。" },
        { name: "湯滝", wikiTitle: "湯滝", address: "栃木県日光市湯元", time: "12:05", stay: 30, transit: { mode: "walk", min: 30 }, memo: "湯ノ湖から流れ落ちる、高さ約70mの迫力ある滝。滝つぼ近くの観瀑台から見上げられます。" },
        { name: "湯ノ湖", wikiTitle: "湯ノ湖", address: "栃木県日光市湯元", time: "12:55", stay: 40, transit: { mode: "walk", min: 20 }, memo: "湖畔の遊歩道を歩いて湯元温泉へ。周囲の山々の紅葉が湖面に映る、静かな景色が楽しめます。" },
        { name: "日光湯元温泉", wikiTitle: "日光湯元温泉", address: "栃木県日光市湯元", time: "13:50", stay: 90, transit: { mode: "walk", min: 15 }, memo: "乳白色の硫黄泉が自慢の温泉地。日帰り入浴できる施設も多いので、歩いた疲れを癒やしましょう。帰りは湯元温泉からバスで日光駅方面へ（約1時間20分）。" },
      ],
    ],
  },
  {
    title: "奥入瀬渓流を歩き、十和田湖の紅葉に出会う旅",
    description:
      "渓流沿いの遊歩道を歩いて奥入瀬の滝や急流をめぐり、十和田湖畔に宿泊。2日目は遊覧船で湖上から紅葉を眺める1泊2日プランです。例年の見頃は10月中旬〜下旬。バスと徒歩を組み合わせて、見どころを効率よくめぐります。",
    nights: 1,
    prefectureName: "青森県",
    areaNames: ["十和田・奥入瀬"],
    tagNames: ["紅葉", "絶景"],
    purposeNames: ["紅葉狩り", "自然", "ハイキング・登山", "絶景・フォトスポット"],
    days: [
      [
        { name: "奥入瀬渓流館", wikiTitle: "奥入瀬渓流", address: "青森県十和田市奥瀬栃久保183", time: "11:00", stay: 30, fallbackLatLng: [40.5746, 140.9788], memo: "JR八戸駅・新青森駅などから路線バスで奥入瀬渓流の入口・焼山へ。渓流の見どころや散策ルートの情報を確認してから出発しましょう。" },
        { name: "石ケ戸", wikiTitle: "奥入瀬渓流", address: "青森県十和田市奥瀬", time: "11:45", stay: 20, transit: { mode: "bus", min: 10, line: "JRバス東北（十和田湖方面）" }, fallbackLatLng: [40.54, 140.9776], memo: "大きな岩を支えるように木が生えた、鬼神のすみかと伝わる岩屋。ここから上流に向かって渓流沿いを歩きます。" },
        { name: "阿修羅の流れ", wikiTitle: "奥入瀬渓流", address: "青森県十和田市奥瀬", time: "12:45", stay: 20, transit: { mode: "walk", min: 40 }, fallbackLatLng: [40.53, 140.976], memo: "奥入瀬渓流を代表する急流。苔むした岩の間を勢いよく流れる水と、頭上の紅葉が見事です。" },
        { name: "雲井の滝", wikiTitle: "奥入瀬渓流", address: "青森県十和田市奥瀬", time: "13:35", stay: 15, transit: { mode: "walk", min: 30 }, fallbackLatLng: [40.5202, 140.9732], memo: "3段に流れ落ちる落差約20mの滝。渓流沿いには大小さまざまな滝が点在しています。" },
        { name: "銚子大滝", wikiTitle: "奥入瀬渓流", address: "青森県十和田市奥瀬", time: "14:30", stay: 20, transit: { mode: "bus", min: 15, line: "JRバス東北（十和田湖方面）" }, fallbackLatLng: [40.4885, 140.9507], memo: "奥入瀬渓流の本流にかかる唯一の滝で、幅約20mの豪快な流れが見られます。この後はバスで十和田湖畔の休屋へ向かい、宿泊します。" },
      ],
      [
        { name: "十和田神社", wikiTitle: "十和田神社", address: "青森県十和田市奥瀬十和田湖畔休屋486", time: "09:00", stay: 30, memo: "休屋の森の中に建つ神社。杉木立に囲まれた静かな境内は、パワースポットとしても知られています。" },
        { name: "乙女の像", wikiTitle: "十和田湖", address: "青森県十和田市奥瀬十和田湖畔休屋", time: "09:40", stay: 20, transit: { mode: "walk", min: 10 }, fallbackLatLng: [40.4329, 140.8897], memo: "詩人・彫刻家の高村光太郎が手がけた、十和田湖のシンボル。湖畔の散策路の先に立っています。" },
        { name: "十和田湖遊覧船", wikiTitle: "十和田湖", address: "青森県十和田市奥瀬十和田湖畔休屋", time: "10:30", stay: 15, transit: { mode: "walk", min: 15 }, fallbackLatLng: [40.4271, 140.8905], memo: "休屋港から乗船します。子ノ口までの約50分、湖上から紅葉に彩られた半島や断崖を眺められます。運航期間・時刻は季節によって変わるので事前に確認を。" },
        { name: "子ノ口", wikiTitle: "奥入瀬渓流", address: "青森県十和田市奥瀬", time: "11:40", stay: 30, transit: { mode: "other", min: 50 }, fallbackLatLng: [40.4795, 140.9399], memo: "十和田湖から奥入瀬渓流が流れ出す場所。ここから路線バスで八戸駅・新青森駅方面へ戻れます。" },
      ],
    ],
  },
  {
    title: "雲場池の水鏡と旧軽井沢。軽井沢の紅葉さんぽ",
    description:
      "水面に紅葉が映り込む雲場池から、旧軽井沢の教会や歴史ある建物、白糸の滝までめぐる日帰りプランです。例年の見頃は10月下旬〜11月上旬。首都圏から新幹線で約1時間なので、気軽に紅葉狩りを楽しめます。",
    nights: 0,
    prefectureName: "長野県",
    areaNames: ["軽井沢"],
    tagNames: ["紅葉", "絶景", "グルメ"],
    purposeNames: ["紅葉狩り", "自然", "絶景・フォトスポット", "ショッピング"],
    days: [
      [
        { name: "雲場池", wikiTitle: "雲場池", address: "長野県北佐久郡軽井沢町大字軽井沢", time: "09:30", stay: 45, memo: "軽井沢駅から徒歩約20分。「スワンレイク」とも呼ばれる池で、風のない朝は水面に紅葉が鏡のように映り込みます。池を一周する遊歩道は約20分。" },
        { name: "旧軽井沢銀座通り", wikiTitle: "旧軽井沢銀座通り", address: "長野県北佐久郡軽井沢町大字軽井沢", time: "10:35", stay: 60, transit: { mode: "walk", min: 20 }, fallbackLatLng: [36.3599, 138.6369], memo: "ジャムやパン、雑貨の老舗が並ぶメインストリート。食べ歩きやおみやげ選びを楽しめます。" },
        { name: "軽井沢聖パウロカトリック教会", wikiTitle: "軽井沢聖パウロカトリック教会", address: "長野県北佐久郡軽井沢町大字軽井沢179", time: "11:40", stay: 20, transit: { mode: "walk", min: 5 }, memo: "旧軽井沢銀座通りから少し入った場所にある、木造の美しい教会。紅葉に囲まれた三角屋根が印象的です。" },
        { name: "軽井沢ショー記念礼拝堂", wikiTitle: "軽井沢ショー記念礼拝堂", address: "長野県北佐久郡軽井沢町大字軽井沢57-1", time: "12:10", stay: 20, transit: { mode: "walk", min: 10 }, memo: "軽井沢を避暑地として紹介した宣教師ショーゆかりの、軽井沢最古の教会。静かな林の中に建っています。" },
        { name: "旧三笠ホテル", wikiTitle: "旧三笠ホテル", address: "長野県北佐久郡軽井沢町大字軽井沢1339-342", time: "13:30", stay: 40, transit: { mode: "taxi", min: 10 }, memo: "昼食後にタクシーで。明治時代に建てられた純西洋式の木造ホテルで、国の重要文化財です。見学可能かどうかは事前に確認してください。" },
        { name: "白糸の滝", wikiTitle: "白糸の滝 (長野県)", address: "長野県北佐久郡軽井沢町大字長倉", time: "14:35", stay: 40, transit: { mode: "bus", min: 15, line: "草軽交通バス（北軽井沢方面）" }, memo: "高さ約3m・幅約70mの岩肌から、地下水が白い糸のように流れ落ちる滝。周囲の紅葉と合わせて楽しめます。" },
        { name: "軽井沢・プリンスショッピングプラザ", wikiTitle: "軽井沢・プリンスショッピングプラザ", address: "長野県北佐久郡軽井沢町軽井沢", time: "15:50", stay: 90, websiteUrl: "https://www.karuizawa-psp.jp/", transit: { mode: "bus", min: 30, line: "草軽交通バス（軽井沢駅方面）" }, memo: "軽井沢駅南口すぐの大型アウトレット。敷地内の芝生や池の周りも紅葉が見られます。帰りの新幹線まで買い物を楽しめます。" },
      ],
    ],
  },
  {
    title: "登山電車で紅葉の箱根へ。大涌谷・芦ノ湖をめぐる秋旅",
    description:
      "箱根登山電車で強羅へ上り、苔と紅葉の庭園や大涌谷をめぐって強羅温泉に宿泊。2日目は仙石原の紅葉とすすき、海賊船で芦ノ湖を渡って箱根神社を訪ねる1泊2日プランです。例年の見頃は11月上旬〜下旬。乗り物を乗り継ぐ箱根ならではの周遊ルートです。",
    nights: 1,
    prefectureName: "神奈川県",
    areaNames: ["箱根"],
    tagNames: ["紅葉", "温泉", "絶景"],
    purposeNames: ["紅葉狩り", "温泉", "美術館・博物館", "神社", "鉄道旅", "絶景・フォトスポット"],
    days: [
      [
        { name: "箱根美術館", wikiTitle: "箱根美術館", address: "神奈川県足柄下郡箱根町強羅1300", time: "11:00", stay: 60, websiteUrl: "https://www.moaart.or.jp/hakone/", memo: "箱根湯本駅から箱根登山電車で強羅駅まで約40分。苔庭と約200本のもみじが広がる庭園は、箱根有数の紅葉スポットです。" },
        { name: "箱根強羅公園", wikiTitle: "箱根強羅公園", address: "神奈川県足柄下郡箱根町強羅1300", time: "12:05", stay: 45, transit: { mode: "walk", min: 5 }, fallbackLatLng: [35.2486, 139.0452], memo: "大正時代に開園した、日本初のフランス式整形庭園。園内のカフェやレストランで昼食もとれます。" },
        { name: "大涌谷", wikiTitle: "大涌谷", address: "神奈川県足柄下郡箱根町仙石原", time: "13:30", stay: 60, transit: { mode: "other", min: 35 }, memo: "ケーブルカーとロープウェイを乗り継いで。ロープウェイからは紅葉に染まる山肌と、晴れていれば富士山が見えます。名物の黒たまごもぜひ。火山活動の状況により立ち入りが規制されることがあります。" },
        { name: "強羅温泉", wikiTitle: "強羅温泉", address: "神奈川県足柄下郡箱根町強羅", time: "15:30", stay: 60, transit: { mode: "other", min: 35 }, memo: "ロープウェイとケーブルカーで強羅に戻って宿へ。この日は強羅温泉に宿泊し、ゆっくり温泉を楽しみます。" },
      ],
      [
        { name: "長安寺", wikiTitle: "長安寺 (箱根町)", address: "神奈川県足柄下郡箱根町仙石原", time: "09:00", stay: 40, fallbackLatLng: [35.2735, 139.0128], memo: "強羅から路線バスで仙石原へ。境内に点在する約200体の羅漢像と紅葉の組み合わせが見られる、仙石原の紅葉の名所です。" },
        { name: "仙石原すすき草原", wikiTitle: "仙石原", address: "神奈川県足柄下郡箱根町仙石原", time: "09:55", stay: 30, transit: { mode: "bus", min: 10, line: "路線バス（桃源台方面）" }, fallbackLatLng: [35.261, 139.0065], memo: "台ヶ岳の斜面一面に広がるすすきの草原。例年、秋の終わりまで黄金色の景色が楽しめます。" },
        { name: "箱根海賊船（桃源台港）", wikiTitle: "箱根海賊船", address: "神奈川県足柄下郡箱根町元箱根164", time: "10:45", stay: 15, websiteUrl: "https://www.hakonenavi.jp/hakone-kankosen/", transit: { mode: "bus", min: 15, line: "路線バス（桃源台方面）" }, fallbackLatLng: [35.2376, 138.9946], memo: "桃源台港から乗船します。元箱根港まで約40分の船旅で、湖上から紅葉の山々と、晴れた日には富士山も望めます。" },
        { name: "箱根神社", wikiTitle: "箱根神社", address: "神奈川県足柄下郡箱根町元箱根80-1", time: "11:50", stay: 50, websiteUrl: "https://hakonejinja.or.jp/", transit: { mode: "other", min: 50 }, memo: "海賊船で元箱根港に着いたら、湖畔を歩いて向かいます。芦ノ湖畔に建つ関東屈指のパワースポット。湖に立つ「平和の鳥居」は人気の撮影スポットです。" },
        { name: "恩賜箱根公園", wikiTitle: "恩賜箱根公園", address: "神奈川県足柄下郡箱根町元箱根171", time: "13:20", stay: 40, transit: { mode: "walk", min: 25 }, memo: "元箱根で昼食をとり、箱根旧街道の杉並木を歩いて向かいます。旧離宮の跡地で、芦ノ湖と富士山を一望できる展望台があります。帰りは路線バスで箱根湯本駅へ。" },
      ],
    ],
  },
  {
    title: "もみじ回廊と富士山。河口湖の紅葉と絶景をめぐる日帰り旅",
    description:
      "五重塔と富士山を一緒に望む新倉山浅間公園からスタートし、ロープウェイでの空中散歩、紅葉のトンネルが続く河口湖もみじ回廊、湖畔の公園をめぐる日帰りプランです。例年の見頃は11月上旬〜中旬。もみじ回廊では例年、紅葉まつりとライトアップが行われます。",
    nights: 0,
    prefectureName: "山梨県",
    areaNames: ["富士五湖"],
    tagNames: ["紅葉", "絶景"],
    purposeNames: ["紅葉狩り", "絶景・フォトスポット", "美術館・博物館", "神社"],
    days: [
      [
        { name: "新倉山浅間公園", wikiTitle: "新倉山浅間公園", address: "山梨県富士吉田市浅間2-4-1", time: "09:00", stay: 60, fallbackLatLng: [35.5005, 138.8008], memo: "富士急行線・下吉田駅から徒歩約10分。約400段の階段を上った展望デッキから、五重塔（忠霊塔）と富士山、紅葉を一緒に収められます。空気が澄んだ午前中がおすすめ。" },
        { name: "河口湖〜富士山パノラマロープウェイ", wikiTitle: "〜河口湖〜 富士山パノラマロープウェイ", address: "山梨県南都留郡富士河口湖町浅川1163-1", time: "10:30", stay: 60, websiteUrl: "https://www.mt-fujiropeway.jp/", transit: { mode: "train", min: 30, line: "富士急行線（下吉田→河口湖）＋徒歩" }, fallbackLatLng: [35.5038, 138.7742], memo: "約3分の空中散歩で天上山の山頂へ。展望台からは富士山と河口湖、紅葉に彩られた湖畔の町並みを一望できます。" },
        { name: "河口湖もみじ回廊", wikiTitle: "河口湖", address: "山梨県南都留郡富士河口湖町河口", time: "12:40", stay: 50, transit: { mode: "bus", min: 30, line: "河口湖周遊バス" }, fallbackLatLng: [35.5256, 138.7624], memo: "河口湖駅周辺で昼食（名物のほうとうがおすすめ）をとってから。梅の木川沿いに約60本のもみじの大木が並ぶ紅葉のトンネルです。例年、紅葉まつりの期間は夜のライトアップも行われます。" },
        { name: "久保田一竹美術館", wikiTitle: "河口湖", address: "山梨県南都留郡富士河口湖町河口2255", time: "13:35", stay: 60, transit: { mode: "walk", min: 5 }, fallbackLatLng: [35.5274, 138.7598], memo: "もみじ回廊のすぐ近く。独自の染色技法「一竹辻が花」の着物作品と、紅葉の庭園を楽しめます。" },
        { name: "大石公園", wikiTitle: "大石公園", address: "山梨県南都留郡富士河口湖町大石2585", time: "14:55", stay: 45, transit: { mode: "bus", min: 20, line: "河口湖周遊バス" }, fallbackLatLng: [35.5233, 138.7465], memo: "河口湖越しに富士山を正面に望む湖畔の公園。秋は真っ赤に色づくコキアも見られることがあります。帰りは周遊バスで河口湖駅へ。" },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "koyo-2026" });
