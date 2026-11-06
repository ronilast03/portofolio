export const certificates = [
  {
    title: "Project Integration Methodology of Excellence (PIMOE)",
    issuer: "Logical Operations",
    date: "2026-02",
    credentialId: "181680877",
    url: "https://certifications.certnexus.com/db6a0d46-e255-429b-94c4-df3bc2acf829#acc.q3Ip1syF",
    image: "/images/certificates/logical-operations-pimoe.webp",
    featured: true,
  },
  {
    title: "CCNAv7: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    date: "2024-09",
    credentialId: "847f3c2c-0a59-43e5-a59c-b6639a5949fd",
    url: "https://www.credly.com/badges/847f3c2c-0a59-43e5-a59c-b6639a5949fd/public_url",
    image: "/images/certificates/cisco-ccna-srwe.webp",
    featured: true,
  },
  {
    title: "CCNAv7: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    date: "2024-02",
    credentialId: "3353248a-cb0c-4d29-a158-96fc9c5aa8a2",
    url: "https://www.credly.com/badges/3353248a-cb0c-4d29-a158-96fc9c5aa8a2/public_url",
    image: "/images/certificates/cisco-ccna-itn.webp",
  },
  {
    title: "Belajar Membuat Aplikasi Web dengan React",
    issuer: "Dicoding Indonesia",
    date: "2023-08",
    expires: "2026-08",
    credentialId: "53XENGQVRXRN",
    url: "https://www.dicoding.com/certificates/53XENGQVRXRN",
    image: "/images/certificates/dicoding-react.webp",
    // Teknologi yang dibuktikan sertifikat ini (dipakai di Peta keahlian /cmdb)
    skills: ["React"],
    featured: true,
  },
  {
    title: "Membangun Website Dari Basic dengan Mudah",
    issuer: "Udemy · Udacoding Official",
    date: "2023-02",
    credentialId: "UC-c68d69f9-68e1-4003-96ef-2c2a35e147d9",
    url: "https://ude.my/UC-c68d69f9-68e1-4003-96ef-2c2a35e147d9",
    image: "/images/certificates/udemy-website-basic.webp",
    skills: ["HTML & CSS"],
  },
];

export const featuredCertificates = (limit = 3) => certificates.filter((c) => c.featured).slice(0, limit)
