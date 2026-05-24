import { Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { SponsorshipCampaign } from "@/lib/types/sponsorship"
import { cn } from "@/lib/utils"
import {
  formatSponsorshipCurrency,
  formatSponsorshipDate,
  getSponsorshipStatusConfig,
} from "./sponsorship-utils"

type SponsorshipDetailsDialogProps = {
  campaign: SponsorshipCampaign
  onDelete: (id: string) => void
  onEdit: (campaign: SponsorshipCampaign) => void
}

export function SponsorshipDetailsDialog({ campaign, onDelete, onEdit }: SponsorshipDetailsDialogProps) {
  const status = getSponsorshipStatusConfig(campaign.status)

  return (
    <DialogContent className="sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle>{campaign.brandName}</DialogTitle>
        <DialogDescription>{campaign.campaignName}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-3 rounded-lg border border-border/60 p-4">
          <DetailRow label="Status">
            <Badge variant="outline" className={cn("font-medium", status.className)}>
              {status.label}
            </Badge>
          </DetailRow>
          <DetailRow label="Amount">{formatSponsorshipCurrency(campaign.amount)}</DetailRow>
          <DetailRow label="Posting Date">{formatSponsorshipDate(campaign.postingDate)}</DetailRow>
          <DetailRow label="Deliverables">
            <div className="flex flex-wrap gap-1">
              {campaign.deliverables.length > 0 ? (
                campaign.deliverables.map((deliverable) => (
                  <Badge key={deliverable} variant="secondary">
                    {deliverable}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None listed</span>
              )}
            </div>
          </DetailRow>
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">Notes</h3>
          <p className="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            {campaign.notes || "No notes yet."}
          </p>
        </div>
      </div>
      <DialogFooter className="gap-2 sm:justify-between">
        <Button variant="destructive" onClick={() => onDelete(campaign.id)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button onClick={() => onEdit(campaign)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

type DetailRowProps = {
  children: React.ReactNode
  label: string
}

function DetailRow({ children, label }: DetailRowProps) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr] sm:items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  )
}
