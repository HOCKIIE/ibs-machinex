import { StringNullableChain } from "lodash";
import { Descendant, Text, BaseText } from "slate";
import { htmlToSlate, slateToHtml } from "slate-serializers";

export const deserialize = (html: string): Descendant[] => {
    try {
        // // return htmlToSlate(html, { 
        // //     elementTags: { div: () => ({ type: "division" }) },
        // //     textTags: { span: () => ({ type: "text" }) },
        // //     filterWhitespaceNodes: true 
        // // });
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(html, 'text/html');
        // const nodes = Array.from(doc.body.childNodes).map(deserializeElement);
        // return nodes;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.body;

        const nodes: Descendant[] = Array.from(body.childNodes)
            .map((node) => innerDeserialize(node))
            .flat()
            .filter(Boolean);
        console.log('Nodes >>> ',nodes)
        return nodes.length ? nodes : [{ type: "paragraph", children: [{ text: "" }] }];
    } catch (e) {
        return [{ type: "paragraph", children: [{ text: "" }] }];
    }
};

export const serialize = (nodes: any[]): string => {
    if (!Array.isArray(nodes)) {
        console.error("❌ nodes ไม่ใช่ array:", nodes);
        return "";
    }
    return nodes.map(serializeNode).join('');
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

function serializeNode(node: CustomText): string {

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
            return `<p class="mb-4" style="text-align: ${node.align || 'left'};">${children}</p>`;
        case 'bulleted-list':
            return `<ul class="${node.className || ''}">${children}</ul>`;
        case 'numbered-list': 
            return `<ol class="${node.className || ''}">${children}</ol>`;
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
            return `<div>${children}</div>`;
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
                className,
                children: children.length ? children : [{ text: "" }],
            };
        case "span":
            return {
                type: "span",
                style: styleObj,
                className,
                children: children.length ? children : [{ text: "" }],
            }
        case "img":
            return {
                type: "image",
                src: el.getAttribute("src") || "",
                alt: el.getAttribute("alt") || "",
                style: styleObj,
                className,
                children: [{ text: "" }],
            };
        case "ul":
            return {
                type: "bulleted-list",
                style: styleObj,
                className,
                children: children.length ? children : [{ text: "" }],
            };
        case "ol":
            return {
                type: "numbered-list",
                style: styleObj,
                className,
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
            // return children.map((child) => applyMark(child, "bold"));

        case "em":
        case "i":
            return children.map(child => ({ ...child, italic: true }));
            // return children.map((child) => applyMark(child, "italic"));

        case "u":
            return children.map(child => ({ ...child, underline: true }));
            // return children.map((child) => applyMark(child, "underline"));

        case "div":
            if (classList.includes("grid")) {
                const cols = parseInt(
                    classList.find((c) => c.startsWith("grid-cols-"))?.split("-")[2] || "12", 10);
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
function applyMark(child: Descendant, mark: "bold" | "italic" | "underline"): Descendant {
    if (!("text" in child)) return child;
    return {
        ...child,
        [mark]: true,
    };
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