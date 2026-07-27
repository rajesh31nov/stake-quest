"use client";

import { useEffect } from "react";
import { useActivityStore } from "@/store/activity-store";
import { EventCategory } from "@/types/event";

export function useActivityFeed() {
  const { events, selectedCategory, isLoading, error, setCategory, fetchEvents } =
    useActivityStore();

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 12000); // Poll every 12 sec
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === "ALL") return true;
    return e.category === selectedCategory;
  });

  return {
    events: filteredEvents,
    rawEvents: events,
    selectedCategory,
    isLoading,
    error,
    setCategory,
    refreshEvents: fetchEvents,
  };
}
