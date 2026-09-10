"use server";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEMO_TENANT_ID } from "@/lib/constants";
import { encryptSecret } from "@/lib/crypto";

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export async function createEvent(data: FormData) {
  const name = text(data, "name");
  const slug = text(data, "slug").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  if (!name || !slug) throw new Error("Nama dan slug wajib diisi.");
  const type = text(data, "type") as "FUN_RUN" | "SEMINAR" | "WEBINAR";
  const preset = type === "FUN_RUN"
    ? [["full_name","Nama lengkap","TEXT",true],["email","Email","EMAIL",true],["phone","Nomor telepon","PHONE",true],["emergency_contact","Kontak darurat","PHONE",true],["jersey_size","Ukuran jersey","SELECT",true]]
    : [["full_name","Nama lengkap","TEXT",true],["email","Email","EMAIL",true],["institution","Institusi","TEXT",false],["job_title","Jabatan","TEXT",false]];
  await prisma.event.create({ data: {
    tenantId: DEMO_TENANT_ID, name, slug, type, startsAt: new Date(text(data, "startsAt")),
    venue: text(data, "venue"), status: "DRAFT", requiresOnSiteVerification: type === "FUN_RUN",
    requiresRacePack: type === "FUN_RUN",
    formFields: { create: preset.map(([key,label,fieldType,required],i) => ({ key:String(key), label:String(label), type:fieldType as never, required:Boolean(required), sortOrder:i })) },
  }});
  revalidatePath("/events");
  redirect("/events");
}

export async function registerParticipant(data: FormData) {
  const eventId=text(data,"eventId"), ticketTypeId=text(data,"ticketTypeId");
  const fullName=text(data,"fullName"), email=text(data,"email"), phone=text(data,"phone");
  if (!eventId || !ticketTypeId || !fullName || !email) throw new Error("Data wajib belum lengkap.");
  const ticket = await prisma.ticketType.findFirstOrThrow({ where:{id:ticketTypeId,eventId,active:true} });
  const sold = await prisma.registration.count({ where:{ticketTypeId,status:{not:"REJECTED"}} });
  if (sold >= ticket.quota) throw new Error("Kuota tiket sudah habis.");
  const code = "EVT-" + Date.now().toString(36).toUpperCase();
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const order = await tx.order.create({ data:{code,tenantId:DEMO_TENANT_ID,eventId,buyerName:fullName,buyerEmail:email,amount:ticket.price,status:ticket.price.equals(0)?"PAID":"PENDING",items:{create:{ticketTypeId,quantity:1,unitPrice:ticket.price}}} });
    await tx.registration.create({ data:{code:code+"-1",eventId,orderId:order.id,ticketTypeId,fullName,email,phone,formData:Object.fromEntries(data.entries()),qrToken:randomUUID(),status:ticket.price.equals(0)?"PAID":"REGISTERED"} });
  });
  redirect("/registration/success?code="+code);
}

export async function updateRegistrationStatus(data: FormData) {
  const id=text(data,"id");
  const status=text(data,"status") as "VERIFIED_ON_SITE"|"RACE_PACK_COLLECTED"|"CHECKED_IN"|"ISSUE";
  const current=await prisma.registration.findUniqueOrThrow({where:{id}});
  const now=new Date();
  await prisma.$transaction([
    prisma.registration.update({where:{id},data:{status,verifiedAt:status==="VERIFIED_ON_SITE"?now:current.verifiedAt,racePackCollectedAt:status==="RACE_PACK_COLLECTED"?now:current.racePackCollectedAt,checkedInAt:status==="CHECKED_IN"?now:current.checkedInAt}}),
    prisma.verificationLog.create({data:{registrationId:id,staffUserId:"system-demo",fromStatus:current.status,toStatus:status}}),
  ]);
  revalidatePath("/on-site");
}

export async function savePaymentConfig(data: FormData) {
  const values={merchantId:text(data,"merchantId"),clientKey:text(data,"clientKey"),encryptedServerKey:encryptSecret(text(data,"serverKey")),production:data.get("production")==="on"};
  await prisma.paymentConfig.upsert({where:{tenantId:DEMO_TENANT_ID},update:values,create:{tenantId:DEMO_TENANT_ID,...values}});
  revalidatePath("/settings/payments");
}

export async function addTicketType(data: FormData) {
  const eventId=text(data,"eventId");
  await prisma.ticketType.create({data:{eventId,name:text(data,"name"),price:Number(text(data,"price")),quota:Number(text(data,"quota")),active:true}});
  revalidatePath("/events/"+eventId+"/manage");
}
export async function addFormField(data: FormData) {
  const eventId=text(data,"eventId");
  await prisma.eventFormField.create({data:{eventId,key:text(data,"key"),label:text(data,"label"),type:text(data,"type") as never,required:data.get("required")==="on",sortOrder:Number(text(data,"sortOrder")||0)}});
  revalidatePath("/events/"+eventId+"/manage");
}
export async function addConsent(data: FormData) {
  const eventId=text(data,"eventId");
  await prisma.consentTerm.create({data:{eventId,title:text(data,"title"),body:text(data,"body"),required:data.get("required")==="on"}});
  revalidatePath("/events/"+eventId+"/manage");
}
export async function addVoucher(data: FormData) {
  const eventId=text(data,"eventId");
  await prisma.voucher.create({data:{tenantId:DEMO_TENANT_ID,eventId,code:text(data,"code").toUpperCase(),percentage:Number(text(data,"percentage")),maxUses:Number(text(data,"maxUses")),active:true}});
  revalidatePath("/events/"+eventId+"/manage");
}
export async function assignEventAdmin(data: FormData) {
  const eventId=text(data,"eventId"),email=text(data,"email").toLowerCase();
  const user=await prisma.user.upsert({where:{email},update:{},create:{email,name:text(data,"name")||email,passwordHash:"INVITED",platformRole:"USER"}});
  await prisma.eventMember.upsert({where:{eventId_userId:{eventId,userId:user.id}},update:{role:text(data,"role") as never},create:{eventId,userId:user.id,role:text(data,"role") as never}});
  revalidatePath("/events/"+eventId+"/manage");
}
export async function publishEvent(data: FormData) {
  const id=text(data,"eventId");
  await prisma.event.update({where:{id},data:{status:"PUBLISHED"}});
  revalidatePath("/events");
  revalidatePath("/events/"+id+"/manage");
}
