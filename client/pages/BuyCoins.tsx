import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";

// Coin paketleri
const coinPackages = [
  {
    id: "pack1",
    amount: 575,
    bonus: 0,
    price: 120,
    icon: "/placeholder.svg",
  },
  {
    id: "pack2",
    amount: 1380,
    bonus: 180,
    price: 250,
    icon: "/placeholder.svg",
  },
  {
    id: "pack3",
    amount: 2800,
    bonus: 400,
    price: 500,
    icon: "/placeholder.svg",
  },
  {
    id: "pack4",
    amount: 4500,
    bonus: 675,
    price: 800,
    popular: true,
    icon: "/placeholder.svg",
  },
  {
    id: "pack5",
    amount: 6500,
    bonus: 1000,
    price: 1150,
    icon: "/placeholder.svg",
  },
  {
    id: "pack6",
    amount: 13500,
    bonus: 2475,
    price: 2300,
    icon: "/placeholder.svg",
  },
  {
    id: "pack7",
    amount: 33500,
    bonus: 5275,
    price: 5625,
    icon: "/placeholder.svg",
  },
  {
    id: "pack8",
    amount: 60200,
    bonus: 10650,
    price: 9950,
    icon: "/placeholder.svg",
  },
];

// Ödeme yöntemleri
const paymentMethods = [
  {
    id: "credit-card",
    name: "Kredi/Banka Kartı",
    description: "Visa, Mastercard",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Güvenli ödeme",
  },

];

