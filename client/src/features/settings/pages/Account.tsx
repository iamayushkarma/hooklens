import ProfileCard from "../components/ProfileCard";
import ChangePasswordCard from "../components/ChangePasswordCard";
import DeleteAccountCard from "../components/DeleteAccountCard";

function Account() {
  return (
    <div className="space-y-6">
      <ProfileCard />

      <ChangePasswordCard />

      <DeleteAccountCard />
    </div>
  );
}

export default Account;
