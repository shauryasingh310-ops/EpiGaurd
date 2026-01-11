"use client"

import React from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"

export function TelegramBotButton() {
  return (
    <div className="group relative">
      <Button
        asChild
        variant="outline"
        size="icon"
        className={
          "h-10 w-10 border-primary/40 bg-primary/10 text-primary " +
          "shadow-sm ring-1 ring-primary/35 " +
          "transition-all hover:bg-primary/15 hover:border-primary/60 " +
          "hover:shadow-[0_0_0_1px_rgba(99,102,241,0.25),0_0_24px_rgba(99,102,241,0.35)] " +
          "focus-visible:ring-primary/60"
        }
        aria-label="Telegram bot"
      >
        <a href="/api/telegram/bot" target="_blank" rel="noreferrer">
          <Send className="h-4 w-4" />
        </a>
      </Button>

      <div className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="rounded-md border border-border bg-card/95 px-2 py-1 text-xs text-foreground shadow-lg backdrop-blur">
          Telegram bot
        </div>
      </div>
    </div>
  )
}
