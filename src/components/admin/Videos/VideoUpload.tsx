"use client";

import { useState, DragEvent } from "react";

export default function VideoUpload({
    defaultVideoUrl,
}: {
    defaultVideoUrl?: string;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [oldVideo, setOldVideo] = useState<string | null>(defaultVideoUrl ?? null);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        setOldVideo(null); // ซ่อนวิดีโอเก่าเมื่อเลือกใหม่
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
        setOldVideo(null);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
        {/* Upload Box */}
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
        >
            {/* ---------- CASE 1: มีวิดีโอเก่า ---------- */}
            {oldVideo && !file && (
            <div className="w-full text-center">
                <p className="font-medium mb-3">วิดีโอปัจจุบัน</p>
                <video
                controls
                src={oldVideo}
                className="w-full rounded-lg"
                />

                <label className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                เปลี่ยนวิดีโอ
                <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleSelect}
                />
                </label>

                <button
                onClick={() => setOldVideo(null)}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                ลบวิดีโอเก่า
                </button>
            </div>
            )}

            {/* ---------- CASE 2: ยังไม่มีอะไร ---------- */}
            {!oldVideo && !file && (
            <>
                <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>

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

            {/* ---------- CASE 3: เลือกไฟล์ใหม่แล้ว ---------- */}
            {file && (
            <div className="w-full text-center">
                <p className="font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">
                {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <video
                controls
                src={URL.createObjectURL(file)}
                className="mt-4 w-full rounded-lg"
                />

                <button
                onClick={() => setFile(null)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                ลบไฟล์ใหม่
                </button>
            </div>
            )}
        </div>
        </div>
    );
}
