export default function Timeline({ items }) {
  return (
    <ol className="border-l border-line">
      {items.map((item) => (
        <li key={`${item.period}-${item.title}`} className="relative pb-7 pl-6 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute top-2 -left-[5px] size-[9px] rounded-full border-2 border-accent bg-bg"
          />
          <p className="font-mono text-[12.5px] text-muted">{item.period}</p>
          <h3 className="mt-0.5 text-[17px] font-bold">{item.title}</h3>
          <p className="text-[14.5px] text-muted">{item.organization}</p>
          {item.points?.length > 0 && (
            <ul className="mt-2 list-disc pl-[18px] text-[14.5px] text-muted">
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}
