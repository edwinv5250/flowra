import assert from "node:assert/strict"
import test from "node:test"

// Node's native TypeScript test runner needs the explicit extension here.
// @ts-expect-error TS5097
import { getCroppedAvatarFileName, validateProfilePhotoFile } from "./profile-photo-utils.ts"

test("validateProfilePhotoFile accepts JPG, PNG, and WebP files up to 2MB", () => {
  const validFile = new File(["avatar"], "avatar.png", { type: "image/png" })

  assert.equal(validateProfilePhotoFile(validFile), "")
})

test("validateProfilePhotoFile rejects unsupported image types", () => {
  const invalidFile = new File(["avatar"], "avatar.gif", { type: "image/gif" })

  assert.equal(validateProfilePhotoFile(invalidFile), "Upload a JPG, PNG, or WebP image.")
})

test("validateProfilePhotoFile rejects files larger than 2MB", () => {
  const oversizedFile = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "avatar.png", {
    type: "image/png",
  })

  assert.equal(validateProfilePhotoFile(oversizedFile), "Profile picture must be 2MB or smaller.")
})

test("getCroppedAvatarFileName keeps the original base name and uses jpeg extension", () => {
  assert.equal(getCroppedAvatarFileName("edwin.profile.png"), "edwin.profile-cropped.jpeg")
})
