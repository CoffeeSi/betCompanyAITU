import { Card, Group, Text, Button, Stack, Divider, Modal, NumberInput, Select, Alert } from '@mantine/core';
import { IconWallet, IconDownload, IconUpload, IconTrendingUp, IconTrendingDown, IconReceipt, IconCheck } from '@tabler/icons-react';
import styles from './BalanceProfileCard.module.css';
import { toTenge } from '@/shared/utils/currencyFormat';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { walletApi } from '../api/walletApi';
import { useUser } from '@/features/user/hooks/useUser';
import { useDeposit } from '../hooks/useDeposit';
import { useWithdraw } from '../hooks/useWithdraw';

export function BalanceProfileCard() {
  const { user } = useUser();
  const { wallet, error: walletError, refresh } = useWallet(user?.id);
  const [transactions, setTransactions] = useState([]);
  const [bets, setBets] = useState([]);
  
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const refreshData = useCallback(async () => {
    if (!user?.id) return;
    await refresh();
    const updatedTransactions = await walletApi.fetchTransactions(user.id);
    setTransactions(updatedTransactions || []);
  }, [user?.id, refresh]);

  const {
    deposit,
    processing: depositProcessing,
    success: depositSuccess,
    error: depositError,
    reset: resetDeposit
  } = useDeposit({ userId: user?.id, onSuccess: refreshData });

  const {
    withdraw,
    processing: withdrawProcessing,
    success: withdrawSuccess,
    error: withdrawError,
    reset: resetWithdraw
  } = useWithdraw({ userId: user?.id, onSuccess: refreshData });

  const [depositModalOpened, { open: openDeposit, close: closeDeposit }] = useDisclosure(false);
  const [withdrawModalOpened, { open: openWithdraw, close: closeWithdraw }] = useDisclosure(false);

  const calculateStats = () => {
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBets = transactions
      .filter(t => t.type === 'bet' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWins = transactions
      .filter(t => t.type === 'win' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const activeBets = bets.filter(b => b.status === 'pending').length;
    const wonBets = bets.filter(b => b.status === 'won').length;
    const lostBets = bets.filter(b => b.status === 'lost').length;
    const winRate = wonBets + lostBets > 0 ? (wonBets / (wonBets + lostBets)) * 100 : 0;

    return {
      totalDeposits,
      totalWithdrawals,
      totalBets,
      totalWins,
      netProfit: totalWins - totalBets,
      activeBets,
      wonBets,
      lostBets,
      winRate
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (!depositSuccess) return;
    const timer = setTimeout(() => {
      closeDeposit();
      setAmount(0);
      resetDeposit();
    }, 2000);
    return () => clearTimeout(timer);
  }, [depositSuccess, closeDeposit, resetDeposit]);

  useEffect(() => {
    if (!withdrawSuccess) return;
    const timer = setTimeout(() => {
      closeWithdraw();
      setAmount(0);
      resetWithdraw();
    }, 2000);
    return () => clearTimeout(timer);
  }, [withdrawSuccess, closeWithdraw, resetWithdraw]);

  return (
    <>
    <Card className={styles.walletCard} p="lg" mb="md">
      <Stack gap="md">
      <Group justify="space-between" align="center">
          <Group>
          <IconWallet size={24} className={styles.walletIcon} />
          <Text size="lg" fw={600} className={styles.walletTitle}>
              My Wallet
          </Text>
          </Group>
          <Group gap="xs">
          <Button
              leftSection={<IconDownload size={16} />}
              onClick={openDeposit}
              className={styles.depositButton}
          >
              Deposit
          </Button>
          <Button
              leftSection={<IconUpload size={16} />}
              variant="light"
              onClick={openWithdraw}
              className={styles.withdrawButton}
          >
              Withdraw
          </Button>
          </Group>
      </Group>

      <Divider />

      {(depositError || withdrawError || walletError) && (
        <Alert color="red" variant="light">
          {depositError || withdrawError || walletError}
        </Alert>
      )}

      <Group justify="space-between" align="center">
          <Stack gap={4}>
          <Text size="sm" fw={500}>
              Available Balance
          </Text>
          <Text size="32px" fw={700} className={styles.balance}>
              {toTenge(wallet?.balance || 0)}
          </Text>
          </Stack>
      </Group>

      {/* Quick Stats */}
      <Group grow mt="md">
          <Card className={styles.statCard} p="md">
          <Stack gap={4}>
              <Group gap="xs">
              <IconTrendingUp size={16} className={styles.iconPositive} />
              <Text size="xs" className={styles.statValue}>Total Deposits</Text>
              </Group>
              <Text size="lg" fw={700} className={styles.statValue}>
              {toTenge(stats.totalDeposits)}
              </Text>
          </Stack>
          </Card>
          <Card className={styles.statCard} p="md">
          <Stack gap={4}>
              <Group gap="xs">
              <IconTrendingDown size={16} className={styles.iconNegative} />
              <Text size="xs" className={styles.statValue}>Total Withdrawals</Text>
              </Group>
              <Text size="lg" fw={700} className={styles.statValue}>
              {toTenge(stats.totalWithdrawals)}
              </Text>
          </Stack>
          </Card>
          <Card className={styles.statCard} p="md">
          <Stack gap={4}>
              <Group gap="xs">
              <IconReceipt size={16} className={styles.iconNeutral} />
              <Text size="xs" className={styles.statValue}>Net Profit/Loss</Text>
              </Group>
              <Text
              size="lg"
              fw={700}
              className={stats.netProfit >= 0 ? styles.profitPositive : styles.profitNegative}
              >
              {stats.netProfit >= 0 ? '+' : ''}{toTenge(stats.netProfit)}
              </Text>
          </Stack>
          </Card>
      </Group>
      </Stack>
    </Card>

    {/* Deposit Modal */}
    <Modal
      opened={depositModalOpened}
      onClose={closeDeposit}
      title="Deposit Funds"
      className={styles.modal}
    >
      <Stack gap="md">
        {depositSuccess ? (
          <Alert icon={<IconCheck size={16} />} color="green">
            Deposit successful! Your balance has been updated.
          </Alert>
        ) : (
          <>
            <NumberInput
              label="Amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(val) => setAmount(Number(val))}
              min={10}
              max={10000}
              step={10}
              suffix='₸'
              size="lg"
            />
            <Select
              label="Payment Method"
              placeholder="Select payment method"
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(val || 'card')}
              data={[
                { value: 'card', label: 'Credit/Debit Card' },
                { value: 'bank', label: 'Bank Transfer' },
                { value: 'crypto', label: 'Cryptocurrency' },
                { value: 'ewallet', label: 'E-Wallet' }
              ]}
            />
            <Button
              fullWidth
              size="lg"
              onClick={() => deposit(amount)}
              loading={depositProcessing}
              disabled={amount <= 0}
              className={styles.depositButton}
            >
              Deposit {toTenge(amount)}
            </Button>
          </>
        )}
      </Stack>
    </Modal>

    {/* Withdraw Modal */}
    <Modal
      opened={withdrawModalOpened}
      onClose={closeWithdraw}
      title="Withdraw Funds"
      className={styles.modal}
    >
      <Stack gap="md">
        {withdrawSuccess ? (
          <Alert icon={<IconCheck size={16} />} color="green">
            Withdrawal successful! Funds will be processed within 24 hours.
          </Alert>
        ) : (
          <>
            <NumberInput
              label="Amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(val) => setAmount(Number(val))}
              min={10}
              max={wallet?.balance || 0}
              step={10}
              suffix='₸'
              size="lg"
            />
            <Text size="sm" c="dimmed">
              Available balance: {toTenge(wallet?.balance || 0)}
            </Text>
            <Select
              label="Withdrawal Method"
              placeholder="Select withdrawal method"
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(val || 'bank')}
              data={[
                { value: 'bank', label: 'Bank Transfer' },
                { value: 'card', label: 'Card' },
                { value: 'crypto', label: 'Cryptocurrency' },
                { value: 'ewallet', label: 'E-Wallet' }
              ]}
            />
            <Button
              fullWidth
              size="lg"
              onClick={() => withdraw(amount, wallet?.balance)}
              loading={withdrawProcessing}
              disabled={amount <= 0 || amount > (wallet?.balance || 0)}
              className={styles.withdrawButton}
            >
              Withdraw {toTenge(amount)}
            </Button>
          </>
        )}
      </Stack>
    </Modal>
    </>
  )
}