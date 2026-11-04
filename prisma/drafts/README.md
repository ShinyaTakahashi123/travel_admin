# 新しい公式しおりの「下書きファイル＋自動の確認・登録」の道具（2026-11-04 開発）

仕様書: `docs/specs/20261104-itinerary-draft-and-checker.md`（しおりえ(企画運営)）

これまでは、新しいしおりをDBに直接書き込みながら作っていたため、見直しのときに時刻のずれ・座標の誤り・決まった文の抜けなどの直しが多く出た。これからは、**1本のしおりを下書きファイル（JSON）にまとめて書き、確認の道具で ⚠ がなくなるまで直し、法務・企画運営のOKが出た版だけを登録の道具でまとめてDBに書き込む**。

## 1. 下書きファイルの形

`admin-site/prisma/drafts/<日付-名前>.json` に、しおり1本ぶんを書く。TypeScriptの型は `prisma/lib/draft-schema.ts`（`DraftItinerary`）。見本は `prisma/drafts/_example-draft.json`。

```jsonc
{
  "title": "しおりのタイトル",
  "description": "説明文",
  "nights": 0,                       // 0=日帰り、1=1泊2日、2=2泊3日...
  "seasons": ["spring", "summer", "autumn", "winter"],
  "tagNames": ["定番観光"],           // DBのTag.nameと一致する名前
  "purposeNames": ["神社"],           // DBのPurposeTag.nameと一致する名前
  "prefectureName": "奈良県",         // DBのArea(level=prefecture).nameと一致
  "areaNames": ["奈良市内"],          // DBのArea(parentId=都道府県).nameと一致
  "cover": { "commonsFile": "...", "sourceUrl": "...", "author": "...", "license": "..." },
  "citations": [{ "url": "開いたURL", "excerpt": "そのページの抜き出し" }],
  "days": [
    [ /* 1日目の行き先(DraftSpot)を並べた配列 */ ]
  ]
}
```

行き先（`DraftSpot`）1件ごとに持つもの:

| 項目 | 内容 |
|---|---|
| `name` / `address` | 名前・住所 |
| `time` | 着く時刻。`"HH:MM"` |
| `stayDurationMin` | 滞在(分) |
| `memo` | 紹介文・決まった文を含む本文 |
| `legs` | 前のスポットからの移動。`{mode, min, line?}` の配列（最大4つ）。**各日の1件目は空配列** |
| `point` | `{lat, lng, source}`。`lat`/`lng`は小数6けたを目安に。`source`は点の出どころ（下記） |
| `photos` | `{commonsFile, sourceUrl, author, license, licenseUrl?}` の配列(省略可) |
| `marks` | 印。`"shrine"\|"temple"\|"grave"\|"kofun"\|"worship"\|"lunch"\|"rental_pickup"\|"rental_return"` のうち当てはまるもの |
| `hours` | `{note, sourceUrl}`。開く・閉まる時刻と休みの日を確かめた記録（本文には書かない） |
| `citations` | このスポットの本文の出典一覧。**道具は欄が空かどうかだけを見る**（内容が本当かは人が確かめる） |

`point.source` の形（7章の「取る順番」のとおり）:

```jsonc
{ "kind": "osm_node", "id": "1234567" }                 // OSMのnode
{ "kind": "osm_way",  "id": "7654321", "note": "中心" }  // OSMのway/relationの中心
{ "kind": "gsi",       "reason": "OSMに地物がないため地理院の住所検索を使用" }
{ "kind": "exception", "reason": "広い境内の例外(7章)。企画運営のOK: ..." }
```

## 2. 確認の道具（check-draft.ts）

下書きファイルを読んで ⚠ の一覧を出す。**DBにも本番にもつながない**（8の「似たしおり」の確認だけ、今つながっているDB＝既定では開発用を読み取る）。

```bash
npx tsx prisma/check-draft.ts prisma/drafts/<ファイル名>.json
npx tsx prisma/check-draft.ts prisma/drafts/<ファイル名>.json --no-similar   # 似たしおりの確認を飛ばす(DB読み取り不要)
npm run prod -- npx tsx prisma/check-draft.ts prisma/drafts/<ファイル名>.json  # 似たしおりの確認を本番と比べる(読み取りのみ)
```

見るもの（`docs/content/itinerary-rules.md` 1・2・3・5・7・10章が元）:

