import {
  Badge,
  Button,
  type ButtonProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  type CardProps,
  Container,
  HStack,
  Input,
  type InputProps,
  Select,
  Stack,
} from '@arcana-ui/core';
import { useState } from 'react';

// Exercise the type exports at compile time. If these are missing from the
// package, tsc will fail the example build and the consumer test fails too.
const _buttonVariants: NonNullable<ButtonProps['variant']>[] = [
  'primary',
  'secondary',
  'ghost',
  'destructive',
  'outline',
];
const _cardProbe: Pick<CardProps, 'className'> = {};
const _inputProbe: Pick<InputProps, 'placeholder'> = {};
void _buttonVariants;
void _cardProbe;
void _inputProbe;

const THEMES = [
  'light',
  'dark',
  'terminal',
  'retro98',
  'glass',
  'brutalist',
  'corporate',
  'startup',
  'editorial',
  'commerce',
  'midnight',
  'nature',
  'neon',
  'mono',
] as const;

const DENSITIES = ['compact', 'comfortable', 'spacious'] as const;

type Theme = (typeof THEMES)[number];
type Density = (typeof DENSITIES)[number];

export function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [density, setDensity] = useState<Density>('comfortable');
  const [name, setName] = useState('');
  const [flavor, setFlavor] = useState('vanilla');

  // Drive theme/density purely through root attributes. No component
  // re-render, no CSS re-import — this is the Arcana theming contract.
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-density', density);

  return (
    <Container size="lg" padding="lg">
      <Stack gap="lg">
        <header>
          <h1 style={{ margin: 0 }}>Arcana UI — Quickstart</h1>
          <p style={{ color: 'var(--color-fg-muted)' }}>
            Minimal Vite + React consumer of @arcana-ui/core and @arcana-ui/tokens.
          </p>
        </header>

        <Card>
          <CardHeader>
            <strong>Theme</strong>
            <Badge>{theme}</Badge>
          </CardHeader>
          <CardBody>
            <HStack gap="sm" wrap>
              {THEMES.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={t === theme ? 'primary' : 'outline'}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </Button>
              ))}
            </HStack>
          </CardBody>
          <CardFooter>
            <HStack gap="sm">
              <span>Density:</span>
              {DENSITIES.map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={d === density ? 'primary' : 'ghost'}
                  onClick={() => setDensity(d)}
                >
                  {d}
                </Button>
              ))}
            </HStack>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <strong>Button variants</strong>
          </CardHeader>
          <CardBody>
            <HStack gap="sm" wrap>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
            </HStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <strong>Form controls</strong>
          </CardHeader>
          <CardBody>
            <Stack gap="md">
              <Input
                label="Your name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Select
                label="Flavor"
                value={flavor}
                onChange={(value) => setFlavor(value)}
                options={[
                  { value: 'vanilla', label: 'Vanilla' },
                  { value: 'chocolate', label: 'Chocolate' },
                  { value: 'strawberry', label: 'Strawberry' },
                ]}
              />
            </Stack>
          </CardBody>
          <CardFooter>
            <span style={{ color: 'var(--color-fg-muted)' }}>
              Hello {name || 'friend'}, enjoy your {flavor}.
            </span>
          </CardFooter>
        </Card>
      </Stack>
    </Container>
  );
}
