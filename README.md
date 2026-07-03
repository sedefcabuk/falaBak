## KULLANILAN TEKNOLOJİLER

Expo SDK 54
TypeScript
Expo Router
expo-linking

## KURULUM

`npx create-expo-app@latest falabak --template blank-typescript` komutu ile falabak adında bir klasör oluşturup Expo'nun resmi TypeScript şablonuyla yeni bir proje oluşturup gerekli paketleri otomatik kuruyoruz.
`cd falabak` ile proje klasörüne gidiyoruz.
`git init`  projeyi kendi bağımsız git deposu haline getiriyoruz.
`npx expo start` metro geliştirme sunucusunu başlatır, açılan QR kod ile Expo Go üzerinden telefonda ya da `i`/`a`/`w` tuşlarıyla simülatör/emülatör/web'de açılır.
`npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar` ile gerekli paketleri kuruyoruz.

Ayrıca `package.json` içinde `"main"` alanı `"expo-router/entry"` olarak değiştirildi,
böylece uygulamanın giriş noktası Expo Router'ın route sistemine bağlandı.
`mkdir app, components, theme, hooks, types, data` ile 6 dosya oluşturuldu.
app/          # Expo Router route'ları (ekranlar)
components/   # Tekrar kullanılabilir UI parçaları
theme/        # Tema
hooks/        # Özel React hook'ları
types/        # TypeScript veri tipleri
data/         # falabak-data.json

`npx expo install expo-linear-gradient expo-haptics @expo/vector-icons react-native-gesture-handler react-native-reanimated` ile diğer gerekli paketleri kuruyoruz.

Not: Projede bir `.npmrc` dosyası bulunur (`legacy-peer-deps=true`). Bu, Expo/React Native ekosistemindeki paketler arasında sık görülen peer-dependency uyuşmazlıklarını `npm install` sırasında engellememesi için eklendi.

## Deep linking

`app.json` içine `"scheme": "falabak"` eklendi. Bu sayede uygulama
`falabak://tarot` gibi bir URL ile doğrudan Tarot ekranına açılabilir.

## Veri Modeli

`types/data.ts` — JSON'un TypeScript karşılığı, ekranlar JSON'u bu tipe cast ederek okur böylece alan adı hataları derleme zamanında yakalanır.

## Tema Sistemi

`theme/theme.ts` — tüm renk, tipografi, spacing ve radius değerleri tek dosyada
toplanır.

## Geri Sayım

`hooks/useCountdown.ts` — `promotion.endsAt` değerinden (yoksa
`countdownDurationSeconds`'tan) hedef zamanı hesaplayan, saniyede bir güncellenen
ve unmount'ta interval'i temizleyen bağımsız bir hook. Süre dolunca otomatik olarak
"Süre doldu" durumuna geçer.

## Bileşenler

**TopBar** — Ana Sayfa'da logo, Tarot'ta başlık + geri butonu; ikisinde de jeton bakiyesi
**FortuneTypeCard** — fal türü grid kartı, renkli ikon rozeti + opsiyonel "Tercih Edilen" etiketi
**LifeBalanceCard** — yaşam dengesi kartı, JSON'daki renkle dolu arka plan + ilerleme çubuğu
**ActivityRow** — etkinlik satırı, renkli ikon dairesi + ok
**BottomNav** — pill biçimli alt navigasyon, aktif sekme dolgulu kapsül
**TarotCard** — boş slot / deste kartı / açılmış kart durumlarını tek bileşende yönetir Reanimated ile geçiş animasyonu içerir