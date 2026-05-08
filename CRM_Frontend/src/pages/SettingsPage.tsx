import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, LogOut } from "lucide-react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { Button } from "../components/atoms/Button";
import { Typography } from "../components/atoms/Typography";
import { Input } from "../components/atoms/Input";
import { useAuth } from "../context/AuthContext";

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setNotification({
        message: "Please fill in all password fields",
        type: "error",
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setNotification({
        message: "New passwords do not match",
        type: "error",
      });
      return;
    }

    if (passwords.new.length < 6) {
      setNotification({
        message: "New password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    // Here you would call your API to change password
    setNotification({
      message: "Password change feature coming soon",
      type: "info",
    });

    setTimeout(() => {
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordForm(false);
      setNotification(null);
    }, 3000);
  };

  const handleLogout = () => {
    logout();
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout title="Settings">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl space-y-6"
      >
        {/* Notification Toast */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 p-4 rounded-lg border ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200"
                : notification.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                notification.type === "success"
                  ? "text-emerald-800"
                  : notification.type === "error"
                    ? "text-red-800"
                    : "text-blue-800"
              }`}
            >
              {notification.message}
            </p>
          </motion.div>
        )}

        {/* Profile Section */}
        <motion.div
          variants={item}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-slate-500" />
            <Typography variant="h3">Profile</Typography>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Name
                </label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {user?.name}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Email
                </label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {user?.email}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Role
                </label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          variants={item}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-slate-500" />
            <Typography variant="h3">Security</Typography>
          </div>

          {!showPasswordForm ? (
            <Button
              variant="secondary"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3">
                <Button variant="primary" type="submit">
                  Update Password
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswords({ current: "", new: "", confirm: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Account Section */}
        <motion.div
          variants={item}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <LogOut className="w-5 h-5 text-slate-500" />
            <Typography variant="h3">Account</Typography>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Sign out from your account on this device.
            </p>
            <Button
              variant="secondary"
              className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};
