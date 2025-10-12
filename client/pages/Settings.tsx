import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Shield,
  Lock,
  Eye,
  Palette,
  Trash2,
  Globe,
  Mail,
  Camera,
  CreditCard,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Download,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { auth, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  // URL'den tab parametresini oku
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "notifications", "security", "privacy", "appearance", "payment"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Profile state
  const [fullName, setFullName] = useState(auth.user?.name || "");
  const [email, setEmail] = useState(auth.user?.email || "");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [workshopNotifications, setWorkshopNotifications] = useState(true);

  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Privacy settings
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  // Appearance settings
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("tr");

  // Payment settings
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState([
    {
      id: "card1",
      type: "bank",
      name: "ICICI Bank",
      accountHolder: "Rafiqur Rahman",
      number: "5344 **** **** 5755",
      bankName: "First Century Bank",
      routing: "061120099",
      accountNumber: "4534 3455 3453 5755",
    },
    {
      id: "card2",
      type: "mastercard",
      name: "Mastercard",
      number: "5344 **** **** 5755",
      expiry: "12/2023",
    },
    {
      id: "card3",
      type: "visa",
      name: "Visa",
      number: "5344 **** **** 5755",
      expiry: "12/2023",
    },
  ]);

  const [paymentHistory] = useState([
    {
      id: "1",
      invoice: "Ft #453",
      billingTo: "Brooklyn Simmons",
      status: "Ödendi",
      date: "5 Şub 2023",
      amount: "₺4,500",
      for: "Coin Paketi 1",
    },
    {
      id: "2",
      invoice: "Ft #454",
      billingTo: "Jerome Bell",
      status: "Ödendi",
      date: "5 Şub 2023",
      amount: "₺4,500",
      for: "Coin Paketi 2",
    },
  ]);

  const handleSaveProfile = () => {
    toast({
      title: "Profil Güncellendi",
      description: "Profil bilgileriniz başarıyla güncellendi.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Bildirim Ayarları Kaydedildi",
      description: "Bildirim tercihleriniz başarıyla güncellendi.",
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Şifre Değiştirildi",
      description: "Şifreniz başarıyla değiştirildi.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Gizlilik Ayarları Kaydedildi",
      description: "Gizlilik tercihleriniz başarıyla güncellendi.",
    });
  };

  const handleSaveAppearance = () => {
    toast({
      title: "Görünüm Ayarları Kaydedildi",
      description: "Görünüm tercihleriniz başarıyla güncellendi.",
    });
  };

  const handleDeleteAccount = () => {
    if (confirm("Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      toast({
        title: "Hesap Silindi",
        description: "Hesabınız başarıyla silindi.",
        variant: "destructive",
      });
      logout();
    }
  };

  const handleRemoveCard = (cardId: string) => {
    if (confirm("Bu ödeme yöntemini silmek istediğinizden emin misiniz?")) {
      setSavedCards(savedCards.filter(card => card.id !== cardId));
      toast({
        title: "Kart Silindi",
        description: "Ödeme yöntemi başarıyla kaldırıldı.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
          <p className="text-muted-foreground">
            Hesap ayarlarınızı ve tercihlerinizi yönetin
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Bildirimler</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Güvenlik</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Gizlilik</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Görünüm</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Ödeme</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Hesap</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>
                  Profilinizi görüntüleyin ve düzenleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">
                        {auth.user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold">{auth.user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{auth.user?.role}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Fotoğraf Değiştir
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Ad Soyad</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ad Soyad"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveProfile}>Değişiklikleri Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Tercihleri</CardTitle>
                <CardDescription>
                  Nasıl bildirim almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notif" className="text-base">
                        E-posta Bildirimleri
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        E-posta ile bildirim alın
                      </p>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notif" className="text-base">
                        Anlık Bildirimler
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Tarayıcı üzerinden bildirim alın
                      </p>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-notif" className="text-base">
                        Görev Bildirimleri
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Yeni görevler ve güncellemeler hakkında bildirim alın
                      </p>
                    </div>
                    <Switch
                      id="task-notif"
                      checked={taskNotifications}
                      onCheckedChange={setTaskNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="workshop-notif" className="text-base">
                        Kurs Bildirimleri
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Yeni kurslar hakkında bildirim alın
                      </p>
                    </div>
                    <Switch
                      id="workshop-notif"
                      checked={workshopNotifications}
                      onCheckedChange={setWorkshopNotifications}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveNotifications}>Değişiklikleri Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Şifre Değiştir</CardTitle>
                <CardDescription>
                  Güvenliğiniz için güçlü bir şifre kullanın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Mevcut Şifre</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">Yeni Şifre</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleChangePassword}>Şifreyi Değiştir</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İki Faktörlü Kimlik Doğrulama</CardTitle>
                <CardDescription>
                  Hesabınıza ekstra bir güvenlik katmanı ekleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="2fa" className="text-base">
                      İki Faktörlü Doğrulama
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Giriş yaparken telefonunuzdan onay alın
                    </p>
                  </div>
                  <Switch
                    id="2fa"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gizlilik Ayarları</CardTitle>
                <CardDescription>
                  Profilinizin ve bilgilerinizin görünürlüğünü kontrol edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-email" className="text-base">
                        E-posta Göster
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        E-posta adresinizi profilinizde göster
                      </p>
                    </div>
                    <Switch
                      id="show-email"
                      checked={showEmail}
                      onCheckedChange={setShowEmail}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-progress" className="text-base">
                        İlerleme Göster
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Kurs ve görev ilerlemenizi diğer kullanıcılara göster
                      </p>
                    </div>
                    <Switch
                      id="show-progress"
                      checked={showProgress}
                      onCheckedChange={setShowProgress}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSavePrivacy}>Değişiklikleri Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Görünüm</CardTitle>
                <CardDescription>
                  Uygulamanın görünümünü ve hissini özelleştirin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Tema seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Açık</SelectItem>
                        <SelectItem value="dark">Koyu</SelectItem>
                        <SelectItem value="system">Sistem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="language">Dil</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Dil seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveAppearance}>Değişiklikleri Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ödeme Yöntemleri</CardTitle>
                    <CardDescription>
                      Ödeme yöntemlerinizi yönetin
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/buy-coins')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Ekle
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className="border rounded-lg p-4 hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Card Icon */}
                        <div className="mt-1">
                          {card.type === "bank" && (
                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7v2h20V7l-10-5zM4 11v8h2v-8H4zm5 0v8h2v-8H9zm4 0v8h2v-8h-2zm5 0v8h2v-8h-2zM2 21h20v2H2v-2z"/>
                              </svg>
                            </div>
                          )}
                          {card.type === "mastercard" && (
                            <div className="flex items-center gap-0.5">
                              <div className="w-6 h-6 rounded-full bg-red-500 opacity-80"></div>
                              <div className="w-6 h-6 rounded-full bg-orange-500 opacity-80 -ml-2"></div>
                            </div>
                          )}
                          {card.type === "visa" && (
                            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                              VISA
                            </div>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{card.name}</h3>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleRemoveCard(card.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Düzenle"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {expandedCard === card.id ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex gap-6 text-sm text-gray-600">
                            {card.type === "bank" && (
                              <>
                                <div>
                                  <span className="text-gray-500">Hesap:</span> {card.accountHolder}
                                </div>
                                <div>
                                  <span className="text-gray-500">Numara:</span> {card.number}
                                </div>
                              </>
                            )}
                            {(card.type === "mastercard" || card.type === "visa") && (
                              <>
                                <div>
                                  <span className="text-gray-500">Son Kullanma:</span> {card.expiry}
                                </div>
                                <div>
                                  <span className="text-gray-500">Numara:</span> {card.number}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Expanded Details */}
                          {expandedCard === card.id && card.type === "bank" && (
                            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">Banka Adı</p>
                                <p className="font-medium">{card.bankName}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Mevcut Bakiye:</p>
                                <p className="font-medium text-lg">₺12,000</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Routing (ABA):</p>
                                <p className="font-medium">{card.routing}</p>
                              </div>
                              <div className="col-span-2 flex gap-2">
                                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  Para Yatır
                                </Button>
                                <Button variant="outline" size="sm">
                                  Para Çek
                                </Button>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Hesap Numarası:</p>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{card.accountNumber}</p>
                                  <button className="text-amber-600 text-xs flex items-center gap-1">
                                    <span>Kopyala</span>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ödeme Geçmişi</CardTitle>
                    <CardDescription>
                      Geçmiş ödemelerinizi görüntüleyin
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Tümünü Gör
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-gray-600">
                        <th className="pb-3 font-medium">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="pb-3 font-medium">Fatura</th>
                        <th className="pb-3 font-medium">Alıcı</th>
                        <th className="pb-3 font-medium">Durum</th>
                        <th className="pb-3 font-medium">Ödeme Tarihi</th>
                        <th className="pb-3 font-medium">Tutar</th>
                        <th className="pb-3 font-medium">Ödeme Nedeni</th>
                        <th className="pb-3 font-medium">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b last:border-0">
                          <td className="py-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="py-4">
                            <span className="text-sm font-medium">{payment.invoice}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-semibold text-red-600">
                                  {payment.billingTo.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm">{payment.billingTo}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600">{payment.date}</td>
                          <td className="py-4 text-sm font-medium">{payment.amount}</td>
                          <td className="py-4 text-sm text-gray-600">{payment.for}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <button className="text-gray-400 hover:text-gray-600">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Uyarı!</CardTitle>
                <CardDescription>
                  Bu işlemler geri alınamaz. Dikkatli olun.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Hesabı Sil</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak silinecektir.
                    Bu işlem geri alınamaz.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hesabı Sil
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

