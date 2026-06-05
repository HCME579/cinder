import { Button, Text, Stack } from '@mantine/core'
import { IconFlame, IconPlus } from '@tabler/icons-react'

interface EmptyStateProps {
  onCreate: () => void
  hasQuery: boolean
}

export function EmptyState({ onCreate, hasQuery }: EmptyStateProps) {
  return (
    <div className="cinder-empty">
      <Stack gap={4} align="center">
        <IconFlame size={32} color="var(--mantine-color-amber-5)" />
        <h2 className="cinder-heading">no items yet</h2>
        <Text c="dimmed" size="sm">
          {hasQuery ? 'No items match your filter.' : 'Add your first item to get started.'}
        </Text>
      </Stack>
      {!hasQuery && (
        <Button color="amber" leftSection={<IconPlus size={16} />} onClick={onCreate}>
          Create your first item
        </Button>
      )}
    </div>
  )
}
