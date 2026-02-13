import { Flex, Group, Grid, Stack, Card, Text, Badge, Pagination, Loader } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import classes from "./EventCards.module.css";
import { useEvents } from "../../hooks/useEvents";
import { useBetSlip } from "@/features/bets/store/betSlipStore";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const STATUS_CONFIG = {
  scheduled: { color: 'blue', label: 'Upcoming' },
  ongoing: { color: 'red', label: 'LIVE' },
  completed: { color: 'gray', label: 'Completed' },
};

function getMatchWinnerOutcomes(event) {
  const mwMarket = event.markets?.find(m => m.market_type === 'match_winner');
  if (!mwMarket || !mwMarket.outcomes?.length) return null;

  const homeTeamId = event.teams?.[0]?.id;
  const awayTeamId = event.teams?.[1]?.id;

  let home = null, draw = null, away = null;

  for (const o of mwMarket.outcomes) {
    if (o.result === 'draw' || (!o.team_id && !o.teams?.id)) {
      draw = o;
    } else if (o.team_id === homeTeamId || o.teams?.id === homeTeamId) {
      home = o;
    } else if (o.team_id === awayTeamId || o.teams?.id === awayTeamId) {
      away = o;
    }
  }

  return { home, draw, away, market: mwMarket };
}

export function EventCards({ sportId }) {
  const { events, page, setPage, totalPages, loading, error } = useEvents(sportId);
  const { addSelection, isSelected } = useBetSlip();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleOddsClick = (e, outcome, market, event) => {
    e.preventDefault(); // Prevent navigation to event page
    e.stopPropagation();

    if (!outcome || market.status !== 'active') return;

    const label = outcome === getMatchWinnerOutcomes(event)?.home ? 'Home'
      : outcome === getMatchWinnerOutcomes(event)?.away ? 'Away' : 'Draw';

    addSelection({
      outcomeId: outcome.id,
      marketId: market.id,
      odds: outcome.odds,
      marketType: market.market_type,
      eventName: event.name || `${event.teams?.[0]?.name} vs ${event.teams?.[1]?.name}`,
      teamName: label,
      eventId: event.id,
    });
    notifications.show({
      title: 'Added to Bet Slip',
      message: `${label} @ ${outcome.odds.toFixed(2)}`,
      color: 'blue',
      autoClose: 2000,
    });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" p="xl">
        <Loader size="lg" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" p="xl">
        <Text c="red">{error}</Text>
      </Flex>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Flex justify="center" p="xl">
        <Text c="dimmed">No events found</Text>
      </Flex>
    );
  }
  
  const cards = events.map((event) => {
    const statusCfg = STATUS_CONFIG[event.status] || STATUS_CONFIG.scheduled;
    const mw = getMatchWinnerOutcomes(event);
    const isCompleted = event.status === 'completed';
    const marketActive = mw?.market?.status === 'active' && !isCompleted;

    return (
      <Grid.Col key={event.id} span={{ base: 12, sm: 12, md: 6, lg: 4 }}>
        <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
          <Card
            shadow="md"
            radius="lg"
            padding="lg"
            withBorder
            className={classes.card}
            m="sm"
          >
            <Stack gap="sm">
              <Group justify="space-between">
                <Group gap="xs">
                  <Badge radius="sm" size="sm" color="blue">{event.sports?.name}</Badge>
                </Group>
                <Badge
                  radius="sm"
                  size="sm"
                  color={statusCfg.color}
                  variant={event.status === 'ongoing' ? 'filled' : 'light'}
                  className={event.status === 'ongoing' ? classes.liveBadge : undefined}
                >
                  {statusCfg.label}
                </Badge>
              </Group>

              <Text fz="xs" c="dimmed">
                {event.name}
              </Text>

              <Group gap="sm" align="center">
                <img
                  src={event.teams?.[0]?.logo_url}
                  alt={event.teams?.[0]?.name}
                  width={28}
                  height={28}
                  className={classes.teamLogo}
                />
                <Text fz="md" fw={600}>
                  {event.teams?.[0]?.name}
                </Text>
              </Group>

              <Group gap="sm" align="center">
                <img
                  src={event.teams?.[1]?.logo_url}
                  alt={event.teams?.[1]?.name}
                  width={28}
                  height={28}
                  className={classes.teamLogo}
                />
                <Text fz="md" fw={600}>
                  {event.teams?.[1]?.name}
                </Text>
              </Group>

              <Text fz="xs" c="dimmed">
                {dayjs(event.start_time).format("DD MMM, HH:mm")}
              </Text>

              {/* Match Winner Odds: 1W / X / 2W */}
              {/* <Group gap="xs" grow mt="xs">
                {mw ? (
                  <>
                    <button
                      type="button"
                      className={`${classes.oddsBtn} ${mw.home && isSelected(mw.home.id) ? classes.oddsBtnSelected : ''} ${!marketActive ? classes.oddsBtnDisabled : ''}`}
                      onClick={(e) => handleOddsClick(e, mw.home, mw.market, event)}
                      disabled={!marketActive || !mw.home}
                    >
                      <span className={classes.oddsLabel}>1W</span>
                      <span className={classes.oddsVal}>{mw.home?.odds?.toFixed(2) ?? '—'}</span>
                    </button>
                    <button
                      type="button"
                      className={`${classes.oddsBtn} ${mw.draw && isSelected(mw.draw.id) ? classes.oddsBtnSelected : ''} ${!marketActive ? classes.oddsBtnDisabled : ''}`}
                      onClick={(e) => handleOddsClick(e, mw.draw, mw.market, event)}
                      disabled={!marketActive || !mw.draw}
                    >
                      <span className={classes.oddsLabel}>X</span>
                      <span className={classes.oddsVal}>{mw.draw?.odds?.toFixed(2) ?? '—'}</span>
                    </button>
                    <button
                      type="button"
                      className={`${classes.oddsBtn} ${mw.away && isSelected(mw.away.id) ? classes.oddsBtnSelected : ''} ${!marketActive ? classes.oddsBtnDisabled : ''}`}
                      onClick={(e) => handleOddsClick(e, mw.away, mw.market, event)}
                      disabled={!marketActive || !mw.away}
                    >
                      <span className={classes.oddsLabel}>2W</span>
                      <span className={classes.oddsVal}>{mw.away?.odds?.toFixed(2) ?? '—'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Badge size="lg" variant="light" color="gray" radius="md">1W</Badge>
                    <Badge size="lg" variant="light" color="gray" radius="md">X</Badge>
                    <Badge size="lg" variant="light" color="gray" radius="md">2W</Badge>
                  </>
                )}
              </Group> */}
            </Stack>
          </Card>
        </Link>
      </Grid.Col>
    );
  });

  return (
    <>
      <Flex direction="column" justify="center">
        <Grid gutter={isMobile ? 'xs' : 'md'}>
          {cards}
        </Grid>
        {totalPages > 1 && (
          <Flex justify="center" align="center" mt="md"> 
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
            />
          </Flex>
        )}
      </Flex>
    </>
  );
}