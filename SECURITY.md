# Güvenlik Politikası (Security Policy)

## Desteklenen Sürümler

Aşağıdaki tabloda projenin güvenlik güncellemeleri alan aktif sürümleri yer almaktadır:

| Sürüm | Destekleniyor mu? |
| ----- | ----------------- |
| 1.0.x | :white_check_mark: |
| < 1.0 | :x:                |

---

## Güvenlik Açığı Bildirimi

`Cyber Economy Tycoon` projesinde herhangi bir güvenlik açığı veya yetkisiz erişim riski bulursanız, lütfen bunu kamuya açık bir GitHub "Issue" konusu olarak **bildirmeyin**.

Bunun yerine güvenlik sorununu doğrudan geliştiriciye iletin:

* **İletişim:** Proje Yöneticisi / Purpleguy
* **E-Posta:** (Varsa iletişim e-postanızı ekleyin)

Bildirilen güvenlik açıkları en geç 48 saat içerisinde incelenip gerekli güncellemeler yayınlanacaktır.

---

## Güvenlik Standartları

* **Client-Side Security:** Firebase kimlik doğrulama işlemleri doğrudan yetkili Firebase Web SDK modülleri üzerinden yürütülür.
* **Firestore Rules:** Veritabanı erişimleri yetkilendirilmiş kullanıcı kimlik doğrulama kurallarıyla koruma altına alınmalıdır.
