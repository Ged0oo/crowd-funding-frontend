import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
// import LoginForm from "../features/auth/components/LoginForm"; // Import this when you build it!

const AuthPage = () => {
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-8 overflow-x-hidden font-body">
      
      {/* Background Decoration */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed -bottom-48 -right-48 w-[32rem] h-[32rem] bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Auth Container */}
      <div className="w-full max-w-[1440px] md:min-h-[850px] flex flex-col md:flex-row overflow-hidden md:rounded-3xl shadow-2xl bg-surface-container-lowest z-10 relative">
        
        {/* --- LEFT SIDE: Branding & Visual --- */}
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-16 bg-primary overflow-hidden">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" 
            alt="Modern architectural structure" 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary-container/40"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-on-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">eco</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-on-primary font-headline">The Digital Oasis</span>
            </div>
          </div>
          
          <div className="relative z-10 max-w-md">
            <h1 className="text-5xl font-extrabold text-on-primary leading-tight mb-6 font-headline">Nurturing the future of Egyptian innovation.</h1>
            <p className="text-primary-fixed text-lg leading-relaxed opacity-90">Join a curated marketplace where architectural stability meets organic growth. Secure your seat in the oasis.</p>
          </div>
          
          <div className="relative z-10 flex gap-8">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-primary font-headline">12k+</span>
              <span className="text-sm uppercase tracking-widest text-primary-fixed/80 font-semibold">Active Investors</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-primary font-headline">EGP 2B+</span>
              <span className="text-sm uppercase tracking-widest text-primary-fixed/80 font-semibold">Capital Deployed</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Forms --- */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
          <div className="w-full max-w-md">
            
            {/* Toggle Navigation Tabs */}
            <div className="flex gap-8 mb-10 border-b border-outline-variant/20">
              <button 
                onClick={() => setActiveTab("login")}
                className={`pb-4 text-lg font-bold transition-all border-b-2 ${
                  activeTab === "login" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                Log In
              </button>
              <button 
                onClick={() => setActiveTab("register")}
                className={`pb-4 text-lg font-bold transition-all border-b-2 ${
                  activeTab === "register" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                Register
              </button>
            </div>

            {/* Dynamic Form Rendering */}
            <div className="w-full">
              {activeTab === "register" ? (
                // This is the custom React component we built in the previous steps!
                <RegisterForm /> 
              ) : (
                // You can swap this with a <LoginForm /> component later
                <div className="text-center text-secondary py-10">
                  Login form coming soon...
                </div>
              )}
            </div>

            {/* Social Auth Header */}
            <div className="mt-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="w-full border-t border-outline-variant/20"></div>
                <span className="absolute px-4 bg-surface-container-lowest text-sm text-outline font-medium">OR CONTINUE WITH</span>
              </div>
              
              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-sm font-semibold">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-all">
                  <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
                  </svg>
                  <span className="text-sm font-semibold">GitHub</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;