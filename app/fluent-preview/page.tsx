'use client'

/**
 * Component gallery for the Fluent UI rebuild.
 *
 * Renders every export of `@/components/fluent` with its variants and states,
 * plus a provenance table saying which exports are Fluent components and which
 * are app compositions. Workbench, not product UI — delete once pages are done.
 */

import { useState } from 'react'
import {
  GradlyProvider,
  useGradlyTheme,
  // type
  Display,
  LargeTitle,
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
  Lead,
  Body,
  Stat,
  // layout
  Container,
  Section,
  Stack,
  Grid,
  Divider,
  // actions
  GradlyButton,
  IconButton,
  Button,
  ToggleButton,
  CompoundButton,
  SplitButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  // surfaces
  Card,
  CardHeader,
  CardPreview,
  StatTile,
  EmptyState,
  // badges
  Badge,
  CounterBadge,
  PresenceBadge,
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  Tag,
  TagGroup,
  SectionLabel,
  StatusDot,
  CreditsPill,
  // inputs
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
  Combobox,
  Option,
  InfoLabel,
  // data
  DataTable,
  EditableTable,
  FileDropzone,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  SkeletonItem,
  type DataTableColumn,
  type EditableColumn,
  // feedback
  useGradlyToast,
  MessageBanner,
  Loading,
  ConfirmDialog,
  Stepper,
  ProgressBar,
  Spinner,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  // navigation
  AppHeader,
  TabsBar,
  Crumbs,
  FaqAccordion,
  ThemeToggle,
  Logo,
  // motion
  Fade,
  FadeUp,
  Scale,
  Reveal,
  Marquee,
  // tokens
  brandWeb,
  makeStyles,
  tokens,
} from '@/components/fluent'
import {
  PersonRegular,
  DocumentRegular,
  SettingsRegular,
  StarRegular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  swatchRow: { display: 'flex', flexWrap: 'wrap' },
  swatch: {
    width: '64px',
    height: '72px',
    display: 'flex',
    alignItems: 'flex-end',
    padding: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase100,
  },
  tokenBox: {
    height: '60px',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'flex-end',
    padding: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase100,
  },
  specimen: {
    padding: tokens.spacingHorizontalXL,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  pad: { padding: tokens.spacingHorizontalL },
  muted: { color: tokens.colorNeutralForeground3 },
  ok: { color: tokens.colorStatusSuccessForeground1 },
  warn: { color: tokens.colorStatusWarningForeground1 },
})

/* ─────────────────── demo data ─────────────────── */

type Conversion = {
  id: string
  university: string
  system: string
  usaGpa: number
  classification: string
}

const CONVERSIONS: Conversion[] = [
  { id: '1', university: 'KNUST', system: 'CWA', usaGpa: 3.42, classification: 'Second Class Upper' },
  { id: '2', university: 'University of Ghana', system: 'CGPA 4.0', usaGpa: 3.78, classification: 'First Class' },
  { id: '3', university: 'UCC', system: 'CGPA 4.0', usaGpa: 2.95, classification: 'Second Class Lower' },
  { id: '4', university: 'UEW', system: 'CGPA 4.0', usaGpa: 3.55, classification: 'First Class' },
]

type CourseRow = { name: string; code: string; credits: string; score: string; grade: string }

const FAQ_ITEMS = [
  { question: 'How accurate is the WASSCE aggregate?', answer: 'It follows the WAEC methodology exactly: three core subjects plus your three best electives, with the per-university counting quirks applied.' },
  { question: 'Which universities are supported?', answer: 'KNUST, University of Ghana, UCC and UEW have authoritative per-university grading tables. Others fall back to the WES/Scholaro mapping.' },
  { question: 'Do you store my transcript?', answer: 'The file is parsed in memory and discarded. Only the extracted course rows are saved, and only if you choose to save the conversion.' },
]

