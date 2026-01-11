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
        className="h-10 w-10 shadow-sm ring-1 ring-primary/25"
        aria-label="Telegram bot"
      >
        <a href="/api/telegram/bot" target="_blank" rel="noreferrer">
          <Send className="h-4 w-4" />
        </a>
      </Button>

      <div className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="rounded-md bg-foreground px-2 py-1 text-xs text-background shadow">
          Telegram bot
        </div>
      </div>
    </div>
  )
}
