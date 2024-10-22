// useImageFunctions.ts
export function useImageFunctions() {
  function applyWatermark(file: File, text: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx!.drawImage(img, 0, 0);

        // Set up the watermark text
        ctx!.font = `${canvas.width * 0.08}px Arial`; // Adjust font size based on image width
        ctx!.fillStyle = "rgba(255, 255, 255, 0.7)"; // Semi-transparent white
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";

        // Draw the watermark text in the center
        ctx!.fillText(text, canvas.width / 2, canvas.height / 2);

        canvas.toBlob(blob => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        }, file.type);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  function compressImage(
    file: File,
    maxPixels: number = 1280 * 720, // Default to 720p equivalent
    quality: number = 0.7
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");

          const { width, height } = img;
          const currentPixels = width * height;
          const scale = currentPixels > maxPixels ? Math.sqrt(maxPixels / currentPixels) : 1;

          canvas.width = Math.round(width * scale);
          canvas.height = Math.round(height * scale);

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            blob => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Canvas to Blob conversion failed"));
              }
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  return {
    applyWatermark,
    compressImage
  };
}
