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
  Select,
  Stack,
  Alert,
  Loader,
  Badge,
  Avatar
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconDots,
  IconCheck,
  IconAlertCircle,
  IconShield
} from '@tabler/icons-react';
import { useUsers, useAssignRole, useDeleteUser } from '../hooks/useUsers';
import styles from './UsersManagement.module.css';

export function UsersManagement() {
  const [roleFilter, setRoleFilter] = useState(null);
  const { users: usersData, loading, error, refetch } = useUsers(
    roleFilter ? { role: roleFilter } : undefined
  );
  
  const users = Array.isArray(usersData) ? usersData : [];
  
  const [roleModalOpened, { open: openRoleModal, close: closeRoleModal }] = useDisclosure(false);
  
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const { assignRole, loading: assigning } = useAssignRole();
  const { deleteUser, loading: deleting } = useDeleteUser();

  const [success, setSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleAssignRole = async () => {
    if (!editingUser || !selectedRole) return;
    
    setFormError(null);

    const result = await assignRole(
      editingUser.id,
      selectedRole
    );

    if (result.success) {
      setSuccess('Role assigned successfully');
      closeRoleModal();
      refetch();
      setEditingUser(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to assign role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const result = await deleteUser(id);
    
    if (result.success) {
      setSuccess('User deleted successfully');
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setFormError(result.error || 'Failed to delete user');
    }
  };

  const openRoleChangeModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    openRoleModal();
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'red',
      moderator: 'orange',
      user: 'blue'
    };
    return colors[role] || 'gray';
  };

  return (
    <Card className={styles.card} p="lg">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Text size="xl" fw={700}>Users Management</Text>
          <Select
            placeholder="Filter by role"
            data={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' },
              { value: 'moderator', label: 'Moderator' }
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
            clearable
            style={{ width: 200 }}
          />
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
                <Table.Th>User</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Joined</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">
                      No users found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                users.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>#{user.id}</Table.Td>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size="sm" radius="xl">
                          {user.full_name.charAt(0)}
                        </Avatar>
                        <Text fw={600}>{user.full_name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{user.email}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{user.phone || 'N/A'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getRoleBadgeColor(user.role)}
                        variant="light"
                        leftSection={user.role === 'admin' ? <IconShield size={12} /> : undefined}
                      >
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(user.start_time).toLocaleDateString()}
                      </Text>
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
                            leftSection={<IconShield size={14} />}
                            onClick={() => openRoleChangeModal(user)}
                          >
                            Change Role
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDelete(user.id)}
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
      </Stack>

      {/* Assign Role Modal */}
      <Modal opened={roleModalOpened} onClose={closeRoleModal} title="Assign Role" size="sm">
        <Stack gap="md">
          {formError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {formError}
            </Alert>
          )}

          {editingUser && (
            <Card className={styles.userCard} p="md">
              <Group>
                <Avatar size="md" radius="xl">
                  {editingUser.full_name.charAt(0)}
                </Avatar>
                <Stack gap={2}>
                  <Text fw={600}>{editingUser.full_name}</Text>
                  <Text size="sm" c="dimmed">{editingUser.email}</Text>
                </Stack>
              </Group>
            </Card>
          )}
          
          <Select
            label="Select Role"
            placeholder="Choose a role"
            data={[
              { value: 'user', label: 'User' },
              { value: 'moderator', label: 'Moderator' },
              { value: 'admin', label: 'Administrator' }
            ]}
            value={selectedRole}
            onChange={(val) => setSelectedRole(val || '')}
            required
          />

          <Alert color="yellow" variant="light">
            <Text size="xs">
              Changing a user's role will affect their permissions immediately.
            </Text>
          </Alert>

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeRoleModal}>Cancel</Button>
            <Button onClick={handleAssignRole} loading={assigning}>Assign Role</Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}