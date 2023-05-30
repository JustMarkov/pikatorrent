import React, { useContext } from 'react'
import {
  ArrowBigUp,
  ChevronDown,
  ChevronUp,
  PauseCircle,
  PlayCircle,
} from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Button,
  Card,
  H4,
  Paragraph,
  Progress,
  XStack,
  YStack,
  useMedia,
} from 'tamagui'
import { RemoveTorrentDialog } from '../dialogs/RemoveTorrentDialog'
import { FilesListDialog } from '../dialogs/FilesListDialog'
import { TorrentFieldFormatter } from './TorrentFieldFormatter'
import { SettingsContext } from '../contexts/settings'
import i18n from '../i18n'

const COLLAPSE_ITEMS_DESKTOP = 7

// 0 - Torrent is stopped
// 1 - Torrent is queued to verify local data
// 2 - Torrent is verifying local data
// 3 - Torrent is queued to download
// 4 - Torrent is downloading
// 5 - Torrent is queued to seed
// 6 - Torrent is seeding
export const STATUSES = {
  0: 'Stopped',
  1: 'Queued',
  2: 'Verifying', // Torrent is verifying local data
  3: 'Queued',
  4: 'Downloading',
  5: 'Queued',
  6: 'Seeding',
}

export const TorrentCard = ({ torrent, handleResume, handlePause }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const media = useMedia()
  const { settings } = useContext(SettingsContext)
  const isCollapsible =
    !media.gtXs || settings.torrentCardFields.length > COLLAPSE_ITEMS_DESKTOP

  return (
    <Card key={torrent.id} size="$4" bordered br="$6" mb="$4">
      <Card.Header>
        <XStack mb="$2">
          <H4 f={1} numberOfLines={1} fontWeight="bold">
            {torrent.name}
          </H4>
          <FilesListDialog torrentId={torrent.id} />
        </XStack>
        <YStack>
          <Progress
            mt="$2"
            mb="$4"
            value={Math.round(torrent.percentDone * 100)}
            theme="yellow"
            bordered
          >
            <Progress.Indicator animation="lazy" bc={'$yellow9'} />
          </Progress>
          <TorrentInfo torrent={torrent} isCollapsed={isCollapsed} />
        </YStack>

        <XStack f={1} ai="center" jc="space-between" pt="$4">
          {STATUSES[torrent.status] === STATUSES[0] ? (
            <Button
              onPress={() => handleResume(torrent.id)}
              theme="green"
              icon={PlayCircle}
              br={50}
            >
              Start
            </Button>
          ) : (
            <Button
              onPress={() => handlePause(torrent.id)}
              theme="gray"
              icon={PauseCircle}
              br={50}
            >
              Pause
            </Button>
          )}
          {isCollapsible && (
            <Button
              circular
              icon={isCollapsed ? ChevronDown : ChevronUp}
              onPress={() => setIsCollapsed(!isCollapsed)}
            />
          )}
          <RemoveTorrentDialog id={torrent.id} />
        </XStack>
      </Card.Header>
    </Card>
  )
}

const TorrentInfo = ({ torrent, isCollapsed = true }) => {
  const { settings } = useContext(SettingsContext)
  const items = settings.torrentCardFields.map((field) => ({
    title: <Paragraph>{i18n.t(field)}</Paragraph>,
    content: <TorrentFieldFormatter name={field} value={torrent[field]} />,
  }))

  return (
    <XStack
      jc="space-between"
      w="100%"
      flexWrap="wrap"
      columnGap="$8"
      rowGap="$4"
    >
      <CollapsedItems
        isCollapsed={isCollapsed}
        items={items.map((i, index) => (
          <YStack key={index}>
            {i.title}
            {i.content}
          </YStack>
        ))}
      />
    </XStack>
  )
}

const CollapsedItems = ({ isCollapsed, items }) => {
  const media = useMedia()
  const displayedItems = media.gtXs ? COLLAPSE_ITEMS_DESKTOP : 3

  return isCollapsed ? items.slice(0, displayedItems) : items
}

export const TorrentCardPlaceHolder = () => {
  return (
    <Card
      size="$4"
      bordered
      br="$6"
      mb="$4"
      height={160}
      borderStyle="dashed"
      borderWidth="$1"
    >
      <Card.Header f={1} ai="center" jc="center">
        <ArrowBigUp size={'$4'} />
        <H4 numberOfLines={1} fontWeight="bold">
          Add your first torrent
        </H4>
        <Paragraph>Your torrents will be displayed here</Paragraph>
      </Card.Header>
    </Card>
  )
}