import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('renders slides', () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>,
    );
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('renders with role="region"', () => {
    render(
      <Carousel>
        <div>Slide</div>
      </Carousel>,
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('has aria-roledescription="carousel"', () => {
    render(
      <Carousel>
        <div>Slide</div>
      </Carousel>,
    );
    expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('renders prev/next arrows for multiple slides', () => {
    render(
      <Carousel>
        <div>1</div>
        <div>2</div>
      </Carousel>,
    );
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('hides arrows for single slide', () => {
    render(
      <Carousel>
        <div>Only slide</div>
      </Carousel>,
    );
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
  });

  it('renders dot indicators', () => {
    render(
      <Carousel>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Carousel>,
    );
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
  });

  it('hides arrows when showArrows is false', () => {
    render(
      <Carousel showArrows={false}>
        <div>1</div>
        <div>2</div>
      </Carousel>,
    );
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
  });

  it('hides dots when showDots is false', () => {
    render(
      <Carousel showDots={false}>
        <div>1</div>
        <div>2</div>
      </Carousel>,
    );
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('slides have aria-roledescription="slide"', () => {
    render(
      <Carousel>
        <div>1</div>
        <div>2</div>
      </Carousel>,
    );
    const groups = screen.getAllByRole('group');
    expect(groups[0]).toHaveAttribute('aria-roledescription', 'slide');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Carousel ref={ref}>
        <div>Slide</div>
      </Carousel>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Carousel label="Product gallery">
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
