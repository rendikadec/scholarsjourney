## v1.8.4 — Pilihan terkunci + perbaikan UI
- Fakultas: hanya Fakultas Ekonomi dan Bisnis yang bisa dipilih; fakultas lain tampil terkunci (tombol lanjut nonaktif).
- Jurusan: hanya Manajemen yang aktif; jurusan lain nonaktif. Atur di `GAME_CONFIG.selection` (`js/config.js`); kosongkan array untuk membuka semua.
- Loot dan jajanan tidak lagi dalam lingkaran, label nama lebih besar dan terbaca.
- Nama monster dan label nama gedung tidak lagi terpotong (penyebab: `contain: paint` pada `.entity` dan `.world-prop`).
- Popup NPC dinaikkan ke z-index tertinggi di dunia game.
- Tombol KERJAKAN dan SPECIAL dilebarkan; nama skill panjang boleh dua baris tanpa terpotong.
- Tutorial "Siap Kuliah?": tombol KEMBALI dihapus.

## v1.8.3 — Action Loader benar-benar aktif + prop muncul sejak frame pertama
- Memanggil overlay spinner sesudah tutorial, sebelum gerak/spawn aktif.
- Mengganti nama aset preload yang salah dengan daftar sprite sebenarnya; membatasi decode paralel.
- Setelah membuat prop, langsung panggil renderWorld(true), tanpa menunggu tombol ▼.
- Progress UI dibatasi per 0,2% untuk menghindari style update tiap frame.
- Menghapus efek backdrop blur berat pada overlay untuk ponsel.
- Mengatur ulang timestamp tick saat action baru dimulai agar tidak ada loncatan frame.

v1.8.2

## v1.8.1 — Loading Aset Profesional
- Splash screen premium Universitas Siliwangi dengan logo, progress, status, dan fade halus.
- Progress berdasarkan jumlah aset gambar yang benar-benar selesai dimuat (termasuk kegagalan).
- Prefetch aset awal: menu, sprite karakter, NPC, properti/gedung, gear, dan interior.
- Durasi minimum 2,3 detik; batas tunggu agar koneksi lambat tidak menggantung permanen.
- Tombol Mulai terkunci sampai loading selesai; pengaturan/UX game lama dipertahankan.

# v1.7.0 — Faculty → Major + VN Sidang + Memory Epilogue

- Menambahkan pemilihan jurusan setelah fakultas, dengan daftar jurusan sesuai konsep final.
- Default hadiah diarahkan ke FEB → Manajemen (S1), gelar default S.M.
- Fakultas Ekonomi berganti menjadi Fakultas Ekonomi dan Bisnis (FEB).
- Academic Gear baru: FEB Market Trend, FT Laptop, FP Bio Seed; FKIP dan FISIP dipertahankan.
- Progress skill Semester 1–8 dibuat global untuk semua fakultas/jurusan.
- Sidang diubah dari boss battle menjadi Visual Novel interaktif 3 pertanyaan, pacing lebih pelan dan dialog lebih natural.
- Menambahkan 4-slide carousel kenangan kampus dengan efek zoom/pan.
- Menambahkan scrolling ucapan keluarga dari atas ke bawah dengan penutup Selamat + pengucap berlapis.
- Share/download diubah menjadi Graduation Keepsake 4:5 premium tanpa statistik game yang ramai.
- Tetap mempertahankan KERJAKAN, walk left/right, clean building props, wave maksimum 2 monster, dan anti-cheat.

---

# Scholar's Journey v1.5.3 — Greeting Cut

- Target pengalaman dipangkas menjadi sekitar 45–70 detik.
- Panjang dunia dipadatkan menjadi sepertiga versi sebelumnya; karakter tidak sekadar dipercepat.
- 8 semester tetap muncul sebagai milestone/skill montage cepat.
- Intro, tutorial, pre-boss, dan ACC dialog dipersingkat.
- Sidang cukup sekitar dua jawaban benar untuk selesai.
- Monster aktif dibatasi agar combat tidak menahan perjalanan terlalu lama.
- NPC, landmark, interior, parallax, dan pesta wisuda tetap dipertahankan.
- Fokus utama sekarang adalah payoff ucapan selamat, kartu share, dan download.


## v1.5.4 — QR Greeting Polish
- Building entrances (faculty/library/thesis room) are now visibly larger and closer to the center lane before the transition indoors.
- Monster nameplates are larger and side-aware so they no longer look cut off when spawning from the left/right edge.
- Campus snack drops are now varied (batagor, gorengan, roti bakar, donat, mie/bakso, etc.) while keeping the same healing balance.
- NPC chatter is rewritten to carry more campus memories, jokes, and emotional payoff for a graduation greeting experience.


