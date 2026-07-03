## KULLANILAN TEKNOLOJİLER
Expo SDK 54, TypeScript, Expo Router, expo-linking,
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
## Bonus: Jeton Bakiyesi
`contexts/CoinContext.tsx` — `React Context` ile global bir jeton bakiyesi state'i.
`spend(amount)` fonksiyonu bakiye yetersizse `false` döner. Tarot ekranında ilk kart
çekildiğinde (açılım başladığında) `tarotReading.cost` (10 jeton) bir kez düşülür;
bakiye yetersizse kart eklenmez, uyarı kutusu + haptic feedback gösterilir. Hem Ana
Sayfa hem Tarot ekranındaki `TopBar`, aynı bakiyeyi context üzerinden gösterir.
## Bonus: Loading / Skeleton
`components/Skeleton.tsx` — Reanimated ile sürekli nabız gibi atan (`withRepeat`)
placeholder kutu. `HomeSkeleton.tsx` ve `TarotSkeleton.tsx`, ilgili ekranların gerçek
düzenini gri kutularla önceden çizer. Veri lokal JSON'dan geldiği için gerçek bir ağ
gecikmesi yok; skeleton durumunu gösterebilmek için kısa (400-500ms) simüle bir
yükleme süresi eklendi.
## Bonus: "Süre Doldu" Yönetimi
`theme/theme.ts` içine eklenen `gradients.promoExpired` — geri sayım bittiğinde
(`useCountdown().isExpired`) indirim kartı canlı maviden sönük griye geçer, sayaç
yerine "Bu kampanyanın süresi doldu — yeni fırsatlar yakında" mesajı gösterilir.
## Bonus: Responsive Tasarım
`hooks/useResponsive.ts` — `useWindowDimensions` ile ekran genişliğine göre (768px eşik)
tablet/telefon ayrımı yapar. Tablette Fal Türlerimiz grid'i 3 yerine 4 sütuna çıkar,
içerik genişliği büyük ekranlarda 560px ile sınırlanıp ortalanır (edge-to-edge
uzamasın diye).
## Bonus: Animasyon ve Sürükle-Bırak Fiziği
`components/TarotCard.tsx` — Reanimated'ın `entering` animasyonlarıyla deste kartları
sırayla (staggered) beliriyor, açılan kart `ZoomIn` ile yaylı şekilde slota oturuyor.
Kart seçimi artık hem dokunarak hem de **yukarı doğru sürükleyerek** (gesture-handler
`Pan` + `Tap` gesture'larının `Gesture.Race`'i) yapılabiliyor; -30px'ten fazla
sürüklenirse kart seçilir, azsa yay animasyonuyla geri döner. Yatay deste kaydırmasıyla
çakışmaması için sürükleme yalnızca dikey harekette aktive olacak şekilde ayarlandı.
## Bonus: Haptic Feedback
`expo-haptics` — tarot kartı seçiminde ve sıfırlama işleminde cihazın hafif titreşim
vermesi sağlanır:
Kart seçildiğinde → `Haptics.impactAsync(ImpactFeedbackStyle.Light)` (hafif dokunuş hissi)
"Tekrar çek / sıfırla" basıldığında → `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` (biraz daha belirgin, "sıfırlama" hissi)
Yetersiz jetonla kart çekmeye çalışıldığında → `Haptics.notificationAsync(NotificationFeedbackType.Warning)` (uyarı titreşimi, hatayı fiziksel olarak da hissettirir)
Titreşim, ses veya haptic desteği olmayan cihazlarda (örn. bazı Android emülatörleri,
web) sessizce başarısız olabileceği için her çağrı `.catch(() => {})` ile sarılmıştır —
uygulamanın akışını bozmaz.

