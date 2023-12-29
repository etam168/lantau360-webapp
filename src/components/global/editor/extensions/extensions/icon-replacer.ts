import { Node } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iconReplacer: {
      replaceIcon: (iconName: string, iconStyle: string, href?: string) => ReturnType;
    };
  }
}

const IconReplacer = Node.create({
  name: "iconReplacer",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,
  addAttributes() {
    return {
      data: {
        default: ""
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "span[data-icon-replacer]",
        getAttrs: dom => {
          const aTag = (dom as HTMLElement).querySelector("a");
          if (aTag) {
            return {
              data: [
                aTag.getAttribute("class") || "",
                aTag.getAttribute("style") || "",
                aTag.getAttribute("href")
              ]
            };
          }

          return {};
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { data } = HTMLAttributes;

    const aTagAttributes: { class: string; href?: string; target?: string; style: string } = {
      //  class: `fa-solid ${data[0]}`
      class: data[0],
      style: data[1]
    };

    if (data[2] != null) {
      aTagAttributes.href = data[2];
      aTagAttributes.target = "_blank";
    }
    return ["span", { "data-icon-replacer": "" }, ["a", aTagAttributes]];
  },

  addCommands() {
    return {
      replaceIcon:
        (iconName: string, iconStyle: string, href?: string) =>
        ({ tr, dispatch }) => {
          const node = this.type.create({ data: [iconName, iconStyle, href] });
          if (dispatch) {
            tr.replaceRangeWith(tr.selection.from, tr.selection.to, node);
          }

          return true;
        }
    };
  }
});

export { IconReplacer };
