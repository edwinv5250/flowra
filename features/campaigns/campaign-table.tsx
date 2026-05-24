"use client"

import { Edit, Trash2 } from "lucide-react"

import { deleteCampaign } from "@/features/campaigns/campaign-actions"
import {
  getCampaignStatusLabel,
  getPaymentStatusLabel,
} from "@/features/campaigns/campaign-options"
import type { Campaign } from "@/features/campaigns/campaign-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type CampaignTableProps = {
  campaigns: Campaign[]
  onEdit: (campaign: Campaign) => void
}

export function CampaignTable({ campaigns, onEdit }: CampaignTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-base font-medium">No campaigns yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first sponsorship campaign to start tracking deadlines and payments.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{campaign.campaign_title}</p>
                  <p className="text-sm text-muted-foreground">{campaign.brand_name}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{getCampaignStatusLabel(campaign.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getPaymentStatusLabel(campaign.payment_status)}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(campaign.due_date).toLocaleDateString("en-MY", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right font-medium">
                RM {Number(campaign.amount).toLocaleString("en-MY")}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(campaign)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit campaign</span>
                  </Button>
                  <form
                    action={deleteCampaign}
                    onSubmit={(event) => {
                      if (!window.confirm("Delete this campaign?")) {
                        event.preventDefault()
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={campaign.id} />
                    <Button type="submit" variant="ghost" size="icon-sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete campaign</span>
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
