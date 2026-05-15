import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from "../components/Sidebar";
import { Upload, Link, LogOut, Mail, User, AtSign, Lock, CheckCircle, AlertCircle, Camera, X } from 'lucide-react';
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
import { API_BASE_URL } from "../config";

const SERVER_ORIGIN = API_BASE_URL.replace('/api', '');

function getFullAvatarUrl(avatar: string): string {
  if (!avatar) return "";
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  return `${SERVER_ORIGIN}${avatar}`;
}

export default function SettingsPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const { user, isArabic, setUser } = useAppContext();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");

  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";

  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.username) setFullName(user.username);
      if (user.name) setUsername(user.name);
      setAvatar(user.avatar || defaultAvatar);
    }
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError(isArabic ? "يرجى اختيار صورة بصيغة JPG, PNG, GIF أو WebP" : "Please select a JPG, PNG, GIF, or WebP image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError(isArabic ? "حجم الصورة يجب أن لا يتجاوز 5 ميجابايت" : "Image size must be under 5MB");
      return;
    }

    setAvatarError("");
    setAvatarSuccess("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setAvatarSaving(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data) {
        setUser(res.data);
        setAvatar(res.data.avatar || defaultAvatar);
        setAvatarPreview(null);
        setAvatarSuccess(isArabic ? "تم تحديث الصورة بنجاح" : "Profile picture updated");
        setTimeout(() => setAvatarSuccess(""), 3000);
      }
    } catch (error: any) {
      setAvatarError(error.response?.data?.message || (isArabic ? "فشل رفع الصورة" : "Failed to upload image"));
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleUrlSubmit = async () => {
    const url = avatarUrlInput.trim();
    if (!url) {
      setAvatarError(isArabic ? "يرجى إدخال رابط الصورة" : "Please enter an image URL");
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setAvatarError(isArabic ? "الرجاء إدخال رابط صحيح يبدأ بـ http:// أو https://" : "Please enter a valid URL starting with http:// or https://");
      return;
    }

    setAvatarError("");
    setAvatarSuccess("");
    setAvatarSaving(true);

    try {
      const res = await api.put("/user/profile", { avatar: url });
      if (res.data) {
        setUser(res.data);
        setAvatar(url);
        setAvatarUrlInput("");
        setShowUrlInput(false);
        setAvatarSuccess(isArabic ? "تم تحديث الصورة بنجاح" : "Profile picture updated");
        setTimeout(() => setAvatarSuccess(""), 3000);
      }
    } catch (error: any) {
      setAvatarError(error.response?.data?.message || (isArabic ? "فشل تحديث الصورة" : "Failed to update picture"));
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleProfileUpdate = async () => {
    setProfileError("");
    setProfileSuccess("");

    if (!fullName.trim()) {
      setProfileError(isArabic ? "يرجى إدخال الاسم الكامل" : "Please enter your full name");
      return;
    }

    setProfileSaving(true);
    try {
      const res = await api.put("/user/profile", {
        username: fullName.trim(),
        name: username.trim(),
      });
      if (res.data) {
        setUser(res.data);
        setProfileSuccess(isArabic ? "تم حفظ البيانات بنجاح" : "Profile updated successfully");
        setTimeout(() => setProfileSuccess(""), 3000);
      }
    } catch (error: any) {
      setProfileError(error.response?.data?.message || (isArabic ? "فشل التحديث" : "Failed to update profile"));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError(isArabic ? "يرجى إدخال كلمة المرور الحالية" : "Please enter your current password");
      return;
    }
    if (!newPassword) {
      setPasswordError(isArabic ? "يرجى إدخال كلمة المرور الجديدة" : "Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(isArabic ? "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" : "New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(isArabic ? "كلمة المرور الجديدة وتأكيدها غير متطابقين" : "New passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put("/user/password", { currentPassword, newPassword });
      setPasswordSuccess(isArabic ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || (isArabic ? "فشل تغيير كلمة المرور" : "Failed to change password"));
    } finally {
      setPasswordSaving(false);
    }
  };

  const t = {
    settings: isArabic ? "الإعدادات" : "Settings",
    avatarPicture: isArabic ? "الصورة الشخصية" : "Profile Picture",
    changeAvatar: isArabic ? "تغيير الصورة" : "Change Picture",
    uploadImage: isArabic ? "رفع صورة" : "Upload Image",
    imageLink: isArabic ? "رابط صورة" : "Image Link",
    enterUrl: isArabic ? "أدخل رابط الصورة..." : "Enter image URL...",
    applyLink: isArabic ? "تطبيق" : "Apply",
    cancel: isArabic ? "إلغاء" : "Cancel",
    emailAddress: isArabic ? "البريد الإلكتروني" : "Email Address",
    primaryEmail: isArabic ? "البريد الأساسي" : "Primary Email",
    profileInfo: isArabic ? "معلومات الحساب" : "Profile Information",
    fullName: isArabic ? "الاسم الكامل" : "Full Name",
    username: isArabic ? "اسم المستخدم" : "Username",
    saveProfile: isArabic ? "حفظ التغييرات" : "Save Changes",
    saving: isArabic ? "جاري الحفظ..." : "Saving...",
    changePassword: isArabic ? "تغيير كلمة المرور" : "Change Password",
    currentPassword: isArabic ? "كلمة المرور الحالية" : "Current Password",
    newPassword: isArabic ? "كلمة المرور الجديدة" : "New Password",
    confirmPassword: isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password",
    updatePassword: isArabic ? "تحديث كلمة المرور" : "Update Password",
    updating: isArabic ? "جاري التحديث..." : "Updating...",
    changePasswordDesc: isArabic ? "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل." : "Password must be at least 6 characters.",
    accountActions: isArabic ? "إجراءات الحساب" : "Account Actions",
    logOutDesc: isArabic ? "تسجيل الخروج من حسابك على هذا الجهاز." : "Log out of your account on this device.",
    logOut: isArabic ? "تسجيل الخروج" : "Log Out",
  };

  const displayUrl = avatarPreview || getFullAvatarUrl(avatar) || defaultAvatar;

  return (
    <div className="flex min-h-screen bg-slate-50" dir={isArabic ? 'rtl' : 'ltr'}>
      <Sidebar currentScreen="settings" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-900">{t.settings}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">

            {/* Avatar */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">{t.avatarPicture}</h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold text-3xl overflow-hidden">
                    <img
                      src={displayUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar; }}
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 end-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center shadow-lg hover:bg-academic-navy transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarSaving}
                      className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {t.uploadImage}
                    </button>
                    <button
                      onClick={() => { setShowUrlInput(!showUrlInput); setAvatarUrlInput(""); setAvatarError(""); }}
                      className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <Link className="w-4 h-4" />
                      {t.imageLink}
                    </button>
                  </div>

                  {avatarSaving && (
                    <div className="flex items-center gap-2 text-academic-blue text-sm">
                      <div className="w-4 h-4 border-2 border-academic-blue/20 border-t-academic-blue rounded-full animate-spin" />
                      {isArabic ? "جاري الحفظ..." : "Saving..."}
                    </div>
                  )}

                  {avatarError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {avatarError}
                    </div>
                  )}
                  {avatarSuccess && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-4 py-3 rounded-xl">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      {avatarSuccess}
                    </div>
                  )}

                  {showUrlInput && (
                    <div className="flex items-center gap-2 w-full sm:w-80">
                      <input
                        type="text"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        placeholder={t.enterUrl}
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                      />
                      <button
                        onClick={handleUrlSubmit}
                        disabled={avatarSaving}
                        className="bg-academic-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-academic-navy transition-colors disabled:opacity-50"
                      >
                        {t.applyLink}
                      </button>
                      <button
                        onClick={() => { setShowUrlInput(false); setAvatarUrlInput(""); setAvatarError(""); }}
                        className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{t.emailAddress}</h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.primaryEmail}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isArabic ? 'end-0 pe-3' : 'start-0 ps-3'} flex items-center pointer-events-none`}>
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className={`block w-full ${isArabic ? 'pe-10 ps-3' : 'ps-10 pe-3'} py-2.5 border border-slate-200 rounded-xl text-slate-500 bg-slate-50 focus:outline-none sm:text-sm transition-shadow cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{t.profileInfo}</h2>
              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.fullName}</label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isArabic ? 'end-0 pe-3' : 'start-0 ps-3'} flex items-center pointer-events-none`}>
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`block w-full ${isArabic ? 'pe-10 ps-3' : 'ps-10 pe-3'} py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm bg-white transition-shadow`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.username}</label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isArabic ? 'end-0 pe-3' : 'start-0 ps-3'} flex items-center pointer-events-none`}>
                      <AtSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`block w-full ${isArabic ? 'pe-10 ps-3' : 'ps-10 pe-3'} py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm bg-white transition-shadow`}
                    />
                  </div>
                </div>

                {profileError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {profileError}
                  </div>
                )}
                {profileSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-4 py-3 rounded-xl">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {profileSuccess}
                  </div>
                )}

                <button
                  onClick={handleProfileUpdate}
                  disabled={profileSaving}
                  className="w-full sm:w-auto bg-academic-blue text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-academic-navy transition-all shadow-lg shadow-academic-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileSaving ? t.saving : t.saveProfile}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">{t.changePassword}</h2>
              <p className="text-sm text-slate-500 mb-5">{t.changePasswordDesc}</p>
              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.currentPassword}</label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isArabic ? 'end-0 pe-3' : 'start-0 ps-3'} flex items-center pointer-events-none`}>
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`block w-full ${isArabic ? 'pe-10 ps-3' : 'ps-10 pe-3'} py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm bg-white transition-shadow`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.newPassword}</label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isArabic ? 'end-0 pe-3' : 'start-0 ps-3'} flex items-center pointer-events-none`}>
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`block w-full ${isArabic ? 'pe-10 ps-3' : 'ps-10 pe-3'} py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm bg-white transition-shadow`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.confirmPassword}</label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isArabic ? 'end-0 pe-3' : 'start-0 ps-3'} flex items-center pointer-events-none`}>
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`block w-full ${isArabic ? 'pe-10 ps-3' : 'ps-10 pe-3'} py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm bg-white transition-shadow`}
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-4 py-3 rounded-xl">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {passwordSuccess}
                  </div>
                )}

                <button
                  onClick={handlePasswordChange}
                  disabled={passwordSaving}
                  className="w-full sm:w-auto bg-academic-blue text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-academic-navy transition-all shadow-lg shadow-academic-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordSaving ? t.updating : t.updatePassword}
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
              <h2 className="text-lg font-bold text-red-600 mb-2">{t.accountActions}</h2>
              <p className="text-sm text-slate-500 mb-4">{t.logOutDesc}</p>
              <button
                onClick={() => {
                  const lang = localStorage.getItem("language");
                  localStorage.clear();
                  if (lang) localStorage.setItem("language", lang);
                  navigate('/login');
                }}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t.logOut}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
