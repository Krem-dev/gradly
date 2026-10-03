'use client'

/**
 * Component gallery for the Fluent UI rebuild.
 *
 * Every primitive in `@/components/fluent` is rendered here with its variants and
 * states so the system can be reviewed in one place before any page is rebuilt.
 * This route is a workbench, not product UI — it is safe to delete once the
 * rebuild lands.
 */

import { useState } from 'react'
import {
  // provider + theme
  GradlyProvider,
  useGradlyTheme,
  // type
  Display,
  Lead,
  Body,
  Kicker,
  Stat,
  Title3,
  // layout
  Container,
  Section,
  Stack,
  Grid,
  PageBackground,
  Divider,
  // actions
  GradlyButton,
  ToggleButton,
  CompoundButton,
  // surfaces
  GradlyCard,
  StatTile,
  EmptyState,
  // badges
  GradlyBadge,
  SectionLabel,
  StatusDot,
  CreditsPill,
  CounterBadge,
  Avatar,
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
  // data
  DataTable,
  EditableTable,
  FileDropzone,
  type DataTableColumn,
  type EditableColumn,
  // feedback
  useGradlyToast,
  MessageBanner,
  Loading,
  ConfirmDialog,
  Stepper,
  ProgressBar,
  Tooltip,
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
  gradlyBrand,
  gradlyTokens,
  makeStyles,
  tokens,
} from '@/components/fluent'

