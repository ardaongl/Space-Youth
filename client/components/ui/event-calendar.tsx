import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  date: Date;
  title: string;
  color?: string;
}

interface EventCalendarProps {
  events?: Event[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export function EventCalendar({ events = [], onDateSelect, selectedDate }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selected, setSelected] = React.useState<Date | undefined>(selectedDate);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push(prevMonthDay.getDate());
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return { days, startingDayOfWeek, daysInMonth };
  };

  const { days, startingDayOfWeek } = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const hasEvent = (day: number | null) => {
    if (!day) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number | null) => {
    if (!day || !selected) return false;
    return day === selected.getDate() &&
           currentDate.getMonth() === selected.getMonth() &&
           currentDate.getFullYear() === selected.getFullYear();
  };

  const handleDayClick = (day: number | null, isPrevMonth: boolean) => {
    if (!day) return;
    const date = isPrevMonth 
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelected(date);
    onDateSelect?.(date);
  };

  const getSelectedDateEvents = () => {
    if (!selected) return [];
    return events.filter(event =>
      event.date.getDate() === selected.getDate() &&
      event.date.getMonth() === selected.getMonth() &&
      event.date.getFullYear() === selected.getFullYear()
    );
  };

  return (
    <div className="w-full">
      {/* Calendar */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 p-6 text-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-light">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs font-semibold opacity-80">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isPrevMonth = index < startingDayOfWeek;
            const isCurrentDay = isToday(day);
            const isDaySelected = isSelected(day);
            const hasEventDot = hasEvent(day);

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day, isPrevMonth)}
                className={`
                  relative aspect-square rounded-lg flex items-center justify-center text-base font-normal
                  transition-all hover:bg-white/20
                  ${isPrevMonth ? 'opacity-50' : ''}
                  ${isCurrentDay && !isDaySelected ? 'ring-2 ring-white' : ''}
                  ${isDaySelected ? 'bg-white text-rose-500 font-semibold ring-2 ring-white' : ''}
                `}
              >
                {day}
                {hasEventDot && !isDaySelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events list for selected date */}
      {selected && getSelectedDateEvents().length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Events on {selected.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h3>
          <div className="space-y-2">
            {getSelectedDateEvents().map((event) => (
              <div 
                key={event.id}
                className="rounded-xl border bg-card p-3 text-sm hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${event.color || 'bg-primary'}`}></div>
                  <span className="font-medium">{event.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
