"use client"

import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import CharacterCount from "@tiptap/extension-character-count"
import Dropcursor from "@tiptap/extension-dropcursor"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    ImageIcon,
    Table as TableIcon,
    PlusSquare,
    Trash2,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { toast } from "sonner"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt("URL zdjęcia:")
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL linku:", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }

    return (
        <div className="border border-input bg-gray-50/50 rounded-t-md p-1 flex flex-wrap gap-1">
            <div className="flex gap-0.5 mr-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("underline")}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("strike")}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
            </div>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <div className="flex gap-0.5">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>
            </div>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <div className="flex gap-0.5">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
            </div>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <div className="flex gap-0.5">
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "left" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "center" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "right" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>
            </div>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <div className="flex gap-0.5">
                <Button variant="ghost" size="sm" onClick={setLink} className="px-2 h-8" type="button">
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={addImage} className="px-2 h-8" type="button">
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <div className="flex gap-0.5">
                <Button variant="ghost" size="sm" onClick={insertTable} className="px-2 h-8" type="button" title="Wstaw tabelę">
                    <TableIcon className="h-4 w-4" />
                </Button>
                {editor.isActive("table") && (
                    <>
                        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2 h-8" type="button" title="Dodaj kolumnę">
                            <PlusSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteTable().run()} className="px-2 h-8 text-red-500" type="button" title="Usuń tabelę">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline hover:text-blue-800",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto my-4",
                },
            }),
            Table.configure({
                resizable: true,
                allowTableNodeSelection: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            CharacterCount,
            Dropcursor.configure({
                color: "#3b82f6",
                width: 2,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0]
                    if (file.type.startsWith("image/")) {
                        const promise = (async () => {
                            try {
                                const optimizedFile = await optimizeImage(file, 1600, 0.8)
                                const fData = new FormData()
                                fData.append("file", optimizedFile)

                                const response = await fetch("/api/upload", {
                                    method: "POST",
                                    body: fData,
                                })

                                if (!response.ok) throw new Error("Upload failed")
                                const data = await response.json()
                                view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({
                                    src: data.url
                                })))
                                toast.success("Zdjęcie wgrane pomyślnie")
                            } catch (err) {
                                toast.error("Błąd podczas wgrywania")
                            }
                        })()
                        return true
                    }
                }
                return false
            },
            attributes: {
                class: "tiptap prose prose-neutral max-w-none w-full border border-t-0 rounded-b-md p-4 min-h-[400px] focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-0 bg-white shadow-inner",
            },
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className="w-full flex flex-col border rounded-md shadow-sm overflow-hidden border-gray-200">
            <MenuBar editor={editor} />
            <div className="relative">
                <EditorContent editor={editor} />
                {editor && (
                    <div className="absolute bottom-2 right-2 flex gap-4 text-[10px] uppercase font-bold text-gray-400 bg-white/80 px-2 py-1 rounded-md border backdrop-blur-sm">
                        <span>{editor.storage.characterCount.words()} słów</span>
                        <span>{editor.storage.characterCount.characters()} znaków</span>
                    </div>
                )}
            </div>
        </div>
    )
}
