/**
 * @platform/documents — Reusable document safety primitives.
 *
 * Adapted from mailmypdf-platform/packages/documents.
 * Documents are treated as untrusted input. This module defines security
 * validation, MIME checking, PDF safety, filename sanitization, and
 * content sanitization for AI prompt safety.
 */

import {
  type Result,
  ok,
  err,
  validateRange,
  ValidationError,
  SecurityError,
} from "./core";

// ── MIME Types ────────────────────────────────────────────────────────────────

export const ALLOWED_MIME_TYPES: readonly string[] = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/tiff",
  "text/plain",
] as const;

export const DANGEROUS_MIME_TYPES: readonly string[] = [
  "application/javascript",
  "text/javascript",
  "application/x-javascript",
  "application/x-executable",
  "application/x-msdos-program",
  "application/x-sh",
  "application/x-bat",
  "text/html",
] as const;

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

export function isDangerousMimeType(mimeType: string): boolean {
  return DANGEROUS_MIME_TYPES.includes(mimeType);
}

// ── PDF Security ──────────────────────────────────────────────────────────────

export const FORBIDDEN_PDF_TOKENS: readonly string[] = [
  "/JavaScript", "/JS", "/Launch", "/OpenAction", "/RichMedia",
  "/EmbeddedFile", "/EmbeddedFiles", "/SubmitForm", "/ImportData", "/GoToE",
] as const;

export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_TEXT_BYTES = 1024 * 1024; // 1 MB
export const MAX_PAGES = 20;
export const MAX_FILENAME_LENGTH = 255;

// ── Filename Sanitization ────────────────────────────────────────────────────

const PATH_TRAVERSAL_TEST_PATTERNS: readonly RegExp[] = [
  /\.\./,           // parent directory
  /\.\//,           // relative path
  /\\/,              // backslash
  /^\//,             // absolute path
  /\x00/,            // null byte
  /\//,              // any forward slash
] as const;

const PATH_TRAVERSAL_REPLACE_PATTERNS: readonly RegExp[] = [
  /\.\./g,          // parent directory
  /\.\//g,           // relative path
  /\\/g,            // backslash
  /^\//g,            // leading absolute path
  /\x00/g,           // null byte
  /\//g,             // all forward slashes
] as const;

export function sanitizeFilename(filename: string): string {
  let sanitized = filename.trim();
  for (const pattern of PATH_TRAVERSAL_REPLACE_PATTERNS) {
    sanitized = sanitized.replace(pattern, "_");
  }
  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1f\x7f]/g, "");
  // Collapse multiple underscores
  sanitized = sanitized.replace(/_+/g, "_");
  // Limit length
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    const ext = sanitized.lastIndexOf(".");
    if (ext > 0) {
      sanitized = sanitized.slice(0, MAX_FILENAME_LENGTH - (sanitized.length - ext)) + sanitized.slice(ext);
    } else {
      sanitized = sanitized.slice(0, MAX_FILENAME_LENGTH);
    }
  }
  return sanitized;
}

export function isSafeFilename(filename: string): boolean {
  for (const pattern of PATH_TRAVERSAL_TEST_PATTERNS) {
    if (pattern.test(filename)) return false;
  }
  if (/[\x00-\x1f\x7f]/.test(filename)) return false;
  return true;
}

// ── URL Validation (SSRF prevention) ─────────────────────────────────────────

