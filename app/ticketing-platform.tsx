"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

type EventStatus = "Upcoming" | "Ongoing" | "Past";
type EventType = "Fun Run" | "Concert" | "Seminar" | "Workshop";
type OrderState =
  | "Draft"
  | "Reserved"
  | "Awaiting Payment"
  | "Paid"
  | "Expired"
  | "Refunded"
  | "Checked In";

type Ticket = {
  name: string;
  price: number;
  specialPrice?: number;
  quota: number;
  sold: number;
  reserved: number;
};

type EventRecord = {
  title: string;
  tenant: string;
  status: EventStatus;
  type: EventType;
  date: string;
  city: string;
  collection: string;
  gateway: string;
  color: string;
  tickets: Ticket[];
  vouchers: string[];
  fields: string[];
};

const events: EventRecord[] = [
  {
    title: "Jakarta Sunrise Fun Run",
    tenant: "Nusantara Runners",
    status: "Upcoming",
    type: "Fun Run",
    date: "12 Oct 2026",
    city: "Gelora Bung Karno",
    collection: "Race pack collection enabled",
    gateway: "Event Midtrans keys",
    color: "#19a974",
    tickets: [
      { name: "5K Early Bird", price: 185000, specialPrice: 150000, quota: 400, sold: 276, reserved: 24 },
      { name: "10K Regular", price: 265000, quota: 300, sold: 198, reserved: 18 },
      { name: "Family Pack", price: 640000, specialPrice: 590000, quota: 100, sold: 72, reserved: 7 },
    ],
    vouchers: ["RUN50: Rp50k off, max 120 uses", "TEAM10: 10% off min 4 tickets"],
    fields: ["Full name", "Email", "Phone", "Emergency contact", "Jersey size", "Blood type"],
  },
  {
    title: "Bali Coastal Night Run",
    tenant: "Island Motion",
    status: "Ongoing",
    type: "Fun Run",
    date: "03 Sep 2026",
    city: "Sanur Beach",
    collection: "Bib pickup plus wristband verification",
    gateway: "Tenant Midtrans keys",
    color: "#ff6b35",
    tickets: [
      { name: "3K Sunset", price: 165000, quota: 220, sold: 210, reserved: 6 },
      { name: "7K Night", price: 225000, specialPrice: 199000, quota: 260, sold: 241, reserved: 9 },
    ],
    vouchers: ["BALI15: 15% off for community partners"],
    fields: ["Full name", "Email", "Phone", "ID number", "Community name"],
  },
  {
    title: "Creator Commerce Workshop",
    tenant: "ScaleLab ID",
    status: "Upcoming",
    type: "Workshop",
    date: "21 Nov 2026",
    city: "Bandung Creative Hub",
    collection: "Material kit collection optional",
    gateway: "Global Midtrans fallback",
    color: "#4263eb",
    tickets: [
      { name: "General Seat", price: 325000, quota: 180, sold: 86, reserved: 8 },
      { name: "Mentor Table", price: 950000, specialPrice: 850000, quota: 24, sold: 17, reserved: 2 },
    ],
    vouchers: ["EARLYCREATOR: Rp75k off before launch week"],
    fields: ["Full name", "Email", "Phone", "Company", "Business stage"],
  },
  {
    title: "Surabaya Green Run 2026",
    tenant: "EcoMiles",
    status: "Past",
    type: "Fun Run",
    date: "18 Aug 2026",
    city: "Taman Bungkul",
    collection: "Closed, all checked-in packets archived",
    gateway: "Event Midtrans keys",
    color: "#0f766e",
    tickets: [
      { name: "5K Regular", price: 175000, quota: 500, sold: 493, reserved: 0 },
      { name: "10K Regular", price: 245000, quota: 350, sold: 337, reserved: 0 },
    ],
    vouchers: ["GREENRUN: closed campaign"],
    fields: ["Full name", "Email", "Phone", "Jersey size"],
  },
];

