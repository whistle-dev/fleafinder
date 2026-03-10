const MAX_OUTPUT_DIMENSION = 2400;
const MAX_OUTPUT_PIXELS = 4_000_000;
const MIN_QUALITY = 0.45;
const QUALITY_STEP = 0.1;
const DIMENSION_STEP = 0.85;

function getOutputMimeType(inputMimeType: string) {
  if (inputMimeType === "image/png" || inputMimeType === "image/webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

function replaceFileExtension(name: string, extension: string) {
  return name.replace(/\.[^.]+$/, "") || "market-cover";
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to encode image."));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image."));
    };

    image.src = url;
  });
}

function drawImageToCanvas(image: HTMLImageElement, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is unavailable.");
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

export async function compressImageFile(file: File, maxBytes: number) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Unsupported file type.");
  }

  if (file.size <= maxBytes) {
    return {
      compressed: false,
      file,
    };
  }

  const image = await loadImage(file);
  const mimeType = getOutputMimeType(file.type);
  const extension = mimeType === "image/webp" ? "webp" : "jpg";
  const pixelScale = Math.min(
    1,
    MAX_OUTPUT_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
    Math.sqrt(MAX_OUTPUT_PIXELS / (image.naturalWidth * image.naturalHeight))
  );

  let width = Math.max(1, Math.round(image.naturalWidth * pixelScale));
  let height = Math.max(1, Math.round(image.naturalHeight * pixelScale));
  let quality = 0.82;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const canvas = drawImageToCanvas(image, width, height);
    const blob = await canvasToBlob(canvas, mimeType, quality);

    if (blob.size <= maxBytes) {
      return {
        compressed: true,
        file: new File([blob], `${replaceFileExtension(file.name, extension)}.${extension}`, {
          type: mimeType,
          lastModified: Date.now(),
        }),
      };
    }

    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
      continue;
    }

    width = Math.max(1, Math.round(width * DIMENSION_STEP));
    height = Math.max(1, Math.round(height * DIMENSION_STEP));
    quality = 0.82;
  }

  throw new Error("Unable to compress image within limit.");
}
