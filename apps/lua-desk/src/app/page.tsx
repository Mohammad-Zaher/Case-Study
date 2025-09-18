'use server';

import { getAvailableDesks, bookDeskAction } from '../app/_actions/bookings';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function Index({
  searchParams,
}: {
  searchParams: { start?: string; end?: string; ok?: string; error?: string };
}) {
  const start = searchParams.start ?? todayStr();
  const end = searchParams.end ?? start;

  const desks = await getAvailableDesks(start, end);

  const msg = searchParams.ok
    ? { type: 'ok', text: 'Buchung gespeichert.' }
    : searchParams.error === 'invalid'
      ? { type: 'err', text: 'Bitte gültigen Zeitraum auswählen.' }
      : searchParams.error === 'range'
        ? { type: 'err', text: 'Ende darf nicht vor Start liegen.' }
        : searchParams.error === 'max30'
          ? { type: 'err', text: 'Nur Buchungen in den nächsten 30 Tagen.' }
          : searchParams.error === 'conflict'
            ? { type: 'err', text: 'Mindestens ein Tag ist bereits belegt.' }
            : null;

  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Desk Booking</h1>

      <form className="flex gap-4 items-end" action="/" method="get">
        <div className="flex flex-col">
          <label className="text-sm text-muted-foreground">Start</label>
          <input
            type="date"
            name="start"
            defaultValue={start}
            required
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-muted-foreground">Ende</label>
          <input
            type="date"
            name="end"
            defaultValue={end}
            required
            className="border rounded px-3 py-2"
          />
        </div>
        <button className="border rounded px-4 h-10">Zeitraum anzeigen</button>
      </form>

      {msg && (
        <div
          className={
            msg.type === 'ok'
              ? 'text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded'
              : 'text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded'
          }
        >
          {msg.text}
        </div>
      )}

      <section className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Verfügbar für {start} bis {end}
        </div>
        {desks.length === 0 ? (
          <div className="text-muted-foreground">Keine freien Desks im gewählten Zeitraum.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {desks.map((d: any) => (
              <form
                key={d.id}
                action={bookDeskAction}
                className="border rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="font-medium">{d.name}</div>
                <input type="hidden" name="deskId" value={d.id} />
                <input type="hidden" name="start" value={start} />
                <input type="hidden" name="end" value={end} />
                <button className="border rounded px-3 py-2 self-start">
                  Diesen Desk buchen
                </button>
              </form>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
