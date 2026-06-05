import { describe, expect, it } from 'vitest'
import { formatTimestamp, isValidItemName, slugify } from '../../src/renderer/src/lib/format'

describe('format utils', () => {
  it('slugifies simple input', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })

  it('slugifies unicode + special chars', () => {
    expect(slugify('  Café -- Résumé  ')).toBe('cafe-resume')
  })

  it('truncates long slugs to 80 chars', () => {
    const long = 'a'.repeat(200)
    expect(slugify(long).length).toBe(80)
  })

  it('formats a positive timestamp', () => {
    const out = formatTimestamp(0)
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(0)
  })

  it('returns placeholder for invalid timestamps', () => {
    expect(formatTimestamp(NaN)).toBe('—')
    expect(formatTimestamp(-1)).toBe('—')
  })

  it('validates item names', () => {
    expect(isValidItemName('ok')).toBe(true)
    expect(isValidItemName('  ok  ')).toBe(true)
    expect(isValidItemName('a')).toBe(false)
    expect(isValidItemName('x'.repeat(81))).toBe(false)
  })
})
