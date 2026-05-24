import type * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { SponsorshipFormValues, SponsorshipStatus } from "@/lib/types/sponsorship"
import { sponsorshipStatusOptions } from "./sponsorship-utils"

type SponsorshipFormDialogProps = {
  error: string
  isEditing: boolean
  values: SponsorshipFormValues
  onCancel: () => void
  onChange: <K extends keyof SponsorshipFormValues>(key: K, value: SponsorshipFormValues[K]) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function SponsorshipFormDialog({
  error,
  isEditing,
  values,
  onCancel,
  onChange,
  onSubmit,
}: SponsorshipFormDialogProps) {
  return (
    <DialogContent className="sm:max-w-[640px]">
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Sponsorship" : "Add New Sponsorship"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this campaign record." : "Create a new sponsorship campaign."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                value={values.brandName}
                onChange={(event) => onChange("brandName", event.target.value)}
                placeholder="e.g., Nasi Lemak Antarabangsa"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={values.campaignName}
                onChange={(event) => onChange("campaignName", event.target.value)}
                placeholder="e.g., Ramadan Feast Campaign"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                min="0"
                step="100"
                type="number"
                value={values.amount}
                onChange={(event) => onChange("amount", event.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) => onChange("status", value as SponsorshipStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {sponsorshipStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postingDate">Posting Date</Label>
              <Input
                id="postingDate"
                type="date"
                value={values.postingDate}
                onChange={(event) => onChange("postingDate", event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deliverables">Deliverables</Label>
            <Input
              id="deliverables"
              value={values.deliverables}
              onChange={(event) => onChange("deliverables", event.target.value)}
              placeholder="3 Reels, 5 Stories, 1 Post"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={values.notes}
              onChange={(event) => onChange("notes", event.target.value)}
              placeholder="Internal notes, client preferences, reminders..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isEditing ? "Save Changes" : "Create Sponsorship"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
