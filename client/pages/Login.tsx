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
import { mapStudentResponseToState } from "@/utils/student";

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
          const labels = Array.isArray(response.data.labels)
            ? response.data.labels
                .filter((label: any) => typeof label?.id === "number" && typeof label?.name === "string")
                .map((label: any) => ({ id: label.id, name: label.name }))
            : [];
          const user = {
            id: response.data.id,
            name: fullName,
            email: response.data.email,
            role: response.data.role,
            age: typeof response.data.age === "number" ? response.data.age : null,
            gender: responseGender,
            language: responseLanguage,
            points: typeof response.data.points === "number" ? response.data.points : 0,
            labels,
          }
          console.log("user", user);
          
          dispatch(setUser(user));
          if(user.role == IUserRoles.STUDENT){
            const mappedStudent = mapStudentResponseToState(response.data);
            if (mappedStudent) {
              console.log("student => ", mappedStudent);
              dispatch(setStudent(mappedStudent));
            }
            
            // Redirect based on student status
            setTimeout(() => {
              switch (mappedStudent?.status) {
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

