import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
const tenantId = "tenant_demo";
await prisma.tenant.upsert({where:{id:tenantId},update:{},create:{id:tenantId,name:"Aurora Events",slug:"aurora-events",active:true}});
const event=await prisma.event.upsert({where:{slug:"bali-sunrise-fun-run-2026"},update:{},create:{tenantId,name:"Bali Sunrise Fun Run 2026",slug:"bali-sunrise-fun-run-2026",type:"FUN_RUN",status:"PUBLISHED",startsAt:new Date("2026-10-17T22:00:00Z"),venue:"Lapangan Puputan, Denpasar",capacity:1200,requiresOnSiteVerification:true,requiresRacePack:true}});
if(await prisma.ticketType.count({where:{eventId:event.id}})===0) await prisma.ticketType.createMany({data:[{eventId:event.id,name:"5K Fun Run",price:new Prisma.Decimal(175000),quota:700},{eventId:event.id,name:"10K Challenge",price:new Prisma.Decimal(225000),quota:500}]});
await prisma.$disconnect();
