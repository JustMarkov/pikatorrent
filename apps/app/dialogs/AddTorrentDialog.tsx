import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import {
  Button,
  Fieldset,
  Input,
  Paragraph,
  Separator,
  XStack,
  YStack,
} from 'tamagui'
import { NodeContext } from '../contexts/NodeContext'
import { Platform } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { Dialog } from './Dialog'
import { Link, useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import { useURL } from 'expo-linking'
import isElectron from 'is-electron'
import { Download, ExternalLink } from '@tamagui/lucide-icons'

function readFileToBase64(document: DocumentPicker.DocumentResult) {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const reader = new FileReader()
      reader.readAsDataURL(document.file)
      reader.onload = () =>
        resolve(
          reader.result?.slice('data:application/x-bittorrent;base64,'.length)
        )
      reader.onerror = reject
    } else {
      FileSystem.readAsStringAsync(document.uri, { encoding: 'base64' })
        .then(resolve)
        .catch(reject)
    }
  })
}

export const AddTorrentDialog = () => {
  const [magnet, setMagnet] = useState<string>('')
  const [torrentFilePath, setTorrentFilePath] = useState<string | null>(null)
  const [documentResult, setDocumentResult] =
    useState<DocumentPicker.DocumentResult | null>(null)
  const { sendRPCMessage } = useContext(NodeContext)
  const localSearchParams = useLocalSearchParams()
  const router = useRouter()
  const url = useURL()
  const node = useContext(NodeContext)

  useEffect(() => {
    if (!url) return

    // Web links, hash are supported
    if (url.includes('#')) {
      const afterHash = url.split('#')[1]
      if (
        afterHash &&
        (/^magnet:/.test(afterHash) || /^https:/.test(afterHash))
      ) {
        setMagnet(decodeURIComponent(afterHash))
        setTorrentFilePath(null)
      }
    }
  }, [url])

  useEffect(() => {
    if (Platform.OS === 'web' && !isElectron()) {
      return
    }

    // Handle magnet links on Android & electron
    // hash in routes are not supported yet
    if (
      localSearchParams.magnet &&
      typeof localSearchParams.magnet === 'string'
    ) {
      setMagnet(decodeURIComponent(localSearchParams.magnet))
      setTorrentFilePath(null)
      setDocumentResult(null)
    } else if (
      localSearchParams.file &&
      typeof localSearchParams.file === 'string'
    ) {
      setTorrentFilePath(localSearchParams.file)
      setMagnet('')
      setDocumentResult(null)
    }
  }, [localSearchParams])

  const handleAddTorrent = async () => {
    try {
      let torrentAddArgs

      if (documentResult) {
        // Document from file picker
        torrentAddArgs = {
          metainfo: await readFileToBase64(documentResult),
        }
      } else if (magnet) {
        // Magnet
        torrentAddArgs = {
          filename: magnet,
        }
      } else if (torrentFilePath) {
        const content = await window.electronAPI.readFileAsBase64(
          torrentFilePath
        )
        torrentAddArgs = {
          metainfo: content,
        }
      }

      await sendRPCMessage({
        method: 'torrent-add',
        arguments: torrentAddArgs,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleSelectTorrentFile = async () => {
    // FIXME: handle rejection
    const documentResult = await DocumentPicker.getDocumentAsync({
      type: ['application/x-bittorrent', '.torrent'],
    })

    if (documentResult.canceled || documentResult.assets.length === 0) return

    setDocumentResult(documentResult.assets[0])
    setTorrentFilePath(null)
  }

  return (
    <Dialog
      onOpenChange={() => {
        router.push('/')
        // TODO: wait for animation duration to finish
      }}
      // snapPoints={[42]}
      defaultOpen
      title="Add a torrent"
    >
      <OpenInApp />
      {node.isConnected && Platform.OS === 'web' && !isElectron() && (
        <Separator />
      )}
      {node?.isConnected && (
        <YStack gap="$2">
          <Fieldset horizontal gap="$4">
            <Input
              f={1}
              id="torrent-uri"
              placeholder="torrent or magnet:// links"
              value={magnet}
              onChangeText={setMagnet}
            />
          </Fieldset>
          <Paragraph fontWeight="bold" mx="auto">
            Or
          </Paragraph>

          <Fieldset gap="$4">
            <Button
              theme="yellow"
              onPress={handleSelectTorrentFile}
              borderColor={'$yellow9'}
            >
              Select a .torrent file
            </Button>
            {documentResult && <Paragraph>{documentResult.name}</Paragraph>}
            {torrentFilePath && <Paragraph>{torrentFilePath}</Paragraph>}
          </Fieldset>

          <YStack ai="flex-end" mt={'$4'}>
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                theme="yellow"
                aria-label="Close"
                disabled={
                  magnet === '' &&
                  torrentFilePath === null &&
                  documentResult === null
                }
                o={
                  magnet === '' &&
                  torrentFilePath === null &&
                  documentResult === null
                    ? 0.5
                    : 1
                }
                borderColor={'$yellow9'}
                onPress={handleAddTorrent}
              >
                Add
              </Button>
            </Dialog.Close>
          </YStack>
        </YStack>
      )}
    </Dialog>
  )
}

const OpenInApp = () => {
  const pathname = usePathname()
  const handleOpenInApp = () => {
    window.location.replace(`pikatorrent:${pathname}${window.location.hash}`)
  }

  if (Platform.OS !== 'web' || isElectron()) {
    return null
  }

  return (
    <YStack>
      <Button
        onPress={handleOpenInApp}
        theme="yellow"
        mb="$4"
        icon={ExternalLink}
        borderColor={'$yellow9'}
      >
        Open in app
      </Button>
      <Separator />
      <Paragraph my="$4">{`Don't have the app yet ?`}</Paragraph>
      <XStack space>
        <Link
          href={
            'https://github.com/G-Ray/pikatorrent/releases/download/v0.4.1/pikatorrent-win32-x64-0.4.1.zip'
          }
          style={{ textDecoration: 'none' }}
        >
          <Button theme="yellow" icon={Download} borderColor={'$yellow9'}>
            Windows
          </Button>
        </Link>
        <Link
          href={
            'https://github.com/G-Ray/pikatorrent/releases/download/v0.4.1/pikatorrent-linux-x64-0.4.1.zip'
          }
          style={{ textDecoration: 'none' }}
        >
          <Button theme="yellow" icon={Download} borderColor={'$yellow9'}>
            Linux
          </Button>
        </Link>
      </XStack>
      <XStack jc="center">
        <Link href="https://play.google.com/store/apps/details?id=com.gray.pikatorrent">
          <img
            width={180}
            alt="Get it on Google Play"
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          />
        </Link>
      </XStack>
    </YStack>
  )
}
