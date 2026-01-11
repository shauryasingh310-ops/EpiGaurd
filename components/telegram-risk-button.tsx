"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type RiskPayload = {
  ok: boolean
  detectedAt?: string
  state?: string
  riskScore?: number
  overallRisk?: "Low" | "Medium" | "High" | "Critical" | string
  primaryThreat?: string
  environmentalFactors?: {
    temp: number
    humidity: number
    rain: boolean
    pm25: number
    aqiUS?: number | null
    waterQuality: "Good" | "Fair" | "Poor" | "Unknown"
  } | null
  preventions?: string[]
  telegram?: { botUsername: string | null; botUrl: string | null }
  error?: string
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function getRiskBadgeVariant(level: string | null | undefined): "default" | "secondary" | "destructive" | "outline" {
  const v = (level || "").toLowerCase()
  if (v === "critical" || v === "high") return "destructive"
  if (v === "medium") return "secondary"
  return "outline"
}

export function TelegramRiskButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<RiskPayload | null>(null)

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const el = wrapperRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  const riskPercent = useMemo(() => {
    const v = clamp01(typeof data?.riskScore === "number" ? data.riskScore : 0)
    return Math.round(v * 100)
  }, [data?.riskScore])

  const fetchRisk = async () => {
    setLoading(true)
    setError(null)
    setData(null)

    if (!navigator.geolocation) {
      setLoading(false)
      setError("Location is not supported in this browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch("/api/location/risk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          })

          const payload = (await res.json().catch(() => null)) as RiskPayload | null

          if (!res.ok || !payload?.ok) {
            throw new Error(payload?.error || `Failed to detect risk (${res.status}).`)
          }

          setData(payload)
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to detect location risk")
        } finally {
          setLoading(false)
        }
      },
      (geoErr) => {
        setLoading(false)
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError("Location permission denied. Allow location access to auto-detect your state.")
          return
        }
        setError("Unable to fetch your location. Try again.")
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    )
  }

  const handleClick = () => {
    setOpen(true)
    void fetchRisk()
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="group relative">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shadow-sm ring-1 ring-primary/25"
          onClick={handleClick}
          aria-label="Telegram bot"
        >
          <Send className="h-4 w-4" />
        </Button>
        <div className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="rounded-md bg-foreground px-2 py-1 text-xs text-background shadow">
            Telegram bot
          </div>
        </div>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(360px,calc(100vw-24px))] z-50">
          <Card className="shadow-2xl ring-1 ring-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">Your Area Risk</CardTitle>
                  {data?.state ? (
                    <div className="mt-1 text-xs text-muted-foreground">Detected state: {data.state}</div>
                  ) : (
                    <div className="mt-1 text-xs text-muted-foreground">Auto-detecting your state…</div>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {loading && (
                <div className="text-sm text-muted-foreground">Detecting location and risk…</div>
              )}

              {!loading && error && (
                <div className="text-sm text-destructive">{error}</div>
              )}

              {!loading && !error && data?.ok && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">Risk score</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm tabular-nums">{riskPercent}%</div>
                      <Badge variant={getRiskBadgeVariant(data.overallRisk)}>{data.overallRisk || "Unknown"}</Badge>
                    </div>
                  </div>

                  {data.primaryThreat && (
                    <div className="text-xs text-muted-foreground">Primary threat: {data.primaryThreat}</div>
                  )}

                  {Array.isArray(data.preventions) && data.preventions.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Preventions</div>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {data.preventions.slice(0, 5).map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.telegram?.botUrl && (
                    <a
                      href={data.telegram.botUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Open Telegram bot
                    </a>
                  )}

                  {!data.telegram?.botUrl && (
                    <div className="text-xs text-muted-foreground">Telegram bot is not configured.</div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
