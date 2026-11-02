import { Link } from 'react-router'
import Image from '@/components/common/Image'

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-[10px] border border-line bg-bg no-underline transition hover:-translate-y-0.5 hover:border-fg"
    >
      <Image
        src={project.thumbnail}
        alt={`Tampilan ${project.title}`}
        className="aspect-16/10 border-b border-line"
        width="640"
        height="400"
      />
      <div className="flex flex-1 flex-col gap-2 p-4.5">
        <span className="eyebrow">
          {project.category} · {project.year}
        </span>
        <h3 className="text-lg font-bold">{project.title}</h3>
        <p className="text-[14.5px] text-muted">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2.5">
          {project.stack.slice(0, 3).map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