const modelGroups = [
  "Tenant, TenantMember, User, Role, Permission",
  "Event, EventType, EventPaymentConfig, RegistrationField",
  "TicketType, PriceRule, Voucher, VoucherRedemption",
  "Order, OrderItem, QuotaReservation, PaymentAttempt",
  "Registrant, CollectionSession, CheckInRecord, AuditLog",
];

const states: OrderState[] = [
  "Draft",
  "Reserved",
  "Awaiting Payment",
  "Paid",
  "Expired",
  "Refunded",
  "Checked In",
];

function money(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function TicketingPlatform() {
  const [section, setSection] = useState("Public");
  const [selected, setSelected] = useState(0);
  const [voucher, setVoucher] = useState("RUN50");
  const [ticketQty, setTicketQty] = useState(2);
  const active = events[selected];

  const totals = useMemo(() => {
    const allTickets = events.flatMap((event) => event.tickets);
    const sold = allTickets.reduce((sum, ticket) => sum + ticket.sold, 0);
    const reserved = allTickets.reduce((sum, ticket) => sum + ticket.reserved, 0);
    const revenue = allTickets.reduce(
      (sum, ticket) => sum + ticket.sold * (ticket.specialPrice ?? ticket.price),
      0,
    );
    return { sold, reserved, revenue };
  }, []);

  const checkoutTicket = active.tickets[0];
  const subtotal = ticketQty * (checkoutTicket.specialPrice ?? checkoutTicket.price);
  const discount = voucher.toUpperCase() === "RUN50" ? Math.min(50000, subtotal) : 0;
  const payable = subtotal - discount;

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-[#161914]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#fffffb]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a className="flex items-center gap-3" href="#top" aria-label="RunGate home">
            <span className="grid h-10 w-10 place-items-center rounded bg-[#161914] text-sm font-black text-white">
              RG
            </span>
            <span>
              <span className="block text-lg font-black">RunGate</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7164]">
                Tenant Ticketing SaaS
              </span>
            </span>
          </a>
          <nav className="flex flex-wrap gap-2" aria-label="Primary">
            {["Public", "Checkout", "Tenant Admin", "Superadmin", "Architecture"].map((item) => (
              <button
                key={item}
                className={`nav-pill ${section === item ? "nav-pill-active" : ""}`}
                onClick={() => setSection(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section id="top" className="hero-band">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="badge bg-[#d8f3dc] text-[#176a3a]">Multi-tenant</span>
              <span className="badge bg-[#ffe8cc] text-[#9a4d00]">Midtrans per event</span>
              <span className="badge bg-[#dde7ff] text-[#1f3f93]">General event flow</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] sm:text-6xl">
              Ticketing platform untuk Fun Run hari ini, event apa pun besok.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f5749]">
              Tenant bisa daftar, membuat event, mengatur tiket, voucher, diskon, quota,
              field registrasi, payment gateway, dan collection/check-in dari satu dashboard.
            </p>
            <div className="mt-7 grid max-w-2xl grid-cols-3 gap-3">
              <Metric label="Ticket sold" value={totals.sold.toLocaleString("id-ID")} />
              <Metric label="Reserved" value={totals.reserved.toString()} />
              <Metric label="Revenue" value={money(totals.revenue)} compact />
            </div>
          </div>
          <div className="race-panel" aria-label="Fun run ticketing overview">
            <div className="race-track">
              <div className="lane lane-one" />
              <div className="lane lane-two" />
              <div className="runner-dot runner-one">5K</div>
              <div className="runner-dot runner-two">10K</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FlowCard title="Reserve quota" text="15 menit hold sebelum payment expired." />
              <FlowCard title="Verify" text="QR lookup, ID match, packet handed over." />
              <FlowCard title="Voucher engine" text="Kode, periode, minimum qty, tenant/event scope." />
              <FlowCard title="Gateway fallback" text="Event key, tenant key, lalu global key." />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {section === "Public" && (
          <PublicEvents selected={selected} setSelected={setSelected} active={active} />
        )}
        {section === "Checkout" && (
          <Checkout
            active={active}
            ticketQty={ticketQty}
            setTicketQty={setTicketQty}
            voucher={voucher}
            setVoucher={setVoucher}
            subtotal={subtotal}
            discount={discount}
            payable={payable}
          />
        )}
        {section === "Tenant Admin" && <TenantAdmin active={active} totals={totals} />}
        {section === "Superadmin" && <Superadmin />}
        {section === "Architecture" && <Architecture />}
      </section>
    </main>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong className={compact ? "text-xl sm:text-2xl" : ""}>{value}</strong>
    </div>
  );
}

function FlowCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="flow-card">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function PublicEvents({
  selected,
  setSelected,
  active,
}: {
  selected: number;
  setSelected: (index: number) => void;
  active: EventRecord;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
      <div>
        <div className="section-heading">
          <span>Event discovery</span>
          <h2>Upcoming, ongoing, dan past events</h2>
        </div>
        <div className="grid gap-3">
          {events.map((event, index) => (
            <button
              className={`event-row ${selected === index ? "event-row-active" : ""}`}
              key={event.title}
              onClick={() => setSelected(index)}
            >
              <span className="status-dot" style={{ backgroundColor: event.color }} />
              <span className="min-w-0 text-left">
                <strong>{event.title}</strong>
                <span>{event.tenant} - {event.city}</span>
              </span>
              <span className={`status ${event.status.toLowerCase()}`}>{event.status}</span>
            </button>
          ))}
        </div>
      </div>
      <EventDetail active={active} />
    </div>
  );
}

function EventDetail({ active }: { active: EventRecord }) {
  return (
    <article className="detail-panel">
      <div className="event-visual" style={{ "--event-color": active.color } as CSSProperties}>
        <span>{active.type}</span>
        <strong>{active.date}</strong>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{active.tenant}</p>
            <h2 className="text-3xl font-black">{active.title}</h2>
            <p className="mt-2 text-[#56604f]">{active.city} - {active.collection}</p>
          </div>
          <span className="badge bg-[#f0f1e8] text-[#33382f]">{active.gateway}</span>
        </div>
        <div className="mt-6 grid gap-3">
          {active.tickets.map((ticket) => (
            <div className="ticket-line" key={ticket.name}>
              <div>
                <strong>{ticket.name}</strong>
                <span>
                  {ticket.sold} sold, {ticket.reserved} reserved, {ticket.quota - ticket.sold - ticket.reserved} left
                </span>
              </div>
              <div className="text-right">
                {ticket.specialPrice && <span className="line-through">{money(ticket.price)}</span>}
                <strong>{money(ticket.specialPrice ?? ticket.price)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function Checkout({
  active,
  ticketQty,
  setTicketQty,
  voucher,
  setVoucher,
  subtotal,
  discount,
  payable,
}: {
  active: EventRecord;
  ticketQty: number;
  setTicketQty: (qty: number) => void;
  voucher: string;
  setVoucher: (value: string) => void;
  subtotal: number;
  discount: number;
  payable: number;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr]">
      <div className="panel">
        <div className="section-heading">
          <span>Checkout</span>
          <h2>Reservation, registrasi, voucher, payment</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">
            Event
            <input value={active.title} readOnly />
          </label>
          <label className="field">
            Ticket
            <input value={active.tickets[0].name} readOnly />
          </label>
          <label className="field">
            Quantity
            <input
              type="number"
              min="1"
              max="8"
              value={ticketQty}
              onChange={(event) => setTicketQty(Math.max(1, Number(event.target.value)))}
            />
          </label>
          <label className="field">
            Voucher
            <input value={voucher} onChange={(event) => setVoucher(event.target.value)} />
          </label>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {active.fields.slice(0, 6).map((field) => (
            <label className="field compact-field" key={field}>
              {field}
              <input placeholder={field === "Email" ? "runner@mail.com" : field} />
            </label>
          ))}
        </div>
      </div>
      <aside className="panel">
        <h3 className="text-xl font-black">Order state machine</h3>
        <div className="mt-4 grid gap-2">
          {states.map((state, index) => (
            <div className={`state-row ${index > 3 ? "muted" : ""}`} key={state}>
              <span>{index + 1}</span>
              <strong>{state}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded border border-black/10 bg-white p-4">
          <Line label="Subtotal" value={money(subtotal)} />
          <Line label="Voucher discount" value={`-${money(discount)}`} />
          <Line label="Payable" value={money(payable)} strong />
          <p className="mt-4 text-sm leading-6 text-[#56604f]">
            Payment config resolves from event keys first, tenant keys second, then global Midtrans fallback.
          </p>
        </div>
      </aside>
    </div>
  );
}

function TenantAdmin({ active, totals }: { active: EventRecord; totals: { sold: number; reserved: number; revenue: number } }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <aside className="panel">
        <div className="section-heading">
          <span>Tenant workspace</span>
          <h2>{active.tenant}</h2>
        </div>
        <div className="grid gap-3">
          <Metric label="Sold tickets" value={totals.sold.toLocaleString("id-ID")} />
          <Metric label="Reserved quota" value={totals.reserved.toString()} />
          <Metric label="Gross sales" value={money(totals.revenue)} compact />
        </div>
      </aside>
      <div className="grid gap-6">
        <div className="panel">
          <h3 className="mb-4 text-xl font-black">Event setup</h3>
          <div className="admin-grid">
            {["Event type", "Ticket types", "Regular price", "Special price", "Voucher rules", "Registration fields", "Quota policy", "Material collection"].map((item) => (
              <div className="admin-tile" key={item}>
                <span>{item}</span>
                <strong>Configurable</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3 className="mb-4 text-xl font-black">Collection and check-in</h3>
          <div className="checkin-grid">
            {[
              ["RG-2401", "Alya Putri", "Paid", "Packet ready"],
              ["RG-2402", "Bima Satria", "Paid", "Verified"],
              ["RG-2403", "Clara Wijaya", "Awaiting Payment", "Blocked"],
              ["RG-2404", "Dimas Aruna", "Paid", "Checked In"],
            ].map((row) => (
              <div className="checkin-row" key={row[0]}>
                <strong>{row[0]}</strong>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <button>{row[3]}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Superadmin() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="panel lg:col-span-2">
        <div className="section-heading">
          <span>Global admin</span>
          <h2>Tenant onboarding, roles, and platform payment defaults</h2>
        </div>
        <div className="admin-grid">
          {[
            ["Tenant approval", "KYC, billing plan, domain/subdomain"],
            ["Roles", "Superadmin, tenant owner, event manager, finance, gate crew"],
            ["Midtrans global", "Server key and client key fallback"],
            ["Audit log", "Voucher, price, payment, check-in changes"],
            ["Event taxonomy", "Fun run, concert, seminar, workshop"],
            ["Settlement", "Gateway source and payout reporting"],
          ].map(([title, text]) => (
            <div className="admin-tile" key={title}>
              <span>{title}</span>
              <strong>{text}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3 className="text-xl font-black">Tenant registry</h3>
        <div className="mt-4 grid gap-3">
          {["Nusantara Runners", "Island Motion", "ScaleLab ID", "EcoMiles"].map((tenant, index) => (
            <div className="tenant-row" key={tenant}>
              <span>{tenant}</span>
              <strong>{index === 2 ? "Review" : "Active"}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Architecture() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="panel">
        <div className="section-heading">
          <span>Backend blueprint</span>
          <h2>Next.js + Prisma + MySQL production model</h2>
        </div>
        <div className="grid gap-3">
          {modelGroups.map((group) => (
            <div className="model-row" key={group}>{group}</div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3 className="text-xl font-black">Critical rules</h3>
        <div className="mt-4 grid gap-3">
          {[
            "Tenant isolation by tenantId on every mutable record.",
            "QuotaReservation expires automatically when payment does not settle.",
            "Voucher rules support fixed, percentage, date window, ticket scope, quota, and min quantity.",
            "Midtrans keys resolve event, tenant, then global config.",
            "Check-in requires paid order, unique registrant QR, and audit entry.",
          ].map((rule) => (
            <div className="rule-row" key={rule}>{rule}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`line ${strong ? "line-strong" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
