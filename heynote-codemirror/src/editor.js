import { Annotation, EditorState, Compartment } from "@codemirror/state"
import { EditorView, keymap, drawSelection } from "@codemirror/view"
import { indentUnit, forceParsing } from "@codemirror/language"

import { indentWithTab, insertTab, indentLess, indentMore } from "@codemirror/commands"
import { nord } from "./theme/nord.mjs"
import { customSetup } from "./setup.js"
import { heynoteLang } from "./lang-heynote/heynote.js"
import { noteBlockExtension } from "./block/note-block.js"
import { insertNewNote } from "./block/commands.js";


export class HeynoteEditor {
    constructor({element, content, focus=true}) {
        this.state = EditorState.create({
            doc: content || "",
            extensions: [
                /*keymap.of([
                    {
                        key: "Shift-Tab",
                        preventDefault: true,
                        run: () => {
                            console.log("debug:", syntaxTree(editor.state).toString())
                        },
                    },
                ]),*/
                //minimalSetup,
                
                keymap.of([
                    {
                        key: "Tab",
                        preventDefault: true,
                        //run: insertTab,
                        run: indentMore,
                    },
                    {
                        key: 'Shift-Tab',
                        preventDefault: true,
                        run: indentLess,
                    },
                    {
                        key: "Mod-Enter",
                        preventDefault: true,
                        run: insertNewNote,
                    },
                ]),

                customSetup, 
                nord,
                indentUnit.of("    "),
                EditorView.scrollMargins.of(f => {
                    return {top: 80, bottom: 80}
                }),
                heynoteLang(),
                noteBlockExtension(),
                
                // set cursor blink rate to 1 second
                drawSelection({cursorBlinkRate:1000}),
            ],
        })

        this.view = new EditorView({
            state: this.state,
            parent: element,
        })

        if (focus) {
            this.view.dispatch({
                selection: {anchor: this.view.state.doc.length, head: this.view.state.doc.length},
                scrollIntoView: true,
            })
            this.view.focus()
        }
    }
}



/*// set initial data
editor.update([
    editor.state.update({
        changes:{
            from: 0,
            to: editor.state.doc.length,
            insert: initialData,
        },
        annotations: heynoteEvent.of(INITIAL_DATA),
    })
])*/


/*
// render syntax tree
setTimeout(() => {
    function render(tree) {
        let lists = ''
        tree.iterate({
            enter(type) {
                lists += `<ul><li>${type.name} (${type.from},${type.to})`
            },
            leave() {
                lists += '</ul>'
            }
        })
        return lists
    }
    let html = render(syntaxTree(editor.state))
    document.getElementById("syntaxTree").innerHTML = html;
}, 1000)
*/