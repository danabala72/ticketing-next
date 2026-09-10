import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { addConsent, addFormField, addTicketType, addVoucher, assignEventAdmin, publishEvent } from "@/app/actions";
export const dynamic="force-dynamic";
export default async function Manage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const event=await prisma.event.findUnique({where:{id},include:{ticketTypes:true,formFields:{orderBy:{sortOrder:"asc"}},consentTerms:true,vouchers:true,admins:{include:{user:true}}}}).catch(()=>null);
  if(!event) notFound();
  const Hidden=()=> <input type="hidden" name="eventId" value={event.id}/>;
  return <AppShell title="Kelola event"><div className="flex flex-wrap justify-between gap-4"><div><h2 className="text-2xl font-bold">{event.name}</h2><p className="text-sm text-slate-500">Status: {event.status}</p></div>{event.status==="DRAFT"&&<form action={publishEvent}><Hidden/><button className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Publikasikan</button></form>}</div><div className="mt-7 grid gap-6 xl:grid-cols-2">
  <Panel title="Jenis tiket" rows={event.ticketTypes.map((x:any)=>x.name+" · "+x.quota)}><form action={addTicketType} className="grid gap-3 sm:grid-cols-3"><Hidden/><Input name="name" placeholder="Nama tiket"/><Input name="price" placeholder="Harga"/><Input name="quota" placeholder="Kuota"/><Submit label="Tambah tiket"/></form></Panel>
  <Panel title="Field pendaftaran" rows={event.formFields.map((x:any)=>x.label+" · "+x.type)}><form action={addFormField} className="grid gap-3 sm:grid-cols-2"><Hidden/><Input name="label" placeholder="Label"/><Input name="key" placeholder="field_key"/><select name="type" className="rounded-xl border px-3"><option>TEXT</option><option>EMAIL</option><option>PHONE</option><option>SELECT</option><option>CHECKBOX</option></select><label><input name="required" type="checkbox"/> Wajib</label><Submit label="Tambah field"/></form></Panel>
  <Panel title="Persetujuan" rows={event.consentTerms.map((x:any)=>x.title)}><form action={addConsent} className="grid gap-3"><Hidden/><Input name="title" placeholder="Judul"/><textarea required name="body" className="rounded-xl border p-3" placeholder="Isi persetujuan"/><label><input name="required" type="checkbox" defaultChecked/> Wajib</label><Submit label="Tambah persetujuan"/></form></Panel>
  <Panel title="Voucher" rows={event.vouchers.map((x:any)=>x.code)}><form action={addVoucher} className="grid gap-3 sm:grid-cols-3"><Hidden/><Input name="code" placeholder="Kode"/><Input name="percentage" placeholder="Persen"/><Input name="maxUses" placeholder="Batas pakai"/><Submit label="Tambah voucher"/></form></Panel>
  <Panel title="Admin event" rows={event.admins.map((x:any)=>x.user.name+" · "+x.role)}><form action={assignEventAdmin} className="grid gap-3 sm:grid-cols-2"><Hidden/><Input name="name" placeholder="Nama"/><Input name="email" placeholder="Email"/><select name="role" className="rounded-xl border px-3"><option>MANAGER</option><option>REGISTRATION_STAFF</option><option>CHECKIN_STAFF</option><option>VIEWER</option></select><Submit label="Tambah admin"/></form></Panel>
  </div></AppShell>
}
function Panel({title,rows,children}:{title:string;rows:string[];children:React.ReactNode}){return <section className="rounded-2xl border bg-white p-5"><h3 className="font-semibold">{title}</h3><div className="my-4 space-y-2">{rows.map((x:any)=><p key={x} className="rounded-lg bg-slate-50 p-3 text-sm">{x}</p>)}</div>{children}</section>}
function Input({name,placeholder}:{name:string;placeholder:string}){return <input required name={name} placeholder={placeholder} className="rounded-xl border px-3 py-2.5 text-sm"/>}
function Submit({label}:{label:string}){return <button className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">{label}</button>}
