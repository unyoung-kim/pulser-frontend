import Youtube from '@tiptap/extension-youtube';

export const YoutubeExtension = Youtube.configure({
  inline: false,
  width: 640,
  height: 480,
  allowFullscreen: true,
  controls: true,
  nocookie: false,
  modestBranding: true,
});
