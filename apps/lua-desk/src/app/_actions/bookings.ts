'use server';

import { auth } from '../../../auth';
import { db } from '../../../db';
import { bookingDays, desk } from '../../db/schema';
import { between, notInArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';

//gibt die ausgewaelte Tage zurueck, Z.B. ['2025-09-17', '2025-09-18', '2025-09-19' ] 
function getDays(start: string, end: string) {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const out: string[] = [];
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        out.push(d.toISOString().slice(0, 10));
    }
    return out;
}

//return true :falss ausgewalte Tage > heute und kleiner als max (Today +30).
function inNext30Days(dayStr: string) {
    const d = new Date(dayStr + 'T00:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const max = new Date(today); max.setDate(max.getDate() + 30);
    console.log("dddd ", d);
    console.log("today   ", today);
    console.log("max   ", max);
    return d >= today && d <= max;
}

//Gib alle freien Desks für einen Zeitraum [start, end].
export async function getAvailableDesks(start: string, end: string) {
    const bookedRows = await db
        .selectDistinct({ id: bookingDays.deskId })
        .from(bookingDays)
        .where(between(bookingDays.day, start, end));

    const bookedIds = bookedRows.map(r => r.id);

    if (bookedIds.length === 0) {
        return await db.select().from(desk);
    }
    return await db.select().from(desk).where(notInArray(desk.id, bookedIds));
}

export async function bookDeskAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return;
    }

    const deskId = Number(formData.get('deskId'));
    const start = String(formData.get('start') || '');
    const end = String(formData.get('end') || '');

    if (end < start) {
        redirect(`/?start=${start}&end=${end}&error=range`);
    }

    const days = getDays(start, end);
    if (days.length === 0) {
        redirect(`/?start=${start}&end=${end}&error=range`);
    }

    if (days.some(d => !inNext30Days(d))) {
        redirect(`/?start=${start}&end=${end}&error=max30`);
    }

    const rows = days.map(day => ({
        deskId,
        userId: String(session.user!.id),
        day,
    }));

    const inserted = await db.insert(bookingDays)
        .values(rows)
        .onConflictDoNothing({ target: [bookingDays.deskId, bookingDays.day] })
        .returning();

    if (inserted.length !== rows.length) {
        redirect(`/?start=${start}&end=${end}&error=conflict`);
    }

    redirect(`/?start=${start}&end=${end}&ok=1`);
}
