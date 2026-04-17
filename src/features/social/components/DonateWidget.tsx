import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDonate } from "../hooks/useDonate"
import { toast } from "sonner"
import Input from "../../../shared/components/ui/Input"
import Button from "../../../shared/components/ui/Button"
import Spinner from "../../../shared/components/ui/Spinner"

const donateSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Minimum donation is 1 EGP")
    .max(1000000, "Maximum donation reached"),
})

type DonateFormInputValues = z.input<typeof donateSchema>
type DonateFormValues = z.output<typeof donateSchema>

interface DonateWidgetProps {
  projectId: number
}

export default function DonateWidget({ projectId }: DonateWidgetProps) {
  const { donate, isDonating } = useDonate(projectId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DonateFormInputValues, unknown, DonateFormValues>({
    resolver: zodResolver(donateSchema),
    defaultValues: { amount: 10 },
  })

  const onSubmit = async (data: DonateFormValues) => {
    const amountToDonate = data.amount
    reset({ amount: 10 })
    
    try {
      await donate(amountToDonate)
      toast.success("Thank you for your contribution!")
    } catch {
      toast.error("Donation failed. Please try again.")
      reset({ amount: amountToDonate })
    }
  }

  return (
    <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 shadow-card">
      <h3 className="text-xl font-bold font-headline mb-4 text-on-surface">Support this project</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <Input
              {...register("amount")}
              type="number"
              placeholder="Amount"
              className={`pr-12 ${errors.amount ? 'border-error' : ''}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-secondary text-sm">
              EGP
            </span>
          </div>
          {errors.amount && (
            <p className="text-error text-xs mt-1 ml-1">{errors.amount.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isDonating}
          variant="primary"
          className="w-full !py-4"
        >
          {isDonating ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              Processing...
            </span>
          ) : (
            "Donate Now"
          )}
        </Button>
      </form>
      
      <p className="text-[10px] text-center text-on-surface-variant mt-4 px-4 uppercase font-bold tracking-tight opacity-70">
        Secure transaction powered by the community
      </p>
    </div>
  )
}