import Image from '@/components/common/Image'
import Icon from '@/components/common/Icon'
import TransitionLink from '@/components/common/TransitionLink'
import { projectImageTransition } from '@/utils/viewTransition'

export default function ProjectCard({ project, headingAs: Heading = 'h3', priority = false }) {
  const status = project.status ?? 'Implemented'
  const implemented = status === 'Implemented'
  return (
    <TransitionLink
      to={`/projects/${project.slug}`}
      className="spotlight group flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-bg no-underline transition hover:-translate-y-0.5 hover:border-fg"
    >
      <div className="relative">
        <Image
          src={project.thumbnail}
          alt={`Tampilan ${project.title}`}
          className="aspect-16/10 border-b border-line"
          imgClassName="group-hover:scale-104"
          wrapperStyle={{ viewTransitionName: projectImageTransition(project.slug) }}
          width="640"
          height="400"
          priority={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        />
        {/* Status change (lihat changeId & status di src/data/projects.js) */}
        {project.changeId && (
          <span
            className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-0.5 text-[12px] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.15)] ${implemented ? 'text-ok' : 'text-warn'}`}
          >
            <span aria-hidden="true" className={`size-1.75 rounded-full ${implemented ? 'bg-ok' : 'bg-warn'}`} />
            {status}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4.5">
        <span className="eyebrow">
          {project.changeId && `${project.changeId} · `}
          {project.category} · {project.year}
        </span>
        <Heading className="flex items-start justify-between gap-3 text-lg font-bold">
          {project.title}
          <Icon
            name="arrowRight"
            className="mt-1.5 size-4 shrink-0 text-muted transition duration-300 group-hover:translate-x-1 group-hover:text-accent"
          />
        </Heading>
        <p className="text-[14.5px] text-muted">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2.5">
          {project.stack.slice(0, 3).map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </div>
    </TransitionLink>
  )
}
