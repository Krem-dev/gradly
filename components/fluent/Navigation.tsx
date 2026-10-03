'use client'

import { Fragment, useState } from 'react'
import {
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
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Avatar,
  Subtitle2,
  Tooltip,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components'
import {
  NavigationRegular,
  DismissRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
  SignOutRegular,
} from '@fluentui/react-icons'
import { IconButton } from './Button'
import { useGradlyTheme } from './GradlyProvider'
import { Body } from './Text'
import { Container, Stack } from './Layout'

const useStyles = makeStyles({
  header: {
    width: '100%',
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground1,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
  },
  sticky: { position: 'sticky', top: 0, zIndex: 40 },

  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    textDecorationLine: 'none',
    color: 'inherit',
    flexShrink: 0,
  },
  wordmark: { color: tokens.colorNeutralForeground1 },

  navLink: {
    textDecorationLine: 'none',
    color: tokens.colorNeutralForeground2,
    ':hover': { color: tokens.colorNeutralForeground1 },
  },
  hideOnMobile: {
    display: 'none',
    '@media (min-width: 768px)': { display: 'inline-flex' },
  },
  hideOnDesktop: {
    display: 'inline-flex',
    '@media (min-width: 768px)': { display: 'none' },
  },
  // Without `minWidth: 0` a flex child refuses to shrink below its content
  // width and pushes the page wider than the viewport.
  headerActions: { minWidth: 0, flexShrink: 1 },

  accordionPanel: { color: tokens.colorNeutralForeground2 },
  drawerLink: {
    display: 'block',
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    textDecorationLine: 'none',
    color: tokens.colorNeutralForeground1,
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
})

/* ─────────────────────────── Logo ─────────────────────────── */

export function Logo({
  href = '/',
  showWordmark = true,
}: {
  href?: string
  showWordmark?: boolean
}) {
  const s = useStyles()
  return (
    <a href={href} className={s.logo} aria-label="Gradly home">
      <Avatar
        name="Gradly"
        initials="G"
        shape="square"
        size={32}
        active="unset"
        color="brand"
        aria-hidden
      />
      {showWordmark && <Subtitle2 className={s.wordmark}>Gradly</Subtitle2>}
    </a>
  )
}

/* ─────────────────────────── Theme toggle ─────────────────────────── */

export function ThemeToggle() {
  const { mode, toggle } = useGradlyTheme()
  return (
    <Tooltip
      content={mode === 'light' ? 'Switch to dark' : 'Switch to light'}
      relationship="label"
      withArrow
    >
      <IconButton
        icon={mode === 'light' ? <WeatherMoonRegular /> : <WeatherSunnyRegular />}
        onClick={toggle}
        label={mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      />
    </Tooltip>
  )
}

/* ─────────────────────────── App header ─────────────────────────── */

export type NavItem = { label: string; href: string }

/**
 * Shared page header. Replaces both `Navigation` (marketing) and `AppShell`'s
 * header (product) — they differed only in which slots were filled, so this takes
 * the links, an optional centre slot (the step rail) and an optional right slot.
 */
export function AppHeader({
  links = [],
  center,
  right,
  user,
  onSignOut,
  sticky = false,
  containerSize = 'wide',
}: {
  links?: NavItem[]
  center?: React.ReactNode
  right?: React.ReactNode
  /** Omit for the signed-out header. */
  user?: { name: string; email?: string }
  onSignOut?: () => void
  sticky?: boolean
  containerSize?: 'narrow' | 'default' | 'wide' | 'full'
}) {
  const s = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className={mergeClasses(s.header, sticky && s.sticky)}>
        <Container size={containerSize}>
          <Stack direction="row" align="center" justify="between" gap={16}>
            <Logo />

            {center}

            <Stack direction="row" align="center" gap={12} className={s.headerActions}>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={mergeClasses(s.navLink, s.hideOnMobile)}
                >
                  {l.label}
                </a>
              ))}

              {right}
              <ThemeToggle />

              {user ? (
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <IconButton
                      appearance="transparent"
                      label={`Account menu for ${user.name}`}
                      icon={
                        <Avatar name={user.name} size={28} color="colorful" aria-hidden />
                      }
                    />
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem disabled>{user.email ?? user.name}</MenuItem>
                      <MenuItem onClick={() => (window.location.href = '/dashboard')}>
                        Dashboard
                      </MenuItem>
                      <MenuItem icon={<SignOutRegular />} onClick={onSignOut}>
                        Sign out
                      </MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              ) : (
                <a href="/login" className={mergeClasses(s.navLink, s.hideOnMobile)}>
                  Sign in →
                </a>
              )}

              {links.length > 0 && (
                <IconButton
                  className={s.hideOnDesktop}
                  icon={<NavigationRegular />}
                  onClick={() => setDrawerOpen(true)}
                  label="Open menu"
                />
              )}
            </Stack>
          </Stack>
        </Container>
      </header>

      <OverlayDrawer
        open={drawerOpen}
        onOpenChange={(_, data) => setDrawerOpen(data.open)}
        position="end"
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <IconButton
                icon={<DismissRegular />}
                onClick={() => setDrawerOpen(false)}
                label="Close menu"
              />
            }
          >
            Menu
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={s.drawerLink}>
              {l.label}
            </a>
          ))}
          <a href="/login" className={s.drawerLink}>
            Sign in
          </a>
        </DrawerBody>
      </OverlayDrawer>
    </>
  )
}

