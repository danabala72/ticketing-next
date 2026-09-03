# Eventra Ticketing

Eventra is a multi-tenant event ticketing SaaS prototype. The first product slice focuses on Fun Run operations, but the data model and UI flows are designed for concerts, seminars, workshops, and other event types.

## What Is Included

- Public event marketplace with upcoming, ongoing, and past event states.
- Checkout flow with quota reservation, custom registration fields, voucher discount, and payment state machine.
- Tenant admin dashboard for event setup, ticket types, regular/special pricing, voucher rules, quota, registration fields, and material or race pack collection.
- Collection and check-in verification screen with registrant status handling.
- Superadmin view for tenant onboarding, global Midtrans fallback, roles, taxonomy, settlement, and audit needs.
- Prisma MySQL schema blueprint for production backend implementation.
- Dummy Fun Run seed-style content embedded in the UI.

## Suggested Production Stack

- Next.js app router
- Prisma ORM
- MySQL
- Midtrans Snap/Core API
- NextAuth/Auth.js or Clerk for authentication
- Background worker for quota expiry and payment reconciliation
- Object storage for QR assets, invoices, and exported attendee lists

## Payment Configuration Rule

Midtrans credentials should resolve in this order:

1. Event-level `midtransServerKey` and `midtransClientKey`
2. Tenant-level `midtransServerKey` and `midtransClientKey`
3. Global platform Midtrans config

## Core Roles

- `SUPERADMIN`: platform settings, tenants, taxonomy, audit visibility.
- `TENANT_OWNER`: tenant profile, keys, billing, and team members.
- `EVENT_MANAGER`: events, tickets, vouchers, fields, and quota rules.
- `FINANCE`: orders, payment attempts, settlements, and refunds.
- `CHECKIN_CREW`: registrant verification and collection sessions.
- `CUSTOMER`: browse events and buy tickets.

## Local Development

```bash
npm install
npm run dev
```

On Windows PowerShell, use this build command if inline environment variables are not recognized:

```powershell
$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'; npx vinext build
```

## Database Model

See `prisma/schema.prisma` for the MySQL schema covering tenants, users, roles, event types, events, ticket types, custom fields, vouchers, orders, quota reservations, payment attempts, registrants, collection sessions, and check-ins.
