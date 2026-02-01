import Header from '@/components/layout/Header/Header';
<<<<<<< HEAD
import Navbar from '@/components/layout/Navbar/Navbar';
=======
import { Navbar } from '@/components/layout/Navbar/Navbar';
>>>>>>> main
import { CarouselCard } from '@/components/CarouselCard/CarouselCard';
import { Grid, Stack, Drawer } from '@mantine/core';
import { EventCards } from '@/features/events/components/EventCards/EventCards';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';

function HomePage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
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
            <CarouselCard />
            <EventCards />
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default HomePage;