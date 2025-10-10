# 🎭 Rol Bazlı Erişim Test Rehberi

## 🚀 Nasıl Kullanılır?

### 1️⃣ Uygulamayı Başlatın
```bash
npm run dev
```

### 2️⃣ Rol Değiştirici Butonu Kullanın

Uygulama açıldığında **sağ alt köşede** iki buton göreceksiniz:

- **Üstteki mor buton**: 🎭 **Rol Değiştirici** (varsayılan: 👨‍🎓 Öğrenci)
- **Alttaki siyah buton**: Sorulara dön

### 3️⃣ Farklı Rolleri Test Edin

Mor butona tıklayın ve açılan menüden rol seçin:

#### 👨‍🎓 **Öğrenci Rolü**
- **Kullanıcı**: Ahmet Öğrenci
- **Beklenen Davranış**: 
  - `/courses` sayfasında **"Kurs Ekle" butonu GÖRÜNMEZ** ❌
  - Sadece kursları görebilir

#### 👨‍🏫 **Öğretmen Rolü**
- **Kullanıcı**: Ayşe Öğretmen
- **Beklenen Davranış**:
  - `/courses` sayfasında **"Kurs Ekle" butonu GÖRÜNÜR** ✅
  - Buton sağ üst köşede, sayfa başlığının yanında
  - Kurs oluşturabilir

#### 👑 **Admin Rolü**
- **Kullanıcı**: Mehmet Admin
- **Beklenen Davranış**:
  - `/courses` sayfasında **"Kurs Ekle" butonu GÖRÜNÜR** ✅
  - Tüm yönetim yetkilerine sahip

## 📋 Test Adımları

### Test 1: Öğrenci Rolü
1. Rol değiştiriciyi aç
2. **"👨‍🎓 Öğrenci"** seçeneğine tıkla
3. `/courses` sayfasına git
4. ✅ **"Kurs Ekle" butonu görünmemeli**
5. Console'da: `🔄 Rol değiştirildi: Ahmet Öğrenci (student)` mesajını gör

### Test 2: Öğretmen Rolü
1. Rol değiştiriciyi aç
2. **"👨‍🏫 Öğretmen"** seçeneğine tıkla
3. `/courses` sayfasına git
4. ✅ **"Kurs Ekle" butonu görünmeli** (sağ üstte)
5. Console'da: `🔄 Rol değiştirildi: Ayşe Öğretmen (teacher)` mesajını gör

### Test 3: Admin Rolü
1. Rol değiştiriciyi aç
2. **"👑 Admin"** seçeneğine tıkla
3. `/courses` sayfasına git
4. ✅ **"Kurs Ekle" butonu görünmeli** (sağ üstte)
5. Console'da: `🔄 Rol değiştirildi: Mehmet Admin (admin)` mesajını gör

### Test 4: Sayfa Yenileme (F5)
1. Öğretmen veya Admin rolü seç
2. `/courses` sayfasında "Kurs Ekle" butonunu gör
3. **F5** tuşuna bas (sayfa yenile)
4. ✅ **Buton hala görünmeli** (rol korunmalı)

## 🎨 Görsel Referans

```
┌─────────────────────────────────────────────┐
│  Courses                    [+ Kurs Ekle]   │  ← Öğretmen/Admin'de görünür
│  Improve your skills...                     │
│                                             │
│  [All] [UX] [PM]                           │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Course 1 │ │ Course 2 │ │ Course 3 │   │
│  └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────┘
                                    [🎭 Rol]  ← Sağ alt köşe
                              [Sorulara dön]
```

## 🔍 Debug İpuçları

### Console'da Mevcut Rolü Kontrol Et
```javascript
// Browser console'da çalıştır:
JSON.parse(localStorage.getItem('persist:root'))?.user
```

### Redux State'i İncele
React DevTools > Redux > State > user
- `user.role`: Mevcut rol
- `user.name`: Kullanıcı adı
- `user.token`: Token durumu

### Buton Neden Görünmüyor?
1. **Console'da hata var mı?** → F12 > Console
2. **Rol doğru mu?** → Rol değiştiriciyi kontrol et
3. **AuthProvider yüklendi mi?** → Redux state'te user var mı?
4. **Doğru sayfada mısın?** → `/courses` sayfasında olmalısın

## 🛠️ Teknik Detaylar

### Rol Değiştirici Nasıl Çalışır?
- **Dosya**: `client/components/dev/RoleSwitcher.tsx`
- **Çalışma**: Redux store'daki `user` state'ini günceller
- **Görünürlük**: Sadece `import.meta.env.DEV === true` iken görünür
- **Production'da**: Otomatik olarak gizlenir

### Mock Kullanıcılar
```typescript
{
  student: { id: "student-1", name: "Ahmet Öğrenci", role: "student" },
  teacher: { id: "teacher-1", name: "Ayşe Öğretmen", role: "teacher" },
  admin: { id: "admin-1", name: "Mehmet Admin", role: "admin" }
}
```

### İzin Kontrolü
```typescript
// utils/roles.ts
canSeeAddCourse(role) → role === "teacher" || role === "admin"
```

## ⚠️ Önemli Notlar

1. **Sadece Development Modunda**: Rol değiştirici sadece `npm run dev` ile çalışırken görünür
2. **Production'da**: Backend'den gelen gerçek roller kullanılır
3. **Güvenlik**: Bu sadece UI kontrolü, backend'te de yetki kontrolü olmalı
4. **Token**: Development modunda mock token (`dev-token`) kullanılır

## 🎯 Kabul Kriterleri

- ✅ Öğrenci rolünde "Kurs Ekle" butonu görünmez
- ✅ Öğretmen rolünde "Kurs Ekle" butonu görünür
- ✅ Admin rolünde "Kurs Ekle" butonu görünür
- ✅ Rol değişikliği anında etkili olur
- ✅ Sayfa yenileme sonrası rol korunur
- ✅ Console'da rol değişikliği mesajı görünür

## 📞 Sorun mu var?

Eğer buton görünmüyorsa veya rol değişmiyorsa:
1. Sayfayı yenile (F5)
2. Browser cache'i temizle (Ctrl+Shift+Delete)
3. Console'da hata mesajlarını kontrol et
4. Redux DevTools ile state'i incele

---

**Hazırlayan**: Cascade AI  
**Tarih**: 2025-10-08  
**Versiyon**: 1.0
