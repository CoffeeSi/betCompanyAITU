import { Card, Group, Avatar, Stack, Text, Badge, Button } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import styles from './ProfileHeader.module.css';

export function ProfileHeader({ user }) {
  if (!user) return null;

  return (
    <Card className={styles.profileHeader} p="lg" mb="md">
      <Group justify="space-between" align="flex-start">
        <Group>
          <Avatar size={80} radius="xl" className={styles.avatar}>
            {user?.full_name?.charAt(0) || 'U'}
          </Avatar>
          <Stack gap="xs">
            <Text className={styles.userName} size="xl" fw={700}>
              {user?.full_name || 'User'}
            </Text>
            <Text className={styles.userEmail} size="sm" c="dimmed">
              {user?.email}
            </Text>
            <Badge className={styles.roleBadge} size="sm">
              {user?.role || 'user'}
            </Badge>
          </Stack>
        </Group>
        <Button
          variant="light"
          leftSection={<IconSettings size={16} />}
          className={styles.settingsButton}
        >
          Settings
        </Button>
      </Group>
    </Card>
  );
}
