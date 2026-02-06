import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { withErrorMessageInput, withLabelInput } from "../../HOCs";
import { CustomInputProps } from "./CustomInput";

const pad = (value: number) => value.toString().padStart(2, "0");

const formatDateValue = (date?: Date) => {
  if (!date || isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

const parseDateValue = (value?: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const displayDate = (value?: string) => {
  if (!value) return "";
  return value.replaceAll("-", ".");
};

const DatePickerBase = ({
  htmlFor,
  value,
  onChange,
  placeholder,
  min,
  max,
  disabled,
}: CustomInputProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => parseDateValue(String(value)), [value]);
  const minDate = useMemo(() => parseDateValue(min), [min]);
  const maxDate = useMemo(() => parseDateValue(max), [max]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date?: Date) => {
    if (!date) return;
    const nextValue = formatDateValue(date);
    if (onChange) {
      onChange({
        target: { id: htmlFor, value: nextValue },
      } as ChangeEvent<HTMLInputElement>);
    }
    setOpen(false);
  };

  const disabledDays = useMemo(() => {
    const ranges = [];
    if (minDate) ranges.push({ before: minDate });
    if (maxDate) ranges.push({ after: maxDate });
    return ranges;
  }, [minDate, maxDate]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm mx-auto">
      <button
        type="button"
        className="date-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        disabled={disabled}
      >
        <span
          className={
            value
              ? "text-[color:var(--text)]"
              : "text-[color:var(--muted)]"
          }
        >
          {value ? displayDate(String(value)) : placeholder || "날짜 선택"}
        </span>
        <span className="date-icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open ? (
        <div className="date-popover">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected ?? minDate ?? new Date()}
            disabled={disabledDays}
          />
        </div>
      ) : null}
    </div>
  );
};

export const CustomDatePicker = withLabelInput(
  withErrorMessageInput(DatePickerBase)
);
