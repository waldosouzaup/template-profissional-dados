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
  /** false = upload only (no "paste a URL" field). */
  allowUrl?: boolean;
}

export const ImageUpload = ({ value, onChange, label, path = "general", allowUrl = true }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useStorage();
  // Local blob only while a file is uploading; otherwise always show the saved value (it may arrive after mount).
  const [localPreview, setLocalPreview] = useState<string>();
  const preview = localPreview ?? value;
  // Remembers which URL failed so a new upload clears the warning by itself.
  const [failedSrc, setFailedSrc] = useState<string>();
  const isBroken = !!preview && failedSrc === preview;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    setLocalPreview(URL.createObjectURL(file));

    // Upload to Supabase
    const publicUrl = await uploadImage(file, "portfolio", path);
    if (publicUrl) onChange(publicUrl);
    setLocalPreview(undefined);
  };

  const clearImage = () => {
    setLocalPreview(undefined);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      
      <div className="flex flex-col gap-4">
        {preview ? (
          <div className="relative w-full h-40 group rounded-xl overflow-hidden border border-border bg-secondary/30">
            {isBroken ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Imagem não encontrada</p>
                <p className="text-xs text-muted-foreground">O endereço salvo não carrega. Envie outra imagem.</p>
              </div>
            ) : (
              <img 
                src={preview} 
                alt={label ?? "Pré-visualização da imagem"} 
                onError={() => setFailedSrc(preview)}
                className="w-full h-full object-contain"
              />
            )}
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
          {allowUrl && (
            <Input 
              type="text" 
              value={value || ""} 
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ou cole a URL da imagem aqui..."
              className="flex-1 text-xs"
            />
          )}
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
            className={allowUrl ? "whitespace-nowrap" : "w-full"}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {allowUrl ? "Mudar arquivo" : preview ? "Trocar imagem" : "Enviar imagem"}
          </Button>
        </div>
      </div>
    </div>
  );
};
