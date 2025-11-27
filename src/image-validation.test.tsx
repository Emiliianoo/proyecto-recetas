import { describe, it, expect } from "vitest";
import { validateImageFile } from "./validation/imageValidation";

describe("Image Validation", () => {
  describe("Valid Formats", () => {
    it.each([
      ["JPEG", "photo.jpg", "image/jpeg"],
      ["PNG", "image.png", "image/png"],
      ["GIF", "animation.gif", "image/gif"],
      ["TIFF", "scan.tiff", "image/tiff"],
    ])("Should accept %s format", (_, name, type) => {
      const file = new File(["content"], name, { type });
      expect(validateImageFile(file).ok).toBe(true);
    });

    it.each([
      ["RAW", "photo.raw"],
      ["NEF", "photo.nef"],
      ["CR2", "photo.cr2"],
      ["ARW", "photo.arw"],
      ["DNG", "photo.dng"],
    ])("Should accept %s format", (_, name) => {
      const file = new File(["content"], name, {
        type: "application/octet-stream",
      });
      expect(validateImageFile(file).ok).toBe(true);
    });

    it("Should be case-insensitive for extensions", () => {
      const file = new File(["content"], "photo.RAW", {
        type: "application/octet-stream",
      });
      expect(validateImageFile(file).ok).toBe(true);
    });
  });

  describe("Invalid Formats", () => {
    it.each([
      ["PDF", "document.pdf", "application/pdf"],
      ["SVG", "image.svg", "image/svg+xml"],
      ["WEBP", "image.webp", "image/webp"],
      ["MP4", "video.mp4", "video/mp4"],
      ["TXT", "data.txt", "text/plain"],
    ])("Should reject %s format", (_, name, type) => {
      const file = new File(["content"], name, { type });
      const result = validateImageFile(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("Formato no soportado");
    });
  });

  describe("Valid Size (≤ 5 MB)", () => {
    it.each([
      ["1 KB", 1024],
      ["1 MB", 1024 * 1024],
      ["5 MB", 5 * 1024 * 1024],
      ["4.9 MB", Math.floor(4.9 * 1024 * 1024)],
    ])("Should accept file of %s", (_, size) => {
      const file = {
        name: "photo.jpg",
        type: "image/jpeg",
        size,
      } as unknown as File;
      expect(validateImageFile(file).ok).toBe(true);
    });
  });

  describe("Invalid Size (> 5 MB)", () => {
    it.each([
      ["5.1 MB", 5 * 1024 * 1024 + 100000],
      ["10 MB", 10 * 1024 * 1024],
      ["100 MB", 100 * 1024 * 1024],
    ])("Should reject file of %s", (_, size) => {
      const file = {
        name: "photo.jpg",
        type: "image/jpeg",
        size,
      } as unknown as File;
      const result = validateImageFile(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("excede el tamaño máximo de 5 MB");
    });
  });

  describe("Combined Validation (Format + Size)", () => {
    it("Should reject invalid format even if size exceeds limit", () => {
      const file = {
        name: "document.pdf",
        type: "application/pdf",
        size: 6 * 1024 * 1024,
      } as unknown as File;
      const result = validateImageFile(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("Formato no soportado");
    });

    it("Should reject valid format but oversized", () => {
      const file = {
        name: "photo.jpg",
        type: "image/jpeg",
        size: 10 * 1024 * 1024,
      } as unknown as File;
      const result = validateImageFile(file);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("excede el tamaño máximo");
    });

    it("Should accept valid format and correct size", () => {
      const file = {
        name: "photo.jpg",
        type: "image/jpeg",
        size: 2 * 1024 * 1024,
      } as unknown as File;
      expect(validateImageFile(file).ok).toBe(true);
    });
  });

  describe("File Names and Case Sensitivity", () => {
    it("Should accept names with spaces", () => {
      const file = new File(["content"], "my photo.jpg", {
        type: "image/jpeg",
      });
      expect(validateImageFile(file).ok).toBe(true);
    });

    it("Should handle special characters in names", () => {
      const file = new File(["content"], "photo-2025_01-01.jpg", {
        type: "image/jpeg",
      });
      expect(validateImageFile(file).ok).toBe(true);
    });

    it("Should be case-insensitive for MIME type", () => {
      const file = new File(["content"], "photo.jpg", {
        type: "IMAGE/JPEG",
      });
      expect(validateImageFile(file).ok).toBe(true);
    });
  });
});
