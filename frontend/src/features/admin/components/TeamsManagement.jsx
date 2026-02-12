import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Card,
  Table,
  Button,
  Group,
  Text,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  Stack,
  Alert,
  Loader,
  Avatar
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react';
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from '../hooks/useTeams';
import { useSports } from '../../sports/hooks/useSports';
import styles from './TeamsManagement.module.css';

export function TeamsManagement() {
  const [selectedSport, setSelectedSport] = useState(null);
  const { teams: teamsData, loading, error, pagination, goToPage, setPageSize, refetch } = useTeams(selectedSport || undefined);
  const { sports: sportsData } = useSports();
  
  // Ensure teams and sports are always arrays
  const teams = Array.isArray(teamsData) ? teamsData : [];
  const sports = Array.isArray(sportsData) ? sportsData : [];
  
  // Modals
  const [createModalOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  
  // Forms
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    sport_id: ''
  });

  // Hooks
  const { createTeam, loading: creating } = useCreateTeam();
  const { updateTeam, loading: updating } = useUpdateTeam();
  const { deleteTeam, loading: deleting } = useDeleteTeam();

  const [success, setSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleCreate = async () => {
    setFormError(null);
    
    if (!formData.name || !formData.sport_id) {
      setFormError('Please fill all required fields');
      return;
    }

    const result = await createTeam({
      name: formData.name,
      logo_url: formData.logo_url || undefined,
      sport_id: parseInt(formData.sport_id)
    });

    if (result.success) {
      setSuccess('Team created successfully');
      closeCreate();
      refetch();
      setFormData({ name: '', logo_url: '', sport_id: '' });
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to create team');
    }
  };

  const handleUpdate = async () => {
    if (!editingTeam) return;
    
    setFormError(null);

    const result = await updateTeam(editingTeam.id, {
      name: formData.name || undefined,
      logo_url: formData.logo_url || undefined,
      sport_id: formData.sport_id ? parseInt(formData.sport_id) : undefined
    });

    if (result.success) {
      setSuccess('Team updated successfully');
      closeEdit();
      refetch();
      setEditingTeam(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to update team');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    const result = await deleteTeam(id);
    
    if (result.success) {
      setSuccess('Team deleted successfully');
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to delete team');
    }
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      logo_url: team.logo_url || '',
      sport_id: team.sport_id.toString()
    });
    openEdit();
  };

  return (
    <Card className={styles.card} p="lg">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Text size="xl" fw={700}>Teams Management</Text>
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
              Create Team
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
                <Table.Th>Logo</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Sport</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {teams.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">
                      No teams found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                teams.map((team) => (
                  <Table.Tr key={team.id}>
                    <Table.Td>#{team.id}</Table.Td>
                    <Table.Td>
                      <Avatar
                        src={team.logo_url}
                        alt={team.name}
                        size="sm"
                        radius="xl"
                      >
                        {team.name.charAt(0)}
                      </Avatar>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={600}>{team.name}</Text>
                    </Table.Td>
                    <Table.Td>{team.sports?.name || 'N/A'}</Table.Td>
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
                            onClick={() => openEditModal(team)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDelete(team.id)}
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
        {!loading && teams.length > 0 && (
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
                Showing {teams.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} - {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
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
      <Modal opened={createModalOpened} onClose={closeCreate} title="Create Team" size="md">
        <Stack gap="md">
          {formError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {formError}
            </Alert>
          )}
          
          <TextInput
            label="Team Name"
            placeholder="Enter team name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <TextInput
            label="Logo URL"
            placeholder="https://example.com/logo.png"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          />

          <Select
            label="Sport"
            placeholder="Select sport"
            data={sports.map(s => ({ value: s.id.toString(), label: s.name }))}
            value={formData.sport_id}
            onChange={(val) => setFormData({ ...formData, sport_id: val || '' })}
            required
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeCreate}>Cancel</Button>
            <Button onClick={handleCreate} loading={creating}>Create</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={editModalOpened} onClose={closeEdit} title="Edit Team" size="md">
        <Stack gap="md">
          {formError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {formError}
            </Alert>
          )}
          
          <TextInput
            label="Team Name"
            placeholder="Enter team name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextInput
            label="Logo URL"
            placeholder="https://example.com/logo.png"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          />

          <Select
            label="Sport"
            placeholder="Select sport"
            data={sports.map(s => ({ value: s.id.toString(), label: s.name }))}
            value={formData.sport_id}
            onChange={(val) => setFormData({ ...formData, sport_id: val || '' })}
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeEdit}>Cancel</Button>
            <Button onClick={handleUpdate} loading={updating}>Update</Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}