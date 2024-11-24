import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export type YoutubeSearchEventProps = {
  type: 'youtubeSearch'
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeSearch: {
      setYoutubeSearchModal: () => ReturnType
    }
  }

  interface EditorEvents {
    youtubeSearch: YoutubeSearchEventProps
  }
}

export const YoutubeSearch = Extension.create({
  name: 'youtubeSearch',

  addCommands() {
    return {
      setYoutubeSearchModal: () => ({ editor }) => {
        editor.emit('youtubeSearch', { type: 'youtubeSearch' } as YoutubeSearchEventProps)
          return true
        },
    }
  },
}) 