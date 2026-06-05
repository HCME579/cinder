import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Group,
  Table,
  Title,
  Text,
  TextInput,
  ActionIcon,
  Paper,
  Box
} from '@mantine/core'
import { IconPlus, IconSearch, IconArrowsSort } from '@tabler/icons-react'

import { createItem, listItems, subscribeItems, type ItemRecord } from '../lib/firebase'
import { formatTimestamp, isValidItemName } from '../lib/format'
import { AddItemDrawer } from '../components/AddItemDrawer'
import { EmptyState } from '../components/EmptyState'

type SortKey = 'name' | 'createdAt'
type SortDir = 'asc' | 'desc'

export function HomePage() {
  const [items, setItems] = useState<ItemRecord[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub: (() => void) | null = null
    setLoading(true)
    listItems()
      .then((initial) => {
        setItems(initial)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    try {
      unsub = subscribeItems((next) => {
        setItems(next)
        setLoading(false)
      })
    } catch {
      // Emulator not running in some envs — fall back to one-shot listItems only.
    }
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items
    const sorted = [...base].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === bv) return 0
      const cmp = av < bv ? -1 : 1
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [items, query, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'createdAt' ? 'desc' : 'asc')
    }
  }

  const handleCreate = async (name: string) => {
    if (!isValidItemName(name)) {
      return
    }
    const rec = await createItem(name)
    setItems((prev) => [rec, ...prev])
    setDrawerOpen(false)
  }

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <div>
          <Title order={2} className="cinder-heading">
            items
          </Title>
          <Text c="dimmed" size="sm" data-mono="true">
            {items.length} record{items.length === 1 ? '' : 's'}
          </Text>
        </div>
        <Group>
          <TextInput
            placeholder="filter…"
            leftSection={<IconSearch size={14} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            w={220}
          />
          <Button
            color="amber"
            leftSection={<IconPlus size={16} />}
            onClick={() => setDrawerOpen(true)}
          >
            Add item
          </Button>
        </Group>
      </Group>

      {!loading && filtered.length === 0 ? (
        <EmptyState onCreate={() => setDrawerOpen(true)} hasQuery={query.length > 0} />
      ) : (
        <Paper withBorder radius="md" className="cinder-table-mono">
          <Table striped highlightOnHover withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Group gap={4} wrap="nowrap">
                    name
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      onClick={() => toggleSort('name')}
                      aria-label="Sort by name"
                    >
                      <IconArrowsSort size={12} />
                    </ActionIcon>
                  </Group>
                </Table.Th>
                <Table.Th>
                  <Group gap={4} wrap="nowrap">
                    created
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      onClick={() => toggleSort('createdAt')}
                      aria-label="Sort by created"
                    >
                      <IconArrowsSort size={12} />
                    </ActionIcon>
                  </Group>
                </Table.Th>
                <Table.Th>id</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtered.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td data-mono="true">{formatTimestamp(item.createdAt)}</Table.Td>
                  <Table.Td c="dimmed" data-mono="true">
                    {item.id.slice(0, 10)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      <AddItemDrawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  )
}
