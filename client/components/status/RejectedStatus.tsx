import React from "react";
import { XCircle, RefreshCw, Mail, ArrowLeft, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";
import { clearStudent } from "@/store/slices/studentSlice";

export default function RejectedStatus() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReapply = () => {
    // Navigate to registration or application page
    navigate("/register");
  };

  const handleContactSupport = () => {
    // Open email client or contact form
    window.location.href = "mailto:info@spaceyouth.com?subject=Başvuru Reddi Hakkında Bilgi";
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearStudent());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('status.rejected.title', 'Başvurunuz Reddedildi')}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {t('status.rejected.description', 
              'Maalesef bu sefer başvurunuz kabul edilememiştir. ' +
              'Ancak bu bir son değil! Gelişiminizi sürdürerek tekrar başvurabilirsiniz.'
            )}
          </p>

          {/* Reasons Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {t('status.rejected.possibleReasons', 'Olası Nedenler:')}
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• {t('status.rejected.reason1', 'Eksik veya yetersiz bilgi')}</li>
              <li>• {t('status.rejected.reason2', 'Kriterlere uygunluk')}</li>
              <li>• {t('status.rejected.reason3', 'Kontenjan sınırı')}</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleReapply}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('status.rejected.reapply', 'Tekrar Başvur')}</span>
            </button>

            <button
              onClick={handleContactSupport}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>{t('status.rejected.contact', 'Destek İle İletişim')}</span>
            </button>

            <button
              onClick={handleGoBack}
              className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('status.rejected.goBack', 'Ana Sayfaya Dön')}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('common.logout', 'Çıkış Yap')}</span>
            </button>
          </div>

          {/* Encouragement Message */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              {t('status.rejected.encouragement', 
                'Her reddedilme yeni bir fırsattır. Gelişiminizi sürdürün ve tekrar deneyin!'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
