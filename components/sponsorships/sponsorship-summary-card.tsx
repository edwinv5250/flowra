import { Card, CardContent } from "@/components/ui/card"

type SponsorshipSummaryCardProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

export function SponsorshipSummaryCard({ icon: Icon, label, value }: SponsorshipSummaryCardProps) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
