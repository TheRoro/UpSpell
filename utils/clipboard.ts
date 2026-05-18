export async function copyText(text: string): Promise<boolean> {
  if (!import.meta.client) return false

  if (!window.isSecureContext || !navigator.clipboard?.writeText) {
    return fallbackCopy(text)
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return fallbackCopy(text)
  }
}

function fallbackCopy(text: string): boolean {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    textArea.remove()
  }
}
