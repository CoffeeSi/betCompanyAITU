import { useState, useEffect } from 'react';
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
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { user, loading: userLoading, error: userError } = useUser();
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions();
  
  
  const loading = userLoading || transactionsLoading;
  const error = userError || transactionsError;

  if (loading) {
    return (
      <>
        <Header onBurgerClick={toggle} burgerOpened={opened} />
        <MenuNavbar onNavigate={close} opened={opened} close={close} />
        <Grid gutter={0}>
          {!isMobile && (
            <GridCol span={{ base: 0, sm: 3, md: 2 }}>
              <Navbar />
            </GridCol>
          )}
          <GridCol span={{ base: 12, sm: 9, md: 10 }}>
            <Box className={styles.container}>
              <Group justify="center" align="center" style={{ minHeight: '400px' }}>
                <Loader size="lg" />
              </Group>
            </Box>
          </GridCol>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Header onBurgerClick={toggle} burgerOpened={opened} />
      <MenuNavbar onNavigate={close} opened={opened} close={close} />
      <Grid gutter={0}>
        {!isMobile && (
          <GridCol span={{ base: 0, sm: 3, md: 2 }}>
            <Navbar />
          </GridCol>
        )}
        <GridCol span={{ base: 12, sm: 9, md: 10 }}>
          <Box className={styles.container}>
            {error && (
              <Alert color="red" mb="md" withCloseButton>
                {error}
              </Alert>
            )}

            <ProfileHeader user={user} />
            <BalanceProfileCard />

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
            </Tabs>
          </Box>
        </GridCol>
      </Grid>
    </>
  );
}

export default ProfilePage;