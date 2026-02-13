import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Card,
  Table,
  Button,
  Group,
  Text,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  Stack,
  Alert,
  Loader
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconUsers,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useEventTeams } from '../hooks/useEvents';
import { useTeams } from '../hooks/useTeams';
import { useSports } from '../../sports/hooks/useSports';
import styles from './EventsManagement.module.css';

export function EventsManagement() {
  const [selectedSport, setSelectedSport] = useState(null);
  const { events: eventsData, loading, error, pagination, goToPage, setPageSize, refetch } = useEvents(selectedSport || undefined);
  const { sports: sportsData } = useSports();
  const { teams: teamsData, pagination: teamsPagination } = useTeams(selectedSport || undefined);
  
  const events = Array.isArray(eventsData) ? eventsData : [];
  const sports = Array.isArray(sportsData) ? sportsData : [];
  const teams = Array.isArray(teamsData) ? teamsData : [];
  
  const [createModalOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [assignTeamsOpened, { open: openAssign, close: closeAssign }] = useDisclosure(false);
  
  const [editingEvent, setEditingEvent] = useState(null);
  const [assigningEvent, setAssigningEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sport_id: '',
    status: 'scheduled',
    start_time: new Date()
  });
  const [teamAssignment, setTeamAssignment] = useState({
    home_team: '',
    away_team: ''
  });

  const { createEvent, loading: creating } = useCreateEvent();
  const { updateEvent, loading: updating } = useUpdateEvent();
  const { deleteEvent, loading: deleting } = useDeleteEvent();
  const { assignTeam } = useEventTeams();

  const [success, setSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleCreate = async () => {
    setFormError(null);
    
    if (!formData.sport_id) {
      setFormError('Please select a sport');
      return;
    }

    if (!formData.start_time || !(formData.start_time instanceof Date)) {
      setFormError('Please select a valid start time');
      return;
    }

    const result = await createEvent({
      name: formData.name,
      sport_id: parseInt(formData.sport_id),
      status: formData.status,
      start_time: formData.start_time.toISOString()
    });

    if (result.success) {
      setSuccess('Event created successfully');
      closeCreate();
      refetch();
      setFormData({ name: '', sport_id: '', status: 'scheduled', start_time: new Date() });
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to create event');
    }
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;
    
    setFormError(null);

    if (!formData.start_time || !(formData.start_time instanceof Date)) {
      setFormError('Please select a valid start time');
      return;
    }

    const updateData = {
      sport_id: formData.sport_id ? parseInt(formData.sport_id) : undefined,
      status: formData.status,
      start_time: formData.start_time.toISOString()
    };

    if (formData.name && formData.name.trim() !== '') {
      updateData.name = formData.name;
    }

    const result = await updateEvent(editingEvent.id, updateData);

    if (result.success) {
      setSuccess('Event updated successfully');
      closeEdit();
      refetch();
      setEditingEvent(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to update event');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const result = await deleteEvent(id);
    
    if (result.success) {
      setSuccess('Event deleted successfully');
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to delete event');
    }
  };

  const handleAssignTeams = async () => {
    if (!assigningEvent) return;
    
    setFormError(null);

    if (!teamAssignment.home_team || !teamAssignment.away_team) {
      setFormError('Please select both teams');
      return;
    }

    // Используем новый формат API - один запрос с массивом команд
    const result = await assignTeam(assigningEvent.id, {
      teams: [
        {
          event_id: assigningEvent.id,
          team_id: parseInt(teamAssignment.home_team),
          role: 'home'
        },
        {
          event_id: assigningEvent.id,
          team_id: parseInt(teamAssignment.away_team),
          role: 'away'
        }
      ]
    });

    if (!result.success) {
      setFormError(result.error || 'Failed to assign teams');
      return;
    }

    setSuccess('Teams assigned successfully');
    closeAssign();
    refetch();
    setTeamAssignment({ home_team: '', away_team: '' });
    setTimeout(() => setSuccess(null), 3000);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name || '',
      sport_id: event.sport_id.toString(),
      status: event.status,
      start_time: new Date(event.start_time)
    });
    openEdit();
  };

  const openAssignModal = (event) => {
    setAssigningEvent(event);
    openAssign();
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'blue',
      live: 'green',
      completed: 'gray',
      cancelled: 'red',
      postponed: 'yellow'
    };
    return colors[status] || 'gray';
  };

  return (
    <Card className={styles.card} p="lg">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Text size="xl" fw={700}>Events Management</Text>
          <Group>
            <Select
              placeholder="Filter by sport"
              data={sports.map(s => ({ value: s.id.toString(), label: s.name }))}
              value={selectedSport?.toString() || null}
              onChange={(val) => setSelectedSport(val ? parseInt(val) : null)}
              clearable
              style={{ width: 200 }}
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreate}
            >
              Create Event
            </Button>
          </Group>
        </Group>

        {success && (
          <Alert icon={<IconCheck size={16} />} color="green" onClose={() => setSuccess(null)} withCloseButton>
            {success}
          </Alert>
        )}

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {error}
          </Alert>
        )}

        {/* Table */}
        {loading ? (
          <Group justify="center" p="xl">
            <Loader />
          </Group>
        ) : (
          <Table className={styles.table}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Teams</Table.Th>
                <Table.Th>Start Time</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {events.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="xl">
                      No events found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                events.map((event) => (
                  <Table.Tr key={event.id}>
                    <Table.Td>#{event.id}</Table.Td>
                    <Table.Td>{event.name || 'N/A'}</Table.Td>
                    <Table.Td>
                      {event.teams && event.teams.length > 0 ? (
                        <Text size="sm">
                          {event.teams[0].name || 'TBD'} vs{' '}
                          {event.teams[1].name || 'TBD'}
                        </Text>
                      ) : (
                        <Text size="sm" c="dimmed">Not assigned</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(event.start_time).toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(event.status)} variant="light">
                        {event.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => openEditModal(event)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconUsers size={14} />}
                            onClick={() => openAssignModal(event)}
                          >
                            Assign Teams
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDelete(event.id)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && events.length > 0 && (
          <Group justify="space-between" align="center" mt="md" p="md" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
            <Group gap="xs">
              <Text size="sm" fw={500}>Rows per page:</Text>
              <Select
                data={['10', '25', '50', '100']}
                value={pagination.pageSize.toString()}
                onChange={(val) => setPageSize(parseInt(val || '10'))}
                style={{ width: 80 }}
              />
              <Text size="sm" c="dimmed">
                Showing {events.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} - {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
              </Text>
            </Group>
            <Group gap="xs">
              <Button
                variant="default"
                disabled={pagination.page === 1}
                onClick={() => goToPage(pagination.page - 1)}
              >
                Previous
              </Button>
              <Group gap="xs">
                {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? 'filled' : 'default'}
                      onClick={() => goToPage(pageNum)}
                      disabled={pageNum > pagination.totalPages}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </Group>
              <Button
                variant="default"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => goToPage(pagination.page + 1)}
              >
                Next
              </Button>
            </Group>
          </Group>
        )}
      </Stack>

      {/* Create Modal */}
      <Modal opened={createModalOpened} onClose={closeCreate} title="Create Event" size="md">
        <Stack gap="md">
          {formError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {formError}
            </Alert>
          )}
          
          <TextInput
            label="Event Name"
            placeholder="Enter event name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Select
            label="Sport"
            placeholder="Select sport"
            data={sports.map(s => ({ value: s.id.toString(), label: s.name }))}
            value={formData.sport_id}
            onChange={(val) => setFormData({ ...formData, sport_id: val || '' })}
            required
          />

          <DateTimePicker
            label="Start Time"
            value={formData.start_time}
            onChange={(val) => setFormData({ ...formData, start_time: val instanceof Date ? val : new Date() })}
            required
          />

          <Select
            label="Status"
            data={[
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' },
            ]}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val || 'scheduled' })}
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeCreate}>Cancel</Button>
            <Button onClick={handleCreate} loading={creating}>Create</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={editModalOpened} onClose={closeEdit} title="Edit Event" size="md">
        <Stack gap="md">
          {formError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {formError}
            </Alert>
          )}
          
          <TextInput
            label="Event Name"
            placeholder="Enter event name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <Select
            label="Sport"
            placeholder="Select sport"
            data={sports.map(s => ({ value: s.id.toString(), label: s.name }))}
            value={formData.sport_id}
            onChange={(val) => setFormData({ ...formData, sport_id: val || '' })}
          />

          <DateTimePicker
            label="Start Time"
            value={formData.start_time}
            onChange={(val) => setFormData({ ...formData, start_time: val instanceof Date ? val : new Date() })}
          />

          <Select
            label="Status"
            data={[
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' }
            ]}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val || 'scheduled' })}
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeEdit}>Cancel</Button>
            <Button onClick={handleUpdate} loading={updating}>Update</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Assign Teams Modal */}
      <Modal opened={assignTeamsOpened} onClose={closeAssign} title="Assign Teams" size="md">
        <Stack gap="md">
          {formError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {formError}
            </Alert>
          )}
          
          <Select
            label="Home Team"
            placeholder="Select home team"
            data={teams.map(t => ({ value: t.id.toString(), label: t.name }))}
            value={teamAssignment.home_team}
            onChange={(val) => setTeamAssignment({ ...teamAssignment, home_team: val || '' })}
            searchable
          />

          <Select
            label="Away Team"
            placeholder="Select away team"
            data={teams.map(t => ({ value: t.id.toString(), label: t.name }))}
            value={teamAssignment.away_team}
            onChange={(val) => setTeamAssignment({ ...teamAssignment, away_team: val || '' })}
            searchable
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeAssign}>Cancel</Button>
            <Button onClick={handleAssignTeams}>Assign</Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}