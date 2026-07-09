import { useAuthStore } from "@/store/auth.store";

function Account() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-text-secondary">
          Manage your personal profile information.
        </p>
      </div>

      <div className="rounded-lg border border-border-default bg-bg-card p-5 space-y-4 max-w-lg">
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wide">
            Full name
          </label>
          <p className="mt-1 text-sm">{user?.fullName}</p>
        </div>

        <div className="border-t border-border-default pt-4">
          <label className="text-xs text-text-secondary uppercase tracking-wide">
            Email
          </label>
          <p className="mt-1 text-sm">{user?.email}</p>
        </div>
      </div>

      <p className="text-xs text-text-secondary">
        Profile editing (name, avatar, password) is coming soon.
      </p>
    </div>
  );
}

export default Account;
