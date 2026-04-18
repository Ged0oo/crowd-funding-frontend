import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../shared/components/layout/Navbar";
import Footer from "../shared/components/layout/Footer";
import PageWrapper from "../shared/components/layout/PageWrapper";
import { useMyProfile } from "../features/auth/hooks/useMyProfile";
import { useAuthStore } from "../features/auth/stores/authStore";

export default function AppLayout() {
  const setUser = useAuthStore((state) => state.setUser);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: profileResponse } = useMyProfile();

  useEffect(() => {
    const user = profileResponse?.data?.data ?? profileResponse?.data;
    if (user) {
      setUser(user);
    }
  }, [profileResponse, setUser]);

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
    }
  }, [accessToken, setUser]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <PageWrapper>
        <Outlet />
      </PageWrapper>
      <Footer />
    </div>
  );
}