const useStyles = makeStyles({
  swatchRow: { display: 'flex', flexWrap: 'wrap', gap: '0' },
  swatch: {
    width: '62px',
    height: '72px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '6px',
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '9px',
  },
  tokenBox: {
    height: '56px',
    borderRadius: tokens.borderRadiusLarge,
    display: 'flex',
    alignItems: 'flex-end',
    padding: '8px',
    fontFamily: gradlyTokens.fontFamilyMono,
    fontSize: '10px',
  },
  sticky: {
    position: 'sticky',
    top: '0',
    zIndex: 30,
    backgroundColor: tokens.colorNeutralBackground1,
    paddingTop: '12px',
    paddingBottom: '12px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    ...{ borderBottomColor: gradlyTokens.ink100 },
  },
  specimen: {
    padding: '20px',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: gradlyTokens.surfaceAlt,
  },
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
  { question: 'How accurate is the WASSCE aggregate?', answer: 'It follows the WAEC methodology exactly: three core subjects plus your three best electives, with the per-university counting quirks applied (KNUST treats C4–C6 as four points).' },
  { question: 'Which universities are supported?', answer: 'KNUST, University of Ghana, UCC and UEW have authoritative per-university grading tables. Other institutions fall back to the WES/Scholaro mapping.' },
  { question: 'Do you store my transcript?', answer: 'The file is parsed in memory and discarded. Only the extracted course rows are saved, and only if you choose to save the conversion.' },
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

  const [tab, setTab] = useState('palette')
  const [text, setText] = useState('')
  const [pw, setPw] = useState('')
  const [uni, setUni] = useState<string[]>(['KNUST'])
  const [agree, setAgree] = useState(false)
  const [dark, setDark] = useState(false)
  const [stream, setStream] = useState('science')
  const [aggregate, setAggregate] = useState(12)
  const [otp, setOtp] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [fadeOn, setFadeOn] = useState(true)
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
    { id: 'system', header: 'Source system', render: (i) => i.system, width: 130 },
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
        <GradlyBadge tone={i.classification === 'First Class' ? 'success' : 'informative'}>
          {i.classification}
        </GradlyBadge>
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
          { label: 'Motion', href: '#motion' },
        ]}
        right={<CreditsPill balance={3} href="#" />}
        user={{ name: 'Ama Owusu', email: 'ama@example.com' }}
        onSignOut={() => toast.info('Sign out', 'Wired by the page, not the header.')}
        sticky
      />

      <PageBackground glow="both">
        <Section tight>
          <Container>
            <SectionLabel number="v1">Fluent UI component library</SectionLabel>
            <Display size="xl" as="h1" className="">
              Every control, one page.
            </Display>
            <Lead>
              The full Fluent UI translation of the Gradly interface — palette, type,
              controls, data display, feedback and motion. Currently rendering in{' '}
              <strong>{mode}</strong> mode; the toggle is in the header.
            </Lead>
            <div style={{ marginTop: 24 }}>
              <Stack direction="row" gap={10} wrap>
                <GradlyButton variant="primary" withArrow>
                  Primary action
                </GradlyButton>
                <GradlyButton variant="secondary">Secondary</GradlyButton>
                <ThemeToggle />
              </Stack>
            </div>
          </Container>
        </Section>

        {/* ─────────── Palette ─────────── */}
        <Section id="palette" tone="alt">
          <Container>
            <SectionLabel number="01">Colour</SectionLabel>
            <Display size="md">Brand ramp &amp; tokens</Display>
            <Lead>
              Fluent generates ~460 colour slots from one 16-step brand ramp. Shade 80
              is the legacy indigo; shade 20 is the legacy ink navy.
            </Lead>

            <div style={{ marginTop: 28 }}>
              <Kicker>Brand ramp (10 → 160)</Kicker>
              <div className={s.swatchRow} style={{ marginTop: 10 }}>
                {Object.entries(gradlyBrand).map(([step, hex]) => (
                  <div
                    key={step}
                    className={s.swatch}
                    style={{
                      backgroundColor: hex as string,
                      color: Number(step) >= 90 ? '#0B1437' : '#FFFFFF',
                    }}
                  >
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <Kicker>Semantic tokens</Kicker>
              <Grid min={150} gap={12} className="">
                {[
                  ['ink900', gradlyTokens.ink900, '#fff'],
                  ['ink500', gradlyTokens.ink500, '#fff'],
                  ['ink100', gradlyTokens.ink100, '#0B1437'],
                  ['amber', gradlyTokens.amber, '#0B1437'],
                  ['success', gradlyTokens.success, '#fff'],
                  ['danger', gradlyTokens.danger, '#fff'],
                  ['brand', tokens.colorBrandBackground, '#fff'],
                  ['surfaceMuted', gradlyTokens.surfaceMuted, '#0B1437'],
                ].map(([name, value, fg]) => (
                  <div
                    key={name}
                    className={s.tokenBox}
                    style={{ backgroundColor: value, color: fg }}
                  >
                    {name}
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
            <Display size="md">Two faces, one ramp</Display>
            <Lead>
              Fraunces for display, Inter for everything else, plus a mono kicker for
              metadata. Display sizes are clamped, so they scale with the viewport.
            </Lead>

            <div className={s.specimen} style={{ marginTop: 24 }}>
              <Stack gap={20}>
                <div>
                  <Kicker>Display 2xl</Kicker>
                  <Display size="2xl" as="p">From WASSCE to world-class</Display>
                </div>
                <Divider />
                <div>
                  <Kicker>Display xl</Kicker>
                  <Display size="xl" as="p">From WASSCE to world-class</Display>
                </div>
                <Divider />
                <div>
                  <Kicker>Display lg</Kicker>
                  <Display size="lg" as="p">From WASSCE to world-class</Display>
                </div>
                <Divider />
                <div>
                  <Kicker>Display md</Kicker>
                  <Display size="md" as="p">From WASSCE to world-class</Display>
                </div>
                <Divider />
                <div>
                  <Kicker>Lead</Kicker>
                  <Lead>
                    Convert your Ghanaian university grades to the US 4.0 scale using the
                    WES course-by-course method.
                  </Lead>
                </div>
                <div>
                  <Kicker>Body</Kicker>
                  <Body>
                    Each course is mapped individually, then weighted by credit hours.
                  </Body>
                </div>
                <div>
                  <Kicker>Body muted</Kicker>
                  <Body muted>
                    KNUST publishes no official 4.0 CGPA — this is the WES estimate.
                  </Body>
                </div>
                <div>
                  <Kicker>Stat</Kicker>
                  <Stat>3.42</Stat>
                </div>
              </Stack>
            </div>
          </Container>
        </Section>

        {/* ─────────── Buttons ─────────── */}
        <Section id="controls" tone="alt">
          <Container>
            <SectionLabel number="03">Actions</SectionLabel>
            <Display size="md">Buttons</Display>

            <Grid min={300} gap={20} className="">
              <GradlyCard>
                <Kicker>Variants</Kicker>
                <Stack gap={10} style={{ marginTop: 12 }}>
                  <Stack direction="row" gap={10} wrap>
                    <GradlyButton variant="primary">Primary</GradlyButton>
                    <GradlyButton variant="brand">Brand</GradlyButton>
                    <GradlyButton variant="secondary">Secondary</GradlyButton>
                  </Stack>
                  <Stack direction="row" gap={10} wrap>
                    <GradlyButton variant="ghost">Ghost</GradlyButton>
                    <GradlyButton variant="pill">Pill</GradlyButton>
                    <GradlyButton variant="danger">Danger</GradlyButton>
                  </Stack>
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Kicker>Sizes</Kicker>
                <Stack direction="row" gap={10} align="center" wrap style={{ marginTop: 12 }}>
                  <GradlyButton size="sm">Small</GradlyButton>
                  <GradlyButton size="md">Medium</GradlyButton>
                  <GradlyButton size="lg">Large</GradlyButton>
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Kicker>With arrow</Kicker>
                <Stack direction="row" gap={10} align="center" wrap style={{ marginTop: 12 }}>
                  <GradlyButton size="sm" withArrow>Small</GradlyButton>
                  <GradlyButton size="md" withArrow>Medium</GradlyButton>
                  <GradlyButton size="lg" withArrow variant="pill">Large</GradlyButton>
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Kicker>States</Kicker>
                <Stack direction="row" gap={10} align="center" wrap style={{ marginTop: 12 }}>
                  <GradlyButton loading>Loading</GradlyButton>
                  <GradlyButton disabled>Disabled</GradlyButton>
                  <GradlyButton href="/fluent-preview" withArrow variant="secondary">
                    As link
                  </GradlyButton>
                  <GradlyButton fullWidth variant="ghost">Full width</GradlyButton>
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Kicker>Fluent extras</Kicker>
                <Stack direction="row" gap={10} align="center" wrap style={{ marginTop: 12 }}>
                  <ToggleButton>Toggle</ToggleButton>
                  <CompoundButton secondaryContent="3 credits">Buy pack</CompoundButton>
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Kicker>Badges &amp; status</Kicker>
                <Stack gap={12} style={{ marginTop: 12 }}>
                  <Stack direction="row" gap={8} wrap align="center">
                    <GradlyBadge tone="brand">Brand</GradlyBadge>
                    <GradlyBadge tone="success">Verified</GradlyBadge>
                    <GradlyBadge tone="warning">Review</GradlyBadge>
                    <GradlyBadge tone="danger">Failed</GradlyBadge>
                    <GradlyBadge tone="amber">Amber</GradlyBadge>
                    <GradlyBadge tone="ink">Ink</GradlyBadge>
                  </Stack>
                  <Stack direction="row" gap={14} wrap align="center">
                    <StatusDot state="success">All systems operational</StatusDot>
                    <CounterBadge count={12} />
                    <Avatar name="Ama Owusu" size={28} color="colorful" />
                    <Tooltip content="A Fluent tooltip" relationship="label" withArrow>
                      <GradlyButton variant="ghost" size="sm">Hover me</GradlyButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </GradlyCard>
            </Grid>
          </Container>
        </Section>

        {/* ─────────── Cards ─────────── */}
        <Section>
          <Container>
            <SectionLabel number="04">Surfaces</SectionLabel>
            <Display size="md">Cards &amp; tiles</Display>

            <Grid min={230} gap={16} className="">
              <GradlyCard tone="surface"><Title3>Surface</Title3><Body muted>Default card.</Body></GradlyCard>
              <GradlyCard tone="muted"><Title3>Muted</Title3><Body muted>Secondary grouping.</Body></GradlyCard>
              <GradlyCard tone="outline"><Title3>Outline</Title3><Body muted>No fill.</Body></GradlyCard>
              <GradlyCard tone="ink"><Title3>Ink</Title3><Body muted>Inverts the ink scale.</Body></GradlyCard>
              <GradlyCard tone="amber"><Title3>Amber</Title3><Body muted>Needs attention.</Body></GradlyCard>
              <GradlyCard interactive><Title3>Interactive</Title3><Body muted>Lifts on hover.</Body></GradlyCard>
            </Grid>

            <div style={{ marginTop: 20 }}>
              <Grid min={210} gap={16}>
                <StatTile label="Conversions" value="24" delta={{ direction: 'up', text: '+6 this month' }} />
                <StatTile label="Best USA GPA" value="3.78" hint="University of Ghana" />
                <StatTile label="Credits left" value="3" tone="amber" delta={{ direction: 'down', text: '−1 today' }} />
                <StatTile label="Aggregate" value="12" hint="WASSCE best six" />
              </Grid>
            </div>

            <div style={{ marginTop: 20 }}>
              <GradlyCard padding="none">
                <EmptyState
                  title="No conversions yet"
                  description="Run your first conversion and it will show up here."
                  action={<GradlyButton withArrow>Start a conversion</GradlyButton>}
                />
              </GradlyCard>
            </div>
          </Container>
        </Section>

        {/* ─────────── Inputs ─────────── */}
        <Section tone="alt">
          <Container>
            <SectionLabel number="05">Inputs</SectionLabel>
            <Display size="md">Form controls</Display>
            <Lead>
              Every field is a Fluent `Field` + control pair, so labels, hints, errors
              and the required marker are wired to the input by Fluent, not by hand.
            </Lead>

            <Grid min={320} gap={20} className="">
              <GradlyCard>
                <Stack gap={18}>
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
                  <TextField
                    label="Email"
                    defaultValue="not-an-email"
                    error="Enter a valid email address"
                  />
                  <SearchField label="Search programmes" placeholder="e.g. Computer Science" />
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Stack gap={18}>
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
                  <TextAreaField
                    label="Notes"
                    placeholder="Anything the evaluator should know"
                    hint="Optional"
                  />
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Stack gap={18}>
                  <SliderField
                    label="Target aggregate"
                    min={6}
                    max={54}
                    step={1}
                    value={aggregate}
                    onChange={(_, d) => setAggregate(d.value)}
                    showScale
                    hint="Lower is better — 6 is straight A1s"
                  />
                  <SliderField
                    label="Minimum GPA"
                    min={0}
                    max={4}
                    step={0.1}
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
                    checked={dark}
                    onChange={(_, d) => setDark(d.checked)}
                    hint="We'll send a PDF copy"
                  />
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Stack gap={18}>
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
              </GradlyCard>
            </Grid>
          </Container>
        </Section>

        {/* ─────────── Data ─────────── */}
        <Section id="data">
          <Container size="wide">
            <SectionLabel number="06">Data display</SectionLabel>
            <Display size="md">Tables &amp; upload</Display>

            <Stack gap={24} style={{ marginTop: 24 }}>
              <div>
                <Kicker>DataTable — sortable, resizable</Kicker>
                <div style={{ marginTop: 10 }}>
                  <DataTable
                    items={CONVERSIONS}
                    columns={tableColumns}
                    getRowId={(i) => i.id}
                    sortable
                    resizable
                  />
                </div>
              </div>

              <div>
                <Kicker>EditableTable — transcript rows</Kicker>
                <div style={{ marginTop: 10 }}>
                  <EditableTable
                    rows={rows}
                    columns={editableColumns}
                    onChange={(i, patch) =>
                      setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
                    }
                    onRemove={(i) => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                    onAdd={() =>
                      setRows((prev) => [...prev, { name: '', code: '', credits: '', score: '', grade: '' }])
                    }
                    addLabel="Add course"
                    summary={<Kicker>{rows.length} courses · {totalCredits} credits</Kicker>}
                  />
                </div>
              </div>

              <Grid min={320} gap={20}>
                <div>
                  <Kicker>Empty table</Kicker>
                  <div style={{ marginTop: 10 }}>
                    <DataTable items={[]} columns={tableColumns} getRowId={(i) => i.id} />
                  </div>
                </div>
                <div>
                  <Kicker>Loading table</Kicker>
                  <div style={{ marginTop: 10 }}>
                    <DataTable items={[]} columns={tableColumns} getRowId={(i) => i.id} loading />
                  </div>
                </div>
              </Grid>

              <div>
                <Kicker>FileDropzone</Kicker>
                <div style={{ marginTop: 10, maxWidth: 560 }}>
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
        <Section tone="alt">
          <Container>
            <SectionLabel number="07">Feedback</SectionLabel>
            <Display size="md">Messages, toasts, dialogs</Display>

            <Grid min={320} gap={20} className="">
              <GradlyCard>
                <Kicker>Message bars</Kicker>
                <Stack gap={10} style={{ marginTop: 12 }}>
                  <MessageBanner intent="info" title="Heads up">
                    KNUST publishes no official 4.0 CGPA.
                  </MessageBanner>
                  <MessageBanner intent="success" title="Saved">
                    Your conversion is in your dashboard.
                  </MessageBanner>
                  <MessageBanner intent="warning" title="Low credits">
                    One conversion left on this pack.
                  </MessageBanner>
                  <MessageBanner intent="error" title="Extraction failed" onDismiss={() => {}}>
                    Your credit has been refunded.
                  </MessageBanner>
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Kicker>Toasts</Kicker>
                <Stack direction="row" gap={8} wrap style={{ marginTop: 12 }}>
                  <GradlyButton size="sm" variant="secondary" onClick={() => toast.success('Conversion saved', 'USA GPA 3.42')}>
                    Success
                  </GradlyButton>
                  <GradlyButton size="sm" variant="secondary" onClick={() => toast.error('Out of credits', 'Buy a Convert Pack to continue.')}>
                    Error
                  </GradlyButton>
                  <GradlyButton size="sm" variant="secondary" onClick={() => toast.warning('Check row 3', 'Score looks out of range.')}>
                    Warning
                  </GradlyButton>
                  <GradlyButton size="sm" variant="secondary" onClick={() => toast.info('Parsing transcript…')}>
                    Info
                  </GradlyButton>
                </Stack>

                <div style={{ marginTop: 20 }}>
                  <Kicker>Progress &amp; loading</Kicker>
                  <Stack gap={12} style={{ marginTop: 10 }}>
                    <ProgressBar value={0.62} thickness="large" />
                    <ProgressBar />
                    <Loading inline label="Extracting courses" />
                  </Stack>
                </div>
              </GradlyCard>

              <GradlyCard>
                <Kicker>Dialog &amp; stepper</Kicker>
                <Stack gap={16} style={{ marginTop: 12 }}>
                  <GradlyButton variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
                    Delete conversion
                  </GradlyButton>
                  <Divider />
                  <Stepper step={2} totalSteps={4} label="Course selection" />
                  <Stepper step={4} totalSteps={4} label="Results" />
                  <Divider />
                  <Crumbs
                    items={[
                      { label: 'Dashboard', href: '#' },
                      { label: 'University', href: '#' },
                      { label: 'Results' },
                    ]}
                  />
                </Stack>
              </GradlyCard>

              <GradlyCard>
                <Kicker>Tabs</Kicker>
                <div style={{ marginTop: 12 }}>
                  <TabsBar
                    tabs={[
                      { value: 'palette', label: 'Overview' },
                      { value: 'courses', label: 'Courses' },
                      { value: 'history', label: 'History' },
                      { value: 'locked', label: 'Locked', disabled: true },
                    ]}
                    value={tab}
                    onValueChange={setTab}
                  />
                  <div style={{ marginTop: 14 }}>
                    <Body muted>Selected tab: {tab}</Body>
                  </div>
                </div>
              </GradlyCard>
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

        {/* ─────────── Accordion ─────────── */}
        <Section>
          <Container size="narrow">
            <SectionLabel number="08">Disclosure</SectionLabel>
            <Display size="md">FAQ accordion</Display>
            <div style={{ marginTop: 20 }}>
              <FaqAccordion items={FAQ_ITEMS} />
            </div>
          </Container>
        </Section>

        {/* ─────────── Motion ─────────── */}
        <Section id="motion" tone="ink">
          <Container>
            <SectionLabel number="09">Motion</SectionLabel>
            <Display size="md">Presence &amp; reveal</Display>
            <Lead>
              Enter/exit animations are Fluent presence components; scroll reveals are
              CSS transitions driven by IntersectionObserver with Fluent motion tokens.
              All of it collapses under `prefers-reduced-motion`.
            </Lead>

            <div style={{ marginTop: 24 }}>
              <Stack direction="row" gap={10} wrap>
                <GradlyButton variant="pill" size="sm" onClick={() => setFadeOn((v) => !v)}>
                  Toggle presence
                </GradlyButton>
              </Stack>
            </div>

            <Grid min={240} gap={16} className="">
              <div style={{ marginTop: 20, minHeight: 130 }}>
                <Kicker>Fade</Kicker>
                <Fade visible={fadeOn} unmountOnExit>
                  <div>
                    <GradlyCard tone="surface"><Body>Fade</Body></GradlyCard>
                  </div>
                </Fade>
              </div>
              <div style={{ marginTop: 20, minHeight: 130 }}>
                <Kicker>FadeUp</Kicker>
                <FadeUp visible={fadeOn} unmountOnExit>
                  <div>
                    <GradlyCard tone="surface"><Body>FadeUp</Body></GradlyCard>
                  </div>
                </FadeUp>
              </div>
              <div style={{ marginTop: 20, minHeight: 130 }}>
                <Kicker>Scale</Kicker>
                <Scale visible={fadeOn} unmountOnExit>
                  <div>
                    <GradlyCard tone="surface"><Body>Scale</Body></GradlyCard>
                  </div>
                </Scale>
              </div>
            </Grid>

            <div style={{ marginTop: 32 }}>
              <Kicker>Reveal on scroll (staggered)</Kicker>
              <Grid min={200} gap={16} className="">
                {[0, 1, 2, 3].map((i) => (
                  <Reveal key={i} delay={i * 90}>
                    <GradlyCard tone="surface">
                      <Stat>{(3.1 + i * 0.2).toFixed(2)}</Stat>
                      <Kicker>Reveal {i + 1}</Kicker>
                    </GradlyCard>
                  </Reveal>
                ))}
              </Grid>
            </div>

            <div style={{ marginTop: 32 }}>
              <Kicker>Marquee</Kicker>
              <div style={{ marginTop: 10 }}>
                <Marquee speed={28}>
                  {['KNUST', 'University of Ghana', 'UCC', 'UEW', 'Ashesi', 'GIMPA'].map((n) => (
                    <div key={n} style={{ padding: '0 28px', whiteSpace: 'nowrap' }}>
                      <Display size="md" as="span">{n}</Display>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </Container>
        </Section>

        <Section tight tone="muted">
          <Container>
            <Stack direction="row" justify="between" align="center" wrap gap={16}>
              <Logo />
              <Kicker>Fluent UI {`·`} Gradly component library</Kicker>
              <StatusDot state="success">Typecheck clean</StatusDot>
            </Stack>
          </Container>
        </Section>
      </PageBackground>
    </>
  )
}
