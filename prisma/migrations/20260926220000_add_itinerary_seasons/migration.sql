-- おすすめの季節(spring|summer|autumn|winter、重複なし)。未設定(空配列)はすべての季節に出す
ALTER TABLE "itinerary" ADD COLUMN     "seasons" TEXT[] DEFAULT ARRAY[]::TEXT[];
