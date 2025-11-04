# 📦 Depo Stok Takip Sistemi

**Jandarma ve Sahil Güvenlik Akademisi Sosyal Tesisler Müdürlüğü**  
**Lokanta Kısım Amirliği - Muhasebe ve Depo Sayım Uygulaması**

Modern ve kullanıcı dostu bir web tabanlı depo stok takip ve sayım raporu oluşturma uygulaması.

## 🏛️ Proje Hakkında

Bu uygulama, **Jandarma ve Sahil Güvenlik Akademisi (JSGA) Başkanlığı Sosyal Tesisler Müdürlüğü Lokanta Kısım Amirliği**'nin muhasebe ve depo sayım işlemlerini kolaylaştırmak amacıyla geliştirilmiştir.

### 🎯 Amaç ve Kullanım Senaryosu

Uygulama, günlük depo sayım süreçlerini hızlandırır ve hata payını azaltır:

1. **BİMED Yazılımı Entegrasyonu**
   - BİMED yazılımından **"İşletme Stokları Raporu"** Excel formatında dışa aktarılır
   - Bu rapor doğrudan uygulamaya yüklenir ve sistem stokları otomatik olarak çekilir

2. **Manuel Depo Sayımı**
   - Fiziksel depo sayımı personel tarafından manuel olarak gerçekleştirilir
   - Sayım sonuçları uygulamaya girilir
   - Sistem otomatik olarak farkları hesaplar ve raporlar

3. **Otomatik Rapor Oluşturma**
   - Tüm veriler girildikten sonra profesyonel Excel raporu oluşturulur
   - Rapor resmi formatlara uygun şekilde düzenlenir
   - Başlık: "JSGA BAŞKANLIĞI SOSYAL TESİS MÜDÜRLÜĞÜ - TARİHLİ 153.001-TESİS LOKANTA İŞLETMESİNİN STOKLARI"

### ✅ Sağladığı Avantajlar

- ⚡ **Hız**: Manuel hesaplama yerine otomatik hesaplama
- 🎯 **Doğruluk**: İnsan hatasını minimize eder
- 📊 **Raporlama**: Profesyonel ve standart raporlar
- 💾 **Veri Saklama**: Geçmiş verilere kolay erişim
- 📱 **Esneklik**: Masaüstü ve mobil cihazlarda kullanım

## 🎯 Özellikler

### ✨ Temel Özellikler
- **Excel Entegrasyonu**: Excel dosyalarından otomatik ürün ve stok bilgisi çekme
- **Dinamik Tablo**: Ürün adlarına göre otomatik tablo oluşturma
- **Akıllı Hesaplama**: Stok farklarını otomatik hesaplama ve görselleştirme
- **Veri Saklama**: LocalStorage ile tarayıcıda veri kaydetme
- **Rapor Dışa Aktarma**: Profesyonel Excel raporları oluşturma (ExcelJS ile)
- **Responsive Tasarım**: Masaüstü, tablet ve mobil cihazlarda sorunsuz çalışma

### 📊 Hesaplama Mantığı
```
Fark = (Dünkü Artı - Bugünkü Depo Sayımı) - Sistemdeki Stok
```

- **Pozitif Fark**: Stok artışı (Yeşil renk ile gösterim)
- **Negatif Fark**: Stok eksilmesi (Kırmızı renk ile gösterim)
- **Sıfır Fark**: Eşit durum (Nötr gösterim)

## 🚀 Kurulum ve Kullanım

### Gereksinimler
- Modern bir web tarayıcısı (Chrome, Firefox, Safari, Edge)
- Herhangi bir sunucu kurulumu gerektirmez (Static HTML)

### Çalıştırma
1. Proje dosyalarını bir klasöre indirin
2. `index.html` dosyasını bir web tarayıcısında açın
3. Uygulama kullanıma hazır!

### BİMED Excel Dosyası Formatı

Uygulama, **BİMED yazılımından** alınan **"İşletme Stokları Raporu"** Excel çıktısı ile çalışacak şekilde tasarlanmıştır.

