import { Descendant, Text } from "slate";
import { htmlToSlate, slateToHtml } from "slate-serializers";

export const deserialize = (html: string): Descendant[] => {
    try {
        // return htmlToSlate(html, { 
        //     elementTags: { div: () => ({ type: "division" }) },
        //     textTags: { span: () => ({ type: "text" }) },
        //     filterWhitespaceNodes: true 
        // });
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const nodes = Array.from(doc.body.childNodes).map(deserializeElement);
        return nodes;
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

function serializeNode(node: any): string {
    if (Text.isText(node)) {
        return node.text;
    }
    const children = node.children.map(serializeNode).join('');
    switch (node.type) {
        case 'paragraph':
            return `<p class="mb-3" style="text-align: ${node.align || 'left'};">${children}</p>`;
        case 'grid':
            return `<div class="grid grid-cols-${node.columns || 12} gap-4 mb-4">${children}</div>`;
        case 'grid-column':
            return `<div class="col-span-${node.span || 12} p-2">${children}</div>`;
        default:
            return `<div>${children}</div>`;
    }
}
function deserializeElement(node: ChildNode): Descendant | Descendant[] {
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
        .map(deserializeElement)
        .flat()
        .filter(Boolean);

    const styleObj = parseStyle(el.getAttribute("style") || "");
    const className = el.className || "";

    if (["span", "strong", "em", "u"].includes(nodeName)) {
        return children.map((child) => {
            if (!("text" in child)) return child;
            return {
                ...child,
                bold: nodeName === "strong" || styleObj.fontWeight === "bold" || child.bold,
                italic: nodeName === "em" || styleObj.fontStyle === "italic" || child.italic,
                underline: nodeName === "u" || styleObj.textDecoration === "underline" || child.underline,
                color: styleObj.color || child.color,
                style: {
                    ...child.style,
                    ...styleObj,
                },
            };
        });
    }

    switch (nodeName) {
        case "p":
            return {
                type: "paragraph",
                style: styleObj,
                className,
                children: children.length ? children : [{ text: "" }],
            };

        case "strong":
            return children.map((child) => applyMark(child, "bold"));

        case "em":
            return children.map((child) => applyMark(child, "italic"));

        case "u":
            return children.map((child) => applyMark(child, "underline"));

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