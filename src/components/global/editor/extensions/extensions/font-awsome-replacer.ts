import { Node, nodeInputRule } from "@tiptap/core";

// Define the Font Awesome icon HTML string
const heartIcon = '<i class="fa-solid fa-person-pregnant"></i>';

const FontAwsomeReplacer = Node.create({
  name: "fontAwesomeReplacer",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      emoji: {
        default: null,
        parseHTML: element => element.children[0].getAttribute("alt"),
        renderHTML: attributes => {
          if (!attributes.emoji) {
            return {};
          }

          // You might need to adjust this rendering logic based on your implementation
          return {
            "data-fontawesome-icon": attributes.emoji, // This could be your Font Awesome icon name
            innerHTML: attributes.emoji // or the actual HTML for the icon
          };
        }
      }
    };
  },

  parseHTML() {
    return [{ tag: "span[data-fontawesome-icon]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { "data-fontawesome-icon": "" }, ["i", HTMLAttributes]];
  },

  renderText({ node }) {
    return node.attrs.emoji;
  },

  addCommands() {
    return {
      insertEmoji:
        emoji =>
        ({ tr, dispatch }) => {
          const node = this.type.create({ emoji });

          if (dispatch) {
            tr.replaceRangeWith(tr.selection.from, tr.selection.to, node);
          }

          return true;
        }
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        // This regex will match ":ff" at the end of a line or surrounded by whitespace
        find: /(^|\s):ff$/,
        type: this.type,
        getAttributes: () => ({
          emoji: heartIcon // Set the Font Awesome icon string here
        })
      })
    ];
  }
});

export { FontAwsomeReplacer };
