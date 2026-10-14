"use client";

// 日次推移グラフ(TrendCard)。さわった・乗せた日の数と前日比を読み取れるようにした部品。
// docs/specs/20261014-admin-chart-readout.md 参照。新しいグラフのライブラリは使わず、
// 既存のSVG(折れ線)の作りのまま、操作(ホバー・タッチ・キーボード)だけを追加する。
//
// 点(丸)は preserveAspectRatio="none" で横に伸び縮みするSVG座標系の中では真円を保てない
// (カードの横幅がviewBoxの280pxと一致しないため)。そのためSVGの<circle>ではなく、
// 左右だけ%指定・上下はpx指定のHTML要素として重ねている(SVGの高さ=viewBoxの高さなので
// 縦方向は1:1になる)。
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const UP_COLOR = "#15803D";
const DOWN_COLOR = "#B91C1C";
const ACCENT = "#6366F1";

const W = 280;
const H = 90;

function formatDiff(diff: number): { text: string; color?: string } {
  if (diff === 0) return { text: "前日と同じ" };
  const sign = diff > 0 ? "+" : "−";
  return {
    text: `前日比 ${sign}${Math.abs(diff).toLocaleString()}`,
    color: diff > 0 ? UP_COLOR : DOWN_COLOR,
  };
}

