/**
 * Lógica centralizada de validación de imágenes
 * Usado por RecipeViewModal y sus tests
 */

export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5 MB
  ALLOWED_MIMES: ["image/jpeg", "image/png", "image/gif", "image/tiff"],
  RAW_EXTENSIONS: [".raw", ".nef", ".cr2", ".arw", ".dng"],
};

export interface ValidationResult {
  ok: boolean;
  reason?: string;
}

export function validateImageFile(file: File): ValidationResult {
  const mimeOK = IMAGE_CONFIG.ALLOWED_MIMES.includes(file.type.toLowerCase());
  const name = file.name.toLowerCase();
  const extOK = IMAGE_CONFIG.RAW_EXTENSIONS.some((ext) => name.endsWith(ext));

  if (!mimeOK && !extOK) {
    return {
      ok: false,
      reason:
        "Formato no soportado. Formatos permitidos: JPEG, PNG, GIF, TIFF, RAW.",
    };
  }

  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    return {
      ok: false,
      reason: "El archivo excede el tamaño máximo de 5 MB.",
    };
  }

  return { ok: true };
}
