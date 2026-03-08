"use client";
import "./TextEditor.scss"
import React, { useCallback, useMemo, useState, useEffect, useRef, Dispatch, SetStateAction, use } from 'react';
import { 
    createEditor, 
    BaseElement, 
    Descendant, 
    Transforms, 
    NodeEntry,
    BaseText, 
    Element, 
    Editor, 
    Text, 
    Node,
    Path,
    BaseEditor
} from 'slate';
import { Slate, Editable, withReact, useSlate, RenderElementProps, RenderLeafProps, ReactEditor, useSelected, useFocused  } from 'slate-react';
import { Range } from 'slate';
import { TableEditor } from "slate-table";
import { HistoryEditor, withHistory } from 'slate-history';
import { serialize, deserialize  } from '@/utils/slateHtmlConverter';
import { 
    RiBold, RiItalic, RiUnderline, 
    RiAlignLeft, RiAlignCenter, RiAlignRight,
    RiListUnordered, RiListOrdered2, 
    RiCodeSSlashFill, RiStrikethrough
} from "react-icons/ri";
import { LuLayoutTemplate, LuTable, LuAlignJustify, LuChevronDown } from "react-icons/lu";
import { PiTextIndentBold, PiTextOutdentBold } from "react-icons/pi";
import { IoRefresh, IoClose, IoTrashBinOutline, IoLink, IoGridOutline, IoImage } from "react-icons/io5";
import { MdOutlineChevronRight, MdHorizontalRule, MdLinkOff, MdFormatColorText } from "react-icons/md";

import Api from "@/services/Api";
import HTMLCodeModal from "./HTMLCodeModal";
import { filterClasses } from "@/utils/utils";
import CancelButton from "../Button/CancelBotton";
import CreateButton from "../Button/CreateButton";
import { TableElement, TableRowElement, TableCellElement } from "../Table/Table";
import Image from "./render.elements/Image";
import { url } from "inspector";

type MyElement = Element & { type: string, className?: string; };
const paddingOptions = [
    'p-0','p-px','p-0.5','p-1','p-1.5','p-2','p-2.5','p-3','p-3.5',
]
const paddingDefault = paddingOptions[5];

const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor) ?? {};
    // @ts-ignore
    return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Array.from(
        editor.children.filter((n): n is MyElement => Element.isElement(n) && n.type === format)
    );
    return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format);
    Transforms.setNodes(
        editor,
        { type: isActive ? 'paragraph' : format },
        { match: n => Element.isElement(n), split: true }
    );
    if (isActive) {
        Transforms.setNodes(editor, { type: 'paragraph' });
    }
    else if(format == 'grid-template') {
        const block = {
            type: 'grid',
            children: [
                {
                    type: 'grid-column', // สร้าง type ใหม่สำหรับ col
                    children: [{ type: 'paragraph', class: 'text-black', children: [{ text: 'Column 1' }] }],
                },
                {
                    type: 'grid-column',
                    children: [{ type: 'paragraph', class: 'text-black', children: [{ text: 'Column 2' }] }],
                }
            ],
        };
        Transforms.insertNodes(editor, block);
    }
    else {
        if (format === 'bulleted-list' || format === 'numbered-list') {
            const block = {
                type: format,
                children: [{
                    type: 'list-item',
                    class: 'text-black',
                    children: [{ text: '' }],
                }],
            };
            Transforms.insertNodes(editor, block);
        } else {
            Transforms.setNodes(editor, { type: format });
        }
    }
};

const toggleAlign = (
    editor: Editor,
    align: 'left' | 'center' | 'right' | 'justify'
) => {
    const newClass =
        align === 'justify'
        ? 'text-justify'
        : align === 'center'
        ? 'text-center'
        : align === 'right'
        ? 'text-right'
        : 'text-left';

    const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && Editor.isBlock(editor, n),
        mode: 'lowest',
    });

    if (match) {
        const [node, path] = match as [MyElement, Path];
        const raw = typeof node.className === 'string' ? node.className : '';
        const existing = filterClasses(raw); // remove undefined and null
        const cleaned = existing.filter(
        (c: string) =>
            !['text-left', 'text-center', 'text-right', 'text-justify'].includes(c)
        );
        // ใส่ class ใหม่ แล้วเคลียร์ซ้ำ
        const merged = Array.from(new Set([...cleaned, newClass])).join(' ');

        Transforms.setNodes<MyElement>(
            editor,
            { className: merged },
            { at: path }
        );
    }
};


const Button: React.FC<{ 
    format?: string;
    action?: 'mark' | 'block'| 'image' | 'text-indent' | 'text-outdent';
    align?: 'left' | 'center' | 'right' | 'justify';
    label: React.ReactNode;
    title?: string;
    setModal?: (value: boolean) => void;
    onClick?: () => void;
    onImageEdit?: (data: {
        url: string;
        alt?: string;
        path: any;
    }) => void;
}> = ({ 
    format, action, align, label, title,setModal, onClick, onImageEdit 
}) => {
    const editor = useSlate();

    const getSelectedImageEntry = () => {
        const { selection } = editor;
        if (!selection) return null;

        const [match] = Editor.nodes(editor, {
            match: (n) =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                n.type === "image",
        });

        return match ?? null; // [node, path]
    };
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (action === 'mark' && format) toggleMark(editor, format);
        else if (action === 'block' && format) toggleBlock(editor, format);
        else if (align) toggleAlign(editor, align);
        else if (format === 'text-indent') TextIndent(editor,'in');
        else if (format === 'text-outdent') TextIndent(editor,'out');
        // 👇 ส่วน image
        else if (action === 'image') {
            const entry = getSelectedImageEntry();
            if (entry) {
                const [node, path] = entry;
                typeof onImageEdit === 'function' && onImageEdit({
                    url: node.url,
                    alt: node.alt,
                    path
                });
            };
            typeof setModal === 'function' && setModal(true);
        }
    }
        
    return (
        <button type="button" onMouseDown={handleMouseDown} onClick={onClick} className="hover:bg-gray-200 text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md" title={title}>
            {label}
        </button>
    );
};

