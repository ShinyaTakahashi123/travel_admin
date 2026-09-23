"use client";

import { useState } from "react";

export type AdminDaySpot = {
  id: string;
  name: string;
  visitTimeLabel: string | null;
  stayDurationMin: number | null;
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
        {current?.spots.map((spot) => (
          <div key={spot.id} className="border border-muted rounded-lg px-3 py-2.5 flex gap-2.5">
            {spot.visitTimeLabel && (
              <span className="text-sm font-bold text-primary whitespace-nowrap">{spot.visitTimeLabel}</span>
            )}
            <div>
              <div className="text-base font-bold">{spot.name}</div>
              {spot.stayDurationMin != null && (
                <div className="text-sm text-muted-foreground">滞在 約{spot.stayDurationMin}分</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
