import { Card, Text, Grid, GridCol, Stack } from '@mantine/core';
import styles from './BettingStats.module.css';

export function BettingStats({ stats }) {
  if (!stats) return null;

  return (
    <Card className={styles.statsCard} p="lg" mb="md">
      <Text size="lg" fw={700} mb="md">
        Betting Statistics
      </Text>
      <Grid gutter="md">
        <GridCol span={{ base: 12, xs: 6, md: 3 }}>
          <Stack gap={5} className={styles.statItem}>
            <Text size="sm" c="dimmed" className={styles.statLabel}>
              Active Bets
            </Text>
            <Text size="xl" fw={700} className={`${styles.statValue} ${styles.activeValue}`}>
              {stats.activeBets || 0}
            </Text>
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, md: 3 }}>
          <Stack gap={5} className={styles.statItem}>
            <Text size="sm" c="dimmed" className={styles.statLabel}>
              Won Bets
            </Text>
            <Text size="xl" fw={700} className={`${styles.statValue} ${styles.wonValue}`}>
              {stats.wonBets || 0}
            </Text>
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, md: 3 }}>
          <Stack gap={5} className={styles.statItem}>
            <Text size="sm" c="dimmed" className={styles.statLabel}>
              Lost Bets
            </Text>
            <Text size="xl" fw={700} className={`${styles.statValue} ${styles.lostValue}`}>
              {stats.lostBets || 0}
            </Text>
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, md: 3 }}>
          <Stack gap={5} className={styles.statItem}>
            <Text size="sm" c="dimmed" className={styles.statLabel}>
              Win Rate
            </Text>
            <Text
              size="xl"
              fw={700}
              className={`${styles.statValue} ${
                (stats.winRate || 0) >= 50 ? styles.wonValue : styles.lostValue
              }`}
            >
              {(stats.winRate || 0).toFixed(1)}%
            </Text>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
