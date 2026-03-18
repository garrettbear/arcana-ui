// ─── Styles ──────────────────────────────────────────────────────────────────
import './styles/layout.css';
import './styles/theme-transition.css';

// ─── Primitives ───────────────────────────────────────────────────────────────
export { Button } from './primitives/Button';
export type { ButtonProps } from './primitives/Button';

export { Input } from './primitives/Input';
export type { InputProps } from './primitives/Input';

export { Textarea } from './primitives/Textarea';
export type { TextareaProps } from './primitives/Textarea';

export { Select } from './primitives/Select';
export type { SelectProps, SelectOption } from './primitives/Select';

export { Checkbox } from './primitives/Checkbox';
export type { CheckboxProps } from './primitives/Checkbox';

export { Radio, RadioGroup } from './primitives/Radio';
export type { RadioProps, RadioGroupProps, RadioOption } from './primitives/Radio';

export { Toggle } from './primitives/Toggle';
export type { ToggleProps } from './primitives/Toggle';

export { Badge } from './primitives/Badge';
export type { BadgeProps } from './primitives/Badge';

export { Avatar, AvatarGroup } from './primitives/Avatar';
export type { AvatarProps, AvatarGroupProps } from './primitives/Avatar';

// ─── Composites ───────────────────────────────────────────────────────────────
export { Card, CardHeader, CardBody, CardFooter } from './composites/Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './composites/Card';

export { Modal, ModalClose } from './composites/Modal';
export type { ModalProps, ModalCloseProps } from './composites/Modal';

export { Alert } from './composites/Alert';
export type { AlertProps } from './composites/Alert';

export { ToastProvider, useToast } from './composites/Toast';
export type { ToastOptions, ToastProviderProps, ToastVariant } from './composites/Toast';

export { Tabs, TabList, Tab, TabPanels, TabPanel } from './composites/Tabs';
export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelsProps,
  TabPanelProps,
} from './composites/Tabs';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './composites/Accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './composites/Accordion';

// ─── Layout ───────────────────────────────────────────────────────────────────
export { Stack, HStack, Grid, GridColumn, Container } from './layout';
export type {
  StackProps,
  HStackProps,
  GridProps,
  GridColumnProps,
  ContainerProps,
  ContainerSize,
  ContainerPadding,
} from './layout';

// ─── Patterns ─────────────────────────────────────────────────────────────────
export { Navbar, NavbarBrand, NavbarContent, NavbarActions } from './patterns/Navbar';
export type {
  NavbarProps,
  NavbarBrandProps,
  NavbarContentProps,
  NavbarActionsProps,
} from './patterns/Navbar';

export { EmptyState } from './patterns/EmptyState';
export type { EmptyStateProps } from './patterns/EmptyState';

export { Form, FormField, FormLabel, FormHelperText, FormErrorMessage } from './patterns/Form';
export type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormHelperTextProps,
  FormErrorMessageProps,
} from './patterns/Form';

export { BottomSheet } from './patterns/BottomSheet';
export type { BottomSheetProps } from './patterns/BottomSheet';

export { MobileNav } from './patterns/MobileNav';
export type { MobileNavProps, MobileNavItem } from './patterns/MobileNav';

export { DrawerNav } from './patterns/DrawerNav';
export type { DrawerNavProps } from './patterns/DrawerNav';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './patterns/Table';
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from './patterns/Table';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  SidebarSection,
} from './patterns/Sidebar';
export type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarFooterProps,
  SidebarItemProps,
  SidebarSectionProps,
} from './patterns/Sidebar';

export { Breadcrumb, BreadcrumbItem } from './patterns/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItemProps } from './patterns/Breadcrumb';

export { Pagination } from './patterns/Pagination';
export type { PaginationProps } from './patterns/Pagination';

export { Footer, FooterSection, FooterLink, FooterBottom } from './patterns/Footer';
export type {
  FooterProps,
  FooterSectionProps,
  FooterLinkProps,
  FooterBottomProps,
} from './patterns/Footer';

export {
  Hero,
  HeroContent,
  HeroTitle,
  HeroDescription,
  HeroActions,
  HeroMedia,
} from './patterns/Hero';
export type {
  HeroProps,
  HeroContentProps,
  HeroTitleProps,
  HeroDescriptionProps,
  HeroActionsProps,
  HeroMediaProps,
} from './patterns/Hero';

export { FeatureSection, FeatureItem } from './patterns/FeatureSection';
export type { FeatureSectionProps, FeatureItemProps } from './patterns/FeatureSection';

export { Testimonial, TestimonialQuote, TestimonialAuthor } from './patterns/Testimonial';
export type {
  TestimonialProps,
  TestimonialQuoteProps,
  TestimonialAuthorProps,
} from './patterns/Testimonial';

export {
  PricingCard,
  PricingCardHeader,
  PricingCardPrice,
  PricingCardFeatures,
  PricingCardFeature,
  PricingCardAction,
} from './patterns/PricingCard';
export type {
  PricingCardProps,
  PricingCardHeaderProps,
  PricingCardPriceProps,
  PricingCardFeaturesProps,
  PricingCardFeatureProps,
  PricingCardActionProps,
} from './patterns/PricingCard';

export { CTA, CTATitle, CTADescription, CTAActions } from './patterns/CTA';
export type { CTAProps, CTATitleProps, CTADescriptionProps, CTAActionsProps } from './patterns/CTA';

export { StatsBar, StatItem } from './patterns/StatsBar';
export type { StatsBarProps, StatItemProps } from './patterns/StatsBar';

export { Timeline, TimelineItem } from './patterns/Timeline';
export type { TimelineProps, TimelineItemProps } from './patterns/Timeline';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useMediaQuery } from './hooks/useMediaQuery';
export { useBreakpoint } from './hooks/useBreakpoint';
export type { Breakpoint, UseBreakpointReturn } from './hooks/useBreakpoint';
export { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
export { useTheme } from './hooks/useTheme';
export type { ThemeId, ThemeSource, UseThemeReturn } from './hooks/useTheme';

// ─── Context ─────────────────────────────────────────────────────────────────
export { ThemeProvider, useThemeContext } from './context/ThemeProvider';
export type { ThemeProviderProps } from './context/ThemeProvider';

// ─── Utils ────────────────────────────────────────────────────────────────────
export { cn } from './utils/cn';
