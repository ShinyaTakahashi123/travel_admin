// テーマの絵は400KB以下という制約があるため、長辺1200pxまでに縮小し、JPEG品質を
// 段階的に下げながら収まる大きさを探す。canvasへの描き直しはEXIF等のメタデータも取り除く

const MAX_LONG_EDGE = 1200;
const MAX_BYTES = 400 * 1024;
const QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.45];

export async function resizeThemeImageForUpload(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("この画像は読み込めませんでした。別の画像をお試しください");
  }

  const scale = Math.min(1, MAX_LONG_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("この画像は読み込めませんでした。別の画像をお試しください");
  }
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  for (const quality of QUALITIES) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= MAX_BYTES) {
      const baseName = file.name.replace(/\.[^.]+$/, "") || "theme";
      return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
    }
  }
  throw new Error("画像を400KB以下に縮小できませんでした。別の画像をお試しください");
}
