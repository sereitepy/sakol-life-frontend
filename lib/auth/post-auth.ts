'use client'

// Called client-side right after auth succeeds.
// Reads quiz answers from sessionStorage and merges them into the user's account.

const BACKEND_URL = process.env.BACKEND_URL

// Builds the flat { Q1: "A", Q2: 4, ... } body from sessionStorage
function getGuestAnswers(): Record<string, string | number> | null {
  const raw = localStorage.getItem('quizAnswers')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Initializes a user profile (called once on first signup)
async function initProfile(accessToken: string, displayName: string) {
  await fetch(`${BACKEND_URL}/api/v1/profile/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ displayName }),
  })
}

// Merges guest quiz answers into the authenticated user's account
async function mergeGuestAttempt(
  accessToken: string,
  answers: Record<string, string | number>
) {
  await fetch(`${BACKEND_URL}/api/v1/quiz/merge-guest-attempt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(answers),
  })
}

// ── Main export ───────────────────────────────────────────────────────────────
// Call this right after a successful sign-in or sign-up on the client side.
// accessToken  : Supabase JWT
// displayName  : only passed on sign-up (triggers profile/init)
export async function handlePostAuth({
  accessToken,
  displayName,
}: {
  accessToken: string
  displayName?: string
}) {
  try {
    // 1. Init profile on signup (fire-and-forget, non-blocking to UX)
    if (displayName) {
      await initProfile(accessToken, displayName)
    }

    // 2. Merge quiz answers if they exist in sessionStorage
    const answers = getGuestAnswers()
    if (answers) {
      await mergeGuestAttempt(accessToken, answers)
      // Clean up — answers are now saved server-side
      localStorage.removeItem('quizAnswers')
    }
  } catch (err) {
    // Non-fatal — log but don't block the user
    console.error('[handlePostAuth] failed:', err)
  }
}