const SSRF_BLOCKED_HOSTS = [
  "localhost", "127.0.0.1", "0.0.0.0", "[::1]", "[::]",
  "169.254.", // link-local
  "10.", "172.16.", "172.17.", "172.18.", "172.19.",
  "172.20.", "172.21.", "172.22.", "172.23.", "172.24.",
  "172.25.", "172.26.", "172.27.", "172.28.", "172.29.",
  "172.30.", "172.31.", "192.168.", // private ranges
  "127.", "0.0.0.0", // loopback range
] as const;

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    for (const blocked of SSRF_BLOCKED_HOSTS) {
      if (host === blocked || host.startsWith(blocked)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ── Content Sanitization (prompt injection defense) ────────────────────────────

export function sanitizeExtractedText(text: string): { text: string; warnings: string[] } {
  const warnings: string[] = [];

  if (/ignore (previous |above )?instructions?/i.test(text)) {
    warnings.push("Potential prompt injection: 'ignore instructions' pattern detected");
  }
  if (/you are (now )?(a|an) /i.test(text)) {
    warnings.push("Potential prompt injection: role reassignment pattern detected");
  }
  if (/system\s*:/i.test(text)) {
    warnings.push("Potential prompt injection: 'system:' prefix detected");
  }
  if (/\[INST\]|\[\/INST\]/i.test(text)) {
    warnings.push("Potential prompt injection: instruction token detected");
  }

  const cleaned = text.replace(/\x00/g, "");

  return { text: cleaned, warnings };
}

// ── File Validation ────────────────────────────────────────────────────────────

export interface FileValidationInput {
  filename: string;
  mimeType: string;
  size: number;
  pageCount?: number;
}

export type FileValidationResult = Result<void, ValidationError | SecurityError>;

export function validateFile(input: FileValidationInput): FileValidationResult {
  const { filename, mimeType, size, pageCount } = input;

  // Filename safety
  if (!isSafeFilename(filename)) {
    return err(new SecurityError(`Unsafe filename: ${filename}`));
  }

  // MIME type safety
  if (isDangerousMimeType(mimeType)) {
    return err(new SecurityError(`Dangerous MIME type: ${mimeType}`));
  }
  if (!isAllowedMimeType(mimeType)) {
    return err(new ValidationError(`Unsupported file type: ${mimeType}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`));
  }

  // Size limits
  const isPdf = mimeType === "application/pdf";
  const isImage = mimeType === "image/png" || mimeType === "image/jpeg" || mimeType === "image/tiff";
  const maxBytes = isPdf ? MAX_PDF_BYTES : isImage ? MAX_IMAGE_BYTES : MAX_TEXT_BYTES;

  if (size > maxBytes) {
    return err(new ValidationError(
      `File too large: ${size} bytes. Maximum for ${mimeType}: ${maxBytes} bytes`,
      { size, maxBytes, mimeType },
    ));
  }

  // Page count limit
  if (pageCount !== undefined) {
    const pageCheck = validateRange(pageCount, "pageCount", 1, MAX_PAGES);
    if (!pageCheck.ok) return pageCheck;
  }

  return ok(undefined);
}

// ── PDF Token Scanner ──────────────────────────────────────────────────────────

export function scanPdfForDangerousTokens(pdfBytes: Uint8Array): string[] {
  const found: string[] = [];
  // Convert first 1MB to string for scanning (tokens appear in header/dictionary)
  const sample = pdfBytes.slice(0, Math.min(pdfBytes.length, 1024 * 1024));
  const text = new TextDecoder("latin1").decode(sample);

  for (const token of FORBIDDEN_PDF_TOKENS) {
    if (text.includes(token)) {
      found.push(token);
    }
  }

  return found;
}

// ── Source Reference ──────────────────────────────────────────────────────────

export interface SourceRef {
  readonly documentId: string;
  readonly documentName: string;
  readonly page?: number;
  readonly excerpt?: string;
  readonly offset?: number;
}

export function createSourceRef(input: {
  documentId: string;
  documentName: string;
  page?: number;
  excerpt?: string;
  offset?: number;
}): SourceRef {
  if (input.page !== undefined) {
    const pageCheck = validateRange(input.page, "page", 1, MAX_PAGES);
    if (!pageCheck.ok) throw pageCheck.error;
  }
  return {
    documentId: input.documentId,
    documentName: input.documentName,
    page: input.page,
    excerpt: input.excerpt,
    offset: input.offset,
  };
}
