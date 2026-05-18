"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { fetchInbound } from "@/api/inbound.api"
import { fetchOutbound } from "@/api/outbound.api"
import { IconLoader2 } from "@tabler/icons-react"

export const description = "An interactive area chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  inbound: {
    label: "Inbound",
    color: "var(--primary)",
  },
  outbound: {
    label: "Outbound",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<{ date: string; inbound: number; outbound: number }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [inbounds, outbounds] = await Promise.all([
          fetchInbound(),
          fetchOutbound()
        ])

        const grouped: Record<string, { inbound: number; outbound: number }> = {}

        inbounds?.forEach(ib => {
          const dateStr = ib.received_at ?? ib.created_at
          if (dateStr) {
            const date = new Date(dateStr).toISOString().split('T')[0]
            if (!grouped[date]) grouped[date] = { inbound: 0, outbound: 0 }
            const qty = ib.items?.reduce((sum, item) => sum + (item.qty_received ?? 0), 0) ?? 0
            grouped[date].inbound += qty
          }
        })

        outbounds?.forEach(ob => {
          const dateStr = ob.shipped_at ?? ob.created_at
          if (dateStr) {
            const date = new Date(dateStr).toISOString().split('T')[0]
            if (!grouped[date]) grouped[date] = { inbound: 0, outbound: 0 }
            const qty = ob.items?.reduce((sum, item) => sum + (item.qty_shipped ?? 0), 0) ?? 0
            grouped[date].outbound += qty
          }
        })

        const sortedData = Object.entries(grouped)
          .map(([date, counts]) => ({ date, ...counts }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setChartData(sortedData)
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date + 'T00:00:00')
    const referenceDate = new Date() // Use current date for real data
    referenceDate.setHours(0, 0, 0, 0)
    let daysToSubtract = 90
    if (timeRange === "1d") {
      daysToSubtract = 0
    } else if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card px-4">
      <CardHeader>
        <CardTitle>Tren Inbound vs Outbound</CardTitle>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="1d">Today</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="1y">Last 1 year</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1y" className="rounded-lg">
                Last 1 year
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="1d" className="rounded-lg">
                Today
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
            <IconLoader2 className="size-6 animate-spin mr-2" />
            Loading chart data...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
            No data available for the selected period.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillInbound" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-inbound)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-inbound)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillOutbound" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-outbound)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-outbound)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="inbound"
                type="natural"
                fill="url(#fillInbound)"
                stroke="var(--color-inbound)"
                stackId="a"
              />
              <Area
                dataKey="outbound"
                type="natural"
                fill="url(#fillOutbound)"
                stroke="var(--color-outbound)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
