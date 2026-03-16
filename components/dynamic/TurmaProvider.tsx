'use client';

import React, { createContext, useMemo, useState } from 'react';
import type {
  CourseDateWithInstructor,
  HeroBadge,
  ProgramDay,
  Instructor,
  LocationExtra,
} from '@/types/course';

// ─── Context value type ─────────────────────────────────
export interface TurmaContextValue {
  /** All course dates (any status) */
  allDates: CourseDateWithInstructor[];
  /** Only open dates (shown in dropdown) */
  openDates: CourseDateWithInstructor[];
  /** Currently selected course date */
  activeCourseDate: CourseDateWithInstructor | null;
  /** Index within openDates */
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  /** Labels for the turma dropdown */
  turmaLabels: string[];
  /** Active turma program days */
  programDays: ProgramDay[];
  /** Active turma instructors */
  instructors: Instructor[];
  /** Active turma location data */
  locationVenue: string;
  locationAddress: string;
  locationMapEmbed: string;
  locationExtra: LocationExtra[];
  /** Active turma ID (for forms) */
  courseDateId: string | undefined;
  /** Active turma folder PDF URL */
  folderPdfUrl: string | null;
  /** Hero badges with dynamic values replaced */
  heroBadges: HeroBadge[];
}

// ─── Context ────────────────────────────────────────────
export const TurmaContext = createContext<TurmaContextValue | null>(null);

// ─── Provider props ─────────────────────────────────────
interface TurmaProviderProps {
  dates: CourseDateWithInstructor[];
  heroBadges: HeroBadge[];
  children: React.ReactNode;
}

// ─── Helper: format date label ──────────────────────────
function formatDateLabel(d: CourseDateWithInstructor): string {
  return (
    d.label ||
    `${new Date(d.start_date).toLocaleDateString('pt-BR')} a ${new Date(d.end_date).toLocaleDateString('pt-BR')}`
  );
}

// ─── Provider component ─────────────────────────────────
export default function TurmaProvider({ dates, heroBadges, children }: TurmaProviderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const value = useMemo<TurmaContextValue>(() => {
    // Filter only open dates for the dropdown
    const openDates = dates.filter((d) => d.status === 'open');
    const turmaLabels = openDates.map(formatDateLabel);

    // Active course date based on selection
    const activeCourseDate = openDates[selectedIndex] || openDates[0] || dates[0] || null;

    // Derived data from active course date
    const programDays = activeCourseDate?.program_days || [];
    const instructors = activeCourseDate?.instructors || [];
    const locationVenue = activeCourseDate?.location_venue || '';
    const locationAddress = activeCourseDate?.location_address || '';
    const locationMapEmbed = activeCourseDate?.location_map_embed || '';
    const locationExtra = activeCourseDate?.location_extra || [];
    const courseDateId = activeCourseDate?.id;
    const folderPdfUrl = activeCourseDate?.folder_pdf_url || null;

    // Build dynamic hero badges:
    // - "dropdown" → turma selector (handled in Hero)
    // - "location_dynamic" → replaced with active turma's location_venue
    const dynamicBadges = heroBadges.map((badge) => {
      if (badge.value === 'location_dynamic') {
        // Derive city/state from location_venue
        const venueShort = activeCourseDate?.location_venue || badge.label;
        return { ...badge, value: venueShort };
      }
      return badge;
    });

    return {
      allDates: dates,
      openDates,
      activeCourseDate,
      selectedIndex,
      setSelectedIndex,
      turmaLabels,
      programDays,
      instructors,
      locationVenue,
      locationAddress,
      locationMapEmbed,
      locationExtra,
      courseDateId,
      folderPdfUrl,
      heroBadges: dynamicBadges,
    };
  }, [dates, heroBadges, selectedIndex]);

  return <TurmaContext.Provider value={value}>{children}</TurmaContext.Provider>;
}
