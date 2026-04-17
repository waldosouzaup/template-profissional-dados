import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File, bucket = "portfolio", path = "uploads"): Promise<string | null> => {
    setIsUploading(true);
    try {
      // 1. Basic check
      if (!file.type.startsWith("image/")) {
        throw new Error("O arquivo selecionado não é uma imagem válida.");
      }

      // 2. Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
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
