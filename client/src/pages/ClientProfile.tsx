import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Shield,
  KeyRound,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { profileApi } from "@/utils/profileApi";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  createdAt?: string;
}

const ClientProfile: React.FC = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    username: user?.username || "",
    email: user?.email || "",
    fullName: user?.fullName || "",
    phoneNumber: "",
    address: "",
    avatarUrl: user?.avatarUrl || "",
  });

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        // In a real app, fetch profile from API
        // const response = await profileApi.getProfile();
        // const data = response.profile;

        // For demonstration, we'll use the user data from context
        const data = {
          username: user?.username || "",
          email: user?.email || "",
          fullName: user?.fullName || "",
          phoneNumber: "555-123-4567", // Mock data
          address: "123 Main St, Anytown, USA", // Mock data
          avatarUrl: user?.avatarUrl || "",
          createdAt: "2023-10-01", // Mock data
        };

        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSaveSuccess(false);

    try {
      // Handle avatar upload first if there's a new avatar
      if (avatarFile) {
        try {
          // const response = await profileApi.uploadAvatar(avatarFile);
          // setProfileData(prev => ({ ...prev, avatarUrl: response.avatarUrl }));

          // For demonstration, simulate a successful upload
          const fakeAvatarUrl = avatarPreview;
          setProfileData((prev) => ({
            ...prev,
            avatarUrl: fakeAvatarUrl || prev.avatarUrl,
          }));
          toast.success("Profile picture updated successfully");
        } catch (error) {
          console.error("Failed to upload avatar:", error);
          toast.error("Failed to upload profile picture");
        }
      }

      // Update profile data
      // await profileApi.updateProfile(profileData);

      // Simulate API call success
      toast.success("Profile updated successfully");
      setSaveSuccess(true);

      // Refresh user data in context
      await refreshUserData();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // await profileApi.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });

      // Simulate API call success
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (profileData.fullName) {
      return profileData.fullName.charAt(0).toUpperCase();
    }
    if (profileData.username) {
      return profileData.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--headline)]">
          My Profile
        </h1>
        <p className="text-[var(--paragraph)]">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="border border-[var(--border)] bg-[var(--card)]">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
          >
            <User className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--accent-foreground)]"
          >
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader>
                <CardTitle className="text-[var(--headline)]">
                  Profile Information
                </CardTitle>
                <CardDescription className="text-[var(--paragraph)]">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="mb-4 h-20 w-20">
                      <AvatarImage
                        src={avatarPreview || profileData.avatarUrl}
                      />
                      <AvatarFallback className="text-lg">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--button)] text-[var(--button-foreground)] shadow-md">
                          <Upload className="h-4 w-4" />
                        </div>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Click the icon to upload a new profile picture
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[var(--paragraph)]">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    value={profileData.fullName || ""}
                    onChange={handleProfileChange}
                    className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-[var(--paragraph)]"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[var(--paragraph)]">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-[var(--paragraph)]"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Your phone number"
                    value={profileData.phoneNumber || ""}
                    onChange={handleProfileChange}
                    className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[var(--paragraph)]">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Your address"
                    value={profileData.address || ""}
                    onChange={handleProfileChange}
                    className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {saveSuccess && (
                  <span className="flex items-center text-sm text-green-600">
                    <Check className="mr-1 h-4 w-4" />
                    Changes saved
                  </span>
                )}
                <div className="flex-1"></div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-[var(--button)] text-[var(--button-foreground)] hover:bg-[var(--button-hover)]"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader>
                <CardTitle className="text-[var(--headline)]">
                  Account Information
                </CardTitle>
                <CardDescription className="text-[var(--paragraph)]">
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
                    Account Status
                  </h3>
                  <div className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-green-500" />
                    <span className="font-medium text-[var(--headline)]">
                      Active
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
                    Member Since
                  </h3>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--headline)]">
                      {formatDate(profileData.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
                    Email
                  </h3>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--headline)]">
                      {profileData.email}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
                    Phone
                  </h3>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--headline)]">
                      {profileData.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
                    Address
                  </h3>
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-0.5 h-5 w-5 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--headline)]">
                      {profileData.address || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-[var(--border)] text-[var(--paragraph)] hover:bg-[var(--hover)]"
                    onClick={() => navigate("/client/services")}
                  >
                    View My Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader>
                <CardTitle className="text-[var(--headline)]">
                  Change Password
                </CardTitle>
                <CardDescription className="text-[var(--paragraph)]">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-[var(--paragraph)]"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Your current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-[var(--paragraph)]"
                  >
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[var(--paragraph)]"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="border-[var(--input)] bg-[var(--input-background)] text-[var(--input-text)]"
                  />
                </div>

                <div className="pt-2">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Password must be at least 8 characters long and include a
                    mix of letters, numbers, and symbols.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleChangePassword}
                  disabled={
                    loading ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                  className="bg-[var(--button)] text-[var(--button-foreground)] hover:bg-[var(--button-hover)]"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--card)]">
              <CardHeader>
                <CardTitle className="text-[var(--headline)]">
                  Security Settings
                </CardTitle>
                <CardDescription className="text-[var(--paragraph)]">
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card-background)] p-4">
                  <div className="flex items-start">
                    <div className="mr-3 rounded-full bg-yellow-100 p-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--headline)]">
                        Account Protection
                      </h3>
                      <p className="mb-2 mt-1 text-sm text-[var(--paragraph)]">
                        We recommend enabling two-factor authentication for
                        additional security.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)] text-[var(--paragraph)] hover:bg-[var(--hover)]"
                      >
                        <Shield className="mr-1 h-4 w-4" />
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <KeyRound className="mr-2 h-5 w-5 text-[var(--muted-foreground)]" />
                      <div>
                        <h3 className="font-medium text-[var(--headline)]">
                          Login Notifications
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                    </div>
                    <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-200 p-1">
                      <div className="h-4 w-4 translate-x-0 transform rounded-full bg-white shadow-md"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-[var(--muted-foreground)]" />
                      <div>
                        <h3 className="font-medium text-[var(--headline)]">
                          Login Locations
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Allow login only from trusted locations
                        </p>
                      </div>
                    </div>
                    <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-200 p-1">
                      <div className="h-4 w-4 translate-x-0 transform rounded-full bg-white shadow-md"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-[var(--muted-foreground)]" />
                      <div>
                        <h3 className="font-medium text-[var(--headline)]">
                          Security Alerts
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Receive security alert emails
                        </p>
                      </div>
                    </div>
                    <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-green-500 p-1">
                      <div className="h-4 w-4 translate-x-5 transform rounded-full bg-white shadow-md"></div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <Button
                    variant="outline"
                    className="w-full border border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Log Out of All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Custom Calendar icon since it's not available in the imports
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// Custom Globe icon
const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export default ClientProfile;
