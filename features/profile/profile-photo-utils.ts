import type { Area } from "react-easy-crop"

export const maxProfilePhotoSize = 2 * 1024 * 1024
export const allowedProfilePhotoTypes = ["image/jpeg", "image/png", "image/webp"]
export const croppedAvatarMimeType = "image/jpeg"

export function validateProfilePhotoFile(file: File) {
  if (!allowedProfilePhotoTypes.includes(file.type)) {
    return "Upload a JPG, PNG, or WebP image."
  }

  if (file.size > maxProfilePhotoSize) {
    return "Profile picture must be 2MB or smaller."
  }

  return ""
}

export function getCroppedAvatarFileName(originalName: string) {
  const trimmedName = originalName.trim()
  const dotIndex = trimmedName.lastIndexOf(".")
  const baseName = dotIndex > 0 ? trimmedName.slice(0, dotIndex) : trimmedName || "avatar"

  return `${baseName}-cropped.jpeg`
}

export async function createCroppedAvatarFile(
  imageSource: string,
  cropPixels: Area,
  originalFileName: string,
) {
  const image = await loadImage(imageSource)
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Could not prepare image crop.")
  }

  canvas.width = cropPixels.width
  canvas.height = cropPixels.height

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height,
  )

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, croppedAvatarMimeType, 0.9)
  })

  if (!blob) {
    throw new Error("Could not create cropped image.")
  }

  return new File([blob], getCroppedAvatarFileName(originalFileName), {
    type: croppedAvatarMimeType,
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", () => reject(new Error("Could not load image.")))
    image.src = src
  })
}