const DropdownButton: React.FC<{ action?: 'mark' | 'block'; label: React.ReactNode; title?:string }> = ({label, title}) => {

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const editor = useSlate();
    const handleSelectionChange = useCallback(async(select:number) => {
        const { selection } = editor;
        if (!selection) return;

        const colOptions = [
            {col:1, className:`col-span-12 ${paddingDefault}`},
            {col:2, className:`col-span-12 md:col-span-6 ${paddingDefault}`},
            {col:3, className:`col-span-12 md:col-span-4 ${paddingDefault}`},
            {col:4, className:`col-span-12 md:col-span-3 ${paddingDefault}`},
        ];
        const className = colOptions.find((v) => v.col == select);
        const entry = Editor.above(editor, {
            match: n => !Editor.isEditor(n) && typeof n === 'object' && n.type === 'grid-column'
        }) as NodeEntry;
        if (!entry) return;

        const [node , path] = entry;
        const innerText = node.children[0].children[0].text;
        // const parentEntry = Editor.parent(editor, path);
        // const [, parentPath] = parentEntry;
        const newChild = Array.from({ length: select }, () => ({
            type: 'grid-column',
            className: className?.className,
            children: [{
                type: 'paragraph',
                children: [{ text: innerText }],
            }],
        }));
        // ✅ เปลี่ยนเฉพาะ node นี้ ไม่ใช่ทั้ง parent
        Transforms.removeNodes(editor, { at: path });
        Transforms.insertNodes(editor, newChild, { at: path });
        setTimeout(()=>{ setOpen(false); },500);
    }, [editor]);

    const AddGridTemplate = () => {
        const block = {
            type: 'grid-column',
            className: 'col-span-12 p-2',
            children: [{ type: 'paragraph', children: [{ text: 'Column 1' }] }],
        };
        if (editor.selection) {
            const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "grid-column",
            });
            if (match) {
                const [, path] = match;
                const insertPath: Path = Path.next(path);
                Transforms.insertNodes(editor, block, { at: insertPath });
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) 
                setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="inline-flex rounded-md relative" ref={menuRef}>
            <button 
                type="button" 
                className="rounded-s-md p-2 hover:bg-gray-200 text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700" 
                title={title}
                onClick={()=>AddGridTemplate()}
            >{label}
            </button>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="rounded-e-md  px-[1px] hover:bg-gray-200 text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                title="More columns"
            ><LuChevronDown />
            </button>
            {open && (
                <div className={`absolute z-10 top-full right-0 w-48 bg-white border rounded shadow-lg ease-in-out duration-500`}>
                    <ul className="text-sm text-gray-700">
                        <li>
                            <button type="button"
                                onClick={()=>handleSelectionChange(1)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >1 Column</button>
                        </li>
                        <li>
                            <button type="button"
                                onClick={()=>handleSelectionChange(2)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >2 Column</button>
                        </li>
                        <li>
                            <button type="button"
                                onClick={()=>handleSelectionChange(3)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >3 Column</button>
                        </li>
                        <li>
                            <button type="button"
                                onClick={()=>handleSelectionChange(4)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            >4 Column</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}
const colorGroups = [
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
    "gray",
];

const shades = [
    100, 200, 300, 400, 500, 600, 700, 800, 900
];

const ColorDropdown = ({
    isOpen,
    setOpen
}:{
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const editor = useSlate();
    const filteredGroups = colorGroups.filter(
        (c) => !["slate", "zinc", "neutral", "stone"].includes(c)
    );
    const applyTextColor = (colorClass: string) => {
        if (!editor.selection || !Range.isExpanded(editor.selection)) return;

        const [blockEntry] = Editor.nodes(editor, {
            match: (n) => Editor.isBlock(editor, n),
        });
        if (!blockEntry) return;
        const [blockNode, blockPath] = blockEntry;
        const [start, end] = Range.edges(editor.selection);
        const isStartAtBlock = Editor.isStart(editor, start, blockPath);
        const isEndAtBlock = Editor.isEnd(editor, end, blockPath);
        // ✅ ถ้าเลือกทั้ง block → set class ที่ block
        if (isStartAtBlock && isEndAtBlock) {
            const currentClass = (blockNode as any).className || '';
            const filtered = currentClass
            .split(' ')
            .filter((c: string) => !c.startsWith('text-'))
            .join(' ');
            const newClass = `${filtered} ${colorClass}`.trim();

            Transforms.setNodes(editor, { className: newClass }, { at: blockPath });
            editor.normalize({ force: true });
            return;
        }
        const { selection } = editor;
        if (!selection || !Range.isExpanded(selection)) return;
        Transforms.setNodes(
            editor,
            { textColor: colorClass },
            { match: (n) => Text.isText(n), split: true }
        );
        setOpen(false);
    };
    return (
        <div className="relative">
            <Button title="Text color" label={<MdFormatColorText/>} onClick={()=>setOpen(true)}/>
            {isOpen &&<div className="absolute mt-2 bg-white rounded shadow-lg p-2 flex flex-wrap z-50 border" style={{ width: '380px' }}>
                {shades.map((shade) => (
                    <div key={shade} className="flex flex-wrap">
                        {filteredGroups.map((color) => (
                            <div
                                key={`${color}-${shade}`}
                                className={`w-5 h-5 ${`bg-${color}-${shade}`} border border-white cursor-pointer`}
                                title={`${color}-${shade}`}
                                onClick={()=>applyTextColor(`text-${color}-${shade}`)}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>}
        </div>
    )
}
export const insertTable = (editor: Editor, cols: number, rows: number) => {
    const table = {
        type: "table",
        children: Array.from({ length: rows }).map(() => ({
            type: "table-row",
            children: Array.from({ length: cols }).map(() => ({
                type: "table-cell",
                children: [{ text: "" }],
            })),
        })),
    };

    Transforms.insertNodes(editor, table);
};
const TableDropdown = ({
    isOpen,
    setOpen
}:{
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const editor = useSlate();
    const [hoverX, setHoverX] = useState(0);
    const [hoverY, setHoverY] = useState(0);
    const maxCols = 10;
    const maxRows = 10;

    const handleSelect = (cols: number, rows: number) => {
        if (!editor.selection || !Range.isCollapsed(editor.selection)) return;
        insertTable(editor, cols, rows)
        setOpen(false);
    };

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setOpen(!isOpen)}
                className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-gray-100"
                title="Insert Table"
            >
                <LuTable/>
            </button>
            {isOpen && (
                <div className="absolute mt-2 p-3 bg-white border rounded-lg shadow-lg z-50">
                    <div>
                        {/* ตาราง 10x10 */}
                        {Array.from({ length: maxRows }).map((_, row) => (
                        <div key={row} className="flex">
                            {Array.from({ length: maxCols }).map((_, col) => {
                            const selected = row < hoverY && col < hoverX;
                            return (
                                <div
                                key={col}
                                onMouseEnter={() => {
                                    setHoverX(col + 1);
                                    setHoverY(row + 1);
                                }}
                                onClick={() => handleSelect(col + 1, row + 1)}
                                className={`w-5 h-5 border border-gray-300 cursor-pointer transition ${
                                    selected ? "bg-blue-400" : "bg-gray-100 hover:bg-gray-200"
                                }`}
                                ></div>
                            );
                            })}
                        </div>
                        ))}
                    </div>

                    {/* แสดงขนาดที่เลือก */}
                    <div className="text-xs text-gray-600 mt-2 text-center">
                        {hoverX > 0 && hoverY > 0
                        ? `${hoverX} × ${hoverY}`
                        : "เลือกขนาดตาราง"}
                    </div>
                </div>
            )}
        </div>
    );
}

const Paragraph: React.FC = () => {
    const editor = useSlate();
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        toggleBlock(editor, value);
    };
    const currentType = getCurrentElementType(editor) ?? 'paragraph';
    return (
        <select 
            value={currentType}
            onChange={handleChange} 
            title="Paragraph Style"
            className="text-sm px-2 py-[6px] rounded-md bg-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
            <option hidden>Heading</option>
            <option value="paragraph">Paragraph</option>
            <option value="span">Span</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
            <option value="div">division</option>
        </select>
    );
};

const sizeOptions = ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px','30px','32px','48px', '64px'];
const FontSize: React.FC = () => {
    const editor = useSlate();
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = e.target.value;
        const [match] = Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && Element.isElement(n) && Editor.isBlock(editor, n),
            mode: 'lowest',
        });
        if (match) {
            const [node, path] = match as [MyElement, Path];
            const raw = typeof node.className === 'string' ? node.className : '';
            const existing = filterClasses(raw); // remove undefined and null
            const cleaned = existing.filter((c: string) => !sizeOptions.map((v) => `text-[${v}]`).includes(c)); // Remove old font size classes
            const merged = Array.from(new Set([...cleaned, `text-[${size}px]`])).join(' ');// ✅ add a new class name and remove duplicate class namne
            Transforms.setNodes<MyElement>(
                editor,
                { className: merged },
                {
                    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
                    mode: 'lowest'
                }
            )
        }
    };
    const currentSize = getFontSize(editor) ?? '16';
    return (
        <select 
            title="Font Size" 
            onChange={handleChange} 
            value={currentSize} 
            className="text-sm p-2 rounded-md bg-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
            {sizeOptions.map((v)=><option key={v} value={v.replace('px','')}>{v}</option>)}
        </select>
    );
};

const TextIndent = (editor:Editor, direction: 'in' | 'out') => {
    const indentOption = [
        'indent-0','indent-px','indent-0.5','indent-1','indent-1.5','indent-2','indent-2.5','indent-3','indent-3.5',
        'indent-4','indent-5','indent-6','indent-7','indent-8','indent-9','indent-10','indent-11','indent-12'
    ];
    const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && Editor.isBlock(editor, n),
        mode: 'lowest',
    });
    if (match) {
        const [node, path] = match as [MyElement, Path];
        const raw = typeof node.className === 'string' ? node.className : '';
        const existing = filterClasses(raw); // remove undefined and null
        const currentIndent = existing.find(c => indentOption.includes(c)) || 'indent-0';
        const currentIndex = indentOption.indexOf(currentIndent);
        let nextIndex = currentIndex;
        if (direction === 'in' && currentIndex < indentOption.length - 1) {
            nextIndex++;
        } else if (direction === 'out' && currentIndex > 0) {
            nextIndex--;
        }
        const cleaned = existing.filter(c => !indentOption.includes(c)); // remove old font size classes
        const merged = Array.from(new Set([...cleaned, indentOption[nextIndex]])).join(' '); // add a new class name and remove duplicate class namne
        Transforms.setNodes<MyElement>(
            editor,
            { className: merged },
            {
                match: n => Element.isElement(n) && Editor.isBlock(editor, n),
                mode: 'lowest'
            }
        )
    }
}


type galleryType = {
    url: string;
    id: string;
    type: string;
    selected: string;
}

const ImageModal = ({
    id,
    type,
    action,
    draftId,
    onClose,
    onInsert,
    defaultUrl,
    defaultAlt
}: {
    id?: number;
    type?: string;
    action?: string;
    draftId?: string;
    onClose: () => void;
    onInsert: (url: string, alt:string, path?: number[]) => void;
    defaultUrl: string | "";
    defaultAlt: string | "";

}) => {
    const [tab, setTab] = useState<"selection"|"upload"|"gallery">("selection");
    const [file, setFile] = useState<File[] | null>([]);
    const [preview, setPreview] = useState<string[] | null>([]);
    const [gallery,setGallery] = useState<galleryType[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selection, setSelection] = useState<{url: string; alt: string}>({url:defaultUrl||"",alt:defaultAlt||""});
    const [selected, setSelected] = useState<string[] | null>([]);
    const [message, setMessage] = useState<{status: string; message: string} | null>(null);
    const [thisId] = useState<number | null>(id || 0);
    const [thisType] = useState<string | null>(type || "");
    const thisDraftId = action === "create" ? draftId || "" : "";
    const didFetchGallery = useRef(false);
    const urlRef = useRef<HTMLInputElement>(null);
    const altRef = useRef<HTMLInputElement>(null);
    
    const getGallery = async () => {
        const path = thisDraftId ? `/gallery?type=${thisType}&draftId=${draftId}` : `/gallery?type=${thisType}&id=${thisId}`;
        const response = await Api.get(path);
        setGallery(response?.data.gallery);
    }
    useEffect(() => {
        return () => {
            preview?.forEach(url => URL.revokeObjectURL(url));
        };
    }, [preview]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile([]);
        setPreview([]);
        for (const f of e.target.files || []) {
            setFile(prev => [...(prev || []), f ]);
            setPreview(prev => [...(prev || []), URL.createObjectURL(f) ]);
        }
    };
    const handlerInsert = () => {
        if (tab === "selection" && selected) {
            onInsert(selection.url, selection.alt);
            onClose();
        }
    };
    const handlerUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("images[]", file); 
        });
        formData.append("_method", "PUT");
        formData.append("type", thisType ?? "");
        if (action === "edit" && thisId !== null) {
            formData.append("id", String(thisId));
        }
        formData.append("draftId", action === "create" ? draftId ?? "" :"");

        try {
            setUploading(true);
            const request = await Api.post("/gallery/upload", formData, { headers: { "Content-Type": "multipart/form-data" }});
            await getGallery();
            if(request.data.status === true){
                setMessage({'status':'success','message':"Upload successful."});
                setTimeout(() => {
                    setFile(null);
                    setPreview([]);
                    setTab('gallery');
                    setMessage(null);
                },3000);
            }else{
                setMessage({'status':'error','message':request.data.message || "Upload failed."});
            }
        } catch (err) {
            setMessage({'status':'error','message':"Upload failed."});
            console.error(err);
        } finally {
            setUploading(false);
        }
    }
    const handlerSelection = () => {
        if(selected && selected.length > 0){
            setTab("selection");
            setSelection({url: selected[0], alt: ""});
        }
    }
    const handlerSelectImage = (url: string) => {
        if(selected && selected.includes(url)){
            setSelected(selected.filter(u => u !== url));
        }else{
            setSelected(selected ? [...selected, url] : [url]);
        }
    }
    const deleteImage = async () => {
        if(!selected || selected.length === 0) return;
        if(!confirm("Are you sure to delete selected image?")) return;
        try {
            const request = await Api.post("/gallery/delete", { images: selected, _method: "DELETE"});
            if(request.data){
                await getGallery();
                setMessage({'status':'success','message':"Delete successful."});
                setSelected(null);
                setFile(null);
                setPreview([]);
                setTimeout(() => { setMessage(null) },1500);
            }
        } catch (err) {
            console.error(err);
        }
    }
    const handlerResetFile = () => {
        setFile(null);
        setPreview([]);
        setMessage(null)
    }
    useEffect(() => {
        if (!didFetchGallery.current) {
            didFetchGallery.current = true;
            getGallery();
        }
    },[]);

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-99">
        <div className="bg-white rounded-lg w-full lg:w-[1130px] h-full lg:h-[800px] shadow-lg flex flex-col">
            <div className="flex justify-between items-center border-b p-6">
                <h2 className="text-lg font-semibold">Insert Image</h2>
                <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="flex flex-col h-full p-6 pb-0">
                <div className="flex gap-4 justify-between border-b">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className={`pb-2 ${tab === "selection" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                            onClick={() => setTab("selection")}
                        >
                            Selection
                        </button>
                        <button
                            type="button"
                            className={`pb-2 ${tab === "gallery" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                            onClick={() => setTab("gallery")}
                        >
                            Gallery
                        </button>
                        <button
                            type="button"
                            className={`pb-2 ${tab === "upload" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                            onClick={() => setTab("upload")}
                        >
                            Upload
                        </button>
                    </div>
                    {tab === "gallery" &&
                    <div className="flex gap-2">
                        <button type="button" className="p-2 bg-transparent rounded-md hover:ring-2 hover:ring-gray-300/50" onClick={getGallery}><IoRefresh/></button>
                        <button type="button" className="p-2 bg-transparent rounded-md hover:ring-2 hover:ring-gray-300/50 disabled:text-gray-300 hover:bg-red-100 hover:text-red-500 hover:ring-red-50" disabled={selected && selected.length > 0 ?false :true} onClick={deleteImage}><IoTrashBinOutline/></button>
                    </div>
                    }
                </div>
                {tab === "selection" && <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="col-span-12 mt-4">
                            <label htmlFor="url">Image Selection</label>
                            <div className="flex">
                                <input id="url" type="text" name="url" className="w-full border rounded-md p-2" 
                                    ref={urlRef}
                                    value={selection.url}
                                    onChange={(e) => setSelection({...selection, url: e.target.value})}
                                />
                                <button type="button" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={()=> setTab('gallery')}>Select</button>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <label htmlFor="alt">ALT text for image selection.</label>
                            <input id="alt" type="text" className="w-full border rounded-md p-2" 
                                ref={altRef}
                                value={selection.alt}
                                onChange={(e) => setSelection({...selection, alt: e.target.value})}
                            />
                        </div>
                    </div>
                }
                {tab === "upload" && (
                    <div className="h-full mt-4">
                        { preview &&  preview.length === 0 && <input 
                            type="file" 
                            className="rounded-md w-full h-full file:h-full file:w-full
                                text-sm text-slate-500
                                file:py-2 file:px-4
                                file:rounded-none file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100"
                            accept="image/*" 
                            multiple 
                            onChange={handleFileChange}
                        />}
                        {message && <div className="my-4">
                            <div className={`${message.status=='success'?`bg-green-100 text-green-600 border-green-400`:`bg-red-100 text-red-500 border-red-400`} p-2 border rounded-lg flex items-center justify-between`}>
                                {message.message}
                                <button type="button" className={`bg-transparent ${message.status==='success'?`text-green-600`:`text-red-500 p-2`}`}><IoClose/></button>
                            </div>
                        </div>}
                        {preview && preview.length > 0 &&
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[77%] overflow-y-auto p-1">
                            {preview.map((img,k)=>(
                                <div key={k} className="border rounded-md overflow-hidden cursor-pointer h-32 w-37 flex justify-center items-center">
                                    <img src={img} alt="preview" className="object-cover h-full" />
                                </div>
                            ))}
                            </div>
                        }
                    </div>
                )}
                {tab === "gallery" && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[77%] overflow-y-auto p-1 mt-2">
                        {gallery && gallery.map((img,k) => 
                            <div
                                key={k}
                                className={`border rounded-md overflow-hidden cursor-pointer h-32 w-37 flex item-center justify-center ${selected && selected.includes(img.url) ? "ring-2 ring-blue-500" : ""}`}
                                onClick={()=>handlerSelectImage(img.url)}
                            >
                                <img src={img.url} alt="gallery image" className="object-cover h-full" />
                            </div>
                        )}
                    </div>
                </>
                )}
            </div>
            <div className="w-full flex justify-end gap-3 bottom-0 object-fit p-6 right-0">
                <button type="button" onClick={onClose} className={`px-3 py-1 rounded bg-gray-100 border-gray-200 text-gray-400 hover:text-gray-500 hover:bg-gray-200 hover:ring-2 hover:ring-gray-300/70`}>Cancel</button>
                <button
                    type="button"
                    onClick={handlerInsert}
                    className={`px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50 hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-600 ${tab === 'selection' ? '' : 'hidden'}`}
                    disabled={tab === "upload" ? !file : !selected}
                >Insert</button>
                <button 
                    type="button"
                    className={`px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50 hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-600 ${tab === 'gallery' ? '' : 'hidden'}`}
                    onClick={handlerSelection}
                >Select</button>
                <button 
                    type="button" 
                    className={`bg-red-100 hover:bg-red-200 hover:ring-2 hover:ring-red-300/70 disabled:bg-red-100 disabled:text-red-200 text-red-300 hover:text-red-500 px-3 py-1 rounded  ${tab !== 'upload' ? 'hidden' : ''}`}
                    onClick={handlerResetFile}
                >Reset</button>
                <button 
                    type="button" 
                    className={`bg-indigo-600 hover:ring-2 hover:ring-indigo-500/50 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white rounded px-3 py-1 ${tab !== 'upload' ? 'hidden' : ''}`} 
                    disabled={(file?.length ?? 0) === 0}
                    onClick={() => {
                        if (file && file.length > 0) {
                            const fakeEvent = {
                                target: {
                                    files: file
                                }
                            } as unknown as React.ChangeEvent<HTMLInputElement>;
                            handlerUpload(fakeEvent);
                        }
                    }}
                >{uploading ? "Uploading..." : "Upload"}</button>
            </div>
        </div>
    </div>
    );
}

const LinkModal = ({
    linkData,
    onClose,
    onInsert
}:{
    linkData?: {url: string; display: string; target: string};
    onClose: () => void;
    onInsert: (
        url: string,
        display:string,
        target:string
    ) => void;
}) => {
    const url = useRef<HTMLInputElement>(null);
    const display = useRef<HTMLInputElement>(null);
    const target = useRef<HTMLSelectElement>(null);
    useEffect(() => {
        if (linkData) {
            if (url.current) url.current.value = linkData.url;
            if (display.current) display.current.value = linkData.display;
            if (target.current) target.current.value = linkData.target;
        }
    }, [linkData]);
    const handlerInsert = () => {
        console.log("Inserting link with data:", {
            url: url.current?.value,
            display: display.current?.value,
            target: target.current?.value
        });
        onInsert(
            url.current?.value || '',
            display.current?.value || '',
            target.current?.value || '_blank'
        );
        onClose();
    };
    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-99">
        <div className="bg-white rounded-lg w-full lg:w-[800px] h-full lg:h-[600px] shadow-lg flex flex-col">
            <div className="flex justify-between items-center border-b p-6">
                <h2 className="text-lg font-semibold">Insert/Edit Link</h2>
                <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="flex flex-col h-full p-6 pb-0">
                <div className="h-full mt-5 space-y-3">
                    <div>
                        <label htmlFor="url">URL</label>
                        <input ref={url} type="text" name="url" id="url" className="dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="display">Text to display</label>
                        <input ref={display} type="text" name="display" id="display" className="dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="target">Open link in..</label>
                        <select ref={target} name="target" id="target" className="dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:outline-none">
                            <option value="_blank">New tab</option>
                            <option value="_self">Current tab</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-end gap-3 bottom-0 object-fit p-6 right-0">
                <CancelButton onClick={onClose}>Cancel</CancelButton>
                <CreateButton onClick={handlerInsert}>Save</CreateButton>
            </div>
        </div>
    </div>
    )
}

type CustomElement = BaseElement & { type: string; children: Array<unknown> };
type CustomText = BaseText & { fontSize?: string; textColor:string;};

declare module 'slate' {
    interface CustomTypes {
        Element: CustomElement;
        Text: CustomText;
    }
}
const getCurrentElementType = (editor: Editor): string | null => {
    const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && !!n.type,
        mode: 'lowest', // ตรวจสอบ block ต่ำสุดใน path
    });
    if (match) {
        const [node] = match;
        return (node as Element).type as string;
    }
    return null;
};
const getFontSize = (editor: Editor): string | null => {
    const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && !!n.className,
        mode: 'lowest', // ตรวจสอบ block ต่ำสุดใน path
    });
    if (match) {
        const [node] = match;
        const raw = typeof (node as MyElement).className === 'string' ? (node as MyElement).className : '';
        const classes = raw.split(/\s+/).map((c:string) => c.trim());
        const fontSizeClass = classes.find((c:string) => c.startsWith('text-[') && c.endsWith('px]'));
        if (fontSizeClass) {
            const size = fontSizeClass.slice(6, -3); // ดึงขนาดตัวเลขออกมา
            return size;
        }
    }
    return null;
}
interface EditorProps {
    type?: string;
    action?: string;
    id?: number;
    draftId?: string;
    name: string;
    value: string | null;
    onChange: (value: string) => void;
}

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

const withImages = (editor: CustomEditor): CustomEditor => {
    const { isVoid } = editor;

    editor.isVoid = (element) =>
        element.type === "image" ? true : isVoid(element);

    return editor;
};

const TextEditor: React.FC<EditorProps> = ({type, action, id, draftId, name, value, onChange}) => {

    const editor = useMemo(
        () => withImages(
            withHistory(
                withReact(
                    createEditor()
                )
            )
        ) as CustomEditor, []
    );
    const [editingImage, setEditingImage] = useState<{url: string;alt?: string; path: any;} | null>(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0});
    const [showModal, setShowModal] = useState<boolean>(false);
    const [linkModal, setLinkModal] = useState<boolean>(false);
    const [linkData, setLinkData] = useState<{url: string; display: string; target: string} | null>(null);
    const [isLink, setIsLink] = useState<boolean | false>(false);
    const [editorKey, setEditorKey] = useState(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [colorDropdown, setColorDropdown] = useState<boolean>(false);
    const [tableDropdown, setTableDropdown] = useState<boolean>(false);
    const defaultEditorValue: Descendant[] =
    [
        {
            type: 'grid',
            children: [{
                type: 'grid-column',
                children: [{ type: 'paragraph', children: [{ text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." }] }],
            }]
        }
    ];
    const [editorValue, setEditorValue] = useState<Descendant[]>(()=>defaultEditorValue);
    const handleOpen = () => setIsOpen(true);
    const columnsOptions = [
        'col-span-1','col-span-2','col-span-3','col-span-4','col-span-5','col-span-6',
        'col-span-7','col-span-8','col-span-9','col-span-10','col-span-11','col-span-12'
    ];

    const handleSaveHTML = (html: string) => {
        // 🟢 HTML → Slate JSON
        const slateNodes = deserialize(html);
        setEditorValue(slateNodes);
    };


    const renderElement = useCallback((props: RenderElementProps) => {
        const { attributes, children, element } = props;
        switch (element.type) {
            case 'paragraph': return <p {...attributes} className={element.className || 'text-black mb-b'}>{children}</p>;
            case 'span': return <span {...attributes} className={element.className || 'text-black mb-b'}>{children}</span>
            case 'h1': return <h1 {...attributes} className={element.className || 'text-black mb-b'}>{children}</h1>;
            case 'h2': return <h2 {...attributes} className={element.className || 'text-black mb-b'}>{children}</h2>;
            case 'h3': return <h3 {...attributes} className={element.className || 'text-black mb-b'}>{children}</h3>;
            case 'h4': return <h4 {...attributes} className={element.className || 'text-black mb-b'}>{children}</h4>;
            case 'h5': return <h5 {...attributes} className={element.className || 'text-black mb-b'}>{children}</h5>;
            case 'h6': return <h6 {...attributes} className={element.className || 'text-black mb-b'}>{children}</h6>;
            case 'bulleted-list':
                return <ul {...attributes} className={element.className ?? 'marker:text-gray-700 list-disc pl-5 space-y-1 text-gray-800 text-md'}>{children}</ul>;
            case 'numbered-list':
                return <ol {...attributes} className={element.className ?? 'marker:text-gray-700 list-decimal pl-5 space-y-1 text-gray-800 text-md'}>{children}</ol>;
            case 'list-item': return <li {...attributes}>{children}</li>;
            case 'link':
                return (
                    <a {...attributes} href={element.url} target={(element as any).target || '_blank'} className={`text-blue-500 no-underline`}>
                    {children}
                    </a>
                );
            case 'image':
                return <Image {...props} />;
            case 'bold': return <strong>{children}</strong>;
            case 'italic' : return <em>{children}</em>;
            case 'underline': return <u>{children}</u>;
            case 'hr': return <hr {...attributes}/>;
            case "table": return <TableElement {...props}/>;
            case "table-row": return <TableRowElement {...props}/>;
            case "table-cell": return <TableCellElement {...props}/>;
            case 'grid': return <div {...attributes} className={`${element.className?`${element.className}`:`grid grid-cols-12 gap-4 mb-4`}`}>{children}</div>;
            case 'grid-column': return <div {...attributes} className={`${element.className?`${element.className}`:`col-span-12 p-2`}`}>{children}</div>;
            default: return <div {...attributes} className={element.className}>{children}</div>;
        }
    }, []);
    type CustomLeaf = {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
        fontSize?: string;
        color?: string;
        textColor?:string;
        // [key: string]: string|number|boolean|undefined;
    };
    const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
        const customLeaf = leaf as CustomLeaf;
        const className = leaf.textColor ? leaf.textColor : "";
        let el = children;
        if (customLeaf.bold) el = <strong>{el}</strong>;
        if (customLeaf.italic) el = <em>{el}</em>;
        if (customLeaf.underline) el = <u>{el}</u>; 
        if (customLeaf.strikethrough) el = <s>{el}</s>;
        if (customLeaf.fontSize) el = <span style={{ fontSize: `${customLeaf.fontSize}px` }}>{el}</span>;
        if (customLeaf.color) el = <span style={{ color: customLeaf.color }}>{el}</span>;
        return <span {...attributes} className={className}>{el}</span>;
    };
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && event.shiftKey) {
            const [match] = Editor.nodes(editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list-item',
            });
            if (match) {
                const [node] = match;
                const text = Node.string(node as Node);
                if (text.trim() === '') {
                    event.preventDefault();
                    // ออกจาก list
                    Transforms.unwrapNodes(editor, {
                        match: n => Element.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
                        split: true,
                    });
                    Transforms.setNodes(editor, { type: 'paragraph' });
                    return;
                }
            }
            const [p] = Editor.nodes(editor,{ match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'paragraph' });
            if(p){
                const [node] = p;
                const text = Node.string(node as Node);
                if(text.trim() === ''){
                    event.preventDefault(); // ป้องกัน line break ปกติ
                    const newNode: Element = { type: "division", children: [{ text: "" }] }
                    Transforms.insertNodes(editor, newNode);
                    Transforms.move(editor); // เลื่อน cursor ไป node ใหม่
                }
            }
        }
        if (!event.ctrlKey) return;
        switch (event.key) {
            case 'b': {
                event.preventDefault();
                toggleMark(editor, 'bold');
                break;
            }
            case 'i': {
                event.preventDefault();
                toggleMark(editor, 'italic');
                break;
            }
            case 'u': {
                event.preventDefault();
                toggleMark(editor, 'underline');
                break;
            }
            default: break;
        }
    };
    const [targetNode, setTargetNode] = useState<Node | null>(null);
    type ContextItemProps = {
        Icon: React.ComponentType;
        title: string;
        subItem?: string[];
        className?: string;
        onClick?: () => void;
    };
    const ContextItem = ({ Icon, title, subItem, className, onClick }: ContextItemProps) => {
        const submenuRef = useRef<HTMLDivElement | null>(null);
        const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number }>({
            top: 0,
            left: 0,
        });
        const handleMouseEnter = (e: React.MouseEvent) => {
            if (!submenuRef.current) return;
            const rect = submenuRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            let top = 0;
            let left = rect.width - 1; // ปกติให้ไปทางขวา
            // ถ้าชนขวาจอ → ย้ายไปซ้ายแทน
            if (e.clientX + rect.width > viewportWidth) left = -(rect.width + 10);
            // ถ้าชนล่างจอ → ดันขึ้น
            if (e.clientY + rect.height > viewportHeight) top = -(rect.height - 40); // เลื่อนขึ้น

            setSubmenuPos({ top, left });
        };
        return (
            <div className={`relative group`}>
                <div 
                    className={`flex items-center justify-between gap-2 px-4 py-2 hover:text-indigo-500 hover:bg-indigo-100 cursor-default${className?` ${className}`:''}`}
                    onMouseEnter={handleMouseEnter}
                    onClick={onClick}
                >
                    <div className="flex items-center gap-2">
                        <Icon />
                        {title}
                    </div>
                    {subItem && <MdOutlineChevronRight />}
                </div>

                {subItem && (
                    <div 
                        ref={submenuRef}
                        className="absolute top-0 left-full ml-0 w-50 bg-white border rounded shadow-lg hidden group-hover:block z-50"
                        style={{
                            top: submenuPos.top,
                            left: submenuPos.left,
                        }}
                    >
                    {subItem.map((sub, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:text-indigo-500 hover:bg-indigo-100"
                            onClick={() => handleOptionClick(sub)}
                        >
                        {sub}
                        </div>
                    ))}
                    </div>
                )}
            </div>
        );
    };
    const resizeHandler = () => { }

    const handleChange = (newValue: Descendant[]) => {
        setEditorValue(newValue);
        const html = serialize(newValue);
        onChange(html); // 🔁 ส่งกลับให้ react-hook-form
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const domRange = selection.getRangeAt(0);
        if (!domRange) return;

        if (isLinkActive(editor)) setIsLink(true);

        // ✅ เริ่มจาก node ที่คลิก
        const startNode = domRange.startContainer as HTMLElement;
        // ✅ ฟังก์ชันไล่หา parent ที่มี class col-span-*
        const findColSpanParent = (node: HTMLElement | null): HTMLElement | null => {
            while (node) {
                if (node.classList) {
                    for (const cn of Array.from(node.classList)) {
                        if (cn.startsWith("col-span-")) {
                            return node;
                        }
                    }
                }
                node = node.parentElement;
            }
            return null;
        };

        const colSpanParent = findColSpanParent(startNode);
        setTargetNode(colSpanParent);
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleOptionClick = (value: string) => {
        if (!targetNode) return;

        // 🔍 หา DOM ที่เป็น Slate element แท้ (มี data-slate-node)
        const slateEl = (targetNode as HTMLElement).closest("[data-slate-node='element']");
        if (!slateEl) return;

        try {
            const slateNode = ReactEditor.toSlateNode(editor, slateEl);
            const path = ReactEditor.findPath(editor, slateNode);

            const existingClass = (slateNode as any).className || "";
            const classList = existingClass.split(" ").filter(Boolean);

            // ✅ เพิ่ม md:class โดยลบของเดิมที่ขึ้นต้นด้วย md:col-span-
            const mdValue = `md:${value}`;
            const updated: string = classList
                .filter((c: string) => !c.startsWith("md:col-span-"))
                .concat(mdValue)
                .join(" ");

            Transforms.setNodes(
                editor,
                { className: updated },
                { at: path }
            );

            setContextMenu({ visible: false, x: 0, y: 0 });
        } catch (err) {
            console.warn("ไม่สามารถ resolve Slate node ได้:", err);
        }
    };


    const toggleLinkHandler = () => {
        const { selection } = editor;
        if (!selection) {
            setLinkData(null);
            return;
        }
        const [linkEntry] = Editor.nodes(editor, {
            at: selection,
            match: n => !Editor.isEditor(n) && Element.isElement(n) &&
            n.type === 'link',
        });

        if (linkEntry) {
            const [linkNode] = linkEntry;
            setLinkData({
                url: (linkNode as any).url || '',
                display: Node.string(linkNode),
                target: (linkNode as any).target || '_blank',
            });
        } else {
            const selectionText = Editor.string(editor, selection);
            setLinkData({
                url: '',
                display: selectionText,
                target: '_blank',
            });
        }
        setLinkModal(true);
    };
    const isLinkActive = (editor: Editor) => {
        const [match] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link' });
        return !!match;
    };


    const removeLink = () => {
        Transforms.unwrapNodes(editor, {
            match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
            split: true,
        });
    };

    const insertHorizontalLine = () => {
        const { selection } = editor;
        if (!selection) return;

        // หาตำแหน่ง block ปัจจุบัน
        const currentBlockEntry = Editor.above(editor, {
            match: (n) => Editor.isBlock(editor, n),
        });
        if (!currentBlockEntry) return;

        const [ , currentBlockPath] = currentBlockEntry;
        const hrElement = {
            type: 'hr',
            children: [{ text: '' }]
        };
        const newParagraph = {
            type: 'paragraph',
            children: [{ text: '' }],
        };
        // ✅ 1) แทรก hr "ถัดจาก block ปัจจุบัน" โดยไม่ split ก่อน
        const hrPath = Path.next(currentBlockPath);
        Transforms.insertNodes(editor, hrElement, { at: hrPath , select: true });
        // ✅ 2) แล้วค่อยแทรก p เปล่าต่อท้าย hr
        const pPath = Path.next(hrPath);
        Transforms.insertNodes(editor, newParagraph, { at: pPath });

        // ✅ 3) ย้าย cursor ไป p เปล่า
        const pointAfter = Editor.start(editor, pPath);
        Transforms.select(editor, pointAfter);
    };

    const TABLE_TYPES = ['table', 'table-header', 'table-row', 'table-cell'];
    const handleCustomSelect = () => {
        const entry = Editor.above(editor, {
            match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table'
        });
        if (!entry) return;
        const [tableNode, tablePath] = entry;
        if (!tableNode) {
            return; // ไม่มีการดำเนินการใดๆ หากไม่อยู่ในตาราง
        }
        const rowNode = tableNode.children[0];
        if (!rowNode || rowNode.type !== 'table-row' || rowNode.children.length === 0) {
            return;
        }
        const cellPath = tablePath.concat([0, 0]);
        try {
            const range = Editor.range(editor, cellPath);
            Transforms.select(editor, range);
            Transforms.collapse(editor, { edge: 'start' });

        } catch (error) {
            console.error("Error setting selection to the cell:", error);
            // กรณีที่ Path ไม่ถูกต้องตามโครงสร้างจริง
        }
    }
    const isSelectionInTable = (editor:Editor) => {
        if (!editor.selection) return false;
        const [tableEntry] = Array.from(Editor.nodes(editor, {
            match: n =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            n.type === 'table',
        }));
        return !!tableEntry;
    };
    const getSelectedImageEntry = (editor:Editor) => {
        const { selection } = editor;
        if (!selection) return null;

        const [match] = Editor.nodes(editor, {
            match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "image",
        });

        return match ?? null; // [node, path]
    };
    const handleInsertOrUpdateImage = ( url: string, alt: string, path?: Path) => {
        const entry = getSelectedImageEntry(editor);
        if (entry && path) {
            Transforms.setNodes(editor, { url, alt }, { at: path });
        } else {
            const imageNode = {
                type: 'image',
                url,
                alt: alt,
                className: 'max-w-full h-auto',
                children: [{ text: '' }],
            };
            Transforms.insertNodes(editor, imageNode);
        }
    };

    useEffect(() => {
        if (value) {
            setEditorKey(prev => prev + 2); // รีเซ็ต editor โดยใช้ key ใหม่เมื่อ id เปลี่ยน
            const newValue = deserialize(value);
            if (JSON.stringify(newValue) !== JSON.stringify(editorValue)) {
                setEditorValue(newValue);
            }
        }
    }, [value, editorValue]);

    useEffect(() => {
        const closeMenu = () => {
            if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
            setIsLink(false);
        };
        window.addEventListener('scroll', closeMenu, true);
        return () => window.removeEventListener('scroll', closeMenu, true);
    }, [contextMenu]);

    useEffect(() => {
        const closeMenu = () => {
            if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
            setIsLink(false);
        };
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [contextMenu]);


    useEffect(()=>{
        const closeMenu = () => (colorDropdown) ? setColorDropdown(false) : '' ;
        window.addEventListener('scroll', closeMenu, true);
        return () => window.removeEventListener('scroll', closeMenu);
    },[])

    const currentHTML = value ?? "";
    

    return (
        <div>
            <div className="border border-gray-200 dark:border-gray-600 rounded-xl">
                <div className="editor">
                    <Slate 
                        key={editorKey}
                        editor={editor}
                        initialValue={editorValue}
                        onChange={handleChange}
                    >
                        <div className="grid editor-tools p-2 inset-20 h-12 w-full shadow-[rgba(0,0,15,0.1)_0px_1px_5px_0px] dark:shadow-[rgba(255,255,255,0.3)_0px_1px_5px_0px]">
                            <div className="flex justify-between">
                                <div className="flex items-center divide-x">
                                    <div className="flex px-1">
                                        <Paragraph />
                                        <FontSize />
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="bold" action="mark" title="Bold" label={<RiBold/>} />
                                        <Button format="italic" action="mark" title="Italic" label={<RiItalic/>} />
                                        <Button format="underline" action="mark" title="Underline" label={<RiUnderline/>} />
                                        <Button format="strikethrough" action="mark" title="Strike" label={<RiStrikethrough/>} />
                                        <ColorDropdown isOpen={colorDropdown} setOpen={setColorDropdown}/>
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="align" align="left" title="Align left" label={<RiAlignLeft/>} />
                                        <Button format="align" align="center" title="Align center" label={<RiAlignCenter/>} />
                                        <Button format="align" align="right" title="Align right" label={<RiAlignRight/>} />
                                        <Button format="align" align="justify" title="Align justify" label={<LuAlignJustify/>} />
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="text-outdent" title="Outdent"  label={<PiTextOutdentBold />} />
                                        <Button format="text-indent" title="Indent"  label={<PiTextIndentBold />} />
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="bulleted-list" action="block" title="Unordered list"  label={<RiListUnordered />} />
                                        <Button format="numbered-list" action="block" title="Ordered list"  label={<RiListOrdered2 />} />
                                        <TableDropdown isOpen={tableDropdown} setOpen={setTableDropdown}/>
                                        {/* <Button format="table" action="block" title="Insert table" label={<LuTable />} /> */}
                                        <Button action="image" setModal={setShowModal} title="Image" label={<IoImage /> } onImageEdit={(data) => { setEditingImage(data) }}/>
                                    </div>
                                    
                                    <div className="flex px-1">
                                        <DropdownButton action="block" title="Add Grid Template" label={<LuLayoutTemplate/>}/>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button type="button" onClick={handleOpen} title="Source code" className="hover:bg-gray-200 text-black dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md"><RiCodeSSlashFill /></button>
                                </div>
                            </div>
                        </div>
                        <div className="editor-body p-2 resize-y" onContextMenu={handleContextMenu}>
                            <Editable 
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message here..."
                                style={{minHeight:'45rem', height:'45rem'}}
                                className="focus:outline-none overflow-y-auto"
                            />
                            {contextMenu.visible && (
                                <div 
                                    className={`fixed bg-white border rounded-lg text-base w-50 shadow-lg ${contextMenu.visible ? 'block' : 'hidden' }`}
                                    style={{ top: contextMenu.y, left: contextMenu.x }}
                                >
                                    <ContextItem Icon={IoLink} title="Link..." className="rounded-t-lg" onClick={toggleLinkHandler}/>
                                    {isLink && <ContextItem Icon={MdLinkOff} title="Remove Link" onClick={removeLink} />}
                                    <ContextItem 
                                        Icon={IoGridOutline}
                                        title="Grid Column" 
                                        subItem={columnsOptions}
                                    />
                                    <div className="border-t">
                                        <ContextItem Icon={MdHorizontalRule} title="Horizontal Line" className="rounded-b-lg" onClick={insertHorizontalLine}/>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="editor-footer border-t">
                            <div className="flex justify-end">
                                <div className="develop flex items-center">
                                    <div className="text-xs text-gray-500">Develope By: HOƆKY</div>
                                    <div className="px-1">
                                        <button type="button" title="resize" className="bg-transparent p-0 cursor-ns-resize" onDrag={resizeHandler}>
                                            <svg width="10" height="10" focusable="false"><g fillRule="nonzero"><path d="M8.1 1.1A.5.5 0 1 1 9 2l-7 7A.5.5 0 1 1 1 8l7-7ZM8.1 5.1A.5.5 0 1 1 9 6l-3 3A.5.5 0 1 1 5 8l3-3Z"></path></g></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name={name} value={value || ''} readOnly />
                    </Slate>
                </div>
            </div>
            {showModal && (
                <ImageModal
                    type={type}
                    id={id}
                    action={action}
                    draftId={draftId}
                    onClose={() => setShowModal(false)} 
                    defaultUrl={editingImage?.url || ""}
                    defaultAlt={editingImage?.alt || ""}
                    onInsert={(url: string, alt: string, path?: number[]) => {
                        handleInsertOrUpdateImage(url, alt, path);
                        // console.log("Inserting image with URL:", url, "and alt text:", alt);
                        // const imageNode = {
                        //     type: 'image',
                        //     url,
                        //     alt: alt,
                        //     className: 'max-w-full h-auto',
                        //     children: [{ text: '' }],
                        // };
                        // Transforms.insertNodes(editor, imageNode);
                    }}
                />
            )}
            {linkModal && (
                <LinkModal
                    linkData={linkData || undefined}
                    onClose={() => setLinkModal(false)}
                    onInsert={(url:string, display:string, target:string) => {
                        const { selection } = editor;
                        if (!selection) return;
                        // 1) เคสไม่มีข้อความที่ถูก select → insert link ใหม่พร้อม text
                        if (Range.isCollapsed(selection)) {
                            Transforms.insertNodes(editor, {
                                type: 'link',
                                url,
                                className: 'text-blue-500 no-underline',
                                target,
                                children: [{ text: display || url }],
                            });
                            return;
                        }
                        // ✅ 2) ถ้ามีการ select ข้อความ → wrap เฉพาะ inline, ไม่ให้กินทั้ง block
                        // ป้องกัน p ซ้อนกัน
                        const isInline = editor.isInline;
                        editor.isInline = (element) => element.type === 'link' ? true : isInline(element);
                        const linkNode = {
                            type: 'link',
                            url,
                            target,
                            className: 'text-blue-500 no-underline',
                            children: [],
                        };
                        // Wrap เฉพาะข้อความใน selection
                        Transforms.wrapNodes(editor, linkNode, {
                            split: true,
                            at: selection,
                        });
                        // ✅ ถ้าข้อความที่ select เดิมไม่มี text node → เติมให้
                        Transforms.collapse(editor, { edge: 'end' });
                        // restore behavior ของ inline
                        editor.isInline = isInline;
                    }}
                />
            )}
            <HTMLCodeModal 
                open={isOpen}
                initialHTML={currentHTML}
                onClose={() => setIsOpen(false)}
                onSave={handleSaveHTML}
            />
        </div>
    )
}

export default TextEditor