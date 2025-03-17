import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragEndEvent } from "@dnd-kit/core";

const GalleryDropzone = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  };


const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setFiles((prev) => {
            const oldIndex = prev.findIndex((file) => file.name === active.id);
            const newIndex = prev.findIndex((file) => file.name === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true
  });

  return (
    <div className="w-full mt-3">
        <div
            {...getRootProps((e: React.SyntheticEvent) => e.stopPropagation())}
            className={`border-2 border-dashed p-6 rounded-lg cursor-pointer flex flex-col items-center w-full min-h-[320px]
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600"}
            `}
        >
        <input {...getInputProps()} />
        {files.length < 1 &&
            <div className="m-0 text-center">
                <div className="mb-[22px] flex justify-center">
                    <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <svg className="fill-current" width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z" fill=""></path>
                        </svg>
                    </div>
                </div>
                <h4 className="text-theme-xl mb-3 font-semibold text-gray-800 dark:text-white/90">
                    Drag &amp; Drop File Here
                </h4>
                <span className="mx-auto mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                    Drag and drop your PNG, JPG, WebP, SVG images here or
                    browse
                </span>
                <span className="text-theme-sm text-brand-500 font-medium underline">
                    Browse File
                </span>
            </div>
        }
        {files.length > 0 && (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={files.map((file) => file.name)} strategy={verticalListSortingStrategy}>
                    <div className="mt-4 grid grid-cols-3 gap-3 w-full">
                    {files.map((file) => (
                        <SortableImage key={file.name} file={file} removeFile={removeFile} />
                    ))}
                    </div>
                </SortableContext>
            </DndContext>
        )}
        </div>

    </div>
  );
};

const SortableImage = ({ file, removeFile }: { file: File; removeFile: (file: File) => void }) =>
{
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.name });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group cursor-grab" onClick={(e)=> e.stopPropagation() } onDrag={(e)=>e.stopPropagation()}>
            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover rounded-lg shadow" />
            <div {...listeners} {...attributes} className="absolute top-1 left-1 bg-gray-600 p-1 rounded-full opacity-70">
                <GripVertical size={16} className="text-white" />
            </div>
            <button
                type="button"
                title="Remove file"
                onClick={() => removeFile(file)}
                className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default GalleryDropzone;

