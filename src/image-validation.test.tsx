import { describe, it, expect } from "vitest";

/**
 * Pruebas unitarias para la validación de formatos y tamaños de imágenes
 *
 * Estas pruebas validan la lógica de validación que se implementa en RecipeViewModal
 */

describe("Image Validation Logic", () => {
  // Constantes de validación
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/tiff"];
  const rawExtensions = [".raw", ".nef", ".cr2", ".arw", ".dng"];

  // Función de validación similar a la del componente
  const validarArchivo = (file: File) => {
    const mimeOK = allowedMimes.includes(file.type.toLowerCase());
    const name = file.name.toLowerCase();
    const extOK = rawExtensions.some((ext) => name.endsWith(ext));

    if (!mimeOK && !extOK) {
      return {
        ok: false,
        reason:
          "Formato no soportado. Formatos permitidos: JPEG, PNG, GIF, TIFF, RAW.",
      } as const;
    }

    if (file.size > MAX_SIZE) {
      return {
        ok: false,
        reason: "El archivo excede el tamaño máximo de 5 MB.",
      } as const;
    }

    return { ok: true } as const;
  };

  // ===== PRUEBAS DE FORMATO VÁLIDO =====

  describe("Formatos Válidos", () => {
    it("Debe aceptar archivos JPEG", () => {
      const file = new File(["content"], "photo.jpg", {
        type: "image/jpeg",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos PNG", () => {
      const file = new File(["content"], "image.png", {
        type: "image/png",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos GIF", () => {
      const file = new File(["content"], "animation.gif", {
        type: "image/gif",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos TIFF", () => {
      const file = new File(["content"], "scan.tiff", {
        type: "image/tiff",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos RAW con extensión .raw", () => {
      const file = new File(["content"], "photo.raw", {
        type: "application/octet-stream",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos NEF (Nikon RAW)", () => {
      const file = new File(["content"], "photo.nef", {
        type: "application/octet-stream",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos CR2 (Canon RAW)", () => {
      const file = new File(["content"], "photo.cr2", {
        type: "application/octet-stream",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos ARW (Sony RAW)", () => {
      const file = new File(["content"], "photo.arw", {
        type: "application/octet-stream",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivos DNG (Adobe RAW)", () => {
      const file = new File(["content"], "photo.dng", {
        type: "application/octet-stream",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe ser case-insensitive para extensiones RAW", () => {
      const file = new File(["content"], "photo.RAW", {
        type: "application/octet-stream",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });
  });

  // ===== PRUEBAS DE FORMATO INVÁLIDO =====

  describe("Formatos Inválidos", () => {
    it("Debe rechazar archivos PDF", () => {
      const file = new File(["content"], "document.pdf", {
        type: "application/pdf",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("Formato no soportado");
    });

    it("Debe rechazar archivos DOC", () => {
      const file = new File(["content"], "document.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });

    it("Debe rechazar archivos SVG", () => {
      const file = new File(["content"], "image.svg", {
        type: "image/svg+xml",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });

    it("Debe rechazar archivos WEBP", () => {
      const file = new File(["content"], "image.webp", {
        type: "image/webp",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });

    it("Debe rechazar archivos de video (MP4)", () => {
      const file = new File(["content"], "video.mp4", {
        type: "video/mp4",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });

    it("Debe rechazar archivos de texto", () => {
      const file = new File(["content"], "data.txt", {
        type: "text/plain",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });

    it("Debe rechazar archivos sin tipo MIME especificado (si no tiene extensión RAW)", () => {
      const file = new File(["content"], "document", {
        type: "",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });
  });

  // ===== PRUEBAS DE TAMAÑO VÁLIDO =====

  describe("Tamaño Válido (≤ 5 MB)", () => {
    it("Debe aceptar archivo de 1 KB", () => {
      const file = {
        name: "small.jpg",
        type: "image/jpeg",
        size: 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivo de 1 MB", () => {
      const file = {
        name: "medium.jpg",
        type: "image/jpeg",
        size: 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivo de exactamente 5 MB", () => {
      const file = {
        name: "large.jpg",
        type: "image/jpeg",
        size: 5 * 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar archivo de 4.9 MB", () => {
      const size = Math.floor(4.9 * 1024 * 1024);
      const file = {
        name: "almost-max.jpg",
        type: "image/jpeg",
        size,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });
  });

  // ===== PRUEBAS DE TAMAÑO INVÁLIDO =====

  describe("Tamaño Inválido (> 5 MB)", () => {
    it("Debe rechazar archivo de 5.1 MB", () => {
      const file = {
        name: "oversized.jpg",
        type: "image/jpeg",
        size: 5 * 1024 * 1024 + 100000,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("excede el tamaño máximo de 5 MB");
    });

    it("Debe rechazar archivo de 10 MB", () => {
      const file = {
        name: "very-large.jpg",
        type: "image/jpeg",
        size: 10 * 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });

    it("Debe rechazar archivo de 100 MB", () => {
      const file = {
        name: "huge.jpg",
        type: "image/jpeg",
        size: 100 * 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
    });

    it("Debe mostrar mensaje específico para archivos que exceden tamaño", () => {
      const file = {
        name: "too-large.jpg",
        type: "image/jpeg",
        size: 6 * 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toMatch(/5 MB/);
    });
  });

  // ===== PRUEBAS COMBINADAS =====

  describe("Validación Combinada (Formato + Tamaño)", () => {
    it("Debe rechazar archivo inválido y grande", () => {
      const file = {
        name: "document.pdf",
        type: "application/pdf",
        size: 6 * 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
      // Debe rechazar primero por formato
      expect(result.reason).toContain("Formato no soportado");
    });

    it("Debe rechazar archivo válido pero muy grande", () => {
      const file = {
        name: "photo.jpg",
        type: "image/jpeg",
        size: 10 * 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("excede el tamaño máximo");
    });

    it("Debe aceptar archivo válido y de tamaño correcto", () => {
      const file = {
        name: "photo.jpg",
        type: "image/jpeg",
        size: 2 * 1024 * 1024,
      } as unknown as File;
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });
  });

  // ===== PRUEBAS DE NOMBRES DE ARCHIVO =====

  describe("Nombres de Archivo", () => {
    it("Debe aceptar nombres con espacios", () => {
      const file = new File(["content"], "my photo.jpg", {
        type: "image/jpeg",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar nombres con caracteres especiales", () => {
      const file = new File(["content"], "photo-2025_01-01.jpg", {
        type: "image/jpeg",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe ser case-insensitive para MIME type", () => {
      const file = new File(["content"], "photo.jpg", {
        type: "IMAGE/JPEG",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });

    it("Debe aceptar extensiones en mayúscula para archivos JPEG", () => {
      const file = new File(["content"], "photo.JPG", {
        type: "image/jpeg",
      });
      const result = validarArchivo(file);
      expect(result.ok).toBe(true);
    });
  });
});