Beklenen Excel formatı:
- **Ürün Adı**: 2. sütun (B sütunu, index 1)
- **Miktar**: 12. sütun (L sütunu, index 11)
- **Fiyat**: 14. sütun (N sütunu, index 13)
- **Veri Başlangıcı**: 7. satırdan itibaren (index 6)

> **Not**: İlk 6 satır başlık ve bilgilendirme için ayrılmıştır. BİMED yazılımından alınan rapor formatı doğrudan kullanılabilir.

## 📖 Kullanım Kılavuzu

### 1. BİMED Raporunu Dışa Aktarma
1. **BİMED yazılımına** giriş yapın
2. **"İşletme Stokları Raporu"** menüsüne gidin
3. Raporu **Excel formatında (.xls veya .xlsx)** dışa aktarın
4. Dosyayı bilgisayarınıza kaydedin

### 2. Excel Dosyası Yükleme
1. Uygulamada "Excel Yükle" butonuna tıklayın
2. BİMED'den indirdiğiniz `.xls` veya `.xlsx` dosyasını seçin
3. Dosya otomatik olarak işlenecek ve tablo oluşturulacaktır
4. **Sistemdeki Stok** sütunu otomatik olarak BİMED verilerinden doldurulur

### 3. Manuel Depo Sayımı ve Veri Girişi
1. Fiziksel depo sayımınızı gerçekleştirin
2. Her ürün için aşağıdaki değerleri girin:
   - **Bugünkü Depo Sayımı**: Manuel olarak saydığınız mevcut stok miktarı
   - **Dünkü Artı**: Önceki gün kalan stok miktarı
   - **Sistemdeki Stok**: *(Otomatik doldurulur - BİMED verisi)*

> **İpucu**: `Enter` tuşu ile hızlıca bir sonraki alana geçebilirsiniz.

### 4. Otomatik Hesaplamalar
- Her değer değişikliğinde fark otomatik hesaplanır
- Sonuçlar renkli gösterilir:
  - 🟢 **Yeşil**: Artı (Fazla stok)
  - 🔴 **Kırmızı**: Eksi (Eksik stok)
  - ⚪ **Nötr**: Eşit durum

### 5. Resmi Rapor Dışa Aktarma
1. "Raporu Dışa Aktar" butonuna tıklayın
2. **JSGA resmi formatında** Excel raporu oluşturulur ve indirilir
3. Rapor şunları içerir:
   - **Başlık**: "JSGA BAŞKANLIĞI SOSYAL TESİS MÜDÜRLÜĞÜ"
   - **Alt Başlık**: "TARİHLİ 153.001-TESİS LOKANTA İŞLETMESİNİN STOKLARI"
   - Tarih ve sayfa numarası
   - Tüm ürün stok detayları (Sıra No, Malzeme Adı, Depo Sayımı, Birim, Miktar, Fiyat)
   - Tutar hesaplamaları (BİMED fiyatları ile)
   - Genel toplam
   - Profesyonel formatlamalar, çerçeveler ve düzen
4. Rapor resmi evraklarda kullanıma hazırdır

### 6. Verileri Sıfırlama
- "Sıfırla" butonuna tıklayarak tüm verileri temizleyebilirsiniz
- Bu işlem geri alınamaz, onay istenir
- Yeni bir sayım için sistemi hazırlar

## 🗂️ Proje Yapısı

```
warehouse-calculations/
│
├── index.html              # Ana HTML dosyası
├── script.js              # JavaScript kodları ve iş mantığı
├── style.css              # Stil dosyası (responsive tasarım)
├── README.md              # Dokümantasyon
│
└── assets/                # Harici kütüphaneler
    ├── xlsx.full.min.js   # Excel okuma kütüphanesi (SheetJS)
    ├── exceljs.min.js     # Excel yazma kütüphanesi (ExcelJS)
    └── FileSaver.min.js   # Dosya indirme kütüphanesi
```

## 💾 Veri Saklama

Uygulama verileri tarayıcınızın LocalStorage'ında saklanır:
- `inventory_global`: Girilen stok değerleri
- `last_excel_data`: Son yüklenen Excel verisi

> **Not**: Tarayıcı geçmişi temizlendiğinde veriler silinebilir.

## 🎨 Kullanılan Teknolojiler

