import { Card, Table, Text, Badge, Stack, Group, Collapse, ActionIcon, Box } from '@mantine/core';
import { IconReceipt, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import { toTenge } from '@/shared/utils/currencyFormat';
import styles from './BetsHistory.module.css';

function BetRow({ bet }) {
  const [expanded, setExpanded] = useState(false);
  const hasItems = bet.items && bet.items.length > 0;

  return (
    <>
      <Table.Tr
        className={styles.tableRow}
        onClick={() => hasItems && setExpanded(!expanded)}
        style={{ cursor: hasItems ? 'pointer' : 'default' }}
      >
        <Table.Td>
          {hasItems && (
            <ActionIcon variant="subtle" size="xs" className={styles.expandBtn}>
              {expanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
            </ActionIcon>
          )}
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Badge size="xs" variant="light" color={bet.type === 'express' ? 'grape' : 'blue'}>
              {bet.type === 'express' ? 'Express' : 'Single'}
            </Badge>
            <Text fw={500} className={styles.eventName}>
              {bet.eventName || `Bet #${bet.id}`}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text fw={600}>{toTenge(bet.amount)}</Text>
        </Table.Td>
        <Table.Td>
          <Badge color="blue" className={styles.oddsBadge}>
            {(bet.odds || 1).toFixed(2)}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text fw={600} className={styles.potentialWin}>
            {toTenge(bet.potentialWin || bet.amount * (bet.odds || 1))}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed">
            {new Date(bet.date || bet.created_at).toLocaleString()}
          </Text>
        </Table.Td>
        <Table.Td>
          <Badge
            color={
              bet.status === 'won' || bet.status === 'win'
                ? 'green'
                : bet.status === 'lost'
                ? 'red'
                : 'yellow'
            }
            className={styles.betStatusBadge}
          >
            {bet.status === 'won' || bet.status === 'win' ? 'Won' : bet.status === 'lost' ? 'Lost' : 'Pending'}
          </Badge>
        </Table.Td>
      </Table.Tr>
      {hasItems && expanded && (
        <Table.Tr className={styles.expandedRow}>
          <Table.Td colSpan={7}>
            <Box className={styles.betItemsBox}>
              <Stack gap={4}>
                {bet.items.map((item, idx) => (
                  <Group key={idx} justify="space-between" className={styles.betItemRow}>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">{item.marketType || 'Market'}</Text>
                      <Text size="sm" fw={500} c="dark">{item.teamName || item.result || 'Selection'}</Text>
                    </Group>
                    <Badge size="sm" variant="light" color="blue">{(item.odds || 1).toFixed(2)}</Badge>
                  </Group>
                ))}
              </Stack>
            </Box>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
}

export function BetsHistory({ bets = [] }) {
  if (bets.length === 0) {
    return (
      <Card className={styles.historyCard} p="lg">
        <Group justify="center" style={{ minHeight: '200px' }}>
          <Stack align="center" gap="sm">
            <IconReceipt size={48} className={styles.emptyIcon} />
            <Text size="lg" c="dimmed">
              No bets placed yet
            </Text>
          </Stack>
        </Group>
      </Card>
    );
  }

  return (
    <Card className={styles.historyCard} p="lg">
      <Table className={styles.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 30 }}></Table.Th>
            <Table.Th>Event</Table.Th>
            <Table.Th>Stake</Table.Th>
            <Table.Th>Odds</Table.Th>
            <Table.Th>Potential Win</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {bets.map((bet) => (
            <BetRow key={bet.id} bet={bet} />
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
