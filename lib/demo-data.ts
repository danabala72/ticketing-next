export const events = [
  { slug: "bali-sunrise-fun-run-2026", name: "Bali Sunrise Fun Run 2026", type: "FUN_RUN", date: "18 Okt 2026", place: "Lapangan Puputan, Denpasar", sold: 842, capacity: 1200, status: "PUBLISHED" },
  { slug: "digital-business-webinar", name: "Digital Business Webinar", type: "WEBINAR", date: "7 Nov 2026", place: "Online · Zoom", sold: 216, capacity: 500, status: "PUBLISHED" },
  { slug: "women-in-leadership", name: "Women in Leadership", type: "SEMINAR", date: "22 Nov 2026", place: "Bali Nusa Dua Convention Center", sold: 0, capacity: 350, status: "DRAFT" },
] as const;

export const registrations = [
  { code: "EVT-2601842", name: "Ayu Lestari", event: "Bali Sunrise Fun Run 2026", category: "10K", bib: "A-0842", state: "Race pack diambil" },
  { code: "EVT-2601843", name: "Made Arta", event: "Bali Sunrise Fun Run 2026", category: "5K", bib: "B-0316", state: "Menunggu verifikasi" },
  { code: "EVT-2601844", name: "Ni Putu Sari", event: "Bali Sunrise Fun Run 2026", category: "10K", bib: "—", state: "Data perlu diperiksa" },
] as const;
