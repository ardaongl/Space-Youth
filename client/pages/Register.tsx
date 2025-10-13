import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.name.length < 3) {
      toast({
        title: "Hata",
        description: "İsim en az 3 karakter olmalıdır.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Hata",
        description: "Geçerli bir e-posta adresi girin.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Hata",
        description: "Şifre en az 6 karakter olmalıdır.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return false;
    }

    if (!acceptTerms) {
      toast({
        title: "Hata",
        description: "Kullanım şartlarını kabul etmelisiniz.",
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token
        authService.setToken(data.token);
        
        toast({
          title: "Başarılı!",
          description: "Hesabınız oluşturuldu. Yönlendiriliyorsunuz...",
        });

        // Refetch user data
        await refetchUser();

        // Redirect to home (onboarding modal will be shown automatically)
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast({
          title: "Kayıt Başarısız",
          description: data.message || "Kayıt sırasında bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "Hata",
        description: "Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.",
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

    if (strength <= 2) return { strength, label: "Zayıf", color: "text-red-500" };
    if (strength <= 3) return { strength, label: "Orta", color: "text-amber-500" };
    return { strength, label: "Güçlü", color: "text-green-500" };
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
          Explore'a Dön
        </Link>

        <Card className="p-8 shadow-xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-4">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Hesap Oluştur</h1>
            <p className="text-muted-foreground">
              Space Youth topluluğuna katılmak için kayıt ol
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ahmet Yılmaz"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="h-11"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="h-11"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 6 karakter"
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
                        className={`h-1 w-6 rounded-full ${
                          i <= strength.strength
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifreni tekrar gir"
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
                      <span className="text-green-500">Şifreler eşleşiyor</span>
                    </>
                  ) : (
                    <span className="text-red-500">Şifreler eşleşmiyor</span>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
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
                  Kullanım Şartları
                </Link>
                {" "}ve{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı okudum ve kabul ediyorum.
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? "Kayıt Oluşturuluyor..." : "Hesap Oluştur"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                veya
              </span>
            </div>
          </div>

          {/* Social Register (Optional - for future) */}
          <div className="space-y-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-11"
              disabled
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google ile Devam Et
            </Button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Zaten hesabın var mı? </span>
            <Link 
              to="/login" 
              className="text-primary font-semibold hover:underline"
            >
              Giriş Yap
            </Link>
          </div>
        </Card>

        {/* Development Note */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-4 rounded-lg bg-amber-100 text-amber-800 text-sm">
            <strong>Geliştirme Modu:</strong> Backend hazır olduğunda kayıt işlevi çalışacak.
          </div>
        )}
      </div>
    </div>
  );
}

