import Head from 'next/head'
import {
  Button,
  Card,
  Paragraph,
  Separator,
  Switch,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { Download, Moon, Sun } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { useEffect, useState } from 'react'

import { Screenshots } from '../components/Screenshots'
import { Header } from '@/components/Header'
import Link from 'next/link'

export default function Home() {
  const [isDarkThemeSwitchChecked, setIsDarkThemeSwitchChecked] =
    useState(false)
  const { set: setTheme, resolvedTheme: currentTheme } = useThemeSetting()

  useEffect(() => {
    setIsDarkThemeSwitchChecked(currentTheme === 'dark')
  }, [currentTheme])

  return (
    <>
      <Head>
        <title>PikaTorrent</title>
        <meta name="description" content="PikaTorrent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <XStack>
          <XStack ai="center" space="$4" marginLeft="auto" pt={'$4'} pr={'$4'}>
            {isDarkThemeSwitchChecked ? <Moon /> : <Sun />}
            <Separator minHeight={20} vertical />
            <Switch
              id="dark-theme-switch"
              checked={isDarkThemeSwitchChecked}
              onCheckedChange={() =>
                setTheme(currentTheme === 'light' ? 'dark' : 'light')
              }
            >
              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>
        </XStack>

        <YStack ai="center" space px="$8" pb="$16">
          <YStack gap="$8" ai="center">
            <Header theme={currentTheme} />

            <YStack ai="center" gap="$4">
              <Paragraph fontWeight={'bold'}>
                Try the alpha version now :
              </Paragraph>
              <XStack space>
                <Link
                  href={
                    'https://github.com/G-Ray/pikatorrent/releases/download/v0.1.4/pikatorrent-win32-x64-0.1.4.zip'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    theme="yellow"
                    borderColor={'$yellow9'}
                    icon={Download}
                    size="$5"
                    br={50}
                  >
                    Windows (.zip)
                  </Button>
                </Link>
                <Link
                  href={
                    'https://github.com/G-Ray/pikatorrent/releases/download/v0.1.4/pikatorrent-linux-x64-0.1.4.zip'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    theme="yellow"
                    borderColor={'$yellow9'}
                    icon={Download}
                    size="$5"
                    br={50}
                  >
                    Linux (.zip)
                  </Button>
                </Link>
              </XStack>
            </YStack>
          </YStack>

          <Screenshots theme={currentTheme} />

          <YStack ai="center" space>
            <Paragraph>Prefer to manage your torrents on a server ?</Paragraph>
            <Theme inverse>
              <Card bordered px="$4" py="$2" elevate size="$4">
                <pre>
                  npm install -g pikatorrent <br />
                  pikatorrent node
                </pre>
              </Card>
            </Theme>
            <Paragraph>Then follow the instructions.</Paragraph>
          </YStack>
        </YStack>
      </main>
    </>
  )
}