/* ─────────────────────────── Tabs ─────────────────────────── */

export function TabsBar({
  tabs,
  value,
  onValueChange,
  size = 'medium',
}: {
  tabs: Array<{ value: string; label: string; icon?: React.ReactElement; disabled?: boolean }>
  value: string
  onValueChange: (value: string) => void
  size?: 'small' | 'medium' | 'large'
}) {
  const s = useStyles()
  return (
    <TabList
      selectedValue={value}
      onTabSelect={(_, data) => onValueChange(data.value as string)}
      size={size}
    >
      {tabs.map((t) => (
        <Tab key={t.value} value={t.value} icon={t.icon} disabled={t.disabled}>
          {t.label}
        </Tab>
      ))}
    </TabList>
  )
}

/* ─────────────────────────── Breadcrumbs ─────────────────────────── */

export function Crumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <Breadcrumb aria-label="Breadcrumb">
      {items.map((item, i) => (
        // The divider is a sibling of the item, not a child: both render as <li>,
        // and nesting them is invalid HTML that fails hydration.
        <Fragment key={`${item.label}-${i}`}>
          <BreadcrumbItem>
            <BreadcrumbButton href={item.href} current={i === items.length - 1}>
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          {i < items.length - 1 && <BreadcrumbDivider />}
        </Fragment>
      ))}
    </Breadcrumb>
  )
}

/* ─────────────────────────── FAQ accordion ─────────────────────────── */

/**
 * Fluent's `Accordion` handles the disclosure semantics (`aria-expanded`, the
 * header button, panel association) and the expand/collapse animation, so the FAQ
 * section only supplies content and the editorial type sizes.
 */
export function FaqAccordion({
  items,
  defaultOpen = 0,
  collapsible = true,
}: {
  items: Array<{ question: string; answer: React.ReactNode }>
  /** Index open on first render. Pass `-1` for all closed. */
  defaultOpen?: number
  collapsible?: boolean
}) {
  const s = useStyles()
  return (
    <Accordion
      collapsible={collapsible}
      defaultOpenItems={defaultOpen >= 0 ? [defaultOpen] : []}
    >
      {items.map((item, i) => (
        <AccordionItem key={i} value={i}>
          <AccordionHeader expandIconPosition="end">
            {item.question}
          </AccordionHeader>
          <AccordionPanel className={s.accordionPanel}>
            <Body muted>{item.answer}</Body>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export {
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
} from '@fluentui/react-components'
