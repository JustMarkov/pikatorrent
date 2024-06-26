import React, { useState } from 'react'
import {
  ArrowBigDown,
  ArrowBigUp,
  FolderOpen,
  PauseCircle,
  PlayCircle,
  Share2,
} from '@tamagui/lucide-icons'
import {
  Button,
  Card,
  H4,
  H6,
  Paragraph,
  Progress,
  ScrollView,
  Stack,
  XStack,
  YStack,
  useMedia,
} from 'tamagui'
import isElectron from 'is-electron'
import { Platform, Share } from 'react-native'
import { useToastController } from '@tamagui/toast'
import { TORRENT_STATUSES } from '../../../constants/torrents'
import { useI18n } from '../../../hooks/use18n'
import { EditLabelsDialog } from '../../dialogs/EditLabelsDialog'
import { RemoveTorrentDialog } from '../../dialogs/RemoveTorrentDialog'
import { FilesListDialog } from '../../dialogs/FilesListDialog'
import { Dialog } from '../../reusable/Dialog'
import { TorrentFieldFormatter } from './TorrentFieldFormatter'
import { useTorrents } from '../../../hooks/useTorrents'
import { Label } from '../../reusable/Label'
import { APP_URL } from '../../../config'
import { PRIVATE_DOWNLOAD_DIR } from '../../../lib/transmission'

export const TorrentCard = ({ torrent, theme = 'yellow' }) => {
  const media = useMedia()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { start, pause } = useTorrents()

  const handleOpenFolder = () => {
    if (isElectron()) {
      window.electronAPI.openFolder(torrent.downloadDir, torrent.name)
    }
  }

  return (
    <>
      <TorrentActions
        torrent={torrent}
        handleOpenFolder={handleOpenFolder}
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
      />
      <Card
        transparent
        bordered
        key={torrent.id}
        p="$2"
        hoverStyle={{ cursor: 'pointer', backgroundColor: '$background' }}
        onPress={() => {
          setIsMenuOpen(true)
        }}
      >
        <XStack ai="center" gap="$2">
          <XStack>
            {TORRENT_STATUSES[torrent.status] === TORRENT_STATUSES[0] ? (
              <Button
                onPress={(e) => {
                  e.stopPropagation()
                  start(torrent.id)
                }}
                icon={PlayCircle}
                scaleIcon={2}
                circular
              />
            ) : (
              <Button
                onPress={(e) => {
                  e.stopPropagation()
                  pause(torrent.id)
                }}
                icon={PauseCircle}
                scaleIcon={2}
                circular
              />
            )}
          </XStack>

          <Stack f={1}>
            <XStack>
              <H6 numberOfLines={1}>{torrent.name}</H6>
            </XStack>
            <Progress
              mb="$2"
              value={Math.floor(torrent.percentDone * 100)}
              theme={theme}
              borderColor={`$${theme}7`}
              bordered
              size="$2"
            >
              <Progress.Indicator
                animation="lazy"
                backgroundColor={`$${theme}9`}
              />
            </Progress>
            <XStack jc="space-between">
              <TorrentInfo torrent={torrent} />
              <ScrollView
                ml="$2"
                horizontal
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}
              >
                <XStack gap={media.gtXs ? '$2' : '$1'}>
                  {torrent.labels.map((label, index) => (
                    <Label key={index} name={label}></Label>
                  ))}
                </XStack>
              </ScrollView>
            </XStack>
          </Stack>
        </XStack>
      </Card>
      {/* <Separator /> */}
    </>
  )
}

