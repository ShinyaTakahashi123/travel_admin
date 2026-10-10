"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThemeImagePicker } from "@/components/theme-image-picker";
import { createTheme, updateTheme, setThemeStatus, reorderThemes } from "@/lib/actions";

type Theme = {
  id: string;
  name: string;
  slug: string;
  intro: string;
  imageUrl: string | null;
  seasons: string[];
  displayOrder: number;
  status: string;
  tagIds: string[];
  purposeTagIds: string[];
  publishedCount: number;
};

const SEASONS: { value: string; label: string }[] = [
  { value: "spring", label: "春" },
  { value: "summer", label: "夏" },
  { value: "autumn", label: "秋" },
  { value: "winter", label: "冬" },
];

function emptyForm() {
  return {
    name: "",
    slug: "",
    intro: "",
    seasons: [] as string[],
    tagIds: [] as string[],
    purposeTagIds: [] as string[],
    imageUrl: null as string | null,
  };
}

export function ThemeAdminPanel({
  themes,
  tags,
  purposeTags,
  existingImages,
  minThemeCount,
}: {
  themes: Theme[];
  tags: { id: string; name: string }[];
  purposeTags: { id: string; name: string }[];
  existingImages: { path: string; name: string }[];
  minThemeCount: number;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setForm(emptyForm());
    setError(null);
    setEditingId("new");
  }

  function openEdit(theme: Theme) {
    setForm({
      name: theme.name,
      slug: theme.slug,
      intro: theme.intro,
      seasons: theme.seasons,
      tagIds: theme.tagIds,
      purposeTagIds: theme.purposeTagIds,
      imageUrl: theme.imageUrl,
    });
    setError(null);
    setEditingId(theme.id);
  }

  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function handleSubmit(nextStatus?: "draft" | "published") {
    setError(null);
    startTransition(async () => {
      if (editingId === "new") {
        const result = await createTheme({ ...form, slugHint: form.slug });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        // 新規作成は下書きのまま。公開はもう一度編集を開いてから行う
        setEditingId(null);
        router.refresh();
        return;
      }
      const result = await updateTheme(editingId as string, form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (nextStatus) {
        const statusResult = await setThemeStatus(editingId as string, nextStatus);
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
    const target = index + direction;
    if (target < 0 || target >= themes.length) return;
    const orderedIds = themes.map((t) => t.id);
    [orderedIds[index], orderedIds[target]] = [orderedIds[target], orderedIds[index]];
    startTransition(async () => {
      const result = await reorderThemes(orderedIds);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  const editingTheme = typeof editingId === "string" && editingId !== "new" ? themes.find((t) => t.id === editingId) : null;
  const isPublished = editingTheme?.status === "published";

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">テーマの一覧</h2>
          <Button size="sm" onClick={openNew}>
            ＋ テーマを追加
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-xs text-muted-foreground text-left border-b border-border">
                <th className="py-1.5 px-2 w-10"></th>
                <th className="py-1.5 px-2">名前・URL</th>
                <th className="py-1.5 px-2">季節</th>
                <th className="py-1.5 px-2">公開しおり</th>
                <th className="py-1.5 px-2">状態</th>
                <th className="py-1.5 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {themes.map((theme, index) => (
                <tr key={theme.id} className="border-b border-border align-middle">
                  <td className="py-2 px-2 whitespace-nowrap">
                    <button
                      type="button"
                      disabled={index === 0 || isPending}
                      onClick={() => handleMove(index, -1)}
                      className="text-muted-foreground disabled:opacity-30 px-1"
                      aria-label="上へ"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === themes.length - 1 || isPending}
                      onClick={() => handleMove(index, 1)}
                      className="text-muted-foreground disabled:opacity-30 px-1"
                      aria-label="下へ"
                    >
                      ↓
                    </button>
                  </td>
                  <td className="py-2 px-2">
                    <div className="font-bold">{theme.name}</div>
                    <div className="text-xs text-muted-foreground">/theme/{theme.slug}</div>
                  </td>
                  <td className="py-2 px-2 text-xs">
                    {theme.seasons.length > 0
                      ? theme.seasons.map((s) => SEASONS.find((x) => x.value === s)?.label).join("・")
                      : "―"}
                  </td>
                  <td className="py-2 px-2 tabular-nums">
                    {theme.publishedCount}本
                    {theme.publishedCount < minThemeCount && (
                      <div className="text-xs text-muted-foreground">({minThemeCount}本未満はページを出さない)</div>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <Badge variant={theme.status === "published" ? "default" : "secondary"}>
                      {theme.status === "published" ? "公開" : "下書き"}
                    </Badge>
                  </td>
                  <td className="py-2 px-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(theme)}>
                      編集
                    </Button>
                  </td>
                </tr>
              ))}
              {themes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground text-sm">
                    テーマがまだありません
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
            {editingId === "new" ? "テーマの追加" : `テーマの編集(${editingTheme?.name ?? ""})`}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                  名前
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                  URL(名前から自動で作ります)
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
              </div>
              <label className="flex flex-col gap-1 text-xs font-bold text-muted-foreground">
                紹介文(公開の前に法務が確かめます)
                <Textarea rows={4} value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} />
              </label>
              <div>
                <div className="text-xs font-bold text-muted-foreground mb-1">対象の旅のテーマ</div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setForm({ ...form, tagIds: toggle(form.tagIds, tag.id) })}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        form.tagIds.includes(tag.id)
                          ? "bg-secondary border-primary text-secondary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground mb-1">対象の目的</div>
                <div className="flex flex-wrap gap-1.5">
                  {purposeTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setForm({ ...form, purposeTagIds: toggle(form.purposeTagIds, tag.id) })}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        form.purposeTagIds.includes(tag.id)
                          ? "bg-secondary border-primary text-secondary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground mb-1">この季節はトップで先頭に出す(任意)</div>
                <div className="flex flex-wrap gap-1.5">
                  {SEASONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setForm({ ...form, seasons: toggle(form.seasons, s.value) })}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        form.seasons.includes(s.value)
                          ? "bg-secondary border-primary text-secondary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground mb-1">絵</div>
                <ThemeImagePicker
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  existingImages={existingImages.map((img) => ({ slug: img.path, name: img.name, path: img.path }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {editingTheme && (
                <div className="text-sm text-muted-foreground">
                  条件に合う公開しおり <b className="text-foreground">{editingTheme.publishedCount}</b> 本
                  ({minThemeCount}本になるとページが出ます)
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                状態を「下書き」にしておくと、ユーザーサイトには出ません。法務の確認のあと「公開」にします。
              </p>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <div className="flex gap-2 justify-end mt-auto flex-wrap">
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
          </div>
        </div>
      )}
    </div>
  );
}
