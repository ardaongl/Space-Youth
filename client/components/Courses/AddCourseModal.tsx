import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [trainer, setTrainer] = useState("");
  const [language, setLanguage] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [priceMode, setPriceMode] = useState("paid");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement course creation logic
    console.log("Kurs oluşturuluyor:", {
      title,
      fullDescription,
      category,
      duration,
      trainer,
      language,
      schedule,
      regularPrice,
      salePrice,
      priceMode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-800">{t('addCourseModal.addNewCourse')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Media */}
              <div className="lg:col-span-1 space-y-6">
                {/* Media Upload */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="px-4 pt-3 pb-2">
                    <span className="text-sm font-semibold text-gray-700">{t('addCourseModal.media')}</span>
                  </div>
                  <div className="px-4 pb-4">
                    <div
                      className="rounded-lg bg-indigo-50/40 border border-dashed border-indigo-300 p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                      role="button"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                          <ImageIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <p className="text-[13px] font-semibold text-gray-800">{t('addCourseModal.dropFileHere')}</p>
                        <p className="text-xs text-gray-500">{t('addCourseModal.or')} <button type="button" className="text-indigo-600 hover:underline font-medium">{t('addCourseModal.uploadFile')}</button></p>
                        <p className="text-[11px] text-gray-400 mt-1">{t('addCourseModal.maxFiles')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intro Video (compact) */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="px-4 pt-3 pb-2">
                    <span className="text-sm font-semibold text-gray-700">{t('addCourseModal.introVideo')}</span>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="rounded-lg overflow-hidden bg-gray-100">
                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full bg-center bg-cover" style={{backgroundImage: "url('/placeholder.svg')"}}>
                        <button type="button" className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 shadow flex items-center justify-center">
                          <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M8 5v14l11-7z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Main Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('addCourseModal.title')} <span className="text-red-500">{t('addCourseModal.required')}</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('addCourseModal.enterDescription')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('addCourseModal.fullDescription')} <span className="text-red-500">{t('addCourseModal.required')}</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center gap-2">
                      <select className="text-sm border-0 bg-transparent">
                        <option>{t('addCourseModal.normal')}</option>
                        <option>{t('addCourseModal.heading1')}</option>
                        <option>{t('addCourseModal.heading2')}</option>
                      </select>
                      <div className="flex gap-1 ml-2">
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <strong>B</strong>
                        </button>
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <em>I</em>
                        </button>
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <u>U</u>
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      placeholder={t('addCourseModal.enterDescription')}
                      rows={6}
                      className="w-full px-4 py-3 focus:outline-none resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">{t('addCourseModal.options')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">{t('addCourseModal.category')}</option>
                      <option value="programming">{t('addCourseModal.programming')}</option>
                      <option value="design">{t('addCourseModal.design')}</option>
                      <option value="business">{t('addCourseModal.business')}</option>
                      <option value="marketing">{t('addCourseModal.marketing')}</option>
                    </select>

                    {/* Duration */}
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">{t('addCourseModal.estimatedDuration')}</option>
                      <option value="1-2">{t('addCourseModal.duration1')}</option>
                      <option value="3-5">{t('addCourseModal.duration2')}</option>
                      <option value="6-10">{t('addCourseModal.duration3')}</option>
                      <option value="10+">{t('addCourseModal.duration4')}</option>
                    </select>

                    {/* Trainer */}
                    <select
                      value={trainer}
                      onChange={(e) => setTrainer(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">{t('addCourseModal.trainer')}</option>
                      <option value="trainer1">Ahmet Yılmaz</option>
                      <option value="trainer2">Ayşe Demir</option>
                      <option value="trainer3">Mehmet Kaya</option>
                    </select>

                    {/* Language */}
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">{t('addCourseModal.language')}</option>
                      <option value="tr">{t('addCourseModal.turkish')}</option>
                      <option value="en">{t('addCourseModal.english')}</option>
                      <option value="de">{t('addCourseModal.german')}</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-black-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                {t('addCourseModal.createCourse')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
