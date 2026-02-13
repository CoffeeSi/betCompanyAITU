import { Card, Table, Text, Group, Badge, Menu, ActionIcon, Stack } from '@mantine/core';
import {
  IconCreditCard,
  IconDownload,
  IconUpload,
  IconReceipt,
  IconTrendingUp,
  IconCheck,
  IconClock,
  IconX,
  IconDots,
  IconEye
} from '@tabler/icons-react';
import styles from './TransactionHistory.module.css';

export function TransactionHistory({ transactions = [] }) {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <IconDownload size={16} className={styles.iconDeposit} />;
      case 'withdrawal':
        return <IconUpload size={16} className={styles.iconWithdraw} />;
      case 'bet':
        return <IconReceipt size={16} className={styles.iconBet} />;
      case 'win':
        return <IconTrendingUp size={16} className={styles.iconWin} />;
      default:
        return <IconCreditCard size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <IconCheck size={14} />;
      case 'pending':
        return <IconClock size={14} />;
      case 'failed':
        return <IconX size={14} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      case 'cancelled':
        return 'gray';
      default:
        return 'blue';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className={styles.historyCard} p="lg">
        <Group justify="center" style={{ minHeight: '200px' }}>
          <Stack align="center" gap="sm">
            <IconCreditCard size={48} className={styles.emptyIcon} />
            <Text size="lg" c="dimmed">
              No transactions yet
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
            <Table.Th>Type</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {transactions.map((transaction) => (
            <Table.Tr key={transaction.id} className={styles.tableRow}>
              <Table.Td>
                <Group gap="xs">
                  {getTransactionIcon(transaction.type)}
                  <Text className={styles.transactionType}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text
                  fw={600}
                  className={
                    transaction.type === 'deposit' || transaction.type === 'win'
                      ? styles.positiveAmount
                      : styles.negativeAmount
                  }
                >
                  {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}₸
                  {transaction.amount.toLocaleString()}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {new Date(transaction.date || transaction.created_at).toLocaleString()}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={getStatusColor(transaction.status)}
                  className={styles.statusBadge}
                  leftSection={getStatusIcon(transaction.status)}
                >
                  {transaction.status}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
