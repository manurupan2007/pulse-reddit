import { ActivityCell } from "@/lib/types";

type ActivityHeatmapProps = {
  heatmap: ActivityCell[];
};

function tone(intensity: number) {
  if (intensity > 85) return "bg-danger/70";
  if (intensity > 70) return "bg-amber/70";
  if (intensity > 50) return "bg-cyan/70";
  if (intensity > 30) return "bg-accent/60";
  return "bg-white/10";
}

export function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const days = [...new Set(heatmap.map((item) => item.day))];
  const hours = [...new Set(heatmap.map((item) => item.hour))];

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[520px] grid-cols-[80px_repeat(6,1fr)] gap-2">
        <div />
        {hours.map((hour) => (
          <div key={hour} className="text-center text-xs uppercase tracking-[0.28em] text-muted">
            {hour}
          </div>
        ))}
        {days.map((day) => (
          <FragmentRow key={day} day={day} cells={heatmap.filter((cell) => cell.day === day)} />
        ))}
      </div>
    </div>
  );
}

function FragmentRow({ day, cells }: { day: string; cells: ActivityCell[] }) {
  return (
    <>
      <div className="flex items-center text-sm text-muted">{day}</div>
      {cells.map((cell) => (
        <div
          key={`${cell.day}-${cell.hour}`}
          className="group glass-panel rounded-2xl relative h-14 overflow-hidden"
          title={`${cell.day} ${cell.hour}:00 - ${cell.intensity}`}
        >
          <div className={`absolute inset-1 rounded-[14px] ${tone(cell.intensity)} transition-transform duration-300 group-hover:scale-[0.96]`} />
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-white/80">
            {cell.intensity}
          </div>
        </div>
      ))}
    </>
  );
}
