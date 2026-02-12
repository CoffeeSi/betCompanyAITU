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
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { user, loading, error } = useUser();
  
  const [transactions, setTransactions] = useState([]);
  const [bets, setBets] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {

      // Mock data - замените на реальные API вызовы
      const mockTransactions = [
        {
          id: 1,
          type: 'deposit',
          amount: 10000,
          status: 'completed',
          created_at: '2026-02-10T10:30:00'
        },
        {
          id: 2,
          type: 'bet',
          amount: 5000,
          status: 'completed',
          created_at: '2026-02-11T14:20:00'
        },
        {
          id: 3,
          type: 'win',
          amount: 8500,
          status: 'completed',
          created_at: '2026-02-11T16:45:00'
        }
      ];

      const mockBets = [
        {
          id: 1,
          eventName: 'HC Almaty vs Beibarys',
          selection: 'HC Almaty to win',
          amount: 5000,
          odds: 1.70,
          potentialWin: 8500,
          status: 'won',
          created_at: '2026-02-11T14:20:00'
        },
        {
          id: 2,
          eventName: 'Barys vs Torpedo',
          selection: 'Over 5.5 goals',
          amount: 3000,
          odds: 2.10,
          potentialWin: 6300,
          status: 'pending',
          created_at: '2026-02-12T10:00:00'
        }
      ];

      setTransactions(mockTransactions);
      setBets(mockBets);
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
      console.error('Failed to fetch profile data:', err);
    }
  };

  const calculateBetStats = () => {
    const activeBets = bets.filter(b => b.status === 'pending').length;
    const wonBets = bets.filter(b => b.status === 'won').length;
    const lostBets = bets.filter(b => b.status === 'lost').length;
    const winRate = wonBets + lostBets > 0 ? (wonBets / (wonBets + lostBets)) * 100 : 0;

    return {
      activeBets,
      wonBets,
      lostBets,
      winRate
    };
  };

  const betStats = calculateBetStats();

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
              <Alert color="red" mb="md" onClose={() => setError(null)} withCloseButton>
                {error}
              </Alert>
            )}

            <ProfileHeader user={user} />
            <BalanceProfileCard />
            <BettingStats stats={betStats} />

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
                <BetsHistory bets={bets} />
              </Tabs.Panel>
            </Tabs>
          </Box>
        </GridCol>
      </Grid>
    </>
  );
}

export default ProfilePage;