/** What is a Fluent component, and what is ours. No hand-waving. */
const PROVENANCE: Array<{ export: string; built: string; kind: 'fluent' | 'wrapper' | 'composition' }> = [
  { export: 'Display / Title1-3 / Body1 / Caption1 …', built: 'Fluent typography components, re-exported unchanged', kind: 'fluent' },
  { export: 'Button, ToggleButton, SplitButton, CompoundButton, Menu', built: 'Fluent, re-exported unchanged', kind: 'fluent' },
  { export: 'Card, CardHeader, CardPreview', built: 'Fluent, re-exported unchanged', kind: 'fluent' },
  { export: 'Badge, CounterBadge, PresenceBadge, Avatar, Tag', built: 'Fluent, re-exported unchanged', kind: 'fluent' },
  { export: 'Input, Textarea, Dropdown, Combobox, SpinButton, Slider, Switch, Checkbox, Radio, SearchBox', built: 'Fluent, re-exported unchanged', kind: 'fluent' },
  { export: 'DataGrid, Table, Skeleton', built: 'Fluent, re-exported unchanged', kind: 'fluent' },
  { export: 'Dialog, MessageBar, Spinner, ProgressBar, Tooltip, Popover, Toaster', built: 'Fluent, re-exported unchanged', kind: 'fluent' },
  { export: 'TabList, Accordion, Breadcrumb, Drawer, Menu', built: 'Fluent, re-exported unchanged', kind: 'fluent' },
  { export: 'Fade / FadeUp / Scale / Collapse', built: "Fluent's createPresenceComponent", kind: 'fluent' },
  { export: 'GradlyButton', built: 'Fluent Button + client-side href, loading, fullWidth', kind: 'wrapper' },
  { export: 'IconButton', built: 'Fluent Button, square, required accessible name', kind: 'wrapper' },
  { export: 'TextField / SelectField / NumberField / RadioField / SliderField / …', built: 'Fluent Field + the matching Fluent control', kind: 'wrapper' },
  { export: 'DataTable', built: 'Fluent DataGrid + a flat column config and a scroll container', kind: 'wrapper' },
  { export: 'MessageBanner / Loading / ConfirmDialog', built: 'Fluent MessageBar / Spinner / Dialog', kind: 'wrapper' },
  { export: 'Stepper', built: 'Fluent ProgressBar + Caption1', kind: 'wrapper' },
  { export: 'StatTile / EmptyState', built: 'Fluent Card + typography', kind: 'wrapper' },
  { export: 'SectionLabel / StatusDot / CreditsPill', built: 'Fluent Caption / PresenceBadge / Badge', kind: 'wrapper' },
  { export: 'Container / Section / Stack / Grid', built: 'Not Fluent — v9 ships no layout system. Griffel + Fluent spacing tokens', kind: 'composition' },
  { export: 'OTPField', built: 'Not Fluent — composed from Fluent Input cells + Label', kind: 'composition' },
  { export: 'FileDropzone', built: 'Not Fluent — composed from Fluent Field / Button / ProgressBar', kind: 'composition' },
  { export: 'EditableTable', built: 'Fluent Table + Input per cell (DataGrid owns its cells, so it cannot host inputs)', kind: 'composition' },
  { export: 'Reveal / ScrollProgress / Marquee', built: 'Not Fluent — no scroll primitives exist. Uses Fluent motion tokens', kind: 'composition' },
]

/* ─────────────────── page ─────────────────── */

export default function FluentPreviewPage() {
  return (
    <GradlyProvider>
      <Gallery />
    </GradlyProvider>
  )
}

