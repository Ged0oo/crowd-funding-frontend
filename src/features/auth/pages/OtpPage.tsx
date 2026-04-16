import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOtp } from "../hooks/useOtp";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email || "";


  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {mutate: verifyOtpMutation, isPending, isError } = useOtp();

  const handleSubmit = (e: React.FocusEvent) => {
    e.preventDefault();
    const completeOtp = otp.join("");

    verifyOtpMutation(
      {email: userEmail, otp: completeOtp},
      {
        onSuccess: () => {
          navigate('/')
        }
      }
    )
  }

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body">
      
      {/* Navbar placeholder (Assuming you have a shared Layout component) */}
      <nav className="bg-[#ffffff]/80 backdrop-blur-md w-full top-0 z-50 sticky shadow-sm p-6">
         <div className="text-2xl font-black text-[#006c49] text-center md:text-left">The Digital Oasis</div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Verification Card */}
        <section className="relative z-10 w-full max-w-xl">
          <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-sm border border-outline-variant/15 text-center">
            
            <div className="w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-4 font-headline">
              Verify Your Account
            </h1>
            <p className="text-secondary text-base md:text-lg mb-10 max-w-md mx-auto">
              We've sent a 6-digit code to your email. Please enter it below to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">              
              {/* The 6 OTP Input Boxes */}
              <div className="flex justify-between gap-2 md:gap-4 max-w-sm mx-auto">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    // Assign the ref to our array
                    ref={(el) => (inputRefs.current[index] = el)} 
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-16 md:w-14 md:h-20 text-2xl md:text-3xl font-bold text-center bg-surface-container-low border border-outline-variant/30 rounded-xl text-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                ))}
              </div>

              {/* Buttons Area */}
              <div className="flex flex-col gap-6">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98]"
                >
                  Verify & Continue
                </button>

                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-secondary">
                    Didn't receive the code? 
                    <button type="button" className="text-primary font-bold hover:underline ml-1">Resend</button>
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-outline tracking-wider uppercase bg-surface-container-high px-3 py-1 rounded-full mt-2">
                    <span className="material-symbols-outlined text-xs">timer</span>
                    <span>Resend available in 02:00</span>
                  </div>
                </div>
              </div>
            </form>

          </div>
        </section>
      </main>
    </div>
  );
};

export default OtpPage;