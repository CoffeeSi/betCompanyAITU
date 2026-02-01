import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { Button, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './CarouselCard.module.css';

function Card({ image, title, category }) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          {category}
        </Text>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
    </Paper>
  );
}

const data = [
  {
    image:
      'https://c.ndtvimg.com/2023-03/kt974bqo_cristiano-ronaldo_625x300_24_March_23.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=675',
    title: '',
    category: 'football',
    key: '1',
  },
  {
    image:
      'https://sportshub.cbsistatic.com/i/r/2026/01/30/93dcee9e-2367-40cc-80da-c7253dc549a7/thumbnail/770x433/b1a41c8b6d378550ed94233e5196612a/aj-dybantsa.jpg',
    title: '',
    category: 'basketball',
    key: '2',
  },
  {
    image:
      'https://sportshub.cbsistatic.com/i/r/2026/01/31/32f0d8c2-32a8-476d-8a34-cfdb705411ab/thumbnail/770x433/8943cf7c5d0b9467c6caf64b9800520e/volkanovski-lopes-ufc-imagn-images.jpg',
    title: '',
    category: 'mma',
    key: '3',
  },
  {
    image:
      'https://a.espncdn.com/combiner/i?img=/photo/2026/0131/r1608404_1296x729_16-9.jpg',
    title: '',
    category: 'football',
    key: '4',
  },
];

export function CarouselCard() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = data.map((item) => {
    const { key, ...cardProps } = item;
    return (
      <Carousel.Slide key={key || item.title}>
        <Card {...cardProps} />
      </Carousel.Slide>
    );
  });

  return (
    <Carousel
      slideSize={{ base: '100%', sm: '50%' }}
      slideGap={2}
      emblaOptions={{ align: 'start', slidesToScroll: 1 }}
      nextControlProps={{ 'aria-label': 'Next slide' }}
      previousControlProps={{ 'aria-label': 'Previous slide' }}
    >
      {slides}
    </Carousel>
  );
}