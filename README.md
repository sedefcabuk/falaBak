## KULLANILAN TEKNOLOJİLER
Expo SDK 54
TypeScript
Expo Router
expo-linking

## KURULUM
`npx create-expo-app@latest falabak --template blank-typescript` komutu ile falabak adında bir klasör oluşturup Expo'nun resmi TypeScript şablonuyla yeni bir proje oluşturup gerekli paketleri otomatik kuruyoruz.
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

## Ekranlar
**`app/_layout.tsx`** — Expo Router'ın kök layout dosyası. `GestureHandlerRootView` ile
tüm uygulamayı sarar (gesture-handler/reanimated için zorunlu), `Stack` ile Ana Sayfa ↔
Tarot arasında native navigasyon sağlar, `headerShown: false` ile native header kapatılıp
kendi `TopBar` bileşenimiz kullanılır.

**`app/index.tsx`** (Ana Sayfa) — JSON'u `FalaBakData` tipine cast edip okur. Üst bar,
dinamik "Hoş Geldin" başlığı, Günün Sözü ve indirim kartı (gradyanlı, `useCountdown` ile
canlı geri sayım), Fal Türlerimiz grid'i, Yaşam Dengesi kartları, Etkinlikler listesi ve
alt navigasyonu birleştirir. "Tarot Falı" kartına basılınca `router.push("/tarot")` ile
yönlendirme yapılır (`fortuneTypes` içindeki `route: "tarot"` alanına bakılarak).

**`app/tarot.tsx`** (Tarot Falı) — `picks` state'i sırayla dolan 3 slotu (Geçmiş/Şimdi/
Gelecek) tutar. Her kart seçiminde düz/ters durumu rastgele belirlenir ve hafif titreşim
(`expo-haptics`) tetiklenir. `usedIds` ile bir kartın iki kez seçilmesi engellenir. Üç slot
dolunca kartların anlamı (düz/ters) gösterilir. "Tekrar çek / sıfırla" ile state temizlenir.
Deste, `rotate` ve `marginLeft` hesaplamalarıyla yelpaze (fan) görünümü elde eder.

## Çalıştırma
npx expo start

