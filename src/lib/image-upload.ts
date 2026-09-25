// Images the admin can upload: the same types and size limit as the "portfolio" bucket (security_admin_rls.sql).
// No SVG, since it can carry scripts. The stored extension comes from the type, never from the file name.
export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_ACCEPT = Object.keys(IMAGE_EXTENSIONS).join(",");

// Why the file cannot be uploaded, or null when it can.
export const imageUploadError = (file: File) => {
  if (!IMAGE_EXTENSIONS[file.type]) return "Formato não suportado. Envie PNG, JPG, WebP, GIF, AVIF ou ICO.";
  if (file.size > MAX_IMAGE_BYTES) return "A imagem passa de 5 MB. Reduza o arquivo e envie de novo.";
  return null;
};
