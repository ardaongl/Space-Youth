import React from "react";
import { Clock, CheckCircle, AlertCircle, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";
import { clearStudent } from "@/store/slices/studentSlice";
import { useNavigate } from "react-router-dom";

export default function PendingStatus() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearStudent());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('status.pending.title', 'Başvurunuz Onay Bekliyor')}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {t('status.pending.description', 
              'Başvurunuz başarıyla alınmıştır ve şu anda değerlendirme aşamasındadır. ' +
              'En kısa sürede size geri dönüş yapılacaktır. Lütfen sabırla bekleyiniz.'
            )}
          </p>

          {/* Status Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">
                {t('status.pending.step1', 'Başvuru Tamamlandı')}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">
                {t('status.pending.step2', 'Değerlendirme Aşamasında')}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <AlertCircle className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">
                {t('status.pending.step3', 'Sonuç Bekleniyor')}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              {t('status.pending.info', 
                'Değerlendirme süreci genellikle 2-3 iş günü sürmektedir. ' +
                'Sonuçlar e-posta adresinize gönderilecektir.'
              )}
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-xs text-gray-500 mb-6">
            <p>
              {t('status.pending.contact', 
                'Sorularınız için: info@spaceyouth.com'
              )}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('common.logout', 'Çıkış Yap')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
