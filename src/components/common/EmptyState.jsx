export default function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-[10px] border border-dashed border-line px-5 py-10 text-center text-muted">
      <h3 className="mb-1.5 text-[17px] font-bold">{title}</h3>
      {children && <p>{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
