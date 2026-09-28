"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPlaceMaster, updatePlaceMaster, deletePlaceMaster, type PlaceMasterInput } from "@/lib/actions";
import { PLACE_MASTER_CATEGORY_LABELS } from "@/lib/place-master-categories";
import type { PlaceMasterFormValue } from "@/lib/place-master-form-value";

export function PlaceMasterForm({
  initial,
  prefectures,
}: {
  initial: PlaceMasterFormValue;
  prefectures: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [aliasInput, setAliasInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toInput(): PlaceMasterInput {
    return {
      name: form.name,
      reading: form.reading,
      address: form.address,
      lat: form.lat,
      lng: form.lng,
      prefectureAreaId: form.prefectureAreaId,
      category: form.category,
      isWideArea: form.isWideArea,
      isMemorial: form.isMemorial,
      stayDurationMin: form.stayDurationMin,
      websiteUrl: form.websiteUrl,
      photoUrl: form.photoUrl,
      photoAuthor: form.photoAuthor,
      photoLicense: form.photoLicense,
      photoLicenseUrl: form.photoLicenseUrl,
      photoSourceUrl: form.photoSourceUrl,
      positionSource: form.positionSource,
      aliases: form.aliases,
    };
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = form.id ? await updatePlaceMaster(form.id, toInput()) : await createPlaceMaster(toInput());
      if (result.ok) {
        router.push("/place-master");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete() {
    if (!form.id) return;
    if (!confirm("この台帳を削除しますか？つながっているスポットの参照は外れます(スポット自体は消えません)。")) return;
    startTransition(async () => {
      const result = await deletePlaceMaster(form.id!);
      if (result.ok) {
        router.push("/place-master");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function addAlias() {
    const trimmed = aliasInput.trim();
    if (!trimmed || form.aliases.includes(trimmed)) return;
    setForm((f) => ({ ...f, aliases: [...f.aliases, trimmed] }));
    setAliasInput("");
  }

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <div>
        <label className="text-sm font-bold text-muted-foreground block mb-1">名前 *</label>
        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </div>
      <div>
        <label className="text-sm font-bold text-muted-foreground block mb-1">読み(任意)</label>
        <Input value={form.reading} onChange={(e) => setForm((f) => ({ ...f, reading: e.target.value }))} />
      </div>
      <div>
        <label className="text-sm font-bold text-muted-foreground block mb-1">別名(任意)</label>
        <div className="flex gap-1.5 flex-wrap mb-1.5">
          {form.aliases.map((alias) => (
            <span key={alias} className="text-sm bg-muted rounded-full px-2.5 py-1 flex items-center gap-1.5">
              {alias}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, aliases: f.aliases.filter((a) => a !== alias) }))}
                className="text-muted-foreground"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Input
            value={aliasInput}
            onChange={(e) => setAliasInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAlias();
              }
            }}
            placeholder="例: 鹿苑寺"
          />
          <Button type="button" variant="outline" onClick={addAlias}>
            追加
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">住所</label>
          <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">都道府県</label>
          <select
            value={form.prefectureAreaId}
            onChange={(e) => setForm((f) => ({ ...f, prefectureAreaId: e.target.value }))}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-base"
          >
            <option value="">未設定</option>
            {prefectures.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">緯度</label>
          <Input value={form.lat} onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">経度</label>
          <Input value={form.lng} onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">位置の出どころ</label>
          <Input
            value={form.positionSource}
            onChange={(e) => setForm((f) => ({ ...f, positionSource: e.target.value }))}
            placeholder="nominatim / gsi / manual"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">種類</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-base"
          >
            <option value="">未設定</option>
            {Object.entries(PLACE_MASTER_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">滞在時間の目安(分)</label>
          <Input
            type="number"
            value={form.stayDurationMin}
            onChange={(e) => setForm((f) => ({ ...f, stayDurationMin: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground block mb-1">公式サイトURL</label>
          <Input value={form.websiteUrl} onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={form.isWideArea}
            onChange={(e) => setForm((f) => ({ ...f, isWideArea: e.target.checked }))}
          />
          広い場所(判定半径3km)
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={form.isMemorial}
            onChange={(e) => setForm((f) => ({ ...f, isMemorial: e.target.checked }))}
          />
          慰霊の場所
        </label>
      </div>

      <div className="border-t border-border pt-4">
        <div className="text-sm font-bold mb-2">写真(任意。出典がそろっている場合だけ入れる)</div>
        <p className="text-xs text-muted-foreground mb-2">
          ライセンスはパブリックドメイン・CC0・CC BY・CC BY-SAのいずれか(NC・NDは使えません)。人の顔がはっきり写った写真は入れないでください。出典はしおりに自動で表示され、プランナーは消せません。
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-bold text-muted-foreground block mb-1">画像URL(自分の保存場所のみ)</label>
            <Input value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-1">撮影者</label>
            <Input value={form.photoAuthor} onChange={(e) => setForm((f) => ({ ...f, photoAuthor: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-1">ライセンス</label>
            <Input
              value={form.photoLicense}
              onChange={(e) => setForm((f) => ({ ...f, photoLicense: e.target.value }))}
              placeholder="例: CC BY-SA 4.0"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-1">ライセンスURL</label>
            <Input
              value={form.photoLicenseUrl}
              onChange={(e) => setForm((f) => ({ ...f, photoLicenseUrl: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-1">出典URL</label>
            <Input
              value={form.photoSourceUrl}
              onChange={(e) => setForm((f) => ({ ...f, photoSourceUrl: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 font-bold">{error}</p>}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "保存中…" : "保存する"}
        </Button>
        {form.id && (
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
            削除する
          </Button>
        )}
      </div>
    </div>
  );
}
