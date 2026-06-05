import { Drawer, Stack, TextInput, Button, Group, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconDeviceFloppy } from '@tabler/icons-react'

import { isValidItemName } from '../lib/format'

interface AddItemDrawerProps {
  opened: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void> | void
}

export function AddItemDrawer({ opened, onClose, onSubmit }: AddItemDrawerProps) {
  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (v) => (isValidItemName(v) ? null : 'Name must be 2–80 characters')
    }
  })

  const handle = async (values: { name: string }) => {
    await onSubmit(values.name.trim())
    notifications.show({
      color: 'amber',
      title: 'Item created',
      message: `"${values.name.trim()}" added`
    })
    form.reset()
  }

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        form.reset()
        onClose()
      }}
      position="right"
      size="md"
      title={
        <Text className="cinder-heading" fw={600}>
          new item
        </Text>
      }
    >
      <form onSubmit={form.onSubmit(handle)}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="e.g. product demo clip"
            data-autofocus
            {...form.getInputProps('name')}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="amber" leftSection={<IconDeviceFloppy size={14} />}>
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  )
}
