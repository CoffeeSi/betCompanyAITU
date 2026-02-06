import { useEvent } from "@/features/events/hooks/useEvent";
import { Grid, Stack, Drawer } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Header from '@/components/layout/Header/Header';
import Navbar from '@/components/layout/Navbar/Navbar';

function EventPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const { events, loading, error } = useEvent();
  const [opened, { toggle, close }] = useDisclosure(false);
  

  return (
    <>
      <Header onBurgerClick={toggle} burgerOpened={opened} />
      <Drawer
        opened={opened}
        onClose={close}
        size="xs"
        padding="md"
        title="Menu"
        hiddenFrom="sm"
      >
        <Navbar onNavigate={close} />
      </Drawer>
      <Grid gutter={0}>
        {!isMobile && (
          <Grid.Col span={{ base: 0, sm: 3, md: 2 }}>
            <Navbar />
          </Grid.Col>
        )}
        <Grid.Col span={{ base: 12, sm: 9, md: 10 }}>
          <Stack justify="center" m={isMobile ? 'xs' : isTablet ? 'md' : 'xl'}>
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default EventPage;
