"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X } from "lucide-react";

interface ProfileImageUploadProps {
  currentImage?: string; // Accepts an existing image URL
  onImageChange: (image: File | null) => void; // Callback for image update
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({currentImage}) => {
  const [image, setImage] = useState<string | null>(currentImage || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true, // Prevents file selection on click
  });

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps({ onClick: (e) => e.stopPropagation() })}
        className={`relative w-60 h-60 rounded-full border-2 flex items-center justify-center overflow-hidden cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600"
        }`}
      >
        <input {...getInputProps()} />
        {image ? (
          <>
            <Image src={image} alt="Profile" width={128} height={128} className="w-full h-full object-cover" />
            <button
              title="Reset"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-1 right-1 p-1 bg-gray-900 text-gray-200 rounded-full opacity-0 hover:opacity-100 transition"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">Click or drag to upload</p>
        )}
      </div>

      <button
        title="Choose Image"
        type="button"
        onClick={open}
        className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
      >
        Choose Image
      </button>
    </div>
  );
};

export default ProfileImageUpload;
