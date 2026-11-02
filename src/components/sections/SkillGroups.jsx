export default function SkillGroups({ groups }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((g) => (
        <div key={g.group} className="rounded-[10px] border border-line p-[18px]">
          <h3 className="mb-3 flex items-center justify-between text-[15px] font-bold">
            {g.group}
            {g.note && <span className="font-mono text-[11.5px] font-normal text-muted">{g.note}</span>}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {g.items.map((s) => (
              <li key={s.name} className="rounded-[7px] border border-line bg-surface px-2.5 py-1 font-mono text-[12.5px]">
                {s.name}
                {s.level && <small className="ml-1.5 text-[11px] text-muted">{s.level}</small>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
