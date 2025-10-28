import React, {
    useEffect,
    useRef,
    useState,
    createContext,
    useContext,
} from "react";
import { Node, Path, Editor } from "slate";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

interface TableContextValue {
    editor: Editor & ReactEditor;
    isSelecting: boolean;
    startPath: Path | null;
    selectedPaths: Path[];
    setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
    setStartPath: React.Dispatch<React.SetStateAction<Path | null>>;
    setSelectedPaths: React.Dispatch<React.SetStateAction<Path[]>>;
    tableRef: React.RefObject<HTMLTableElement>;
}

interface TableElementProps extends RenderElementProps {
    element: any;
}
interface TableRowElementProps extends RenderElementProps {
    element: any;
}
interface TableCellElementProps extends RenderElementProps {
    element: any;
}

const TableContext = createContext<TableContextValue | null>(null);
const useTableContext = (): TableContextValue => {
    const ctx = useContext(TableContext);
    if (!ctx) {
        throw new Error("useTableContext must be used within <TableElement>");
    }
    return ctx;
};

// ==================== TABLE ====================
export const TableElement: React.FC<TableElementProps> = ({
    attributes,
    children,
    element,
}) => {
    const editor = useSlateStatic();
    const tableRef = useRef<HTMLTableElement>(null);

    const [isSelecting, setIsSelecting] = useState(false);
    const [startPath, setStartPath] = useState<Path | null>(null);
    const [selectedPaths, setSelectedPaths] = useState<Path[]>([]);

    const contextValue: TableContextValue = {
        editor: editor as Editor & ReactEditor,
        isSelecting,
        startPath,
        selectedPaths,
        setIsSelecting,
        setStartPath,
        setSelectedPaths,
        tableRef,
    };

    const tableClassName =
        element.className ||
        "border-collapse border border-gray-400 my-2 w-full select-none";

    return (
        <TableContext.Provider value={contextValue}>
        <table {...attributes} ref={tableRef} className={tableClassName}>
            <tbody>{children}</tbody>
        </table>
        </TableContext.Provider>
    );
};

// ==================== ROW ====================
export const TableRowElement: React.FC<TableRowElementProps> = ({
    attributes,
    children,
}) => {
    return <tr {...attributes}>{children}</tr>;
};

// ==================== CELL ====================
export const TableCellElement: React.FC<TableCellElementProps> = ({
    attributes,
    children,
    element,
}) => {
  const {
    editor,
    isSelecting,
    setIsSelecting,
    startPath,
    setStartPath,
    setSelectedPaths,
    tableRef,
  } = useTableContext();

    const cellRef = useRef<HTMLTableCellElement>(null);
    const path = ReactEditor.findPath(editor, element);
    const hasDragged = useRef(false);

    // 🖱️ Mouse down → เตรียมเริ่มลาก (แต่ยังไม่เริ่ม selection)
    const handleMouseDown = (e: React.MouseEvent<HTMLTableCellElement>) => {
        // ตรวจสอบว่าเป็นปุ่มซ้ายเท่านั้น
        if (e.button !== 0) return;
        hasDragged.current = false;
        setStartPath(path);

        // ใช้ setTimeout เพื่อเลื่อนเวลานิดนึง (ป้องกัน conflict กับ Slate focus)
        document.addEventListener("mousemove", handleDragStart);
        document.addEventListener("mouseup", handleMouseUpOnce);
    };

    const handleDragStart = (e: MouseEvent) => {
        if (!startPath || isSelecting) return;

        hasDragged.current = true;
        setIsSelecting(true);
        setSelectedPaths([startPath]);
    };

  // 📡 Global event สำหรับลาก
    useEffect(() => {
        if (!isSelecting || !tableRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target || !startPath) return;

        // ✅ หา closest <td data-slate-node="element">
        const cell = target.closest("td[data-slate-node='element']");
        if (!cell) return;

        const pathAttr = cell.getAttribute("data-path");
        if (!pathAttr) return;

        try {
            const endPath: Path = JSON.parse(pathAttr);
            const range = getTableCellRange(editor, startPath, endPath);
            setSelectedPaths(range);
        } catch (err) {
            console.warn("ไม่สามารถ parse path ได้:", err);
        }
        };

        const handleMouseUp = () => {
        setIsSelecting(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isSelecting, startPath, editor, tableRef]);

    // 📦 Mouse up ครั้งแรกหลังจากกด (ไม่ลาก)
    const handleMouseUpOnce = () => {
        document.removeEventListener("mousemove", handleDragStart);
        document.removeEventListener("mouseup", handleMouseUpOnce);
    };

    const className = element.className || `border border-gray-300 px-2 py-1`;

    return (
            <td
            {...attributes}
            ref={cellRef}
            data-path={JSON.stringify(path)}
            onMouseDown={handleMouseDown}
            className={className}
            >
            {children}
            </td>
    );
};


// ==================== HELPER ====================
function getTableCellRange(editor: Editor, startPath: Path, endPath: Path): Path[] {
    const [startRow, startCol] = startPath.slice(-2);
    const [endRow, endCol] = endPath.slice(-2);
    const tablePath = startPath.slice(0, -2);
    const tableNode = Node.get(editor, tablePath);

    if (!tableNode || !("children" in tableNode)) return [];

    const minR = Math.min(startRow, endRow);
    const maxR = Math.max(startRow, endRow);
    const minC = Math.min(startCol, endCol);
    const maxC = Math.max(startCol, endCol);

    const selectedPaths: Path[] = [];
    for (let r = minR; r <= maxR; r++) {
        const row = (tableNode as any).children[r];
        if (!row || !("children" in row)) continue;

        for (let c = minC; c <= maxC; c++) {
            if (row.children[c]) {
                selectedPaths.push([...tablePath, r, c]);
            }
        }
    }
    return selectedPaths;
}
