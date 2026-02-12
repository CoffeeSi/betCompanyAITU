import { useEvent } from "@/features/events/hooks/useEvent";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Header from '@/components/layout/Header/Header';
import Navbar from '@/components/layout/Navbar/Navbar';
import { MenuNavbar } from "@/components/layout/MenuNavbar/MenuNavbar";
import { Grid, GridCol, Stack, Box, Breadcrumbs, Anchor, Card, Group, Badge, Tabs, Text, Button, Loader } from '@mantine/core';
import dayjs from 'dayjs';
import styles from './EventPage.module.css';

function EventPage() {
  const eventId = useParams().id;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  // const [selectedEvent, setSelectedEvent] = useState(null);
  const [markets, setMarkets] = useState([]);
  const { event, loading, error } = useEvent(eventId);
  const [opened, { toggle, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchEventData = async () => {
      const eventData = {
        id: 1,
        sport_id: 5, // Hockey
        status: 'scheduled',
        start_time: '2026-02-12T19:30:00',
        sport: {
          id: 5,
          name: 'Hockey'
        },
        event_teams: [
          {
            id: 1,
            event_id: 1,
            team_id: 101,
            role: 'home',
            team: {
              id: 101,
              name: 'HC Almaty',
              logo_url: '/logos/hc-almaty.png',
              sport_id: 5
            }
          },
          {
            id: 2,
            event_id: 1,
            team_id: 102,
            role: 'away',
            team: {
              id: 102,
              name: 'Beibarys',
              logo_url: '/logos/beibarys.png',
              sport_id: 5
            }
          }
        ]
      };
      
      // Mock markets data
      const marketsData = [
        {
          id: 1,
          event_id: 1,
          name: 'Match Winner',
          market_type: '1X2',
          status: 'active',
          outcomes: [
            { id: 1, market_id: 1, team_id: 101, odds: 2.15, result: null },
            { id: 2, market_id: 1, team_id: 102, odds: 1.85, result: null }
          ]
        },
        {
          id: 2,
          event_id: 1,
          name: 'Total Goals',
          market_type: 'over_under',
          status: 'active',
          outcomes: [
            { id: 3, market_id: 2, team_id: null, odds: 1.90, result: null },
            { id: 4, market_id: 2, team_id: null, odds: 1.95, result: null }
          ]
        }
      ];
      
      // setSelectedEvent(eventData);
      setMarkets(marketsData);
    };
    
    fetchEventData();
  }, []);
  
  // Calculate team statistics from previous events
  const teamStats = {
    home: {
      name: "HC Almaty",
      wins: 3,
      losses: 7,
      winRate: 30,
      recentForm: ['W', 'L', 'L', 'L', 'L']
    },
    away: {
      name: "Beibarys",
      wins: 3,
      losses: 7,
      winRate: 30,
      recentForm: ['L', 'L', 'L', 'L', 'W']
    }
  };
  
  // Previous matches data
  const previousMatches = [
    {
      id: 123,
      date: "10.02.2026",
      sport_id: 5,
      status: "completed",
      homeTeam: "HC Almaty",
      awayTeam: "Beibarys",
      periods: [3, 0, 0],
      awayPeriods: [0, 2, 1],
      rt: [3, 3],
      ot: [0, 0],
      s: [0, 1],
      result: [3, 4]
    },
    {
      id: 122,
      date: "07.02.2026",
      sport_id: 5,
      status: "completed",
      homeTeam: "Torpedo Ust-Kamenogorsk",
      awayTeam: "HC Almaty",
      periods: [3, 1, 2],
      awayPeriods: [0, 0, 0],
      rt: [6, 0],
      result: [6, 0]
    }
  ];

  const breadcrumbItems = [
    { title: event?.name || '', href: '#' }
  ];  

  if (loading) {
    return (
      <>
        <Header onBurgerClick={toggle} burgerOpened={opened} />
        <MenuNavbar onNavigate={close} opened={opened} close={close} />
        <Grid gutter={0}>
          <GridCol span={3}>
            <Navbar onNavigate={close} opened={opened} close={close} />
          </GridCol>
          <GridCol span={9}>
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
            <Navbar onNavigate={close} />
          </GridCol>
        )}
        <GridCol span={{ base: 12, sm: 9, md: 10 }}>
          <Box className={styles.container}>
            {/* Breadcrumbs */}
            <Breadcrumbs className={styles.breadcrumbs} separator="/">
              {breadcrumbItems.map((item, index) => (
                <Anchor key={index} className={styles.breadcrumbLink}>
                  {item.title}
                </Anchor>
              ))}
            </Breadcrumbs>

            {/* Match Header */}
            <Card className={styles.matchHeader} p="lg">
              <Group justify="space-between" align="center">
                {/* Home Team */}
                <Group gap="md">
                  <Text className={styles.teamName} fw={700} size="xl">
                    {event?.teams[0]?.name}
                  </Text>
                  <Box className={styles.teamLogo}>
                    <img src={event?.teams[0]?.logo_url} alt={event?.teams[0]?.name} />
                  </Box>
                </Group>

                {/* Match Time */}
                <Stack gap={0} align="center">
                  <Text className={styles.matchTime} size="sm">{dayjs(event?.start_time).format('DD MMM YYYY')}</Text>
                  <Text className={styles.matchTime} fw={700} size="lg">{dayjs(event?.start_time).format('HH:mm')}</Text>
                  <Box className={styles.leagueLogo}>VS</Box>
                </Stack>

                {/* Away Team */}
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
            <Card mt={20} className={styles.contentCard}>
              {/* Betting Markets Section */}
              {markets.length > 0 && (
                <Box mb="xl">
                  <Text className={styles.sectionTitle} fw={600} size="lg" mb="md">
                    Betting Markets
                  </Text>
                  <Stack gap="md">
                    {markets.map(market => (
                      <Card key={market.id} className={styles.marketCard} p="md">
                        <Group justify="space-between" mb="sm">
                          <Text fw={600} size="sm" className={styles.marketName}>
                            {market.name}
                          </Text>
                          <Badge 
                            className={market.status === 'active' ? styles.badgeActive : styles.badgeInactive}
                            size="sm"
                          >
                            {market.status}
                          </Badge>
                        </Group>
                        <Group gap="md">
                          {market.outcomes.map(outcome => (
                            <Button 
                              key={outcome.id}
                              variant="light"
                              className={styles.oddsButton}
                              size="lg"
                            >
                              <Stack gap={0} align="center">
                                <Text size="xs" c="dimmed">
                                  {outcome.team_id === event?.teams[0]?.id
                                    ? event?.teams[0]?.name
                                    : outcome.team_id === event?.teams[1]?.id
                                    ? event?.teams[1]?.name
                                    : market.market_type === 'over_under' 
                                    ? outcome.id % 2 === 1 ? 'Over' : 'Under'
                                    : 'Draw'}
                                </Text>
                                <Text fw={700} size="lg">
                                  {outcome.odds.toFixed(2)}
                                </Text>
                              </Stack>
                            </Button>
                          ))}
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}
            </Card>
          </Box>
        </GridCol>
      </Grid>
    </>
  )
}

export default EventPage;