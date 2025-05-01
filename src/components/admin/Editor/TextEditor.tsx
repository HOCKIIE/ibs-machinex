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
import { Slate, Editable, withReact, useSlate  } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';

import { 
    RiBold, RiItalic, RiUnderline, 
    RiAlignLeft, RiAlignCenter, RiAlignRight,
    RiListUnordered, RiListOrdered2, RiImageFill, 
    RiCodeSSlashFill, RiStrikethrough
} from "react-icons/ri";
import { LiaUndoSolid, LiaRedoSolid } from "react-icons/lia";
import { LuLayoutTemplate, LuTable, LuAlignJustify, LuChevronDown } from "react-icons/lu";
import { BsBorderBottom } from "react-icons/bs";

import { PiTextIndentBold } from "react-icons/pi";
import { PiTextOutdentBold } from "react-icons/pi";


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
const toggleAlign = (editor: Editor, align: 'left' | 'center' | 'right') => {
    Transforms.setNodes(
        editor,
        { align },
        { match: n => Editor.isBlock(editor, n), split: true }
    );
};

const Button: React.FC<{ format: string; action?: 'mark' | 'block'; align?: string; label: any; title?:string }> = ({ format, action, align, label, title }) => {
    const editor = useSlate();
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (action === 'mark') {
            toggleMark(editor, format);
        } else if (align) {
            toggleAlign(editor, align as 'left' | 'center' | 'right');
        } else {
            toggleBlock(editor, format);
        }
    };
    return (
        <button onMouseDown={handleMouseDown} className="hover:bg-gray-200 text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md" title={title}>
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
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
            >{label}
            </button>
            <button
                onClick={() => setOpen(!open)}
                className="rounded-e-md  px-[1px] hover:bg-gray-200 text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                title="More columns"
            ><LuChevronDown />
            </button>
            {open && (
                <div className={`absolute z-10 top-full right-0 w-48 bg-white border rounded shadow-lg ease-in-out duration-500`}>
                    <ul className="text-sm text-gray-700">
                        <li>
                            <button
                                onClick={()=>handleSelectionChange(1)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >1 Column</button>
                        </li>
                        <li>
                            <button
                                onClick={()=>handleSelectionChange(2)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >2 Column</button>
                        </li>
                        <li>
                            <button
                                onClick={()=>handleSelectionChange(3)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >3 Column</button>
                        </li>
                        <li>
                            <button
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
  

type CustomElement = BaseElement & { type: string; children: Array<Omit<Descendant, 'children'>> };
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

const TextEditor: React.FC = () => {

    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [status, setStatus] = useState<string>('p')
    const [value, setValue] = useState<Descendant[]>([
        {
            type: 'grid',
            children: [{
                type: 'grid-column',
                children: [{ type: 'paragraph', children: [{ text: 'Blog image',align:"center" }] }],
            }],
        },
        {
            type: 'grid',
            children: [{
                type: 'grid-column',
                children: [{ type: 'paragraph', children: [{ text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." }] }],
            }]
        }
    ]);
    
    const renderElement = useCallback((props: any) => {
        const { attributes, children, element } = props;
        const align = element.children?.[0]?.align || null;
        const alignStyle = align ? `${align}` : ''; // ใช้ Tailwind class

        switch (element.type) {
            case 'paragraph':
                return <p {...attributes} className="mb-3" style={{textAlign:alignStyle}}>{children}</p>;
            case 'heading-one':
                return <h1 {...attributes} className="text-4xl" style={{textAlign:alignStyle}}>{children}</h1>;
            case 'heading-two':
                return <h2 {...attributes} className="text-3xl" style={{textAlign:alignStyle}}>{children}</h2>;
            case 'heading-three':
                return <h3 {...attributes} className="text-2xl" style={{textAlign:alignStyle}}>{children}</h3>;
            case 'heading-four':
                return <h4 {...attributes} className="text-xl" style={{textAlign:alignStyle}}>{children}</h4>;
            case 'heading-five':
                return <h5 {...attributes} className="text-lg" style={{textAlign:alignStyle}}>{children}</h5>;
            case 'heading-six':
                return <h6 {...attributes} className="text-md" style={{textAlign:alignStyle}}>{children}</h6>;
            case 'bulleted-list':
                return <ul {...attributes} className="marker:text-gray-700 list-disc pl-5 space-y-1 text-slate-700 text-md" style={{textAlign:alignStyle}}>{children}</ul>;
            case 'numbered-list':
                return <ol {...attributes} className="marker:text-gray-700 list-decimal pl-5 space-y-1 text-slate-700 text-md" style={{textAlign:alignStyle}}>{children}</ol>;
            case 'list-item':
                return <li {...attributes}>{children}</li>;
            case 'link':
                return (
                    <a {...attributes} href={element.url} className={`text-blue-500 no-underline ${alignStyle}`}>
                    {children}
                    </a>
                );
            case 'image':
                return (
                    <div {...attributes} style={{ textAlign: alignStyle }}>
                        <img src={element.url} alt="image" style={{ maxWidth: '100%', height: 'auto' }} />
                        {children}
                    </div>
                );
            case 'table':
                return (
                    <table 
                        {...attributes} 
                        className={`${element.className?`${element.className}`:`border-collapse border border-gray-200`}`} 
                        style={{textAlign:alignStyle}}
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
                return <div {...attributes} style={{textAlign:alignStyle}}>{children}</div>;
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
            case 'y': {
                event.preventDefault();
                HistoryEditor.redo(editor);
                break;
            }
            case 'z': {
                event.preventDefault();
                HistoryEditor.undo(editor);
                break;
            }
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

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="editor">
                <Slate editor={editor} initialValue={value} onChange={newValue => setValue(newValue)}>
                    <div className="editor-tools p-2 inset-20 h-12 w-full shadow-[rgba(0,0,15,0.1)_0px_1px_5px_0px] dark:shadow-[rgba(255,255,255,0.3)_0px_1px_5px_0px]">
                        <div className="flex justify-between">
                            <div className="flex items-center divide-x">
                                <div className="pe-1">
                                    <Button format="undo" action="block" label={<LiaUndoSolid/>} />
                                    <Button format="Redo" action="block" label={<LiaRedoSolid/>} />
                                </div>
                                <div className="px-1">
                                    <Paragraph/>
                                    <FontSize/>
                                </div>
                                <div className="px-1">
                                    <Button format="bold" action="mark" title="Bold" label={<RiBold/>} />
                                    <Button format="italic" action="mark" title="Italic" label={<RiItalic/>} />
                                    <Button format="underline" action="mark" title="Underline" label={<RiUnderline/>} />
                                    <Button format="strikethrough" action="mark" title="Strike" label={<RiStrikethrough/>} />
                                </div>
                                <div className="px-1">
                                    <Button format="border" action="mark" title="Border" label={<BsBorderBottom/>} />
                                </div>
                                <div className="px-1">
                                    <Button format="align-left" align="left" title="Align left" label={<RiAlignLeft/>} />
                                    <Button format="align-center" align="center" title="Align center" label={<RiAlignCenter/>} />
                                    <Button format="align-right" align="right" title="Align right" label={<RiAlignRight/>} />
                                    <Button format="align-justify" align="justify" title="Align justify" label={<LuAlignJustify/>} />
                                </div>
                                <div className="px-1">
                                    <Button format="outdent" action="mark" title="Outdent"  label={<PiTextOutdentBold />} />
                                    <Button format="indent" action="mark" title="Indent"  label={<PiTextIndentBold />} />
                                </div>
                                <div className="px-1">
                                    <Button format="bulleted-list" action="block" title="Bulleted list"  label={<RiListUnordered />} />
                                    <Button format="numbered-list" action="block" title="Numbered list"  label={<RiListOrdered2 />} />
                                    <Button format="table" action="block" title="Insert table" label={<LuTable />} />
                                </div>
                                
                                <div className="px-1 flex">
                                    <Button format="table" action="block" title="Image" label={<RiImageFill />} />
                                    {/* <button title="Image" className="hover:bg-gray-200 text-black dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md"><RiImageFill /></button> */}
                                    <DropdownButton format="grid-template" action="block" title="Grid template" label={<LuLayoutTemplate/>}/>
                                    {/* <Button format="grid-template" action="block" title="Grid template" label={<LuLayoutTemplate/>} /> */}
                                    
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button title="Source code" className="hover:bg-gray-200 text-black dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded-md"><RiCodeSSlashFill /></button>
                            </div>
                        </div>
                    </div>
                    <div className="editor-body p-2">
                        <Editable 
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            style={{minHeight:'25rem', height:'25rem'}}
                            className="focus:outline-none overflow-y-auto"
                            onChange={(newValue) => {
                                console.log("Editor content changed: ", newValue);
                            }}
                        >
                        </Editable>
                    </div>
                    <div className="editor-footer border-t">
                        <div className="flex justify-between">
                            <div className="status text-xs ps-2">{status}</div>
                            <div className="develop flex items-center">
                                <div className="text-xs text-gray-500">Develope By: HOƆKY</div>
                                <div className="px-1">
                                    <button title="resize" className="bg-transparent p-0 cursor-ns-resize" onDrag={resizeHandler}>
                                        <svg width="10" height="10" focusable="false"><g fillRule="nonzero"><path d="M8.1 1.1A.5.5 0 1 1 9 2l-7 7A.5.5 0 1 1 1 8l7-7ZM8.1 5.1A.5.5 0 1 1 9 6l-3 3A.5.5 0 1 1 5 8l3-3Z"></path></g></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Slate>
            </div>

        </div>
    )
}

export default TextEditor