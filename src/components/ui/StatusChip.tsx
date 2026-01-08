import React from "react";
import { Chip } from "@mui/material";

export type RFIStatus =
  | 'requested'
  | 'in progress'
  | 'pending info'
  | 'responded'
  | 'closed'
  | 'overdue'
  | 'draft'
  | 'on hold'
  | 'cancelled';


const statusStyleMap: Record<RFIStatus, { bg: string; color: string }> = {
  requested:    { bg: '#d7e0ff', color: '#727275' }, // light blue bg, dark blue text
  'in progress':{ bg: '#fcedaf', color: '#727275' }, // light yellow bg, amber text
  'pending info':{ bg: '#fe9883', color: '#727275' }, // light purple bg, purple text
  responded:    { bg: '#dbffcc', color: '#727275' }, // light green bg, green text
  closed:       { bg: '#00bf63', color: '#fff' }, // grey bg, dark grey text
  overdue:      { bg: '#ff3131', color: '#fff' }, // light red bg, red text
  draft:        { bg: '#b8bbbd', color: '#fff' }, // light grey bg, grey text
  'on hold':    { bg: '#b8bbbd', color: '#fff' }, // light cyan bg, blue text
  cancelled:    { bg: '#727275', color: '#fff' }, // light orange bg, deep orange text
};

export interface StatusChipProps {
  status: RFIStatus | string;
}

export default function StatusChip({ status }: StatusChipProps) {
  const style = statusStyleMap[status as RFIStatus] || { bg: '#e0e0e0', color: '#424242' };
  return (
    <Chip
      label={status}
      size="small"
      variant="filled"
      sx={{
        textTransform: 'capitalize',
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: 400,
        letterSpacing: 0.5,
        minWidth: { md: 90 }
      }}
    />
  );
}
