// Penanda bahwa perpindahan halaman sedang memakai View Transitions API.
// Dipakai PageTransition supaya tidak menjalankan animasi fade-nya sendiri di atas transisi ini.
let pending = false

export const markViewTransition = () => {
  pending = true
}

export const clearViewTransition = () => {
  pending = false
}

export const isViewTransitionPending = () => pending

/** Nama view transition untuk gambar sebuah proyek (harus sama di kartu dan halaman detail). */
export const projectImageTransition = (slug) => `project-image-${slug}`
