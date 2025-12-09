// Verifies CAPTCHA tokens for public form submissions to block bots and spam.
// Temporarily soft-fails if no Turnstile secret or token is present (muted until configured).
export async function verifyCaptchaToken(token: string | null | undefined): Promise<void> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    // Mute verification when Turnstile is not configured or token is absent
    if (!secretKey || !token || token.trim().length === 0) {
        return;
    }

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: token,
            }),
        }
    );

    const verification = (await response.json()) as { success: boolean };

    if (!verification.success) {
        throw new Error("Captcha verification failed. Please retry.");
    }
}

