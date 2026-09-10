import { AppShell } from "@/components/app-shell";
import { savePaymentConfig } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { DEMO_TENANT_ID } from "@/lib/constants";
export const dynamic="force-dynamic";
export default async function PaymentsPage(){
  const config=await prisma.paymentConfig.findUnique({where:{tenantId:DEMO_TENANT_ID}}).catch(()=>null);
  return <AppShell title="Pembayaran"><form action={savePaymentConfig} className="mx-auto max-w-3xl"><h2 className="text-2xl font-bold">Midtrans tenant</h2><p className="mt-2 text-slate-500">Jika tidak diisi, event menggunakan Midtrans global Eventra.</p><section className="mt-7 rounded-2xl border bg-white p-6"><div className="grid gap-5"><Field name="merchantId" label="Merchant ID" value={config?.merchantId}/><Field name="clientKey" label="Client Key" value={config?.clientKey}/><Field name="serverKey" label="Server Key" type="password"/><label className="flex items-center gap-3 text-sm"><input name="production" type="checkbox" defaultChecked={config?.production}/>Gunakan mode production</label></div><button className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Simpan konfigurasi</button></section></form></AppShell>
}
function Field({name,label,value,type="text"}:{name:string;label:string;value?:string|null;type?:string}){return <label className="text-sm font-medium">{label}<input name={name} type={type} defaultValue={value??""} className="mt-2 w-full rounded-xl border px-4 py-3"/></label>}
