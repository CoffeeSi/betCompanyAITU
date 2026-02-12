import { Modal, Stack, Group, Text, Badge, Divider, Card, Box, Button } from '@mantine/core';
import { 
  IconReceipt, 
  IconDownload, 
  IconCheck, 
  IconX, 
  IconClock,
  IconCreditCard,
  IconHash
} from '@tabler/icons-react';
import styles from './TransactionDetails.module.css';

export function TransactionDetails({ opened, onClose, transaction }) {
  if (!transaction) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <IconCheck size={16} />;
      case 'pending':
        return <IconClock size={16} />;
      case 'failed':
        return <IconX size={16} />;
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

  const getTypeLabel = (type) => {
    const labels = {
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      bet: 'Bet Placed',
      win: 'Bet Win'
    };
    return labels[type];
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Transaction Details"
      size="lg"
      className={styles.modal}
    >
      <Stack gap="md">
        {/* Transaction Header */}
        <Card className={styles.headerCard} p="md">
          <Group justify="space-between" align="center">
            <Group>
              <Box className={styles.iconWrapper}>
                <IconReceipt size={24} />
              </Box>
              <Stack gap={2}>
                <Text fw={600} size="lg">{getTypeLabel(transaction.type)}</Text>
                <Text size="xs" c="dimmed">
                  {new Date(transaction.created_at).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </Text>
              </Stack>
            </Group>
            <Badge
              size="lg"
              leftSection={getStatusIcon(transaction.status)}
              color={getStatusColor(transaction.status)}
              variant="light"
            >
              {transaction.status}
            </Badge>
          </Group>
        </Card>

        <Divider />

        {/* Amount Section */}
        <Card className={styles.amountCard} p="md">
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">Transaction Amount</Text>
            <Text 
              size={36} 
              fw={700}
              className={
                transaction.type === 'deposit' || transaction.type === 'win'
                  ? styles.amountPositive
                  : styles.amountNegative
              }
            >
              {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}
              ${transaction.amount.toFixed(2)}
            </Text>
          </Stack>
        </Card>

        <Divider />

        {/* Transaction Details */}
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="xs">
              <IconHash size={16} className={styles.icon} />
              <Text size="sm" c="dimmed">Transaction ID</Text>
            </Group>
            <Text size="sm" fw={600}>#{transaction.id}</Text>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <IconCreditCard size={16} className={styles.icon} />
              <Text size="sm" c="dimmed">Wallet ID</Text>
            </Group>
            <Text size="sm" fw={600}>#{transaction.wallet_id}</Text>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">Type</Text>
            <Badge variant="outline" tt="capitalize">
              {transaction.type}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">Created At</Text>
            <Text size="sm">
              {new Date(transaction.created_at).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </Text>
          </Group>
        </Stack>

        <Divider />

        {/* Actions */}
        <Group justify="flex-end" gap="xs">
          <Button 
            variant="light" 
            leftSection={<IconDownload size={16} />}
            className={styles.downloadButton}
          >
            Download Receipt
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </Group>

        {/* Additional Info */}
        {transaction.status === 'pending' && (
          <Card className={styles.infoCard} p="md">
            <Text size="xs" c="dimmed">
              ⓘ This transaction is being processed and should be completed within 24 hours.
            </Text>
          </Card>
        )}

        {transaction.status === 'failed' && (
          <Card className={styles.errorCard} p="md">
            <Text size="xs" c="red">
              ⓘ This transaction failed. Please contact support if you believe this is an error.
            </Text>
          </Card>
        )}
      </Stack>
    </Modal>
  );
}