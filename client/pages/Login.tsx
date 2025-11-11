import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apis } from "@/services";
import { email } from "zod/v4";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store";
import { IUserRoles, STUDENT_STATUS } from "@/types/user/user";
import { setStudent } from "@/store/slices/studentSlice";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verification_code: "",
  });
  const [showMockCredentials, setShowMockCredentials] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const auth_token = useAppSelector(state => state.user.token)
  const user = useAppSelector(state => state.user.user);
  
  // Get the page user was trying to access before login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (auth_token && user) {
      navigate(from, { replace: true });
    }
  }, [auth_token, user, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      console.log("formData," ,formData);
      
      const response = await apis.user.login(
        formData.email,
        formData.password,
        formData.verification_code ? formData.verification_code : undefined
      )
      console.log("Login response:", response);
      
      // Check if response is an axios error object
      if (response && typeof response === 'object' && ('isAxiosError' in response || 'code' in response)) {
        const error = response as any;
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          toast({
            title: "Bağlantı Hatası",
            description: "Backend'e bağlanılamadı. Lütfen backend'in çalıştığından emin olun.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Check if response has status property (normal axios response)
      if (!response || typeof response !== 'object' || !('status' in response)) {
        toast({
          title: "Hata",
          description: "Beklenmeyen bir yanıt alındı. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Check if response status is not 200
      if(response.status === 401){
        setShowVerificationCode(false);
        setVerificationMessage(null);
        toast({
          title: "Giriş Başarısız",
          description: response.data?.error?.message || "Email veya şifre hatalı.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if(response.status === 403){
        const errorType = response.data?.error?.type;
        const errorMessage = response.data?.error?.message;

        if ([
          "VerificationCodeRequired",
          "VerificationCodeExpired",
          "InvalidVerificationCode",
        ].includes(errorType)) {
          setShowVerificationCode(true);
          setVerificationMessage(
            errorMessage || "E-postana gönderilen doğrulama kodunu gir."
          );
          if (!formData.verification_code) {
            setFormData(prev => ({ ...prev, verification_code: "" }));
          }
        } else {
          setShowVerificationCode(false);
          setVerificationMessage(null);
        }

        toast({
          title: "Giriş Başarısız",
          description:
            errorMessage || "Giriş için ek doğrulama gerekiyor.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if(response.status === 404){
        setShowVerificationCode(false);
        setVerificationMessage(null);
        toast({
          title: "Giriş Başarısız",
          description: response.data?.error?.message || "Kullanıcı bulunamadı.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if(response.status !== 200){
        setShowVerificationCode(false);
        setVerificationMessage(null);
        toast({
          title: "Giriş Başarısız",
          description: response.data?.error?.message || "Email veya şifre hatalı.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if response has data and auth_token
      if (!response.data || !response.data.auth_token) {
        toast({
          title: "Hata",
          description: "Token alınamadı. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      setShowVerificationCode(false);
      setVerificationMessage(null);
      dispatch(setUserToken(response.data.auth_token))
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Hata",
        description: error?.message || "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    async function fetchUser() {
      try {
        const response:any = await apis.user.get_user();
        console.log("user : ", response);
        if(auth_token != ""){
          const firstName = response.data.first_name || "";
          const lastName = response.data.last_name || "";
          const fullName = `${firstName} ${lastName}`.trim() || firstName || lastName || response.data.email;
          const responseGender: "male" | "female" = response.data.gender?.toLowerCase() === "female" ? "female" : "male";
          const responseLanguage: "TR" | "EN" = response.data.language?.toUpperCase() === "EN" ? "EN" : "TR";
          const user = {
            id: response.data.id,
            name: fullName,
            email: response.data.email,
            role: response.data.role,
            age: typeof response.data.age === "number" ? response.data.age : null,
            gender: responseGender,
            language: responseLanguage,
            points: typeof response.data.points === "number" ? response.data.points : 0,
          }
          console.log("user", user);
          
          dispatch(setUser(user));
          if(user.role == IUserRoles.STUDENT){
            const student = {
              id: response.data.student.id,
              status: response.data.student.status,
              questions_and_answers: response.data.student.questions_and_answers
            }
            console.log("student => ", student);
            
            dispatch(setStudent(student));
            
            // Redirect based on student status
            setTimeout(() => {
              switch (student.status) {
                case STUDENT_STATUS.INCOMPLETE:
                case STUDENT_STATUS.PENDING:
                case STUDENT_STATUS.REJECTED:
                  // These will be handled by App.tsx status components - redirect to home
                  navigate("/");
                  break;
                case STUDENT_STATUS.APPROVED:
                  navigate(from);
                  break;
                default:
                  navigate(from);
              }
            }, 1000);
          } else {
            // Non-student users redirect to the page they were trying to access
            setTimeout(() => {
              navigate(from);
            }, 1000);
          }

        }
      } catch (error) {
        return error;
      }
    }

    fetchUser();
  }, [auth_token])

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 flex items-center justify-center p-4">
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
            <h1 className="text-2xl font-bold mb-2">Tekrar Hoş Geldin!</h1>
            <p className="text-muted-foreground">
              Öğrenme yolculuğuna devam etmek için giriş yap
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 w-full">
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

            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-11 pr-10"
                  autoComplete="current-password"
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
            </div>

            {showVerificationCode && (
              <div className="space-y-2 w-full">
                <Label htmlFor="verification_code">Doğrulama Kodu</Label>
                <Input
                  id="verification_code"
                  name="verification_code"
                  type="text"
                  placeholder="123456"
                  value={formData.verification_code}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-11"
                  autoComplete="one-time-code"
                />
                {verificationMessage && (
                  <p className="text-sm text-muted-foreground">
                    {verificationMessage}
                  </p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
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

          {/* Social Login (Optional - for future) */}
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

          {/* Register Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Henüz hesabın yok mu? </span>
            <Link 
              to="/register" 
              className="text-primary font-semibold hover:underline"
            >
              Kayıt Ol
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

