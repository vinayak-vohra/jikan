"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export default function DatePicker({
  placeholder = "Select Date",
  ...props
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
        //   size="lg"
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            !props.value && "text-muted-foreground",
            props.className
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {props.value ? (
            format(props.value, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={props.value}
          onSelect={(date) => props.onChange(date as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
