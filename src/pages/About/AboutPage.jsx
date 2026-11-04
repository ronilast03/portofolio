import { Link } from 'react-router'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import CvButton from '@/components/common/CvButton'
import Reveal from '@/components/common/Reveal'
import { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import Timeline from '@/components/sections/Timeline'
import SkillGroups from '@/components/sections/SkillGroups'
import CertificateCard from '@/components/sections/CertificateCard'
import Lanyard from '@/components/common/Lanyard'
import ProfileBadge from '@/components/sections/ProfileBadge'
import { certificates } from '@/data/certificates'
import { education, experience, profile } from '@/data/profile'
import { skillGroups } from '@/data/skills'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'About' }]

function Row({ id, title, children, anchor }) {
  return (
    <>
      <hr className="border-line" />
      <section id={anchor} aria-labelledby={id} className="grid gap-10 py-14 lg:grid-cols-[220px_1fr] lg:gap-16 lg:py-20">
        <Reveal as="h2" id={id} className="text-[22px] font-bold">
          {title}
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">
          {children}
        </Reveal>
      </section>
    </>
  )
}

export default function AboutPage() {
  return (
    <PageTransition>
      <Seo
        title="Tentang"
        description={`Biografi, pendidikan, pengalaman, sertifikat, dan keahlian ${profile.name}.`}
        path="/about"
        type="profile"
        jsonLd={breadcrumbJsonLd(crumbs)}
      />
      <div className="container-page">
        {/* Layar besar: judul + bio di kiri, kartu identitas di kanan tergantung dari navbar.
            HP: judul, lalu kartu, lalu bio. */}
        <div className="grid pb-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:grid-rows-[auto_1fr] lg:gap-x-16">
          <div className="lg:col-start-1 lg:row-start-1">
            <PageHeader title="Tentang saya" description="Latar belakang, pendidikan, pengalaman, sertifikat, dan keahlian." breadcrumb={crumbs} />
          </div>
          <Lanyard
            strap={`${profile.name.toUpperCase()} · ITSM · WEB`}
            rest={2}
            className="mb-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mb-0"
          >
            <ProfileBadge />
          </Lanyard>
          <div className="max-w-[65ch] space-y-4 text-[17px] lg:col-start-1 lg:row-start-2">
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <Row id="exp-title" title="Pengalaman">
          <Timeline items={experience} />
        </Row>
        <Row id="edu-title" title="Pendidikan">
          <Timeline items={education} />
        </Row>
        {certificates.length > 0 && (
          <Row id="cert-title" anchor="sertifikat" title="Sertifikat">
            <ul className="grid gap-4 sm:grid-cols-2">
              {certificates.map((c) => (
                <li key={c.title}>
                  <CertificateCard cert={c} />
                </li>
              ))}
            </ul>
          </Row>
        )}
        <Row id="skill-title" title="Keahlian">
          <SkillGroups groups={skillGroups} />
        </Row>
        <Row id="interest-title" title="Minat">
          <ul className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <li key={i} className="rounded-[7px] border border-line bg-surface px-2.5 py-1 font-mono text-[12.5px]">
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <CvButton variant="primary" />
            <Link to="/contact" className="btn btn-ghost">
              Hubungi saya
            </Link>
          </div>
        </Row>
      </div>
    </PageTransition>
  )
}
