import { Descendant, Text, BaseText } from "slate";
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
interface CustomText extends BaseText{
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    fontSize?: number;
    type:string;
    children: [];
    align: string;
    className: string;
    style:string;
    alt:string;
    columns:string;
    span:string
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
    ul: 'marker:text-gray-700 list-disc pl-5 space-y-1 text-gray-800 text-md',
    ol: 'marker:text-gray-700 list-decimal pl-5 space-y-1 text-gray-800 text-md',
    h1: 'text-black text-4xl',
    h2: 'text-black text-3xl',
    h3: 'text-black text-2xl',
    h4: 'text-black text-xl',
    h5: 'text-black text-lg',
    h6: 'text-black text-md',
    img: "object-cover w-full"
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
    switch (node.type) {
        case 'paragraph':
            return `<p class="${node.className}">${children}</p>`;
        case 'bulleted-list':
            return `<ul class="${node.className || DEFAULT_CLASSES.ul}">${children}</ul>`;
        case 'numbered-list': 
            return `<ol class="${node.className || DEFAULT_CLASSES.ol}">${children}</ol>`;
        case 'list-item':
            return `<li>${children}</li>`;
        case 'bold': 
            return `<strong>${children}</strong>`;
        case 'italic' :
            return `<em>${children}</em>`;
        case 'underline':
            return `<u>${children}</u>`;
        case 'image':
            return `<img src="${node.src || ""}" alt="${node.alt || ""}" class="${node.className || "max-w-full h-auto"}" style="${node.style ? Object.entries(node.style).map(([k,v]) => `${k}:${v}`).join(";") : ""}" />`;
        case 'grid':
            return `<div class="grid grid-cols-${node.columns || 12} gap-4 mb-4">${children}</div>`;
        case 'grid-column':
            return `<div class="col-span-${node.span || 12} p-2">${children}</div>`;
        default:
            return `<div class="${node.className || ''}">${children}</div>`;
    }
}
function innerDeserialize(node: ChildNode): Descendant | Descendant[]
{
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
    const className = el.className || "";

    

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
                className: [DEFAULT_CLASSES.p, className].filter(Boolean).join(" "),
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
        case "img":
            return {
                type: "image",
                src: el.getAttribute("src") || "",
                alt: el.getAttribute("alt") || "",
                style: styleObj,
                className: [DEFAULT_CLASSES.img, className].filter(Boolean).join(" "),
                children: [{ text: "" }],
            };
        case "ul":
            // console.log("UL deserialize:", "class=", className);
            return {
                type: "bulleted-list",
                style: styleObj,
                className: [DEFAULT_CLASSES.ul, className].filter(Boolean).join(" "),
                children: children.length ? children : [{ text: "" }],
            };
        case "ol":
            // console.log("OL deserialize:", "class=", className);
            return {
                type: "numbered-list",
                style: styleObj,
                className: [DEFAULT_CLASSES.ol, className].filter(Boolean).join(" "),
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
        case "b":
            return children.map(child => ({ ...child, bold: true }));
        case "em":
        case "i":
            return children.map(child => ({ ...child, italic: true }));
        case "u":
            return children.map(child => ({ ...child, underline: true }));
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