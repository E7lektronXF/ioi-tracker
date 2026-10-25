# IOI Tracker — Kurulum

Terminal gerekmez; her şey tarayıcıdan yapılır. Toplam ~15 dakika.

```
Supabase (veritabanı + giriş)  ←→  GitHub Pages (site)  ←→  Windows · iPad · iPhone
```

## 1. Supabase projesi aç
1. https://supabase.com → **Start your project** → GitHub hesabınla giriş yap.
2. **New project** → Name: `ioi-tracker` · Region: **Central EU (Frankfurt)** · Database password: **Generate** (bir yere kaydet, uygulama için gerekmiyor).
3. **Create new project** → ~2 dakika hazırlanmasını bekle.

## 2. Tabloları kur
1. Sol menü **SQL Editor** → **New query**.
2. Bu klasördeki `schema.sql` dosyasını Not Defteri ile aç, tamamını kopyala, editöre yapıştır.
3. **Run** → altta "Success. No rows returned" görmelisin.

## 3. Kendi kullanıcını oluştur
1. Sol menü **Authentication** → **Users** → **Add user** → **Create new user**.
2. E-posta + şifre yaz, **Auto Confirm User** işaretli olsun → **Create user**.
3. **Authentication** → **Sign In / Providers** → **Allow new users to sign up** seçeneğini **kapat** → **Save**.
   (Böylece senden başka kimse hesap açamaz.)

## 4. Bağlantı bilgilerini al
1. **Project Settings** (dişli) → **API Keys** (veya **Data API**).
2. İki değeri kopyala:
   - **Project URL** → `https://xxxx.supabase.co`
   - **Publishable key** → `sb_publishable_...` (eski projelerde: `anon` `public` anahtarı)
3. `config.js` dosyasını Not Defteri ile aç, tırnakların arasına yapıştır, kaydet.
   (Ya da iki değeri Claude'a gönder, o doldursun. Bu anahtar herkese açık olacak şekilde tasarlanmıştır; verilerini 2. adımdaki güvenlik kuralları korur. **service_role / secret** anahtarını asla paylaşma.)

## 5. GitHub'a yükle
1. https://github.com → sağ üst **+** → **New repository** → Name: `ioi-tracker` · **Public** → **Create repository**.
2. Açılan sayfada **uploading an existing file** bağlantısına tıkla.
3. `tracker` klasörünün **içindeki** tüm dosyaları ve `icons` klasörünü sürükleyip bırak.
4. **Commit changes**.

## 6. Siteyi yayına al
1. Repo → **Settings** → sol menü **Pages**.
2. Source: **Deploy from a branch** · Branch: **main** · klasör: **/ (root)** → **Save**.
3. 1–2 dakika sonra adres: `https://KULLANICI-ADIN.github.io/ioi-tracker/`

## 7. Cihazlara uygulama olarak ekle
- **iPhone / iPad:** Safari'de adresi aç → **Paylaş** → **Ana Ekrana Ekle**.
- **Windows:** Edge veya Chrome'da aç → adres çubuğundaki **Uygulamayı yükle** simgesi.
- Her cihazda bir kez giriş yap; sonra açık kalır.

## Bilmen gerekenler
- **Supabase ücretsiz planı**, 7 gün hiç kullanılmayan projeyi duraklatır. Her gün kayıt girdiğin sürece sorun olmaz; duraklarsa panelden **Restore** ile açılır, veriler silinmez.
- **İnternet yokken** kayıt girebilirsin; sağ üstte "bekliyor" yazar, bağlantı gelince kendiliğinden gönderilir.
- **Güncelleme yüklerken** `sw.js` içindeki `VERSION = 'ioi-v1'` satırını `ioi-v2` yap; cihazlar yeni sürümü alır.
- `config.js` boşken site **demo modunda** açılır (örnek veri). Adresin sonuna `?demo` ekleyerek demo moduna her zaman bakabilirsin.

## Nasıl çalışır (v7)
- Uygulama süre ölçmez. Tek giriş: plan görevini **Bitti** işaretlemek (topic_status tablosunda `task:<hafta>.<gün>` satırı, `updated_at` = bitirme anı).
- **Park et:** görev silinmeden plan sırasından geçici olarak çıkar. Park kaydı mevcut `sessions` tablosunda tutulur (`topic = 'park:task:<hafta>.<gün>'`, `day` = park tarihi, `exam_code` = dönüş tarihi ya da boş, `note` = sebep). Şema değişikliği gerekmez.
- Önceki günlerden bitmeyenler **Devreden**, dönüş tarihi gelen park kayıtları **Parktan döndü** etiketiyle Bugün listesine gelir.
- Bir **konu** (C1, M5…), o konuya ayrılmış görevlerin hepsi bitince "bitti" sayılır.

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html`, `styles.css`, `app.js` | Arayüz |
| `store.js` | Supabase senkronu + çevrimdışı kuyruk |
| `plan.js` | 30 haftalık planın günlük hali (plan dosyasından otomatik üretildi) |
| `config.js` | Supabase bağlantı bilgileri |
| `sw.js`, `manifest.webmanifest`, `icons/` | Ana ekrana eklenebilen uygulama (PWA) |
| `schema.sql` | Veritabanı tabloları ve güvenlik kuralları |
