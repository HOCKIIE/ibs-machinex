import { Descendant, Text, BaseText } from "slate";
import { mergeClassNames, removeDuplicateClasses } from "./utils";
// import { boolean } from "zod";
// import { htmlToSlate, slateToHtml } from "slate-serializers";

export const deserialize = (html: string): Descendant[] => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.body;

        const nodes: Descendant[] = Array.from(body.childNodes)
            .map((node) => innerDeserialize(node))
            .flat()
            .filter(Boolean);
        return nodes.length ? nodes : [{ type: "paragraph", children: [{ text: "" }] }];
    } catch {
        return [{ type: "paragraph", children: [{ text: "" }] }];
    }
};
interface CustomText extends BaseText {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    fontSize?: number;
    type: string;
    children: [];
    align: string;
    className: string;
    style: string;
    alt: string;
    columns: string;
    span: string;
    src?: string; // Added src property
    url?: string;
    target?: string;
}

export const serialize = (nodes: CustomText[]): string => {
    if (!Array.isArray(nodes)) {
        console.error("❌ nodes ไม่ใช่ array:", nodes);
        return "";
    }
    return nodes.map(serializeNode).join('');
};
const DEFAULT_CLASSES = {
    p: "text-black mb-4",
    span: "text-black mb-4",
    ul: 'marker:text-gray-700 list-disc pl-5 space-y-1 text-gray-800 text-md',
    ol: 'marker:text-gray-700 list-decimal pl-5 space-y-1 text-gray-800 text-md',
    h: 'text-black',
    h1: 'text-black text-4xl',
    h2: 'text-black text-3xl',
    h3: 'text-black text-2xl',
    h4: 'text-black text-xl',
    h5: 'text-black text-lg',
    h6: 'text-black text-md',
    hr: 'my-4',
    img: "object-cover w-full",
    table: "border border-gray-300 px-2 py-1 w-full"
};
export function serializeNode(node: CustomText): string {
    if (Text.isText(node)) {
        let text = node.text;
        if (node.bold) text = `<strong>${text}</strong>`;
        if (node.italic) text = `<em>${text}</em>`;
        if (node.underline) text = `<u>${text}</u>`;
        if (node.strikethrough) text = `<s>${text}</s>`;
        return text;
    }
    const children = node.children.map(serializeNode).join('');
    const cleanClass = removeDuplicateClasses(node.className);
    switch (node.type) {
        case 'paragraph': return `<p class="${cleanClass || DEFAULT_CLASSES.p}">${children}</p>`;
        case 'span': return `<span class="${cleanClass || DEFAULT_CLASSES.span}">${children}</span>`;
        case "h1": return `<h1 class="${cleanClass || DEFAULT_CLASSES.h}">${children}</h1>`;
        case "h2": return `<h2 class="${cleanClass || DEFAULT_CLASSES.h}">${children}</h2>`;
        case "h3": return `<h3 class="${cleanClass || DEFAULT_CLASSES.h}">${children}</h3>`;
        case "h4": return `<h4 class="${cleanClass || DEFAULT_CLASSES.h}">${children}</h4>`;
        case "h5": return `<h5 class="${cleanClass || DEFAULT_CLASSES.h}">${children}</h5>`;
        case "h6": return `<h6 class="${cleanClass || DEFAULT_CLASSES.h}">${children}</h6>`;
        case 'bulleted-list': return `<ul class="${cleanClass || DEFAULT_CLASSES.ul}">${children}</ul>`;
        case 'numbered-list': return `<ol class="${cleanClass || DEFAULT_CLASSES.ol}">${children}</ol>`;
        case 'list-item': return `<li>${children}</li>`;
        case 'bold': return `<strong>${children}</strong>`;
        case 'italic': return `<em>${children}</em>`;
        case 'underline': return `<u>${children}</u>`;
        case 'hr': return `<hr class="${cleanClass || DEFAULT_CLASSES.ol}"/>`;
        case 'link': return `<a href="${(node as any).url || "#"}" class="${cleanClass || ''}" target="${node.target || '_blank'}">${children}</a>`;
        case 'image':
            return `<img src="${node?.url || ""}" alt="${node.alt || ""}" class="${cleanClass || "max-w-full h-auto"}" style="${node.style ? Object.entries(node.style).map(([k, v]) => `${k}:${v}`).join(";") : ""}" />`;
        case "table":
            return `<table  className="${cleanClass || DEFAULT_CLASSES.table}" ><tbody>${children}</tbody></table>`;
        case "table-row": return `<tr >${children}</tr>`;
        case "table-cell": return `<td  className="${cleanClass||''}" >${children}</td>`;
        case 'grid': return `<div class="grid grid-cols-${node.columns || 12} gap-4 mb-4">${children}</div>`;
        case 'grid-column': return `<div class="${node.className || `col-span-${node.span || 12} p-2`}">${children}</div>`;
        default: return `<div class="${cleanClass || ''}">${children}</div>`;
    }
}

const ensureText = (arr: Descendant[]) => arr.length > 0 ? arr : [{ text: "" }];

