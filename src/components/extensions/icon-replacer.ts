import { Node } from "@tiptap/core";

const TipTapIcon = Node.create({
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
    console.log(HTMLAttributes);
    const { data } = HTMLAttributes;

    const aTagAttributes: { class: string; href?: string; target?: string; style: string } = {
      class: data[0],
      style: data[1]
    };

    if (data[2] != null) {
      aTagAttributes.href = data[2];
      aTagAttributes.target = "_blank";
    }
    return ["span", { "data-icon-replacer": "" }, ["a", aTagAttributes]];
  }
});

export { TipTapIcon };