1. 座標: 範囲(緯度24〜46・経度122〜154)、小数のけた、度分秒をそのまま直した疑い(DMS?)、点の出どころの欄
2. 時刻のつながり: 前の着く時刻＋滞在＋移動の合計＝次の着く時刻
3. 1日の枠: 1章の表(日帰り/泊まりの初日/中の日/最終日)どおりの着く・出る時刻と行き先の数、昼食の時刻・滞在(35〜45分)、滞在100分以内
4. 区間の分: 歩きは `routing.openstreetmap.de/routed-foot`、車は OSRM で測り直し、短すぎないかを見る(歩き25分超えも ⚠)。**1回の実行で区間の数だけ問い合わせ、間をあけて呼ぶ**
5. メモの分と区間の分の整合（書き出し・結びの「この後は、…」の分）
6. 決まった文（祈りの一文・お墓の一文・レンタカーの一文）
7. 使わない言葉・ぼかしのない言い切り（一覧は `prisma/lib/word-rules.json`。決まりが増えたらここに足す）
8. 似たしおり（本番/開発の読み取りが要る。名前が同じ、または200m以内の点があるスポットを一覧にする）
9. 写真の出典
10. 終わりに `⚠ なし` か `⚠ N件`、ファイルの sha256

⚠ が出たら、下書きを直すか、道具の判定が違うと思えば企画運営に知らせる（決まりの読み方の勘違いもあるため）。

## 3. 登録の道具（register-draft.ts）

⚠ が0件になり、法務・企画運営のOKが**その版のsha256**に出たら、まとめて「承認待ち（非公開）」で登録する。**本番で動かすのは制作**（企画運営・法務のOK後）。

```bash
# 確認モード(DBには書き込まない。登録するデータそのものから表示を作る)
npx tsx prisma/register-draft.ts prisma/drafts/<ファイル>.json <sha256>

# 登録モード(複数本まとめて指定できる)
npx tsx prisma/register-draft.ts prisma/drafts/<ファイル1>.json <sha256-1> prisma/drafts/<ファイル2>.json <sha256-2> --commit

# 本番に書き込むとき(制作が、企画運営・法務のOK後に実行)
npm run prod -- npx tsx prisma/register-draft.ts prisma/drafts/<ファイル>.json <sha256> --commit
```

- `sha256` は、確認の道具が最後に出した値をそのまま渡す。**ファイルの今のsha256と違えば、何も書き込まずに止まる**（OKを出した版だけを書くため）
- 登録の前に確認の道具を自動でかけ、**⚠ が1件でもあれば(似たしおりの確認を含め)、どれも登録せずに止まる**
- 同じ `title` のしおりが既にあれば、そのファイルだけスキップする（他のファイルは続行）
- 時刻は `Date.UTC(1970, 0, 1, 時, 分)` で保存
- 登録のあとに読み戻し、下書きファイルと比べて違いがあれば表示する
- 写真は、下書きの `commonsFile`（Wikimedia Commonsのファイル名）から画像を取り直し、Vercel Blobへ保存する。取得に失敗した写真は警告を出し、そのスポットの登録自体は続ける
- 既定では今つながっているDB＝開発用に書き込む。`npm run prod --` を付けたときだけ本番

### 試した結果(2026-11-04 開発)

- 公開中で直し済みのしおり3本（`c77a7701`・`bb5348fc`・`b81511f9`）を `prisma/drafts/_test/export-existing-as-draft.ts` でDBから下書きの形に書き出し、確認の道具をかけた。3本とも ⚠ が出た（古い言い回し「ください」「おすすめです」、短すぎる徒歩の区間、結びの「この後は、…」が無い箇所など）。**これは組み直しの対象がこの道具の決まり（最新のitinerary-rules.md）とは別の観点だったための食いちがいで、道具の誤動作ではない**（企画運営に詳細を報告済み。書き出しスクリプトは点の出どころ・出典・開閉時刻の記録がDBに無いため、プレースホルダーの文字列で埋めている＝確認の道具はそこが空でないことしか見ないので支障はない）
- わざと間違えた下書き（`prisma/drafts/_test/bad-*.json`。時刻のずれ・歩く分の不足・緯度経度の入れかえ・祈りの一文のずれ・「おすすめ」）を作り、それぞれ対応する ⚠ が出ることを確認した
- 実在に似せた架空の下書き（`prisma/drafts/_test/good-baseline.json`）を作り、⚠ なしになることを確認(経路の計算・似たしおりの確認も含めて実行)。似たしおりの確認では、実在の有名スポット名を使ったため本番の該当しおり数本と重なりが正しく検出された
- 架空の地点に動かした版（`good-baseline-fictional.json`）を、開発用DBに `--commit` で登録し、読み戻しが下書きファイルと一致することを確認。登録後、試しの行はDBから削除済み

`_test/` 配下は試し用のファイル（本番には関係しない）。新しいしおりの下書きは `prisma/drafts/` 直下に置く。

## 4. やらないこと

- 本番のしおりデータの変更（登録の道具を本番で動かすのは制作）
- `schema.prisma`・マイグレーションの変更
- 3サイトの画面の変更
- 文の中身（事実・出典が本当に正しいか）の自動判断。そこは人が見る
