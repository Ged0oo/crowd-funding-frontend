import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Input from "../../../shared/components/ui/Input";

type ForgotPasswordForm = { email: string };

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const { mutate: requestReset, isPending, isError, error } = useForgotPassword();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = (data) => {
    requestReset(data.email, {
      onSuccess: () => {
        // Pass purpose="reset" in state so the OTP page could potentially know what to do next
        navigate("/verify-otp", { state: { email: data.email, action: "reset_password" } });
      }
    });
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body">
      <nav className="bg-[#ffffff]/80 backdrop-blur-md w-full top-0 z-50 sticky shadow-sm p-6">
         <div className="text-2xl font-black text-[#006c49] text-center md:text-left">The Digital Oasis</div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <section className="relative z-10 w-full max-w-md">
          <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 shadow-sm border border-outline-variant/15 text-center">
            <div className="w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3 font-headline">
              Forgot Password
            </h1>
            <p className="text-secondary text-base mb-8 max-w-sm mx-auto">
              Enter your email address and we'll send you an OTP to quickly restore access to your account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
              <div>
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-on-surface focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
              </div>

              {isError && (
                 <p className="text-red-500 text-sm font-semibold text-center">
                   {(error as any)?.response?.data?.message || "Something went wrong. Please try again."}
                 </p>
              )}

              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isPending ? "Sending OTP..." : "Send Verification Code"}
                {!isPending && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>

              <div className="text-center mt-6">
                <button 
                  type="button" 
                  onClick={() => navigate("/authenticate")}
                  className="text-primary font-bold hover:underline text-sm flex items-center justify-center gap-1 mx-auto"
                >
                  <span className="material-symbols-outlined text-xs">arrow_back</span>
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
