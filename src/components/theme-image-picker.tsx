"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { resizeThemeImageForUpload } from "@/lib/resize-theme-image";

export function ThemeImagePicker({
  value,
  onChange,
  existingImages,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  existingImages: { slug: string; name: string; path: string }[];
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const resized = await resizeThemeImageForUpload(file);
      const blob = await upload(`theme-covers/${Date.now()}-${resized.name}`, resized, {
        access: "public",
        handleUploadUrl: "/api/upload-theme-image",
        contentType: resized.type,
      });
      onChange(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  }

  function handleSelectExisting(e: React.ChangeEvent<HTMLSelectElement>) {
    const path = e.target.value;
    onChange(path || null);
  }

  const selectedExistingPath = value && !value.startsWith("https://") ? value : "";

  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
      <div className="w-[120px] aspect-[4/3] rounded-lg border border-border bg-muted overflow-hidden">
        {value && (
          <img src={value} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <select
          aria-label="用意されている絵から選ぶ"
          value={selectedExistingPath}
          onChange={handleSelectExisting}
          className="border border-input rounded-md px-2 py-1.5 text-sm bg-white"
        >
          <option value="">用意されている絵から選ぶ</option>
          {existingImages.map((img) => (
            <option key={img.path} value={img.path}>
              {img.name}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-1.5 border border-input rounded-md px-3 py-1.5 text-sm font-bold cursor-pointer w-fit hover:bg-muted transition-colors">
          {isUploading ? "アップロード中..." : "画像をアップロード"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        <span className="text-xs text-muted-foreground">PNG・JPEG・WebP、400KBまで。4:3で表示します</span>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}
