"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate } from '@/utils/formatDate'

interface DatePickerProps {
  date: string
  setDate: (date: string) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          <span>{formatDate(date)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          // 선택된 날짜가 기본 선택 및 포커스 될 수 있도록 selected와 defaultMonth를 설정합니다.
          selected={new Date(date)}
          defaultMonth={new Date(date)}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              // 선택된 날짜의 시간 부분을 0으로 설정하여 정확한 날짜(00:00:00)로 만듭니다.
              const adjustedDate = new Date(selectedDate)
              adjustedDate.setHours(0, 0, 0, 0)
              setDate(adjustedDate.toISOString())
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
