/**
 * Gradly Fluent UI component library — single import surface.
 *
 * Pages import from '@/components/fluent' only, never from
 * '@fluentui/react-components' directly, so swapping or wrapping a Fluent
 * primitive stays a one-file change.
 *
 * Three kinds of export live here, and the distinction matters:
 *
 *   1. Re-exported Fluent components, unchanged. Most of the list.
 *   2. Thin wrappers that pair a Fluent `Field` with a Fluent control, or add
 *      something Fluent leaves to the app (a loading button, client-side `href`).
 *      No restyling.
 *   3. Compositions for patterns Fluent has no component for — layout, the
 *      dropzone, the OTP input, scroll motion. These are built from Fluent parts
 *      and Fluent tokens, and are marked as such in their own files.
 */

// ── Provider + theme ────────────────────────────────────────────────────────
export { GradlyProvider, useGradlyTheme } from './GradlyProvider'
export { FluentSSR } from './FluentSSR'

// ── Typography (all Fluent) ─────────────────────────────────────────────────
export {
  Text,
  Display,
  LargeTitle,
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Subtitle2,
  Body1,
  Body1Strong,
  Body1Stronger,
  Body2,
  Caption1,
  Caption1Strong,
  Caption1Stronger,
  Caption2,
  Caption2Strong,
  // Conventions composed from the above
  Lead,
  Body,
  Stat,
} from './Text'

// ── Layout (composition — Fluent ships no layout system) ────────────────────
export { Container, Section, Stack, Grid, Divider } from './Layout'
export type { SectionTone } from './Layout'

// ── Actions ─────────────────────────────────────────────────────────────────
export {
  GradlyButton,
  IconButton,
  Button,
  ToggleButton,
  MenuButton,
  SplitButton,
  CompoundButton,
  Link,
} from './Button'
export type { GradlyButtonProps } from './Button'

// ── Surfaces ────────────────────────────────────────────────────────────────
export {
  Card,
  CardHeader,
  CardFooter,
  CardPreview,
  StatTile,
  EmptyState,
} from './Card'
export type { CardProps } from './Card'

// ── Badges + labels ─────────────────────────────────────────────────────────
export {
  Badge,
  CounterBadge,
  PresenceBadge,
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  Tag,
  TagGroup,
  InteractionTag,
  SectionLabel,
  StatusDot,
  CreditsPill,
} from './Badge'
export type { BadgeProps } from './Badge'

// ── Inputs ──────────────────────────────────────────────────────────────────
export {
  TextField,
  TextAreaField,
  SelectField,
  NumberField,
  SearchField,
  CheckboxField,
  SwitchField,
  RadioField,
  SliderField,
  OTPField,
  // Raw Fluent, for anything the wrappers don't cover
  Field,
  Label,
  Input,
  Textarea,
  Dropdown,
  Option,
  OptionGroup,
  Combobox,
  SpinButton,
  Slider,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  SearchBox,
  InfoLabel,
} from './Inputs'
export type {
  TextFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  SelectOption,
  NumberFieldProps,
  RadioOption,
  SliderFieldProps,
  FieldProps,
} from './Inputs'

// ── Data display ────────────────────────────────────────────────────────────
export {
  DataTable,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
  Skeleton,
  SkeletonItem,
} from './DataTable'
export type { DataTableColumn, DataTableProps, TableColumnDefinition } from './DataTable'

export { EditableTable } from './EditableTable'
export type { EditableColumn, EditableTableProps } from './EditableTable'

export { FileDropzone } from './FileDropzone'
export type { FileDropzoneProps } from './FileDropzone'

// ── Feedback ────────────────────────────────────────────────────────────────
export {
  useGradlyToast,
  MessageBanner,
  Loading,
  ConfirmDialog,
  Stepper,
  Spinner,
  ProgressBar,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from './Feedback'

// ── Navigation ──────────────────────────────────────────────────────────────
export {
  Logo,
  ThemeToggle,
  AppHeader,
  TabsBar,
  Crumbs,
  FaqAccordion,
  TabList,
  Tab,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  OverlayDrawer,
  InlineDrawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Toolbar,
  ToolbarButton,
  Portal,
} from './Navigation'
export type { NavItem } from './Navigation'

// ── Motion ──────────────────────────────────────────────────────────────────
export {
  Fade,
  FadeUp,
  Scale,
  Collapse,
  Reveal,
  ScrollProgress,
  Marquee,
  createPresenceComponent,
  createMotionComponent,
  motionTokens,
} from './Motion'

// ── Styling utilities, for page-level one-offs ──────────────────────────────
export { makeStyles, mergeClasses, shorthands, tokens } from '@fluentui/react-components'
export {
  brandWeb,
  brandTeams,
  gradlyLightTheme,
  gradlyDarkTheme,
  gradlyMotion,
} from '@/lib/fluent'
