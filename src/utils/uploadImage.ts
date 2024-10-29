import cloudinary from '@/lib/cloudinary';

import { type UploadApiResponse, type UploadApiErrorResponse } from "cloudinary"

type UploadResponse = { success: true; result?: UploadApiResponse } | { success: false; error: UploadApiErrorResponse | unknown };

export const uploadImage = async (
    file: File | Blob
): Promise<UploadResponse> => {
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    try {
        const result = await cloudinary.uploader.upload(fileUri, {
            invalidate: true,
            resource_type: "auto",
            folder: "falcon-ai-assignment-images",
            use_filename: true,
        });
        return { success: true, result };
    } catch (error) {
        return { success: false, error };
    }
};
