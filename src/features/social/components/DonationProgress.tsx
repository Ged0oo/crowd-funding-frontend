interface DonationProgressProps {
  current?: number | string | null;
  target?: number | string | null;
  percentage?: number | string | null;
  currentAmount?: number | string | null;
  totalTarget?: number | string | null;
  fundedPct?: number | string | null;
}

const toSafeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function DonationProgress({
  current,
  target,
  percentage,
  currentAmount,
  totalTarget,
  fundedPct,
}: DonationProgressProps) {
  // Support both legacy and current prop names.
  const safeCurrent = toSafeNumber(current ?? currentAmount);
  const safeTarget = toSafeNumber(target ?? totalTarget);
  const safePercentage = toSafeNumber(percentage ?? fundedPct);
  const displayPct = Math.min(Math.max(safePercentage, 0), 100);

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-3xl font-black font-headline text-on-surface">
            {safeCurrent.toLocaleString()}
          </span>
          <span className="text-secondary font-medium ml-1 text-sm">EGP</span>
        </div>
        <div className="text-right">
          <span className="text-primary font-bold text-lg">
            {safePercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${displayPct}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-secondary">
        <span>Raised</span>
        <span>Goal: {safeTarget.toLocaleString()} EGP</span>
      </div>
    </div>
  );
}
