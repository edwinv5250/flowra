"use client"

import * as React from "react"
import { Calendar, DollarSign, Plus, Search } from "lucide-react"

import { SponsorshipDetailsDialog } from "@/components/sponsorships/sponsorship-details-dialog"
import { SponsorshipFormDialog } from "@/components/sponsorships/sponsorship-form-dialog"
import { SponsorshipSummaryCard } from "@/components/sponsorships/sponsorship-summary-card"
import { SponsorshipTable } from "@/components/sponsorships/sponsorship-table"
import {
  createSponsorshipFromForm,
  emptySponsorshipFormValues,
  formatSponsorshipCurrency,
  sponsorshipStatusOptions,
  toSponsorshipFormValues,
} from "@/components/sponsorships/sponsorship-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockSponsorshipCampaigns } from "@/lib/mock-sponsorships"
import type {
  SponsorshipCampaign,
  SponsorshipFormValues,
  SponsorshipStatus,
} from "@/lib/types/sponsorship"

export function SponsorshipManagement() {
  // Local component state is intentional for the MVP.
  // It gives us the workflow shape before committing to Supabase tables or auth rules.
  const [campaigns, setCampaigns] = React.useState<SponsorshipCampaign[]>(mockSponsorshipCampaigns)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<SponsorshipStatus | "all">("all")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingCampaign, setEditingCampaign] = React.useState<SponsorshipCampaign | null>(null)
  const [viewingCampaign, setViewingCampaign] = React.useState<SponsorshipCampaign | null>(null)
  const [formValues, setFormValues] = React.useState<SponsorshipFormValues>(emptySponsorshipFormValues)
  const [formError, setFormError] = React.useState("")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      campaign.brandName.toLowerCase().includes(query) ||
      campaign.campaignName.toLowerCase().includes(query) ||
      campaign.deliverables.join(" ").toLowerCase().includes(query)
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalValue = campaigns.reduce((sum, campaign) => sum + campaign.amount, 0)
  const activeCount = campaigns.filter((campaign) => campaign.status === "active").length

  function openCreateForm() {
    setEditingCampaign(null)
    setFormValues(emptySponsorshipFormValues)
    setFormError("")
    setIsFormOpen(true)
  }

  function openEditForm(campaign: SponsorshipCampaign) {
    setEditingCampaign(campaign)
    setFormValues(toSponsorshipFormValues(campaign))
    setFormError("")
    setIsFormOpen(true)
  }

  function updateFormValue<K extends keyof SponsorshipFormValues>(key: K, value: SponsorshipFormValues[K]) {
    setFormValues((current) => ({ ...current, [key]: value }))
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formValues.brandName.trim() || !formValues.campaignName.trim() || !formValues.postingDate) {
      setFormError("Brand, campaign, and posting date are required.")
      return
    }

    if (!formValues.amount || Number(formValues.amount) <= 0) {
      setFormError("Amount must be greater than zero.")
      return
    }

    const nextCampaign = createSponsorshipFromForm(
      formValues,
      editingCampaign?.id ?? `sponsor-${Date.now()}`,
    )

    setCampaigns((current) => {
      if (!editingCampaign) {
        return [nextCampaign, ...current]
      }

      return current.map((campaign) =>
        campaign.id === editingCampaign.id ? nextCampaign : campaign,
      )
    })
    setIsFormOpen(false)
    setEditingCampaign(null)
    setFormValues(emptySponsorshipFormValues)
  }

  function deleteCampaign(id: string) {
    setCampaigns((current) => current.filter((campaign) => campaign.id !== id))
    setViewingCampaign((current) => (current?.id === id ? null : current))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sponsorship Management</h1>
          <p className="text-muted-foreground">
            Add, track, edit, and delete brand campaign records.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={openCreateForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Sponsorship
            </Button>
          </DialogTrigger>
          <SponsorshipFormDialog
            error={formError}
            isEditing={Boolean(editingCampaign)}
            values={formValues}
            onCancel={() => setIsFormOpen(false)}
            onChange={updateFormValue}
            onSubmit={handleFormSubmit}
          />
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SponsorshipSummaryCard icon={DollarSign} label="Total Pipeline" value={formatSponsorshipCurrency(totalValue)} />
        <SponsorshipSummaryCard icon={Calendar} label="Active Campaigns" value={String(activeCount)} />
        <SponsorshipSummaryCard icon={Plus} label="Total Campaigns" value={String(campaigns.length)} />
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Campaigns</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredCampaigns.length} sponsorship{filteredCampaigns.length === 1 ? "" : "s"} shown
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as SponsorshipStatus | "all")}
            >
              <SelectTrigger className="md:w-44">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {sponsorshipStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <SponsorshipTable
            campaigns={filteredCampaigns}
            onDelete={deleteCampaign}
            onEdit={openEditForm}
            onView={setViewingCampaign}
          />
        </CardContent>
      </Card>

      <Dialog open={Boolean(viewingCampaign)} onOpenChange={(open) => !open && setViewingCampaign(null)}>
        {viewingCampaign && (
          <SponsorshipDetailsDialog
            campaign={viewingCampaign}
            onDelete={deleteCampaign}
            onEdit={(campaign) => {
              setViewingCampaign(null)
              openEditForm(campaign)
            }}
          />
        )}
      </Dialog>
    </div>
  )
}
