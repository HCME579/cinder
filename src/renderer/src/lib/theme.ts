import { createTheme, type MantineColorsTuple, type MantineThemeOverride } from '@mantine/core'

/**
 * Warm amber 10-stop scale for the Cinder primary accent.
 * Index 5 is the dark-mode default shade; index 6 is the light-mode default.
 */
const amber: MantineColorsTuple = [
  '#fff4e1',
  '#ffe8c2',
  '#ffd087',
  '#ffb84a',
  '#ffa51c',
  '#ff9900',
  '#ff8800',
  '#e07400',
  '#c46400',
  '#a85300'
]

/**
 * Cinder theme — Mantine v7+, default dark, with a warm amber/orange accent.
 * Dense, power-user, monospace headings + numbers.
 */
export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'amber',
  primaryShade: { light: 6, dark: 5 },
  defaultRadius: 'sm',
  cursorType: 'pointer',
  fontFamily:
    "'Inter Variable', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyMonospace:
    "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  headings: {
    fontFamily:
      "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2rem', lineHeight: '1.2' },
      h2: { fontSize: '1.5rem', lineHeight: '1.25' },
      h3: { fontSize: '1.25rem', lineHeight: '1.3' },
      h4: { fontSize: '1.05rem', lineHeight: '1.35' }
    }
  },
  colors: {
    amber,
    // Warm dark surface scale — slightly desaturated amber/coal.
    // Used as the dark "coal" backdrop (e.g. surfaces, hover bg).
    coal: [
      '#f4f1ee',
      '#e6e1dc',
      '#c9c1ba',
      '#a89e94',
      '#7f756b',
      '#5a5048',
      '#3a322c',
      '#241d18',
      '#171210',
      '#0d0907'
    ]
  },
  other: {
    cinder: {
      bg: '#0d0907',
      panel: '#171210',
      panelHover: '#241d18',
      border: '#3a322c',
      amber: '#f59f00',
      amberHi: '#ff922b',
      amberHot: '#ff6b35'
    }
  }
})
