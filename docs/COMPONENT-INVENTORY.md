# Component Inventory

> Generated as part of Task 0.5 — Clean up component API surfaces
> Last updated: 2026-03-04

## Summary

- **Total components:** 48
- **All use forwardRef + displayName:** Yes (except ToastProvider — context-only)
- **All props have JSDoc:** Yes
- **CSS token migration:** Complete (0 old `--arcana-*` tokens remaining)

---

## Primitives (9 components)

### Button
- **File:** `packages/core/src/primitives/Button/Button.tsx`
- **Props:** `variant` (`primary` | `secondary` | `ghost` | `destructive` | `outline`), `size` (`sm` | `md` | `lg`), `loading`, `icon`, `iconRight`, `fullWidth`
- **forwardRef:** Yes (`HTMLButtonElement`)
- **Token migration:** Complete
- **Notes:** Renamed `danger` → `destructive` variant

### Input
- **File:** `packages/core/src/primitives/Input/Input.tsx`
- **Props:** `size` (`sm` | `md` | `lg`), `variant` (`outline` | `filled` | `unstyled`), `error`, `leftElement`, `rightElement`, `fullWidth`, `inputClassName`
- **forwardRef:** Yes (`HTMLInputElement`)
- **Token migration:** Complete

### Textarea
- **File:** `packages/core/src/primitives/Textarea/Textarea.tsx`
- **Props:** `size` (`sm` | `md` | `lg`), `variant` (`outline` | `filled` | `unstyled`), `error`, `autoResize`, `fullWidth`, `textareaClassName`
- **forwardRef:** Yes (`HTMLTextAreaElement`)
- **Token migration:** Complete

### Select
- **File:** `packages/core/src/primitives/Select/Select.tsx`
- **Props:** `options` (SelectOption[]), `placeholder`, `size` (`sm` | `md` | `lg`), `variant` (`outline` | `filled` | `unstyled`), `error`, `fullWidth`, `selectClassName`
- **forwardRef:** Yes (`HTMLSelectElement`)
- **Token migration:** Complete

### Checkbox
- **File:** `packages/core/src/primitives/Checkbox/Checkbox.tsx`
- **Props:** `label`, `description`, `indeterminate`, `error`
- **forwardRef:** Yes (`HTMLInputElement`)
- **Token migration:** Complete

### Radio
- **File:** `packages/core/src/primitives/Radio/Radio.tsx`
- **Props:** `label`, `description`
- **forwardRef:** Yes (`HTMLInputElement`)
- **Token migration:** Complete

### RadioGroup
- **File:** `packages/core/src/primitives/Radio/Radio.tsx`
- **Props:** `name`, `label`, `value`, `onChange`, `options` (RadioOption[]), `className`
- **forwardRef:** Yes (`HTMLFieldSetElement`)
- **Token migration:** Complete

### Toggle
- **File:** `packages/core/src/primitives/Toggle/Toggle.tsx`
- **Props:** `checked`, `onChange`, `disabled`, `size` (`sm` | `md` | `lg`), `label`, `description`, `id`, `className`
- **forwardRef:** Yes (`HTMLButtonElement`)
- **Token migration:** Complete

### Badge
- **File:** `packages/core/src/primitives/Badge/Badge.tsx`
- **Props:** `variant` (`default` | `info` | `success` | `warning` | `error`), `size` (`sm` | `md`), `dot`
- **forwardRef:** Yes (`HTMLSpanElement`)
- **Token migration:** Complete

### Avatar
- **File:** `packages/core/src/primitives/Avatar/Avatar.tsx`
- **Props:** `src`, `alt`, `name`, `size` (`xs` | `sm` | `md` | `lg` | `xl`), `className`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

### AvatarGroup
- **File:** `packages/core/src/primitives/Avatar/Avatar.tsx`
- **Props:** `max`, `children`, `className`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

---

## Composites (6 component groups)

