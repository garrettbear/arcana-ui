/**
 * ComponentThumbnail — small visual preview of a component for the gallery grid.
 * Renders a simplified version of each component at thumbnail size.
 */

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Pagination,
  ProgressBar,
  Radio,
  Select,
  Skeleton,
  Spinner,
  Toggle,
} from '@arcana-ui/core';

interface ThumbnailProps {
  slug: string;
}

export function ComponentThumbnail({ slug }: ThumbnailProps) {
  const wrapStyle: React.CSSProperties = {
    transform: 'scale(0.75)',
    transformOrigin: 'center',
    pointerEvents: 'none',
  };

  switch (slug) {
    case 'button':
      return (
        <div style={{ ...wrapStyle, display: 'flex', gap: '4px' }}>
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
        </div>
      );
    case 'badge':
      return (
        <div style={{ ...wrapStyle, display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <Badge size="sm">Default</Badge>
          <Badge size="sm" variant="success">
            Success
          </Badge>
          <Badge size="sm" variant="error">
            Error
          </Badge>
          <Badge size="sm" variant="info">
            Info
          </Badge>
        </div>
      );
    case 'input':
      return (
        <div style={{ ...wrapStyle, width: '180px' }}>
          <Input size="sm" placeholder="Type here..." />
        </div>
      );
    case 'select':
      return (
        <div style={{ ...wrapStyle, width: '180px' }}>
          <Select size="sm">
            <option>Select option...</option>
          </Select>
        </div>
      );
    case 'checkbox':
      return (
        <div style={{ ...wrapStyle, display: 'flex', gap: '8px' }}>
          <Checkbox label="Option A" size="sm" defaultChecked />
          <Checkbox label="Option B" size="sm" />
        </div>
      );
    case 'radio':
      return (
        <div style={{ ...wrapStyle, display: 'flex', gap: '8px' }}>
          <Radio label="Yes" size="sm" name="thumb" defaultChecked />
          <Radio label="No" size="sm" name="thumb" />
        </div>
      );
    case 'toggle':
      return (
        <div style={{ ...wrapStyle, display: 'flex', gap: '8px' }}>
          <Toggle size="sm" label="On" defaultChecked />
          <Toggle size="sm" label="Off" />
        </div>
      );
    case 'avatar':
      return (
        <div style={{ ...wrapStyle, display: 'flex', gap: '4px' }}>
          <Avatar size="sm" initials="AB" />
          <Avatar size="sm" initials="CD" />
          <Avatar size="sm" initials="EF" />
        </div>
      );
    case 'card':
      return (
        <div style={{ ...wrapStyle, width: '160px' }}>
          <Card padding="sm">
            <span style={{ fontSize: '11px' }}>Card content</span>
          </Card>
        </div>
      );
    case 'alert':
      return (
        <div style={{ ...wrapStyle, width: '200px' }}>
          <Alert variant="info" title="Info alert" />
        </div>
      );
    case 'progress-bar':
      return (
        <div
          style={{
            ...wrapStyle,
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <ProgressBar value={75} size="sm" />
          <ProgressBar value={45} size="sm" color="success" />
        </div>
      );
    case 'spinner':
      return (
        <div style={wrapStyle}>
          <Spinner size="md" />
        </div>
      );
    case 'skeleton':
      return (
        <div
          style={{
            ...wrapStyle,
            width: '160px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} />
          <Skeleton width="60%" height={12} />
        </div>
      );
    case 'pagination':
      return (
        <div style={wrapStyle}>
          <Pagination totalPages={5} currentPage={2} onPageChange={() => {}} size="sm" />
        </div>
      );
    case 'divider':
      return (
        <div style={{ ...wrapStyle, width: '160px' }}>
          <Divider />
        </div>
      );
    default:
      // Generic placeholder for components without a custom thumbnail
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: 'var(--color-fg-muted)',
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          {'<'}
          {slug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join('')}
          {' />'}
        </div>
      );
  }
}
