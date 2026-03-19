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

export { Checkbox, CheckboxGroup } from './primitives/Checkbox';
export type { CheckboxProps, CheckboxGroupProps, CheckboxGroupOption } from './primitives/Checkbox';

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

export { Hero } from './patterns/Hero';
export type { HeroProps, HeroCTAAction } from './patterns/Hero';

export { FeatureSection } from './patterns/FeatureSection';
export type { FeatureSectionProps, FeatureItemData } from './patterns/FeatureSection';

export { Testimonial } from './patterns/Testimonial';
export type { TestimonialProps } from './patterns/Testimonial';

export { PricingCard } from './patterns/PricingCard';
export type { PricingCardProps, PricingFeature, PricingCTAAction } from './patterns/PricingCard';

export { CTA } from './patterns/CTA';
export type { CTAProps, CTAAction } from './patterns/CTA';

export { StatsBar } from './patterns/StatsBar';
export type { StatsBarProps, StatItemData } from './patterns/StatsBar';

export { Timeline } from './patterns/Timeline';
export type { TimelineProps, TimelineItemData } from './patterns/Timeline';

export { LogoCloud } from './patterns/LogoCloud';
export type { LogoCloudProps, LogoItem } from './patterns/LogoCloud';

export { DataTable } from './patterns/DataTable';
export type { DataTableProps, ColumnDef, SortState, PaginationConfig } from './patterns/DataTable';

export { StatCard } from './patterns/StatCard';
export type { StatCardProps, StatTrend } from './patterns/StatCard';

export { ProgressBar } from './patterns/ProgressBar';
export type { ProgressBarProps } from './patterns/ProgressBar';

export { KPICard } from './patterns/KPICard';
export type { KPICardProps, KPITrend, KPITarget } from './patterns/KPICard';

export { DatePicker } from './patterns/DatePicker';
export type { DatePickerProps } from './patterns/DatePicker';

export { FileUpload } from './patterns/FileUpload';
export type { FileUploadProps } from './patterns/FileUpload';

export { Drawer } from './patterns/Drawer';
export type { DrawerProps } from './patterns/Drawer';

export { Popover } from './patterns/Popover';
export type { PopoverProps } from './patterns/Popover';

export { CommandPalette } from './patterns/CommandPalette';
export type { CommandPaletteProps, CommandItem } from './patterns/CommandPalette';

export { Divider } from './patterns/Divider';
export type { DividerProps } from './patterns/Divider';

export { Spacer } from './patterns/Spacer';
export type { SpacerProps } from './patterns/Spacer';

export { AspectRatio } from './patterns/AspectRatio';
export type { AspectRatioProps } from './patterns/AspectRatio';

export { Image } from './patterns/Image';
export type { ImageProps } from './patterns/Image';

export { Carousel } from './patterns/Carousel';
export type { CarouselProps } from './patterns/Carousel';

export { Banner } from './composites/Banner';
export type { BannerProps } from './composites/Banner';

export { Skeleton } from './composites/Skeleton';
export type { SkeletonProps } from './composites/Skeleton';

export { Spinner } from './composites/Spinner';
export type { SpinnerProps } from './composites/Spinner';

export { ErrorBoundary } from './composites/ErrorBoundary';
export type { ErrorBoundaryProps } from './composites/ErrorBoundary';

// ─── E-commerce ──────────────────────────────────────────────────────────────
export { ProductCard } from './patterns/ProductCard';
export type { ProductCardProps, ProductPrice, ProductRating } from './patterns/ProductCard';

export { CartItem } from './patterns/CartItem';
export type { CartItemProps } from './patterns/CartItem';

export { QuantitySelector } from './patterns/QuantitySelector';
export type { QuantitySelectorProps } from './patterns/QuantitySelector';

export { PriceDisplay } from './patterns/PriceDisplay';
export type { PriceDisplayProps } from './patterns/PriceDisplay';

export { RatingStars } from './patterns/RatingStars';
export type { RatingStarsProps } from './patterns/RatingStars';

// ─── Editorial ───────────────────────────────────────────────────────────────
export { ArticleLayout } from './patterns/ArticleLayout';
export type { ArticleLayoutProps } from './patterns/ArticleLayout';

export { PullQuote } from './patterns/PullQuote';
export type { PullQuoteProps } from './patterns/PullQuote';

export { AuthorCard } from './patterns/AuthorCard';
export type { AuthorCardProps, AuthorSocial } from './patterns/AuthorCard';

export { RelatedPosts } from './patterns/RelatedPosts';
export type { RelatedPostsProps, RelatedPost } from './patterns/RelatedPosts';

export { NewsletterSignup } from './patterns/NewsletterSignup';
export type { NewsletterSignupProps } from './patterns/NewsletterSignup';

// ─── Utilities ───────────────────────────────────────────────────────────────
export { ScrollArea } from './patterns/ScrollArea';
export type { ScrollAreaProps } from './patterns/ScrollArea';

export { Collapsible } from './patterns/Collapsible';
export type { CollapsibleProps } from './patterns/Collapsible';

export { CopyButton } from './patterns/CopyButton';
export type { CopyButtonProps } from './patterns/CopyButton';

export { KeyboardShortcut } from './patterns/KeyboardShortcut';
export type { KeyboardShortcutProps } from './patterns/KeyboardShortcut';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useMediaQuery } from './hooks/useMediaQuery';
export { useBreakpoint } from './hooks/useBreakpoint';
export type { Breakpoint, UseBreakpointReturn } from './hooks/useBreakpoint';
export { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
export { useHotkey } from './hooks/useHotkey';
export { useTheme } from './hooks/useTheme';
export type { ThemeId, ThemeSource, UseThemeReturn } from './hooks/useTheme';

// ─── Context ─────────────────────────────────────────────────────────────────
export { ThemeProvider, useThemeContext } from './context/ThemeProvider';
export type { ThemeProviderProps } from './context/ThemeProvider';

// ─── Utils ────────────────────────────────────────────────────────────────────
export { cn } from './utils/cn';
