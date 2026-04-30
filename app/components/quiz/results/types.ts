export type SearchParams = {
  q?: string
  category?: string | string[]
  outlook?: string | string[]
  minScore?: string
  tab?: string
}

export function toArray(val: string | string[] | undefined): string[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

export function getGuestSessionId(): string {
  const key = 'guestSessionId'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}
