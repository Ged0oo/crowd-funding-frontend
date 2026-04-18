import { useEffect, useState } from 'react';
import Navbar from '../../../shared/components/layout/Navbar';
import { useMyProfile } from '../hooks/useMyProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { useForm } from 'react-hook-form';
import UserProjectList from '../../users/components/UserProjectList';
import DonationHistory from '../../users/components/DonationHistory';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'donations'>('profile');

  const { data: profileResponse, isPending, isError } = useMyProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // The backend might return { status: "success", data: { ...userfields } }
  const user = profileResponse?.data?.data || profileResponse?.data;
  
  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm({
    defaultValues: user
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [reset, user]);

  const onSubmit = async (data: any) => {
    try {
      setSubmitError(null);
      await updateProfile(data);
    } catch (error: unknown) {
      console.error("Submission failed", error);
      const serverErrors = (error as any)?.response?.data?.error_message;

      if (serverErrors && typeof serverErrors === 'object') {
        Object.entries(serverErrors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages.join(' ') : String(messages);
          setError(field as any, { type: 'server', message });
        });
        setSubmitError('Please fix the validation errors and try again.');
        return;
      }

      setSubmitError(
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        'Unable to update profile. Please try again.'
      );
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
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-6 py-4 rounded-xl transition-all flex items-center justify-between ${activeTab === 'profile' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-secondary hover:bg-surface-container-high'}`}
            >
              <span>Edit Profile</span>
              <span className={`material-symbols-outlined ${activeTab !== 'profile' && 'text-outline-variant'}`}>chevron_right</span>
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left px-6 py-4 rounded-xl transition-all flex items-center justify-between ${activeTab === 'projects' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-secondary hover:bg-surface-container-high'}`}
            >
              <span>My Created Projects</span>
              <span className={`material-symbols-outlined ${activeTab !== 'projects' && 'text-outline-variant'}`}>chevron_right</span>
            </button>
            <button 
              onClick={() => setActiveTab('donations')}
              className={`w-full text-left px-6 py-4 rounded-xl transition-all flex items-center justify-between ${activeTab === 'donations' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-secondary hover:bg-surface-container-high'}`}
            >
              <span>My Donations</span>
              <span className={`material-symbols-outlined ${activeTab !== 'donations' && 'text-outline-variant'}`}>chevron_right</span>
            </button>
          </aside>

          {/* Main Panel */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Tab Routing */}
            {activeTab === 'profile' && (
              <section className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-outline-variant/10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-headline mb-1">Account Information</h2>
                  <p className="text-secondary text-sm">Update your personal details and how others see you on the platform.</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {submitError && (
                    <div className="rounded-xl border border-error-container/30 bg-error-container/10 px-4 py-3 text-error">
                      {submitError}
                    </div>
                  )}

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
                        {...register('phone_number', {
                          pattern: {
                            value: /^01[0125]\d{8}$/,
                            message: 'Enter a valid Egyptian phone number, e.g. 01012345678.',
                          },
                        })}
                        className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/10 rounded-xl p-4 text-on-surface outline-variant outline-1 outline" 
                        type="tel" 
                      />
                      {errors.phone_number && (
                        <p className="mt-2 text-sm text-error">{errors.phone_number.message as string}</p>
                      )}
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
            )}

            {activeTab === 'projects' && <UserProjectList />}
            
            {activeTab === 'donations' && <DonationHistory />}
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyProfilePage;