import { AppShell } from "@/components/app-shell";
import { updateRegistrationStatus } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { DEMO_TENANT_ID } from "@/lib/constants";
export const dynamic="force-dynamic";
export default async function OnSitePage(){
  const rows=await prisma.registration.findMany({where:{event:{tenantId:DEMO_TENANT_ID}},include:{event:true,ticketType:true},take:30,orderBy:{fullName:"asc"}}).catch(()=>[]);
  return <AppShell title="Registrasi on-site"><h2 className="text-2xl font-bold">Registrasi ulang peserta</h2><p className="mt-2 text-slate-500">Verifikasi identitas, race pack, dan kehadiran tersimpan langsung ke database.</p><div className="mt-6 space-y-3">{rows.length===0?<div className="rounded-2xl border bg-white p-8 text-center text-slate-500">Belum ada peserta. Lakukan pendaftaran melalui landing page event.</div>:rows.map((r:any)=><article key={r.id} className="grid gap-4 rounded-2xl border bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><b>{r.fullName}</b><p className="mt-1 text-sm text-slate-500">{r.code} · {r.ticketType.name} · {r.status.replaceAll("_"," ")}</p></div><div className="flex flex-wrap gap-2">{[["VERIFIED_ON_SITE","Verifikasi"],["RACE_PACK_COLLECTED","Race pack"],["CHECKED_IN","Check-in"],["ISSUE","Tandai masalah"]].map(([status,label])=><form action={updateRegistrationStatus} key={status}><input type="hidden" name="id" value={r.id}/><input type="hidden" name="status" value={status}/><button className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50">{label}</button></form>)}</div></article>)}</div></AppShell>
}
