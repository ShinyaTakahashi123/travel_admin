-- AlterTable
ALTER TABLE "area" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "area_parent_id_slug_key" ON "area"("parent_id", "slug");

-- CreateIndex
-- 都道府県同士(parent_id IS NULL の行同士)でのslug重複を防ぐ部分一意インデックス。
-- slugが未設定(NULL)の行は対象外なので、既存データへの影響はない。
CREATE UNIQUE INDEX "area_prefecture_slug_key" ON "area"("slug") WHERE "parent_id" IS NULL AND "slug" IS NOT NULL;

-- Data: 47都道府県・146エリアへのslug登録
UPDATE "area" SET "slug" = 'hokkaido' WHERE "id" = '5cbf01f2-3e24-4913-8030-3285cb5734af'; -- 北海道
UPDATE "area" SET "slug" = 'sapporo' WHERE "id" = '7409eef8-7b86-4be1-ac03-e9d4e3b614b4'; -- 北海道 札幌市内
UPDATE "area" SET "slug" = 'otaru-shakotan' WHERE "id" = '9eb63300-b659-4a57-af66-ff2ea2ee5503'; -- 北海道 小樽・積丹
UPDATE "area" SET "slug" = 'furano-biei' WHERE "id" = '42f71eda-7fa8-40cd-9281-d6782c45673a'; -- 北海道 富良野・美瑛
UPDATE "area" SET "slug" = 'hakodate' WHERE "id" = '342c7f96-5ded-4a8b-a843-041ff3f21f98'; -- 北海道 函館
UPDATE "area" SET "slug" = 'aomori' WHERE "id" = 'cee1c835-4365-43c1-868e-b0cc8fe39156'; -- 青森県
UPDATE "area" SET "slug" = 'aomori-city' WHERE "id" = '1a3dcf46-24a6-4bc5-919e-b9c3f8463ba8'; -- 青森県 青森市内
UPDATE "area" SET "slug" = 'hirosaki' WHERE "id" = '8550a6ad-a173-4e9c-a160-386719538e80'; -- 青森県 弘前
UPDATE "area" SET "slug" = 'towada-oirase' WHERE "id" = '2363d38e-bcad-4366-bbe5-a13b3bae544d'; -- 青森県 十和田・奥入瀬
UPDATE "area" SET "slug" = 'iwate' WHERE "id" = '7992e854-fbb7-4e82-a387-107cdfcbf1ce'; -- 岩手県
UPDATE "area" SET "slug" = 'morioka' WHERE "id" = '57ba8590-8c45-48a7-9e00-3c8d75ffe052'; -- 岩手県 盛岡
UPDATE "area" SET "slug" = 'hiraizumi' WHERE "id" = 'e7cc2fd4-5ce0-454c-a811-4e24ce4f5ed7'; -- 岩手県 平泉
UPDATE "area" SET "slug" = 'tono' WHERE "id" = '7f07470b-07f8-45f2-8021-2a95f19affde'; -- 岩手県 遠野
UPDATE "area" SET "slug" = 'miyagi' WHERE "id" = '8ba3bf50-ec7f-49f6-ad42-5fd12a450576'; -- 宮城県
UPDATE "area" SET "slug" = 'sendai' WHERE "id" = '64847a52-e5df-404b-9708-2056381c0206'; -- 宮城県 仙台市内
UPDATE "area" SET "slug" = 'matsushima' WHERE "id" = 'f207e88f-54a3-40a6-abe2-b69ae66f0df1'; -- 宮城県 松島
UPDATE "area" SET "slug" = 'zao' WHERE "id" = 'a7ede2ef-7434-419b-859d-f6ee495dc994'; -- 宮城県 蔵王
UPDATE "area" SET "slug" = 'akita' WHERE "id" = 'b1733bea-e2bb-4aeb-9d82-160696fd0635'; -- 秋田県
UPDATE "area" SET "slug" = 'akita-city' WHERE "id" = '7a9b7e9e-e0c1-4b76-a456-1f63cd6bc381'; -- 秋田県 秋田市内
UPDATE "area" SET "slug" = 'kakunodate' WHERE "id" = '831acd8e-e17c-414e-a1ca-db69d35b2ae3'; -- 秋田県 角館
UPDATE "area" SET "slug" = 'tazawako' WHERE "id" = 'e590ca16-d128-4972-aedc-67744296d504'; -- 秋田県 田沢湖
UPDATE "area" SET "slug" = 'yamagata' WHERE "id" = '35f33350-d1a2-4a2e-9222-27bec822a773'; -- 山形県
UPDATE "area" SET "slug" = 'yamagata-city' WHERE "id" = 'd741c40e-d1cb-46f8-9b5c-4b70f6e04900'; -- 山形県 山形市内
UPDATE "area" SET "slug" = 'zao-onsen' WHERE "id" = '38119874-1a0e-406c-a5e5-f9b99511237e'; -- 山形県 蔵王温泉
UPDATE "area" SET "slug" = 'ginzan-onsen' WHERE "id" = 'bee37c2b-85b8-453e-b09a-3da3fb8b4174'; -- 山形県 銀山温泉
UPDATE "area" SET "slug" = 'fukushima' WHERE "id" = 'a733ef31-8e41-41d7-b3a9-b954c90c48ed'; -- 福島県
UPDATE "area" SET "slug" = 'aizuwakamatsu' WHERE "id" = '6db77176-4fd3-4b4a-ace4-6f63efdaae4a'; -- 福島県 会津若松
UPDATE "area" SET "slug" = 'bandai-inawashiro' WHERE "id" = 'ffb22ec7-5519-463b-86e0-ba91931f40f4'; -- 福島県 磐梯・猪苗代
UPDATE "area" SET "slug" = 'iwaki' WHERE "id" = '0b457ef1-c275-42ad-9db7-c0c0c38feb30'; -- 福島県 いわき
UPDATE "area" SET "slug" = 'ibaraki' WHERE "id" = '61b55ce3-da80-4eeb-83e9-2d495f5bffed'; -- 茨城県
UPDATE "area" SET "slug" = 'mito' WHERE "id" = '734046f2-f1cf-4c77-8a8e-7cb7a4efe7d7'; -- 茨城県 水戸
UPDATE "area" SET "slug" = 'oarai' WHERE "id" = 'a64cd864-ea47-42b1-aca3-27164f9058ec'; -- 茨城県 大洗
UPDATE "area" SET "slug" = 'tsukuba' WHERE "id" = '886471f8-bf39-4e1d-a244-f07f494a089d'; -- 茨城県 つくば
UPDATE "area" SET "slug" = 'tochigi' WHERE "id" = '6fa9c09c-ce84-4a00-a420-2b7b5c852d16'; -- 栃木県
UPDATE "area" SET "slug" = 'ashikaga' WHERE "id" = '2f4901ad-7cbf-430e-8710-9384f27f57d0'; -- 栃木県 足利市
UPDATE "area" SET "slug" = 'nikko' WHERE "id" = 'b32f53f8-dff6-4cdf-b8c1-e42b44a7830e'; -- 栃木県 日光
UPDATE "area" SET "slug" = 'nasu' WHERE "id" = '1dcf362f-4fed-43fe-8fa6-6354c9bc3fd0'; -- 栃木県 那須
UPDATE "area" SET "slug" = 'gunma' WHERE "id" = '64194a5a-768f-4069-b74e-713f6b36504d'; -- 群馬県
UPDATE "area" SET "slug" = 'kusatsu-onsen' WHERE "id" = '7147a387-75fd-4697-9a39-f68ba2c84209'; -- 群馬県 草津温泉
UPDATE "area" SET "slug" = 'ikaho-onsen' WHERE "id" = '5b4e55ac-5c92-4717-9483-6516ad075f3e'; -- 群馬県 伊香保温泉
UPDATE "area" SET "slug" = 'takasaki' WHERE "id" = '7bfaf066-04fe-4024-ad6b-ce0c6c314bea'; -- 群馬県 高崎
UPDATE "area" SET "slug" = 'saitama' WHERE "id" = 'fda32e9f-4f70-4060-b25b-3c2853da605a'; -- 埼玉県
UPDATE "area" SET "slug" = 'kawagoe' WHERE "id" = 'f96a2c35-a3ec-493e-8b0d-6d4a07728ad9'; -- 埼玉県 川越
UPDATE "area" SET "slug" = 'chichibu' WHERE "id" = '8e19e59f-be9d-4bca-99ba-96ffc748fd81'; -- 埼玉県 秩父
UPDATE "area" SET "slug" = 'saitama-city' WHERE "id" = 'a82998e5-b468-47d9-b30b-501f7d697468'; -- 埼玉県 さいたま市内
UPDATE "area" SET "slug" = 'chiba' WHERE "id" = '7e522de4-4416-4cd8-96f5-f6127da2dbeb'; -- 千葉県
UPDATE "area" SET "slug" = 'makuhari-chiba-city' WHERE "id" = '320d8da2-8a99-4398-a6a3-304c6a1f57c9'; -- 千葉県 幕張・千葉市内
UPDATE "area" SET "slug" = 'narita' WHERE "id" = 'b5f3c223-3cc3-40d4-b43b-26588d56b67c'; -- 千葉県 成田
UPDATE "area" SET "slug" = 'boso' WHERE "id" = '57150da5-632b-4266-9ef3-3f46ac13f912'; -- 千葉県 房総
UPDATE "area" SET "slug" = 'tokyo' WHERE "id" = '07c1d2fc-83b2-48aa-9cfc-3bca703bd9ef'; -- 東京都
UPDATE "area" SET "slug" = 'asakusa-ueno' WHERE "id" = '8b87b993-6866-4a46-beaf-02695124635f'; -- 東京都 浅草・上野
UPDATE "area" SET "slug" = 'shibuya-harajuku' WHERE "id" = '44decacd-6bed-4dfe-83a5-56944758a5d3'; -- 東京都 渋谷・原宿
UPDATE "area" SET "slug" = 'odaiba' WHERE "id" = '25725572-d6f1-423f-b9c7-78553ae4af3a'; -- 東京都 お台場・臨海副都心
UPDATE "area" SET "slug" = 'kichijoji-mitaka' WHERE "id" = '03cd9295-1920-468c-85e3-0df11757680e'; -- 東京都 吉祥寺・三鷹
UPDATE "area" SET "slug" = 'kanagawa' WHERE "id" = 'baf5e878-23ad-482b-b217-bec7f4f2addd'; -- 神奈川県
UPDATE "area" SET "slug" = 'yokohama' WHERE "id" = '2d1c4a24-7533-4de9-bdb1-c139cc7ab41b'; -- 神奈川県 横浜
UPDATE "area" SET "slug" = 'kamakura' WHERE "id" = '09eefaea-2e38-439f-9b81-77906cabb7bc'; -- 神奈川県 鎌倉
UPDATE "area" SET "slug" = 'hakone' WHERE "id" = 'edff16bd-a1a0-4e71-8106-e727a37283f8'; -- 神奈川県 箱根
UPDATE "area" SET "slug" = 'niigata' WHERE "id" = '87cc80ed-aa49-446c-9fe2-2f4de346e44e'; -- 新潟県
UPDATE "area" SET "slug" = 'niigata-city' WHERE "id" = '89faa5d6-75fe-41d3-90fb-b09cb06bc453'; -- 新潟県 新潟市内
UPDATE "area" SET "slug" = 'sado' WHERE "id" = 'feec3fe1-8c5d-446a-8da9-820927ab6a41'; -- 新潟県 佐渡島
UPDATE "area" SET "slug" = 'echigo-yuzawa' WHERE "id" = 'd22c8481-162b-4397-b635-2ae9e86f01bb'; -- 新潟県 越後湯沢
UPDATE "area" SET "slug" = 'toyama' WHERE "id" = '6585a826-0d60-427c-b6b7-fe8f9770ff4e'; -- 富山県
UPDATE "area" SET "slug" = 'toyama-city' WHERE "id" = 'c6f53332-181c-45f6-8995-52ba895cfc70'; -- 富山県 富山市内
UPDATE "area" SET "slug" = 'tateyama-kurobe' WHERE "id" = 'cdf8842f-9a75-4217-9c75-d45a6c83a98f'; -- 富山県 立山黒部
UPDATE "area" SET "slug" = 'gokayama' WHERE "id" = '5725f448-a5d4-43a3-b051-d78d272914eb'; -- 富山県 五箇山
UPDATE "area" SET "slug" = 'ishikawa' WHERE "id" = 'a7160048-d0ec-42e4-9f65-e0243bbd39a5'; -- 石川県
UPDATE "area" SET "slug" = 'kanazawa' WHERE "id" = '0ad9b73c-44d6-455b-af88-60d28b533004'; -- 石川県 金沢
UPDATE "area" SET "slug" = 'noto' WHERE "id" = 'f35d04c2-7a01-49cd-a59f-1acbf481240d'; -- 石川県 能登
UPDATE "area" SET "slug" = 'kaga-onsen' WHERE "id" = '6a956e4c-043c-4f96-ad19-dcd8cbdc4fb6'; -- 石川県 加賀温泉郷
UPDATE "area" SET "slug" = 'fukui' WHERE "id" = '2de216d3-231e-4828-ba6d-864c8f1c06e4'; -- 福井県
UPDATE "area" SET "slug" = 'fukui-city' WHERE "id" = 'a05e867a-416a-49ec-87d2-4ebb182471d3'; -- 福井県 福井市内
UPDATE "area" SET "slug" = 'tojinbo' WHERE "id" = 'ad6dca23-98d7-4098-8788-6d58b737c4ad'; -- 福井県 東尋坊
UPDATE "area" SET "slug" = 'awara-onsen' WHERE "id" = '016b5552-8735-4fe1-9575-50a546503da1'; -- 福井県 あわら温泉
UPDATE "area" SET "slug" = 'yamanashi' WHERE "id" = '57b0bc9d-e06f-467f-abbb-9da92d37f956'; -- 山梨県
UPDATE "area" SET "slug" = 'fujigoko' WHERE "id" = '6e685d4d-38c0-4596-9898-636528ad7a25'; -- 山梨県 富士五湖
UPDATE "area" SET "slug" = 'kofu' WHERE "id" = '76da29de-93c0-4958-8baa-acfa5c912f94'; -- 山梨県 甲府
UPDATE "area" SET "slug" = 'shosenkyo' WHERE "id" = '9bcb34ce-c3b2-4e44-ad78-35c1664d6ab5'; -- 山梨県 昇仙峡
UPDATE "area" SET "slug" = 'nagano' WHERE "id" = 'ba002e86-e712-4289-b791-1cd5521f4d80'; -- 長野県
UPDATE "area" SET "slug" = 'matsumoto' WHERE "id" = '51be021b-8b64-4da6-bb9a-e3465905cb6e'; -- 長野県 松本
UPDATE "area" SET "slug" = 'karuizawa' WHERE "id" = 'f1d29f75-5a84-41c5-bdd5-e80557325ae3'; -- 長野県 軽井沢
UPDATE "area" SET "slug" = 'kamikochi' WHERE "id" = 'cca84fa8-3c96-4213-9ed6-86d06976656a'; -- 長野県 上高地
UPDATE "area" SET "slug" = 'kyoto' WHERE "id" = '30a8b9ca-07aa-4565-aa0e-64d7e07ca372'; -- 京都府
UPDATE "area" SET "slug" = 'kyoto-city' WHERE "id" = '5b461dee-a714-4707-ad5f-8ef7af003ef1'; -- 京都府 京都市内（清水・祇園・河原町）
UPDATE "area" SET "slug" = 'arashiyama-sagano' WHERE "id" = '9a21f1db-dcac-49c6-ac18-9b4ea57f3b91'; -- 京都府 嵐山・嵯峨野
UPDATE "area" SET "slug" = 'fushimi-uji' WHERE "id" = '24c3f286-3ab9-4554-996e-afaefb778017'; -- 京都府 伏見・宇治
UPDATE "area" SET "slug" = 'amanohashidate-tango' WHERE "id" = '9d4d8371-7b22-4216-9634-33b6f191d238'; -- 京都府 天橋立・丹後
UPDATE "area" SET "slug" = 'osaka' WHERE "id" = '60fa046c-6b5c-4596-93c8-af5c7e8a0a5f'; -- 大阪府
UPDATE "area" SET "slug" = 'umeda-osaka-station' WHERE "id" = '960beb9a-6dc0-400d-8618-e0815aca4d23'; -- 大阪府 梅田・大阪駅周辺
UPDATE "area" SET "slug" = 'namba-dotonbori' WHERE "id" = '9878a6ef-cbaa-4028-a933-04f0863d6ce1'; -- 大阪府 難波・道頓堀
UPDATE "area" SET "slug" = 'tennoji-abeno' WHERE "id" = 'cea54099-3466-468b-951e-23eb8b0ea09b'; -- 大阪府 天王寺・あべの
UPDATE "area" SET "slug" = 'sakai-sennan' WHERE "id" = 'a98a6bd3-2d4d-490a-936f-a09c9ca99021'; -- 大阪府 堺・泉南
UPDATE "area" SET "slug" = 'okinawa' WHERE "id" = '3fd7fb9f-beed-4bb6-b831-eb514c81c664'; -- 沖縄県
UPDATE "area" SET "slug" = 'naha' WHERE "id" = '1fffb36c-4bb0-4c89-97c9-eff05f361a56'; -- 沖縄県 那覇市内
UPDATE "area" SET "slug" = 'onna-chatan' WHERE "id" = '49e7d142-8408-46c9-83b6-9246cfbae332'; -- 沖縄県 恩納村・北谷
UPDATE "area" SET "slug" = 'ishigaki-miyako' WHERE "id" = '12508d80-a83d-46e8-8569-f7415ca84c03'; -- 沖縄県 石垣島・宮古島
UPDATE "area" SET "slug" = 'kerama-shoto' WHERE "id" = 'a5c7fb0c-dc7a-424d-b751-3152a83f955e'; -- 沖縄県 慶良間諸島
UPDATE "area" SET "slug" = 'gifu' WHERE "id" = '00e1ab00-eb97-4d73-9ff0-026b4eee2b35'; -- 岐阜県
UPDATE "area" SET "slug" = 'takayama' WHERE "id" = 'f5b0e240-7e2c-4b5f-8fa4-ddf57606859d'; -- 岐阜県 高山
UPDATE "area" SET "slug" = 'shirakawago' WHERE "id" = 'a42c4143-aa51-44cf-9bc0-a2e294b720f6'; -- 岐阜県 白川郷
UPDATE "area" SET "slug" = 'gero-onsen' WHERE "id" = '0d60573b-a2dc-4b8c-83fc-078b5f54a6a3'; -- 岐阜県 下呂温泉
UPDATE "area" SET "slug" = 'shizuoka' WHERE "id" = '463c8771-d4e9-454c-85a5-bad6958a536e'; -- 静岡県
UPDATE "area" SET "slug" = 'atami' WHERE "id" = '67d160b4-f2af-4470-8f16-fce1d2f75550'; -- 静岡県 熱海
UPDATE "area" SET "slug" = 'izu' WHERE "id" = 'f8aa2dd4-2596-44de-9712-da89ea2ab40f'; -- 静岡県 伊豆
UPDATE "area" SET "slug" = 'fujisan' WHERE "id" = '856b4bb6-b64a-4095-aeea-10ce65bd1782'; -- 静岡県 富士山周辺
UPDATE "area" SET "slug" = 'aichi' WHERE "id" = '65f3b43a-4d99-43b7-9e89-b7ff9df5b307'; -- 愛知県
UPDATE "area" SET "slug" = 'nagoya' WHERE "id" = '94d93ac4-ac2a-4b10-9609-c4dbaac1c3cf'; -- 愛知県 名古屋市内
UPDATE "area" SET "slug" = 'inuyama' WHERE "id" = '48a0d2ee-c17d-49c2-9bad-4170561e4f85'; -- 愛知県 犬山
UPDATE "area" SET "slug" = 'toyohashi' WHERE "id" = 'b67fee75-174b-44c5-8353-b54f38a5fd71'; -- 愛知県 豊橋
UPDATE "area" SET "slug" = 'mie' WHERE "id" = '5efb24c6-38a2-4371-894b-e0e1063c3c10'; -- 三重県
UPDATE "area" SET "slug" = 'ise-shima' WHERE "id" = 'bba2bd0b-57ad-4ea7-a2fe-03f2990cb1f2'; -- 三重県 伊勢志摩
UPDATE "area" SET "slug" = 'toba' WHERE "id" = '4d5e215d-c634-4691-b2ef-a0374965f716'; -- 三重県 鳥羽
UPDATE "area" SET "slug" = 'kumano' WHERE "id" = '574a9234-0c2e-4b1e-bca1-a502fcafa771'; -- 三重県 熊野
UPDATE "area" SET "slug" = 'shiga' WHERE "id" = '8a374d8c-fd1b-4e13-8b97-d597aa0a3be6'; -- 滋賀県
UPDATE "area" SET "slug" = 'otsu-biwako' WHERE "id" = 'be19c3ba-ae08-405f-9af8-8cbd6a9b9a5c'; -- 滋賀県 大津・琵琶湖
UPDATE "area" SET "slug" = 'hikone' WHERE "id" = '6e7f0b90-a3ff-451c-a092-ee3cf4898d8e'; -- 滋賀県 彦根
UPDATE "area" SET "slug" = 'nagahama' WHERE "id" = '9aa09102-7731-40a5-9117-c69f44955b4b'; -- 滋賀県 長浜
UPDATE "area" SET "slug" = 'hyogo' WHERE "id" = '3380c115-f75e-4b4d-af55-1490431dc5b6'; -- 兵庫県
UPDATE "area" SET "slug" = 'kobe' WHERE "id" = '91a18afc-2ebe-445a-ad7b-eebf105d8e85'; -- 兵庫県 神戸
UPDATE "area" SET "slug" = 'himeji' WHERE "id" = '441da005-11c9-4ffb-94f6-26a2f25e5567'; -- 兵庫県 姫路
UPDATE "area" SET "slug" = 'kinosaki-onsen' WHERE "id" = 'fe22924d-a019-4805-addb-8d007459b35d'; -- 兵庫県 城崎温泉
UPDATE "area" SET "slug" = 'nara' WHERE "id" = 'dcfe71f9-c52c-44fc-b29f-9e4ccaccca73'; -- 奈良県
UPDATE "area" SET "slug" = 'nara-city' WHERE "id" = '25e03ca8-4d89-48c4-b1a0-273b354c1299'; -- 奈良県 奈良市内
UPDATE "area" SET "slug" = 'yoshino' WHERE "id" = '429df8c5-77d4-4a2f-9a3a-3fc905f45455'; -- 奈良県 吉野
UPDATE "area" SET "slug" = 'asuka' WHERE "id" = '4f3f815e-c209-4123-8930-1153c4fca4d9'; -- 奈良県 飛鳥
UPDATE "area" SET "slug" = 'wakayama' WHERE "id" = '87c900f7-7dd5-4725-b504-117e06fee3e8'; -- 和歌山県
UPDATE "area" SET "slug" = 'koyasan' WHERE "id" = '550c48a9-23a8-4394-ab7b-25eff89d59e5'; -- 和歌山県 高野山
UPDATE "area" SET "slug" = 'shirahama' WHERE "id" = 'd2ea663b-71c3-4661-b73d-efb7b443961d'; -- 和歌山県 白浜
UPDATE "area" SET "slug" = 'kumano-kodo' WHERE "id" = 'ddb99957-8bc3-4ae9-a918-a7bbfaa844ff'; -- 和歌山県 熊野古道
UPDATE "area" SET "slug" = 'tottori' WHERE "id" = '1aa82dc2-d819-4122-b6d2-32442ad78c3e'; -- 鳥取県
UPDATE "area" SET "slug" = 'tottori-sakyu' WHERE "id" = '3e8fda01-7435-4e47-94f1-39bf0dad5fd3'; -- 鳥取県 鳥取砂丘
UPDATE "area" SET "slug" = 'yonago-sakaiminato' WHERE "id" = '24b9428e-6275-45a6-aa23-9104c8f87d52'; -- 鳥取県 米子・境港
UPDATE "area" SET "slug" = 'misasa-onsen' WHERE "id" = '4a7ed5a9-575a-43ce-aa5e-b08b4e5a41d5'; -- 鳥取県 三朝温泉
UPDATE "area" SET "slug" = 'shimane' WHERE "id" = '4182067e-c058-4ca6-ada2-0259964a9464'; -- 島根県
UPDATE "area" SET "slug" = 'izumo' WHERE "id" = '4250b769-41a8-44d1-89dd-b4c28cf1fe1e'; -- 島根県 出雲
UPDATE "area" SET "slug" = 'matsue' WHERE "id" = 'f33fd1ff-4544-46c2-bbba-9ff72ce2fe36'; -- 島根県 松江
UPDATE "area" SET "slug" = 'iwami-ginzan' WHERE "id" = 'e0786d7f-6f36-4746-a7cd-5b7fd06d8a44'; -- 島根県 石見銀山
UPDATE "area" SET "slug" = 'okayama' WHERE "id" = '2ff5af60-151d-4edd-9c87-a56d56e9290f'; -- 岡山県
UPDATE "area" SET "slug" = 'okayama-city' WHERE "id" = 'f9aa31ad-ddda-4bee-84e1-f3ba5fcb2703'; -- 岡山県 岡山市内
UPDATE "area" SET "slug" = 'kurashiki' WHERE "id" = '9fcb0e76-f4bd-4f7f-94dc-169c12a5afba'; -- 岡山県 倉敷
UPDATE "area" SET "slug" = 'korakuen' WHERE "id" = '0946644a-7f65-4b4a-88e3-323c68598d1e'; -- 岡山県 後楽園周辺
UPDATE "area" SET "slug" = 'hiroshima' WHERE "id" = 'da9a3b9c-c752-444b-be18-387f10317537'; -- 広島県
UPDATE "area" SET "slug" = 'hiroshima-city' WHERE "id" = 'a856f089-67b2-46ba-a343-0005a137285d'; -- 広島県 広島市内
UPDATE "area" SET "slug" = 'miyajima' WHERE "id" = '7ebca524-cee8-48fd-829f-15f8d866f838'; -- 広島県 宮島
UPDATE "area" SET "slug" = 'onomichi' WHERE "id" = '3ef8e6eb-f6a7-449c-9d62-0b3ff7c49926'; -- 広島県 尾道
UPDATE "area" SET "slug" = 'yamaguchi' WHERE "id" = '7189fa4f-e127-43c1-8552-196ba33cd169'; -- 山口県
UPDATE "area" SET "slug" = 'shimonoseki' WHERE "id" = '4f2226e8-22bc-4c60-bd8e-0d22c7c2cfc1'; -- 山口県 下関
UPDATE "area" SET "slug" = 'hagi' WHERE "id" = '5a4a5bd8-182a-4c52-8f89-f688285d7c58'; -- 山口県 萩
UPDATE "area" SET "slug" = 'yuda-onsen' WHERE "id" = 'a6a0af19-763c-4b72-86b5-ed097445be23'; -- 山口県 湯田温泉
UPDATE "area" SET "slug" = 'tokushima' WHERE "id" = '4f4d7a73-efa1-47e7-b2c7-4dec2e64f2f4'; -- 徳島県
UPDATE "area" SET "slug" = 'tokushima-city' WHERE "id" = 'ab48abd7-7103-4143-bd9a-0be112662d52'; -- 徳島県 徳島市内
UPDATE "area" SET "slug" = 'naruto' WHERE "id" = '1da74533-98c0-4afb-9802-41f1393e7ef4'; -- 徳島県 鳴門
UPDATE "area" SET "slug" = 'iya' WHERE "id" = 'c590c311-a4b8-4147-beec-6b6e7c1023f9'; -- 徳島県 祖谷
UPDATE "area" SET "slug" = 'kagawa' WHERE "id" = '49b59a9b-23d1-4f87-affa-cb39451e2ffe'; -- 香川県
UPDATE "area" SET "slug" = 'takamatsu' WHERE "id" = '133ae803-bb36-43bb-a34d-c7ba5d1ba3f9'; -- 香川県 高松
UPDATE "area" SET "slug" = 'shodoshima' WHERE "id" = '6acb78af-2814-40b8-999f-72da4a284eba'; -- 香川県 小豆島
UPDATE "area" SET "slug" = 'kotohira' WHERE "id" = '3e27d262-6715-46d2-9181-0696f57d1640'; -- 香川県 琴平
UPDATE "area" SET "slug" = 'ehime' WHERE "id" = '7ca34b93-73ab-4be8-9424-c8a5f82ae4a0'; -- 愛媛県
UPDATE "area" SET "slug" = 'matsuyama-dogo' WHERE "id" = 'aacd6eaa-a9d6-4707-977d-86760c864d26'; -- 愛媛県 松山・道後温泉
UPDATE "area" SET "slug" = 'shimanami-kaido' WHERE "id" = '1a713d40-e6c1-48f6-a285-26da229ab447'; -- 愛媛県 しまなみ海道
UPDATE "area" SET "slug" = 'uwajima' WHERE "id" = '3c40cb40-5d44-45cf-a65a-e9a396abc672'; -- 愛媛県 宇和島
UPDATE "area" SET "slug" = 'kochi' WHERE "id" = '5b756115-1bb5-4a16-94f2-95a1250ea8fb'; -- 高知県
UPDATE "area" SET "slug" = 'kochi-city' WHERE "id" = '51b0472f-cf90-42ee-9133-837a687b1103'; -- 高知県 高知市内
UPDATE "area" SET "slug" = 'shimanto' WHERE "id" = 'd2bedb9f-cf40-408d-8e30-953d745db92d'; -- 高知県 四万十
UPDATE "area" SET "slug" = 'ashizuri-misaki' WHERE "id" = 'd0beff3b-a75e-4f5e-86ba-5efcceb7f9e9'; -- 高知県 足摺岬
UPDATE "area" SET "slug" = 'fukuoka' WHERE "id" = 'd744ba03-26b2-4e7f-9b95-89b8ba2d3fac'; -- 福岡県
UPDATE "area" SET "slug" = 'fukuoka-city' WHERE "id" = '7b539a5c-07ea-40d5-bac7-a9aa600675e4'; -- 福岡県 福岡市内
UPDATE "area" SET "slug" = 'dazaifu' WHERE "id" = 'e838945d-e393-4cfc-becf-80d86e438818'; -- 福岡県 太宰府
UPDATE "area" SET "slug" = 'mojiko' WHERE "id" = '0d24fc86-569f-4d02-9abb-878fe191a0c3'; -- 福岡県 門司港
UPDATE "area" SET "slug" = 'saga' WHERE "id" = '89141319-e13a-4a22-a4a6-e0d4552a4192'; -- 佐賀県
UPDATE "area" SET "slug" = 'saga-city' WHERE "id" = 'a3922632-14b4-42c5-aa3c-035d2f42b7e3'; -- 佐賀県 佐賀市内
UPDATE "area" SET "slug" = 'arita-imari' WHERE "id" = '1312b1fd-d67e-45ad-84a8-584c523f94cf'; -- 佐賀県 有田・伊万里
UPDATE "area" SET "slug" = 'yobuko' WHERE "id" = '9684447e-69a1-414d-a5d2-d52a4a9ba035'; -- 佐賀県 呼子
UPDATE "area" SET "slug" = 'nagasaki' WHERE "id" = 'a87c7bfb-a74f-477e-903e-edbea7884dde'; -- 長崎県
UPDATE "area" SET "slug" = 'nagasaki-city' WHERE "id" = 'd7d6cff0-23e0-47ae-83be-695f41e75dda'; -- 長崎県 長崎市内
UPDATE "area" SET "slug" = 'huis-ten-bosch' WHERE "id" = 'e2c35ffb-7c64-4db9-88b3-95837815a278'; -- 長崎県 ハウステンボス
UPDATE "area" SET "slug" = 'goto-retto' WHERE "id" = '9845f93f-f172-4fc9-a4fe-9f0a5d63e73e'; -- 長崎県 五島列島
UPDATE "area" SET "slug" = 'kumamoto' WHERE "id" = '7655a473-1ad5-495d-8482-398e00cebab4'; -- 熊本県
UPDATE "area" SET "slug" = 'kumamoto-city' WHERE "id" = '8b898055-0f78-48b4-89ad-bb694ca7068c'; -- 熊本県 熊本市内
UPDATE "area" SET "slug" = 'aso' WHERE "id" = '18ec01b0-9346-4cc8-9aab-f9e23185d331'; -- 熊本県 阿蘇
UPDATE "area" SET "slug" = 'kurokawa-onsen' WHERE "id" = '739cd974-0ef8-4027-8e9d-23170b374254'; -- 熊本県 黒川温泉
UPDATE "area" SET "slug" = 'oita' WHERE "id" = 'fc96f678-b203-40d2-94fc-6b46bd5a3ec9'; -- 大分県
UPDATE "area" SET "slug" = 'beppu-onsen' WHERE "id" = 'f7060d88-f979-4d4c-96f5-671768bf04bb'; -- 大分県 別府温泉
UPDATE "area" SET "slug" = 'yufuin' WHERE "id" = 'f8f0a859-7c48-4b29-b48c-d91986c8fe82'; -- 大分県 由布院
UPDATE "area" SET "slug" = 'nakatsu' WHERE "id" = '2cc375e3-96a3-46b3-a2c0-2f0eca173c15'; -- 大分県 中津
UPDATE "area" SET "slug" = 'miyazaki' WHERE "id" = 'd7cd1821-a156-45c1-bdec-0f5a944fa8b4'; -- 宮崎県
UPDATE "area" SET "slug" = 'miyazaki-city' WHERE "id" = 'beb86aa5-e50e-4550-b52c-59e48f0d0de8'; -- 宮崎県 宮崎市内
UPDATE "area" SET "slug" = 'takachiho' WHERE "id" = '92b10248-68f6-41fe-90e3-543efa13bead'; -- 宮崎県 高千穂
UPDATE "area" SET "slug" = 'nichinan-kaigan' WHERE "id" = '93fcad13-7e37-4d7b-bb35-11a3610b5d86'; -- 宮崎県 日南海岸
UPDATE "area" SET "slug" = 'kagoshima' WHERE "id" = 'bb1c5824-7d5b-40df-877c-b64498c66486'; -- 鹿児島県
UPDATE "area" SET "slug" = 'kagoshima-city' WHERE "id" = '21ed10e6-8b50-442c-8de2-5c6295f12f93'; -- 鹿児島県 鹿児島市内
UPDATE "area" SET "slug" = 'ibusuki' WHERE "id" = '46814abf-e746-4e4a-b795-d3cd3474dc66'; -- 鹿児島県 指宿
UPDATE "area" SET "slug" = 'yakushima' WHERE "id" = 'ee1caf71-ae71-4dcb-bf85-05f4bad2a7b4'; -- 鹿児島県 屋久島
