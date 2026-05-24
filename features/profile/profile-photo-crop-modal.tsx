"use client"

import Cropper from "react-easy-crop"
import type { Area, Point } from "react-easy-crop"
import { useState } from "react"

import { createCroppedAvatarFile } from "@/features/profile/profile-photo-utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type ProfilePhotoCropModalProps = {
  imageSource: string | null
  fileName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyCrop: (file: File) => void
  onError: (message: string) => void
}

export function ProfilePhotoCropModal({
  imageSource,
  fileName,
  open,
  onOpenChange,
  onApplyCrop,
  onError,
}: ProfilePhotoCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  async function handleApplyCrop() {
    if (!imageSource || !croppedAreaPixels) {
      onError("Choose a crop area first.")
      return
    }

    setIsApplying(true)

    try {
      const croppedFile = await createCroppedAvatarFile(
        imageSource,
        croppedAreaPixels,
        fileName,
      )
      onApplyCrop(croppedFile)
      onOpenChange(false)
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not crop profile photo.")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Crop profile photo</DialogTitle>
          <DialogDescription>
            Drag to reposition · use the slider to zoom in or out · click Apply when ready.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="relative h-80 overflow-hidden rounded-md bg-black">
            {imageSource && (
              <Cropper
                image={imageSource}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Zoom</Label>
              <span className="text-xs text-muted-foreground">{zoom.toFixed(1)}×</span>
            </div>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0] ?? 1)}
            />
            <p className="text-xs text-muted-foreground">
              Pinch on mobile, or drag the slider here to zoom
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isApplying}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={isApplying} onClick={handleApplyCrop}>
            {isApplying ? "Applying..." : "Apply crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
