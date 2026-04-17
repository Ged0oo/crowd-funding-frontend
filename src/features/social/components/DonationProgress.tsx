interface DonationProgressProps {
  current: number
  target: number
  percentage: number
}

export default function DonationProgress({ current, target, percentage }: DonationProgressProps) {
  const displayPct = Math.min(Math.max(percentage, 0), 100)

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-3xl font-black font-headline text-on-surface">
            {current.toLocaleString()}
          </span>
          <span className="text-secondary font-medium ml-1 text-sm">EGP</span>
        </div>
        <div className="text-right">
          <span className="text-primary font-bold text-lg">{percentage}%</span>
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
        <span>Goal: {target.toLocaleString()} EGP</span>
      </div>
    </div>
  )
}
