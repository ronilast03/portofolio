import { Link } from 'react-router'
import Icon from '@/components/common/Icon'
import { emphasize } from '@/utils/emphasis'

export default function SectionHeading({ id, title, description, linkTo, linkLabel }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="display-serif text-[clamp(34px,4.4vw,50px)]">
          {emphasize(title)}
        </h2>
        {description && <p className="mt-2 max-w-[56ch] text-muted">{description}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="link-accent">
          {linkLabel} <Icon name="arrowRight" />
        </Link>
      )}
    </div>
  )
}
