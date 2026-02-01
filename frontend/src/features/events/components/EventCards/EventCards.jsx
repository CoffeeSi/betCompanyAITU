import { Flex, Group, Grid, Stack, Card, Text, Badge, Button, Pagination } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import classes from "./EventCards.module.css";
import { useEvent } from "../../hooks/useEvent";
import dayjs from "dayjs";

export function EventCards() {
  const {events, page, pageSize, totalPages} = useEvent();
  const isMobile = useMediaQuery('(max-width: 768px)');
  

  const cards = events.map((event) => (
    <Grid.Col key={event.ID} span={{ base: 12, sm: 12, md: 6, lg: 4 }}>
      <Card
        shadow="md"
        radius="lg"
        padding="lg"
        withBorder
        className={classes.card}
        m="sm"
      >
        <Stack gap="sm">
          <Group>
            <Badge radius="sm" size="sm" color="blue">{event.sport_id}</Badge>
            <Text fz="xs" c="dimmed">
              {event.name}
            </Text>
          </Group>
          <Group gap="sm" align="center">
            <img
              src={`https://upload.wikimedia.org/wikipedia/commons/5/52/NAVI-Logo.svg`}
              alt={event.team1}
              width={28}
              height={28}
              className={classes.teamLogo}
            />
            <Text fz="md" fw={600}>
              NaVI
            </Text>
          </Group>

          <Group gap="sm" align="center">
            <img
              src={`https://upload.wikimedia.org/wikipedia/ru/4/4f/Virtus.proLogo.png`}
              alt={event.team2}
              width={28}
              height={28}
              className={classes.teamLogo}
            />
            <Text fz="md" fw={600}>
              Virtus Pro
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