"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Calendar, Megaphone, Trophy, ChevronLeft, ChevronRight, Users } from 'lucide-react';
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}
function getDaysUntil(targetDate, currentDate) {
    return targetDate - currentDate;
}
export default function CalendarView({ events }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentDay] = useState(new Date().getDate());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthNames = [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień",
    ];
    const dayNames = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];
    const calendarEvents = useMemo(() => {
        console.log("[v0] Processing calendar events, total events:", events.length);
        console.log("[v0] Events with calendar enabled:", events.filter((e) => e.add_to_calendar && (e.calendar_date || e.calendar_end_date)));
        return events
            .filter((event) => event.add_to_calendar && (event.calendar_date || event.calendar_end_date) && event.status === "published")
            .map((event) => {
            const dateStr = event.calendar_date || event.calendar_end_date;
            if (!dateStr)
                return null;
            const date = new Date(dateStr);
            const endDate = event.calendar_end_date ? new Date(event.calendar_end_date) : undefined;
            if (date.getMonth() === month && date.getFullYear() === year) {
                let daysUntil = undefined;
                if (event.type === "konkursy" && endDate) {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                }
                let eventType = "aktualnosci";
                if (event.type === "ogloszenie")
                    eventType = "ogloszenia";
                else if (event.type === "konkurs")
                    eventType = "konkursy";
                else if (event.type === "rada-rodzicow")
                    eventType = "rada-rodzicow";
                console.log("[v0] Adding calendar event:", {
                    title: event.title,
                    type: event.type,
                    mappedType: eventType,
                    date: date.toISOString(),
                });
                return {
                    date: date.getDate(),
                    type: eventType,
                    title: event.title,
                    endDate: endDate?.getDate(),
                    articleId: event.id,
                    daysUntil: daysUntil,
                };
            }
            return null;
        })
            .filter(Boolean);
    }, [events, month, year]);
    // Generate calendar days
    const calendarDays = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }
    const getEventsForDay = (day) => {
        if (!day)
            return [];
        return calendarEvents.filter((event) => event.date === day);
    };
    const getEventIcon = (type) => {
        switch (type) {
            case "aktualnosci":
                return _jsx(Calendar, { className: "w-3 h-3" });
            case "ogloszenia":
                return _jsx(Megaphone, { className: "w-3 h-3" });
            case "konkursy":
                return _jsx(Trophy, { className: "w-3 h-3" });
            case "rada-rodzicow":
                return _jsx(Users, { className: "w-3 h-3" });
        }
    };
    const isUrgent = (event) => {
        if (!event.endDate)
            return false;
        const daysUntil = getDaysUntil(event.endDate, currentDay);
        return daysUntil <= 3 && daysUntil >= 0;
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white rounded-2xl p-8 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("h2", { className: "font-semibold text-2xl text-gray-900", children: [monthNames[month], " ", year] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setCurrentDate(new Date(year, month - 1)), className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", children: _jsx(ChevronLeft, { className: "w-5 h-5 text-gray-700" }) }), _jsx("button", { onClick: () => setCurrentDate(new Date()), className: "px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium", children: "Dzi\u015B" }), _jsx("button", { onClick: () => setCurrentDate(new Date(year, month + 1)), className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", children: _jsx(ChevronRight, { className: "w-5 h-5 text-gray-700" }) })] })] }), _jsxs("div", { className: "grid grid-cols-7 gap-1 bg-gray-50 p-2 rounded-xl", children: [dayNames.map((day) => (_jsx("div", { className: "text-center text-sm font-medium text-gray-600 py-2", children: day }, day))), calendarDays.map((day, index) => {
                            const dayEvents = getEventsForDay(day);
                            const hasUrgentEvent = dayEvents.some(isUrgent);
                            return (_jsx("div", { className: `min-h-[100px] p-2 rounded-lg transition-all ${day
                                    ? `bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md ${hasUrgentEvent ? "animate-pulse" : ""}`
                                    : "bg-transparent"}`, children: day && (_jsxs(_Fragment, { children: [_jsx("div", { className: `text-sm font-semibold mb-1 ${day === new Date().getDate() &&
                                                month === new Date().getMonth() &&
                                                year === new Date().getFullYear()
                                                ? "text-blue-600"
                                                : "text-gray-700"}`, children: day }), _jsx("div", { className: "space-y-1", children: dayEvents.map((event, eventIndex) => {
                                                const urgent = isUrgent(event);
                                                const daysUntil = event.endDate ? getDaysUntil(event.endDate, currentDay) : null;
                                                return (_jsxs("div", { className: `flex items-center gap-1 text-xs p-1 rounded cursor-pointer transition-all hover:scale-105 ${event.type === "aktualnosci"
                                                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                        : event.type === "ogloszenia"
                                                            ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                                            : event.type === "konkursy"
                                                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"} ${urgent ? "ring-2 ring-red-400 animate-pulse" : ""}`, title: event.title, children: [getEventIcon(event.type), _jsxs("span", { className: "truncate flex-1 text-[11px]", children: [event.title.slice(0, 12), "..."] }), event.type === "konkursy" && daysUntil !== null && daysUntil >= 0 && (_jsxs("span", { className: "text-[9px] font-bold whitespace-nowrap", children: [daysUntil, "d"] }))] }, eventIndex));
                                            }) })] })) }, index));
                        })] }), _jsxs("div", { className: "flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 rounded bg-blue-50 flex items-center justify-center border border-blue-200", children: _jsx(Calendar, { className: "w-3 h-3 text-blue-600" }) }), _jsx("span", { className: "text-sm text-gray-600", children: "Aktualno\u015Bci" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 rounded bg-purple-50 flex items-center justify-center border border-purple-200", children: _jsx(Megaphone, { className: "w-3 h-3 text-purple-600" }) }), _jsx("span", { className: "text-sm text-gray-600", children: "Og\u0142oszenia" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 rounded bg-amber-50 flex items-center justify-center border border-amber-200", children: _jsx(Trophy, { className: "w-3 h-3 text-amber-600" }) }), _jsx("span", { className: "text-sm text-gray-600", children: "Konkursy" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 rounded bg-gray-100 flex items-center justify-center border border-gray-300", children: _jsx(Users, { className: "w-3 h-3 text-gray-600" }) }), _jsx("span", { className: "text-sm text-gray-600", children: "Rada Rodzic\u00F3w" })] })] })] }) }));
}
