import Youtube from '@tiptap/extension-youtube'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtube: {
      setYoutubeVideo: (options: { src: string, width?: number, height?: number }) => ReturnType
    }
  }
}

export const YoutubeExtension = Youtube.configure({
  inline: false,
  width: 640,
  height: 480,
  allowFullscreen: true,
  controls: true,
  nocookie: false,
  modestBranding: true,
  addCommands() {
    return {
      setYoutubeVideo: (options) => ({ commands }) => {
        return commands.setYoutubeVideo({
          ...options,
          src: options.src.startsWith('http') ? options.src : `https://www.youtube.com/watch?v=${options.src}`
        })
      }
    }
  }
}) 