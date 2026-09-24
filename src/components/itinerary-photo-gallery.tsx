"use client";

import { useState } from "react";

export type GalleryPhoto = {
  id: string;
  url: string;
  spotName: string;
  dayNumber: number;
};

export function ItineraryPhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">写真はありません。</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelected(photo)}
            className="text-left"
          >
            <div
              className="aspect-square rounded-lg bg-[#D6EEFB] bg-cover bg-center border border-border"
              style={{ backgroundImage: `url(${photo.url})` }}
            />
            <div className="text-xs text-muted-foreground mt-1 truncate">
              Day{photo.dayNumber} ・ {photo.spotName}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-3xl max-h-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* 権利・顔・ナンバーの確認のため、そのままの解像度で表示する */}
            <img src={selected.url} alt={selected.spotName} className="max-w-full max-h-[80vh] rounded-lg" />
            <div className="text-white text-sm font-bold">
              Day{selected.dayNumber} ・ {selected.spotName}
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="bg-white text-[#1E293B] rounded-full px-5 py-2 font-bold text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