function Gallery() {
  const s = useStyles()
  const { mode } = useGradlyTheme()
  const toast = useGradlyToast()

  const [tab, setTab] = useState('overview')
  const [text, setText] = useState('')
  const [pw, setPw] = useState('')
  const [uni, setUni] = useState<string[]>(['KNUST'])
  const [agree, setAgree] = useState(false)
  const [emails, setEmails] = useState(true)
  const [stream, setStream] = useState('science')
  const [aggregate, setAggregate] = useState(12)
  const [otp, setOtp] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [presenceOn, setPresenceOn] = useState(true)
  const [rows, setRows] = useState<CourseRow[]>([
    { name: 'Introduction to Computing', code: 'CSM 151', credits: '3', score: '78', grade: 'B+' },
    { name: 'Calculus I', code: 'MATH 151', credits: '4', score: '84', grade: 'A' },
    { name: 'Technical Writing', code: 'ENGL 157', credits: '2', score: '', grade: 'B' },
  ])

  const tableColumns: DataTableColumn<Conversion>[] = [
    {
      id: 'university',
      header: 'University',
      render: (i) => i.university,
      compare: (a, b) => a.university.localeCompare(b.university),
      minWidth: 180,
    },
    { id: 'system', header: 'Source system', render: (i) => i.system, width: 140 },
    {
      id: 'usaGpa',
      header: 'USA GPA',
      render: (i) => i.usaGpa.toFixed(2),
      compare: (a, b) => a.usaGpa - b.usaGpa,
      numeric: true,
      width: 110,
    },
    {
      id: 'classification',
      header: 'Class',
      render: (i) => (
        <Badge appearance="tint" color={i.classification === 'First Class' ? 'success' : 'informative'}>
          {i.classification}
        </Badge>
      ),
      minWidth: 180,
    },
  ]

  const editableColumns: EditableColumn<CourseRow>[] = [
    { field: 'name', header: 'Course', placeholder: 'Course title' },
    { field: 'code', header: 'Code', width: 110, placeholder: 'CSM 151' },
    {
      field: 'credits',
      header: 'Credits',
      kind: 'number',
      width: 90,
      validate: (r) => {
        const n = Number(r.credits)
        return !r.credits || Number.isNaN(n) || n <= 0 ? 'Credits must be a positive number' : undefined
      },
    },
    {
      field: 'score',
      header: 'Score',
      kind: 'number',
      width: 90,
      validate: (r) => {
        if (!r.score) return undefined
        const n = Number(r.score)
        return Number.isNaN(n) || n < 0 || n > 100 ? 'Score must be 0–100' : undefined
      },
    },
    { field: 'grade', header: 'Grade', width: 90, placeholder: 'B+' },
  ]

  const totalCredits = rows.reduce((sum, r) => sum + (Number(r.credits) || 0), 0)

  return (
    <>
      <AppHeader
        links={[
          { label: 'Palette', href: '#palette' },
          { label: 'Type', href: '#type' },
          { label: 'Controls', href: '#controls' },
          { label: 'Data', href: '#data' },
          { label: 'Provenance', href: '#provenance' },
        ]}
        right={<CreditsPill balance={3} href="#" />}
        user={{ name: 'Ama Owusu', email: 'ama@example.com' }}
        onSignOut={() => toast.info('Sign out', 'Wired by the page, not the header.')}
        sticky
      />

      <Section tight>
        <Container>
          <SectionLabel>Fluent UI component library</SectionLabel>
          <Display as="h1" block>
            Every control, one page
          </Display>
          <Lead>
            Built on Fluent&rsquo;s own web theme — brand ramp, type ramp, spacing, radii
            and motion all unmodified. Rendering in <strong>{mode}</strong> mode; the
            toggle is in the header.
          </Lead>
          <div style={{ marginTop: 20 }}>
            <Stack direction="row" gap="S" wrap>
              <GradlyButton appearance="primary">Primary action</GradlyButton>
              <GradlyButton>Secondary</GradlyButton>
              <ThemeToggle />
            </Stack>
          </div>
        </Container>
      </Section>

      {/* ─────────── Palette ─────────── */}
      <Section id="palette" tone="subtle">
        <Container>
          <SectionLabel number="01">Colour</SectionLabel>
          <Title1 as="h2" block>Fluent web brand ramp</Title1>
          <Lead>
            Microsoft&rsquo;s shipped ramp, used as-is. Fluent derives ~460 colour slots
            from it, so every hover, pressed, selected, disabled and inverted state is
            generated rather than hand-picked.
          </Lead>

          <div style={{ marginTop: 24 }}>
            <Caption1Strong>Brand ramp (10 → 160) · shade 80 is the primary</Caption1Strong>
            <div className={s.swatchRow} style={{ marginTop: 8 }}>
              {Object.entries(brandWeb).map(([step, hex]) => (
                <div
                  key={step}
                  className={s.swatch}
                  style={{
                    backgroundColor: hex as string,
                    color: Number(step) >= 90 ? '#000' : '#fff',
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <Caption1Strong>Semantic tokens</Caption1Strong>
            <Grid min={150} gap={10} style={{ marginTop: 8 }}>
              {[
                ['colorBrandBackground', tokens.colorBrandBackground, '#fff'],
                ['colorBrandBackground2', tokens.colorBrandBackground2, '#000'],
                ['colorNeutralBackground1', tokens.colorNeutralBackground1, '#000'],
                ['colorNeutralBackground3', tokens.colorNeutralBackground3, '#000'],
                ['colorNeutralBackgroundInverted', tokens.colorNeutralBackgroundInverted, '#fff'],
                ['colorStatusSuccessBackground3', tokens.colorStatusSuccessBackground3, '#fff'],
                ['colorStatusWarningBackground3', tokens.colorStatusWarningBackground3, '#000'],
                ['colorStatusDangerBackground3', tokens.colorStatusDangerBackground3, '#fff'],
              ].map(([name, value, fg]) => (
                <div key={name} className={s.tokenBox} style={{ backgroundColor: value, color: fg }}>
                  {String(name).replace('color', '')}
                </div>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* ─────────── Type ─────────── */}
      <Section id="type">
        <Container>
          <SectionLabel number="02">Typography</SectionLabel>
          <Title1 as="h2" block>Fluent type ramp</Title1>
          <Lead>Segoe UI across the ramp. Every size below is a Fluent component.</Lead>

          <div className={s.specimen} style={{ marginTop: 20 }}>
            <Stack gap="L">
              <div><Caption1 className={s.muted}>Display</Caption1><Display block>From WASSCE to world-class</Display></div>
              <Divider />
              <div><Caption1 className={s.muted}>LargeTitle</Caption1><LargeTitle block>From WASSCE to world-class</LargeTitle></div>
              <div><Caption1 className={s.muted}>Title1</Caption1><Title1 block>From WASSCE to world-class</Title1></div>
              <div><Caption1 className={s.muted}>Title2</Caption1><Title2 block>From WASSCE to world-class</Title2></div>
              <div><Caption1 className={s.muted}>Title3</Caption1><Title3 block>From WASSCE to world-class</Title3></div>
              <Divider />
              <div><Caption1 className={s.muted}>Subtitle1</Caption1><Subtitle1 block>Course-by-course conversion</Subtitle1></div>
              <div><Caption1 className={s.muted}>Subtitle2</Caption1><Subtitle2 block>Course-by-course conversion</Subtitle2></div>
              <div><Caption1 className={s.muted}>Body1</Caption1><Body1 block>Each course is mapped individually, then weighted by credit hours.</Body1></div>
              <div><Caption1 className={s.muted}>Body1Strong</Caption1><Body1Strong block>Each course is mapped individually.</Body1Strong></div>
              <div><Caption1 className={s.muted}>Body2</Caption1><Body2 block>Each course is mapped individually, then weighted.</Body2></div>
              <div><Caption1 className={s.muted}>Caption1</Caption1><Caption1 block>KNUST publishes no official 4.0 CGPA.</Caption1></div>
              <Divider />
              <div><Caption1 className={s.muted}>Stat (hero size, tabular figures)</Caption1><Stat>3.42</Stat></div>
            </Stack>
          </div>
        </Container>
      </Section>

      {/* ─────────── Actions ─────────── */}
      <Section id="controls" tone="subtle">
        <Container>
          <SectionLabel number="03">Actions</SectionLabel>
          <Title1 as="h2" block>Buttons &amp; badges</Title1>

          <Grid min={320} gap={16} style={{ marginTop: 20 }}>
            <Card>
              <Caption1Strong>Appearances</Caption1Strong>
              <Stack gap="S" style={{ marginTop: 10 }}>
                <Stack direction="row" gap="S" wrap>
                  <Button appearance="primary">Primary</Button>
                  <Button appearance="secondary">Secondary</Button>
                  <Button appearance="outline">Outline</Button>
                </Stack>
                <Stack direction="row" gap="S" wrap>
                  <Button appearance="subtle">Subtle</Button>
                  <Button appearance="transparent">Transparent</Button>
                  <Button disabled>Disabled</Button>
                </Stack>
              </Stack>
            </Card>

            <Card>
              <Caption1Strong>Sizes &amp; shapes</Caption1Strong>
              <Stack gap="S" style={{ marginTop: 10 }}>
                <Stack direction="row" gap="S" align="center" wrap>
                  <Button size="small">Small</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="large">Large</Button>
                </Stack>
                <Stack direction="row" gap="S" align="center" wrap>
                  <Button shape="rounded">Rounded</Button>
                  <Button shape="circular">Circular</Button>
                  <Button shape="square">Square</Button>
                </Stack>
              </Stack>
            </Card>

            <Card>
              <Caption1Strong>With icons</Caption1Strong>
              <Stack direction="row" gap="S" align="center" wrap style={{ marginTop: 10 }}>
                <Button appearance="primary" icon={<DocumentRegular />}>Convert</Button>
                <Button icon={<SettingsRegular />} iconPosition="after">Settings</Button>
                <IconButton icon={<StarRegular />} label="Favourite" />
                <IconButton icon={<PersonRegular />} label="Profile" appearance="secondary" shape="rounded" />
              </Stack>
            </Card>

            <Card>
              <Caption1Strong>Wrapper additions</Caption1Strong>
              <Stack direction="row" gap="S" align="center" wrap style={{ marginTop: 10 }}>
                <GradlyButton loading appearance="primary">Loading</GradlyButton>
                <GradlyButton href="/fluent-preview">As link</GradlyButton>
                <GradlyButton fullWidth appearance="outline">Full width</GradlyButton>
              </Stack>
            </Card>

            <Card>
              <Caption1Strong>Fluent extras</Caption1Strong>
              <Stack direction="row" gap="S" align="center" wrap style={{ marginTop: 10 }}>
                <ToggleButton>Toggle</ToggleButton>
                <CompoundButton secondaryContent="3 credits">Buy pack</CompoundButton>
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    {(props) => <SplitButton menuButton={props}>Split</SplitButton>}
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem>Export PDF</MenuItem>
                      <MenuItem>Export CSV</MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </Stack>
            </Card>

            <Card>
              <Caption1Strong>Badges, avatars, status</Caption1Strong>
              <Stack gap="M" style={{ marginTop: 10 }}>
                <Stack direction="row" gap="XS" wrap align="center">
                  <Badge appearance="filled" color="brand">Brand</Badge>
                  <Badge appearance="tint" color="success">Verified</Badge>
                  <Badge appearance="tint" color="warning">Review</Badge>
                  <Badge appearance="tint" color="danger">Failed</Badge>
                  <Badge appearance="outline" color="informative">Info</Badge>
                  <Badge appearance="ghost" color="subtle">Ghost</Badge>
                </Stack>
                <Stack direction="row" gap="M" wrap align="center">
                  <CounterBadge count={12} />
                  <CounterBadge count={0} showZero />
                  <PresenceBadge status="available" />
                  <AvatarGroup>
                    <AvatarGroupItem name="Ama Owusu" />
                    <AvatarGroupItem name="Kwabena Asare" />
                    <AvatarGroupItem name="Efua Mensah" />
                  </AvatarGroup>
                  <StatusDot>All systems operational</StatusDot>
                </Stack>
                <TagGroup aria-label="Subjects">
                  <Tag>Core Maths</Tag>
                  <Tag>Physics</Tag>
                  <Tag>Chemistry</Tag>
                </TagGroup>
              </Stack>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* ─────────── Surfaces ─────────── */}
      <Section>
        <Container>
          <SectionLabel number="04">Surfaces</SectionLabel>
          <Title1 as="h2" block>Cards &amp; tiles</Title1>

          <Grid min={230} gap={14} style={{ marginTop: 20 }}>
            <Card appearance="filled"><Title3>Filled</Title3><Body muted>Default.</Body></Card>
            <Card appearance="filled-alternative"><Title3>Alternative</Title3><Body muted>Secondary.</Body></Card>
            <Card appearance="outline"><Title3>Outline</Title3><Body muted>No fill.</Body></Card>
            <Card appearance="subtle"><Title3>Subtle</Title3><Body muted>Lowest chrome.</Body></Card>
          </Grid>

          <Grid min={210} gap={14} style={{ marginTop: 16 }}>
            <StatTile label="Conversions" value="24" delta={{ direction: 'up', text: '+6 this month' }} />
            <StatTile label="Best USA GPA" value="3.78" hint="University of Ghana" />
            <StatTile label="Credits left" value="3" delta={{ direction: 'down', text: '−1 today' }} />
            <StatTile label="Aggregate" value="12" hint="WASSCE best six" />
          </Grid>

          <div style={{ marginTop: 16 }}>
            <Card>
              <EmptyState
                title="No conversions yet"
                description="Run your first conversion and it will show up here."
                action={<GradlyButton appearance="primary">Start a conversion</GradlyButton>}
              />
            </Card>
          </div>
        </Container>
      </Section>

      {/* ─────────── Inputs ─────────── */}
      <Section tone="subtle">
        <Container>
          <SectionLabel number="05">Inputs</SectionLabel>
          <Title1 as="h2" block>Form controls</Title1>
          <Lead>
            Each is a Fluent <code>Field</code> paired with a Fluent control — labels,
            hints, errors and the required marker are wired to the input by Fluent.
          </Lead>

          <Grid min={320} gap={16} style={{ marginTop: 20 }}>
            <Card>
              <Stack gap="L">
                <TextField
                  label="Full name"
                  placeholder="Ama Owusu"
                  value={text}
                  onChange={(_, d) => setText(d.value)}
                  hint="As it appears on your transcript"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={pw}
                  onChange={(_, d) => setPw(d.value)}
                  hint="At least 8 characters"
                />
                <TextField label="Email" defaultValue="not-an-email" error="Enter a valid email address" />
                <SearchField label="Search programmes" placeholder="e.g. Computer Science" />
              </Stack>
            </Card>

            <Card>
              <Stack gap="L">
                <SelectField
                  label="Source university"
                  options={[
                    { value: 'KNUST', label: 'KNUST' },
                    { value: 'UG', label: 'University of Ghana' },
                    { value: 'UCC', label: 'University of Cape Coast' },
                    { value: 'UEW', label: 'University of Education, Winneba' },
                  ]}
                  selectedOptions={uni}
                  value={uni[0] ?? ''}
                  onOptionSelect={(_, d) => setUni(d.selectedOptions)}
                  placeholder="Choose a university"
                />
                <NumberField label="Credit hours" min={0} max={6} step={1} defaultValue={3} />
                <TextAreaField label="Notes" placeholder="Anything the evaluator should know" hint="Optional" />
              </Stack>
            </Card>

            <Card>
              <Stack gap="L">
                <SliderField
                  label="Target aggregate"
                  min={6}
                  max={54}
                  value={aggregate}
                  onChange={(_, d) => setAggregate(d.value)}
                  showScale
                  hint="Lower is better — 6 is straight A1s"
                />
                <SliderField
                  label="Minimum GPA"
                  min={0}
                  max={4}
                  step={0.5}
                  defaultValue={3}
                  format={(v) => v.toFixed(1)}
                  showScale
                />
                <Divider />
                <CheckboxField
                  label="I agree to the terms"
                  checked={agree}
                  onChange={(_, d) => setAgree(Boolean(d.checked))}
                />
                <SwitchField
                  label="Email me my results"
                  checked={emails}
                  onChange={(_, d) => setEmails(d.checked)}
                  hint="We'll send a PDF copy"
                />
                <InfoLabel info="Shown as an example of Fluent's InfoLabel.">
                  Label with info
                </InfoLabel>
              </Stack>
            </Card>

            <Card>
              <Stack gap="L">
                <RadioField
                  label="Your stream"
                  value={stream}
                  onValueChange={setStream}
                  cards
                  options={[
                    { value: 'science', label: 'General Science', description: 'Physics, Chemistry, Biology, Elective Maths' },
                    { value: 'arts', label: 'General Arts', description: 'Literature, Government, Economics, History' },
                    { value: 'business', label: 'Business', description: 'Accounting, Costing, Business Management' },
                  ]}
                />
                <Divider />
                <OTPField label="Verification code" length={4} value={otp} onChange={setOtp} />
              </Stack>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* ─────────── Data ─────────── */}
      <Section id="data">
        <Container size="wide">
          <SectionLabel number="06">Data display</SectionLabel>
          <Title1 as="h2" block>Tables &amp; upload</Title1>

          <Stack gap="XXL" style={{ marginTop: 20 }}>
            <div>
              <Caption1Strong>DataTable — Fluent DataGrid, sortable and resizable</Caption1Strong>
              <div style={{ marginTop: 8 }}>
                <DataTable items={CONVERSIONS} columns={tableColumns} getRowId={(i) => i.id} sortable resizable />
              </div>
            </div>

            <div>
              <Caption1Strong>EditableTable — Fluent Table with an Input per cell</Caption1Strong>
              <div style={{ marginTop: 8 }}>
                <EditableTable
                  rows={rows}
                  columns={editableColumns}
                  onChange={(i, patch) =>
                    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
                  }
                  onRemove={(i) => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                  onAdd={() => setRows((prev) => [...prev, { name: '', code: '', credits: '', score: '', grade: '' }])}
                  addLabel="Add course"
                  summary={<Caption1>{rows.length} courses · {totalCredits} credits</Caption1>}
                />
              </div>
            </div>

            <Grid min={320} gap={16}>
              <div>
                <Caption1Strong>Empty</Caption1Strong>
                <div style={{ marginTop: 8 }}>
                  <DataTable items={[]} columns={tableColumns} getRowId={(i) => i.id} />
                </div>
              </div>
              <div>
                <Caption1Strong>Loading (Fluent Skeleton)</Caption1Strong>
                <div style={{ marginTop: 8 }}>
                  <DataTable items={[]} columns={tableColumns} getRowId={(i) => i.id} loading />
                </div>
              </div>
            </Grid>

            <div style={{ maxWidth: 560 }}>
              <Caption1Strong>FileDropzone</Caption1Strong>
              <div style={{ marginTop: 8 }}>
                <FileDropzone
                  file={file}
                  onFile={(f) => {
                    setFile(f)
                    toast.success('File accepted', f.name)
                  }}
                  onClear={() => setFile(null)}
                  progress={file ? 62 : undefined}
                  hint="Drag a transcript in, or click to browse"
                />
              </div>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* ─────────── Feedback ─────────── */}
      <Section tone="subtle">
        <Container>
          <SectionLabel number="07">Feedback</SectionLabel>
          <Title1 as="h2" block>Messages, toasts, dialogs</Title1>

          <Grid min={320} gap={16} style={{ marginTop: 20 }}>
            <Card>
              <Caption1Strong>Message bars</Caption1Strong>
              <Stack gap="S" style={{ marginTop: 10 }}>
                <MessageBanner intent="info" title="Heads up">KNUST publishes no official 4.0 CGPA.</MessageBanner>
                <MessageBanner intent="success" title="Saved">Your conversion is in your dashboard.</MessageBanner>
                <MessageBanner intent="warning" title="Low credits">One conversion left on this pack.</MessageBanner>
                <MessageBanner intent="error" title="Extraction failed" onDismiss={() => {}}>
                  Your credit has been refunded.
                </MessageBanner>
              </Stack>
            </Card>

            <Card>
              <Caption1Strong>Toasts</Caption1Strong>
              <Stack direction="row" gap="XS" wrap style={{ marginTop: 10 }}>
                <Button size="small" onClick={() => toast.success('Conversion saved', 'USA GPA 3.42')}>Success</Button>
                <Button size="small" onClick={() => toast.error('Out of credits', 'Buy a Convert Pack to continue.')}>Error</Button>
                <Button size="small" onClick={() => toast.warning('Check row 3', 'Score looks out of range.')}>Warning</Button>
                <Button size="small" onClick={() => toast.info('Parsing transcript…')}>Info</Button>
              </Stack>
              <div style={{ marginTop: 18 }}>
                <Caption1Strong>Progress &amp; loading</Caption1Strong>
                <Stack gap="M" style={{ marginTop: 8 }}>
                  <ProgressBar value={0.62} thickness="large" />
                  <ProgressBar />
                  <Loading inline label="Extracting courses" />
                  <Stack direction="row" gap="M" align="center">
                    <Spinner size="tiny" />
                    <Spinner size="small" />
                    <Spinner size="medium" />
                  </Stack>
                </Stack>
              </div>
            </Card>

            <Card>
              <Caption1Strong>Dialog, stepper, breadcrumbs</Caption1Strong>
              <Stack gap="M" style={{ marginTop: 10 }}>
                <div>
                  <Button appearance="primary" size="small" onClick={() => setConfirmOpen(true)}>
                    Delete conversion
                  </Button>
                </div>
                <Divider />
                <Stepper step={2} totalSteps={4} label="Course selection" />
                <Stepper step={4} totalSteps={4} label="Results" />
                <Divider />
                <Crumbs items={[{ label: 'Dashboard', href: '#' }, { label: 'University', href: '#' }, { label: 'Results' }]} />
                <Divider />
                <Stack direction="row" gap="S" wrap>
                  <Tooltip content="A Fluent tooltip" relationship="label" withArrow>
                    <Button size="small">Tooltip</Button>
                  </Tooltip>
                  <Popover>
                    <PopoverTrigger disableButtonEnhancement>
                      <Button size="small">Popover</Button>
                    </PopoverTrigger>
                    <PopoverSurface>
                      <Body1>Popover content, rendered in a Fluent portal.</Body1>
                    </PopoverSurface>
                  </Popover>
                </Stack>
              </Stack>
            </Card>

            <Card>
              <Caption1Strong>Tabs</Caption1Strong>
              <div style={{ marginTop: 10 }}>
                <TabsBar
                  tabs={[
                    { value: 'overview', label: 'Overview' },
                    { value: 'courses', label: 'Courses', icon: <DocumentRegular /> },
                    { value: 'history', label: 'History' },
                    { value: 'locked', label: 'Locked', disabled: true },
                  ]}
                  value={tab}
                  onValueChange={setTab}
                />
                <div style={{ marginTop: 12 }}>
                  <Body muted>Selected tab: {tab}</Body>
                </div>
              </div>
            </Card>
          </Grid>

          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete this conversion?"
            destructive
            confirmLabel="Delete"
            onConfirm={() => {
              setConfirmOpen(false)
              toast.success('Deleted')
            }}
          >
            <Body muted>This cannot be undone.</Body>
          </ConfirmDialog>
        </Container>
      </Section>

      {/* ─────────── Disclosure ─────────── */}
      <Section>
        <Container size="narrow">
          <SectionLabel number="08">Disclosure</SectionLabel>
          <Title1 as="h2" block>FAQ accordion</Title1>
          <div style={{ marginTop: 16 }}>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </Container>
      </Section>

      {/* ─────────── Motion ─────────── */}
      <Section tone="inverted">
        <Container>
          <SectionLabel number="09">Motion</SectionLabel>
          <Title1 as="h2" block>Presence &amp; reveal</Title1>
          <Lead>
            Enter/exit is Fluent&rsquo;s <code>createPresenceComponent</code>. Scroll
            reveals use Fluent motion tokens with IntersectionObserver, because Fluent
            has no scroll primitive. All of it collapses under reduced-motion.
          </Lead>

          <div style={{ marginTop: 20 }}>
            <Button appearance="primary" size="small" onClick={() => setPresenceOn((v) => !v)}>
              Toggle presence
            </Button>
          </div>

          <Grid min={240} gap={14} style={{ marginTop: 18 }}>
            <div style={{ minHeight: 110 }}>
              <Caption1Strong>Fade</Caption1Strong>
              <Fade visible={presenceOn} unmountOnExit>
                <div><Card appearance="filled"><Body1>Fade</Body1></Card></div>
              </Fade>
            </div>
            <div style={{ minHeight: 110 }}>
              <Caption1Strong>FadeUp</Caption1Strong>
              <FadeUp visible={presenceOn} unmountOnExit>
                <div><Card appearance="filled"><Body1>FadeUp</Body1></Card></div>
              </FadeUp>
            </div>
            <div style={{ minHeight: 110 }}>
              <Caption1Strong>Scale</Caption1Strong>
              <Scale visible={presenceOn} unmountOnExit>
                <div><Card appearance="filled"><Body1>Scale</Body1></Card></div>
              </Scale>
            </div>
          </Grid>

          <div style={{ marginTop: 28 }}>
            <Caption1Strong>Reveal on scroll (staggered)</Caption1Strong>
            <Grid min={200} gap={14} style={{ marginTop: 8 }}>
              {[0, 1, 2, 3].map((i) => (
                <Reveal key={i} delay={i * 90}>
                  <Card appearance="filled">
                    <Stat>{(3.1 + i * 0.2).toFixed(2)}</Stat>
                    <Caption1>Reveal {i + 1}</Caption1>
                  </Card>
                </Reveal>
              ))}
            </Grid>
          </div>

          <div style={{ marginTop: 28 }}>
            <Caption1Strong>Marquee</Caption1Strong>
            <div style={{ marginTop: 8 }}>
              <Marquee speed={28}>
                {['KNUST', 'University of Ghana', 'UCC', 'UEW', 'Ashesi', 'GIMPA'].map((n) => (
                  <div key={n} style={{ padding: '0 28px', whiteSpace: 'nowrap' }}>
                    <Title2>{n}</Title2>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </Container>
      </Section>

      {/* ─────────── Provenance ─────────── */}
      <Section id="provenance" tone="subtle">
        <Container size="wide">
          <SectionLabel number="10">Provenance</SectionLabel>
          <Title1 as="h2" block>What is Fluent, and what is ours</Title1>
          <Lead>
            Fluent v9 has no layout, dropzone, OTP or scroll-motion components. Those
            four are compositions; everything else is Fluent, either re-exported
            unchanged or paired with a Fluent <code>Field</code>.
          </Lead>

          <div style={{ marginTop: 20, overflowX: 'auto' }}>
            <Table size="small">
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Export</TableHeaderCell>
                  <TableHeaderCell>Built from</TableHeaderCell>
                  <TableHeaderCell style={{ width: 150 }}>Kind</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PROVENANCE.map((row) => (
                  <TableRow key={row.export}>
                    <TableCell><Body1Strong>{row.export}</Body1Strong></TableCell>
                    <TableCell><Body1>{row.built}</Body1></TableCell>
                    <TableCell>
                      <Badge
                        appearance="tint"
                        color={
                          row.kind === 'fluent' ? 'success' : row.kind === 'wrapper' ? 'informative' : 'warning'
                        }
                      >
                        {row.kind === 'fluent' ? 'Fluent' : row.kind === 'wrapper' ? 'Fluent + wrapper' : 'Composition'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Container>
      </Section>

      <Section tight tone="muted">
        <Container>
          <Stack direction="row" justify="between" align="center" wrap gap="M">
            <Logo />
            <Caption1 className={s.muted}>Fluent UI · Gradly component library</Caption1>
            <StatusDot>Typecheck clean</StatusDot>
          </Stack>
        </Container>
      </Section>
    </>
  )
}
