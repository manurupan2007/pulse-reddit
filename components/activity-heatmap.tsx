import { ActivityCell } from "@/lib/types";

type ActivityHeatmapProps = {
  heatmap: ActivityCell[];
};

function tone(intensity: number) {
  if (intensity > 85) return "bg-red-500/80";
  if (intensity > 70) return "bg-amber-500/80";
  if (intensity > 50) return "bg-sky-500/80";
  if (intensity > 30) return "bg-sky-500/40";
  return "bg-zinc-800/50";
}

export function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const days = [...new Set(heatmap.map((item) => item.day))];
  const hours = [...new Set(heatmap.map((item) => item.hour))];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[640px] grid-cols-[80px_repeat(6,1fr)] gap-3">
        <div />
        {hours.map((hour) => (
          <div key={hour} className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {hour}:00
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
      <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{day}</div>
      {cells.map((cell) => (
        <div
          key={`${cell.day}-${cell.hour}`}
          className="group relative h-10 rounded-md border border-border/50 bg-background overflow-hidden"
          title={`${cell.day} ${cell.hour}:00 - Intensity: ${cell.intensity}`}
        >
          <div className={`absolute inset-0 ${tone(cell.intensity)} transition-opacity duration-200 group-hover:opacity-80`} />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
            {cell.intensity}
          </div>
        </div>
      ))}
    </>
  );
}
