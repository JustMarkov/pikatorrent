import * as fs from 'node:fs'
import { onUpdateSettings } from '../index.js'
import * as crypto from 'node:crypto'
import * as path from 'node:path'
import envPaths from 'env-paths'

export type Settings = {
  nodeId: string
  acceptedPeers: Peer[]
  rejectedPeers: Peer[]
}

export type Peer = {
  id: string
  name: string
}

export let settings: Settings = {
  nodeId: crypto.randomUUID(),
  acceptedPeers: [],
  rejectedPeers: [],
}

// Get config path to pikatorrent
const configPath = envPaths('pikatorrent', { suffix: null }).config
if (!fs.existsSync(configPath)) {
  fs.mkdirSync(configPath, { recursive: true })
}

// transmission files is saved in 'pikatorrent/transmission'
export const transmissionConfigPath = path.join(configPath, 'transmission')

// pikatorrent/settings.json
export const settingsFilePath = path.join(configPath, 'settings.json')

export const loadSettings = () => {
  // load settings.json
  if (fs.existsSync(settingsFilePath)) {
    const settingsFileData = fs.readFileSync(settingsFilePath)
    if (settingsFileData) {
      const loadedSaveSettings = JSON.parse(settingsFileData.toString())
      return {
        ...settings,
        ...loadedSaveSettings,
        nodeId: loadedSaveSettings.nodeId || settings.nodeId,
      }
    }
  }
}

export const updateSettings = (settings, update = {}) => {
  const updatedSettings = { ...settings, ...update }
  if (onUpdateSettings) {
    onUpdateSettings(settings)
  }

  saveSettings()

  return updatedSettings
}
export const saveSettings = () => {
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings))
}

export const saveAcceptedPeer = (peerId, name) => {
  settings = updateSettings(settings, {
    acceptedPeers: [...settings.acceptedPeers, { id: peerId, name }],
  })
}

export const saveRejectedPeer = (peerId, name) => {
  settings = updateSettings(settings, {
    rejectedPeers: [...settings.rejectedPeers, { id: peerId, name }],
  })
}

export const saveTransmissionSettingsIfNeeded = (tr, request) => {
  if (request.method === 'session-set') {
    // session have been updated, so save settings
    tr.saveSettings()
  }
}

loadSettings()