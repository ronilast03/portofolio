import { Link } from 'react-router'
import Icon from '@/components/common/Icon'

export default function SectionHeading({ id, title, description, linkTo, linkLabel }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em]">
          {title}
        </h2>
        {description && <p className="mt-1.5 max-w-[56ch] text-muted">{description}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="link-accent">
          {linkLabel} <Icon name="arrowRight" />
        </Link>
      )}
    </div>
  )
}