export default function BuyCoins() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  
  // Kart bilgileri state'leri
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [rememberCard, setRememberCard] = useState(false);

  const selectedPack = coinPackages.find((p) => p.id === selectedPackage);

  const handleContinue = () => {
    if (currentStep === 1 && selectedPackage) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedPayment) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Kart bilgilerini doğrula
      if (cardName && cardNumber && expiry && cvc) {
        setCurrentStep(4);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Kart numarası formatla (16 haneli, 4'lü gruplar)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Expiry formatla (MM/YY)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + " / " + v.substring(2, 4);
    }
    return v;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all",
                        currentStep >= step
                          ? "bg-amber-500 border-amber-400 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      )}
                    >
                      {currentStep > step ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        step
                      )}
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-sm font-semibold uppercase tracking-wider",
                        currentStep >= step ? "text-amber-500" : "text-gray-500"
                      )}
                    >
                      {step === 1 && t('coins.step1')}
                      {step === 2 && t('coins.step2')}
                      {step === 3 && t('coins.step3')}
                      {step === 4 && t('coins.step4')}
                    </p>
                  </div>

                  {/* Connecting Line */}
                  {index < 3 && (
                    <div
                      className={cn(
                        "w-32 h-1 mx-4 transition-all",
                        currentStep > step ? "bg-amber-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Adım 1: Coin Seçimi */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t('coins.selectPackage')}
                </h1>
                <p className="text-gray-600">
                  {t('coins.selectPackageDescription')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {coinPackages.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPackage(pack.id)}
                    className={cn(
                      "relative bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all shadow-sm",
                      selectedPackage === pack.id
                        ? "border-amber-500 ring-2 ring-amber-500/50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
{t('coins.popular')}
                      </div>
                    )}

                      <div className="flex flex-col items-center space-y-3">
                      {/* Coin Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 text-white" />
                      </div>

                      {/* Amount */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {pack.amount}
                          </span>
                          <span className="text-amber-500 font-bold">{t('coins.coin')}</span>
                        </div>  
                        {pack.bonus > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {pack.amount - pack.bonus} {t('coins.coin')} + {pack.bonus} {t('coins.bonus')}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 w-full">
                        <p className="text-center text-amber-600 font-bold text-xl">
                          ₺{pack.price}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={!selectedPackage}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-12"
                >
{t('common.continue')}
                </Button>
              </div>
            </div>
          )}

          {/* Adım 2: Ödeme Yöntemi Seçimi */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t('coins.paymentMethod')}
                </h1>
                <p className="text-gray-600">
                  {t('coins.paymentMethodDescription')}
                </p>
              </div>

              {/* Seçilen Paket Özeti */}
              {selectedPack && (
                <div className="bg-white border-2 border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-xl">
                          {selectedPack.amount} {t('coins.coin')}
                        </p>
                        {selectedPack.bonus > 0 && (
                          <p className="text-gray-500 text-sm">
                            {selectedPack.amount - selectedPack.bonus} {t('coins.coin')} +{" "}
                            {selectedPack.bonus} {t('coins.bonus')}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-amber-600 font-bold text-2xl">
                      ₺{selectedPack.price}
                    </p>
                  </div>
                </div>
              )}

              {/* Ödeme Yöntemleri */}
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={cn(
                      "w-full bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all text-left shadow-sm",
                      selectedPayment === method.id
                        ? "border-amber-500 ring-2 ring-amber-500/50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-gray-900 font-bold text-lg">
                          {method.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {method.description}
                        </p>
                      </div>
                      {selectedPayment === method.id && (
                        <Check className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Button
                  size="lg"
                  onClick={handleBack}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12"
                >
{t('common.back')}
                </Button>
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={!selectedPayment}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-12"
                >
{t('coins.completePayment')}
                </Button>
              </div>
            </div>
          )}

          {/* Adım 3: Kart Bilgileri */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t('coins.enterCardDetails')}
                </h1>
                <p className="text-gray-600">
                  {t('coins.completePaymentSecurely')}
                </p>
              </div>

              {/* Seçilen Paket Özeti */}
              {selectedPack && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-xl">
                          {selectedPack.amount} {t('coins.coin')}
                        </p>
                        {selectedPack.bonus > 0 && (
                          <p className="text-gray-600 text-sm">
                            {selectedPack.amount - selectedPack.bonus} {t('coins.coin')} +{" "}
                            {selectedPack.bonus} {t('coins.bonus')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">{t('coins.total')}</p>
                      <p className="text-amber-600 font-bold text-3xl">
                        ₺{selectedPack.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              

              {/* Kart Bilgileri Formu */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
                {/* Kart Sahibi Adı */}
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-gray-700 font-medium">
                    {t('coins.cardName')}
                  </Label>
                  <Input
                    id="cardName"
                    placeholder="AHMET YILMAZ"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="h-12 text-lg bg-gray-50 border-gray-300 text-indigo-600 font-semibold uppercase"
                  />
                </div>

                {/* Kart Numarası */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-gray-700 font-medium">
                    {t('coins.cardNumber')}
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-red-500 opacity-80"></div>
                      <div className="w-8 h-8 rounded-full bg-orange-500 opacity-80 -ml-3"></div>
                    </div>
                    <Input
                      id="cardNumber"
                      placeholder="9870 3456 7890 6473"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="h-12 text-lg pl-20 bg-gray-50 border-gray-300 text-indigo-600 font-semibold"
                    />
                  </div>
                </div>

                {/* Expiry ve CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-gray-700 font-medium">
                      {t('coins.expiryDate')}
                    </Label>
                    <Input
                      id="expiry"
                      placeholder="03 / 25"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={7}
                      className="h-12 text-lg bg-gray-50 border-gray-300 text-indigo-600 font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc" className="text-gray-700 font-medium">
                      {t('coins.cvc')}
                    </Label>
                    <Input
                      id="cvc"
                      placeholder="654"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={3}
                      className="h-12 text-lg bg-gray-50 border-gray-300 text-indigo-600 font-semibold"
                    />
                  </div>
                </div>

                {/* Remember Card */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="remember"
                    checked={rememberCard}
                    onCheckedChange={(checked) => setRememberCard(checked as boolean)}
                    className="border-indigo-300"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
{t('coins.rememberCard')}
                  </label>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Button
                  size="lg"
                  onClick={handleBack}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12"
                >
{t('common.back')}
                </Button>
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={!cardName || !cardNumber || !expiry || !cvc}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-12"
                >
{t('coins.payNow')}
                </Button>
              </div>
            </div>
          )}

          {/* Adım 4: Sipariş Tamamlandı */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto text-center">
              <div className="bg-white border-2 border-amber-200 rounded-xl p-12 shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t('coins.orderCompleted')}
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  {t('coins.coinsAddedSuccessfully')}
                </p>

                {selectedPack && (
                  <div className="bg-amber-50 rounded-lg p-6 mb-8 border border-amber-200">
                    <p className="text-amber-600 font-bold text-3xl mb-2">
                      +{selectedPack.amount} {t('coins.coin')}
                    </p>
                    <p className="text-gray-600">{t('coins.addedToAccount')}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/")}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-12 w-full"
                  >
{t('coins.backToHome')}
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/courses")}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12 w-full"
                  >
{t('coins.goToCourses')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

