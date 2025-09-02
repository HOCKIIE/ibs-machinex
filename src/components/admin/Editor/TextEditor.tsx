"use client";
import "./TextEditor.scss"
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
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
    Path
} from 'slate';
import { Slate, Editable, withReact, useSlate, RenderElementProps  } from 'slate-react';
import { withHistory } from 'slate-history';
import { serialize, deserialize  } from '@/utils/slateHtmlConverter';
import { 
    RiBold, RiItalic, RiUnderline, 
    RiAlignLeft, RiAlignCenter, RiAlignRight,
    RiListUnordered, RiListOrdered2, RiImageFill, 
    RiCodeSSlashFill, RiStrikethrough
} from "react-icons/ri";
import { LuLayoutTemplate, LuTable, LuAlignJustify, LuChevronDown } from "react-icons/lu";
import { PiTextIndentBold, PiTextOutdentBold } from "react-icons/pi";
import { IoRefresh, IoClose, IoTrashBinOutline } from "react-icons/io5";
import Api from "@/services/Api";
import { set } from "lodash";


const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    // @ts-expect-error: Marks may not exist on the editor object
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
        editor.children.map((n: any) => n).filter((n: any) => n.type === format)
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
        console.log('Insert grid template');
        const block = {
            type: 'grid',
            children: [
                {
                    type: 'grid-column', // สร้าง type ใหม่สำหรับ col
                    children: [{ type: 'paragraph', children: [{ text: 'Column 1' }] }],
                },
                {
                    type: 'grid-column',
                    children: [{ type: 'paragraph', children: [{ text: 'Column 2' }] }],
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
                    children: [{ text: '' }],
                }],
            };
            Transforms.insertNodes(editor, block);
        } else {
            Transforms.setNodes(editor, { type: format });
        }
    }
};
const toggleAlign = (editor: Editor, align: 'left' | 'center' | 'right'| 'justify') => {
    const className =
        align === 'justify' ? 'text-justify' :
        align === 'center' ? 'text-center' :
        align === 'right' ? 'text-right' :
        'text-left';
        Transforms.setNodes(
            editor,
            { type: 'paragraph', className },
            { match: n =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                Editor.isBlock(editor, n),
                split: true,
            }
        );
};

const Button: React.FC<{ 
    format?: string;
    action?: 'mark' | 'block'| 'image';
    align?: 'left' | 'center' | 'right' | 'justify';
    label: React.ReactNode;
    title?: string;
    setModal?: (value: boolean) => void;
}> = ({ format, action, align, label, title,setModal }) => {
    const editor = useSlate();
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (action === 'mark' && format) toggleMark(editor, format);
        else if (action === 'block' && format) toggleBlock(editor, format);
        else if (align) toggleAlign(editor, align);
        if(typeof setModal == 'function') {
            setModal(true)
        }
    }
        
    return (
        <button type="button" onMouseDown={handleMouseDown} className="hover:bg-gray-200 text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md" title={title}>
            {label}
        </button>
    );
};

