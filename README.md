# Scholar's Journey v1.8.4 — Pilihan Terkunci + UI Polish

Build ini menambahkan struktur **Fakultas → Jurusan**, dengan hadiah default **Fakultas Ekonomi dan Bisnis (FEB) → Manajemen (S1)**. Pemain tetap dapat memilih fakultas/jurusan lain.

## Alur baru
Menu → intro VN → pilih fakultas → pilih jurusan → perjalanan Semester 1–8 → sidang gaya Visual Novel → ACC → jalan akhir → carousel kenangan kampus → scrolling ucapan keluarga → layar wisuda → Graduation Keepsake premium.

## Personalisasi utama
Edit `js/config.js`:
- `GAME_CONFIG.player.nickname`
- `GAME_CONFIG.player.fullName`
- `GAME_CONFIG.player.faculty`
- `GAME_CONFIG.player.major`
- `GAME_CONFIG.graduation.senderLines` untuk urutan **Ayah & Ibu → Keluarga Besar Tercinta → nama keluarga/pengirim**.

## Academic Gear
- FEB: Market Trend (bullish/bearish)
- FT: Laptop
- FP: Bio Seed (benih + daun + DNA)
- FKIP: Buku & Pointer
- FISIP: Megafon

Skill Semester 1–8 dibuat global untuk semua jalur.

---

# Scholar's Journey v1.5.3 — Greeting Cut

Versi singkat untuk produk ucapan kelulusan. Target total sekitar 45–70 detik tergantung kecepatan dialog/combat.

## Alur
Menu → dialog singkat → pilih fakultas → perjalanan kampus pendek → 8 milestone semester → sidang singkat → ACC → wisuda → ucapan personal → share/download.

Karakter tetap berjalan manual dengan tahan tombol ▼. Dunia tidak auto-scroll.


### Catatan versi QR Greeting
Versi ini dirapikan untuk dipakai sebagai **game ucapan selamat wisuda yang akan diakses dari QR hadiah**.
Fokusnya adalah momen cepat, suasana kampus yang hidup, komedi/kenangan lewat NPC, lalu payoff yang jelas menuju ACC dan wisuda.


### Personalisasi ucapan akhir
Edit bagian `graduation` pada `js/config.js`. Gunakan `{{playerName}}` bila ingin nama depan penerima otomatis masuk ke pesan.


### Perbaikan layout v1.5.6
Gedung utama kini tampil menutup jalur seperti tujuan yang harus dimasuki. UI kontrol dijaga tetap di sisi luar jalur, sedangkan HUD atas dirapikan agar lebih aman pada layar smartphone sempit.


### Perbaikan interaksi gedung & bubble NPC
Gedung sekarang berpindah ke interior tepat saat karakter menyentuh awal entrance. Bubble NPC diarahkan ke dalam layar agar teks komedi/kenangan kampus bisa terbaca penuh.


### v1.5.8
Perbaikan berdasarkan pengujian Android: bubble NPC diarahkan ke tengah layar, renderer ambience diringankan saat tombol gerak ditahan, nama gedung tampil di fasad, dan nama ruangan tampil di interior.


### v1.5.9
Bubble NPC sekarang bebas dari clipping dan selalu membuka ke tengah layar. Masuk gedung dipicu saat fasad depan menyentuh karakter; keluar interior tidak menampilkan tulisan keluar/kembali.


### v1.5.10 HUD atas
Panel lokasi, teks PERJALANAN, dan progress bar sekarang dikunci penuh di dalam margin layar tanpa transform layout lama yang membuatnya terpotong.


### Identitas penerima ucapan
Atur `GAME_CONFIG.player.nickname` untuk nama panggilan dan `GAME_CONFIG.player.fullName` untuk nama lengkap. Gelar pada nama sarjana diambil otomatis dari `degreeByFaculty` sesuai fakultas yang dipilih. Semua gelar dan kalimat khusus fakultas tetap dapat diedit dari `config.js`.


## Update v1.6.1 Full Replacement
Versi ini melanjutkan integrasi sprite ke area yang sebelumnya masih prototype/fallback. Fokusnya adalah membuat pengalaman lebih konsisten untuk kebutuhan web ucapan wisuda berbasis QR, dengan menu, tutorial, loot, boss, dan ending sama-sama menggunakan aset gambar.


## v1.6.2 Background Polish
Gameplay tetap satu dunia vertikal kontinu. Background kampus sekarang memakai gambar besar sebagai lapisan jauh, vegetasi sprite berulang di sisi jalan, interior berbasis gambar, serta grading pagi-sore-malam. Semua lapisan utama bergerak dengan transform agar tetap ringan di smartphone.


## v1.6.3 — Semangat & Anti-Cheat
HUD kanan atas menampilkan `Semangat ya, [nama panggilan]!`. Sebelum Semester 8, game mengecek partisipasi pemain. Jika perjalanan hanya dilewati tanpa combat/tugas, pemain dikembalikan ke Semester 1. Bubble NPC juga diposisikan di layer lebih tinggi daripada karakter.


### Musik wisuda MP3
BGM final berada di `assets/audio/graduation-bgm.mp3`. Untuk mengganti dengan lagu sendiri, timpa file tersebut atau ubah `GAME_CONFIG.audio.customGraduationMusic` di `js/config.js`.


## v1.6.6 — Edit bagian Tentang
Untuk mengganti nama pembuat, buka `js/config.js`, lalu ubah `GAME_CONFIG.about.creator`. Judul dan deskripsi popup Tentang juga dapat diubah dari `GAME_CONFIG.about.title` dan `GAME_CONFIG.about.description`.


### v1.6.8
Karakter gameplay memakai satu almamater kampus kuning (#fdff00), sementara identitas warna fakultas ditampilkan pada ornamen toga saat wisuda. Combat juga diubah menjadi wave maksimal dua monster agar perjalanan lebih santai dan memberi ruang membaca dialog NPC.

## v1.8.1 Loading Startup
Splash memuat aset awal secara nyata sebelum menu muncul, dengan minimum 2,3 detik dan fallback bila ada gambar yang gagal dimuat.
