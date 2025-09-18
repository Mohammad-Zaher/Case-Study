'use client';

export default function EmptyDeskList({ desks }: { desks: any[] }) {
  return (
    <div>
      <span className="text-lg font-bold">Currently free Desks</span>
      {desks.map((desk) => (
        <div>{desk.name}</div>
      ))}
    </div>
  );
}
