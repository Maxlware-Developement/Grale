// =================================================================================================================
//
// Under testting, this file is not fully optimized for production and may contain some temporary code or comments.
//
// =================================================================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    const validChannels = [
      'navigate',
      'new-tab',
      'switch-tab',
      'close-tab',
      'close-app',
      'minimize-app',
      'maximize-app',
      'toggle-bookmark',
      'open-history',
      'open-menu',
      'get-initial-state',
      'open-source-view'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  receive: (channel, func) => {
    const validChannels = [
      'tabs-updated',
      'site-verified',
      'site-unverified',
      'url-changed',
      'title-changed',
      'initial-state'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});