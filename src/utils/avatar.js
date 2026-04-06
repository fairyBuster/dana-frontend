import { ref } from 'vue'

const STORAGE_KEY = 'otsent:avatar'

export const avatarOptions = [
  '/assets/image/av1.png',
  '/assets/image/av2.png',
  '/assets/image/av3.png',
  '/assets/image/av4.png',
  '/assets/image/av5.png',
  '/assets/image/av6.png'
]

export const avatarSrc = ref('/assets/image/av1.png')

const normalizeAvatar = (value) => {
  const v = String(value || '').trim()
  return avatarOptions.includes(v) ? v : '/assets/image/av1.png'
}

const readStoredAvatar = () => {
  try {
    return normalizeAvatar(localStorage.getItem(STORAGE_KEY))
  } catch (_) {
    return '/assets/image/av1.png'
  }
}

export const setAvatar = (nextAvatar) => {
  const normalized = normalizeAvatar(nextAvatar)
  avatarSrc.value = normalized
  try {
    localStorage.setItem(STORAGE_KEY, normalized)
  } catch (_) {}
}

avatarSrc.value = readStoredAvatar()

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e?.key !== STORAGE_KEY) return
    avatarSrc.value = readStoredAvatar()
  })
}

