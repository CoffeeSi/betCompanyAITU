import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Header from '@/components/layout/Header/Header';
import Navbar from '@/components/layout/Navbar/Navbar';
import {
  Card,
  Grid,
  GridCol,
  Tabs,
  Text,
  Group,
  Box,
  Stack,
  Badge
} from '@mantine/core';
import {
  IconUsers,
  IconSoccerField,
  IconCalendar,
  IconChartBar,
  IconTrophy,
  IconSettings,
  IconGavel
} from '@tabler/icons-react';
import { EventsManagement } from './EventsManagement';
import { TeamsManagement } from './TeamsManagement';
import { UsersManagement } from './UsersManagement';
import { MarketsManagement } from './MarketsManagement';
import { EventSettlement } from './EventSettlement';

import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState('events');

  return (
    <>
      <Header onBurgerClick={toggle} burgerOpened={opened} />
      <Grid gutter={0}>
        <GridCol span={3}>
          <Navbar onNavigate={close} opened={opened} close={close} />
        </GridCol>
        <GridCol span={9}>
          <Box className={styles.container}>
            {/* Admin Header */}
            <Card className={styles.adminHeader} p="lg" mb="md">
              <Group justify="space-between" align="center">
                <Stack gap="xs">
                  <Group>
                    <IconSettings size={32} className={styles.headerIcon} />
                    <Text size="xl" fw={700} className={styles.title}>
                      Admin Panel
                    </Text>
                  </Group>
                </Stack>
              </Group>
            </Card>

            {/* Tabs Navigation */}
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value || 'statistics')}
              className={styles.tabs}
            >
              <Tabs.List className={styles.tabsList}>
                <Tabs.Tab
                  value="events"
                  leftSection={<IconCalendar size={16} />}
                  className={styles.tab}
                >
                  Events
                </Tabs.Tab>
                <Tabs.Tab
                  value="teams"
                  leftSection={<IconTrophy size={16} />}
                  className={styles.tab}
                >
                  Teams
                </Tabs.Tab>
                <Tabs.Tab
                  value="markets"
                  leftSection={<IconSoccerField size={16} />}
                  className={styles.tab}
                >
                  Markets
                </Tabs.Tab>
                <Tabs.Tab
                  value="users"
                  leftSection={<IconUsers size={16} />}
                  className={styles.tab}
                >
                  Users
                </Tabs.Tab>
                <Tabs.Tab
                  value="settlement"
                  leftSection={<IconGavel size={16} />}
                  className={styles.tab}
                >
                  Settlement
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="events" pt="md">
                <EventsManagement />
              </Tabs.Panel>

              <Tabs.Panel value="teams" pt="md">
                <TeamsManagement />
              </Tabs.Panel>

              <Tabs.Panel value="markets" pt="md">
                <MarketsManagement />
              </Tabs.Panel>

              <Tabs.Panel value="users" pt="md">
                <UsersManagement />
              </Tabs.Panel>

              <Tabs.Panel value="settlement" pt="md">
                <EventSettlement />
              </Tabs.Panel>
            </Tabs>
          </Box>
        </GridCol>
      </Grid>
    </>
  );
}

export default AdminDashboard;