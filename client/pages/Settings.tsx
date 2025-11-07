import React, { useState, useEffect } from "react";
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
import { User, Shield, Trash2, Mail } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { clearUser } from "@/store/slices/userSlice";
import { apis } from "@/services";

export default function Settings() {
  const user = useAppSelector(state => state.user);

  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  const rawUser = user.user as {
    name?: string;
    email?: string;
    age?: number;
    gender?: string;
  } | undefined;

  // URL'den tab parametresini oku
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "security", "account"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Profile state
  const initialName = rawUser?.name || "";
  const initialNameParts = initialName.trim().split(" ").filter(Boolean);
  const [firstName, setFirstName] = useState(initialNameParts[0] || "");
  const [lastName, setLastName] = useState(initialNameParts.slice(1).join(" ") || "");
  const [age, setAge] = useState(rawUser?.age ? String(rawUser.age) : "");
  const [gender, setGender] = useState<string>(rawUser?.gender ?? "other");
  const [email, setEmail] = useState(rawUser?.email || "");
 
  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = () => {
    toast({
      title: t('settings.profileUpdated'),
      description: t('settings.profileUpdatedDescription'),
    });
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

  const handleDeleteAccount = () => {
    if (confirm(t('settings.deleteAccountConfirm'))) {
      toast({
        title: t('settings.accountDeleted'),
        description: t('settings.accountDeletedDescription'),
        variant: "destructive",
      });
      dispatch(clearUser())
    }
  };

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
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder={t('settings.selectGender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('settings.genderMale')}</SelectItem>
                        <SelectItem value="female">{t('settings.genderFemale')}</SelectItem>
                        <SelectItem value="other">{t('settings.genderOther')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveProfile}>{t('settings.saveChanges')}</Button>
              </CardContent>
            </Card>
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
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('settings.deleteAccount')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

