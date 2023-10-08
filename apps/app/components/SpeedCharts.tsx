import React, { useEffect, useState } from 'react'
import {
  VictoryArea,
  VictoryChart,
  VictoryTooltip,
  VictoryAxis,
} from '../lib/victory'
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import prettyBytes from 'pretty-bytes'
import { XStack, YStack, useMedia, useThemeName } from 'tamagui'
import { Platform } from 'react-native'
import { useSessionStats } from '../hooks/useSessionStats'
import { TorrentFieldFormatter } from './TorrentFieldFormatter'

const measuredPoints = 60 // We keep 60 seconds of data
const refreshInterval = 1000
const numberOfPoints = measuredPoints / (refreshInterval / 1000) + 1 // + 1 for zero

export const SpeedCharts = () => {
  const media = useMedia()
  const { sessionStats } = useSessionStats({ interval: refreshInterval })
  const [downloadSpeedPoints, setDownloadSpeedPoints] = useState(
    Array(numberOfPoints)
      .fill({})
      .map((v, i) => ({ x: i, y: 0 }))
  )
  const [uploadSpeedPoints, setUploadSpeedPoints] = useState(
    Array(numberOfPoints)
      .fill({})
      .map((v, i) => ({ x: i, y: 0 }))
  )

  useEffect(() => {
    const addNewPoints = (key, points) => {
      const newPoints = [...points]

      newPoints.shift()

      return [
        ...newPoints.map((p) => ({ ...p, x: p.x - 1 })),
        { x: newPoints.length, y: sessionStats[key] || 0 },
      ]
    }

    setDownloadSpeedPoints((points: any[]) => {
      return addNewPoints('downloadSpeed', points)
    })

    setUploadSpeedPoints((points: any[]) => {
      return addNewPoints('uploadSpeed', points)
    })
  }, [sessionStats])

  const Container = media.gtXs ? XStack : YStack

  return (
    <Container my="$8">
      <YStack ai="center" f={1}>
        <SpeedChart
          name="downloadSpeed"
          data={downloadSpeedPoints}
          color={'#0081f1'}
        />
        <TorrentFieldFormatter
          fontSize={'$6'}
          iconSize="$2"
          name="rateDownload"
          value={sessionStats.downloadSpeed || 0}
        />
      </YStack>
      <YStack ai="center" f={1}>
        <SpeedChart
          name="uploadSpeed"
          data={uploadSpeedPoints}
          color={'#299764'}
        />
        <TorrentFieldFormatter
          fontSize={'$6'}
          iconSize="$2"
          // fontWeight="bold"
          name="rateUpload"
          value={sessionStats.uploadSpeed || 0}
        />
      </YStack>
    </Container>
  )
}

const SpeedChart = ({ name, data, color }) => {
  const theme = useThemeName()

  return (
    <VictoryChart
      domain={{
        x: [0, data.length - 1],
        y: [0, Math.max(...data.map((v) => v.y)) || 1_000_000],
      }}
      padding={{ top: 40, bottom: 80, left: 80, right: 40 }}
    >
      <Defs>
        <LinearGradient id={`${name}-gradient`}>
          <Stop
            offset="0%"
            stopColor={theme.startsWith('light') ? 'white' : 'black'}
          />
          <Stop offset="100%" stopColor={color} />
        </LinearGradient>
      </Defs>
      <VictoryAxis
        label="Time (s)"
        crossAxis={false}
        tickFormat={(t) =>
          `${Math.abs(measuredPoints - (t * refreshInterval) / 1000)}`
        }
        style={{
          axisLabel: {
            fontFamily: 'Inter',
            fill: theme.startsWith('light') ? '#171717' : 'white',
          },
          tickLabels: {
            fontFamily: 'Inter',
            fill: theme.startsWith('light') ? '#171717' : 'white',
          },
        }}
      />
      <VictoryAxis
        dependentAxis
        crossAxis={false}
        tickFormat={(t) => `${prettyBytes(t)}/s`}
        style={{
          axis: { stroke: 'none' },
          tickLabels: {
            fontFamily: 'Inter',
            fill: theme.startsWith('light') ? '#171717' : 'white',
          },
          grid: { stroke: theme.startsWith('light') ? '#171717' : 'white' },
        }}
      />
      <VictoryArea
        data={data}
        labels={({ datum }) => `${prettyBytes(datum.y)}/s`}
        style={{
          data: {
            fill: `url(#${name}-gradient)`,
            fillOpacity: 0.5,
            strokeWidth: 2,
            stroke: color,
          },
        }}
        interpolation={'monotoneX'}
        labelComponent={
          <VictoryTooltip
            constrainToVisibleArea
            renderInPortal={Platform.OS === 'web'}
            style={{ fontSize: 18, fill: 'white' }}
            flyoutStyle={{
              stroke: color,
              fill: color,
              fontFamily: 'Inter',
            }}
          />
        }
      />
    </VictoryChart>
  )
}