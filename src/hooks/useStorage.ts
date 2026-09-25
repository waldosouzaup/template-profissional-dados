import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { IMAGE_EXTENSIONS, imageUploadError } from "@/lib/image-upload";

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File, bucket = "portfolio", path = "uploads"): Promise<string | null> => {
    setIsUploading(true);
    try {
      // 1. Only the image types and size the bucket accepts
      const invalid = imageUploadError(file);
      if (invalid) throw new Error(invalid);

      // 2. Unguessable name; the extension follows the file type, not the name it was sent with
      const fileName = `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`;
      const filePath = `${path}/${fileName}`;

      // 3. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // 4. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast.success("Upload realizado com sucesso!");
      return publicUrl;
    } catch (error: any) {
      console.error("Storage Error:", error);
      toast.error(`Erro no upload: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};
