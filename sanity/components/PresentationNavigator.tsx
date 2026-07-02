'use client'

import {useEffect, useState, useSyncExternalStore} from 'react'
import {ChevronRightIcon, DocumentIcon, FolderIcon} from '@sanity/icons'
import {useClient} from 'sanity'
import {usePresentationNavigate, usePresentationParams} from 'sanity/presentation'
import {apiVersion} from '../env'
import {HOME_PAGE_SECTIONS} from '../homePageSections'
import {HOME_PAGE_ID, SITE_SETTINGS_ID} from '../ids'
import {
  getPresentationSection,
  setPresentationSection,
  subscribePresentationSection,
} from '../presentationSectionStore'

const GROUPED_HOME_PAGE_SECTIONS = new Set(['collaborateurs', 'faq'])

const HOME_PAGE_SECTION_SHORTCUTS = HOME_PAGE_SECTIONS.filter(
  (section) => !GROUPED_HOME_PAGE_SECTIONS.has(section.sectionId),
)

const SECTION_PREVIEW_HASH: Partial<Record<string, string>> = {
  approche: '/#approche',
  faq: '/#faq',
  collaborateurs: '/#collaborateurs',
}

type ListedDoc = {
  _id: string
  title: string
  subtitle?: string
}

const FAQS_QUERY = `*[_type == "faq"] | order(order asc) { _id, "title": question }`
const COLLABORATORS_QUERY = `*[_type == "collaborator"] | order(order asc, name asc) {
  _id,
  "title": name,
  "subtitle": select(featured => "Mis en avant")
}`

function useDocList(query: string, listenFilter: string) {
  const client = useClient({apiVersion})
  const [docs, setDocs] = useState<ListedDoc[]>([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const result = await client.fetch<ListedDoc[]>(query)
      if (!cancelled) setDocs(result)
    }

    load()
    const subscription = client
      .listen(listenFilter, {}, {includeResult: false})
      .subscribe(() => {
        load()
      })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [client, listenFilter, query])

  return docs
}

function getPreviewOrigin() {
  if (typeof window === 'undefined') return 'http://localhost:3000'
  return window.location.origin
}

function previewUrlForSection(sectionId: string) {
  const hash = SECTION_PREVIEW_HASH[sectionId]
  return hash ? `${getPreviewOrigin()}${hash}` : `${getPreviewOrigin()}/`
}

type NavButtonProps = {
  title: string
  subtitle?: string
  pressed: boolean
  icon?: typeof FolderIcon
  indent?: boolean
  onClick: () => void
}

function NavButton({title, subtitle, pressed, icon: Icon = DocumentIcon, indent, onClick}: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        border: 'none',
        borderRadius: 8,
        background: pressed ? 'rgba(90, 58, 74, 0.12)' : 'transparent',
        color: '#1a1410',
        cursor: 'pointer',
        padding: indent ? '8px 10px 8px 22px' : '8px 10px',
        textAlign: 'left',
      }}
    >
      <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{color: '#7a6f64', display: 'inline-flex'}}>
          <Icon />
        </span>
        <span style={{flex: 1, minWidth: 0}}>
          <span
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: pressed ? 600 : 500,
              lineHeight: 1.3,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span style={{display: 'block', fontSize: 11, color: '#7a6f64', marginTop: 2}}>
              {subtitle}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  )
}

type HubProps = {
  title: string
  introSectionId: string
  introTitle: string
  listTitle: string
  docType: 'collaborator' | 'faq'
  docs: ListedDoc[]
  activeType?: string
  activeId?: string
  activeSection: string | null
  expanded: boolean
  onToggle: () => void
  onOpenHomeSection: (sectionId: string) => void
  onOpenDocument: (id: string, type: string) => void
}

