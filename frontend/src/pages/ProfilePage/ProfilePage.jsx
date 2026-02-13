import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Header from '@/components/layout/Header/Header';
import Navbar from '@/components/layout/Navbar/Navbar';
import { MenuNavbar } from '@/components/layout/MenuNavbar/MenuNavbar';
import { Grid, GridCol, Box, Alert, Loader, Group, Tabs } from '@mantine/core';
import { IconHistory, IconReceipt } from '@tabler/icons-react';
import { BalanceProfileCard } from '@/features/wallet/components/BalanceProfileCard';
import { ProfileHeader } from '@/features/user/components/ProfileHeader/ProfileHeader';
import { BettingStats } from '@/features/bets/components/BettingStats/BettingStats';
import { TransactionHistory } from '@/features/transactions/components/TransactionHistory/TransactionHistory';
import { BetsHistory } from '@/features/bets/components/BetsHistory/BetsHistory';
import { useUser } from '@/features/user/hooks/useUser';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { useBets } from '@/features/bets/hooks/useBets';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { user, loading: userLoading, error: userError } = useUser();
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions();
  const { bets, stats, loading: betsLoading, error: betsError } = useBets();
  
  const loading = userLoading || transactionsLoading || betsLoading;
  const error = userError || transactionsError || betsError;

  if (loading) {
    return (
      <>
        <Header onBurgerClick={toggle} burgerOpened={opened} />
        <Box className={styles.container}>
          <Group justify="center" align="center" style={{ minHeight: '400px' }}>
            <Loader size="lg" />
          </Group>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onBurgerClick={toggle} burgerOpened={opened} />
          <Box className={styles.container}>
            {error && (
              <Alert color="red" mb="md" withCloseButton>
                {error}
              </Alert>
            )}

            <ProfileHeader user={user} />
            <BalanceProfileCard />
            <BettingStats stats={stats} />

            <Tabs defaultValue="transactions" className={styles.tabs}>
              <Tabs.List className={styles.tabsList}>
                <Tabs.Tab
                  value="transactions"
                  leftSection={<IconHistory size={16} />}
                  className={styles.tab}
                >
                  Transaction History
                </Tabs.Tab>
                <Tabs.Tab
                  value="bets"
                  leftSection={<IconReceipt size={16} />}
                  className={styles.tab}
                >
                  My Bets
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="transactions">
                <TransactionHistory transactions={transactions} />
              </Tabs.Panel>

              <Tabs.Panel value="bets">
                <BetsHistory bets={bets.map(b => ({
                  id: b.id,
                  eventName: b.bet_items?.length > 0
                    ? b.bet_items.map(i => i.outcomes?.teams?.name || i.outcomes?.result || 'Selection').join(' + ')
                    : `Bet #${b.id}`,
                  amount: b.amount,
                  odds: b.total_odd,
                  potentialWin: b.amount * b.total_odd,
                  date: b.start_time,
                  status: b.status,
                  type: b.type,
                  items: b.bet_items?.map(i => ({
                    teamName: i.outcomes?.teams?.name || i.outcomes?.result || 'Selection',
                    marketType: i.outcomes?.markets?.market_type?.replace(/_/g, ' ') || 'Market',
                    odds: i.odds,
                    result: i.outcomes?.result,
                  })) || [],
                }))} />
              </Tabs.Panel>
            </Tabs>
          </Box>
    </>
  );
}

export default ProfilePage;