const DropdownButton: React.FC<{ format: string; action?: 'mark' | 'block'; label: any; title?:string }> = ({format, label, title}) => {

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const editor = useSlate();

    async function replaceChildren(
        editor: Editor,
        parentPath: Path,
        newChildren: Node[]
    ) {
        const parentNode = Node.get(editor, parentPath);
        if (!('children' in parentNode)) return;
        const childrenCount = parentNode.children.length;
        for (let i = 0; i < childrenCount; i++) {
            Transforms.removeNodes(editor, { at: parentPath.concat(0) });
        }
        Transforms.insertNodes(editor, newChildren, { at: parentPath.concat(0) });
    }
    const handleSelectionChange = useCallback(async(select:number) => {
        const { selection } = editor;
        if (!selection) return;

        const colDefault = [
            {col:1, className:"col-span-12 p-2"},
            {col:2, className:"col-span-12 md:col-span-6 p-2"},
            {col:3, className:"col-span-12 md:col-span-4 p-2"},
            {col:4, className:"col-span-12 md:col-span-3 p-2"},
        ];
        const className = colDefault.find((v) => v.col == select);
        const entry = Editor.above(editor, {
            match: n => !Editor.isEditor(n) && typeof n === 'object' && n.type === 'grid-column'
        }) as NodeEntry;
        if (!entry) return;

        const [node , path] = entry;
        const innerText = node.children[0].children[0].text;
        const parentEntry = Editor.parent(editor, path);
        const [, parentPath] = parentEntry;
        const newChild = Array.from({ length: select }, (_, i) => ({
            type: 'grid-column',
            className: className?.className,
            children: [{
                type: 'paragraph',
                children: [{ text: innerText }],
            }],
        }));
        
        await replaceChildren(editor, parentPath, newChild);
        console.log('new child',newChild);
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
            console.log('match', match);
            if (match) {
                const [, path] = match;
                const insertPath: Path = Path.next(path);
                Transforms.insertNodes(editor, block, { at: insertPath });
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
            setOpen(false);
            }
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
            <option value="heading-one">H1</option>
            <option value="heading-two">H2</option>
            <option value="heading-three">H3</option>
            <option value="heading-four">H4</option>
            <option value="heading-five">H5</option>
            <option value="heading-six">H6</option>
            <option value="div">div</option>
        </select>
    );
};

const FontSize: React.FC = () => {
    const editor = useSlate();
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = e.target.value;
        Transforms.setNodes(
            editor,
            { fontSize: size },
            { match: Text.isText, split: true }
        );
    };
    return (
        <select title="Font Size" onChange={handleChange} defaultValue="16" className="text-sm p-2 rounded-md bg-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
        </select>
    );
};

type galleryType = {
    url: string;
    id: string;
    type: string;
    selected: string;
}

