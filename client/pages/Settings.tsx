import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/store";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Shield, Trash2, Mail, Copy } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { clearUser, setUser } from "@/store/slices/userSlice";
import { setLanguage as setAppLanguage } from "@/store/slices/languageSlice";
import { apis } from "@/services";
import { isTeacher } from "@/utils/roles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LabelOption {
  id: number;
  name: string;
}

const arraysHaveSameItems = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((value, index) => value === sortedB[index]);
};

export default function Settings() {
  const user = useAppSelector(state => state.user);

  const { t, currentLanguage } = useLanguage();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  const rawUser = user.user as {
    name?: string;
    email?: string;
    age?: number;
    gender?: string;
    language?: string;
    labels?: { id: number; name: string }[];
  } | undefined;

  const userLabelOptions = useMemo<LabelOption[]>(
    () =>
      Array.isArray(rawUser?.labels)
        ? rawUser!.labels
            .filter((label): label is { id: number; name: string } => typeof label?.id === "number" && typeof label?.name === "string")
            .map((label) => ({ id: label.id, name: label.name }))
        : [],
    [rawUser?.labels],
  );
  const userLabelIds = useMemo(() => userLabelOptions.map((label) => label.id), [userLabelOptions]);

  // URL'den tab parametresini oku
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "security", "account"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchLabels = async () => {
      setLabelsLoading(true);
      try {
        const response = await apis.label.get_labels();
        if (response?.status === 200 && Array.isArray(response.data)) {
          const normalized: LabelOption[] = response.data
            .filter((label: any) => typeof label?.id === "number" && typeof label?.name === "string")
            .map((label: any) => ({ id: label.id, name: label.name }));
          setAvailableLabels(normalized);
        } else {
          setAvailableLabels([]);
        }
      } catch (error) {
        console.error("Failed to load labels:", error);
        setAvailableLabels([]);
      } finally {
        setLabelsLoading(false);
      }
    };

    fetchLabels();
  }, []);

  useEffect(() => {
    setSelectedLabelIds(userLabelIds);
    setSavedLabelIds(userLabelIds);
  }, [userLabelIds]);

  // Profile state
  const initialName = rawUser?.name || "";
  const initialNameParts = initialName.trim().split(" ").filter(Boolean);
  const [firstName, setFirstName] = useState(initialNameParts[0] || "");
  const [lastName, setLastName] = useState(initialNameParts.slice(1).join(" ") || "");
  const [age, setAge] = useState(rawUser?.age ? String(rawUser.age) : "");
  const normalizedGender = rawUser?.gender?.toLowerCase() === "female" ? "female" : "male";
  const [gender, setGender] = useState<"male" | "female">(normalizedGender);
  const [savedGender, setSavedGender] = useState<"male" | "female">(normalizedGender);
  const [email, setEmail] = useState(rawUser?.email || "");
  const initialLanguage = rawUser?.language?.toUpperCase() === "EN" ? "EN" : rawUser?.language?.toUpperCase() === "TR" ? "TR" : (currentLanguage === "en" ? "EN" : "TR");
  const [preferredLanguage, setPreferredLanguage] = useState<"TR" | "EN">(initialLanguage);
  const [savedLanguage, setSavedLanguage] = useState<"TR" | "EN">(initialLanguage);
  const [savedAge, setSavedAge] = useState<number | undefined>(rawUser?.age);
  const [availableLabels, setAvailableLabels] = useState<LabelOption[]>([]);
  const [labelsLoading, setLabelsLoading] = useState(false);
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>(userLabelIds);
  const [savedLabelIds, setSavedLabelIds] = useState<number[]>(userLabelIds);
  const [zoomAuthUrl, setZoomAuthUrl] = useState("");
  const [isFetchingZoomLink, setIsFetchingZoomLink] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
 
  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const toggleLabel = (labelId: number) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId],
    );
  };

  const handleSaveProfile = async () => {
     const trimmedFirstName = firstName.trim();
     const trimmedLastName = lastName.trim();
     const trimmedEmail = email.trim();
     const existingName = rawUser?.name || "";
     const [existingFirst, ...existingRest] = existingName.split(" ").filter(Boolean);
     const existingLast = existingRest.join(" ");
     const existingEmail = rawUser?.email || "";
     const existingAge = savedAge;
     const existingGender = savedGender;
     const existingLanguage = savedLanguage;
 
     const emailChanged = trimmedEmail && trimmedEmail !== existingEmail;

    const firstNameChanged = trimmedFirstName !== (existingFirst || "");
    const lastNameChanged = trimmedLastName !== (existingLast || "");
    const genderChanged = gender !== existingGender;
    const languageChanged = preferredLanguage !== existingLanguage;
    const labelsChanged = !arraysHaveSameItems(selectedLabelIds, savedLabelIds);
 
    if (!trimmedFirstName || !trimmedLastName) {
      toast({
        title: t('auth.error'),
        description: t('settings.nameRequired'),
        variant: "destructive",
      });
      return;
    }

    if (!trimmedEmail) {
      toast({
        title: t('auth.error'),
        description: t('settings.emailRequired'),
        variant: "destructive",
      });
      return;
    }

    if (age) {
      const numericAge = Number(age);
      if (Number.isNaN(numericAge) || numericAge < 0) {
        toast({
          title: t('auth.error'),
          description: t('settings.invalidAge'),
          variant: "destructive",
        });
        return;
      }
    }

    const payload: {
      first_name?: string;
      last_name?: string;
      age?: number;
      gender?: "male" | "female";
      email?: string;
      language?: "TR" | "EN";
      labels?: number[];
    } = {};

    if (firstNameChanged) payload.first_name = trimmedFirstName;
    if (lastNameChanged) payload.last_name = trimmedLastName;
    if (age) {
      const numericAge = Number(age);
      if (!Number.isNaN(numericAge) && numericAge !== existingAge) {
        payload.age = numericAge;
      }
    }
    if (genderChanged) payload.gender = gender;
    if (trimmedEmail && emailChanged) payload.email = trimmedEmail;
    if (languageChanged) payload.language = preferredLanguage;
    if (labelsChanged) payload.labels = selectedLabelIds;

    if (Object.keys(payload).length === 0) {
       toast({
        title: t('settings.noChanges'),
      });
      return;
    }

    setIsSavingProfile(true);

    try {
      const response: any = await apis.user.update_user(payload);
      const status = response?.status ?? response?.response?.status;

      if (status && status >= 200 && status < 300) {
        toast({
          title: t('settings.profileUpdated'),
          description: response?.data?.message || t('settings.profileUpdatedDescription'),
        });

        if (user.user) {
          const updatedFirst = trimmedFirstName || existingFirst || "";
          const updatedLast = trimmedLastName || existingLast || "";
          const updatedName = [updatedFirst, updatedLast].filter(Boolean).join(" ") || user.user.name;
          const updatedAge = payload.age !== undefined ? payload.age : existingAge;
          const updatedGender = gender;
          const updatedLanguage = languageChanged ? preferredLanguage : existingLanguage;
          const labelNameMap = new Map<number, string>();
          availableLabels.forEach((label) => {
            labelNameMap.set(label.id, label.name);
          });
          userLabelOptions.forEach((label) => {
            if (!labelNameMap.has(label.id)) {
              labelNameMap.set(label.id, label.name);
            }
          });
          const updatedLabels = labelsChanged
            ? selectedLabelIds
                .map((id) => {
                  const name =
                    labelNameMap.get(id) ||
                    user.user?.labels?.find((label) => label.id === id)?.name ||
                    String(id);
                  return { id, name };
                })
            : user.user.labels ?? [];
 
          dispatch(
            setUser({
              ...user.user,
              name: updatedName,
              email: emailChanged ? trimmedEmail : user.user.email,
              age: updatedAge ?? null,
              gender: updatedGender,
              language: updatedLanguage,
              labels: updatedLabels,
            })
          );
        }

        setFirstName(trimmedFirstName);
        setLastName(trimmedLastName);
        setEmail(trimmedEmail);
        setSavedGender(gender);
        setSavedLanguage(languageChanged ? preferredLanguage : existingLanguage);
        setSavedAge(payload.age !== undefined ? payload.age : existingAge);
        setSavedLabelIds(selectedLabelIds);

        if (languageChanged) {
          dispatch(setAppLanguage(preferredLanguage === "TR" ? "tr" : "en"));
        }

        if (emailChanged) {
          setPendingEmail(trimmedEmail);
          setVerificationCode("");
          toast({
            title: t('settings.emailVerificationTitle'),
            description: t('settings.emailVerificationDescription'),
          });
        }
      } else {
        const message = response?.data?.message || response?.response?.data?.message;
        toast({
          title: t('common.error'),
          description: message || t('error.submitFailed'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message;
      toast({
        title: t('common.error'),
        description: message || t('error.submitFailed'),
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!pendingEmail) return;
    if (!verificationCode.trim()) {
      toast({
        title: t('auth.error'),
        description: t('settings.verificationCodeRequired'),
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingEmail(true);

    try {
      const response: any = await apis.user.verify_email(pendingEmail, verificationCode.trim());
      const status = response?.status ?? response?.response?.status;

      if (status && status >= 200 && status < 300) {
        toast({
          title: t('settings.emailVerificationSuccess'),
          description: t('settings.emailVerificationSuccessDescription'),
        });
        setPendingEmail(null);
        setVerificationCode("");
      } else {
        const message = response?.data?.message || response?.response?.data?.message;
        toast({
          title: t('common.error'),
          description: message || t('settings.emailVerificationFailed'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message;
      toast({
        title: t('common.error'),
        description: message || t('settings.emailVerificationFailed'),
        variant: "destructive",
      });
    } finally {
      setIsVerifyingEmail(false);
    }
  };
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: t('auth.error'),
        description: t('auth.passwordMismatch'),
        variant: "destructive",
      });
      return;
    }

    if (!currentPassword || !newPassword) {
      toast({
        title: t('auth.error'),
        description: t('auth.passwordRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      const response: any = await apis.user.change_password(currentPassword, newPassword);
      const status = response?.status ?? response?.response?.status;

      if (status && status >= 200 && status < 300) {
        toast({
          title: t('settings.passwordChanged'),
          description: t('settings.passwordChangedDescription'),
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        return;
      }

      const errorMessage = response?.data?.message || response?.response?.data?.message;
      toast({
        title: t('common.error'),
        description: errorMessage || t('error.submitFailed'),
        variant: "destructive",
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message;
      toast({
        title: t('common.error'),
        description: errorMessage || t('error.submitFailed'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) return;
    setIsDeletingAccount(true);

    try {
      const response: any = await apis.user.delete_account();
      const status = response?.status ?? response?.response?.status;

      if (status && status >= 200 && status < 300) {
        toast({
          title: t('settings.accountDeleted'),
          description: response?.data?.message || t('settings.accountDeletedDescription'),
          variant: "destructive",
        });
        setIsDeleteDialogOpen(false);
        dispatch(clearUser());
        return;
      }

      const message = response?.data?.message || response?.response?.data?.message;
      toast({
        title: t('common.error'),
        description: message || t('error.submitFailed'),
        variant: "destructive",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message;
      toast({
        title: t('common.error'),
        description: message || t('error.submitFailed'),
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleConnectZoom = async () => {
    if (isFetchingZoomLink) return;
    setIsFetchingZoomLink(true);

    try {
      const response: any = await apis.user.connect_zoom();
      const status = response?.status ?? response?.response?.status;
      const zoomUrl =
        response?.data?.url ??
        response?.data?.data?.url ??
        response?.response?.data?.url;

      if (status && status >= 200 && status < 300 && typeof zoomUrl === "string") {
        setZoomAuthUrl(zoomUrl);
        toast({
          title: t('common.success'),
          description: t('settings.zoomLinkReady'),
        });
        return;
      }

      const message =
        response?.data?.message || response?.response?.data?.message || t('settings.zoomLinkFetchFailed');

      toast({
        title: t('common.error'),
        description: message,
        variant: "destructive",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || t('error.submitFailed');
      toast({
        title: t('common.error'),
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsFetchingZoomLink(false);
    }
  };

  const handleCopyZoomUrl = async () => {
    if (!zoomAuthUrl) {
      toast({
        title: t('common.error'),
        description: t('settings.zoomLinkEmpty'),
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(zoomAuthUrl);
      toast({
        title: t('common.success'),
        description: t('settings.zoomLinkCopied'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.zoomLinkCopyFailed'),
        variant: "destructive",
      });
    }
  };

  const isTeacherUser = isTeacher(user.user?.role);

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('settings.title')}</h1>
          <p className="text-muted-foreground">
            {t('settings.subtitle')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.profile')}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.security')}</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings.account')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.profileInformation')}</CardTitle>
                <CardDescription>
                  {t('settings.profileDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form Fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">{t('settings.firstName')}</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('settings.firstNamePlaceholder')}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">{t('settings.lastName')}</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('settings.lastNamePlaceholder')}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="age">{t('settings.age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder={t('settings.agePlaceholder')}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">{t('settings.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('settings.emailPlaceholder')}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="gender">{t('settings.gender')}</Label>
                    <Select value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder={t('settings.selectGender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('settings.genderMale')}</SelectItem>
                        <SelectItem value="female">{t('settings.genderFemale')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="preferred-language">{t('settings.language')}</Label>
                    <Select value={preferredLanguage} onValueChange={(value) => setPreferredLanguage(value as 'TR' | 'EN')}>
                      <SelectTrigger id="preferred-language">
                        <SelectValue placeholder={t('settings.selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TR">{t('settings.languageTurkish')}</SelectItem>
                        <SelectItem value="EN">{t('settings.languageEnglish')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2 sm:col-span-2">
                    <Label>{t('settings.interests')}</Label>
                    <p className="text-xs text-muted-foreground">{t('settings.interestsDescription')}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {labelsLoading ? (
                        <span className="text-sm text-muted-foreground">{t('settings.interestsLoading')}</span>
                      ) : availableLabels.length === 0 ? (
                        <span className="text-sm text-muted-foreground">{t('settings.interestsEmpty')}</span>
                      ) : (
                        availableLabels.map((label) => {
                          const isSelected = selectedLabelIds.includes(label.id);
                          return (
                            <Button
                              key={label.id}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="rounded-full"
                              onClick={() => toggleLabel(label.id)}
                            >
                              {label.name}
                            </Button>
                          );
                        })
                      )}
                    </div>
                    {!labelsLoading && availableLabels.length > 0 && selectedLabelIds.length === 0 && (
                      <p className="text-xs text-muted-foreground">{t('settings.interestsPlaceholder')}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                  {isSavingProfile ? t('common.loading') : t('settings.saveChanges')}
                </Button>
                {pendingEmail && (
                  <div className="mt-6 rounded-lg border border-dashed p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold">{t('settings.emailVerificationPendingTitle')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.emailVerificationPendingDescription', { email: pendingEmail })}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="verification-code">{t('settings.verificationCode')}</Label>
                      <Input
                        id="verification-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder={t('settings.verificationCodePlaceholder')}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={handleVerifyEmail} disabled={isVerifyingEmail}>
                        {isVerifyingEmail ? t('common.loading') : t('settings.verifyEmail')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {isTeacherUser && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.zoomIntegration')}</CardTitle>
                  <CardDescription>{t('profile.zoomDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoom-auth-link">{t('settings.zoomAuthLink')}</Label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        id="zoom-auth-link"
                        value={zoomAuthUrl}
                        readOnly
                        placeholder={t('settings.zoomAuthPlaceholder')}
                        className="sm:flex-1"
                      />
                      <Button type="button" variant="outline" onClick={handleCopyZoomUrl} disabled={!zoomAuthUrl}>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('settings.copyLink')}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleConnectZoom} disabled={isFetchingZoomLink}>
                    {isFetchingZoomLink ? t('common.loading') : t('settings.fetchZoomLink')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.changePassword')}</CardTitle>
                <CardDescription>
                  {t('settings.changePasswordDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">{t('settings.currentPassword')}</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">{t('settings.newPassword')}</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">{t('settings.confirmPassword')}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleChangePassword}>{t('settings.changePasswordButton')}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">{t('settings.warning')}</CardTitle>
                <CardDescription>
                  {t('settings.warningDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('settings.deleteAccount')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('settings.deleteAccountDescription')}
                  </p>
                  <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={(open) => {
                      if (isDeletingAccount) return;
                      setIsDeleteDialogOpen(open);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={isDeletingAccount}
                        className="w-full sm:w-auto"
                      >
                        {!isDeletingAccount && <Trash2 className="mr-2 h-4 w-4" />}
                        {isDeletingAccount ? t('common.loading') : t('settings.deleteAccount')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('settings.deleteAccount')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('settings.deleteAccountConfirm')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingAccount}>
                          {t('common.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDeletingAccount}
                          onClick={(event) => {
                            event.preventDefault();
                            handleDeleteAccount();
                          }}
                        >
                          {isDeletingAccount ? t('common.loading') : t('settings.deleteAccount')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