## v1.5.5 — Polished Graduation Ending
- Ending copy rewritten to feel warmer, more personal, and less template-like.
- Graduation message supports dynamic player placeholders such as {{playerName}}.
- ACC dialogue and the final walk-to-graduation line are more emotional.
- Share/download card now uses the same personalized graduation copy.
- Ending actions renamed to “Bagikan Momen”, “Simpan Kenangan”, and “Ulangi Perjalanan”.


## v1.5.6 — Road Entrance + HUD Fix
- Building entrances are moved from the roadside into the center lane so the player clearly sees the destination before entering.
- The zone transition still triggers when the player reaches the start of the entrance area, creating a more natural walk-into-the-room effect.
- The road is now neutral grey and slightly narrower, making the campus lane clearer and keeping the bottom controls out of the lane.
- Top HUD spacing is stabilized and cleaned up to prevent the upper UI from looking broken or cramped.
- Monster nameplates are further enlarged for readability.


## v1.5.7 — Entrance Trigger + NPC Bubble Fix
- Interior zones now begin exactly when the player touches the front of the entrance building, making the transition feel like walking into the door.
- Once inside, the corresponding entrance building is hidden so the interior view stays clean.
- NPC speech bubbles are aligned inward from the left/right roadside so text no longer gets cut off at the screen edge.


## v1.5.8 — NPC Text, Movement & Room Labels
- NPC bubbles now open inward: left-side NPCs speak to the right, right-side NPCs speak to the left, preventing text clipping.
- Road/parallax remain full-frame while expensive NPC/decor props update at ~30fps during movement for smoother held-arrow controls.
- Decorative NPC bobbing is paused while moving to reduce Android paint load.
- Exterior building names are printed directly on the facade.
- Interior rooms now show a large room/building name sign.
- Building entrance props are force-refreshed on zone transitions, so the exterior building is hidden indoors and restored immediately after exiting.

- Added exit facades at the end of each interior so the building icon/name immediately reappears when returning outside.


## v1.5.9 — True Building Touch + NPC Crop Fix
- NPC landmark data now explicitly marks left/right side; inward speech-bubble placement finally applies to every roadside NPC.
- Removed paint containment from NPC/world-prop rendering so longer speech bubbles are not cropped by the sprite box.
- Building interior transition now starts when the front of the facade physically reaches the player, instead of waiting until the building center reaches the player.
- Removed all KELUAR/KEMBALI text when leaving interiors; restored facades show only their normal building name.


## v1.5.10 — Top Journey HUD Fix
- Fixed the journey/progress panel being shifted left by a legacy `translateX(-50%)`.
- Removed ellipsis/cropping from location and journey percentage labels.
- Rebalanced the top HUD stack for narrow Android screens.


## v1.5.11 — Personalized Graduate Identity + Faculty Greeting
- Added separate nickname and full-name fields.
- Graduate display name now automatically combines full name with a faculty-specific degree.
- Default degrees: Ekonomi S.E., FKIP S.Pd., Pertanian S.P., FISIP S.Sos., Teknik S.T.
- Graduation copy now includes a faculty-specific message.
- Removed the yellow/dashed centre line from the campus road.


## v1.6.0 — Sprite Asset Integration (Phase 1)
- Integrasi sprite image untuk karakter utama per fakultas.
- Tombol attack/special dan held tool kini memakai asset tool pixel-art.
- Monster utama berganti dari emoji/CSS prototype menjadi sprite image.
- NPC pinggir jalan dan landmark kampus utama memakai sprite hasil crop dari asset sheet.
- Loot note/mood/inspiration mulai memakai sprite; snack tetap fallback emoji sampai set snack final tersedia.


## v1.6.1 — Full Replacement Pass
- Semua loot snack kampus kini memakai sprite image (batagor, gorengan, donat, roti bakar, mie/bakso).
- Main menu mendapat hero image sprite.
- Tutorial memakai ikon gambar sprite, bukan placeholder teks.
- Tiga penguji pada boss battle kini memakai visual sprite image.
- Karakter wisuda pada ending kini memakai sprite gambar toga.
- Build diarahkan ke konsistensi visual penuh berbasis asset image.


## v1.6.2 — Total Background Polish
- Added a continuous campus backdrop image behind the gameplay world with low-cost transform parallax.
- Added sprite-based repeated vegetation on the left/right side without increasing DOM entity count.
- Reworked the neutral grey road with subtle pavement slabs and no yellow centre line.
- Faculty, library, and thesis interiors now use full image backgrounds.
- Menu, faculty selection, boss room, and graduation screen now use image background scenes.
- Added day/sunset/night/post-ACC color grading while keeping one continuous world.


## v1.6.3 — Motivation + Anti-Cheat
- Added “Semangat ya, [nama panggilan]!” below the semester/pause HUD.
- Added anti-cheat engagement check before Semester 8. Players who only sprint through without fighting or doing academic-note tasks are sent back to Semester 1 with a humorous warning.
- NPC speech bubbles are promoted above the player layer so dialogue is not hidden behind the heroine.


## v1.6.4 — Graduation MP3 BGM
- Layar akhir/wisuda kini memakai BGM MP3 asli yang disertakan di assets/audio/graduation-bgm.mp3.
- MP3 baru dimulai saat layar ucapan wisuda terbuka, bukan ketika baru keluar ruang sidang.
- Tombol Putar Musik / Pause Musik ditambahkan pada layar ending.
- Jika autoplay mobile ditolak browser, pemain bisa menekan Putar Musik untuk memulai BGM.


## v1.6.5 — Translucent NPC Bubbles
- Bubble teks NPC dibuat semi-transparan agar karakter tetap terlihat di belakangnya.
- Ditambahkan backdrop blur tipis agar tetap terbaca namun tidak terlalu menutup gameplay.


## v1.6.6 — Smartphone Hint + About
- Menambahkan keterangan di menu awal: Gunakan smartphone untuk hasil maksimal.
- Menambahkan tombol TENTANG pada menu utama.
- Popup Tentang menampilkan deskripsi game dan kredit 'Game ini dibuat oleh'.
- Nama pembuat dapat diedit dari GAME_CONFIG.about.creator di js/config.js.


## v1.6.7 — Default-to-Faculty Sprite Flow
- Sebelum memilih fakultas, karakter utama memakai sprite normal/default.
- Setelah fakultas dipilih, sprite karakter berganti ke salah satu dari 5 varian sesuai warna/jurusan.
- Alur visual kini lebih natural: awal masuk kuliah netral, lalu identitas fakultas muncul setelah pemilihan.


## v1.6.8 — Calm Two-Monster Waves + Campus Almamater
- Maksimal hanya 2 monster aktif dalam satu waktu.
- Wave baru baru muncul setelah wave sebelumnya habis, dengan jeda sekitar 2 detik untuk membaca NPC.
- Sprite gameplay tidak lagi bercabang berdasarkan fakultas. Setelah masuk kampus semua memakai almamater kuning #fdff00.
- Sebelum masuk kampus karakter tetap menggunakan pakaian normal/default.
- Saat wisuda, toga memakai ornamen/stola warna fakultas: Ekonomi, FKIP, Pertanian, FISIP, atau Teknik.


## v1.6.9 — Compact NPC Speech
- Teks NPC otomatis turun ke baris berikutnya jika tidak muat.
- Bubble diposisikan tepat di atas NPC dengan margin tipis agar tidak menutupi karakter.
- NPC di tepi kiri/kanan menggeser bubble sedikit ke arah dalam layar agar tetap terbaca.
- Padding dan ukuran bubble diperkecil supaya gameplay tetap terlihat.


## v1.6.10 — Vertical NPC Speech Box
- Bubble NPC tidak lagi melebar ke arah jalan.
- Semua NPC memakai kotak teks sempit tepat di atas kepala.
- Teks panjang dibiarkan membungkus ke banyak baris sehingga kotak tumbuh ke atas.
- Aturan kiri/kanan lama dinetralkan agar bubble tidak lagi terdorong ke pinggir atau ke jalur karakter.


## v1.6.11 — Clean Props + Kerjakan Action
- Bangunan tampil sebagai gambar murni tanpa fill/border/shadow panel.
- Tombol SERANG diganti menjadi KERJAKAN.
- Ditambah sprite pose KERJAKAN dan dua frame jalan kiri/kanan bergantian.
- NPC diberi margin posisi terhadap prop agar tidak saling menumpuk.
- Badan NPC/prop berada di bawah karakter; hanya bubble teks yang boleh berada di atas.


## v1.7.1 — NPC Margin + No Trees + Bigger Road Buildings
- NPC diberi margin aman dari sisi kiri/kanan agar bubble tidak terpotong.
- Antar NPC diberi jarak minimum lebih besar agar tidak bertumpuk.
- Semua objek pohon di world dihapus.
- Background parallax pohon samping dinonaktifkan.
- Gedung yang berada di jalan diperbesar 50%.