function NavHub({
  title,
  introSectionId,
  introTitle,
  listTitle,
  docType,
  docs,
  activeType,
  activeId,
  activeSection,
  expanded,
  onToggle,
  onOpenHomeSection,
  onOpenDocument,
}: HubProps) {
  const introPressed =
    activeType === 'homePage' &&
    activeId === HOME_PAGE_ID &&
    activeSection === introSectionId

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 8,
          background: 'transparent',
          color: '#1a1410',
          cursor: 'pointer',
          padding: '8px 10px',
          textAlign: 'left',
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{color: '#7a6f64', display: 'inline-flex'}}>
            <FolderIcon />
          </span>
          <span style={{flex: 1, fontSize: 13, fontWeight: 500}}>{title}</span>
          <span
            style={{
              color: '#7a6f64',
              display: 'inline-flex',
              transform: `rotate(${expanded ? 90 : 0}deg)`,
              transition: 'transform 120ms ease',
            }}
          >
            <ChevronRightIcon />
          </span>
        </span>
      </button>
      {expanded ? (
        <div style={{paddingLeft: 4}}>
          <NavButton
            icon={DocumentIcon}
            indent
            onClick={() => onOpenHomeSection(introSectionId)}
            pressed={introPressed}
            title={introTitle}
          />
          {docs.length > 0 ? (
            <div
              style={{
                padding: '8px 10px 4px 22px',
                fontSize: 11,
                fontWeight: 600,
                color: '#7a6f64',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {listTitle}
            </div>
          ) : null}
          {docs.map((doc) => (
            <NavButton
              key={doc._id}
              icon={DocumentIcon}
              indent
              onClick={() => onOpenDocument(doc._id, docType)}
              pressed={activeId === doc._id}
              subtitle={doc.subtitle}
              title={doc.title}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function PresentationNavigator() {
  const navigate = usePresentationNavigate()
  const params = usePresentationParams()
  const [expandedHub, setExpandedHub] = useState<'collaborateurs' | 'faq' | null>(null)
  const faqs = useDocList(FAQS_QUERY, '*[_type == "faq"]')
  const collaborators = useDocList(COLLABORATORS_QUERY, '*[_type == "collaborator"]')

  const activeSection = useSyncExternalStore(
    subscribePresentationSection,
    getPresentationSection,
    () => null,
  )

  const activeId = params.id
  const activeType = params.type

  const openHomeSection = (sectionId: string) => {
    setPresentationSection(sectionId)
    navigate(previewUrlForSection(sectionId), {id: HOME_PAGE_ID, type: 'homePage'})
  }

  const openSiteSettings = () => {
    setPresentationSection(null)
    navigate(undefined, {id: SITE_SETTINGS_ID, type: 'siteSettings'})
  }

  const openDocument = (id: string, type: string, sectionId?: string) => {
    if (sectionId) setPresentationSection(sectionId)
    else setPresentationSection(null)
    const preview = sectionId ? previewUrlForSection(sectionId) : undefined
    navigate(preview, {id, type})
  }

  const isHomeSectionPressed = (sectionId: string) =>
    activeType === 'homePage' &&
    activeId === HOME_PAGE_ID &&
    activeSection === sectionId

  useEffect(() => {
    if (activeType === 'homePage' && activeId === HOME_PAGE_ID && activeSection === null) {
      setPresentationSection('all')
    }
  }, [activeType, activeId, activeSection])

  return (
    <div
      style={{
        height: '100%',
        overflow: 'auto',
        background: '#e9e0d2',
        borderRight: '1px solid rgba(26, 20, 16, 0.08)',
      }}
    >
      <div style={{padding: 12}}>
        <div
          style={{
            padding: '4px 8px 10px',
            fontSize: 11,
            fontWeight: 600,
            color: '#7a6f64',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Page d&apos;accueil
        </div>

        <div style={{display: 'grid', gap: 2}}>
          <NavButton
            icon={FolderIcon}
            onClick={openSiteSettings}
            pressed={activeType === 'siteSettings'}
            title="Paramètres du site"
          />

          {HOME_PAGE_SECTION_SHORTCUTS.map(({title, sectionId}) => (
            <NavButton
              key={sectionId}
              icon={FolderIcon}
              onClick={() => openHomeSection(sectionId)}
              pressed={isHomeSectionPressed(sectionId)}
              title={title}
            />
          ))}

          <NavHub
            activeId={activeId}
            activeSection={activeSection}
            activeType={activeType}
            docType="collaborator"
            docs={collaborators}
            expanded={expandedHub === 'collaborateurs'}
            introSectionId="collaborateurs"
            introTitle="Titre et introduction"
            listTitle="Liste des collaborateurs"
            onOpenDocument={(id, type) => openDocument(id, type, 'collaborateurs')}
            onOpenHomeSection={openHomeSection}
            onToggle={() =>
              setExpandedHub((current) => (current === 'collaborateurs' ? null : 'collaborateurs'))
            }
            title="Collaborateurs"
          />

          <NavHub
            activeId={activeId}
            activeSection={activeSection}
            activeType={activeType}
            docType="faq"
            docs={faqs}
            expanded={expandedHub === 'faq'}
            introSectionId="faq"
            introTitle="Titre et introduction"
            listTitle="Liste des questions"
            onOpenDocument={(id, type) => openDocument(id, type, 'faq')}
            onOpenHomeSection={openHomeSection}
            onToggle={() => setExpandedHub((current) => (current === 'faq' ? null : 'faq'))}
            title="Questions fréquentes"
          />
        </div>
      </div>
    </div>
  )
}
