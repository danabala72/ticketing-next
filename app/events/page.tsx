import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { events } from "@/lib/demo-data";

export default function EventsPage() {
  return <AppShell title="Event" action={<Link href="/events/new" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17}/>Buat event</Link>}>
    <div className="mb-5"><h2 className="text-2xl font-bold">Semua event</h2><p className="mt-1 text-sm text-slate-500">Setiap event memiliki landing page, tim admin, form, tiket, dan alur operasional sendiri.</p></div>
    <div className="grid gap-4 xl:grid-cols-3">{events.map(e => <article key={e.slug} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{e.type.replace("_"," ")}</span><span className="text-xs text-slate-400">{e.status}</span></div><h3 className="mt-5 text-lg font-semibold">{e.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{e.date}<br/>{e.place}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-sm"><b>{e.sold}</b> / {e.capacity} peserta</span><Link href={`/e/${e.slug}`} className="text-sm font-semibold text-indigo-600">Landing page →</Link></div></article>)}</div>
  </AppShell>;
}
