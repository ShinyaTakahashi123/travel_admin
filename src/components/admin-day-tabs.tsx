"use client";

import { useState } from "react";

// このスポットを出発したあとの移動(乗り継ぎ。最大4つ、順番つき)
export type AdminTransitLeg = {
  transitMode: string;
  transitDurationMin: number | null;
  transitLine: string | null;
};

export type AdminDaySpot = {
  id: string;
  name: string;
  visitTimeLabel: string | null;
  stayDurationMin: number | null;
  address: string | null;
  memo: string | null;
  websiteUrl: string | null;
  hasLocation: boolean;
  transitLegs: AdminTransitLeg[];
};

const TRANSIT_LABEL: Record<string, string> = {
  walk: "徒歩",
  train: "電車",
  bus: "バス",
  car: "車",
  taxi: "タクシー",
  other: "その他",
};

export type AdminDayData = {
  id: string;
  dayNumber: number;
  spots: AdminDaySpot[];
};

export function AdminDayTabs({ days }: { days: AdminDayData[] }) {
  const [active, setActive] = useState(days[0]?.dayNumber ?? 1);
  const current = days.find((d) => d.dayNumber === active) ?? days[0];

  return (
    <div>
      <div className="flex gap-2 mb-3.5 flex-wrap">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => setActive(day.dayNumber)}
            className={`px-4.5 py-2 rounded-full font-bold text-sm ${
              day.dayNumber === active ? "bg-primary text-white" : "bg-muted text-[#475569]"
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {current?.spots.map((spot, i) => (
          <div key={spot.id}>
            {/* このスポットに着くまでの移動(乗り継ぎ)。データの決まり: スポット自身の
                移動情報は「前のスポットからそこへの移動」を表す */}
            {i > 0 && spot.transitLegs.length > 0 && (
              <div className="pl-3 py-1 flex items-center gap-1.5 flex-wrap text-sm text-[#8a5a32]">
                <span className="text-xs font-bold text-muted-foreground">移動:</span>
                {spot.transitLegs.map((leg, li) => (
                  <span key={li}>
                    {li > 0 && <span className="text-muted-foreground mr-1.5">→</span>}
                    {TRANSIT_LABEL[leg.transitMode] ?? leg.transitMode}
                    {leg.transitDurationMin != null && ` 約${leg.transitDurationMin}分`}
                    {leg.transitLine ? `（${leg.transitLine}）` : ""}
                  </span>
                ))}
              </div>
            )}
            <div className="border border-muted rounded-lg px-3 py-2.5 flex gap-2.5">
              {spot.visitTimeLabel && (
                <span className="text-sm font-bold text-primary whitespace-nowrap">{spot.visitTimeLabel}</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-base font-bold">{spot.name}</div>
                  {!spot.hasLocation && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      位置未設定
                    </span>
                  )}
                </div>
                {spot.stayDurationMin != null && (
                  <div className="text-sm text-muted-foreground">滞在 約{spot.stayDurationMin}分</div>
                )}
                {spot.address && <div className="text-sm text-[#475569]">{spot.address}</div>}
                {spot.memo && <div className="text-sm text-[#475569] whitespace-pre-wrap">{spot.memo}</div>}
                {spot.websiteUrl && (
                  <a
                    href={spot.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline break-all"
                  >
                    {spot.websiteUrl}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
