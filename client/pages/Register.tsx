import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";
import { Switch } from "@/components/ui/switch";
import { useAppSelector } from "@/store";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const auth_token = useAppSelector(state => state.user.token);
  const user = useAppSelector(state => state.user.user);

  // Redirect if already logged in
  useEffect(() => {
    if (auth_token && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth_token, user, navigate]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  type RegisterFormData = {
    firstname: string;
    lastname: string;
    role: "student" | "teacher" | "admin" | string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const [formData, setFormData] = useState<RegisterFormData>({
    firstname: "",
    lastname: "",
    role: "student",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: t('auth.error'),
        description: t('auth.fillAllFields'),
        variant: "destructive",
      });
      return false;
    }

    if (formData.firstname.length < 2) {
      toast({
        title: t('auth.error'),
        description: t('auth.nameMinLength'),
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t('auth.error'),
        description: t('auth.validEmail'),
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('auth.error'),
        description: t('auth.passwordMinLength'),
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('auth.error'),
        description: t('auth.passwordsDoNotMatch'),
        variant: "destructive",
      });
      return false;
    }

    if (!acceptTerms) {
      toast({
        title: t('auth.error'),
        description: t('auth.acceptTerms'),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Backend register API call
      const response = await apis.user.register(
        formData.firstname,
        formData.lastname,
        formData.role,
        formData.email,
        formData.password
      );

      console.log(response);

      if (response.status == 200) {
        toast({
          title: "Kayıt başarılı",
          description: "Kullanıcı kaydı tamamlandı"
        })

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast({
          title: "Kayıt başarısız",
          description: "Kullanıcı kaydı tamamlanamadı"
        })
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: t('auth.error'),
        description: t('auth.registerError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: t('auth.weak'), color: "text-red-500" };
    if (strength <= 3) return { strength, label: t('auth.medium'), color: "text-amber-500" };
    return { strength, label: t('auth.strong'), color: "text-green-500" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 flex items-center justify-center p-4 py-12">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Back to Explore */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('auth.backToExplore')}
        </Link>

        <Card className="p-8 shadow-xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-4">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('auth.createAccount')}</h1>
            <p className="text-muted-foreground">
              {t('auth.registerDescription')}
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">{t('auth.firstName')}</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder={t('auth.firstNamePlaceholder')}
                value={formData.firstname}
                onChange={handleChange}
                disabled={isLoading}
                className="h-11"
                autoComplete="firstname"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="name">{t('auth.lastName')}</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder={t('auth.lastNamePlaceholder')}
                value={formData.lastname}
                onChange={handleChange}
                disabled={isLoading}
                className="h-11"
                autoComplete="lastname"
              />
            </div>


            {/* Role Toggle: Student (off) / Teacher (on) */}
            <div className="flex items-center justify-between rounded-md border px-3 py-3 w-full">
              <div className="space-y-0.5">
                <Label htmlFor="roleSwitch" className="text-sm font-medium">
                  Öğretmen olarak kaydol
                </Label>
                <p className="text-xs text-muted-foreground">Kapalı: Öğrenci, Açık: Öğretmen</p>
              </div>
              <Switch
                id="roleSwitch"
                checked={formData.role === "teacher"}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, role: checked ? "teacher" : "student" })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="h-11"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.passwordMinPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-11 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className={strength.color + " font-medium"}>
                    {strength.label}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 w-6 rounded-full ${i <= strength.strength
                            ? strength.strength <= 2
                              ? "bg-red-500"
                              : strength.strength <= 3
                                ? "bg-amber-500"
                                : "bg-green-500"
                            : "bg-muted"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-11 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">{t('auth.passwordsMatch')}</span>
                    </>
                  ) : (
                    <span className="text-red-500">{t('auth.passwordsDoNotMatch')}</span>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 w-full">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                <Link to="/terms" className="text-primary hover:underline">
                  {t('auth.termsOfService')}
                </Link>
                {" "}{t('auth.and')}{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  {t('auth.privacyPolicy')}
                </Link>
                {t('auth.termsAcceptance')}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t('auth.or')}
              </span>
            </div>
          </div>



          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t('auth.alreadyHaveAccount')} </span>
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              {t('auth.login')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

