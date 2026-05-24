"use client"

import * as React from "react"
import {
  Sparkles,
  FileText,
  MessageSquare,
  Lightbulb,
  Send,
  Copy,
  Check,
  RefreshCw,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const quickActions = [
  {
    id: "proposal",
    title: "Generate Proposal",
    description: "Create a professional sponsorship proposal",
    icon: FileText,
  },
  {
    id: "quotation",
    title: "Generate Quotation",
    description: "Create a pricing quotation for brands",
    icon: MessageSquare,
  },
  {
    id: "caption",
    title: "Generate Caption",
    description: "Create engaging captions for your content",
    icon: Sparkles,
  },
  {
    id: "ideas",
    title: "Content Ideas",
    description: "Get trending food content suggestions",
    icon: Lightbulb,
  },
]

const trendingIdeas = [
  {
    title: "Penang Street Food ASMR",
    description: "Create satisfying ASMR content featuring char koay teow sizzling sounds",
    engagement: "High",
    platform: "TikTok",
  },
  {
    title: "Hidden Gems Series",
    description: "Discover and feature lesser-known hawker stalls with amazing food",
    engagement: "Medium",
    platform: "Instagram",
  },
  {
    title: "Before & After Transformation",
    description: "Show empty plates vs finished dishes at popular restaurants",
    engagement: "High",
    platform: "Instagram",
  },
  {
    title: "Night Market Adventures",
    description: "Explore pasar malam food scenes across Malaysia",
    engagement: "High",
    platform: "TikTok",
  },
]

export function AIAssistant() {
  const [selectedAction, setSelectedAction] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedContent, setGeneratedContent] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [prompt, setPrompt] = React.useState("")

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    setSelectedAction(type)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const responses: Record<string, string> = {
      proposal: `# Sponsorship Proposal

## About @sarahlimeats

With over 125,000 engaged followers across Instagram and TikTok, I specialize in authentic Penang street food content that resonates with food lovers across Malaysia and Southeast Asia.

### Audience Demographics
- 68% Female, 32% Male
- Primary age group: 25-34 years
- Top locations: Kuala Lumpur, Penang, Johor Bahru
- Average engagement rate: 4.8%

### What I Offer
1. **Authentic Storytelling** - Every piece of content tells the story behind the food
2. **High Production Quality** - Professional photography and videography
3. **Multi-Platform Reach** - Instagram, TikTok, and Xiaohongshu presence
4. **Proven Results** - 2.5M+ views on top performing content

### Proposed Deliverables
- 3x Instagram Reels (15-60 seconds)
- 5x Instagram Stories with swipe-up links
- 1x Carousel Post with detailed review
- Cross-posting on TikTok

### Investment
Starting from RM 8,500 for the complete package.

Looking forward to creating amazing content together!`,
      
      quotation: `# Content Creation Quotation

**Client:** [Brand Name]
**Date:** ${new Date().toLocaleDateString('en-MY')}
**Valid Until:** ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-MY')}

---

## Service Packages

### Basic Package - RM 3,500
- 1x Instagram Reel
- 3x Instagram Stories
- 1 revision round

### Standard Package - RM 6,500
- 2x Instagram Reels
- 5x Instagram Stories
- 1x Carousel Post
- TikTok cross-post
- 2 revision rounds

### Premium Package - RM 12,000
- 3x Instagram Reels
- 8x Instagram Stories
- 2x Carousel Posts
- TikTok content
- Xiaohongshu adaptation
- Unlimited revisions
- Priority scheduling

---

## Add-ons
- Additional Reel: RM 1,500
- Story Takeover (24h): RM 2,000
- Professional Photography: RM 800/hour
- Rush delivery (48h): +30%

## Terms
- 50% deposit upon confirmation
- Balance due upon content delivery
- Content usage rights for 12 months`,

      caption: `Craving something that'll make your taste buds dance? 

This is THE char koay teow you need to try in Penang. Wok hei so intense you can taste the fire, prawns so fresh they practically jumped into the pan, and that perfect balance of smoky, sweet, and savory flavors...

Pro tip: Come between 5-6pm before the queue gets crazy! Trust me, your future self will thank you.

Where: Lorong Selamat, Georgetown
When: 4pm until sold out (usually by 7pm!)
Price: RM 8-12

Save this for your next Penang trip!

#PenangFood #CharKoayTeow #MalaysianFood #StreetFood #FoodieFinds #PenangStreetFood #AsianFood #FoodPorn #Foodstagram #MalaysiaFoodHunt`,

      ideas: "Generated content ideas displayed in the panel below.",
    }

    setGeneratedContent(responses[type] || "")
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCustomGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setSelectedAction("custom")
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setGeneratedContent(`Based on your prompt: "${prompt}"

Here are some content ideas tailored for Malaysian food creators:

1. **Story Hook**: Start with a close-up shot of the dish being prepared, then reveal the final presentation
2. **Caption Angle**: Focus on the heritage and history of the dish
3. **Hashtag Strategy**: Mix location-specific (#PenangFood) with broader reach (#AsianFoodLovers)
4. **Best Time to Post**: 12pm-1pm (lunch cravings) or 7pm-8pm (dinner time)

Would you like me to elaborate on any of these suggestions?`)
    setIsGenerating(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Generate proposals, quotations, captions, and content ideas with AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className={cn(
                  "border-border/50 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
                  selectedAction === action.id && "border-primary bg-primary/5"
                )}
                onClick={() => handleGenerate(action.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Prompt */}
          <Card className="border-border/50 shadow-sm mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Custom Request</CardTitle>
              <CardDescription>Ask AI anything about your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="e.g., Give me 5 creative reel ideas for showcasing Penang laksa..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleCustomGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Content */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Generated Content</CardTitle>
              <CardDescription>
                {selectedAction ? "AI-generated content based on your selection" : "Select an action to generate content"}
              </CardDescription>
            </div>
            {generatedContent && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => selectedAction && handleGenerate(selectedAction)}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground">Generating content...</p>
                <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
              </div>
            ) : generatedContent ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground bg-muted/30 p-4 rounded-lg overflow-auto max-h-[500px]">
                  {generatedContent}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Select a quick action or enter a custom prompt to generate content
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trending Content Ideas */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Trending Food Content Ideas
          </CardTitle>
          <CardDescription>Popular content formats that are performing well right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trendingIdeas.map((idea, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {idea.platform}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        idea.engagement === "High" 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-warning/10 text-warning border-warning/20"
                      )}
                    >
                      {idea.engagement} Potential
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">{idea.title}</h3>
                  <p className="text-xs text-muted-foreground">{idea.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
