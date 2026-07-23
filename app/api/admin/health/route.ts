import { db } from "@/db"
import { sql } from "drizzle-orm"
import { redis } from "@/lib/redis"

export async function GET() {
  const dbCheck = await checkDB()
  const redisCheck = await checkRedis()

  const statusCode =
    dbCheck.status === "ok" && redisCheck.status === "ok" ? 200 : 503

  return Response.json(
    {
      status:
        dbCheck.status === "ok" && redisCheck.status === "ok" ? "ok" : "error",
      dependencies: {
        database: dbCheck,
        redis: redisCheck,
      },
      checkedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    {
      status: statusCode,
    }
  )
}

async function checkDB() {
  try {
    await db.execute(sql`SELECT 1`)
    return { status: "ok", message: "Database Connected" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error"
    return { status: "error", message: message }
  }
}

async function checkRedis() {
  try {
    await redis.ping()
    return { status: "ok", message: "Redis Connected" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error"
    return { status: "error", message }
  }
}
