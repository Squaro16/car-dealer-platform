// Provides a minimal in-memory rate limiter for public actions to reduce abuse.
// Provides a minimal in-memory rate limiter for public actions.
const globalRateLimitStore = globalThis as unknown as {
    __rateLimitBuckets?: Map<string, number[]>;
};

const buckets =
    globalRateLimitStore.__rateLimitBuckets ??
    (globalRateLimitStore.__rateLimitBuckets = new Map<string, number[]>());

export function enforceRateLimit(
    key: string,
    windowMs: number = 60_000,
    maxRequests: number = 5
): void {
    const now = Date.now();
    const windowStart = now - windowMs;

    const recentRequests = (buckets.get(key) ?? []).filter(
        (timestamp) => timestamp > windowStart
    );

    if (recentRequests.length >= maxRequests) {
        throw new Error("Too many requests. Please try again shortly.");
    }

    recentRequests.push(now);
    buckets.set(key, recentRequests);
}

