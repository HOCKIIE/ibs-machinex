"use client";

import { useState, DragEvent } from "react";
import { IoCloudUploadOutline,IoTrashOutline } from "react-icons/io5";
import { useIntroVideoStore } from "@/store/useIntroVideoStore";
import { VideoIntroProps } from "@/types/SettingType";


export default function VideoUpload({
    defaultVideoUrl,
    onSubmit
}: {
    defaultVideoUrl?: string | null;
    onSubmit: (data: VideoIntroProps) => Promise<void>;
}) {


    const prefix = process.env.NODE_ENV === "development" 
        ? process.env.NEXT_PUBLIC_API_URL_DEV 
        : process.env.NEXT_PUBLIC_API_URL_PROD;
    const { updateData, videoFile, setVideoFile } = useIntroVideoStore();

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setVideoFile(e.dataTransfer.files[0]);
        }
    };

    const handlerUpload = async() => 
    {
        if (!videoFile) return;
        const res = await updateData(videoFile);
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
            >
                {defaultVideoUrl && !videoFile && (
                    <div className="w-full text-center">
                        <p className="font-medium mb-3">วิดีโอปัจจุบัน</p>
                        <video
                            controls
                            src={`${prefix}${defaultVideoUrl}`}
                            className="w-full rounded-lg"
                        />
                        <div className="flex gap-4 items-center justify-center mt-4">
                            <div>
                                <label className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700">
                                เปลี่ยนวิดีโอ
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/quicktime"
                                    className="hidden"
                                    onChange={handleSelect}
                                />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                {!defaultVideoUrl && !videoFile && (
                <>
                    <div className="grid place-items-center">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" d="M12 8v8M8 12h8" />
                        </svg>
                    </div>

                    <p className="text-gray-500 mt-3">ลากวิดีโอมาวาง หรือคลิกเพื่อเลือกไฟล์</p>

                    <label className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                    เลือกไฟล์
                    <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={handleSelect}
                    />
                    </label>
                </>
                )}
                {videoFile && (
                <div className="w-full text-center">
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-gray-500 text-sm">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>

                    <video
                        controls
                        src={URL.createObjectURL(videoFile)}
                        className="mt-4 w-full rounded-lg"
                    />
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <button type="submit" onClick={handlerUpload} className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"><IoCloudUploadOutline/> อัพโหลด</button>
                        <button type="button" onClick={() => setVideoFile(null)} className="flex bg-red-500 items-center justify-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-red-600"><IoTrashOutline/>ลบไฟล์ใหม่</button>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
