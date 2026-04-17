import { useState, useRef } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  path?: string;
}

export const ImageUpload = ({ value, onChange, label, path = "general" }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useStorage();
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload to Supabase
    const publicUrl = await uploadImage(file, "portfolio", path);
    if (publicUrl) {
      onChange(publicUrl);
      setPreview(publicUrl);
    } else {
      setPreview(value); // revert on error
    }
  };

  const clearImage = () => {
    setPreview(undefined);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      
      <div className="flex flex-col gap-4">
        {preview ? (
          <div className="relative w-full h-40 group rounded-xl overflow-hidden border border-border bg-secondary/30">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={clearImage}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/30 transition-colors bg-secondary/10"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Clique para fazer upload</p>
              <p className="text-xs text-muted-foreground">PNG, JPG ou WebP até 5MB</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ou cole a URL da imagem aqui..."
            className="flex-1 text-xs"
          />
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="whitespace-nowrap"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Mudar arquivo
          </Button>
        </div>
      </div>
    </div>
  );
};
