"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import {
  profileApi,
  type ProfileData,
  type PasswordChangeData,
} from "@/utils/profileApi";
import { toast } from "sonner";
import { Check, X, Loader2, Camera } from "lucide-react";
import { debounce } from "lodash";
import { useAvatar } from "@/hooks/use-avatar";

interface ProfileState {
  fullName: string;
  username: string;
  email: string;
  bio: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
  createdAt: string;
}

interface PasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const { avatarUrl: storedAvatarUrl, updateAvatar } = useAvatar();

  const [profileData, setProfileData] = useState<ProfileState>({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    phoneNumber: "",
    address: "",
    avatarUrl: "",
    createdAt: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated]);

  // Set avatar from localStorage if available
  useEffect(() => {
    if (storedAvatarUrl) {
      console.log("Setting avatar from useAvatar hook:", storedAvatarUrl);
      setProfileData((prev) => ({ ...prev, avatarUrl: storedAvatarUrl }));
    }
  }, [storedAvatarUrl]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await profileApi.getProfile();

      // Get avatar URL from API response or localStorage
      const avatarUrl = data.profile?.avatarUrl || storedAvatarUrl || "";
      console.log("Fetched profile data, avatar URL:", avatarUrl);

      setProfileData({
        fullName: data.profile?.fullName || "",
        username: data.user?.username || "",
        email: data.user?.email || "",
        bio: data.profile?.bio || "",
        phoneNumber: data.profile?.phoneNumber || "",
        address: data.profile?.address || "",
        avatarUrl: avatarUrl,
        createdAt: new Date(data.user?.createdAt).toLocaleDateString() || "",
      });

      // Store avatar URL in localStorage for persistence
      if (data.profile?.avatarUrl) {
        updateAvatar(data.profile.avatarUrl);
      }

      setOriginalUsername(data.user?.username || "");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error loading profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if username exists (debounced)
  const checkUsername = debounce(async (username: string) => {
    if (username === originalUsername || !username) {
      setIsCheckingUsername(false);
      setUsernameExists(false);
      return;
    }

    try {
      setIsCheckingUsername(true);
      const { exists } = await profileApi.checkUsername(username);
      setUsernameExists(exists);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCheckingUsername(false);
    }
  }, 500);

  // Handle profile form changes
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      checkUsername(value);
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setIsSaving(true);

      if (usernameExists) {
        toast.error("Username already exists. Please choose another.");
        return;
      }

      const updateData: ProfileData = {
        username: profileData.username,
        email: profileData.email,
        fullName: profileData.fullName,
        bio: profileData.bio,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
      };

      await profileApi.updateProfile(updateData);
      toast.success("Profile updated successfully!");

      // Update original username for future comparisons
      setOriginalUsername(profileData.username);
      // Refresh user data in Auth context
      await refreshUserData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      setIsChangingPassword(true);

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }

      const passwordChangeData: PasswordChangeData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      await profileApi.changePassword(passwordChangeData);
      toast.success("Password changed successfully!");

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle avatar upload preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      console.log("Preview image set:", result.substring(0, 50) + "...");
      setPreviewImage(result);
    };

    reader.readAsDataURL(file);
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Handle file preview
    handleFileChange(e);

    const file = e.target.files[0];
    try {
      const { avatarUrl } = await profileApi.uploadAvatar(file);
      console.log("Avatar uploaded successfully, URL:", avatarUrl);

      // Update profile data with new avatar URL
      setProfileData((prev) => ({ ...prev, avatarUrl }));

      // Store avatar URL using our hook
      updateAvatar(avatarUrl);

      toast.success("Avatar uploaded successfully!");

      // Refresh user data in Auth context
      await refreshUserData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error uploading avatar");
    }
  };

  // Determine which avatar URL to use
  const displayAvatarUrl =
    previewImage ||
    profileData.avatarUrl ||
    storedAvatarUrl ||
    "/placeholder.svg";
  console.log("Display avatar URL:", displayAvatarUrl.substring(0, 50) + "...");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile Settings</h1>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account information and profile details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Username
                      {isCheckingUsername && (
                        <Loader2 className="ml-2 inline h-4 w-4 animate-spin" />
                      )}
                      {!isCheckingUsername &&
                        profileData.username &&
                        profileData.username !== originalUsername &&
                        (usernameExists ? (
                          <X className="ml-2 inline h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="ml-2 inline h-4 w-4 text-green-500" />
                        ))}
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      placeholder="Choose a username"
                      className={
                        usernameExists
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }
                    />
                    {usernameExists && (
                      <p className="text-sm text-red-500">
                        Username already exists. Please choose another.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={saveProfile}
                    disabled={isSaving || usernameExists}
                    className="w-full"
                  >
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Manage your profile picture and view account details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={displayAvatarUrl || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-xl">
                          {profileData.fullName
                            ? profileData.fullName.charAt(0).toUpperCase()
                            : profileData.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        className="absolute bottom-0 right-0 rounded-full bg-[var(--card-background)] hover:bg-[var(--card-background)]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">
                        {profileData.fullName || profileData.username}
                      </h3>
                      <p className="text-sm text-[var(--paragraph)]">
                        {profileData.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--paragraph)]">
                        Member since
                      </span>
                      <span>{profileData.createdAt}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--paragraph)]">
                        Account type
                      </span>
                      <span className="capitalize">{user?.role || "User"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password Settings</CardTitle>
                <CardDescription>
                  Change your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    className={
                      passwordData.newPassword &&
                      passwordData.confirmPassword &&
                      passwordData.newPassword !== passwordData.confirmPassword
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {passwordData.newPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <p className="text-sm text-red-500">
                        Passwords don't match
                      </p>
                    )}
                </div>

                <Button
                  onClick={changePassword}
                  disabled={
                    isChangingPassword ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className="w-full"
                >
                  {isChangingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;
