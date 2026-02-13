import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Group,
  Text,
  Button,
  Select,
  Badge,
  Loader,
  Alert,
  Modal,
  Radio,
  Divider
} from '@mantine/core';
import { IconCheck, IconX, IconAlertCircle, IconTrophy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { api } from '@/shared/api/request';
import styles from './AdminDashboard.module.css';

export function EventSettlement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [settleLoading, setSettleLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const ongoingResponse = await api.get('/events?page=1&page_size=100&status=ongoing');
      const ongoingEvents = Array.isArray(ongoingResponse.data.events) ? ongoingResponse.data.events : [];
      
      const completedResponse = await api.get('/events?page=1&page_size=100&status=completed');
      const completedEvents = Array.isArray(completedResponse.data.events) ? completedResponse.data.events : [];
      
      const allActiveEvents = [...ongoingEvents, ...completedEvents];
      setEvents(allActiveEvents);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load events',
        color: 'red',
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenSettlement = async (event) => {
    setSelectedEvent(event);
    setSettleLoading(true);
    try {
      const response = await api.get(`/events/${event.id}/outcomes`);
      setOutcomes(Array.isArray(response.data) ? response.data : []);
      setSelectedOutcomes({});
      setModalOpen(true);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load event outcomes',
        color: 'red',
      });
      setOutcomes([]);
    } finally {
      setSettleLoading(false);
    }
  };

  const handleSettleEvent = async () => {
    if (Object.keys(selectedOutcomes).length === 0) {
      notifications.show({
        title: 'Warning',
        message: 'Please select winning outcomes for all markets',
        color: 'orange',
      });
      return;
    }

    setSettleLoading(true);
    try {
      await api.patch(`/events/${selectedEvent.id}/status`, { status: 'completed' });
      
      await api.post(`/events/${selectedEvent.id}/settle`, {
        winning_outcome_ids: Object.values(selectedOutcomes)
      });

      notifications.show({
        title: 'Success',
        message: 'Event completed and bets settled successfully',
        color: 'green',
        icon: <IconCheck />,
      });

      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to complete and settle event',
        color: 'red',
      });
    } finally {
      setSettleLoading(false);
    }
  };

  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      await api.patch(`/events/${eventId}/status`, { status: newStatus });

      notifications.show({
        title: 'Success',
        message: `Event status updated to ${newStatus}`,
        color: 'blue',
      });

      fetchEvents();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update event status',
        color: 'red',
      });
    }
  };


  const marketGroups = outcomes.reduce((acc, outcome) => {
    const marketId = outcome.market_id;
    if (!acc[marketId]) {
      acc[marketId] = {
        market_type: outcome.markets?.market_type || 'Unknown',
        outcomes: []
      };
    }
    acc[marketId].outcomes.push(outcome);
    return acc;
  }, {});

  return (
    <Stack gap="md">
      <Card className={styles.statsCard} p="lg">
        <Group justify="space-between" mb="md">
          <Group>
            <IconTrophy size={24} color="#4a9eff" />
            <Text size="lg" fw={700}>Event Settlement</Text>
          </Group>
          <Button onClick={fetchEvents} loading={loading} size="xs">
            Refresh
          </Button>
        </Group>

        {loading ? (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        ) : events.length === 0 ? (
          <Alert icon={<IconAlertCircle />} color="gray">
            No active events found
          </Alert>
        ) : (
          <Stack gap="sm">
            {events.map((event) => (
              <Card key={event.id} className={styles.managementCard} withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text fw={600} size="md">{event.name}</Text>
                    <Group gap="xs">
                      <Badge
                        color={
                          event.status === 'completed' ? 'gray' :
                          event.status === 'ongoing' ? 'red' : 'blue'
                        }
                        variant="filled"
                        size="sm"
                      >
                        {event.status}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        {dayjs(event.start_time).format('DD MMM YYYY, HH:mm')}
                      </Text>
                    </Group>
                  </Stack>

                  <Group gap="xs">
                    {event.status === 'scheduled' && (
                      <Button
                        size="xs"
                        color="red"
                        variant="light"
                        onClick={() => handleUpdateStatus(event.id, 'ongoing')}
                      >
                        Start Event
                      </Button>
                    )}
                    {event.status === 'ongoing' && (
                      <Button
                        size="xs"
                        color="green"
                        leftSection={<IconTrophy size={14} />}
                        onClick={() => handleOpenSettlement(event)}
                      >
                        Complete & Settle
                      </Button>
                    )}
                    {event.status === 'completed' && (
                      <Button
                        size="xs"
                        color="orange"
                        variant="light"
                        leftSection={<IconX size={14} />}
                        onClick={() => handleUpdateStatus(event.id, 'ongoing')}
                      >
                        Undo Settlement
                      </Button>
                    )}
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Card>

      {/* Settlement Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={
          <Group>
            <IconTrophy size={20} color="#4a9eff" />
            <Text fw={700}>Complete & Settle: {selectedEvent?.name}</Text>
          </Group>
        }
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle />} color="blue">
            Select the winning outcomes for each market. The event will be marked as completed and all bets will be automatically settled.
          </Alert>

          {Object.entries(marketGroups).map(([marketId, { market_type, outcomes: marketOutcomes }]) => (
            <Card key={marketId} withBorder p="md">
              <Group justify="space-between" mb="sm">
                <Text fw={600} tt="capitalize">
                  {market_type?.replace(/_/g, ' ')}
                </Text>
                {selectedOutcomes[marketId] && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => setSelectedOutcomes(prev => {
                      const updated = { ...prev };
                      delete updated[marketId];
                      return updated;
                    })}
                  >
                    Clear
                  </Button>
                )}
              </Group>
              <Radio.Group
                value={selectedOutcomes[marketId]?.toString() || ''}
                onChange={(value) => {
                  const currentValue = selectedOutcomes[marketId]?.toString();
                  if (currentValue === value) {
                    setSelectedOutcomes(prev => {
                      const updated = { ...prev };
                      delete updated[marketId];
                      return updated;
                    });
                  } else {
                    setSelectedOutcomes(prev => ({ ...prev, [marketId]: value ? parseInt(value) : null }));
                  }
                }}
              >
                <Stack gap="xs">
                  {marketOutcomes.map((outcome) => (
                    <Radio
                      key={outcome.id}
                      value={outcome.id.toString()}
                      label={
                        <Group gap="xs">
                          <Badge size="md" variant="light">
                            Odds: {outcome.odds.toFixed(2)}
                          </Badge>
                          <Text size="sm">
                            {outcome.teams?.name || outcome.result}
                          </Text>
                        </Group>
                      }
                    />
                  ))}
                </Stack>
              </Radio.Group>
            </Card>
          ))}

          <Divider />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={settleLoading}
            >
              Cancel
            </Button>
            <Button
              color="green"
              leftSection={<IconCheck size={16} />}
              onClick={handleSettleEvent}
              loading={settleLoading}
            >
              Settle Event & Calculate Bets
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
