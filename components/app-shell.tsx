import Link from "next/link";
import { CalendarDays, CreditCard, LayoutDashboard, QrCode, Settings, TicketCheck, Users } from "lucide-react";

const items = [
  ["/", "Ringkasan", LayoutDashboard], ["/events", "Event", CalendarDays], ["/registrations", "Pendaftaran", Users],
  ["/on-site", "Registrasi on-site", QrCode], ["/settings/payments", "Pembayaran", CreditCard], ["/superadmin", "Superadmin", Settings],
] as const;

export function AppShell({ children, title, action }: { children: React.ReactNode; title: string; action?: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-950">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-slate-950 px-4 py-6 text-white lg:block">
      <Link href="/" className="flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-xl bg-indigo-500"><TicketCheck size={21}/></span><span><strong className="block text-lg">Eventra</strong><small className="text-slate-400">Ticketing workspace</small></span></Link>
      <nav className="mt-9 space-y-1">{items.map(([href,label,Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><Icon size={18}/>{label}</Link>)}</nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-sm font-medium">Aurora Events</p><p className="mt-1 text-xs text-slate-400">Tenant workspace</p></div>
    </aside>
    <main className="lg:pl-64">
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7"><div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Aurora Events</p><h1 className="text-lg font-semibold">{title}</h1></div>{action}</header>
      <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">{items.slice(0,5).map(([href,label,Icon]) => <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"><Icon size={16}/>{label}</Link>)}</nav>
      <div className="p-4 sm:p-7">{children}</div>
    </main>
  </div>;
}
