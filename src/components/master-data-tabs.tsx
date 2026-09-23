"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPrefecture, createArea, createTag } from "@/lib/actions";

type Prefecture = {
  id: string;
  name: string;
  children: { id: string; name: string; itineraryCount: number }[];
};
type Tag = { id: string; name: string };

export function MasterDataTabs({ prefectures, tags }: { prefectures: Prefecture[]; tags: Tag[] }) {
  const [tab, setTab] = useState<"area" | "tag">("area");

  return (
    <div>
      <div className="flex gap-1 border-b border-border mb-5">
        {(["area", "tag"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-[13px] font-bold border-b-2 ${
              tab === t ? "text-secondary-foreground border-primary" : "text-muted-foreground border-transparent"
            }`}
          >
            {t === "area" ? "エリア" : "タグ"}
          </button>
        ))}
      </div>

      {tab === "area" ? <AreaMaster prefectures={prefectures} /> : <TagMaster tags={tags} />}
    </div>
  );
}

function AreaMaster({ prefectures }: { prefectures: Prefecture[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(prefectures[0]?.id ?? null);
  const [newPrefName, setNewPrefName] = useState("");
  const [newAreaName, setNewAreaName] = useState("");
  const [targetPrefId, setTargetPrefId] = useState(prefectures[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAddPrefecture(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createPrefecture(newPrefName);
        setNewPrefName("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "追加に失敗しました");
      }
    });
  }

  function handleAddArea(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!targetPrefId) {
      setError("都道府県を選択してください");
      return;
    }
    startTransition(async () => {
      try {
        await createArea(targetPrefId, newAreaName);
        setNewAreaName("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "追加に失敗しました");
      }
    });
  }

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="flex-[1.3] bg-card border border-border rounded-2xl p-5">
        <div className="font-black text-sm mb-3.5">都道府県 &gt; エリア</div>
        {prefectures.map((pref) => (
          <div key={pref.id}>
            <button
              onClick={() => setExpanded(expanded === pref.id ? null : pref.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg mb-0.5 ${
                expanded === pref.id ? "bg-secondary" : ""
              }`}
            >
              <span className="flex items-center gap-2 font-bold text-[13px]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={expanded === pref.id ? "#4F46E5" : "#94A3B8"}
                  strokeWidth="2.2"
                >
                  {expanded === pref.id ? <path d="M18 15l-6-6-6 6" /> : <path d="M9 6l6 6-6 6" />}
                </svg>
                {pref.name}
              </span>
            </button>
            {expanded === pref.id && (
              <div className="pl-6.5 border-l-2 border-secondary ml-3.5 mb-2">
                {pref.children.map((area) => (
                  <div key={area.id} className="flex items-center justify-between px-3.5 py-1.5">
                    <span className="text-xs">{area.name}</span>
                    <span className="text-[11px] text-muted-foreground">{area.itineraryCount}件</span>
                  </div>
                ))}
                {pref.children.length === 0 && (
                  <div className="px-3.5 py-1.5 text-xs text-muted-foreground">エリア未登録</div>
                )}
              </div>
            )}
          </div>
        ))}

        <form onSubmit={handleAddPrefecture} className="flex gap-2 mt-4">
          <input
            value={newPrefName}
            onChange={(e) => setNewPrefName(e.target.value)}
            placeholder="新しい都道府県名"
            className="flex-1 border border-input rounded-lg px-3 py-2 text-xs"
          />
          <button
            type="submit"
            disabled={isPending || !newPrefName.trim()}
            className="bg-primary text-white rounded-lg px-3.5 py-2 font-bold text-xs disabled:opacity-50"
          >
            都道府県を追加
          </button>
        </form>
      </div>

      <div className="flex-1 bg-card border border-border rounded-2xl p-5">
        <div className="font-black text-sm mb-3">エリア新規追加</div>
        <form onSubmit={handleAddArea} className="flex flex-col gap-3.5">
          <div>
            <div className="text-[11px] font-bold text-muted-foreground mb-1.5">都道府県</div>
            <select
              value={targetPrefId}
              onChange={(e) => setTargetPrefId(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white"
            >
              {prefectures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted-foreground mb-1.5">エリア名</div>
            <input
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              placeholder="例: 銀閣寺・岡崎エリア"
              className="w-full border border-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
          {error && <div className="text-xs text-red-600 font-bold">{error}</div>}
          <button
            type="submit"
            disabled={isPending || !newAreaName.trim()}
            className="bg-primary text-white rounded-lg py-2.5 font-bold text-sm disabled:opacity-50"
          >
            追加する
          </button>
        </form>
      </div>
    </div>
  );
}

function TagMaster({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createTag(newTagName);
        setNewTagName("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "追加に失敗しました");
      }
    });
  }

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="flex-[1.3] bg-card border border-border rounded-2xl p-5">
        <div className="font-black text-sm mb-3.5">タグ一覧</div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag.id} className="bg-muted text-[#475569] text-xs font-bold px-3 py-1.5 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-card border border-border rounded-2xl p-5">
        <div className="font-black text-sm mb-3">タグ新規追加</div>
        <form onSubmit={handleAddTag} className="flex flex-col gap-3.5">
          <input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="例: 秘境"
            className="w-full border border-input rounded-lg px-3 py-2 text-sm"
          />
          {error && <div className="text-xs text-red-600 font-bold">{error}</div>}
          <button
            type="submit"
            disabled={isPending || !newTagName.trim()}
            className="bg-primary text-white rounded-lg py-2.5 font-bold text-sm disabled:opacity-50"
          >
            追加する
          </button>
        </form>
      </div>
    </div>
  );
}