### Card (Card, CardHeader, CardBody, CardFooter)
- **File:** `packages/core/src/composites/Card/Card.tsx`
- **Props:** Card: `variant` (`elevated` | `outlined` | `filled`), `padding` (`none` | `sm` | `md` | `lg`), `interactive`
- **forwardRef:** Yes (all sub-components)
- **Token migration:** Complete

### Modal (Modal, ModalClose)
- **File:** `packages/core/src/composites/Modal/Modal.tsx`
- **Props:** Modal: `open`, `onClose`, `title`, `description`, `size`, `closeOnOverlayClick`, `closeOnEsc`, `footer`, `className`
- **forwardRef:** Yes (both)
- **Token migration:** Complete

### Alert
- **File:** `packages/core/src/composites/Alert/Alert.tsx`
- **Props:** `variant` (`info` | `success` | `warning` | `error`), `title`, `onClose`, `children`, `className`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

### Toast (ToastProvider, useToast)
- **File:** `packages/core/src/composites/Toast/Toast.tsx`
- **Props:** ToastOptions: `title`, `description`, `variant`, `duration`, `action`
- **forwardRef:** N/A (ToastProvider is a context provider)
- **Token migration:** Complete

### Tabs (Tabs, TabList, Tab, TabPanels, TabPanel)
- **File:** `packages/core/src/composites/Tabs/Tabs.tsx`
- **Props:** Tabs: `value`, `onChange`, `defaultValue`, `variant` (`line` | `pills`), `children`, `className`
- **forwardRef:** Yes (all 5 sub-components)
- **Token migration:** Complete

### Accordion (Accordion, AccordionItem, AccordionTrigger, AccordionContent)
- **File:** `packages/core/src/composites/Accordion/Accordion.tsx`
- **Props:** Accordion: `type` (`single` | `multiple`), `defaultValue`, `value`, `onChange`, `children`, `className`
- **forwardRef:** Yes (all 4 sub-components)
- **Token migration:** Complete

---

## Layout (4 components)

### Stack
- **File:** `packages/core/src/layout/Layout.tsx`
- **Props:** `gap`, `align`, `justify`, `wrap`, `children`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

### HStack
- **File:** `packages/core/src/layout/Layout.tsx`
- **Props:** `gap`, `align`, `justify`, `wrap`, `children`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

### Grid
- **File:** `packages/core/src/layout/Layout.tsx`
- **Props:** `columns`, `gap`, `rowGap`, `columnGap`, `children`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

### Container
- **File:** `packages/core/src/layout/Layout.tsx`
- **Props:** `size` (`sm` | `md` | `lg` | `xl` | `2xl` | `full`), `children`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

---

## Patterns (4 component groups)

### Navbar (Navbar, NavbarBrand, NavbarContent, NavbarActions)
- **File:** `packages/core/src/patterns/Navbar/Navbar.tsx`
- **Props:** Navbar: `sticky`, `border`, `children`
- **forwardRef:** Yes (all 4 sub-components)
- **Token migration:** Complete

### EmptyState
- **File:** `packages/core/src/patterns/EmptyState/EmptyState.tsx`
- **Props:** `icon`, `title`, `description`, `action`, `size` (`sm` | `md`), `className`
- **forwardRef:** Yes (`HTMLDivElement`)
- **Token migration:** Complete

### Form (Form, FormField, FormLabel, FormHelperText, FormErrorMessage)
- **File:** `packages/core/src/patterns/Form/Form.tsx`
- **Props:** FormField: `isRequired`, `isInvalid`, `children`, `className`
- **forwardRef:** Yes (all 5 sub-components)
- **Token migration:** Complete

### Table (Table, TableHeader, TableBody, TableRow, TableHead, TableCell)
- **File:** `packages/core/src/patterns/Table/Table.tsx`
- **Props:** Table: `striped`, `hoverable`, `children`; TableHead: `sortable`, `sortDirection`, `onSort`
- **forwardRef:** Yes (all 6 sub-components)
- **Token migration:** Complete
