import { Extension } from "@tiptap/core";

export type ShowVisualEventProps = {
  type: "showVisual";
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    showvisual: {
      setVisualModal: () => ReturnType;
    };
  }

  interface EditorEvents {
    showVisual: ShowVisualEventProps;
  }
}

export const ShowVisual = Extension.create({
  name: "showVisual",
  addCommands() {
    return {
      setVisualModal:
        () =>
        ({ editor }) => {
          editor.emit("showVisual", {
            type: "showVisual",
          } as ShowVisualEventProps);
          return true;
        },
    };
  },
});
