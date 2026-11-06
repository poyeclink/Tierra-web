import type { OpeningHours as Hours } from "@/core/establishment/domain/establishment";
import { Todo } from "@/presentation/components/ui/todo";
import { WEEKDAYS } from "@/presentation/lib/format";

export function OpeningHours({ hours }: { hours: readonly Hours[] }) {
  if (hours.length === 0) return <Todo>horarios pendientes del cliente</Todo>;

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1 text-sm">
      {WEEKDAYS.map(({ day, label }) => {
        const entry = hours.find((h) => h.day === day);
        return (
          <div key={day} className="contents">
            <dt className="text-ink-muted">{label}</dt>
            <dd>{entry ? `${entry.opens} – ${entry.closes}` : "Cerrado"}</dd>
          </div>
        );
      })}
    </dl>
  );
}
