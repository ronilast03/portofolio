import { Link } from 'react-router'
import Image from '@/components/common/Image'
import Icon from '@/components/common/Icon'

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-bg no-underline transition hover:-translate-y-0.5 hover:border-fg"
    >
      <Image
        src={project.thumbnail}
        alt={`Tampilan ${project.title}`}
        className="aspect-16/10 border-b border-line"
        imgClassName="group-hover:scale-104"
        width="640"
        height="400"
      />
      <div className="flex flex-1 flex-col gap-2 p-4.5">
        <span className="eyebrow">
          {project.category} · {project.year}
        </span>
        <h3 className="flex items-start justify-between gap-3 text-lg font-bold">
          {project.title}
          <Icon
            name="arrowRight"
            className="mt-1.5 size-4 shrink-0 text-muted transition duration-300 group-hover:translate-x-1 group-hover:text-accent"
          />
        </h3>
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
