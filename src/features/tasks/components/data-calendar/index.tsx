import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";

import EventCard, { Event } from "./event-card";
import { ITaskPopulated } from "../../tasks.types";

import { Button } from "@/components/ui/button";
import { parseAsDate } from "@/lib/utils";

interface DataCalendarProps {
  data: ITaskPopulated[];
}

type NavActions = "PREV" | "NEXT" | "TODAY";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

export default function DataCalendar({ data }: DataCalendarProps) {
  const [value, setValue] = React.useState(
    data.length > 0 ? parseAsDate(data[0].dueDate) : new Date()
  );

  const events: Event[] = data.map((task) => ({
    title: task.name,
    start: parseAsDate(task.dueDate),
    end: parseAsDate(task.dueDate),
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    $id: task.$id,
  }));

  const handleNavigate = (action: NavActions) => {
    switch (action) {
      case "PREV":
        setValue(subMonths(value, 1));
        break;
      case "NEXT":
        setValue(addMonths(value, 1));
        break;
      case "TODAY":
        setValue(new Date());
        break;
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      max={maxDate}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEEE", culture) ?? "",
      }}
      className="h-full"
      components={{
        eventWrapper: ({ event }) => <EventCard event={event} />,
        toolbar: () => <Toolbar date={value} onNavigate={handleNavigate} />,
      }}
    />
  );
}

type ToolbarProps = {
  date: Date;
  onNavigate: (action: NavActions) => void;
};

function Toolbar(props: ToolbarProps) {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full justify-center lg:w-auto lg:justify-start">
      <Button
        size="icon"
        onClick={() => props.onNavigate("PREV")}
        variant="outline"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="w-full lg:w-auto shadow-sm flex items-center text-sm gap-x-1 border h-8 px-3 rounded-lg">
        <CalendarIcon className="size-4" />
        {format(props.date, "MMMM yyyy", { locale: enUS })}
      </div>
      <Button
        size="icon"
        onClick={() => props.onNavigate("NEXT")}
        variant="outline"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
