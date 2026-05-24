export function getProfileInitials(...values: Array<string | null | undefined>) {
  const value = values.find((item) => item?.trim())?.trim()

  if (!value) {
    return "F"
  }

  const withoutAt = value.replace(/^@+/, "")
  const nameParts = withoutAt
    .split(/\s+/)
    .filter(Boolean)

  if (nameParts.length >= 2) {
    return `${nameParts[0][0] ?? ""}${nameParts[1][0] ?? ""}`.toUpperCase()
  }

  const emailName = withoutAt.split("@")[0]
  return (emailName[0] ?? "F").toUpperCase()
}
