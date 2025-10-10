# 📝 Kurs Ekleme Modal'ı

## ✅ Yapılan Değişiklikler

### Yeni Özellikler:
1. **AddCourseModal Component** oluşturuldu
2. "İçerik Ekle" butonuna tıklandığında modal açılıyor
3. Modal sadece **öğretmen** ve **admin** rollerine görünür
4. Video ekleme kısmı **yok** (istek üzerine çıkarıldı)

## 🎨 Modal İçeriği

### Sol Kolon - Medya
- 📸 **Medya Yükleme Alanı**
  - Drag & drop desteği
  - Dosya yükleme butonu
  - Maksimum 10 dosya
  - Görsel upload ikonu

### Orta Kolon - Ana Bilgiler
- 📝 **Başlık** (zorunlu)
  - Placeholder: "Açıklamayı buraya yazın"
  
- 📄 **Tam Açıklama** (zorunlu)
  - Rich text editor toolbar
  - Bold, Italic, Underline butonları
  - Normal/Başlık seçenekleri
  - 6 satır textarea

- ⚙️ **Seçenekler**
  - 📁 Kategori dropdown (Programlama, Tasarım, İş Geliştirme, Pazarlama)
  - ⏱️ Tahmini Süre dropdown (1-2, 3-5, 6-10, 10+ saat)
  - 👨‍🏫 Eğitmen dropdown
  - 🌍 Dil dropdown (Türkçe, İngilizce, Almanca)

### Sağ Kolon - Görünürlük & Fiyatlandırma
- 👁️ **Görünürlük**
  - Herkese Açık
  - Özel
  - Taslak

- 📅 **Zamanlama**
  - Toggle switch

- 💰 **Fiyatlandırma**
  - Normal Fiyat input
  - İndirimli Fiyat input
  - Radio buttons: Ücretli / Ücretsiz

## 🎯 Özellikler

### Modal Davranışı:
- ✅ Ekranın ortasında açılır
- ✅ Backdrop (karartma) ile arka plan kapatılır
- ✅ X butonu ile kapatılır
- ✅ "İptal" butonu ile kapatılır
- ✅ Responsive tasarım (max-w-5xl)
- ✅ Scroll desteği (max-h-90vh)
- ✅ Sticky header (kaydırırken üstte kalır)

### Form Validasyonu:
- Başlık ve Tam Açıklama **zorunlu** (required)
- Diğer alanlar opsiyonel

### Butonlar:
- **İptal**: Gri border, modal'ı kapatır
- **Kursu Oluştur**: Mor arka plan, formu submit eder

## 🔒 Güvenlik

### Rol Bazlı Erişim:
| Rol       | Modal Görünürlüğü | Buton Görünürlüğü |
|-----------|------------------|-------------------|
| Öğrenci   | ❌ Erişemez      | ❌ Göremez        |
| Öğretmen  | ✅ Erişebilir    | ✅ Görebilir      |
| Admin     | ✅ Erişebilir    | ✅ Görebilir      |

## 📁 Dosya Yapısı

```
client/components/Courses/
├── AddCourseButton.tsx      (Güncellendi - Modal açma)
└── AddCourseModal.tsx        (YENİ - Modal component)
```

## 🔧 Teknik Detaylar

### State Yönetimi:
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Modal Props:
```typescript
interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### Form State:
- title, description, fullDescription
- category, duration, trainer, language
- visibility, schedule
- regularPrice, salePrice, priceMode

### Styling:
- **Backdrop**: `bg-black bg-opacity-50`
- **Modal**: `bg-white rounded-xl shadow-2xl`
- **Max Width**: `max-w-5xl`
- **Max Height**: `max-h-[90vh]`
- **Grid**: `grid-cols-1 lg:grid-cols-3`

## 🚀 Kullanım

### Adım 1: Rol Seç
1. Sağ alttaki rol değiştiriciyi aç
2. "👨‍🏫 Öğretmen" veya "👑 Admin" seç

### Adım 2: Modal Aç
1. `/courses` sayfasına git
2. Sağ üstteki "İçerik Ekle" butonuna tıkla

### Adım 3: Form Doldur
1. Medya yükle (opsiyonel)
2. Başlık gir (zorunlu)
3. Tam açıklama yaz (zorunlu)
4. Seçenekleri doldur
5. Görünürlük ve fiyat ayarla

### Adım 4: Kaydet veya İptal
- "Kursu Oluştur" → Form submit edilir
- "İptal" veya X → Modal kapanır

## 📱 Responsive Tasarım

- **Desktop**: 3 kolon yan yana
- **Tablet/Mobile**: Kolonlar alt alta
- **Scroll**: Uzun içerik için kaydırma
- **Sticky Header**: Başlık her zaman görünür

## 🎨 Görsel Referans

```
┌────────────────────────────────────────────────────────┐
│  Yeni Kurs Ekle                                    [X] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Medya   │  │ Ana Bilgiler │  │ Görünürlük   │    │
│  │         │  │              │  │              │    │
│  │ [📸]    │  │ Başlık *     │  │ Görünürlük   │    │
│  │ Upload  │  │              │  │ [Dropdown]   │    │
│  │         │  │ Açıklama *   │  │              │    │
│  │         │  │ [Editor]     │  │ Zamanlama    │    │
│  │         │  │              │  │ [Toggle]     │    │
│  │         │  │ Seçenekler   │  │              │    │
│  │         │  │ - Kategori   │  │ Fiyatlandırma│    │
│  │         │  │ - Süre       │  │ [Inputs]     │    │
│  │         │  │ - Eğitmen    │  │              │    │
│  │         │  │ - Dil        │  │ [Radio]      │    │
│  └─────────┘  └──────────────┘  └──────────────┘    │
│                                                        │
│                          [İptal] [Kursu Oluştur]      │
└────────────────────────────────────────────────────────┘
```

## ⚠️ Önemli Notlar

1. **Video Ekleme**: İstek üzerine çıkarıldı, sadece medya upload var
2. **Backend Entegrasyonu**: `handleSubmit` fonksiyonunda TODO olarak bırakıldı
3. **Validasyon**: Şu an sadece HTML5 required attribute kullanılıyor
4. **Dosya Upload**: UI hazır, backend entegrasyonu gerekli

## 🔄 Sonraki Adımlar (Opsiyonel)

- [ ] Backend API entegrasyonu
- [ ] Dosya upload fonksiyonalitesi
- [ ] Form validasyonu (yup/zod)
- [ ] Loading state
- [ ] Success/Error toast bildirimleri
- [ ] Medya önizleme
- [ ] Rich text editor entegrasyonu (TinyMCE/Quill)

---

**Oluşturma Tarihi**: 2025-10-08  
**Durum**: ✅ Tamamlandı  
**Rol Kontrolü**: ✅ Aktif (Sadece Öğretmen & Admin)
