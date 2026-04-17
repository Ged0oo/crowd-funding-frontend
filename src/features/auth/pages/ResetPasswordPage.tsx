import { useForm, type SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";
import Input from "../../../shared/components/ui/Input";

type ResetPasswordForm = { new_password: string; confirm_password: string };

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safe extraction of email and otp passed from OtpPage.tsx
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>();
  const { mutate: requestPasswordUpdate, isPending, isError, error } = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordForm> = (data) => {
    if (!email || !otp) {
      alert("Missing credentials! Please start the forgot password process over.");
      navigate("/forgot-password");
      return;
    }
    
    requestPasswordUpdate({ email, otp, new_password: data.new_password }, {
      onSuccess: () => {
        // Automatically throw them back to the login screen
        navigate("/authenticate");
      }
    });
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body">
      <nav className="bg-[#ffffff]/80 backdrop-blur-md w-full top-0 z-50 sticky shadow-sm p-6">
         <div className="text-2xl font-black text-[#006c49] text-center md:text-left">The Digital Oasis</div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <section className="relative z-10 w-full max-w-md">
          <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 shadow-sm border border-outline-variant/15 text-center">
            <div className="w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">password</span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3 font-headline">
              Create New Password
            </h1>
            <p className="text-secondary text-base mb-8 max-w-sm mx-auto">
              Your identity has been verified. Please enter your new password below.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
              <div>
                <Input 
                  type="password" 
                  placeholder="New password" 
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-on-surface focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  {...register("new_password", { 
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                  })}
                />
                {errors.new_password && <span className="text-red-500 text-xs mt-1 block">{errors.new_password.message}</span>}
              </div>

              <div>
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-on-surface focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  {...register("confirm_password", { 
                    required: "Please confirm your password",
                    validate: (val) => {
                      if (watch('new_password') != val) {
                        return "Your passwords do not match";
                      }
                    }
                  })}
                />
                {errors.confirm_password && <span className="text-red-500 text-xs mt-1 block">{errors.confirm_password.message}</span>}
              </div>

              {isError && (
                 <p className="text-red-500 text-sm font-semibold text-center mt-2">
                   {(error as any)?.response?.data?.error || "We couldn't reset your password. The OTP might be expired."}
                 </p>
              )}

              <button 
                type="submit"
                disabled={isPending}
                className="w-full mt-4 bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isPending ? "Updating Password..." : "Reset Password"}
                {!isPending && <span className="material-symbols-outlined text-sm">lock_reset</span>}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
