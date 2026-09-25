-- 旅のじゅんび(持ち物)。選択肢(プログラム内に用意)のIDと、プランナーが追加した言葉(順番つき)
ALTER TABLE "itinerary" ADD COLUMN     "packing_custom_items" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "packing_item_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
