import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SponsorshipCampaign } from "@/lib/types/sponsorship"
import { cn } from "@/lib/utils"
import {
  formatSponsorshipCurrency,
  formatSponsorshipDate,
  getSponsorshipStatusConfig,
} from "./sponsorship-utils"

type SponsorshipTableProps = {
  campaigns: SponsorshipCampaign[]
  onDelete: (id: string) => void
  onEdit: (campaign: SponsorshipCampaign) => void
  onView: (campaign: SponsorshipCampaign) => void
}

export function SponsorshipTable({ campaigns, onDelete, onEdit, onView }: SponsorshipTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Brand</TableHead>
          <TableHead>Campaign</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Posting Date</TableHead>
          <TableHead>Deliverables</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <SponsorshipTableRow
            key={campaign.id}
            campaign={campaign}
            onDelete={onDelete}
            onEdit={onEdit}
            onView={onView}
          />
        ))}
        {campaigns.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
              No sponsorships match your filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

type SponsorshipTableRowProps = Omit<SponsorshipTableProps, "campaigns"> & {
  campaign: SponsorshipCampaign
}

function SponsorshipTableRow({ campaign, onDelete, onEdit, onView }: SponsorshipTableRowProps) {
  const status = getSponsorshipStatusConfig(campaign.status)

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium text-foreground">{campaign.brandName}</div>
      </TableCell>
      <TableCell className="max-w-[220px]">
        <div className="truncate text-muted-foreground">{campaign.campaignName}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("font-medium", status.className)}>
          {status.label}
        </Badge>
      </TableCell>
      <TableCell>{formatSponsorshipDate(campaign.postingDate)}</TableCell>
      <TableCell className="max-w-[280px]">
        <div className="flex flex-wrap gap-1">
          {campaign.deliverables.length > 0 ? (
            campaign.deliverables.map((deliverable) => (
              <Badge key={deliverable} variant="secondary" className="font-normal">
                {deliverable}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">None listed</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right font-medium">{formatSponsorshipCurrency(campaign.amount)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open campaign actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(campaign)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(campaign)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(campaign.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