### Frontend
- **HTML5**: Semantik ve modern yapı
- **CSS3**: Responsive tasarım, Flexbox, modern stiller
- **Vanilla JavaScript**: Saf JavaScript (framework yok)

### Kütüphaneler
- **SheetJS (xlsx.full.min.js)**: Excel dosyalarını okuma
- **ExcelJS (exceljs.min.js)**: Profesyonel Excel raporları oluşturma
- **FileSaver.js**: Tarayıcıdan dosya indirme

## 🔧 Özelleştirme

### Renk Şeması Değiştirme
`style.css` dosyasında aşağıdaki değişkenleri düzenleyin:
```css
.positive { color: #22c55e; } /* Yeşil - Artı */
.negative { color: #ef4444; } /* Kırmızı - Eksi */
```

### Excel Formatını Değiştirme
`script.js` dosyasındaki `extractProductsFromExcelJson()` fonksiyonunu düzenleyin:
```javascript
const name = row[1];    // Ürün adı sütunu (B)
const amount = row[11]; // Miktar sütunu (L)
```

### Rapor Başlığını Değiştirme
`script.js` dosyasındaki `exportReportToExcel()` fonksiyonunda başlık satırlarını düzenleyin.

## 📱 Responsive Tasarım

Uygulama farklı ekran boyutlarına göre optimize edilmiştir:
- **Masaüstü**: Tam özellikli görünüm
- **Tablet**: (≤900px) Orta boyut optimizasyonu
- **Mobil**: (≤700px) Kompakt görünüm
- **Yazdırma**: Print-friendly stil

## ⚠️ Önemli Notlar

1. **Excel Formatı**: Excel dosyanızın beklenen formatta olması kritiktir
2. **Tarayıcı Desteği**: Modern tarayıcılar gereklidir (IE desteklenmez)
3. **Veri Yedekleme**: Önemli verileri düzenli olarak Excel'e aktarın
4. **Offline Çalışma**: İnternet bağlantısı gerektirmez

## 🐛 Sorun Giderme

### BİMED Excel Dosyası Yüklenmiyor
- Dosyanın BİMED "İşletme Stokları Raporu" çıktısı olduğundan emin olun
- Dosya formatının `.xls` veya `.xlsx` olduğunu kontrol edin
- Dosyanın bozuk olmadığını kontrol edin
- Excel dosyasının 7. satırdan itibaren veri içerdiğinden emin olun (ilk 6 satır başlık)
- Tarayıcı konsolunu açın (F12) ve hata mesajlarını inceleyin

### Veriler Kayboldu
- Tarayıcı LocalStorage temizlenmiş olabilir
- BİMED raporunu tekrar yükleyin
- Düzenli olarak "Raporu Dışa Aktar" ile yedek alın
- Önemli sayımlar için Excel raporlarını arşivleyin

### Hesaplamalar Yanlış
- Input alanlarına sadece sayı girildiğinden emin olun
- Boş alanlar 0 olarak kabul edilir
- BİMED verilerinin doğru yüklendiğini kontrol edin
- Hesaplama formülü: `Fark = (Dünkü Artı - Bugünkü Depo Sayımı) - Sistemdeki Stok`

### Rapor Formatı Bozuk
- Son BİMED raporunu tekrar yükleyin
- Tarayıcı önbelleğini temizleyin
- Farklı bir tarayıcı deneyin (Chrome önerilir)

## 📞 İletişim ve Destek

**Geliştirici**: Osman Yavuz  
**Telefon**: 0541 737 35 32

## 📄 Lisans ve Kullanım

Bu uygulama, **Jandarma ve Sahil Güvenlik Akademisi Başkanlığı Sosyal Tesisler Müdürlüğü** için özel olarak geliştirilmiştir.

**Geliştirici**: Osman Yavuz  
**Kurum**: JSGA Sosyal Tesisler Müdürlüğü - Lokanta Kısım Amirliği

## 🔄 Versiyon Geçmişi

### v1.0.0 (2025)
- İlk sürüm
- Excel yükleme ve okuma
- Otomatik hesaplama
- Profesyonel rapor dışa aktarma
- Responsive tasarım
- LocalStorage entegrasyonu

---

**Son Güncelleme**: 8 Temmuz 2025

