import React from 'react';
import Navbar from '../../../shared/components/layout/Navbar';
import { useMyProfile } from '../hooks/useMyProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { useForm } from 'react-hook-form';

const getInitials = (firstName: string, lastName: string, username: string) => {
  if (firstName && lastName) return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  if (firstName) return firstName.charAt(0).toUpperCase();
  if (username) return username.charAt(0).toUpperCase();
  return "U";
}

const parseProfilePicture = (url: string | undefined | null) => {
  if (!url) return undefined;
  if (url.includes('googleusercontent.com')) {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/(https:\/\/.+)/);
    if (match) return match[0];
  }
  return url;
};

const LoadingSkeleton = () => (
  <div className="bg-background text-on-surface font-body min-h-screen flex flex-col animate-pulse">
    <Navbar />
    <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto w-full flex-grow">
      <div className="h-48 bg-surface-container-high rounded-xl mb-12"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-2">
          <div className="h-14 bg-surface-container-high rounded-xl"></div>
          <div className="h-14 bg-surface-container-high rounded-xl"></div>
        </aside>
        <div className="lg:col-span-9 h-[500px] bg-surface-container-high rounded-xl"></div>
      </div>
    </main>
  </div>
);

const MyProfilePage = () => {
  const { data: profileResponse, isPending, isError } = useMyProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  
  // The backend might return { status: "success", data: { ...userfields } }
  const user = profileResponse?.data?.data || profileResponse?.data;
  
  const { register, handleSubmit } = useForm({
    values: user // Auto-populate form when data arrives
  });

  const onSubmit = async (data: any) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (isPending) return <LoadingSkeleton />;
  if (isError || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-error font-bold bg-error-container p-6 rounded-2xl">Failed to load profile. Please try logging in again.</p>
    </div>
  );

  const joinedMonthYear = new Date(user.date_joined).toLocaleDateString("en-US", { month: 'long', year: 'numeric' });

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto flex-grow w-full">
        
        {/* Profile Header exactly as per HTML structure */}
        <header className="relative mb-12 p-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
          
          <div className="relative group z-10 shrink-0">
            {user.profile_picture ? (
              <img 
                alt={`${user.first_name}'s Profile Picture`} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-md" 
                src={parseProfilePicture(user.profile_picture)} 
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md font-headline text-5xl font-black">
                {getInitials(user.first_name, user.last_name, user.username)}
              </div>
            )}
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-lg text-primary hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined">edit</span>
            </button>
          </div>
          
          <div className="flex-grow text-center md:text-left pb-2 z-10">
            <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
              {user.first_name ? `${user.first_name} ${user.last_name}` : `@${user.username}`}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-secondary">
              <span className="flex items-center gap-1 text-sm font-medium">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Joined {joinedMonthYear}
              </span>
              {user.is_active && (
                <span className="px-3 py-1 bg-primary-container/10 text-primary rounded-full text-xs font-bold tracking-wider uppercase">
                  Verified User
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation / Tabs */}
          <aside className="lg:col-span-3 space-y-2">
            <button className="w-full text-left px-6 py-4 rounded-xl bg-primary text-on-primary font-bold transition-all shadow-md flex items-center justify-between">
              <span>Edit Profile</span>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <button className="w-full text-left px-6 py-4 rounded-xl text-secondary hover:bg-surface-container-high transition-all flex items-center justify-between">
              <span>My Created Projects</span>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </button>
            <button className="w-full text-left px-6 py-4 rounded-xl text-secondary hover:bg-surface-container-high transition-all flex items-center justify-between">
              <span>My Donations</span>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </button>
          </aside>

          {/* Main Panel */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Section: Edit Profile Form */}
            <section className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-headline mb-1">Account Information</h2>
                <p className="text-secondary text-sm">Update your personal details and how others see you on the platform.</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 1st row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">First Name</label>
                    <input 
                      {...register('first_name')}
                      className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/10 rounded-xl p-4 text-on-surface outline-variant outline-1 outline" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">Last Name</label>
                    <input 
                      {...register('last_name')}
                      className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/10 rounded-xl p-4 text-on-surface outline-variant outline-1 outline" 
                      type="text" 
                    />
                  </div>
                </div>

                {/* 2nd row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">Email Address (Read Only)</label>
                    <input 
                      {...register('email')}
                      readOnly
                      className="w-full bg-surface-container-low/50 text-secondary cursor-not-allowed border-none rounded-xl p-4 outline-variant outline-1 outline" 
                      type="email" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">Phone Number</label>
                    <input 
                      {...register('phone_number')}
                      className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/10 rounded-xl p-4 text-on-surface outline-variant outline-1 outline" 
                      type="tel" 
                    />
                  </div>
                </div>

                {/* 3rd row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">Country</label>
                    <input 
                      {...register('country')}
                      className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/10 rounded-xl p-4 text-on-surface outline-variant outline-1 outline" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">Birthdate</label>
                    <input 
                      {...register('birthdate')}
                      className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/10 rounded-xl p-4 text-on-surface outline-variant outline-1 outline" 
                      type="date" 
                    />
                  </div>
                </div>

                {/* Last row */}
                <div className="space-y-2">
                  <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">Facebook URL</label>
                  <input 
                    {...register('facebook_profile')}
                    className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/10 rounded-xl p-4 text-on-surface outline-variant outline-1 outline" 
                    type="url" 
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    disabled={isUpdating}
                    className={`px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg transition-shadow active:scale-95 ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`} 
                    type="submit"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>

              {/* Dangerous Zone */}
              <div className="mt-16 pt-8 border-t border-surface-container">
                <h3 className="text-tertiary font-bold font-headline mb-4">Danger Zone</h3>
                <div className="p-6 bg-error-container/30 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="font-bold text-on-error-container">Delete Account</p>
                    <p className="text-xs text-on-error-container/80">This action is permanent and cannot be undone. All your project data will be lost.</p>
                  </div>
                  <button 
                    type="button" 
                    disabled={isDeleting}
                    onClick={() => {
                      if (window.confirm("Are you absolutely sure you want to permanently delete your account? This action cannot be undone.")) {
                        deleteAccount();
                      }
                    }}
                    className="shrink-0 px-6 py-2 bg-error text-on-error rounded-xl font-bold text-sm hover:bg-tertiary transition-colors disabled:opacity-70"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            </section>

            {/* Section: Project Cards (Visual Showcase as per original template) */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold font-headline">Recent Contributions</h2>
                <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer">
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project Card 1 */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-outline-variant/10">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      alt="The Green Hub" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBECLxqCftLiHgzUpeTwvJ2TuZC2puEEOjiThtmwl-Gd9DRnPow0ulTSQiCjRgw0bLNPPj575GWTFk9GAQ0wwgG9WL-0dnYAGEvCmsiy8dKS5CYLp2Huw6GIy94dYahp1swV7EZ0JrdsB_7DPKlcIjQnGMc2lvDEWewKaiTU8qn-vcAdAnplX7XA4JdlpCE7wgIlZfchUSnNnlFTbnRFx1zki4VmBPwKSyWhXJMoQKYys-oW2aN6Q0C-HA-a21W_x5IlggII1zf5bhu" 
                    />
                    <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold font-headline mb-1">The Giza Green Initiative</h3>
                      <p className="text-sm text-secondary line-clamp-2">Reclaiming urban spaces through sustainable vertical farming modules.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-primary">82% Funded</span>
                        <span className="text-secondary">7 Days Left</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Card 2 */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-outline-variant/10">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      alt="Solar Oasis" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG7ZnNJRskNwx7VqzKnrzjAmTF2UsvMDnB5jx0JcbN9Txd4Fa5mwylVgjnggSwT1uDxNYsQxSPNAcAfckacnQZf7qTFzMC7CzrXQETJu9uhSoXW_uCuaQ_FVSYBGmiXMQ40oy5GCOXc2CGf0rJk-PHAnjc887ZjwQLpk9qZg7-qSSBtvKb8Vau2yr_SVTiXMbb1iBFVrs5H63rM1aT-1rHHkFETkw4ckcTEYtH0piuNatX2d8TXXj7Rcg0sP4jrlu65D-It0Zk0FPD" 
                    />
                    <span className="absolute top-4 right-4 px-3 py-1 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Completed
                    </span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold font-headline mb-1">Red Sea Solar Desal</h3>
                      <p className="text-sm text-secondary line-clamp-2">Clean water for remote coastal communities using 100% solar energy.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-primary">115% Funded</span>
                        <span className="text-secondary">Successful</span>
                      </div>
                      <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyProfilePage;