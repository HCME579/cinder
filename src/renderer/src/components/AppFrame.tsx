import { useState, type ReactNode } from 'react'
import {
  AppShell,
  Burger,
  Group,
  Text,
  ActionIcon,
  useMantineColorScheme,
  NavLink,
  Stack,
  Badge
} from '@mantine/core'
import { IconFlame, IconList, IconLogout, IconMoon, IconSun } from '@tabler/icons-react'
import { useNavigate, useLocation } from 'react-router-dom'

import { signOut } from '../lib/firebase'

interface AppFrameProps {
  children: ReactNode
}

export function AppFrame({ children }: AppFrameProps) {
  const [opened, setOpened] = useState(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const navigate = useNavigate()
  const location = useLocation()

  const breadcrumb =
    location.pathname === '/' ? 'items' : location.pathname.replace(/^\//, '')

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 220,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true }
      }}
      padding="md"
      styles={{
        main: { background: 'var(--mantine-color-body)' },
        header: { borderBottom: '1px solid var(--cinder-border, #3a322c)' },
        navbar: { borderRight: '1px solid var(--cinder-border, #3a322c)' }
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={() => setOpened((v) => !v)} size="sm" />
            <Text className="cinder-wordmark" size="lg">
              cinder
            </Text>
            <Text c="dimmed" size="sm" data-mono="true">
              / {breadcrumb}
            </Text>
          </Group>
          <Group gap="xs">
            <Badge color="amber" variant="light" radius="sm">
              {colorScheme === 'dark' ? 'dark' : 'light'}
            </Badge>
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Stack gap={2}>
          <NavLink
            label="Items"
            leftSection={<IconList size={16} />}
            active={location.pathname === '/'}
            onClick={() => navigate('/')}
          />
          <NavLink
            label="Sign out"
            leftSection={<IconLogout size={16} />}
            onClick={async () => {
              await signOut()
            }}
          />
        </Stack>
        <Group mt="auto" pt="md" gap="xs" align="center">
          <IconFlame size={14} color="var(--mantine-color-amber-5)" />
          <Text size="xs" c="dimmed" data-mono="true">
            v0.1.0
          </Text>
        </Group>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
