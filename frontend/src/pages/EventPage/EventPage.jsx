import { useEvent } from "@/features/events/hooks/useEvent";
import { useEventMarkets } from "@/features/events/hooks/useEventMarkets";
import { useBetSlip } from "@/features/bets/store/betSlipStore";
import { useState, useMemo } from "react";
import { useParams } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from '@mantine/notifications';
import Header from '@/components/layout/Header/Header';
import {
  Stack, Box, Breadcrumbs, Anchor, Card, Group, Badge,
  Text, Loader, SimpleGrid, ThemeIcon, Collapse
} from '@mantine/core';
import {
  IconChevronDown, IconChevronUp, IconTrophy, IconTarget
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import styles from './EventPage.module.css';

function EventPage() {
  const eventId = useParams().id;
  const numericEventId = Number(eventId);
  const { event, loading } = useEvent(eventId);
  const { markets, loading: marketsLoading } = useEventMarkets(eventId);
  const { addSelection, isSelected } = useBetSlip();
  const [opened, { toggle }] = useDisclosure(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toGroupType = (market) => {
    const rawType = (market.market_type || market.marketName || '').toLowerCase();
    if (rawType.includes('match winner')) return 'Match Winner';
    if (rawType.includes('goal') || rawType.includes('over') || rawType.includes('under')) return 'Goals over/under';
    return null;
  };

  const getGroupTitle = (groupType) => {
    if (groupType === 'Match Winner') return 'Match winner';
    if (groupType === 'Goals over/under') return 'Goals over/under';
    return groupType;
  };

  const groupedMarkets = useMemo(() => {
    const groups = {};

    (markets || []).forEach((market) => {
      const marketType = toGroupType(market);
      if (!marketType) return;
      if (!groups[marketType]) {
        groups[marketType] = {
          marketType,
          allOutcomes: [],
          isActive: false,
        };
      }

      if (!market.status || market.status === 'active') {
        groups[marketType].isActive = true;
      }

      const outcomes = market.outcomes || market.odds || [];
      outcomes.forEach((outcome, index) => {
        groups[marketType].allOutcomes.push({
          ...outcome,
          id: outcome.id ?? `${market.id ?? market.marketId ?? marketType}-${index}`,
          odds: outcome.odds ?? outcome.value,
          result: outcome.result ?? outcome.name,
          _market: {
            ...market,
            id: market.id ?? market.marketId,
            status: market.status || 'active',
          },
        });
      });
    });

    return groups;
  }, [markets]);

  const getOutcomeLabel = (outcome) => {    
    return outcome._market.market_type.split(' ').slice(2, 4).join(' ') || 'Selection';
  };

  const toggleGroup = (key) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOddsClick = (outcome, market) => {
    const marketId = market.id ?? market.marketId;
    const marketType = market.market_type || market.marketName;
    addSelection({
      outcomeId: outcome.id,
      marketId,
      odds: outcome.odds,
      marketType,
      eventName: event?.name || `Event #${eventId}`,
      teamName: getOutcomeLabel(outcome, market),
      eventId: numericEventId,
    });
    notifications.show({
      title: 'Added to Bet Slip',
      message: `${getOutcomeLabel(outcome, market)} @ ${outcome.odds.toFixed(2)}`,
      color: 'blue',
      autoClose: 2000,
    });
  };

  const breadcrumbItems = [
    { title: event?.name || '', href: '#' }
  ];

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
            <Breadcrumbs className={styles.breadcrumbs} separator="/">
              {breadcrumbItems.map((item, index) => (
                <Anchor key={index} className={styles.breadcrumbLink}>
                  {item.title}
                </Anchor>
              ))}
            </Breadcrumbs>

            <Card className={styles.matchHeader} p="lg">
              <Group justify="space-between" align="center">
                <Group gap="md">
                  <Text className={styles.teamName} fw={700} size="xl">
                    {event?.teams[0]?.name}
                  </Text>
                  <Box className={styles.teamLogo}>
                    <img src={event?.teams[0]?.logo_url} alt={event?.teams[0]?.name} />
                  </Box>
                </Group>

                <Stack gap={4} align="center">
                  {event?.status === 'ongoing' ? (
                    <Badge size="lg" color="red" className={styles.liveBadge} variant="filled">
                      LIVE
                    </Badge>
                  ) : event?.status === 'completed' ? (
                    <Badge size="lg" color="gray" variant="filled">
                      FINISHED
                    </Badge>
                  ) : (
                    <>
                      <Text className={styles.matchTime} size="sm">
                        {dayjs(event?.start_time).format('DD MMM YYYY')}
                      </Text>
                      <Text className={styles.matchTime} fw={700} size="lg">
                        {dayjs(event?.start_time).format('HH:mm')}
                      </Text>
                    </>
                  )}
                  <Box className={styles.leagueLogo}>VS</Box>
                </Stack>

                <Group gap="md">
                  <Box className={styles.teamLogo}>
                    <img src={event?.teams[1]?.logo_url} alt={event?.teams[1]?.name} />
                  </Box>
                  <Text className={styles.teamName} fw={700} size="xl">
                    {event?.teams[1]?.name}
                  </Text>
                </Group>
              </Group>
            </Card>

            <Box mt={20}>
              {marketsLoading ? (
                <Card className={styles.contentCard}>
                  <Group justify="center" p="xl">
                    <Loader size="md" />
                  </Group>
                </Card>
              ) : Object.keys(groupedMarkets).length > 0 ? (
                <Stack gap="md">
                  {Object.values(groupedMarkets).map((group) => {
                    const IconComp = group.marketType === 'goals_over_under' ? IconTarget : IconTrophy;
                    const isCollapsed = collapsedGroups[group.marketType];
                    return (
                      <Card key={group.marketType} className={styles.marketGroupCard} p={0}>
                        <Group
                          className={styles.marketGroupHeader}
                          justify="space-between"
                          p="md"
                          onClick={() => toggleGroup(group.marketType)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Group gap="sm">
                            <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
                              <IconComp size={14} />
                            </ThemeIcon>
                            <Text fw={600} size="sm" className={styles.marketGroupTitle}>
                              {getGroupTitle(group.marketType)}
                            </Text>
                            {!group.isActive && (
                              <Badge size="xs" variant="light" color="red">Closed</Badge>
                            )}
                          </Group>
                          {isCollapsed ? (
                            <IconChevronDown size={16} color="#8b92a8" />
                          ) : (
                            <IconChevronUp size={16} color="#8b92a8" />
                          )}
                        </Group>

                        <Collapse in={!isCollapsed}>
                          <Box p="md" pt="sm">
                            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xs">
                              {group.allOutcomes.map(outcome => {
                                const market = outcome._market;
                                const selected = isSelected(outcome.id);
                                const disabled = market.status && market.status !== 'active';
                                return (
                                  <button
                                    key={outcome.id}
                                    type="button"
                                    className={`${styles.oddsBtn} ${selected ? styles.oddsBtnSelected : ''} ${disabled ? styles.oddsBtnDisabled : ''}`}
                                    onClick={() => !disabled && handleOddsClick(outcome, market)}
                                    disabled={disabled}
                                  >
                                    <span className={styles.oddsBtnLabel}>
                                      {getOutcomeLabel(outcome, market)}
                                    </span>
                                    <span className={`${styles.oddsBtnValue} ${selected ? styles.oddsBtnValueSelected : ''}`}>
                                      {outcome.odds.toFixed(2)}
                                    </span>
                                  </button>
                                );
                              })}
                            </SimpleGrid>
                          </Box>
                        </Collapse>
                      </Card>
                    );
                  })}
                </Stack>
              ) : (
                <Card className={styles.contentCard}>
                  <Box p="xl">
                    <Text c="dimmed" ta="center">No markets available for this event</Text>
                  </Box>
                </Card>
              )}
            </Box>
          </Box>
    </>
  )
}

export default EventPage;