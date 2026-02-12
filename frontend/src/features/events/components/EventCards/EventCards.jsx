import { Flex, Group, Grid, Stack, Card, Text, Badge, Button, Pagination } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import classes from "./EventCards.module.css";
import { useEvents } from "../../hooks/useEvents";
import { Link } from "react-router-dom";
import { useTeam } from "@/features/teams/hooks/useTeam"
import dayjs from "dayjs";

export function EventCards() {
  const { events, page, pageSize, totalPages, loading, error } = useEvents();
  const { teams } = useTeam();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const cards = events.map((event) => (
    <Grid.Col key={event.id} span={{ base: 12, sm: 12, md: 6, lg: 4 }}>
      <Card
        shadow="md"
        radius="lg"
        padding="lg"
        withBorder
        className={classes.card}
        m="sm"
      >
        <Link to={`/events/${event.id}`}>
        <Stack gap="sm">
          <Group>
            <Badge radius="sm" size="sm" color="blue">{event.sports.name}</Badge>
            <Text fz="xs" c="dimmed">
              {event.name}
            </Text>
          </Group>
          <Group gap="sm" align="center">
            <img
              src={event.teams[0]?.logo_url}
              alt={event.teams[0]?.name}
              width={28}
              height={28}
              className={classes.teamLogo}
            />
            <Text fz="md" fw={600}>
              {event.teams[0]?.name}
            </Text>
          </Group>

          <Group gap="sm" align="center">
            <img
              src={event.teams[1]?.logo_url}
              alt={event.teams[1]?.name}
              width={28}
              height={28}
              className={classes.teamLogo}
            />
            <Text fz="md" fw={600}>
              {event.teams[1]?.name}
            </Text>
          </Group>
          <Text fz="xs" c="dimmed">
            {dayjs(event.start_time).format("DD MMM, HH:mm")}
          </Text>
          <Group direction="column" spacing="xs" radius="md" grow mt="md">
            <Button className="odd-button" fullWidth variant="light" color="blue" radius="md" size="sm"
              leftSection={"1W"}>
              <Text className="odd-text">1</Text>
            </Button>
            <Button className="odd-button" fullWidth variant="light" color="blue" radius="md" size="sm"
              leftSection={"X"}>
              <Text className="odd-text">2</Text>
            </Button>
            <Button className="odd-button" fullWidth variant="light" color="blue" radius="md" size="sm"
              leftSection={"2W"}>
              <Text className="odd-text">3</Text>
            </Button>
          </Group>
        </Stack>
        </Link>
      </Card>
    </Grid.Col>
  ));

  return (
    <>
      <Flex direction="column" justify="center">
        <Grid gutter={isMobile ? 'xs' : 'md'}>
          {cards}
        </Grid>
        <Flex justify="center" align="center"> 
          <Pagination total={totalPages} />
        </Flex>
      </Flex>
    </>
  );
}