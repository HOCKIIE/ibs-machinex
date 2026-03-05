import { RenderElementProps, useSelected, useFocused  } from 'slate-react';

const Image = ({
    attributes,
    children,
    element,
}: RenderElementProps & {
    element: {
        type: "image";
        url: string;
        alt?: string;
    };
}) => {
    const selected = useSelected();
    const focused = useFocused();
    const finalClassName = element.className + ` ${selected && focused ? 'ring-2 ring-blue-500' : ''}`;
    return (
    <div {...attributes}>
        <div contentEditable={false}>
            <img
                src={element.url}
                alt={element.alt}
                className={finalClassName}
            />
        </div>
        {children}
    </div>
    );
};

export default Image;