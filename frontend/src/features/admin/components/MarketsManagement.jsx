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
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react';
import { useMarkets, useCreateMarket, useUpdateMarket, useDeleteMarket } from '../hooks/useMarkets';
import { useEvents } from '../hooks/useEvents';
import styles from './MarketsManagement.module.css';

export function MarketsManagement() {
  const { markets: marketsData, loading, error, pagination, goToPage, setPageSize, refetch } = useMarkets();
  const { events } = useEvents();
  
  const markets = Array.isArray(marketsData) ? marketsData : [];
  
  const [createModalOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  
  const [editingMarket, setEditingMarket] = useState(null);
  const [formData, setFormData] = useState({
    event_id: '',
    market_type: '',
    status: 'active'
  });

  const { createMarket, loading: creating } = useCreateMarket();
  const { updateMarket, loading: updating } = useUpdateMarket();
  const { deleteMarket, loading: deleting } = useDeleteMarket();

  const handleCreate = () => {
    setFormData({
      event_id: '',
      market_type: '',
      status: 'active'
    });
    openCreate();
  };

  const handleEdit = (market) => {
    setEditingMarket(market);
    setFormData({
      event_id: market.event_id,
      market_type: market.market_type,
      status: market.status
    });
    openEdit();
  };

  const handleDelete = async (marketId) => {
    if (confirm('Are you sure you want to delete this market?')) {
      const result = await deleteMarket(marketId);
      if (result.success) {
        refetch();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      event_id: parseInt(formData.event_id, 10) || 0,
    };

    if (editingMarket) {
      const result = await updateMarket(editingMarket.id, payload);
      if (result.success) {
        refetch();
        closeEdit();
      }
    } else {
      const result = await createMarket(payload);
      if (result.success) {
        refetch();
        closeCreate();
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'green',
      closed: 'red',
      suspended: 'yellow'
    };
    return <Badge color={colors[status] || 'gray'}>{status}</Badge>;
  };

  return (
    <Card>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={700}>Markets Management</Text>
            <Text size="sm" c="dimmed">Manage betting markets and outcomes</Text>
          </div>
          <Button 
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
          >
            Add Market
          </Button>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Markets Table */}
        {loading ? (
          <Group justify="center" p="xl">
            <Loader />
          </Group>
        ) : markets.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">
            No markets found. Create your first market to get started.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Event</Table.Th>
                <Table.Th>Market Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Outcomes</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {markets.map((market) => (
                <Table.Tr key={market.id}>
                  <Table.Td>{market.id}</Table.Td>
                  <Table.Td>{market.event_name || 'N/A'}</Table.Td>
                  <Table.Td>{market.market_type}</Table.Td>
                  <Table.Td>{getStatusBadge(market.status)}</Table.Td>
                  <Table.Td>{market.outcomes_count || 0}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon 
                        variant="subtle" 
                        color="blue"
                        onClick={() => handleEdit(market)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red"
                        onClick={() => handleDelete(market.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && markets.length > 0 && (
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
                Showing {markets.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} - {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
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

        {/* Create Modal */}
        <Modal
          opened={createModalOpened}
          onClose={closeCreate}
          title="Create Market"
          size="md"
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Event ID"
                placeholder="Enter event ID"
                value={formData.event_id}
                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                required
              />
              <TextInput
                label="Market Type"
                placeholder="e.g., Match Winner, Over/Under"
                value={formData.market_type}
                onChange={(e) => setFormData({ ...formData, market_type: e.target.value })}
                required
              />
              <Select
                label="Status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'closed', label: 'Closed' },
                  { value: 'suspended', label: 'Suspended' }
                ]}
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value })}
                required
              />
              <Group justify="flex-end" mt="md">
                <Button variant="subtle" onClick={closeCreate}>Cancel</Button>
                <Button type="submit">Create Market</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          opened={editModalOpened}
          onClose={closeEdit}
          title="Edit Market"
          size="md"
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Event ID"
                placeholder="Enter event ID"
                value={formData.event_id}
                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                required
              />
              <TextInput
                label="Market Type"
                placeholder="e.g., Match Winner, Over/Under"
                value={formData.market_type}
                onChange={(e) => setFormData({ ...formData, market_type: e.target.value })}
                required
              />
              <Select
                label="Status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'closed', label: 'Closed' },
                  { value: 'suspended', label: 'Suspended' }
                ]}
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value })}
                required
              />
              <Group justify="flex-end" mt="md">
                <Button variant="subtle" onClick={closeEdit}>Cancel</Button>
                <Button type="submit">Update Market</Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Card>
  );
}
