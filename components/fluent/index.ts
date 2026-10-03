/**
 * Gradly Fluent UI component library — single import surface.
 *
 * Pages import from '@/components/fluent' only, never from
 * '@fluentui/react-components' directly. That keeps restyling, swapping or
 * wrapping a Fluent primitive a one-file change instead of a repo-wide search.
 */

// ── Provider + theme ────────────────────────────────────────────────────────
export { GradlyProvider, useGradlyTheme } from './GradlyProvider'
export { FluentSSR } from './FluentSSR'

// ── Typography ──────────────────────────────────────────────────────────────
export {
  Display,
  Lead,
  Body,
  Kicker,
  Stat,
  GradlyText,
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Subtitle2,
  Body1,
  Body1Strong,
  Body2,
  Caption1,
  Caption1Strong,
  LargeTitle,
} from './Text'
export type { DisplayProps } from './Text'

// ── Layout ──────────────────────────────────────────────────────────────────
export { Container, Section, Stack, Grid, PageBackground, Divider } from './Layout'
export type { SectionTone } from './Layout'

// ── Actions ─────────────────────────────────────────────────────────────────
export {
  GradlyButton,
  IconButton,
  ToggleButton,
  MenuButton,
  SplitButton,
  CompoundButton,
} from './Button'
export type {
  GradlyButtonProps,
  GradlyButtonSize,
  GradlyButtonVariant,
} from './Button'

// ── Surfaces ────────────────────────────────────────────────────────────────
export {
  GradlyCard,
  StatTile,
  EmptyState,
  CardHeader,
  CardFooter,
  CardPreview,
} from './Card'
export type { GradlyCardProps, GradlyCardTone, GradlyCardPadding } from './Card'

// ── Badges + labels ─────────────────────────────────────────────────────────
export {
  GradlyBadge,
  SectionLabel,
  StatusDot,
  CreditsPill,
  CounterBadge,
  PresenceBadge,
  Avatar,
  Tag,
  TagGroup,
} from './Badge'
export type { GradlyBadgeTone } from './Badge'

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
  // Raw Fluent escape hatches for one-off cases
  Field,
  Input,
  Textarea,
  Dropdown,
  Option,
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

// ── Styling utilities (for page-level one-offs) ─────────────────────────────
export { makeStyles, mergeClasses, tokens, shorthands } from '@fluentui/react-components'
export {
  gradlyTokens,
  gradlyMotion,
  gradlyBrand,
  gradlyAmber,
  gradlyLightTheme,
  gradlyDarkTheme,
  hoverTransition,
} from '@/lib/fluent'
