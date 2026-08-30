export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // 🚀 FIXED: 256x256 Size lock (Keeps base64 size around 15kb - NO UI Lag)
  const AVATAR_SIZE = 256;
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  // Circular Clip
  ctx.beginPath();
  ctx.arc(AVATAR_SIZE / 2, AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw scaled image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE
  );

  // Return Base64 directly - Completely bypasses Tauri asset/cache issues!
  return canvas.toDataURL('image/png');
}