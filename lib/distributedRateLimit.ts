import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redisUrl = process.env.KV_REST_API_URL
const redisToken = process.env.KV_REST_API_TOKEN

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null

const limiters = redis
  ? {
      general: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'dse:rl:general' }),
      auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '10 m'), prefix: 'dse:rl:auth' }),
      report: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '10 m'), prefix: 'dse:rl:report' }),
      count: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(120, '10 m'), prefix: 'dse:rl:count' }),
    }
  : null

export type RateLimitBucket = keyof NonNullable<typeof limiters>

export async function allowDistributed(key: string, bucket: RateLimitBucket): Promise<boolean> {
  if (!limiters) return true
  try {
    const result = await limiters[bucket].limit(key)
    return result.success
  } catch {
    // Fail open if Redis is temporarily unavailable; the request still has body
    // limits and authentication/authorization checks at the route boundary.
    return true
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 128) || 'unknown'
  return request.headers.get('x-real-ip')?.trim().slice(0, 128) || 'unknown'
}

export function hasDistributedRateLimit(): boolean {
  return limiters !== null
}