function innerDeserialize(node: ChildNode): Descendant | Descendant[] {
    if (node.nodeType === Node.TEXT_NODE) {
        return { text: node.textContent || "" };
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return { text: "" };
    }

    const el = node as HTMLElement;
    const nodeName = el.tagName.toLowerCase();
    const classList = el.className.split(" ");
    const children = Array.from(el.childNodes)
        .map(innerDeserialize)
        .flat()
        .filter(Boolean);

    const styleObj = parseStyle(el.getAttribute("style") || "");
    const className = removeDuplicateClasses(el.className || "");


    // if (["span", "strong", "em", "u"].includes(nodeName)) {
    //     return children.map((child) => {
    //         if (!("text" in child)) return child;
    //         return {
    //             ...child,
    //             bold: nodeName === "strong" || styleObj.fontWeight === "bold" || child.bold,
    //             italic: nodeName === "em" || styleObj.fontStyle === "italic" || child.italic,
    //             underline: nodeName === "u" || styleObj.textDecoration === "underline" || child.underline,
    //             color: styleObj.color || child.color,
    //             style: {
    //                 ...child.style,
    //                 ...styleObj,
    //             },
    //         };
    //     });
    // }
    switch (nodeName) {
        case "p":
            return {
                type: "paragraph",
                style: styleObj,
                className: mergeClassNames(className, DEFAULT_CLASSES.p),
                children: children.length ? children : [{ text: "" }],
            };
        case "span":
            return children.map(child => {
                if ("text" in child) {
                    return {
                        ...child,
                        ...("fontSize" in styleObj ? { fontSize: parseInt(styleObj.fontSize) } : {}),
                        color: styleObj.color || child.color,
                        style: { ...child.style, ...styleObj },
                        className,
                    };
                }
                return child;
            });
        case 'h1': return { type: 'h1', style: styleObj, className: mergeClassNames(className, DEFAULT_CLASSES.h), children };
        case 'h2': return { type: 'h2', style: styleObj, className: mergeClassNames(className, DEFAULT_CLASSES.h), children };
        case 'h3': return { type: 'h3', style: styleObj, className: mergeClassNames(className, DEFAULT_CLASSES.h), children };
        case 'h4': return { type: 'h4', style: styleObj, className: mergeClassNames(className, DEFAULT_CLASSES.h), children };
        case 'h5': return { type: 'h5', style: styleObj, className: mergeClassNames(className, DEFAULT_CLASSES.h), children };
        case 'h6': return { type: 'h6', style: styleObj, className: mergeClassNames(className, DEFAULT_CLASSES.h), children };
        case "img":
            return {
                type: "image",
                url: el.getAttribute("src") || "",
                alt: el.getAttribute("alt") || "",
                style: styleObj,
                className: mergeClassNames(className, DEFAULT_CLASSES.img),
                children: children.length ? children : [{ text: "" }],
            };
        case "ul":
            return {
                type: "bulleted-list",
                style: styleObj,
                className: mergeClassNames(className, DEFAULT_CLASSES.ul),
                children: children.length ? children : [{ text: "" }],
            };
        case "ol":
            return {
                type: "numbered-list",
                style: styleObj,
                className: mergeClassNames(className, DEFAULT_CLASSES.ol),
                children: children.length ? children : [{ text: "" }],
            };
        case "li":
            return {
                type: "list-item",
                style: styleObj,
                className,
                children: children.length ? children : [{ text: "" }],
            };
        case "strong":
        case "b": return children.map(child => ({ ...child, bold: true }));
        case "em":
        case "i": return children.map(child => ({ ...child, italic: true }));
        case "u": return children.map(child => ({ ...child, underline: true }));
        case "a":
            return {
                type: "link",
                url: el.getAttribute("href") || "",
                style: styleObj,
                className,
                target: el.getAttribute("target") || '_blank',
                children: children.length ? children : [{ text: "" }],
            };
        case "hr":
            return {
                type: "hr",
                style: styleObj,
                className: mergeClassNames(className, DEFAULT_CLASSES.hr),
                children: [{ text: "" }],
            };
        case "table": return [{ type: "table", className: mergeClassNames(className, DEFAULT_CLASSES.table), children: ensureText(children.filter((c: any) => c.type === "table-row")), }];
        case "tbody": return children;
        case "tr": return [{ type: "table-row", className: className, children: ensureText(children.filter((c: any) => c.type === "table-cell")), }];
        case "td": return [{ type: "table-cell", className: className, children: ensureText(children), }];
        case "div":
            if (classList.includes("grid")) {
                const cols = parseInt(classList.find((c) => c.startsWith("grid-cols-"))?.split("-")[2] || "12", 10);
                return {
                    type: "grid",
                    columns: cols,
                    style: styleObj,
                    className,
                    children: children.length ? children : [{ text: "" }],
                };
            }
            const colSpanClass = classList.find((c) => c.startsWith("col-span-"));
            if (colSpanClass) {
                const span = parseInt(colSpanClass.split("-")[2] || "12", 10);
                return {
                    type: "grid-column",
                    span,
                    style: styleObj,
                    className,
                    children: children.length ? children : [{ text: "" }],
                };
            }
            return {
                type: "division",
                style: styleObj,
                className,
                children: children.length ? children : [{ text: "" }],
            };
        default:
            return {
                type: "division",
                style: styleObj,
                className,
                children: children.length ? children : [{ text: "" }],
            };
    }
}

function parseStyle(styleString: string): Record<string, string> {
    return styleString
        .split(";")
        .filter(Boolean)
        .reduce((acc, rule) => {
            const [prop, value] = rule.split(":");
            if (prop && value) {
                const key = prop.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase()); // kebab-case to camelCase
                acc[key] = value.trim();
            }
            return acc;
        }, {} as Record<string, string>);
}