const TorrentActions = ({ torrent, handleOpenFolder, open, onOpenChange }) => {
  /* Bug: we can't access contexts inside nested dialogs, see https://github.com/tamagui/tamagui/issues/1481 */
  const torrentsFunctions = useTorrents()
  const toast = useToastController()
  const media = useMedia()
  const i18n = useI18n()

  if (!open) {
    return null
  }

  const isRemovableWithoutData =
    Platform.OS === 'web' ||
    !torrent.downloadDir.startsWith(PRIVATE_DOWNLOAD_DIR)

  return (
    <Dialog snapPointsMode="fit" open={open} onOpenChange={onOpenChange}>
      <YStack gap="$4" py="$4" pt={media.gtXs ? '$8' : '$4'}>
        <ShareButtons torrent={torrent} toast={toast} />
        {isElectron() && torrent.percentDone === 1 && (
          <Button icon={FolderOpen} onPress={handleOpenFolder}>
            {i18n.t('torrentDialog.openFolder')}
          </Button>
        )}
        {(isElectron() || Platform.OS !== 'web') && (
          <FilesListDialog torrent={torrent} toast={toast} />
        )}
        <EditLabelsDialog
          torrent={torrent}
          torrentsFunctions={torrentsFunctions}
        />
        <RemoveTorrentDialog
          id={torrent.id}
          name={torrent.name}
          torrentsFunctions={torrentsFunctions}
          isRemovableWithoutData={isRemovableWithoutData}
        />
      </YStack>
    </Dialog>
  )
}

const ShareButtons = ({ toast, torrent }) => {
  const i18n = useI18n()

  if (Platform.OS === 'web') {
    return (
      <Button
        icon={Share2}
        onPress={async () => {
          const shareLink = APP_URL + '/add#' + torrent.magnetLink
          try {
            navigator.clipboard.writeText(shareLink)
            toast.show(i18n.t('toasts.linkCopied'))
          } catch (e) {}
        }}
      >
        {i18n.t('torrentDialog.copyLink')}
      </Button>
    )
  }

  // Native
  return (
    <Button
      icon={Share2}
      onPress={async () => {
        const shareLink = APP_URL + '/add#' + torrent.magnetLink
        Share.share({
          url: shareLink,
          message: shareLink,
          title: torrent.name,
        })
      }}
    >
      {i18n.t('torrentDialog.share')}
    </Button>
  )
}

const TorrentInfo = ({ torrent }) => {
  return (
    <YStack>
      <XStack columnGap="$2">
        <TorrentFieldFormatter name="percentDone" value={torrent.percentDone} />
        <Paragraph>•</Paragraph>
        <TorrentFieldFormatter name="totalSize" value={torrent.totalSize} />
        <Paragraph>•</Paragraph>
        <Paragraph
          fontSize={'$2'}
        >{`${torrent.peersConnected} peers`}</Paragraph>
        {torrent.eta >= 0 && (
          <>
            <Paragraph>•</Paragraph>
            <TorrentFieldFormatter name="eta" value={torrent.eta} />
          </>
        )}
      </XStack>
      <XStack columnGap="$2">
        <TorrentFieldFormatter name="status" value={torrent.status} />
        <Paragraph>•</Paragraph>
        <XStack gap="$2">
          <TorrentFieldFormatter
            name="rateDownload"
            value={torrent.rateDownload}
          />
          <TorrentFieldFormatter name="rateUpload" value={torrent.rateUpload} />
        </XStack>
      </XStack>
      {torrent.errorString.length > 0 && (
        <TorrentFieldFormatter
          name="errorString"
          value={torrent.errorString}
          f={1}
          flexShrink={1}
        />
      )}
    </YStack>
  )
}

export const TorrentCardPlaceHolder = () => {
  const i18n = useI18n()
  const media = useMedia()

  return (
    <Card w="100%" bordered height={160} borderStyle="dashed" borderWidth="$1">
      <Card.Header w="100%">
        <YStack ai="center" jc="center">
          {media.gtXs ? (
            <ArrowBigUp size={'$4'} />
          ) : (
            <ArrowBigDown size={'$4'} />
          )}
          <H4 numberOfLines={1} fontWeight="bold">
            {i18n.t('torrents.addYourFirstTorrentTitle')}
          </H4>
          <Paragraph>
            {i18n.t('torrents.addYourFirstTorrentDescription')}
          </Paragraph>
        </YStack>
      </Card.Header>
    </Card>
  )
}