## v1.7.2 — Road Buildings Restored + Smooth Movement
- Memperbaiki gedung road-entry yang hilang karena transform CSS menimpa transform posisi JavaScript.
- Pembesaran 150% sekarang diterapkan pada artwork gedung, bukan container world.
- Gerakan world/prop yang terlihat diperbarui setiap animation frame.
- Visibility dan proximity scan dipisah dan diturunkan frekuensinya untuk mengurangi beban DOM.
- Frame-skip 45 FPS yang efektif jatuh ke sekitar 30 FPS pada layar 60 Hz dihapus.


## v1.7.3 — Road Building Foreground + Clean VN Portrait
- Gedung road-entry dinaikkan ke foreground di atas karakter utama.
- Overlay CSS legacy pada portrait novel dihapus agar tidak ada objek asing di atas karakter NPC/penguji/advisor.


## v1.7.4 — Universitas Siliwangi Branding
- Seluruh identitas kampus di kode diperbarui menjadi Universitas Siliwangi.
- Logo kampus diganti ke logo Universitas Siliwangi dari asset yang dilampirkan.
- Teks gapura dan monumen diperbarui menjadi Universitas Siliwangi dan 20 Mei 1978.
- Branding menu, wisuda, dan keepsake kini konsisten memakai identitas kampus baru.


## v1.7.5 — Direct Background Mode
- Jalan CSS (`road-ribbon`) dinonaktifkan; jalan sekarang sepenuhnya berasal dari background image.
- Lapisan hijau world viewport dihapus.
- Parallax sky/far/mid, color grading, vignette, dan filter time-of-day dinonaktifkan untuk gameplay exterior.
- Background jalan + rumput bersih dipasang langsung sebagai `campus_far.webp`.
- Transform background/parallax per-frame dihapus agar scrolling karakter lebih ringan dan halus.
- Background interior ditampilkan langsung tanpa gradient tint tambahan.


## v1.7.6 — Garden Props + NPC Foreground
- Menambahkan asset Pohon.png dan Taman.png sebagai dekor taman kanan/kiri.
- Asset taman sisi kiri di-flip agar komposisi simetris.
- NPC dipindah ke 25% / 75% layar untuk margin aman dari tepi dan dekor.
- Jarak minimum antar NPC diperbesar agar bubble tidak bertumpuk.
- Layer NPC dan textbox dinaikkan di atas asset taman.
- Dekor taman otomatis disembunyikan saat masuk interior.


## v1.7.7 — Continuous Exterior Garden
- Pohon dan taman kini muncul berulang di sisi kiri dan kanan sepanjang seluruh area perjalanan luar.
- Pola dekorasi bergantian pohon/taman dengan jarak konsisten agar tidak terlalu rapat.
- Jalur NPC digeser lebih ke dalam untuk menjaga ruang visual dari dekorasi.
- Semua dekorasi taman otomatis disembunyikan pada setiap zona interior.
- Z-layer NPC dan textbox tetap berada di atas seluruh dekorasi taman.


## v1.7.8 — Clean Centre-Road Layout
- Menghapus seluruh prop dekor kanan/kiri; sisi kini khusus NPC dan textbox.
- Hanya landmark/gedung tengah jalan yang dirender.
- NPC dipindah ke lane samping aman dan dijauhkan dari gedung tengah serta NPC lain.
- Aturan ukuran gedung dikonsolidasikan agar proporsional dan tidak bentrok dengan scale lama.
- Label bangunan dipindahkan ke plaque terpisah di atas artwork dengan lebar responsif agar tidak terpotong.


## v1.7.9 — Slow Blessing + Readable NPC + Kantin
- Scroll ucapan keluarga diperlambat menjadi sekitar 32 detik, dengan jeda akhir lebih panjang.
- Font textbox NPC diperbesar dan padding ditambah agar lebih mudah dibaca di smartphone.
- Kantin Kampus ditambahkan sebagai landmark besar di tengah jalan.
- Dialog NPC sekitar kantin kini mengenang seblak pedas, Pentol Beradik, dan ayam geprek.


## v1.8.0 — Gate Depth + Canteen Interior + Garden Return
- Gapura diperbesar dan ditinggikan, selebar jalur, serta selalu berada di depan karakter.
- Nama gedung diperjelas sebelum karakter masuk.
- Kantin menjadi zona interior dengan background ruangan sendiri.
- Gedung entry naik ke depan karakter saat disentuh; facade exit berada di belakang karakter saat keluar.
- Pohon/taman kembali menghiasi kedua sisi sepanjang area luar dan otomatis hilang di interior.
- NPC dan bubble berada di atas dekor; bubble selalu tepat di atas NPC dan tidak masuk ke area jalan.