const ImageModal = ({
    id,
    type,
    onClose,
    onInsert
}: {
    id?: string;
    type?: string;
    onClose: () => void;
    onInsert: (url: string[]) => void;
}) => {
    const [tab, setTab] = useState<"upload" | "gallery">("gallery");
    const [file, setFile] = useState<File[] | null>([]);
    const [preview, setPreview] = useState<string[] | null>([]);
    const [gallery,setGallery] = useState<galleryType[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<string[] | null>([]);
    const [message, setMessage] = useState<{status: string; message: string} | null>(null);
    const [thisId, setId] = useState<string | null>(id || "");
    const [thisType, setType] = useState<string | null>(type || "");
    const [deleteConfirm, setDelete] = useState(false);
    const didFetchGallery = useRef(false);
    
    const getGallery = async () => {
        const response = await Api.get(`/gallery?type=${thisType}&id=${thisId}`);
        console.log('Gallery response:', response.data.gallery);
        setGallery(response?.data.gallery);
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile([]);
        setPreview([]);
        for (const f of e.target.files || []) {
            setFile(prev => [...(prev || []), f ]);
            setPreview(prev => [...(prev || []), URL.createObjectURL(f) ]);
        }
    };
    const handleInsert = () => {
        if (tab === "upload" && preview) {
            onInsert(preview);
            onClose();
        } else if (tab === "gallery" && selected) {
            onInsert(selected);
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
        formData.append("id", thisId ?? "");

        try {
            setUploading(true);
            const request = await Api.post("/gallery/upload", formData, { headers: { "Content-Type": "multipart/form-data" }});
            await getGallery();
            if(request.data.status === true){
                setMessage({'status':'success','message':"Upload successful."});
                setTimeout(() => {
                    setFile(null);
                    setPreview(null);
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
    const deleteImage = async () => {
        if(!selected || selected.length === 0) {
            setDelete(true);
            return;
        }
        if(!confirm("Are you sure to delete selected image?")) return;
        try {
            const request = await Api.post("/gallery/delete", {
                urls: selected,
                type: thisType,
                id: thisId
            });
            await getGallery();
            if(request.data.status === true){
                setMessage({'status':'success','message':"Delete successful."});
                setSelected(null);
                setTimeout(() => {
                    setMessage(null);
                },3000);
            }else{
                setMessage({'status':'error','message':request.data.message || "Delete failed."});
            }
        } catch (err) {
            setMessage({'status':'error','message':"Delete failed."});
            console.error(err);
        }
    }
    const handlerCancelUpload = () => {
        setFile(null);
        setPreview(null);
        setTab('gallery');
    }
    useEffect(() => {
        if(didFetchGallery.current) return;
        didFetchGallery.current = true;
        getGallery();
    },[]);

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-99">
        <div className="bg-white rounded-lg w-full lg:w-[1130px] h-full lg:h-[800px] shadow-lg relative">
            <div className="flex justify-between items-center border-b pb-2 pt-4 px-6">
                <h2 className="text-lg font-semibold">Insert Image</h2>
                <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="p-6">
                <div className="flex gap-4 justify-between mb-6 border-b">
                    <div className="flex gap-4">
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
                        <button type="button" className="p-2 bg-transparent rounded-md hover:ring-2 hover:ring-gray-300/50 disabled:text-gray-300" disabled onClick={deleteImage}><IoTrashBinOutline/></button>
                    </div>
                    }
                </div>
                {tab === "upload" && (
                    <div className="h-[87%]">
                        <input 
                            type="file" 
                            className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100"
                            accept="image/*" 
                            multiple 
                            onChange={handleFileChange}
                        />
                        {message && <div className="my-4">
                            <div className={`${message.status=='success'?`bg-green-100 text-green-600 border-green-400`:`bg-red-100 text-red-500 border-red-400`} p-2 border rounded-lg flex items-center justify-between`}>
                                {message.message}
                                <button type="button" className={`bg-transparent ${message.status==='success'?`text-green-600`:`text-red-500 p-2`}`} onClick={()=>setError(null)}><IoClose/></button>
                            </div>
                        </div>}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[77%] overflow-y-auto p-1">
                            {preview && preview.map((img,k)=>(
                            <div key={k} className="border rounded-md overflow-hidden cursor-pointer h-32 w-37 flex justify-center items-center">
                                <img src={img} alt="preview" className="object-cover h-full" />
                            </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab === "gallery" && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[77%] overflow-y-auto p-1">
                        {gallery && gallery.map((img,k) => (
                        <div
                            key={k}
                            className={`border rounded-md overflow-hidden cursor-pointer h-32 w-37 flex item-center justify-center ${selected && selected.includes(img.url) ? "ring-2 ring-blue-500" : ""}`}
                            onClick={() => setSelected([img.url])}
                        >
                            <img src={img.url} alt="gallery" className="object-cover h-full" />
                        </div>
                        ))}
                    </div>
                </>
                )}
            </div>
            <div className="w-full m-6 flex justify-end gap-3 absolute bottom-0 object-fit right-0">
                <button type="button" onClick={onClose} className={`px-3 py-1 rounded bg-gray-100 border-gray-200  hover:bg-gray-200 hover:ring-2 hover:ring-gray-300/70 ${tab === 'upload' ? 'hidden' : ''}`}>Cancel</button>
                <button
                    type="button"
                    onClick={handleInsert}
                    className={`px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50 hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-600 ${tab === 'upload' ? 'hidden' : ''}`}
                    disabled={tab === "upload" ? !file : !selected}
                >Insert</button>
                <button 
                    type="button" 
                    className={`bg-gray-100 hover:bg-gray-200 hover:ring-2 hover:ring-gray-300/70 disabled:bg-gray-100 disabled:text-gray-500 text-gray-700 px-3 py-1 rounded  ${tab !== 'upload' ? 'hidden' : ''}`}
                    onClick={()=>handlerCancelUpload}
                >Cancel</button>
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

type CustomElement = BaseElement & { type: string; children: Array<unknown> };
type CustomText = BaseText & { fontSize?: string };

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
interface EditorProps {
    type?: string;
    id?: string;
    name: string;
    value: string | null;
    onChange: (value: string) => void;
}

const TextEditor: React.FC<EditorProps> = ({type, id, name, value, onChange}) => {

    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [status, setStatus] = useState<string>('p');
    const [showModal, setShowModal] = useState<boolean>(false);
    const didLoadRef = useRef(false);
    const [editorKey, setEditorKey] = useState(0);
    const defaultEditorValue: Descendant[] = [
        {
            type: 'grid',
            children: [{
                type: 'grid-column',
                children: [{ type: 'paragraph', children: [{ text: 'Image', align: "center" }] }],
            }],
        },
        {
            type: 'grid',
            children: [{
                type: 'grid-column',
                children: [{ type: 'paragraph', children: [{ text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." }] }],
            }]
        }
    ];
    const [editorValue, setEditorValue] = useState<Descendant[]>(defaultEditorValue);

    
    const renderElement = useCallback((props: RenderElementProps) => {
        const { attributes, children, element } = props;
        switch (element.type) {
            case 'paragraph':
                return <p {...attributes} className={element.className}>{children}</p>;
            case 'heading-one':
                return <h1 {...attributes} className={`text-4xl ${element.className}`}>{children}</h1>;
            case 'heading-two':
                return <h2 {...attributes} className={`text-3xl ${element.className}`}>{children}</h2>;
            case 'heading-three':
                return <h3 {...attributes} className={`text-2xl ${element.className}`}>{children}</h3>;
            case 'heading-four':
                return <h4 {...attributes} className={`text-xl ${element.className}`}>{children}</h4>;
            case 'heading-five':
                return <h5 {...attributes} className={`text-lg ${element.className}`}>{children}</h5>;
            case 'heading-six':
                return <h6 {...attributes} className={`text-md ${element.className}`}>{children}</h6>;
            case 'bulleted-list':
                return <ul {...attributes} className="marker:text-gray-700 list-disc pl-5 space-y-1 text-slate-700 text-md">{children}</ul>;
            case 'numbered-list':
                return <ol {...attributes} className="marker:text-gray-700 list-decimal pl-5 space-y-1 text-slate-700 text-md">{children}</ol>;
            case 'list-item':
                return <li {...attributes}>{children}</li>;
            case 'link':
                return (
                    <a {...attributes} href={element.url} className={`text-blue-500 no-underline`}>
                    {children}
                    </a>
                );
            case 'image':
                return (
                    <div {...attributes} className={element.className}>
                        <img src={element.src} alt="image" style={{ maxWidth: '100%', height: '100%' }} />
                        {children}
                    </div>
                );
            case 'table':
                return (
                    <table 
                        {...attributes} 
                        className={`${element.className?`${element.className}`:`border-collapse border border-gray-200`}`} 
                    ><tbody>{children}</tbody></table>
                );
            case 'grid':
                return (
                    <div {...attributes} className={`${element.className?`${element.className}`:`grid grid-cols-12 gap-4 mb-4`}`}>{children}</div>
                );
            case 'grid-column':
                return (
                    <div {...attributes} className={`${element.className?`${element.className}`:`col-span-12 p-2`}`}>{children}</div>
                );
            default:
                return <div {...attributes} className={element.className}>{children}</div>;
        }
    }, []);
    
    const renderLeaf = useCallback((props: any) => {
        const { attributes, children, leaf } = props;
        let el = children;
        if (leaf.bold)el = <strong>{el}</strong>;
        if (leaf.italic) el = <em>{el}</em>;
        if (leaf.underline) el = <u>{el}</u>; 
        if (leaf.strikethrough) el = <s>{el}</s>;
        if (leaf.fontSize) el = <span style={{ fontSize: `${leaf.fontSize}px` }}>{el}</span>;
        return <span {...attributes}>{el}</span>;
    }, []);
    
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
        }
        if (!event.ctrlKey) return;
        switch (event.key) {
            // case 'y': {
            //     event.preventDefault();
            //     HistoryEditor.redo(editor);
            //     break;
            // }
            // case 'z': {
            //     event.preventDefault();
            //     HistoryEditor.undo(editor);
            //     break;
            // }
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

    
    const resizeHandler = () => {
        
    }

    const handleChange = (newValue: Descendant[]) => {
        setEditorValue(newValue);
        const html = serialize(newValue);
        onChange(html); // 🔁 ส่งกลับให้ react-hook-form
    };
    useEffect(() => {
        if (value && !didLoadRef.current) {
            setEditorKey(prev => prev + 1);
            const newValue = deserialize(value);
            if (JSON.stringify(newValue) !== JSON.stringify(editorValue)) {
                console.log("Updating editor value from props:", newValue);
                setEditorValue(newValue);
            }
            didLoadRef.current = true;
        }
    }, [value, editorValue, editorKey]);
    

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
                                    {/* <div className="flex pe-1">
                                        <Button format="undo" action="block" label={<LiaUndoSolid/>} />
                                        <Button format="Redo" action="block" label={<LiaRedoSolid/>} />
                                    </div> */}
                                    <div className="flex px-1">
                                        <Paragraph />
                                        <FontSize />
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="bold" action="mark" title="Bold" label={<RiBold/>} />
                                        <Button format="italic" action="mark" title="Italic" label={<RiItalic/>} />
                                        <Button format="underline" action="mark" title="Underline" label={<RiUnderline/>} />
                                        <Button format="strikethrough" action="mark" title="Strike" label={<RiStrikethrough/>} />
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="align" align="left" title="Align left" label={<RiAlignLeft/>} />
                                        <Button format="align" align="center" title="Align center" label={<RiAlignCenter/>} />
                                        <Button format="align" align="right" title="Align right" label={<RiAlignRight/>} />
                                        <Button format="align" align="justify" title="Align justify" label={<LuAlignJustify/>} />
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="outdent" action="mark" title="Outdent"  label={<PiTextOutdentBold />} />
                                        <Button format="indent" action="mark" title="Indent"  label={<PiTextIndentBold />} />
                                    </div>
                                    <div className="flex px-1">
                                        <Button format="bulleted-list" action="block" title="Bulleted list"  label={<RiListUnordered />} />
                                        <Button format="numbered-list" action="block" title="Numbered list"  label={<RiListOrdered2 />} />
                                        <Button format="table" action="block" title="Insert table" label={<LuTable />} />
                                    </div>
                                    
                                    <div className="flex px-1">
                                        <Button format="image" setModal={setShowModal} title="Image" label={<RiImageFill />} />
                                        {/* <button title="Image" className="hover:bg-gray-200 text-black dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md"><RiImageFill /></button> */}
                                        <DropdownButton format="grid-template" action="block" title="Add Grid Template" label={<LuLayoutTemplate/>}/>
                                        {/* <Button format="grid-template" action="block" title="Grid template" label={<LuLayoutTemplate/>} /> */}
                                        
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button type="button" title="Source code" className="hover:bg-gray-200 text-black dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md"><RiCodeSSlashFill /></button>
                                </div>
                            </div>
                        </div>
                        <div className="editor-body p-2 resize-y">
                            
                            <Editable 
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message here..."
                                style={{minHeight:'45rem', height:'45rem'}}
                                className="focus:outline-none overflow-y-auto"
                            />
                        </div>
                        <div className="editor-footer border-t">
                            <div className="flex justify-between">
                                <div className="status text-xs ps-2">{status}</div>
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
                    onClose={() => setShowModal(false)} 
                    onInsert={(urls: string[]) => {
                        urls.forEach(url => {
                            const imageNode = {
                                type: 'image',
                                url,
                                className: 'max-w-full h-auto',
                                children: [{ text: '' }],
                            };
                            Transforms.insertNodes(editor, imageNode);
                        });
                    }} 
                />
            )}
        </div>
    )
}

export default TextEditor