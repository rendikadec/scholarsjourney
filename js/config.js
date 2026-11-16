const GAME_CONFIG = {
  game: {
    title: "Scholar's Journey",
    language: "id",
    version: "1.8.4",
    orientation: "portrait",
    semesterDuration: 0, // progres semester sekarang berdasarkan posisi timeline, bukan waktu
    spawnEveryMs: 3200
  },
  university: {
    name: "Universitas Siliwangi",
    shortName: "UNSIL",
    logo: "assets/custom/university-logo.png",
    gateText: "Universitas Siliwangi",
    monumentTitle: "Universitas Siliwangi",
    monumentText: "20 Mei 1978",
    colors: {
      darkBrown: "#4B2E22",
      brown: "#70452F",
      lightBrown: "#C89567",
      cream: "#F1D5AE"
    }
  },
  player: {
    nickname: "Bunga",
    fullName: "Bunga Iklima Banani Yusuf",
    // Hadiah ini difokuskan ke FEB → Manajemen, tetapi pilihan tetap terbuka di awal game.
    faculty: "economics",
    major: "manajemen"
  },

  // Kunci pilihan di layar Fakultas/Jurusan.
  // Kosongkan array (misalnya allowedFaculties: []) untuk membuka semua pilihan.
  selection: {
    allowedFaculties: ["economics"],
    allowedMajors: ["manajemen"]
  },

  about: {
    title: "Scholar's Journey",
    description: "Sebuah mini game ucapan selamat wisuda yang dibuat untuk merayakan perjalanan sampai hari kelulusan.",
    creator: "Nama Pembuat" // edit nama pembuat di sini
  },
  graduation: {
    headline: "AKHIRNYA, SAMPAI JUGA!",
    title: "SELAMAT WISUDA",
    quote: "Tidak semua langkah terasa mudah, tapi setiap langkah telah membawamu sampai ke hari ini.",
    message: "{{playerName}}, semua tugas, presentasi, deadline, revisi, dan hari-hari panjang akhirnya menjadi bagian dari cerita yang berhasil kamu tuntaskan. Semoga ilmu dan pengalaman dari {{major}} menjadi bekal untuk mengambil keputusan besar, menemukan kesempatan baru, dan membangun perjalanan yang benar-benar kamu inginkan.",
    facultyMessages: {
      economics: "Semoga ketelitian membaca peluang dan keberanian mengambil keputusan membawamu menuju banyak hal baik.",
      education: "Semoga ilmu yang kamu bawa selalu menemukan jalan untuk menginspirasi dan memberi arti bagi banyak orang.",
      agriculture: "Semoga setiap ilmu yang kamu tanam tumbuh menjadi manfaat dan masa depan yang kamu banggakan.",
      socialPolitics: "Semoga gagasan, suara, dan kepedulianmu terus membuka ruang untuk perubahan yang berarti.",
      engineering: "Semoga setiap rancangan, solusi, dan keberanianmu membangun sesuatu membawamu menuju karya yang membanggakan."
    },
    blessingLines: [
      "Untuk setiap langkah yang telah ditempuh, untuk setiap lelah yang tidak selalu terlihat, dan untuk setiap doa yang mengiringi perjalanan ini...",
      "Hari ini menjadi saksi bahwa perjuangan panjang itu akhirnya sampai pada satu momen yang indah.",
      "Semua tugas, revisi, presentasi, tawa, air mata, dan cerita selama masa kuliah kini menjadi bagian dari kenangan yang akan selalu berharga.",
      "Semoga setiap ilmu yang didapat menjadi cahaya dalam langkah ke depan. Semoga setiap pengalaman menjadi bekal untuk meraih impian yang lebih besar.",
      "Dan semoga hari ini menjadi awal dari perjalanan baru yang penuh kebahagiaan, keberkahan, dan kesuksesan."
    ],
    senderPrefix: "Yang Mengucapkan",
    senderLines: ["Ayah & Ibu", "Keluarga Besar Tercinta", "Nama Keluarga / Nama Pengirim"],
    senderName: "Ayah & Ibu",
    showSender: true
  },
  gameplay: {
    semesterStart: 1,
    semesterEnd: 8,
    maxMental: 100,
    startMental: 100,

    // Two-minute cut: world remains continuous, but landmarks and encounters arrive much faster.
    // Normal full run target: roughly 1:45–2:30 depending on combat and reading speed.
    worldLength: 9600,
    // Koordinat dunia diperbesar agar langkah terlihat lebih responsif tanpa memendekkan durasi perjalanan.
    worldScale: 1.6,
    walkSpeed: 230,
    backtrackSpeed: 260,
    attackEnergyMax: 100,
    attackEnergyStart: 100,
    attackCost: 20,
    attackEnergyRegenPerSecond: 18,
    attackDamage: 1,
    attackRangeWorld: 300,
    attackRangeSidePercent: 19, // radius horizontal serangan normal (%)
    xpPerLevel: 110,
    maxEnemies: 2,

    // Rewards feel like campus life rather than formal counters.
    snackHeal: 10,
    moodHeal: 10,
    moodEnergy: 42,
    noteXP: 35,
    inspirationEnergy: 60
  },
  boss: {
    maxHP: 100,
    correctDamage: 50,
    wrongDamage: 20,
    referenceBonusDamage: 2,
    maxReferenceBonus: 12
  },
  audio: {
    enabled: true,
    musicVolume: 0.35,
    sfxVolume: 0.65,
    customGraduationMusic: "assets/audio/graduation-bgm.mp3" // ganti path ini jika ingin memakai MP3 sendiri
  },
  haptic: {
    enabled: true,
    pickup: 25,
    button: 40,
    enemyHit: 28,
    damage: [120, 60, 160],
    graduation: 300
  }
};
