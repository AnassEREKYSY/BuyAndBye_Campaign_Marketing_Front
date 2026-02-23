import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "./ui";
import { useAuth } from "@/modules/auth/application/hooks"; // adjust if your hook path differs

export function LogoutSection() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-extrabold">Logout</h2>
      <p className="text-sm text-white/60">End your session on this device.</p>

      <PrimaryButton
        type="button"
        onClick={() => {
          logout();
          navigate("/auth/login");
        }}
      >
        Logout
      </PrimaryButton>
    </div>
  );
}