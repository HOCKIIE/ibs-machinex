import { Descendant } from "slate";
import { htmlToSlate, slateToHtml } from "slate-serializers";

export const deserialize = (html: string): Descendant[] => {
    try {
        return htmlToSlate(html, { 
            elementTags: { div: () => ({ type: "division" }) },
            textTags: { span: () => ({ type: "text" }) },
            filterWhitespaceNodes: true 
        });
    } catch (e) {
        return [{ type: "paragraph", children: [{ text: "" }] }];
    }
};

export const serialize = (value: Descendant[]): string => {
    return slateToHtml(value);
};