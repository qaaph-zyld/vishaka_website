import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const status = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: "unknown",
        responseTime: 0,
      },
      // Add more services here as needed
    },
  };

  try {
    // Check database connection
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbEnd = Date.now();
    
    status.services.database = {
      status: "connected",
      responseTime: dbEnd - dbStart,
    };
  } catch (error) {
    console.error("Database health check failed:", error);
    status.status = "degraded";
    status.services.database = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // Determine overall status based on service statuses
  const allServicesHealthy = Object.values(status.services).every(
    (service) => service.status === "connected"
  );
  
  if (!allServicesHealthy) {
    status.status = "degraded";
  }

  return new NextResponse(JSON.stringify(status, null, 2), {
    status: allServicesHealthy ? 200 : 503,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

export const dynamic = "force-dynamic";