/*
import * as React from "react";

import {
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  type TooltipProps,
  type LegendProps,
  type LegendPayload
} from "recharts";

// ✅ Custom Tooltip Component
export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipProps<number, string> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }
>(
  (
    {
      active,
      payload,
      label,
      hideLabel,
      hideIndicator,
      indicator = "dot",
      nameKey,
      labelKey
    },
    ref
  ) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div ref={ref} className="p-2 bg-white shadow rounded">
        {!hideLabel && (
          <div className="font-bold mb-1">
            {labelKey ? payload[0]?.payload?.[labelKey] : label}
          </div>
        )}
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {!hideIndicator && (
              <span
                style={{
                  backgroundColor: item.color || "#000",
                  borderRadius: indicator === "dot" ? "50%" : "0",
                  width: 8,
                  height: 8,
                  display: "inline-block"
                }}
              />
            )}
            <span className="text-sm">
              {nameKey ? item.payload?.[nameKey] : item.name}:
            </span>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// ✅ Custom Legend Component
export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  Pick<LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
  }
>(({ payload, hideIcon, nameKey, ...props }, ref) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div ref={ref} {...props} className="flex gap-4 flex-wrap">
      {payload.map((item: LegendPayload, index) => (
        <div key={index} className="flex items-center gap-1">
          {!hideIcon && (
            <span
              style={{
                backgroundColor: item.color || "#000",
                borderRadius: "50%",
                width: 8,
                height: 8,
                display: "inline-block"
              }}
            />
          )}
          <span className="text-sm">
            {nameKey ? (item.payload as any)?.[nameKey] : item.value}
          </span>
        </div>
      ))}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

// ✅ Example Usage
export function ChartExample() {
  return (
    <>
      <RechartsTooltip content={<ChartTooltipContent />} />
      <RechartsLegend content={<ChartLegendContent payload={[]} verticalAlign="top" />} />
    </>
  );
}
*/