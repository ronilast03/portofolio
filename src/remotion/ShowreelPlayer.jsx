// Dimuat terpisah (lazy) oleh ShowreelSection supaya Remotion tidak memperberat pembukaan awal website.
import { forwardRef, useEffect } from 'react'
import { Player } from '@remotion/player'
import Showreel, { SHOWREEL, showreelDuration } from './Showreel'

const ShowreelPlayer = forwardRef(function ShowreelPlayer({ name, role, projects, autoPlay }, ref) {
  // Muat gambar lebih dulu supaya tidak ada scene kosong saat video berganti proyek.
  useEffect(() => {
    projects.forEach((p) => {
      if (!p.thumbnail) return
      const img = new window.Image()
      img.src = p.thumbnail
    })
  }, [projects])

  return (
    <Player
      ref={ref}
      component={Showreel}
      inputProps={{ name, role, projects }}
      durationInFrames={showreelDuration(projects.length)}
      fps={SHOWREEL.fps}
      compositionWidth={SHOWREEL.width}
      compositionHeight={SHOWREEL.height}
      style={{ width: '100%', height: '100%' }}
      autoPlay={autoPlay}
      loop
      controls={false}
      clickToPlay={false}
      initiallyMuted
      acknowledgeRemotionLicense
    />
  )
})

export default ShowreelPlayer
