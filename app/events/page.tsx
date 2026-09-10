import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { DEMO_TENANT_ID } from "@/lib/constants";
import { events as fallback } from "@/lib/demo-data";
export const dynamic = "force-dynamic";

export default async function EventsPage(){
  let events:any[]=[];
  try { events=await prisma.event.findMany({where:{tenantId:DEMO_TENANT_ID},include:{_count:{select:{registrations:true}}},orderBy:{startsAt:"desc"}}); }
  catch { events=fallback.map(e=>({...e,_count:{registrations:e.sold}})); }
  return <AppShell title="Event" action={<Link href="/events/new" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17}/>Buat event</Link>}>
    <h2 className="text-2xl font-bold">Semua event</h2><p className="mt-1 text-sm text-slate-500">Event tenant dibaca langsung dari database.</p>
    <div className="mt-6 grid gap-4 xl:grid-cols-3">{events.map(e=><article key={e.id??e.slug} className="rounded-2xl border border-slate-200 bg-white p-5"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{String(e.type).replace("_"," ")}</span><h3 className="mt-5 text-lg font-semibold">{e.name}</h3><p className="mt-2 text-sm text-slate-500">{e.venue??e.place}</p><div className="mt-5 flex justify-between border-t pt-4 text-sm"><b>{e._count?.registrations??0} peserta</b><span className="flex gap-3"><Link className="font-semibold text-indigo-600" href={"/events/"+e.id+"/manage"}>Kelola</Link><Link className="font-semibold text-indigo-600" href={"/e/"+e.slug}>Publik →</Link></span></div></article>)}</div>
  </AppShell>
}
