"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"

import {
  createCampaign,
  updateCampaign,
} from "@/features/campaigns/campaign-actions"
import { CampaignForm } from "@/features/campaigns/campaign-form"
import { CampaignTable } from "@/features/campaigns/campaign-table"
import type { Campaign } from "@/features/campaigns/campaign-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type CampaignsPageProps = {
  campaigns: Campaign[]
}

export function CampaignsPage({ campaigns }: CampaignsPageProps) {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) return campaigns

    return campaigns.filter((campaign) => {
      return (
        campaign.brand_name.toLowerCase().includes(query) ||
        campaign.campaign_title.toLowerCase().includes(query) ||
        campaign.client_name?.toLowerCase().includes(query) ||
        campaign.client_email?.toLowerCase().includes(query) ||
        campaign.client_phone?.toLowerCase().includes(query) ||
        campaign.platform?.toLowerCase().includes(query) ||
        campaign.deliverables.toLowerCase().includes(query)
      )
    })
  }, [campaigns, searchQuery])

  function openCreateForm() {
    setEditingCampaign(null)
    setIsFormOpen(true)
  }

  function openEditForm(campaign: Campaign) {
    setEditingCampaign(campaign)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingCampaign(null)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sponsorships</h1>
          <p className="text-muted-foreground">
            Track brand campaigns, deliverables, due dates, and payment status.
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          New campaign
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base">Campaigns</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredCampaigns.length} of {campaigns.length} campaign
              {campaigns.length === 1 ? "" : "s"} shown
            </p>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search campaigns..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <CampaignTable campaigns={filteredCampaigns} onEdit={openEditForm} />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit campaign" : "Create campaign"}
            </DialogTitle>
            <DialogDescription>
              Keep the record simple: campaign, deliverables, deadline, and payment status.
            </DialogDescription>
          </DialogHeader>
          <CampaignForm
            key={editingCampaign?.id ?? "create"}
            action={editingCampaign ? updateCampaign : createCampaign}
            campaign={editingCampaign ?? undefined}
            onCancel={closeForm}
            onSuccess={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
