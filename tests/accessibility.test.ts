import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function component(name: string) {
  return readFileSync(new URL(`../components/${name}`, import.meta.url), 'utf8')
}

function page(path: string) {
  return readFileSync(new URL(`../pages/${path}`, import.meta.url), 'utf8')
}

describe('interactive cards', () => {
  it('keeps instant character copy available to keyboards and assistive technology', () => {
    const source = component('CharCard.vue')
    expect(source).toContain('<button')
    expect(source).toContain('type="button"')
    expect(source).toContain(':aria-label=')
    expect(source).toContain('.character-card:focus-visible')
  })

  it('uses a real link for language navigation', () => {
    const source = page('reference/index.vue')
    expect(source).toContain('<NuxtLink')
    expect(source).toContain(':to="language.route"')
    expect(source).toContain(':aria-label=')
  })

  it('does not register a leaking global keyboard listener', () => {
    expect(component('LanguageDetails.vue')).not.toContain(
      "window.addEventListener('keydown'",
    )
  })

  it('uses persistent semantic navigation for primary destinations', () => {
    const source = component('AtlasBottomNavigation.vue')
    expect(source).toContain('<nav')
    expect(source).toContain('aria-label="Primary navigation"')
    expect(source).toContain('<NuxtLink')
    expect(source).toContain(':aria-current=')
  })
})
