import type { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
}

export function MasonryGrid({ children }: MasonryGridProps): React.JSX.Element {
  return <div className="mosaic-masonry">{children}</div>;
}
