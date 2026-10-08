// Otomatik üretildi: TUBITAK_Bilgisayar_1_Asama_Plani.md
export const PLAN = {
 "start": "2026-10-05",
 "exam": "2027-05-08",
 "topics": {
  "C1": "Temel program",
  "C2": "İşleçler (operators)",
  "C3": "Koşullar",
  "C4": "Döngüler",
  "C5": "Akış diyagramları (flow charts)",
  "C6": "Tipler ve bellek",
  "C7": "Diziler",
  "C8": "Fonksiyonlar",
  "C9": "Özyineleme (recursion)",
  "C10": "İşaretçiler (pointers)",
  "C11": "Dizgiler (strings)",
  "C12": "struct / union / enum",
  "C13": "Bit işlemleri (bitwise)",
  "C14": "Dinamik bellek · dosya · önişlemci",
  "M1": "Mantık (logic)",
  "M2": "Kümeler · bağıntılar · fonksiyonlar",
  "M3": "Permütasyon",
  "M4": "Kombinasyon",
  "M5": "İçerme-dışlama · derangement",
  "M6": "Binom açılımı",
  "M7": "Özel sayılar · rekürans",
  "M8": "Olasılık",
  "M9": "Sayı teorisi 1",
  "M10": "Sayı teorisi 2",
  "M11": "Logaritma",
  "M12": "Polinom · Σ · diziler",
  "M13": "Matrisler",
  "M14": "Temel geometri",
  "G1": "Çizge tanımı (graph)",
  "G2": "Temsil (representation)",
  "G3": "BFS",
  "G4": "DFS",
  "G5": "Topolojik sıralama",
  "G6": "Güçlü bağlı bileşen (SCC)",
  "A1": "Sözde kod okuma (pseudocode)",
  "A2": "Yığın / kuyruk / dairesel dizi",
  "A3": "Sıralama algoritmaları",
  "A4": "Açgözlü (greedy)",
  "A5": "Dinamik programlama sezgisi",
  "A6": "Oyun teorisi",
  "A7": "Mantık bulmacaları",
  "A8": "Karmaşıklık ve klasik algoritma tanıma"
 },
 "weeks": [
  {
   "n": 0,
   "range": "5–11 Eki",
   "title": "Kurulum + ilk adımlar",
   "goal": "Çalışma ortamı, soru arşivi ve takip sistemi hazır; C ve mantığa ilk adım atıldı.",
   "done": "gcc ile bir program derlenip çalıştı; arşiv 4 klasöre ayrıldı; hata defteri açıldı; ilk 3 C programı yazıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "S",
     "task": "C derleyicisini kur: Ek F'deki adımları sırayla uygula (MSYS2 + gcc). Sonunda merhaba.c derlenip çalışmalı. Takılırsan yedek: OnlineGDB",
     "label": "C derleyicisini kur",
     "codes": [],
     "src": "Ek F · OnlineGDB"
    },
    {
     "h": 1.0,
     "line": "S",
     "task": "TÜBİTAK arşivinden 2007–2026 Lise Bilgisayar 1. aşama soruları + çözümleri indir. Klasörle: 01_Maden (2007–2015), 02_Deneme (2018–2024), 03_Rezerv (2025, 2026), 04_Yedek (2016, 2017). Hata defteri + haftalık kayıt şablonunu hazırla (Ek D)",
     "label": "TÜBİTAK arşivinden 2007–2026 Lise Bilgisayar 1…",
     "codes": [],
     "src": "TÜBİTAK arşiv · Ek D"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C1 başlangıç — CS50 Week 1 dersinin ilk yarısı: program yapısı, printf, değişken",
     "label": "Temel program",
     "codes": [
      "C1"
     ],
     "src": "CS50 W1 · KING 2"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M1 başlangıç — önerme, bağlaçlar (∧ ∨ ¬ → ↔), doğruluk tablosu; 15 soru",
     "label": "Mantık (logic)",
     "codes": [
      "M1"
     ],
     "src": "MEB 9 · SM"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "A",
     "task": "Soru turu: 2015 sınavını çözmeden oku; her soruyu M / A / G / C / Z olarak etiketle; en kolay görünen 5 soruyu dene (1,5 sa) · Planın takvimini ajandaya işle (0,5 sa)",
     "label": "Soru turu",
     "codes": [],
     "src": "GS 2015"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C1 — 3 küçük program yaz (değişken, aritmetik, printf); her birinin çıktısını önce kağıda yaz",
     "label": "Temel program",
     "codes": [
      "C1"
     ],
     "src": "CS50 W1"
    }
   ]
  },
  {
   "n": 1,
   "range": "12–18 Eki",
   "title": "C aritmetiği · İşleçler · Önerme mantığı",
   "goal": "C'de aritmetik ve işleçler; önerme mantığının dili.",
   "done": "10 C ifadesinin çıktısını kağıtta %80 doğru bulmak; 3 değişkenli doğruluk tablosu kurmak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C1 — scanf, aritmetik, tam sayı bölmesi (7/2 = 3), mod (%), negatif sayıda / ve %. Tahmin → Derle → Karşılaştır döngüsüyle 15 ifade",
     "label": "Temel program",
     "codes": [
      "C1"
     ],
     "src": "KING 3–4"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M1 — koşullu önerme, karşıt ters (contrapositive), De Morgan, totoloji/çelişki, niceleyiciler (∀ ∃)",
     "label": "Mantık (logic)",
     "codes": [
      "M1"
     ],
     "src": "SM · MEB 9"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C2 — işleç önceliği (operator precedence), ++/-- ön ek–son ek (prefix/postfix), bileşik atama (+=)",
     "label": "İşleçler (operators)",
     "codes": [
      "C2"
     ],
     "src": "KING 4"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M1 alıştırma: 8 soru",
     "label": "Mantık (logic)",
     "codes": [
      "M1"
     ],
     "src": "SM · Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C+A",
     "task": "C1–C2: 20 “çıktı ne?” sorusu (1 sa) · A1 — izleme tablosu (trace table): 3 sözde kod örneği (1 sa)",
     "label": "C1–C2: 20 “çıktı ne?” sorusu",
     "codes": [
      "C1",
      "C2",
      "A1"
     ],
     "src": "KING 4 egz. · Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 2,
   "range": "19–25 Eki",
   "title": "Koşul yapıları · Kümeler ve bağıntılar",
   "goal": "C'de dallanma; bağıntı özellikleri ve bileşke bağıntı.",
   "done": "S∘R'yi 4 elemanlı kümede 5 dk'da hesaplamak; switch fall-through çıktılarını doğru bulmak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C3 — if/else, karşılaştırma ve mantıksal işleçler, kısa devre (short-circuit: &&/|| ikinci tarafı hiç çalıştırmayabilir)",
     "label": "Koşullar",
     "codes": [
      "C3"
     ],
     "src": "KING 5.1–5.2"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M2 — kümeler: birleşim, kesişim, fark, tümleyen, simetrik fark; kartezyen çarpım; kuvvet kümesi 2ⁿ",
     "label": "Kümeler · bağıntılar · fonksiyonlar",
     "codes": [
      "M2"
     ],
     "src": "SM · MEB 9"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C3 — ?: işleci, switch ve fall-through (break yoksa alttaki case'ler de çalışır), dangling else tuzağı",
     "label": "Koşullar",
     "codes": [
      "C3"
     ],
     "src": "KING 5.2–5.3"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M2 — bağıntılar: yansıma, simetri, ters simetri, geçişme, denklik; bileşke bağıntı S∘R (tabloyla)",
     "label": "Kümeler · bağıntılar · fonksiyonlar",
     "codes": [
      "M2"
     ],
     "src": "SM"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C+A",
     "task": "C2+C3 karma 20 “çıktı ne?” (1 sa) · A7 — doğrucu/yalancı (knights & knaves) 4 bulmaca (1 sa)",
     "label": "C2+C3 karma 20 “çıktı ne?”",
     "codes": [
      "C2",
      "C3",
      "A7"
     ],
     "src": "KING 5 egz. · Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 3,
   "range": "26 Eki–1 Kas",
   "title": "Döngüler · Fonksiyonlar (matematik)",
   "goal": "Döngülerin kaç kez döndüğünü bulmak; fonksiyon türleri.",
   "done": "İç içe iki basit döngünün iterasyon sayısını bulmak; birebir/örten ayrımı.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C4 — while, do-while (en az 1 kez çalışır), for",
     "label": "Döngüler",
     "codes": [
      "C4"
     ],
     "src": "KING 6.1–6.3 · CS50 W1"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M2 — fonksiyon: tanım/değer kümesi, birebir (injective), örten (surjective), birebir-örten; bileşke f∘g, ters fonksiyon",
     "label": "Kümeler · bağıntılar · fonksiyonlar",
     "codes": [
      "M2"
     ],
     "src": "MEB 10"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C4 — break, continue, goto; iç içe döngüde sayma",
     "label": "Döngüler",
     "codes": [
      "C4"
     ],
     "src": "KING 6.4"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M2 alıştırma: fonksiyon soruları 12 adet",
     "label": "Kümeler · bağıntılar · fonksiyonlar",
     "codes": [
      "M2"
     ],
     "src": "MEB 10 · Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C",
     "task": "C5 — akış diyagramları (flow charts): 3 diyagramı koda çevir (45 dk) · C4: 15 döngü-sayma sorusu (75 dk)",
     "label": "Akış diyagramları (flow charts)",
     "codes": [
      "C5",
      "C4"
     ],
     "src": "Müfredat 4.1 · Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 4,
   "range": "2–8 Kas",
   "title": "Döngü pekiştirme · Fonksiyon sayma · Permütasyon girişi",
   "goal": "Zor döngü sayma; sayma kurallarına giriş.",
   "done": "i *= 2 / j = i tipi döngülerin sayısını bulmak; m^n ve m!/(m−n)! formüllerini kullanmak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C4 pekiştirme: asal kontrolü, basamak toplamı, faktöriyel, döngüyle Fibonacci (bilgisayarda yaz)",
     "label": "Döngüler",
     "codes": [
      "C4"
     ],
     "src": "CS50 W1 problem set"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M2 — fonksiyon sayma: tüm fonksiyonlar mⁿ, birebir m!/(m−n)!, bağıntı sayısı 2^(n²)",
     "label": "Kümeler · bağıntılar · fonksiyonlar",
     "codes": [
      "M2"
     ],
     "src": "SM"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C4 — zor döngü sayma: i *= 2 / i <<= 1 (≈ log), j = i'den başlayan iç döngüler; 15 soru",
     "label": "Döngüler",
     "codes": [
      "C4"
     ],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M3 — toplama/çarpma kuralı, faktöriyel, permütasyon P(n,r)",
     "label": "Permütasyon",
     "codes": [
      "M3"
     ],
     "src": "KSS / SM · MEB 10"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "M+A",
     "task": "M3: 15 temel sayma sorusu (1 sa) · A7 — tablo/zebra bulmacaları: 2 adet (1 sa)",
     "label": "M3: 15 temel sayma sorusu",
     "codes": [
      "M3",
      "A7"
     ],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 5,
   "range": "9–15 Kas",
   "title": "Permütasyon türleri · Char ve tipler",
   "goal": "Permütasyonun tüm türleri; char aritmetiği ve taşma.",
   "done": "Tekrarlı harfli bir kelimenin diziliş sayısını bulmak; unsigned char 255+1 gibi taşmaları açıklamak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C6 — char ve ASCII ('A'=65, 'a'=97, '0'=48), char aritmetiği ('A'+2 → 'C'), %c/%d farkı",
     "label": "Tipler ve bellek",
     "codes": [
      "C6"
     ],
     "src": "KING 7.3"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M3 — tekrarlı permütasyon n!/(a!·b!…), dairesel permütasyon (n−1)!",
     "label": "Permütasyon",
     "codes": [
      "M3"
     ],
     "src": "KSS"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C6 — short/int/long, unsigned, aralıklar (2¹⁶, 2³¹); taşma (overflow), unsigned sarma (wrap-around); örtük dönüşüm (implicit conversion), cast",
     "label": "Tipler ve bellek",
     "codes": [
      "C6"
     ],
     "src": "KING 7.1, 7.4"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M3 — sözlük sırası (lexicographic rank); “yan yana olsun” (blok yöntemi)",
     "label": "Permütasyon",
     "codes": [
      "M3"
     ],
     "src": "KSS"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "M",
     "task": "M3 yoğun: 25 soru — kelime, dairesel masa, blok yöntemi",
     "label": "M3 yoğun: 25 soru",
     "codes": [
      "M3"
     ],
     "src": "KSS · Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 6,
   "range": "16–22 Kas",
   "title": "ARA TATİL — Kombinasyon · Diziler",
   "goal": "Tatil saatini kombinasyon ve dizilere yatırmak.",
   "done": "Komite sorusunu tümleyenle ≤3 dk; 2D dizi üzerinde döngü çıktısını bulmak.",
   "days": [
    {
     "h": 2.0,
     "line": "M",
     "task": "M4 — kombinasyon C(n,r), özellikleri; komite soruları: “en az”, “A ile B birlikte olmasın” → tümleyen sayma (complementary counting)",
     "label": "Kombinasyon",
     "codes": [
      "M4"
     ],
     "src": "KSS"
    },
    {
     "h": 2.0,
     "line": "C",
     "task": "C7 — 1D diziler: tanım, başlatma, indeks, sınır dışı erişim (tanımsız davranış), dizi üzerinde döngü",
     "label": "Diziler",
     "codes": [
      "C7"
     ],
     "src": "KING 8.1"
    },
    {
     "h": 2.0,
     "line": "M",
     "task": "M4 — özdeş nesne dağıtımı (stars & bars): x₁+…+xₖ=n çözüm sayısı C(n+k−1, k−1), alt sınırlı versiyon",
     "label": "Kombinasyon",
     "codes": [
      "M4"
     ],
     "src": "KSS"
    },
    {
     "h": 2.0,
     "line": "C",
     "task": "C7 — 2D diziler: A[i][j] vs A[j][i], köşegen, satır/sütun toplamı",
     "label": "Diziler",
     "codes": [
      "C7"
     ],
     "src": "KING 8.2"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M4 — yan yana gelmeme (boşluk yöntemi / gap method), alternatif diziliş, ızgarada yol sayma C(m+n, n)",
     "label": "Kombinasyon",
     "codes": [
      "M4"
     ],
     "src": "KSS"
    },
    {
     "h": 2.0,
     "line": "D",
     "task": "Madencilik seti #1 (büyük): 20 soru / 60 dk (M1–M4, C1–C7) + 60 dk analiz ve hata defteri",
     "label": "Madencilik seti #1 (büyük)",
     "codes": [
      "M1",
      "M4",
      "C1",
      "C7"
     ],
     "src": "Maden"
    },
    {
     "h": 1.5,
     "line": "A",
     "task": "A2 — yığın/kuyruk (stack/queue) kavramı + 3 simülasyon sorusu",
     "label": "Yığın / kuyruk / dairesel dizi",
     "codes": [
      "A2"
     ],
     "src": "Maden"
    }
   ]
  },
  {
   "n": 7,
   "range": "23–29 Kas",
   "title": "C fonksiyonları · İleri sayma · İçerme-dışlama",
   "goal": "Fonksiyon çağrısının bellek mantığı; kısıtlı sayma.",
   "done": "static değişkenli fonksiyonun 3 çağrı sonrası çıktısı; 1–N arası 2,3,5'e bölünmeyenleri ≤2 dk'da saymak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C8 — fonksiyon tanımı, parametre, return, void, prototip; değer ile aktarma (pass-by-value: fonksiyon kopyayla çalışır)",
     "label": "Fonksiyonlar",
     "codes": [
      "C8"
     ],
     "src": "KING 9.1–9.4"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M4 — zor sayma: kurallı kelime üretimi (durum tablosu), gruplara ayırma (özdeş gruplarda k! bölmesi)",
     "label": "Kombinasyon",
     "codes": [
      "M4"
     ],
     "src": "KSS · Maden"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C8 — kapsam (scope): yerel/global, gölgeleme (shadowing), static yerel değişken (çağrılar arasında değerini korur)",
     "label": "Fonksiyonlar",
     "codes": [
      "C8"
     ],
     "src": "KING 10, 18.2"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M5 — içerme-dışlama (inclusion–exclusion): |A∪B∪C|; “2, 3, 5'e bölünmeyen” tipi",
     "label": "İçerme-dışlama · derangement",
     "codes": [
      "M5"
     ],
     "src": "KSS · SM"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C",
     "task": "C8 yoğun: 15 “çıktı ne?” (global/yerel/static karışık) + 2 fonksiyon yaz (EBOB, asal)",
     "label": "C8 yoğun: 15 “çıktı ne?”",
     "codes": [
      "C8"
     ],
     "src": "KING 9–10 egz."
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 8,
   "range": "30 Kas–6 Ara",
   "title": "Özyineleme · Düzensiz permütasyon · Sıralama",
   "goal": "Çağrı ağacı çizmek; Dₙ formülü; sıralama algoritmalarını adım adım yürütmek.",
   "done": "Özyinelemenin çağrı ağacını çizip değeri ≤5 dk'da bulmak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C9 — özyineleme (recursion): taban durumu (base case), çağrı yığını (call stack), çağrı ağacı (call tree)",
     "label": "Özyineleme (recursion)",
     "codes": [
      "C9"
     ],
     "src": "KING 9.6 · CS50 W3"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M5 — düzensiz permütasyon (derangement): D₁…D₆, Dₙ=(n−1)(Dₙ₋₁+Dₙ₋₂); “kimse kendi hediyesini almasın” olasılığı",
     "label": "İçerme-dışlama · derangement",
     "codes": [
      "M5"
     ],
     "src": "KSS"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C9 — çağrı/yıldız sayma: f(n−1)+f(n−2), 2·f(n−1) → 2ⁿ−1, n/2 özyinelemesi; printf çağrıdan önce/sonra → çıktı sırası",
     "label": "Özyineleme (recursion)",
     "codes": [
      "C9"
     ],
     "src": "Maden · PT"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M5 — 3–4 kümeli içerme-dışlama, örten fonksiyon sayısı, “en az bir” soruları",
     "label": "İçerme-dışlama · derangement",
     "codes": [
      "M5"
     ],
     "src": "KSS"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C+A",
     "task": "C9: 12 özyineleme sorusu, Python Tutor'da çağrı yığınını izle (1 sa) · A3 — sıralama: bubble, selection, insertion; “k. geçişten sonra dizi” (1 sa)",
     "label": "C9",
     "codes": [
      "C9",
      "A3"
     ],
     "src": "PT · VisuAlgo"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 9,
   "range": "7–13 Ara",
   "title": "FAZ 1 KAPANIŞ · Borç haftası · Sayı teorisi girişi",
   "goal": "Faz 1'i ölçmek, açıkları kapatmak.",
   "done": "Kapanış testleri yapıldı, KN1 kararı verildi, en zayıf konular tekrar edildi.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Kapanış testi C: C1–C9 karma 25 soru / 70 dk + 20 dk kontrol",
     "label": "Kapanış testi C",
     "codes": [
      "C1",
      "C9"
     ],
     "src": "Maden"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "Kapanış testi M/A: M1–M5 + A1–A3 karma 20 soru / 60 dk + 30 dk kontrol",
     "label": "Kapanış testi M/A",
     "codes": [
      "M1",
      "M5",
      "A1",
      "A3"
     ],
     "src": "Maden"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "Borç: testte %60 altı kalan konu #1",
     "label": "Borç: testte %60 altı kalan konu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M9 — bölünebilme, asal çarpanlar, bölen sayısı (a+1)(b+1)…, EBOB/EKOK, Öklid algoritması (C'de de yaz)",
     "label": "Sayı teorisi 1",
     "codes": [
      "M9"
     ],
     "src": "SM · CPH 21"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "T",
     "task": "Borç: en zayıf 2 konu (anlatım + soru)",
     "label": "Borç: en zayıf 2 konu",
     "codes": [],
     "src": "—"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "KN1 kararı (bkz. §9.2) + hata defteri tam tekrar",
     "label": "KN1 kararı",
     "codes": [],
     "src": "—"
    }
   ]
  },
  {
   "n": 10,
   "range": "14–20 Ara",
   "title": "İşaretçiler 1 · Binom",
   "goal": "Bellek adresi mantığı; binom katsayıları.",
   "done": "Pointer ile swap'ı kutu-ok çizimiyle açıklamak; (1+x)ᵃ(1+x²)ᵇ'de xᵏ katsayısını bulmak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C10 — adres &, erişim *, NULL; pointer ile swap (pass-by-pointer)",
     "label": "İşaretçiler (pointers)",
     "codes": [
      "C10"
     ],
     "src": "KING 11 · PT"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M6 — binom açılımı, genel terim C(n,k)xⁿ⁻ᵏyᵏ, katsayılar toplamı (x=1), Pascal üçgeni",
     "label": "Binom açılımı",
     "codes": [
      "M6"
     ],
     "src": "MEB 11 · SM"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C10 — *p++ vs (*p)++ öncelik tuzağı; fonksiyona dizi/pointer geçme",
     "label": "İşaretçiler (pointers)",
     "codes": [
      "C10"
     ],
     "src": "KING 11–12"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M6 — iki çarpanlı açılımda katsayı, çift indisli katsayılar toplamı = 2ⁿ⁻¹, özdeşlikler",
     "label": "Binom açılımı",
     "codes": [
      "M6"
     ],
     "src": "KSS"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C+K",
     "task": "C10: 15 pointer sorusu (1 sa) · Kod Atölyesi #1 — 1 problem, C ile (Ek E) (1 sa)",
     "label": "C10: 15 pointer sorusu",
     "codes": [
      "C10"
     ],
     "src": "Maden · Codeforces"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 11,
   "range": "21–27 Ara",
   "title": "İşaretçiler 2 · Olasılık 1 · DP sezgisi",
   "goal": "Pointer aritmetiği; olasılığın temeli.",
   "done": "*(a+i) ≡ a[i] ilişkisini kullanarak geri giden pointer döngüsünü izlemek.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C10 — pointer aritmetiği (p+1 tip boyutu kadar ilerler), a[i] ≡ *(a+i), p−q, p > a",
     "label": "İşaretçiler (pointers)",
     "codes": [
      "C10"
     ],
     "src": "KING 12"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M8 — örnek uzay, eş olasılıklı olay, tümleyen, “en az bir” olasılığı",
     "label": "Olasılık",
     "codes": [
      "M8"
     ],
     "src": "KA · MEB 10"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C10 — pointer ile geri dolaşma (p = a+4; while (p > a)), f(arr+1, n−1) tipi özyineleme",
     "label": "İşaretçiler (pointers)",
     "codes": [
      "C10"
     ],
     "src": "Maden · PT"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M8 — koşullu olasılık P(A|B), çarpım kuralı, bağımsızlık, olasılık ağacı",
     "label": "Olasılık",
     "codes": [
      "M8"
     ],
     "src": "KA"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "A",
     "task": "A5 — DP sezgisi: merdiven/Fibonacci tablosu, “yan yana seçilmez” tablosu (1 sa) · A2 — 2 grup algoritma simülasyonu (1 sa)",
     "label": "Dinamik programlama sezgisi",
     "codes": [
      "A5",
      "A2"
     ],
     "src": "CPH 7 · Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 12,
   "range": "28 Ara–3 Oca",
   "title": "Dizgiler · Bayes",
   "goal": "String = '\\0' ile biten char dizisi; Bayes teoremi.",
   "done": "char s[] = \"...\" boyutunu ve iki indeksli string döngüsünün çıktısını doğru bulmak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C11 — string yapısı, '\\0', sizeof vs strlen, strlen/strcpy/strcat/strcmp",
     "label": "Dizgiler (strings)",
     "codes": [
      "C11"
     ],
     "src": "KING 13"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M8 — toplam olasılık, Bayes teoremi (bağlam “spam filtresi” olsa da formül aynı), beklenen değer E[X]",
     "label": "Olasılık",
     "codes": [
      "M8"
     ],
     "src": "KA"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C11 — iki indeksli döngü (i baştan, j sondan), karakter değiştirme, büyük/küçük harf dönüşümü",
     "label": "Dizgiler (strings)",
     "codes": [
      "C11"
     ],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M8 — kombinasyonla olasılık (torba, zar, kart); geometrik olasılık sezgisi",
     "label": "Olasılık",
     "codes": [
      "M8"
     ],
     "src": "KA · Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C+K",
     "task": "C11: 12 string çıktı sorusu (1 sa) · Kod Atölyesi #2 — 1 problem, C ile (Ek E) (1 sa)",
     "label": "C11: 12 string çıktı sorusu",
     "codes": [
      "C11"
     ],
     "src": "Maden · Codeforces"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Madencilik seti: 8 soru (3'ü A7 önermelerden çıkarım: “hangisi çıkarılamaz?”) + analiz + plan",
     "label": "Madencilik seti: 8 soru",
     "codes": [
      "A7"
     ],
     "src": "Maden"
    }
   ]
  },
  {
   "n": 13,
   "range": "4–10 Oca",
   "title": "2D dizi + ileri özyineleme · Sayı teorisi",
   "goal": "Memoization'ın çağrı sayısını nasıl değiştirdiğini görmek.",
   "done": "Memo'lu ve memo'suz çağrı sayısını (doğrusal vs üstel) ayırt etmek; 2 parametreli f(x,y)'yi tabloyla hesaplamak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C7+C9 — 2D dizi + döngü: üst üçgen (i<j), komşu toplamı (sınır içi)",
     "label": "Diziler",
     "codes": [
      "C7",
      "C9"
     ],
     "src": "Maden"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M9 — bölen sayısı, EBOB–EKOK problemleri, asal sayılar",
     "label": "Sayı teorisi 1",
     "codes": [
      "M9"
     ],
     "src": "SM · Maden"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C9 — memoization (hafızaya alma): kaç çağrı? (A·n+B) vs üstel; 2 parametreli özyineleme → tablo",
     "label": "Özyineleme (recursion)",
     "codes": [
      "C9"
     ],
     "src": "CPH 7 · PT"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M10 — modüler aritmetik: a≡b (mod n), toplama/çarpma kuralları, üs periyodu (ör. 3ᵏ mod 7 döngüsü), son basamak",
     "label": "Sayı teorisi 2",
     "codes": [
      "M10"
     ],
     "src": "CPH 21 · SM"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "A+C",
     "task": "A5 — ızgara yolları, üç terimli f(x,y) tablosu (1 sa) · C7–C11 karma 12 soru (1 sa)",
     "label": "Dinamik programlama sezgisi",
     "codes": [
      "A5",
      "C7",
      "C11"
     ],
     "src": "CPH 7 · Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 14,
   "range": "11–17 Oca",
   "title": "Çizge girişi · Taban dönüşümü",
   "goal": "Çizge dili ve iki temsil yöntemi.",
   "done": "Aynı çizgeyi matris ve liste olarak yazmak; hangi işlemin hangisinde ucuz olduğunu söylemek.",
   "days": [
    {
     "h": 1.5,
     "line": "G",
     "task": "G1 — düğüm (vertex), kenar (edge), yönlü/yönsüz, derece; Σderece = 2E (handshake lemma); yol, döngü, bağlılık, ağaç (n−1 kenar), iki bölümlü (bipartite), DAG",
     "label": "Çizge tanımı (graph)",
     "codes": [
      "G1"
     ],
     "src": "CPH 11.1"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M10 — taban dönüşümü (2/8/16 ↔ 10) — bitwise için ön koşul; Fermat küçük teoremi",
     "label": "Sayı teorisi 2",
     "codes": [
      "M10"
     ],
     "src": "CPH 21"
    },
    {
     "h": 1.5,
     "line": "G",
     "task": "G2 — komşuluk matrisi (adjacency matrix) vs komşuluk listesi (adjacency list): bellek O(V²) vs O(V+E); “kenar var mı?” O(1) vs O(derece); C'de ikisini de kur",
     "label": "Temsil (representation)",
     "codes": [
      "G2"
     ],
     "src": "CPH 11.2"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M9–M10 mini test (8 soru) + analiz",
     "label": "M9–M10",
     "codes": [
      "M9",
      "M10"
     ],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "G+K",
     "task": "Maden'deki G1–G2 soruları (1 sa) · Kod Atölyesi #3 — 1 problem, C ile (Ek E) (1 sa)",
     "label": "Maden'deki G1–G2 soruları",
     "codes": [
      "G1",
      "G2"
     ],
     "src": "Maden · Codeforces"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 15,
   "range": "18–24 Oca",
   "title": "Özel sayılar · Açgözlü · FAZ 2 KAPANIŞ",
   "goal": "Stirling/Catalan kalıplarını tanımak; Faz 2'yi ölçmek.",
   "done": "S(n,k) tablosunu n≤8 için kurmak; kapanış testleri yapıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "M",
     "task": "M7 — Stirling sayıları (2. tür) S(n,k): n farklı öğeyi k boş olmayan özdeş gruba ayırma; S(n,k)=k·S(n−1,k)+S(n−1,k−1)",
     "label": "Özel sayılar · rekürans",
     "codes": [
      "M7"
     ],
     "src": "KSS"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M7 — Catalan sayıları (parantez dizileri), rekürans kurma (recurrence)",
     "label": "Özel sayılar · rekürans",
     "codes": [
      "M7"
     ],
     "src": "KSS"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "Kapanış testi C: C1–C11 karma 20 soru",
     "label": "Kapanış testi C",
     "codes": [
      "C1",
      "C11"
     ],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Kapanış testi M: M1–M10 karma 10 soru",
     "label": "Kapanış testi M",
     "codes": [
      "M1",
      "M10"
     ],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "A+T",
     "task": "A4 — açgözlü (greedy): sırala-eşleştir, karşı örnekle çürütme (1 sa) · Borç kapatma (1 sa)",
     "label": "Açgözlü (greedy)",
     "codes": [
      "A4"
     ],
     "src": "CPH 6"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Kapanış testlerinin analizi + yarıyıl sprint listesini hazırla",
     "label": "Kapanış testlerinin analizi + yarıyıl sprint l…",
     "codes": [],
     "src": "—"
    }
   ]
  },
  {
   "n": 16,
   "range": "25–31 Oca",
   "title": "YARIYIL — BFS · DFS · Oyun teorisi · struct",
   "goal": "Çizge gezme algoritmalarını elle hatasız yürütmek.",
   "done": "5 farklı çizgede elle BFS/DFS; d[u]/f[u] zamanlarını hatasız yazmak; geçerli BFS sıralarını ayıklamak.",
   "days": [
    {
     "h": 2.5,
     "line": "G",
     "task": "G3 — BFS (genişlik öncelikli arama): kuyruk (queue), katman mantığı, ağırlıksız en kısa yol; “hangi sıralar geçerli BFS?”",
     "label": "BFS",
     "codes": [
      "G3"
     ],
     "src": "CPH 12.2 · VisuAlgo"
    },
    {
     "h": 2.5,
     "line": "G",
     "task": "G4 — DFS (derinlik öncelikli arama): özyineleme/yığın, keşif d[u] ve bitiş f[u] zamanları, DFS ağacı",
     "label": "DFS",
     "codes": [
      "G4"
     ],
     "src": "CPH 12.1 · VisuAlgo"
    },
    {
     "h": 2.0,
     "line": "G",
     "task": "G4 — kenar türleri (tree/back/forward/cross), döngü tespiti (back edge = döngü); BFS vs DFS doğru/yanlış ifadeleri",
     "label": "DFS",
     "codes": [
      "G4"
     ],
     "src": "CPH 12"
    },
    {
     "h": 2.0,
     "line": "A",
     "task": "A6 — oyun teorisi: kazanan/kaybeden pozisyon tablosu · A8 — Big-O sezgisi, ikili arama (binary search) ≈ log₂n adım",
     "label": "Oyun teorisi",
     "codes": [
      "A6",
      "A8"
     ],
     "src": "CPH 25, 2, 3"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C12 — struct, typedef, . ve -> işleçleri, struct dizisi",
     "label": "struct / union / enum",
     "codes": [
      "C12"
     ],
     "src": "KING 16.1–16.2"
    },
    {
     "h": 3.0,
     "line": "G",
     "task": "Çizge madencilik: 2007–2015'teki BFS/DFS soruları 60 dk + 60 dk analiz + 60 dk elle BFS/DFS (5 çizge)",
     "label": "Çizge madencilik",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.5,
     "line": "K+T",
     "task": "Kod Atölyesi #4 — 1 problem, C ile (Ek E): ızgarada BFS/DFS (1 sa) · Hata defteri (0,5 sa)",
     "label": "Kod Atölyesi #4",
     "codes": [],
     "src": "CSES 1192"
    }
   ]
  },
  {
   "n": 17,
   "range": "1–7 Şub",
   "title": "YARIYIL — Topolojik sıralama · SCC · Padding · DENEME 1",
   "goal": "Çizge müfredatını bitirmek; ilk tam deneme.",
   "done": "G1–G6 tamam; D1 yapıldı ve hata kodlarıyla analiz edildi.",
   "days": [
    {
     "h": 2.5,
     "line": "G",
     "task": "G5 — topolojik sıralama (topological sort): Kahn (indegree-0 kuyruğu), DFS bitiş sırasının tersi; sıralama sayısını sayma; teklik koşulu",
     "label": "Topolojik sıralama",
     "codes": [
      "G5"
     ],
     "src": "CPH 16.1"
    },
    {
     "h": 2.5,
     "line": "G",
     "task": "G6 — güçlü bağlı bileşen (SCC): elle bulma, Kosaraju (2 DFS), yoğuşum çizgesi (condensation graph) her zaman DAG",
     "label": "Güçlü bağlı bileşen (SCC)",
     "codes": [
      "G6"
     ],
     "src": "CPH 17.1"
    },
    {
     "h": 2.0,
     "line": "C",
     "task": "C12 — hizalama/dolgu (alignment/padding) ile struct boyutu, union (boyut = en büyük üye), enum değerleri",
     "label": "struct / union / enum",
     "codes": [
      "C12"
     ],
     "src": "KING 16.3–16.5"
    },
    {
     "h": 1.5,
     "line": "G",
     "task": "G1–G6 karma 15 soru + analiz",
     "label": "G1–G6 karma 15 soru + analiz",
     "codes": [
      "G1",
      "G6"
     ],
     "src": "Maden"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "D1 öncesi hata defteri + Sınav Stratejisi bölümünü oku (3 tur yöntemi)",
     "label": "D1 öncesi hata defteri + Sınav Stratejisi bölü…",
     "codes": [],
     "src": "Bu plan §8"
    },
    {
     "h": 3.0,
     "line": "D",
     "task": "D1 — 2019 tam deneme (150 dk, 09:30'da başla) + 30 dk kontrol",
     "label": "D1 — 2019 tam deneme",
     "codes": [],
     "src": "GS 2019"
    },
    {
     "h": 2.0,
     "line": "D",
     "task": "D1 analizi: her yanlış/boş için hata kodu (K/İ/O/Z/T/S), kategori tablosu, KN2",
     "label": "D1 analizi: her yanlış/boş için hata kodu",
     "codes": [],
     "src": "Ek D"
    }
   ]
  },
  {
   "n": 18,
   "range": "8–14 Şub",
   "title": "Bit işlemleri · Logaritma",
   "goal": "Bitwise kalıplarını görür görmez tanımak.",
   "done": "x&(x−1), x&(−x), popcount, XOR swap'ı tanımak; log denklemini tanım kümesi kontrolüyle çözmek.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C13 — & | ^ ~ << >>; ikilik hesap; 1<<m, n ^ (1<<m) (m. biti çevir), n & 1 (tek mi?)",
     "label": "Bit işlemleri (bitwise)",
     "codes": [
      "C13"
     ],
     "src": "KING 20.1 · CPH 10"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M11 — üstel/logaritma: kurallar, taban değiştirme, log denklemleri (tanım kümesi kontrolü!)",
     "label": "Logaritma",
     "codes": [
      "M11"
     ],
     "src": "MEB 11–12"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C13 — kalıplar: x&(x−1) (en sağdaki 1'i siler), x&(−x) (izole eder), popcount döngüsü, XOR swap, maskeleme, >> = 2'ye bölme",
     "label": "Bit işlemleri (bitwise)",
     "codes": [
      "C13"
     ],
     "src": "CPH 10"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M11 — log'un algoritmadaki anlamı: log₂n = kaç kez ikiye bölünür; log₈(n³) = log₂n dönüşümleri",
     "label": "Logaritma",
     "codes": [
      "M11"
     ],
     "src": "CPH 2"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C+K",
     "task": "C13: 15 bitwise sorusu (1 sa) · Kod Atölyesi #5 — 1 problem, C ile (Ek E) (1 sa)",
     "label": "C13: 15 bitwise sorusu",
     "codes": [
      "C13"
     ],
     "src": "Maden · Codeforces"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Madencilik seti — D1'in en zayıf kategorisinden 5 soru + analiz",
     "label": "Madencilik seti",
     "codes": [],
     "src": "Maden"
    }
   ]
  },
  {
   "n": 19,
   "range": "15–21 Şub",
   "title": "Dinamik bellek · Dosya · Önişlemci · Polinom",
   "goal": "C müfredatını bitirmek.",
   "done": "C1–C14 tamam; makro tuzağını (SQR(a+1)) açıklamak; kalan teoremiyle çarpanlara ayırmak.",
   "days": [
    {
     "h": 1.5,
     "line": "C",
     "task": "C14 — dinamik bellek: malloc/calloc/free, sizeof; bağlı liste (linked list) düğüm ekleme/gezme",
     "label": "Dinamik bellek · dosya · önişlemci",
     "codes": [
      "C14"
     ],
     "src": "KING 17.1–17.5"
    },
    {
     "h": 1.5,
     "line": "M",
     "task": "M12 — polinom: derece, bölme, kalan teoremi P(a), çarpanlara ayırma, kök–katsayı (Vieta)",
     "label": "Polinom · Σ · diziler",
     "codes": [
      "M12"
     ],
     "src": "MEB 10"
    },
    {
     "h": 1.5,
     "line": "C",
     "task": "C14 — önişlemci: #define makro tuzakları, #include; dosya: fopen/fprintf/fscanf/fclose, modlar r/w/a",
     "label": "Dinamik bellek · dosya · önişlemci",
     "codes": [
      "C14"
     ],
     "src": "KING 14, 22"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M12 — Σ notasyonu, teleskopik toplam, aritmetik/geometrik dizi toplamı; iç içe döngü sayısını Σ ile yazma",
     "label": "Polinom · Σ · diziler",
     "codes": [
      "M12"
     ],
     "src": "MEB 12"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "C+A",
     "task": "C12–C14 karma 12 soru (1 sa) · A1/A2 — 2 grup algoritma simülasyonu (1 sa)",
     "label": "C12–C14 karma 12 soru",
     "codes": [
      "C12",
      "C14",
      "A1",
      "A2"
     ],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 20,
   "range": "22–28 Şub",
   "title": "Matrisler · Karma tekrar · DENEME 2",
   "goal": "Son büyük matematik konusu; ikinci ölçüm.",
   "done": "D2 yapıldı; D1→D2 kategori karşılaştırması çıkarıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "M",
     "task": "M13 — matris toplama/çarpma (satır×sütun), transpoz, birim matris; A²[i][j] = i→j 2 adımlı yol sayısı",
     "label": "Matrisler",
     "codes": [
      "M13"
     ],
     "src": "CPH 23"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C karma: Ek C tuzak listesi üzerinden 15 kısa soru",
     "label": "C karma",
     "codes": [],
     "src": "Ek C"
    },
    {
     "h": 1.0,
     "line": "G",
     "task": "G karma: DFS zamanları + topolojik sayma + SCC (8 soru)",
     "label": "G karma",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M karma: M3–M8 zor set 10 soru",
     "label": "M karma: M3–M8 zor set 10 soru",
     "codes": [
      "M3",
      "M8"
     ],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.5,
     "line": "D",
     "task": "D2 — 2020 tam deneme (150 dk)",
     "label": "D2 — 2020 tam deneme",
     "codes": [],
     "src": "GS 2020"
    },
    {
     "h": 1.5,
     "line": "D",
     "task": "D2 analizi + D1→D2 kategori karşılaştırması",
     "label": "D2 analizi + D1→D2 kategori karşılaştırması",
     "codes": [],
     "src": "Ek D"
    }
   ]
  },
  {
   "n": 21,
   "range": "1–7 Mar",
   "title": "Zayıf konu haftası #1 · Temel geometri",
   "goal": "Denemelerin gösterdiği açıkları kapatmak.",
   "done": "D1+D2'de en çok puan kaybettiren 3 konu yeniden çalışıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Zayıf konu #1 (D1+D2 hata tablosuna göre): anlatım + 12 soru",
     "label": "Zayıf konu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "Zayıf konu #2",
     "label": "Zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "Zayıf konu #3",
     "label": "Zayıf konu #3",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "M",
     "task": "M14 — temel geometri (hafif): alan/çevre, Pisagor, benzerlik, dik üçgende trigonometri, doğru denklemi",
     "label": "Temel geometri",
     "codes": [
      "M14"
     ],
     "src": "MEB 9–11"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "A+K",
     "task": "A7 — zeka: tartı/terazi, kesme/parçalama (1 sa) · Kod Atölyesi #6 — 1 problem, C ile (Ek E) (1 sa)",
     "label": "Mantık bulmacaları",
     "codes": [
      "A7"
     ],
     "src": "Maden · Codeforces"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 22,
   "range": "8–14 Mar",
   "title": "ARA TATİL (Ramazan Bayramı) — Büyük tekrar · DENEME 3",
   "goal": "Tüm müfredatı bir kez baştan sona geçmek; KN3 kararı.",
   "done": "C1–C14 karma 40 soru çözüldü; D3 yapıldı; KN3 kararı verildi.",
   "days": [
    {
     "h": 2.0,
     "line": "C",
     "task": "Büyük C tekrarı 1: C1–C7 karma 20 soru",
     "label": "Büyük C tekrarı 1: C1–C7 karma 20 soru",
     "codes": [
      "C1",
      "C7"
     ],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Bayram 1. gün — hafif: hata defteri",
     "label": "Bayram 1. gün",
     "codes": [],
     "src": "—"
    },
    {
     "h": 1.0,
     "line": "A",
     "task": "Hafif: 1 algoritma grubu + 1 mantık bulmacası",
     "label": "Hafif",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 2.0,
     "line": "C",
     "task": "Büyük C tekrarı 2: C8–C14 karma 20 soru",
     "label": "Büyük C tekrarı 2: C8–C14 karma 20 soru",
     "codes": [
      "C8",
      "C14"
     ],
     "src": "Maden"
    },
    {
     "h": 2.0,
     "line": "G+M",
     "task": "Çizge tüm konular 10 soru (1 sa) · M karma 10 soru (1 sa)",
     "label": "Çizge tüm konular 10 soru",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 3.5,
     "line": "D",
     "task": "D3 — 2021 tam deneme (150 dk) + 60 dk analiz",
     "label": "D3 — 2021 tam deneme",
     "codes": [],
     "src": "GS 2021"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "KN3 kararı (30 dk) + borç kapatma (60 dk)",
     "label": "KN3 kararı",
     "codes": [],
     "src": "§9.2"
    }
   ]
  },
  {
   "n": 23,
   "range": "15–21 Mar",
   "title": "Zayıf konu haftası #2 · Faz 5 hazırlığı",
   "goal": "Yeni konu dönemini kapatmak.",
   "done": "D3'ün 4 zayıf konusu çalışıldı; el yazısı tuzak/formül kağıdı hazır.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "D3 zayıf konu #1",
     "label": "D3 zayıf konu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "D3 zayıf konu #2",
     "label": "D3 zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.5,
     "line": "T",
     "task": "D3 zayıf konu #3",
     "label": "D3 zayıf konu #3",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "D3 zayıf konu #4",
     "label": "D3 zayıf konu #4",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.0,
     "line": "T+K",
     "task": "Tuzak/formül kağıdını kendi el yazınla hazırla (1 sa) · Kod Atölyesi #7 — 1 problem, C ile (Ek E) — sınava kadar son (1 sa)",
     "label": "Tuzak/formül kağıdını kendi el yazınla hazırla",
     "codes": [],
     "src": "Ek B, Ek C"
    },
    {
     "h": 1.0,
     "line": "D",
     "task": "Haftalık madencilik seti: 8 soru / 25 dk (sadece öğrenilmiş konular) → 30 dk analiz + hata defteri → 5 dk sonraki haftanın planı",
     "label": "Haftalık madencilik seti: 8 soru / 25 dk",
     "codes": [],
     "src": "Maden (2007–2015)"
    }
   ]
  },
  {
   "n": 24,
   "range": "22–28 Mar",
   "title": "SINAV MODU — D4 (2022)",
   "goal": "Deneme → analiz → hedefli onarım döngüsü.",
   "done": "D4 yapıldı; net grafiğine işlendi; zayıf konular onarıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Önceki denemenin zayıf konusu #1: anlatım + 12 soru",
     "label": "Önceki denemenin zayıf konusu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #2 (kısa: 8 soru)",
     "label": "Zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C hız seti: 12 C sorusu / 30 dk + kontrol",
     "label": "C hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #3 veya M/G hız seti (10 soru / 30 dk)",
     "label": "Zayıf konu #3 veya M/G hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.5,
     "line": "D",
     "task": "D4 — 2022 tam deneme (150 dk, 09:30'da)",
     "label": "D4 — 2022 tam deneme",
     "codes": [],
     "src": "GS 2022"
    },
    {
     "h": 1.5,
     "line": "D",
     "task": "D4 analizi: hata kodları, kategori tablosu, net grafiği + son 10 dk tuzak/formül kağıdı",
     "label": "D4 analizi",
     "codes": [],
     "src": "Ek B, C, D"
    }
   ]
  },
  {
   "n": 25,
   "range": "29 Mar–4 Nis",
   "title": "SINAV MODU — D5 (2018)",
   "goal": "Deneme → analiz → hedefli onarım döngüsü.",
   "done": "D5 yapıldı; net grafiğine işlendi; zayıf konular onarıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Önceki denemenin zayıf konusu #1: anlatım + 12 soru",
     "label": "Önceki denemenin zayıf konusu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #2 (kısa: 8 soru)",
     "label": "Zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C hız seti: 12 C sorusu / 30 dk + kontrol",
     "label": "C hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #3 veya M/G hız seti (10 soru / 30 dk)",
     "label": "Zayıf konu #3 veya M/G hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.5,
     "line": "D",
     "task": "D5 — 2018 tam deneme (150 dk, 09:30'da)",
     "label": "D5 — 2018 tam deneme",
     "codes": [],
     "src": "GS 2018"
    },
    {
     "h": 1.5,
     "line": "D",
     "task": "D5 analizi: hata kodları, kategori tablosu, net grafiği + son 10 dk tuzak/formül kağıdı",
     "label": "D5 analizi",
     "codes": [],
     "src": "Ek B, C, D"
    }
   ]
  },
  {
   "n": 26,
   "range": "5–11 Nis",
   "title": "SINAV MODU — D6 (2023)",
   "goal": "Deneme → analiz → hedefli onarım döngüsü.",
   "done": "D6 yapıldı; net grafiğine işlendi; zayıf konular onarıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Önceki denemenin zayıf konusu #1: anlatım + 12 soru",
     "label": "Önceki denemenin zayıf konusu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #2 (kısa: 8 soru)",
     "label": "Zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C hız seti: 12 C sorusu / 30 dk + kontrol",
     "label": "C hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #3 veya M/G hız seti (10 soru / 30 dk)",
     "label": "Zayıf konu #3 veya M/G hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.5,
     "line": "D",
     "task": "D6 — 2023 tam deneme (150 dk, 09:30'da)",
     "label": "D6 — 2023 tam deneme",
     "codes": [],
     "src": "GS 2023"
    },
    {
     "h": 1.5,
     "line": "D",
     "task": "D6 analizi: hata kodları, kategori tablosu, net grafiği + son 10 dk tuzak/formül kağıdı",
     "label": "D6 analizi",
     "codes": [],
     "src": "Ek B, C, D"
    }
   ]
  },
  {
   "n": 27,
   "range": "12–18 Nis",
   "title": "SINAV MODU — D7 (2024)",
   "goal": "Deneme → analiz → hedefli onarım döngüsü.",
   "done": "D7 yapıldı; net grafiğine işlendi; zayıf konular onarıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Önceki denemenin zayıf konusu #1: anlatım + 12 soru",
     "label": "Önceki denemenin zayıf konusu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #2 (kısa: 8 soru)",
     "label": "Zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C hız seti: 12 C sorusu / 30 dk + kontrol",
     "label": "C hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #3 veya M/G hız seti (10 soru / 30 dk)",
     "label": "Zayıf konu #3 veya M/G hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.5,
     "line": "D",
     "task": "D7 — 2024 tam deneme (150 dk, 09:30'da)",
     "label": "D7 — 2024 tam deneme",
     "codes": [],
     "src": "GS 2024"
    },
    {
     "h": 1.5,
     "line": "D",
     "task": "D7 analizi: hata kodları, kategori tablosu, net grafiği + son 10 dk tuzak/formül kağıdı",
     "label": "D7 analizi",
     "codes": [],
     "src": "Ek B, C, D"
    }
   ]
  },
  {
   "n": 28,
   "range": "19–25 Nis",
   "title": "SINAV MODU — D8 (2025)",
   "goal": "Deneme → analiz → hedefli onarım döngüsü.",
   "done": "D8 yapıldı; net grafiğine işlendi; zayıf konular onarıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Önceki denemenin zayıf konusu #1: anlatım + 12 soru",
     "label": "Önceki denemenin zayıf konusu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #2 (kısa: 8 soru)",
     "label": "Zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C hız seti: 12 C sorusu / 30 dk + kontrol",
     "label": "C hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #3 veya M/G hız seti (10 soru / 30 dk)",
     "label": "Zayıf konu #3 veya M/G hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.5,
     "line": "D",
     "task": "D8 — 2025 tam deneme (150 dk, 09:30'da)",
     "label": "D8 — 2025 tam deneme",
     "codes": [],
     "src": "GS 2025"
    },
    {
     "h": 1.5,
     "line": "D",
     "task": "D8 analizi: hata kodları, kategori tablosu, net grafiği + son 10 dk tuzak/formül kağıdı",
     "label": "D8 analizi",
     "codes": [],
     "src": "Ek B, C, D"
    }
   ]
  },
  {
   "n": 29,
   "range": "26 Nis–2 May",
   "title": "SINAV MODU — D9 (2026)",
   "goal": "Deneme → analiz → hedefli onarım döngüsü.",
   "done": "D9 yapıldı; net grafiğine işlendi; zayıf konular onarıldı.",
   "days": [
    {
     "h": 1.5,
     "line": "T",
     "task": "Önceki denemenin zayıf konusu #1: anlatım + 12 soru",
     "label": "Önceki denemenin zayıf konusu #1",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #2 (kısa: 8 soru)",
     "label": "Zayıf konu #2",
     "codes": [],
     "src": "Hata defteri"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "C hız seti: 12 C sorusu / 30 dk + kontrol",
     "label": "C hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 1.0,
     "line": "T",
     "task": "Zayıf konu #3 veya M/G hız seti (10 soru / 30 dk)",
     "label": "Zayıf konu #3 veya M/G hız seti",
     "codes": [],
     "src": "Maden"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    },
    {
     "h": 2.5,
     "line": "D",
     "task": "D9 — 2026 tam deneme (150 dk, 09:30'da)",
     "label": "D9 — 2026 tam deneme",
     "codes": [],
     "src": "GS 2026"
    },
    {
     "h": 1.5,
     "line": "D",
     "task": "D9 analizi: hata kodları, kategori tablosu, net grafiği + son 10 dk tuzak/formül kağıdı",
     "label": "D9 analizi",
     "codes": [],
     "src": "Ek B, C, D"
    }
   ]
  },
  {
   "n": 30,
   "range": "3–8 May",
   "title": "SINAV HAFTASI (8 Mayıs senaryosu)",
   "goal": "Yeni bir şey öğrenme; hafızayı tazele, dinlen.",
   "done": "Sınava dinlenmiş gir.",
   "days": [
    {
     "h": 1.0,
     "line": "T",
     "task": "Hata defterinin tamamı",
     "label": "Hata defterinin tamamı",
     "codes": [],
     "src": "—"
    },
    {
     "h": 1.0,
     "line": "C",
     "task": "Tuzak kağıdı + 8 C sorusu",
     "label": "Tuzak kağıdı + 8 C sorusu",
     "codes": [],
     "src": "Ek C"
    },
    {
     "h": 0.5,
     "line": "M",
     "task": "Formül kağıdı + 4 M sorusu",
     "label": "Formül kağıdı + 4 M sorusu",
     "codes": [],
     "src": "Ek B"
    },
    {
     "h": 0.5,
     "line": "G",
     "task": "G/A özeti (soru yok)",
     "label": "G/A özeti",
     "codes": [],
     "src": "—"
    },
    {
     "h": 0.0,
     "line": "T",
     "task": "Dinlen. Çanta: kimlik, sınava giriş belgesi, kurşun kalem, silgi. Erken uyku",
     "label": "Dinlen. Çanta",
     "codes": [],
     "src": "—"
    },
    {
     "h": 0.0,
     "line": "D",
     "task": "SINAV — 09:30–12:00",
     "label": "SINAV — 09:30–12:00",
     "codes": [],
     "src": "—"
    },
    {
     "h": 0,
     "line": "",
     "task": "",
     "label": "",
     "codes": [],
     "src": ""
    }
   ]
  }
 ],
 "exams": [
  {
   "code": "D1",
   "date": "2027-02-06",
   "target": 15,
   "year": "2019"
  },
  {
   "code": "D2",
   "date": "2027-02-27",
   "target": 18,
   "year": "2020"
  },
  {
   "code": "D3",
   "date": "2027-03-13",
   "target": 22,
   "year": "2021"
  },
  {
   "code": "D4",
   "date": "2027-03-27",
   "target": 25,
   "year": "2022"
  },
  {
   "code": "D5",
   "date": "2027-04-03",
   "target": 27,
   "year": "2018"
  },
  {
   "code": "D6",
   "date": "2027-04-10",
   "target": 30,
   "year": "2023"
  },
  {
   "code": "D7",
   "date": "2027-04-17",
   "target": 32,
   "year": "2024"
  },
  {
   "code": "D8",
   "date": "2027-04-24",
   "target": 34,
   "year": "2025"
  },
  {
   "code": "D9",
   "date": "2027-05-01",
   "target": 35,
   "year": "2026"
  },
  {
   "code": "SINAV",
   "date": "2027-05-08",
   "target": 38,
   "year": ""
  }
 ]
};