export function TrendCard({
  label,
  value,
  points,
  dates,
  dateLabels,
  footnote,
}: {
  label: string;
  value: string;
  points: number[];
  dates: string[];
  dateLabels: string[];
  footnote?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const last = points.length - 1;
  const interactive = points.length > 1;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = points.length > 1 ? W / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = H - ((p - min) / range) * (H - 15) - 5;
    return [x, y] as const;
  });
  const polyline = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const polygon = `0,${H} ${polyline} ${W},${H}`;
  // 最多・最少の吹き出し位置は、Y軸の目盛り用に0/1で底上げしたmax/minではなく、
  // 実際のデータの中での最大・最小を使う(底上げした値はどの日とも一致せず、
  // indexOf()が-1を返してグラフが壊れるため)
  const actualMax = Math.max(...points);
  const actualMin = Math.min(...points);
  const iMax = points.indexOf(actualMax);
  const iMin = points.indexOf(actualMin);
  const showExtremes = interactive && actualMax !== actualMin;

  const displayIndex = activeIndex ?? last;
  const diff = displayIndex > 0 ? points[displayIndex] - points[displayIndex - 1] : null;
  const diffInfo = diff == null ? null : formatDiff(diff);
  const readoutPrefix = activeIndex == null ? "最新 " : "";

  function indexFromClientX(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || last <= 0) return 0;
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(last, Math.max(0, Math.round(ratio * last)));
  }

  function selectAt(clientX: number) {
    setActiveIndex(indexFromClientX(clientX));
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!interactive) return;
    selectAt(e.clientX);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!interactive) return;
    selectAt(e.clientX);
  }

  function handlePointerLeave(e: PointerEvent<HTMLDivElement>) {
    if (!interactive) return;
    if (e.pointerType === "mouse") setActiveIndex(null);
  }

  function handleFocus() {
    if (!interactive) return;
    setActiveIndex((prev) => prev ?? last);
  }

  function handleBlur() {
    setActiveIndex(null);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const base = activeIndex ?? last;
      const next = base + (e.key === "ArrowRight" ? 1 : -1);
      setActiveIndex(Math.min(last, Math.max(0, next)));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(last);
    } else if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  }

  const tipXPct = interactive ? Math.min(Math.max((coords[displayIndex][0] / W) * 100, 14), 86) : 0;
  const tipTopPx = interactive ? coords[displayIndex][1] - 10 : 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-4.5 px-5 flex-1">
      <div className="text-sm text-muted-foreground font-bold mb-0.5">{label}</div>
      <div className="text-2xl font-black mb-1">{value}</div>
      {points.length >= 1 ? (
        <>
          <div
            className="text-xs text-muted-foreground mb-2 min-h-[18px] [font-variant-numeric:tabular-nums]"
            aria-live="polite"
          >
            {readoutPrefix}
            {dateLabels[displayIndex]}
            {"　"}
            <span className="font-bold text-foreground">{points[displayIndex].toLocaleString()}</span>
            {diffInfo && (
              <>
                {"　"}
                <span style={{ color: diffInfo.color }}>{diffInfo.text}</span>
              </>
            )}
          </div>
          <div
            ref={wrapRef}
            className="relative rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-1"
            style={{ touchAction: "pan-y", cursor: interactive ? "crosshair" : "default" }}
            tabIndex={interactive ? 0 : undefined}
            role={interactive ? "img" : undefined}
            aria-label={interactive ? `${label}の直近14日の推移。左右の矢印キーで日を選べます` : undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          >
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="90" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="20" x2={W} y2="20" stroke="#EEF1F6" strokeWidth="1" />
              <line x1="0" y1="50" x2={W} y2="50" stroke="#EEF1F6" strokeWidth="1" />
              <line x1="0" y1="80" x2={W} y2="80" stroke="#EEF1F6" strokeWidth="1" />
              {points.length > 1 && (
                <>
                  <polygon points={polygon} fill={ACCENT} fillOpacity="0.08" />
                  <polyline
                    points={polyline}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              )}
              {showExtremes && (
                <>
                  {/* 点・線と重なっても読めるよう、文字の外側に白い縁取り(halo)を付ける */}
                  <text
                    x={Math.min(Math.max(coords[iMax][0], 14), W - 14)}
                    y={Math.max(coords[iMax][1] - 7, 9)}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#6B7280"
                    paintOrder="stroke"
                    stroke="var(--card)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  >
                    最多 {actualMax.toLocaleString()}
                  </text>
                  <text
                    x={Math.min(Math.max(coords[iMin][0], 14), W - 14)}
                    y={Math.min(coords[iMin][1] + 16, H)}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#6B7280"
                    paintOrder="stroke"
                    stroke="var(--card)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  >
                    最少 {actualMin.toLocaleString()}
                  </text>
                </>
              )}
              {interactive && (
                <line
                  x1={coords[displayIndex][0]}
                  x2={coords[displayIndex][0]}
                  y1="6"
                  y2={H}
                  stroke="#6B7280"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                  visibility={activeIndex == null ? "hidden" : "visible"}
                />
              )}
            </svg>
            {coords.map(([x, y], i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${(x / W) * 100}%`,
                  top: y,
                  width: 8,
                  height: 8,
                  marginLeft: -4,
                  marginTop: -4,
                  borderRadius: "50%",
                  background: ACCENT,
                  pointerEvents: "none",
                  transform: interactive && activeIndex != null && i === displayIndex ? "scale(1.6)" : "scale(1)",
                  transition: "transform 120ms",
                }}
              />
            ))}
            {interactive && (
              <div
                hidden={activeIndex == null}
                style={{
                  position: "absolute",
                  left: `${tipXPct}%`,
                  top: tipTopPx,
                  transform: "translate(-50%, -100%)",
                  background: "#1E2433",
                  color: "#fff",
                  fontSize: 12,
                  padding: "5px 9px",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  fontVariantNumeric: "tabular-nums",
                  boxShadow: "0 4px 14px rgba(0,0,0,.18)",
                }}
              >
                {dateLabels[displayIndex]}
                <br />
                <span style={{ fontWeight: 700 }}>{points[displayIndex].toLocaleString()}</span>
                {diffInfo && <span style={{ opacity: 0.8 }}> {diffInfo.text}</span>}
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{dates[0]}</span>
            <span>{dates[Math.floor(dates.length / 2)]}</span>
            <span>{dates[dates.length - 1]}</span>
          </div>
        </>
      ) : (
        <div className="h-[90px] flex items-center justify-center text-sm text-muted-foreground">
          日次データはまだありません
        </div>
      )}
      {footnote && <div className="text-xs text-muted-foreground mt-2">{footnote}</div>}
    </div>
  );
}
