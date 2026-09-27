"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  createFeature,
  updateFeature,
  setFeatureStatus,
  searchItinerariesForFeature,
  addFeatureItem,
  removeFeatureItem,
  updateFeatureItemCaption,
  reorderFeatureItems,
  type FeatureItinerarySearchResult,
} from "@/lib/actions";

type FeatureItem = {
  id: string;
  itineraryId: string;
  caption: string | null;
  displayOrder: number;
  title: string;
  areaName: string | null;
  nights: number;
  isPublished: boolean;
};

type Feature = {
  id: string;
  title: string;
  slug: string;
  description: string;
  lead: string;
  closing: string | null;
  status: string;
  displayFromMonth: number | null;
  displayToMonth: number | null;
  items: FeatureItem[];
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function emptyForm() {
  return {
    title: "",
    slug: "",
    description: "",
    lead: "",
    closing: "",
    displayFromMonth: null as number | null,
    displayToMonth: null as number | null,
  };
}

export function FeatureAdminPanel({ features }: { features: Feature[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FeatureItinerarySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNew() {
    setForm(emptyForm());
    setError(null);
    setEditingId("new");
    setQuery("");
    setSearchResults([]);
  }

  function openEdit(feature: Feature) {
    setForm({
      title: feature.title,
      slug: feature.slug,
      description: feature.description,
      lead: feature.lead,
      closing: feature.closing ?? "",
      displayFromMonth: feature.displayFromMonth,
      displayToMonth: feature.displayToMonth,
    });
    setError(null);
    setEditingId(feature.id);
    setQuery("");
    setSearchResults([]);
  }

  function handleSubmit(nextStatus?: "draft" | "published") {
    setError(null);
    startTransition(async () => {
      if (editingId === "new") {
        const result = await createFeature(form);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setEditingId(null);
        router.refresh();
        return;
      }
      const result = await updateFeature(editingId as string, form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (nextStatus) {
        const statusResult = await setFeatureStatus(editingId as string, nextStatus);
        if (!statusResult.ok) {
          setError(statusResult.error);
          return;
        }
      }
      setEditingId(null);
      router.refresh();
    });
  }

  function handleMove(index: number, direction: -1 | 1) {
    if (!editingFeature) return;
    const target = index + direction;
    if (target < 0 || target >= editingFeature.items.length) return;
    const orderedItemIds = editingFeature.items.map((i) => i.id);
    [orderedItemIds[index], orderedItemIds[target]] = [orderedItemIds[target], orderedItemIds[index]];
    startTransition(async () => {
      const result = await reorderFeatureItems(orderedItemIds);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 2 || editingId === "new" || editingId === null) {
      setSearchResults([]);
      return;
    }
    searchTimer.current = setTimeout(() => {
      setIsSearching(true);
      startTransition(async () => {
        const result = await searchItinerariesForFeature(editingId as string, value);
        setIsSearching(false);
        if (result.ok) setSearchResults(result.data);
      });
    }, 300);
  }

  function handleAdd(itineraryId: string) {
    if (editingId === "new" || editingId === null) return;
    startTransition(async () => {
      const result = await addFeatureItem(editingId as string, itineraryId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSearchResults((prev) => prev.map((r) => (r.id === itineraryId ? { ...r, alreadyAdded: true } : r)));
      router.refresh();
    });
  }

  function handleRemove(itemId: string) {
    startTransition(async () => {
      const result = await removeFeatureItem(itemId);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  function handleCaptionChange(itemId: string, caption: string) {
    startTransition(async () => {
      const result = await updateFeatureItemCaption(itemId, caption);
      if (result.ok) router.refresh();
    });
  }

  const editingFeature = typeof editingId === "string" && editingId !== "new" ? features.find((f) => f.id === editingId) : null;
  const isPublished = editingFeature?.status === "published";
  const publishedItemCount = editingFeature?.items.filter((i) => i.isPublished).length ?? 0;
  const unpublishedItemCount = (editingFeature?.items.length ?? 0) - publishedItemCount;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">特集の一覧</h2>
          <Button size="sm" onClick={openNew}>
            ＋ 特集を追加
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-xs text-muted-foreground text-left border-b border-border">
                <th className="py-1.5 px-2">タイトル・URL</th>
                <th className="py-1.5 px-2">選んだしおり</th>
                <th className="py-1.5 px-2">出す時期</th>
                <th className="py-1.5 px-2">状態</th>
                <th className="py-1.5 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.id} className="border-b border-border align-middle">
                  <td className="py-2 px-2">
                    <div className="font-bold">{f.title}</div>
                    <div className="text-xs text-muted-foreground">/feature/{f.slug}</div>
                  </td>
                  <td className="py-2 px-2 tabular-nums">{f.items.length}本</td>
                  <td className="py-2 px-2 text-xs">
                    {f.displayFromMonth && f.displayToMonth ? `${f.displayFromMonth}〜${f.displayToMonth}月` : "―"}
                  </td>
                  <td className="py-2 px-2">
                    <Badge variant={f.status === "published" ? "default" : "secondary"}>
                      {f.status === "published" ? "公開" : "下書き"}
                    </Badge>
                  </td>
                  <td className="py-2 px-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(f)}>
                      編集
                    </Button>
                  </td>
                </tr>
              ))}
              {features.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground text-sm">
                    特集がまだありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="font-bold text-base mb-3">
            {editingId === "new" ? "特集の追加" : `特集の編集(${editingFeature?.title ?? ""})`}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                タイトル
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                  URL用の名前(名前から自動で作ります)
                  <Input
                    value={form.slug}
                    disabled={isPublished}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder={editingId === "new" ? "空なら自動生成" : undefined}
                  />
                  <span className="font-normal">
                    {isPublished ? "公開したあとは変えられません" : "直してもかまいません"}
                  </span>
                </label>
                <div className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                  出す時期(任意)
                  <div className="flex items-center gap-1.5">
                    <select
                      className="border border-input rounded-md px-2 py-1.5 text-sm bg-white"
                      value={form.displayFromMonth ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, displayFromMonth: e.target.value ? Number(e.target.value) : null })
                      }
                    >
                      <option value="">指定なし</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}月
                        </option>
                      ))}
                    </select>
                    〜
                    <select
                      className="border border-input rounded-md px-2 py-1.5 text-sm bg-white"
                      value={form.displayToMonth ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, displayToMonth: e.target.value ? Number(e.target.value) : null })
                      }
                    >
                      <option value="">指定なし</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}月
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="font-normal">この時期だけ、トップと特集の一覧に出します。URLではいつでも見られます</span>
                </div>
              </div>
              <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                説明(検索結果に出る文)
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                はじめの文
                <Textarea rows={3} value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                おわりの文(任意)
                <Textarea rows={2} value={form.closing} onChange={(e) => setForm({ ...form, closing: e.target.value })} />
              </label>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <div className="flex gap-2 justify-end flex-wrap">
                <Button variant="ghost" onClick={() => setEditingId(null)} disabled={isPending}>
                  キャンセル
                </Button>
                <Button variant="outline" onClick={() => handleSubmit()} disabled={isPending}>
                  下書きで保存
                </Button>
                {editingId !== "new" && (
                  <Button
                    variant={isPublished ? "secondary" : "default"}
                    disabled={isPending}
                    onClick={() => handleSubmit(isPublished ? "draft" : "published")}
                  >
                    {isPublished ? "下書きに戻す" : "公開する"}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {editingFeature ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    選んだしおり <b className="text-foreground">{editingFeature.items.length}</b> 本
                    {unpublishedItemCount > 0 && `(うち${unpublishedItemCount}本は非公開のため出ていません)`}
                  </div>
                  <div className="flex flex-col gap-1 relative">
                    <label className="text-xs font-bold text-muted-foreground" htmlFor="feature-item-search">
                      しおりを追加
                    </label>
                    <Input
                      id="feature-item-search"
                      value={query}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      placeholder="しおりの名前や地名で探す(例: 嵐山 紅葉)"
                    />
                    {query.trim().length >= 2 && (
                      <div className="border border-border rounded-lg bg-white shadow-sm max-h-72 overflow-y-auto">
                        {isSearching && <div className="text-xs text-muted-foreground px-3 py-2">検索中...</div>}
                        {!isSearching && searchResults.length === 0 && (
                          <div className="text-xs text-muted-foreground px-3 py-2">見つかりませんでした</div>
                        )}
                        <ul>
                          {searchResults.map((r) => (
                            <li
                              key={r.id}
                              className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border first:border-t-0"
                            >
                              <div className="min-w-0">
                                <div className="text-sm font-bold truncate">{r.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {r.areaName ?? "―"}・{r.nights === 0 ? "日帰り" : `${r.nights}泊${r.nights + 1}日`}
                                </div>
                              </div>
                              {r.alreadyAdded ? (
                                <span className="text-xs text-muted-foreground shrink-0">追加済み</span>
                              ) : (
                                <Button size="xs" onClick={() => handleAdd(r.id)} disabled={isPending} className="shrink-0">
                                  ＋ 追加
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {editingFeature.items.map((item, index) => (
                      <li key={item.id} className="border border-border rounded-lg p-2.5 flex gap-2 items-start">
                        <div className="flex flex-col shrink-0 pt-0.5">
                          <button
                            type="button"
                            disabled={index === 0 || isPending}
                            onClick={() => handleMove(index, -1)}
                            className="text-muted-foreground disabled:opacity-30 text-xs leading-none"
                            aria-label="上へ"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={index === editingFeature.items.length - 1 || isPending}
                            onClick={() => handleMove(index, 1)}
                            className="text-muted-foreground disabled:opacity-30 text-xs leading-none"
                            aria-label="下へ"
                          >
                            ↓
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold ${item.isPublished ? "" : "text-muted-foreground line-through"}`}>
                            {index + 1}. {item.title}
                            {!item.isPublished && <span className="ml-1.5 text-xs">(非公開になっています)</span>}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {item.areaName ?? "―"}・{item.nights === 0 ? "日帰り" : `${item.nights}泊${item.nights + 1}日`}
                          </div>
                          <input
                            defaultValue={item.caption ?? ""}
                            onBlur={(e) => handleCaptionChange(item.id, e.target.value)}
                            placeholder="紹介の一言(空ならしおりの説明文の最初を使います)"
                            aria-label="紹介の一言"
                            className="w-full text-xs border border-dashed border-border rounded px-2 py-1 bg-transparent"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={isPending}
                          className="text-xs border border-border rounded px-2 py-1 shrink-0"
                        >
                          外す
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  しおりの追加は、一度「下書きで保存」してから編集を開き直すとできます。
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
