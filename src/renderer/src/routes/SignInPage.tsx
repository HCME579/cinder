import { Anchor, Box, Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconBrandGoogle, IconFlame, IconMail } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../lib/firebase'

export function SignInPage() {
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const navigate = useNavigate()

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Enter a valid email'),
      password: (v) => (v.length >= 6 ? null : 'Password must be ≥ 6 chars')
    }
  })

  const handleEmail = async (values: { email: string; password: string }) => {
    setBusy(true)
    try {
      if (mode === 'signin') {
        await signInWithEmail(values.email, values.password)
      } else {
        await signUpWithEmail(values.email, values.password)
      }
      notifications.show({ color: 'amber', message: 'Signed in', title: 'Welcome' })
      navigate('/')
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Sign-in failed',
        message: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setBusy(true)
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Google sign-in failed',
        message: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        background: 'var(--cinder-bg, #0d0907)'
      }}
    >
      {/* Left brand panel — warm dark */}
      <Box
        visibleFrom="sm"
        style={{
          position: 'relative',
          background:
            'radial-gradient(120% 80% at 0% 0%, rgba(245,159,0,0.18), transparent 60%), linear-gradient(160deg, #171210 0%, #0d0907 70%)',
          borderRight: '1px solid #3a322c',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Group gap="xs">
          <IconFlame size={28} color="var(--mantine-color-amber-5)" />
          <Text className="cinder-wordmark" size="xl">
            cinder
          </Text>
        </Group>
        <Stack gap="md">
          <Title order={1} className="cinder-heading" c="amber.5">
            warm-dark desktop starter
          </Title>
          <Text c="dimmed" maw={420}>
            A dense, power-user friendly Electron + React + Mantine scaffold. Monospace headings,
            amber accents, sort-able tables, and a clean AppShell to grow into.
          </Text>
        </Stack>
        <Text c="dimmed" size="xs" data-mono="true">
          © {new Date().getFullYear()} HCME579 · MIT
        </Text>
      </Box>

      {/* Right form panel */}
      <Box p="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper p="xl" radius="md" maw={420} w="100%" className="cinder-amber-glow">
          <Stack gap="md">
            <Title order={2} className="cinder-heading">
              {mode === 'signin' ? 'Sign in' : 'Create an account'}
            </Title>
            <Text c="dimmed" size="sm">
              Use Google or your email and password.
            </Text>

            <Button
              variant="default"
              leftSection={<IconBrandGoogle size={16} />}
              onClick={handleGoogle}
              loading={busy}
            >
              Continue with Google
            </Button>

            <Text c="dimmed" size="xs" ta="center" data-mono="true">
              — or —
            </Text>

            <form onSubmit={form.onSubmit(handleEmail)}>
              <Stack gap="sm">
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  leftSection={<IconMail size={14} />}
                  {...form.getInputProps('email')}
                />
                <TextInput
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  {...form.getInputProps('password')}
                />
                <Button type="submit" color="amber" loading={busy} fullWidth>
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </Button>
              </Stack>
            </form>

            <Text c="dimmed" size="xs" ta="center">
              {mode === 'signin' ? 'No account?' : 'Already have one?'}{' '}
              <Anchor
                size="xs"
                onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
