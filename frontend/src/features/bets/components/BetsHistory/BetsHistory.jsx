import { Card, Table, Text, Badge, Stack, Group } from '@mantine/core';
import { IconReceipt } from '@tabler/icons-react';
import styles from './BetsHistory.module.css';

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
            <Table.Th>Event</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Odds</Table.Th>
            <Table.Th>Potential Win</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {bets.map((bet) => (
            <Table.Tr key={bet.id} className={styles.tableRow}>
              <Table.Td>
                <Text fw={500} className={styles.eventName}>
                  {bet.eventName || `Bet #${bet.id}`}
                </Text>
                {bet.selection && (
                  <Text size="xs" c="dimmed">
                    {bet.selection}
                  </Text>
                )}
              </Table.Td>
              <Table.Td>
                <Text fw={600}>₸{bet.amount.toLocaleString()}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color="blue" className={styles.oddsBadge}>
                  {bet.odds.toFixed(2)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text fw={600} className={styles.potentialWin}>
                  ₸{bet.potentialWin?.toLocaleString() || (bet.amount * bet.odds).toFixed(2)}
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
                    bet.status === 'won'
                      ? 'green'
                      : bet.status === 'lost'
                      ? 'red'
                      : 'yellow'
                  }
                  className={styles.betStatusBadge}
                >
                  {bet.status}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
