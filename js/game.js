const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const WORLD_SCALE = clamp(Number(GAME_CONFIG.gameplay.worldScale) || 1, 1, 2.4);
const W = (n) => Math.round(n * WORLD_SCALE);
// Greeting Cut: compress the long campus world to one third of its previous distance.
const P = (n) => W(Math.round(n / 3.6));
const LOW_POWER = ((navigator.deviceMemory || 8) <= 4) || ((navigator.hardwareConcurrency || 8) <= 4);
const FRAME_MS = 1000 / (LOW_POWER ? 45 : 60);
const ENTRY_TOUCH_OFFSET = 108; // screen/world px: front facade touches the player before building center

const els = {
  root: $('#game-root'), bg: $('#campus-bg'), mainMenu: $('#main-menu'), start: $('#start-btn'), settings: $('#settings-btn'), aboutBtn: $('#about-btn'), aboutModal: $('#about-modal'), aboutClose: $('#about-close'), aboutTitle: $('#about-title'), aboutDescription: $('#about-description'), aboutCreator: $('#about-creator'),
  logo: $('#university-logo'), logoFallback: $('#logo-fallback'), universityName: $('#university-name'), gateText: $('#gate-text'), monumentTitle: $('#monument-title'), monumentText: $('#monument-text'), buildingLabel: $('#building-label'), menuPlayer: $('#menu-player-name'),
  novel: $('#novel-layer'), portrait: $('#portrait'), speaker: $('#speaker'), dialogText: $('#dialog-text'), dialogBox: $('#dialog-box'), choices: $('#choices'), autoBtn: $('#auto-btn'), skipBtn: $('#skip-btn'), logBtn: $('#log-btn'),
  facultyScreen: $('#faculty-screen'), facultyPrev: $('#faculty-prev'), facultyNext: $('#faculty-next'), facultyPreview: $('#faculty-preview'), facultyPreviewIcon: $('#faculty-preview-icon'), facultyPreviewSwatch: $('#faculty-preview-swatch'), facultyPreviewName: $('#faculty-preview-name'), facultyPreviewTool: $('#faculty-preview-tool'), facultyPreviewSkill: $('#faculty-preview-skill'), facultyPreviewDescription: $('#faculty-preview-description'), facultyDots: $('#faculty-dots'), facultyConfirm: $('#faculty-confirm'),
  majorScreen: $('#major-screen'), majorFacultyName: $('#major-faculty-name'), majorList: $('#major-list'), majorBack: $('#major-back'), majorConfirm: $('#major-confirm'),
  gameplay: $('#gameplay-layer'), worldViewport: $('#world-viewport'), sceneArt: $('#world-scene-art'), sky: $('#parallax-sky'), far: $('#parallax-far'), mid: $('#parallax-mid'), worldProps: $('#world-props'), interior: $('#interior-overlay'), interiorRoomLabel: $('#interior-room-label'), road: $('.road-ribbon'), entityLayer: $('#entity-layer'), player: $('#player'),
  hud: $('#hud'), mentalBar: $('#mental-bar'), hpLabel: $('#hp-label'), semesterLabel: $('#semester-label'), cheerLabel: $('#hud-cheer'), semesterProgress: $('#semester-progress'), journeyLabel: $('#journey-label'), locationLabel: $('#location-label'), refLabel: $('#ref-label'), scoreLabel: $('#score-label'), xpLabel: $('#xp-label'), levelLabel: $('#level-label'),
  moveUpBtn: $('#move-up-btn'), moveDownBtn: $('#move-down-btn'), attackBtn: $('#attack-btn'), attackIcon: $('#attack-icon'), attackToolName: $('#attack-tool-name'), attackEnergyBar: $('#attack-energy-bar'), attackEnergyLabel: $('#attack-energy-label'), heldTool: $('#held-tool'), recoveryBanner: $('#recovery-banner'), recoveryBar: $('#recovery-bar'),
  toolBtn: $('#tool-btn'), toolIcon: $('#tool-icon'), skillName: $('#skill-name'), cooldown: $('#cooldown'), shield: $('#shield-ring'), pauseBtn: $('#pause-btn'),
  transition: $('#semester-transition'), transitionKicker: $('#transition-kicker'), transitionSemester: $('#transition-semester'), transitionMessage: $('#transition-message'),
  bossScreen: $('#boss-screen'), bossBar: $('#boss-bar'), bossMental: $('#boss-mental'), bossRef: $('#boss-ref'), examinerName: $('#examiner-name'), bossQuestion: $('#boss-question'), bossAnswers: $('#boss-answers'), examiners: $$('.examiner'),
  memoryScreen: $('#memory-screen'), memoryVisual: $('#memory-visual'), memoryKicker: $('#memory-kicker'), memoryText: $('#memory-text'), memoryDots: $('#memory-dots'), memoryNext: $('#memory-next'),
  blessingScreen: $('#blessing-screen'), blessingName: $('#blessing-name'), blessingViewport: $('#blessing-viewport'), blessingTrack: $('#blessing-track'),
  graduation: $('#graduation-screen'), gradUniversityName: $('#grad-university-name'), gradLogo: $('#grad-logo'), gradLogoImg: $('#grad-logo-img'), gradHeadline: $('#grad-headline'), gradTitle: $('#grad-title'), graduateName: $('#graduate-name'), graduateMajor: $('#graduate-major'), graduateFaculty: $('#graduate-faculty'), gradQuote: $('#grad-quote'), gradMessage: $('#grad-message'), gradSender: $('#grad-sender'), senderPrefix: $('#sender-prefix'), senderName: $('#sender-name'), shareBtn: $('#share-btn'), downloadBtn: $('#download-btn'), replayBtn: $('#replay-btn'), graduationMusicBtn: $('#graduation-music-btn'), celebrationCanvas: $('#celebration-canvas'),
  tutorial: $('#tutorial-modal'), tutorialIcon: $('#tutorial-icon'), tutorialTitle: $('#tutorial-title'), tutorialText: $('#tutorial-text'), tutorialDots: $('#tutorial-dots'), tutorialNext: $('#tutorial-next-btn'), tutorialStart: $('#tutorial-start-btn'),
  pauseModal: $('#pause-modal'), resumeBtn: $('#resume-btn'), pauseSettingsBtn: $('#pause-settings-btn'), menuBtn: $('#menu-btn'), settingsModal: $('#settings-modal'), settingsClose: $('#settings-close'), musicToggle: $('#music-toggle'), sfxToggle: $('#sfx-toggle'), hapticToggle: $('#haptic-toggle'), logModal: $('#log-modal'), logContent: $('#log-content'), logClose: $('#log-close'), gameover: $('#gameover-modal'), retryBtn: $('#retry-btn'), bossRetry: $('#boss-retry-modal'), bossRetryBtn: $('#boss-retry-btn'), fade: $('#fade'), flash: $('#flash'), floatLayer: $('#float-layer'), actionLoading: $('#action-loading'), actionLoadingText: $('#action-loading-text')
};

const WORLD = {
  length: P(18000),
  semesterBounds: [0, 2200, 4400, 6600, 8800, 10800, 12800, 14600, 16000].map(P),
  bossDoor: P(16000),
  celebrationStart: P(16600),
  finish: P(18000),
  zones: [
    { id:'outside-start', from:P(0), to:P(5000)-ENTRY_TOUCH_OFFSET, label:'JALAN UTAMA KAMPUS', interior:false },
    { id:'faculty-interior', from:P(5000)-ENTRY_TOUCH_OFFSET, to:P(6650), label:'GEDUNG FAKULTAS EKONOMI DAN BISNIS', interior:true, building:'faculty' },
    { id:'outside-mid-a', from:P(6650), to:P(7440)-ENTRY_TOUCH_OFFSET, label:'JALAN KANTIN', interior:false },
    { id:'canteen-interior', from:P(7440)-ENTRY_TOUCH_OFFSET, to:P(8160), label:'KANTIN KAMPUS', interior:true, building:'canteen' },
    { id:'outside-mid-b', from:P(8160), to:P(8950)-ENTRY_TOUCH_OFFSET, label:'JALAN PERPUSTAKAAN', interior:false },
    { id:'library', from:P(8950)-ENTRY_TOUCH_OFFSET, to:P(10150), label:'PERPUSTAKAAN UNIVERSITAS SILIWANGI', interior:true, building:'library' },
    { id:'outside-late', from:P(10150), to:P(14450)-ENTRY_TOUCH_OFFSET, label:'JALAN AKADEMIK', interior:false },
    { id:'thesis-interior', from:P(14450)-ENTRY_TOUCH_OFFSET, to:P(16050), label:'RUANG SIDANG & SKRIPSI', interior:true, building:'thesis' },
    { id:'post-acc', from:P(16050), to:P(18001), label:'JALAN MENUJU WISUDA', interior:false }
  ]
};

const LANDMARKS = [
  { y:P(180), side:'center', type:'entry grand-entry road-entry gate-entry', icon:'🏛️', label:'UNIVERSITAS SILIWANGI', x:50, gate:true },
  { y:P(720), side:'left', type:'tree', icon:'🌳', label:'Pohon Kampus', x:15 },
  { y:P(1050), side:'left', type:'building', icon:'🅿️', label:'Area Parkir', x:15 },
  { y:P(1450), side:'right', type:'building', icon:'⚽', label:'Lapangan Bola', x:85 },
  { y:P(2450), side:'left', type:'monument', icon:'🪨', label:'Monumen Kampus', x:16 },
  { y:P(3050), side:'right', type:'tree', icon:'🌺', label:'Taman', x:84 },
  { y:P(3900), side:'left', type:'building', icon:'🥟', label:'Jajanan Kampus', x:15 },
  { y:P(5000), side:'center', type:'building entry grand-entry road-entry', icon:'🏫', label:'GEDUNG FAKULTAS EKONOMI DAN BISNIS', x:50, entry:true, building:'faculty' },
  { y:P(6650), side:'center', type:'building grand-entry road-entry exit-building', icon:'🏫', label:'GEDUNG FAKULTAS EKONOMI DAN BISNIS', x:50, exit:true, building:'faculty' },
  { y:P(6900), side:'left', type:'tree', icon:'🌳', label:'Taman Tengah', x:15 },
  { y:P(7440), side:'center', type:'building entry grand-entry road-entry', icon:'🍜', label:'KANTIN KAMPUS', x:50, entry:true, building:'canteen' },
  { y:P(8160), side:'center', type:'building grand-entry road-entry exit-building', icon:'🍜', label:'KANTIN KAMPUS', x:50, exit:true, building:'canteen' },
  { y:P(8500), side:'left', type:'building', icon:'🎭', label:'UKM & Organisasi', x:15 },
  { y:P(8950), side:'center', type:'building entry grand-entry road-entry', icon:'📚', label:'PERPUSTAKAAN UNIVERSITAS SILIWANGI', x:50, entry:true, building:'library' },
  { y:P(10150), side:'center', type:'building grand-entry road-entry exit-building', icon:'📚', label:'PERPUSTAKAAN UNIVERSITAS SILIWANGI', x:50, exit:true, building:'library' },
  { y:P(10300), side:'left', type:'tree', icon:'🌲', label:'Jalur Teduh', x:15 },
  { y:P(11600), side:'right', type:'building', icon:'🧪', label:'Area Praktikum', x:84 },
  { y:P(13200), side:'left', type:'building', icon:'💻', label:'Area Penelitian', x:15 },
  { y:P(14450), side:'center', type:'building entry grand-entry road-entry', icon:'📑', label:'RUANG SIDANG & SKRIPSI', x:50, entry:true, building:'thesis' },
  { y:P(16050), side:'center', type:'building grand-entry road-entry exit-building', icon:'📑', label:'RUANG SIDANG & SKRIPSI', x:50, exit:true, building:'thesis' },
  { y:P(16180), side:'left', type:'tree', icon:'🌟', label:'ACC!', x:15 },
  { y:P(16800), side:'center', type:'building grand-entry road-entry', icon:'🎓', label:'BANNER WISUDA', x:50 },
  { y:P(17450), side:'left', type:'tree', icon:'🎉', label:'Teman-teman', x:15 },
  { y:P(17920), side:'center', type:'entry', icon:'🏆', label:'PANGGUNG WISUDA', x:50 }
];
for (let y=500, step=(LOW_POWER?900:620); y<17800; y+=step) {
  const left = (Math.floor(y/step)%2===0);
  LANDMARKS.push({ y:P(y+130), type:'tree', icon:left?'🌳':'🌿', label:'', x:left?8:92, side:left?'left':'right' });
}
// v1.8.0: continuous exterior decoration on both sides. These are hidden automatically indoors.
for (let y=900, i=0; y<17650; y+=860, i++) {
  const leftKind=i%2===0?'garden-tree':'garden-bed';
  const rightKind=i%2===0?'garden-bed':'garden-tree';
  LANDMARKS.push({ y:P(y), side:'left', type:`garden-decor ${leftKind==='garden-tree'?'canopy':'flowerbed'}`, x:5.5, decorKind:leftKind, exteriorDecor:true });
  LANDMARKS.push({ y:P(y+170), side:'right', type:`garden-decor ${rightKind==='garden-tree'?'canopy':'flowerbed'}`, x:94.5, decorKind:rightKind, exteriorDecor:true });
}

const NPC_MOMENTS = [
  { y:360, x:9, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Masih maba, tapi gaya sudah senior.' },
  { y:520, x:91, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Katanya kelas pagi itu cuma mitos.' },
  { y:760, x:11, icon:'🧑‍🎓📱', action:'phone', text:'Foto gapura dulu. Biar feed terasa kuliah.' },
  { y:930, x:89, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Dosen killer? Tenang... kita panik bareng.' },
  { y:1180, x:8, icon:'🧑‍🎓🧑‍🎓', action:'chat group', text:'Parkir dekat kelas itu pencapaian semester awal.' },
  { y:1400, x:92, icon:'👩‍🎓📖', action:'read', text:'Niat baca satu halaman, malah nostalgia satu semester.' },
  { y:1660, x:12, icon:'👩‍🎓🥤', action:'snack', text:'Minum dulu. Ilmu lebih masuk kalau mood bagus.' },
  { y:1880, x:88, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Lapangan rame. Tugas juga rame.' },
  { y:2180, x:9, icon:'👩‍🎓📱', action:'phone', text:'Absen grup sudah? Jangan cuma baca doang.' },
  { y:2460, x:91, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Ngerumpi lima menit, pulangnya bawa semua kabar kampus.' },
  { y:2720, x:10, icon:'🧑‍🎓📖', action:'read', text:'Monumen ini saksi tugas mepet dan pertemanan hebat.' },
  { y:3020, x:90, icon:'👩‍🎓🌺', action:'chat', text:'Taman kampus: tempat healing, curhat, dan deadline mendadak.' },
  { y:3300, x:8, icon:'🧑‍🎓🥟', action:'snack', text:'Gorengan hangat: penyelamat isi dompet dan isi hati.' },
  { y:3560, x:92, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Kantin habis ini, yuk. Diskusi juga bisa sambil ngemil.' },
  { y:3860, x:11, icon:'👩‍🎓📚', action:'read', text:'Tugas tiga? Berarti dosennya sayang.' },
  { y:4140, x:89, icon:'🧑‍🎓🧑‍🎓', action:'chat group', text:'Ada kelas pengganti? Semoga cuma isu.' },
  { y:4460, x:9, icon:'👩‍🎓📱', action:'phone', text:'Grup kelas lebih aktif dari hubungan banyak orang.' },
  { y:4760, x:91, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Gedung kita yang itu. Naik tangga, turun motivasi, naik lagi.' },
  { y:5100, x:10, icon:'👩‍🎓📝', action:'read', text:'Ruang 203 ketemu. Sekarang tinggal cari keberanian presentasi.' },
  { y:5420, x:90, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Tangga kampus membentuk betis dan mental.' },
  { y:5740, x:8, icon:'👩‍🎓📖', action:'read', text:'Catatan kemarin lengkap. Sayang tulisannya hieroglif.' },
  { y:6060, x:92, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Jam kosong itu berkah. Sampai dosen tiba-tiba datang.' },
  { y:6380, x:11, icon:'🧑‍🎓💻', action:'read', text:'Wi-Fi lantai dua kencang, iman kuota jadi tenang.' },
  { y:6740, x:89, icon:'👩‍🎓🧋', action:'snack', text:'Mood Booster dulu. Hari ini panjang, tapi kita juga kuat.' },
  { y:7060, x:9, icon:'🧑‍🎓🍜', action:'snack', text:'Seblaknya pedes banget... tapi besok pasti beli lagi.' },
  { y:8140, x:91, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Pentol Beradik super enak deh. Sekali beli, besok nyari lagi.' },
  { y:8520, x:12, icon:'👩‍🎓🍗', action:'snack', text:'Ayam geprek emang teman setia. Tugas berat, sambalnya jangan ikut ringan.' },
  { y:8020, x:88, icon:'🧑‍🎓🎸', action:'chat', text:'Latihan bentar. Besok balik lagi jadi pejuang deadline.' },
  { y:8380, x:9, icon:'👩‍🎓📚', action:'read', text:'Perpustakaan adem. Cocok buat belajar... atau ketiduran elegan.' },
  { y:8740, x:90, icon:'🧑‍🎓🧑‍🎓', action:'chat group', text:'Kalau ketemu buku referensi bagus, rasanya kayak jodoh ilmiah.' },
  { y:9100, x:11, icon:'👩‍🎓💡', action:'read', text:'Kadang ide skripsi datang justru saat niatnya cuma numpang dingin.' },
  { y:9460, x:89, icon:'🧑‍🎓☕', action:'snack', text:'Bukan kopi, ini bahan bakar semangat.' },
  { y:9820, x:8, icon:'👩‍🎓🧪', action:'chat', text:'Praktikum: tempat teori diuji dan kesabaran diasah.' },
  { y:10180, x:92, icon:'🧑‍🎓📱', action:'phone', text:'Deadline jam 23:59. Panik dimulai 23:47.' },
  { y:10540, x:10, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Besok presentasi? Malam ini baru cari template.' },
  { y:10900, x:90, icon:'🧑‍🎓💻', action:'read', text:'Laptop bunyi kipasnya lebih semangat dari pemiliknya.' },
  { y:11260, x:12, icon:'👩‍🎓📊', action:'chat', text:'Data sudah ada. Tinggal dipahami. Bagian itulah tantangannya.' },
  { y:11620, x:88, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Tugas kelompok selesai? Yang aktif tetap orang itu-itu juga.' },
  { y:11980, x:9, icon:'👩‍🎓📒', action:'read', text:'Pinjam catatan teman adalah wujud cinta paling akademik.' },
  { y:12340, x:91, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Semester tua: ketawa tipis, beban tebal.' },
  { y:12700, x:8, icon:'👩‍🎓🧋', action:'snack', text:'Sedikit manis, biar revisi tidak pahit-pahit amat.' },
  { y:13060, x:90, icon:'🧑‍🎓📚', action:'read', text:'Mulai dari bab satu, berakhir ke overthinking bab lima.' },
  { y:13420, x:10, icon:'👩‍🎓👩‍🎓', action:'gossip group', text:'Bimbingan hari ini semoga bukan “coba diperbaiki lagi ya”.' },
  { y:13780, x:91, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Kalau dosen bilang “sedikit revisi”, artinya siap lembur.' },
  { y:14140, x:9, icon:'👩‍🎓💻', action:'read', text:'Data sudah sinkron. Jiwa yang belum.' },
  { y:14500, x:88, icon:'🧑‍🎓📑', action:'chat', text:'Gedung skripsi kelihatan megah. Jantung ikut berdebar.' },
  { y:14860, x:9, icon:'👩‍🎓🧠', action:'chat', text:'Tenang. Kamu sudah sejauh ini. Tinggal satu pintu lagi.' },
  { y:15220, x:91, icon:'🧑‍🎓👩‍🎓', action:'chat group', text:'Print tiga rangkap, tanda tangan lengkap, napas juga dijaga.' },
  { y:15540, x:10, icon:'👩‍🎓📱', action:'phone', text:'Penguji sudah datang. Aura kampus mendadak tegang.' },
  { y:16220, x:9, icon:'👩‍🎓🎉', action:'chat group', text:'ACC?! SELAMAT! Hari ini kampus ikut bahagia.' },
  { y:16500, x:91, icon:'🧑‍🎓👩‍🎓', action:'gossip group', text:'Akhirnya selesai juga. Semua begadang terasa lunas.' },
  { y:16800, x:10, icon:'👩‍🎓📸', action:'chat', text:'Nanti foto toga bareng. Biar kenangan kampus pulang ikut tersimpan.' },
  { y:17060, x:90, icon:'🧑‍🎓🎓', action:'chat', text:'Toganya cocok. Gelarnya juga pantas banget.' },
  { y:17320, x:8, icon:'👩‍🎓👩‍🎓', action:'chat group', text:'Panggung sudah siap. Sekarang giliranmu bersinar.' },
  { y:17560, x:92, icon:'🧑‍🎓🎉', action:'chat group', text:'Ayo, kita sorakin wisudawatinya!' },
  { y:17760, x:11, icon:'👩‍🎓📸', action:'phone', text:'Senyum! Satu, dua, tiga—ini momen yang layak dikenang.' }
 ];
for (let i=0;i<NPC_MOMENTS.length;i++) {
  if (LOW_POWER && i%3===2) continue;
  const n=NPC_MOMENTS[i];
  LANDMARKS.push({ y:P(n.y), side:n.x<50?'left':'right', type:`npc ${n.action}`, icon:n.icon, label:'', x:n.x, npc:true, ambient:n.text });
}

const MONSTERS = {
  // speed = mengikuti posisi timeline; sideSpeed = bergerak dari pinggir ke tengah (% lebar layar/detik)
  revision: { name:'Tugas Baru', mark:'📝', hp:2, speed:20, sideSpeed:6.4, damage:10, xp:22, points:100, minSem:1 },
  deadline: { name:'Deadline Mepet', mark:'⏰', hp:1, speed:31, sideSpeed:10.2, damage:13, xp:30, points:145, minSem:2 },
  assignment: { name:'Tumpukan Tugas', mark:'📚', hp:4, speed:14, sideSpeed:4.6, damage:16, xp:45, points:210, minSem:3 },
  sleepy: { name:'Rasa Ngantuk', mark:'💤', hp:2, speed:18, sideSpeed:5.5, damage:9, xp:36, points:165, minSem:4 },
  stress: { name:'Rasa Penat', mark:'🌩️', hp:3, speed:17, sideSpeed:5.1, damage:8, xp:42, points:190, minSem:5 },
  error: { name:'Error Mendadak', mark:'⚠️', hp:3, speed:23, sideSpeed:8.1, damage:12, xp:50, points:235, minSem:6 },
  thesis: { name:'Bayangan Tesis', mark:'📖', hp:6, speed:15, sideSpeed:4.1, damage:18, xp:80, points:390, minSem:7 }
};

const REWARDS = [
  { id:'snack-batagor', effect:'snack', icon:'🥟', label:'Batagor Juara', weight:9 },
  { id:'snack-gorengan', effect:'snack', icon:'🍤', label:'Gorengan Hangat', weight:9 },
  { id:'snack-donat', effect:'snack', icon:'🍩', label:'Donat Creamy', weight:8 },
  { id:'snack-roti', effect:'snack', icon:'🍞', label:'Roti Penyelamat', weight:6 },
  { id:'snack-baso', effect:'snack', icon:'🍜', label:'Semangkuk Bakso', weight:6 },
  { id:'mood-boba', effect:'mood', icon:'🧋', label:'Boba Penyegar', weight:12 },
  { id:'mood-choco', effect:'mood', icon:'🍫', label:'Coklat Penenang', weight:8 },
  { id:'mood-playlist', effect:'mood', icon:'🎧', label:'Playlist Kesukaan', weight:8 },
  { id:'note-catatan', effect:'note', icon:'📒', label:'Jurnal Tepat', weight:16 },
  { id:'note-fotokopi', effect:'note', icon:'📄', label:'Buku Materi', weight:8 },
  { id:'inspiration-lamp', effect:'inspiration', icon:'💡', label:'Nilai A', weight:6 },
  { id:'inspiration-meme', effect:'inspiration', icon:'😂', label:'Meme Lucu', weight:4 }
 ];


const SPRITES = {
  players: {
    default: 'assets/generated/player_default.png',
    campus: 'assets/generated/player_campus_yellow.png',
    campusRun: 'assets/generated/player_campus_yellow_run.png',
    walkLeft: 'assets/generated/player_walk_left.png',
    walkRight: 'assets/generated/player_walk_right.png',
    work: 'assets/generated/player_work.png',
    campusHurt: 'assets/generated/player_campus_yellow_hurt.png',
    run: 'assets/generated/player_run.png',
    hurt: 'assets/generated/player_hurt.png',
    celebrate: 'assets/generated/player_celebrate.png',
    toga: 'assets/generated/player_toga.png',
    togaByFaculty: {
      economics: 'assets/generated/player_toga_economics.png',
      education: 'assets/generated/player_toga_education.png',
      agriculture: 'assets/generated/player_toga_agriculture.png',
      socialPolitics: 'assets/generated/player_toga_socialPolitics.png',
      engineering: 'assets/generated/player_toga_engineering.png'
    },
    faculties: {
      economics: 'assets/generated/faculty_economics.png',
      education: 'assets/generated/faculty_education.png',
      agriculture: 'assets/generated/faculty_agriculture.png',
      socialPolitics: 'assets/generated/faculty_socialPolitics.png',
      engineering: 'assets/generated/faculty_engineering.png'
    }
  },
  tools: {
    economics: 'assets/generated/tool_market_trend.svg',
    education: 'assets/generated/tool_book_pointer.png',
    agriculture: 'assets/generated/tool_bio_seed.svg',
    socialPolitics: 'assets/generated/tool_megaphone.png',
    engineering: 'assets/generated/tool_laptop.svg'
  },
  npcs: [
    'assets/generated/npc_student_friend.png',
    'assets/generated/npc_advisor.png',
    'assets/generated/npc_satpam.png',
    'assets/generated/npc_admin.png',
    'assets/generated/npc_examiner1.png'
  ],
  monsters: {
    revision: 'assets/generated/monster_revision.png',
    deadline: 'assets/generated/monster_deadline.png',
    assignment: 'assets/generated/monster_assignment.png',
    sleepy: 'assets/generated/monster_sleepy.png',
    stress: 'assets/generated/monster_stress.png',
    error: 'assets/generated/monster_error.png',
    thesis: 'assets/generated/monster_thesis.png'
  },
  rewards: {
    'mood-boba': 'assets/generated/loot_boba.png',
    'mood-choco': 'assets/generated/loot_coffee.png',
    'mood-playlist': 'assets/generated/loot_playlist.png',
    'snack-batagor': 'assets/generated/loot_snack_batagor.png',
    'snack-gorengan': 'assets/generated/loot_snack_gorengan.png',
    'snack-donat': 'assets/generated/loot_snack_donat.png',
    'snack-roti': 'assets/generated/loot_snack_roti.png',
    'snack-baso': 'assets/generated/loot_snack_baso.png',
    'note-catatan': 'assets/generated/loot_journal.png',
    'note-fotokopi': 'assets/generated/loot_book.png',
    'inspiration-lamp': 'assets/generated/loot_gradeA.png',
    'inspiration-meme': 'assets/generated/loot_revision.png'
  },
  props: {
    tree: 'assets/generated/decor_tree.png',
    gardenTree: 'assets/generated/decor_garden_tree.png',
    gardenBed: 'assets/generated/decor_garden_bed.png',
    bench: 'assets/generated/decor_bench.png',
    lamp: 'assets/generated/decor_lamp.png',
    gate: 'assets/generated/prop_gate.png',
    parking: 'assets/generated/prop_parking.png',
    field: 'assets/generated/prop_field.png',
    monument: 'assets/generated/prop_monument.png',
    faculty: 'assets/generated/prop_faculty_building.png',
    library: 'assets/generated/prop_corridor.png',
    garden: 'assets/generated/prop_garden.png',
    classroom: 'assets/generated/prop_classroom.png',
    courtroom: 'assets/generated/prop_courtroom.png',
    wisuda: 'assets/generated/prop_wisuda.png',
    kantin: 'assets/generated/prop_kantin.png',
    lab: 'assets/generated/prop_lab_komputer.png',
    room: 'assets/generated/prop_room_dosen.png',
    greenhouse: 'assets/generated/prop_greenhouse.png'
  },
  portraits: {
    player: 'assets/generated/portrait_player_normal.png',
    happy: 'assets/generated/portrait_player_happy.png',
    think: 'assets/generated/portrait_player_think.png',
    advisor: 'assets/generated/portrait_advisor.png',
    examiner: 'assets/generated/portrait_examiner_male.png'
  },
  ui: {
    tutorialMove: 'assets/generated/tutorial_move.png',
    tutorialAttack: 'assets/generated/tutorial_attack.png',
    tutorialGoal: 'assets/generated/tutorial_goal.png',
    menuHero: 'assets/generated/menu_hero.png',
    bossLeft: 'assets/generated/boss_examiner_left.png',
    bossCenter: 'assets/generated/boss_examiner_center.png',
    bossRight: 'assets/generated/boss_examiner_right.png'
  },
  backgrounds: {
    campus: 'assets/backgrounds/campus_far.webp',
    day: 'assets/backgrounds/campus_day.webp',
    building: 'assets/backgrounds/campus_building.webp',
    corridor: 'assets/backgrounds/corridor.webp',
    facultyInterior: 'assets/backgrounds/interior_corridor_pixel.webp',
    libraryInterior: 'assets/backgrounds/Perpustakaan.jpg',
    canteenInterior: 'assets/backgrounds/interior_kantin.jpg',
    thesisInterior: 'assets/backgrounds/ruangsidang.jpg',
    graduation: 'assets/backgrounds/wisuda.jpg'
  }
};

/* ---- v1.8.1: boot loader (real images, bounded startup, no fake timer) ---- */
const BOOT_MIN_MS=2300; // Membiarkan splash terasa seperti opening, bahkan saat aset sudah cache.
const BOOT_MAX_MS=11000; // Gagal memuat tidak boleh membuat layar macet selamanya.
const BOOT_IMAGE_TIMEOUT_MS=5200;
const bootImageCache=new Map();
function bootAssetUrls(){
  // Aset menu, VN awal, world utama, NPC, landmark, dan tampilan ruangan.
  // Tidak memuat semua ending & hadiah ke memori sejak awal.
  return [...new Set([
    GAME_CONFIG.university.logo,
    'assets/backgrounds/menu_gate.webp',
    SPRITES.ui.menuHero,SPRITES.backgrounds.campus,SPRITES.backgrounds.day,
    SPRITES.backgrounds.facultyInterior,SPRITES.backgrounds.libraryInterior,
    SPRITES.backgrounds.canteenInterior,SPRITES.backgrounds.thesisInterior,
    SPRITES.players.default,SPRITES.players.campus,SPRITES.players.walkLeft,
    SPRITES.players.walkRight,SPRITES.players.work,SPRITES.players.campusHurt,
    SPRITES.portraits.player,SPRITES.portraits.happy,SPRITES.portraits.think,
    SPRITES.portraits.advisor,SPRITES.portraits.examiner,
    ...Object.values(SPRITES.npcs),
    ...Object.values(SPRITES.props),
    ...Object.values(SPRITES.tools),
    SPRITES.ui.tutorialGoal
  ])].filter(Boolean);
}
function bootLoadImage(src){
  if(bootImageCache.has(src))return bootImageCache.get(src).promise;
  const img=new Image();
  let timeout;
  const promise=new Promise(resolve=>{
    let finished=false;
    const done=(ok)=>{if(finished)return;finished=true;clearTimeout(timeout);img.onload=null;img.onerror=null;resolve(ok)};
    timeout=setTimeout(()=>done(false),BOOT_IMAGE_TIMEOUT_MS);
    img.onload=async()=>{
      // Sebagian browser perlu decode sebelum sprite yang tadinya belum terlihat dirender.
      try { if(typeof img.decode==='function')await Promise.race([img.decode(),sleep(850)]); }catch(_e){}
      done(true);
    };
    img.onerror=()=>done(false);
    img.src=src;
    if(img.complete && img.naturalWidth>0)done(true);
  });
  bootImageCache.set(src,{image:img,promise});
  return promise;
}
async function runBootLoader(){
  const boot=$('#boot-loading');
  if(!boot)return;
  const status=$('#boot-status'),percent=$('#boot-percent'),bar=$('#boot-progress'),fill=$('#boot-progress-fill'),detail=$('#boot-detail');
  const urls=bootAssetUrls();
  const start=performance.now();
  let cursor=0,complete=0,failures=0;
  const progress=()=>{
    const p=Math.round(complete/Math.max(1,urls.length)*100);
    fill.style.width=`${p}%`;percent.textContent=`${p}%`;bar.setAttribute('aria-valuenow',String(p));
    status.textContent=p>=100?'Merampungkan persiapan...':p>=65?'Menyusun dunia kampus...':p>=25?'Menyiapkan karakter & ruangan...':'Memuat aset utama...';
  };
  const worker=async()=>{
    while(cursor<urls.length){
      const i=cursor++;
      try { if(!(await bootLoadImage(urls[i])))failures++; }catch(_e){failures++;}
      complete++;progress();
    }
  };
  progress();
  await Promise.race([Promise.all(Array.from({length:Math.min(5,urls.length)},worker)),sleep(BOOT_MAX_MS)]);
  const waited=performance.now()-start;
  if(waited<BOOT_MIN_MS)await sleep(BOOT_MIN_MS-waited);
  if(complete<urls.length||failures){
    detail.textContent='Beberapa aset akan menyusul. Petualangan tetap bisa dimulai.';
  }else{detail.textContent='Semua siap. Selamat datang di Universitas Siliwangi!';}
  status.textContent='Perjalanan siap dimulai';
  // Render dua frame dulu agar menu terlihat utuh sebelum splash ditutup.
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  boot.classList.add('is-dismissing');
  await sleep(680);
  boot.classList.add('hidden');
  boot.setAttribute('aria-hidden','true');
  // Pertahankan referensi sprite agar tidak didecode ulang di awal perjalanan.
  // Aset akhir yang lebih besar masih dimuat saat dibutuhkan.
}

/* v1.8.3: assets yang benar-benar digunakan game. Yang paling dekat dengan pemain
   diprioritaskan agar tidak menyebabkan decode besar saat tombol gerak pertama. */
function actionAssetUrls(){
  return [...new Set([
    SPRITES.backgrounds.campus,
    SPRITES.players.campus, SPRITES.players.walkLeft, SPRITES.players.walkRight,
    SPRITES.players.work, SPRITES.players.campusHurt,
    SPRITES.props.gate, SPRITES.props.gardenTree, SPRITES.props.gardenBed,
    SPRITES.props.faculty, SPRITES.props.kantin,
    ...SPRITES.npcs,
    ...Object.values(SPRITES.monsters),
    ...Object.values(SPRITES.rewards),
    ...Object.values(SPRITES.props),
    ...Object.values(SPRITES.tools),
    SPRITES.backgrounds.facultyInterior, SPRITES.backgrounds.canteenInterior,
    SPRITES.backgrounds.libraryInterior, SPRITES.backgrounds.thesisInterior
  ].filter(Boolean))];
}
const ACTION_CRITICAL_ASSETS = [
  SPRITES.backgrounds.campus,
  SPRITES.players.campus, SPRITES.players.walkLeft, SPRITES.players.walkRight,
  SPRITES.props.gate, SPRITES.props.gardenTree, SPRITES.props.gardenBed,
  ...SPRITES.npcs
].filter(Boolean);
async function runActionLoader(){
  const overlay=els.actionLoading;
  if(!overlay){renderWorld(true);return;}
  const label=els.actionLoadingText;
  overlay.classList.remove('hidden','is-dismissing');
  overlay.setAttribute('aria-hidden','false');
  if(label)label.textContent='Memuat karakter dan lingkungan kampus...';
  const begin=performance.now();
  // Dua frame memastikan overlay benar-benar sempat terlihat sebelum decode.
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const urls=actionAssetUrls();
  let index=0, done=0;
  const critical=Promise.all(ACTION_CRITICAL_ASSETS.map(url=>bootLoadImage(url)));
  const loadWorker=async()=>{
    while(index<urls.length){
      const src=urls[index++];
      await bootLoadImage(src).catch(()=>false);
      done++;
      if(label && done%5===0){
        const percent=Math.round(100*done/urls.length);
        label.textContent=percent<75 ? `Menyiapkan aset permainan... ${percent}%` : 'Merender dunia kampus...';
      }
    }
  };
  try {
    // Batasi paralel decode agar ponsel tidak tersendat ketika layar loading aktif.
    await Promise.race([
      Promise.all(Array.from({length:4},loadWorker)),
      sleep(6500)
    ]);
    // Terutama gate / NPC awal harus siap, jangan muncul baru setelah tombol ▼.
    await Promise.race([critical,sleep(1200)]);
    if(label) label.textContent='Memastikan semua objek terlihat sejak awal...';
    state.lastWorldRenderY=-Infinity;
    state.nextPropRenderTs=0;
    renderWorld(true);
    updateHUD(true);
    const time=performance.now()-begin;
    if(time<1700)await sleep(1700-time);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  } finally {
    overlay.classList.add('is-dismissing');
    await sleep(320);
    overlay.classList.add('hidden');
    overlay.classList.remove('is-dismissing');
    overlay.setAttribute('aria-hidden','true');
  }
}

function spriteImg(src, alt='', cls='sprite-img'){ return src ? `<img src="${src}" alt="${alt}" class="${cls}">` : alt; }
function facultyPlayerSprite(id=state.facultyId){ return SPRITES.players.faculties[id] || SPRITES.players.default; }
function activePlayerSprite(){ return state.campusEntered ? SPRITES.players.campus : SPRITES.players.default; }
function facultyTogaSprite(id=state.facultyId){ return SPRITES.players.togaByFaculty?.[id] || SPRITES.players.toga; }
function facultyToolSprite(id=state.facultyId){ return SPRITES.tools[id] || SPRITES.tools.engineering; }
function rewardSprite(item){ return SPRITES.rewards[item.id] || ''; }
function propSpriteFor(landmark,index=0){
  if(landmark.npc) return SPRITES.npcs[index % SPRITES.npcs.length];
  if(landmark.decorKind==='garden-tree') return SPRITES.props.gardenTree;
  if(landmark.decorKind==='garden-bed') return SPRITES.props.gardenBed;
  const label=(landmark.label||'').toLowerCase();
  const type=String(landmark.type||'');
  if(type.includes('tree')) return SPRITES.props.tree;
  if(landmark.gate || type.includes('gate-entry') || label.includes('gapura')) return SPRITES.props.gate;
  if(label.includes('parkir')) return SPRITES.props.parking;
  if(label.includes('lapangan')) return SPRITES.props.field;
  if(label.includes('monumen')) return SPRITES.props.monument;
  if(label.includes('jajanan') || label.includes('kantin')) return SPRITES.props.kantin;
  if(label.includes('taman')) return SPRITES.props.garden;
  if(label.includes('gedung fakultas')) return SPRITES.props.faculty;
  if(label.includes('perpustakaan')) return SPRITES.props.library;
  if(label.includes('ukm') || label.includes('organisasi')) return SPRITES.props.room;
  if(label.includes('praktikum')) return SPRITES.props.lab;
  if(label.includes('penelitian')) return SPRITES.props.classroom;
  if(label.includes('skripsi') || label.includes('sidang')) return SPRITES.props.courtroom;
  if(label.includes('wisuda') || label.includes('panggung')) return SPRITES.props.wisuda;
  return landmark.entry ? SPRITES.props.faculty : '';
}
function applySpriteToElement(el,src,alt='',cls='ui-sprite'){ if(!el) return; el.dataset.sprite=src||''; el.innerHTML = src ? `<img src="${src}" alt="${alt}" class="${cls}">` : alt; }
function updatePlayerSprite(mode='field'){
  const char=els.player?.querySelector('.pixel-character');
  if(!char) return;
  let src=activePlayerSprite();
  if(mode==='run') src=state.campusEntered ? (state.walkFrame%2===0?SPRITES.players.walkLeft:SPRITES.players.walkRight) : SPRITES.players.default;
  else if(mode==='work') src=state.campusEntered ? SPRITES.players.work : SPRITES.players.default;
  else if(mode==='hurt') src=state.campusEntered ? SPRITES.players.campusHurt : SPRITES.players.default;
  else if(mode==='celebrate'||mode==='toga') src=facultyTogaSprite();
  char.style.backgroundImage = `url("${src}")`;
  char.dataset.spriteMode = mode;
}
function startWalkFrames(){
  if(state.walkTimer) return;
  state.walkFrame=0;updatePlayerSprite('run');
  state.walkTimer=setInterval(()=>{if(state.moveDir===0){stopWalkFrames();return}state.walkFrame=(state.walkFrame+1)%2;updatePlayerSprite('run')},165);
}
function stopWalkFrames(){if(state.walkTimer){clearInterval(state.walkTimer);state.walkTimer=null}state.walkFrame=0;}

function updateNovelPortrait(kind='player',expression='normal'){
  const src = kind==='advisor' ? SPRITES.portraits.advisor : kind==='examiner' ? SPRITES.portraits.examiner : (['happy','excited','smile','approve'].includes(expression) ? SPRITES.portraits.happy : ['thinking','think','serious'].includes(expression) ? SPRITES.portraits.think : SPRITES.portraits.player);
  els.portrait.style.backgroundImage = `url("${src}")`;
}


function setupStaticSpriteScreens(){
  const menuHero=document.getElementById('menu-hero-img');
  if(menuHero) menuHero.src = SPRITES.ui.menuHero;
  if(Array.isArray(els.examiners)){
    const bossSprites=[SPRITES.ui.bossLeft,SPRITES.ui.bossCenter,SPRITES.ui.bossRight];
    els.examiners.forEach((el,i)=>{el.classList.add('sprite-examiner');el.style.backgroundImage=`url("${bossSprites[i % bossSprites.length]}")`;});
  }
  const gradChar=document.querySelector('.graduate-character');
  if(gradChar){gradChar.classList.add('sprite-grad');gradChar.style.backgroundImage=`url("${facultyTogaSprite()}")`;}
}
function interiorBackgroundFor(zoneId=''){
  if(zoneId==='faculty-interior') return SPRITES.backgrounds.facultyInterior;
  if(zoneId==='library') return SPRITES.backgrounds.libraryInterior;
  if(zoneId==='canteen-interior') return SPRITES.backgrounds.canteenInterior;
  if(zoneId==='thesis-interior') return SPRITES.backgrounds.thesisInterior;
  return '';
}
function applyInteriorBackground(zone){
  if(!els.interior) return;
  const src=zone?.interior ? interiorBackgroundFor(zone.id) : '';
  els.interior.style.backgroundImage = src ? `url("${src}")` : '';
  els.interior.dataset.zone = zone?.id || '';
}
function tutorialIconFor(page){
  const title=(page?.title||'').toLowerCase();
  if(title.includes('bergerak')) return SPRITES.ui.tutorialMove;
  if(title.includes('serang') || title.includes('special')) return SPRITES.ui.tutorialAttack;
  return SPRITES.ui.tutorialGoal;
}

const state = {
  facultyId: GAME_CONFIG.player.faculty, majorId: GAME_CONFIG.player.major, scene:'menu', semester:1, mental:100, references:0, score:0, xp:0, level:1, kills:0, tasksCompleted:0, engagedSemesters:new Set(), antiCheatResetting:false, campusEntered:false, nextWaveAt:0, waveInProgress:false, walkFrame:0, walkTimer:null,
  worldY:0, checkpointY:0, moveDir:0, running:false, paused:false, bossCleared:false, postBoss:false, finishing:false,
  attackEnergy:GAME_CONFIG.gameplay.attackEnergyStart, entities:new Set(), worldPropEls:[], visibleWorldProps:[], spawnTimer:null, lastFrame:0,
  skillReady:true, cooldownTimer:null, shield:false, slowed:false, shieldTimeout:null, slowTimeout:null, zoneId:'outside-start', zoneTransitioning:false,
  semesterSnapshot:null, lastMilestoneSemester:1,
  dialogHistory:[], novelAuto:false, novelSkip:false, examActive:false, typingToken:0, typing:false, typingFullText:'', dialogAdvanceResolver:null, dialogAdvanceTimer:null,
  bossHP:GAME_CONFIG.boss.maxHP, bossQuestionIndex:0, settings:{music:true,sfx:true,haptic:true}, celebrationRAF:null, facultyPickerIndex:0, majorPickerIndex:0, memorySlideIndex:0, blessingFast:false, tutorialPageIndex:0, tutorialSeen:false,
  viewportW:390, viewportH:844, anchorY:422, lastWorldRenderY:-99999, nextHudTs:0, nextPropRenderTs:0, lastTickTs:0, worldVisualMode:'day'
};

function faculty(){ return FACULTIES[state.facultyId] || FACULTIES.economics || Object.values(FACULTIES)[0]; }
function major(){ const list=faculty().majors||[]; return list.find(m=>m.id===state.majorId) || list[0] || {id:'',name:'Jurusan',level:'',degree:''}; }
function playerNickname(){ return GAME_CONFIG.player.nickname || GAME_CONFIG.player.firstName || GAME_CONFIG.player.fullName?.split(/\s+/)[0] || 'Graduate'; }
function degreeForMajor(){ return major().degree || GAME_CONFIG.player.degree || ''; }
function degreeForFaculty(){ return degreeForMajor(); }
function graduateDisplayName(){ const degree=degreeForMajor(); return degree ? `${GAME_CONFIG.player.fullName}, ${degree}` : GAME_CONFIG.player.fullName; }
function facultyGraduationWish(id=state.facultyId){ return GAME_CONFIG.graduation.facultyMessages?.[id] || ''; }
function currentSpecial(){ return (faculty().specialAttacks||GLOBAL_SEMESTER_SKILLS)[Math.max(0, Math.min(7, state.semester-1))]; }
function resolveText(text=''){ return String(text).replaceAll('{{playerName}}',playerNickname()).replaceAll('{{nickname}}',playerNickname()).replaceAll('{{fullName}}',GAME_CONFIG.player.fullName).replaceAll('{{graduateName}}',graduateDisplayName()).replaceAll('{{degree}}',degreeForMajor()).replaceAll('{{facultyWish}}',facultyGraduationWish()).replaceAll('{{university}}',GAME_CONFIG.university.name).replaceAll('{{faculty}}',faculty().name).replaceAll('{{facultyShort}}',faculty().shortName).replaceAll('{{major}}',major().name).replaceAll('{{level}}',major().level).replaceAll('{{tool}}',faculty().tool); }
function show(...nodes){ nodes.forEach(n=>n?.classList.remove('hidden')); }
function hide(...nodes){ nodes.forEach(n=>n?.classList.add('hidden')); }
function setScene(s){ state.scene=s; }

function applyTheme(){
  document.documentElement.style.setProperty('--faculty',faculty().color);
  applySpriteToElement(els.toolIcon, facultyToolSprite(), faculty().tool, 'btn-sprite');
  applySpriteToElement(els.attackIcon, facultyToolSprite(), faculty().tool, 'btn-sprite');
  applySpriteToElement(els.heldTool, facultyToolSprite(), faculty().tool, 'tool-sprite');
  els.attackToolName.textContent=faculty().tool; els.skillName.textContent=currentSpecial()?.name||faculty().skill;
  updatePlayerSprite('field');
}
function setupLogo(img,fallback){ img.onload=()=>{hide(fallback);show(img)};img.onerror=()=>{hide(img);show(fallback);fallback.textContent=GAME_CONFIG.university.shortName.slice(0,1)};img.src=GAME_CONFIG.university.logo; }
function applyConfig(){
  document.title=`${GAME_CONFIG.game.title} — ${GAME_CONFIG.player.fullName}`; if(els.aboutTitle)els.aboutTitle.textContent=GAME_CONFIG.about?.title||GAME_CONFIG.game.title; if(els.aboutDescription)els.aboutDescription.textContent=GAME_CONFIG.about?.description||''; if(els.aboutCreator)els.aboutCreator.textContent=GAME_CONFIG.about?.creator||'Nama Pembuat'; els.universityName.textContent=GAME_CONFIG.university.name; els.gateText.textContent=GAME_CONFIG.university.gateText; els.monumentTitle.textContent=GAME_CONFIG.university.monumentTitle; els.monumentText.textContent=GAME_CONFIG.university.monumentText; els.buildingLabel.textContent=GAME_CONFIG.university.shortName; els.menuPlayer.textContent=playerNickname(); els.gradUniversityName.textContent=GAME_CONFIG.university.name; if(els.cheerLabel)els.cheerLabel.textContent=`Semangat ya, ${playerNickname()}!`; setupLogo(els.logo,els.logoFallback); setupLogo(els.gradLogoImg,els.gradLogo); applyTheme(); updateHUD();
}
async function fadeTo(fn,ms=280){ els.fade.classList.add('active'); await sleep(ms); await fn?.(); await sleep(60); els.fade.classList.remove('active'); await sleep(ms); }
async function flash(){ els.flash.classList.add('active');await sleep(130);els.flash.classList.remove('active'); }

function saveSettings(){ try{localStorage.setItem('sj-settings',JSON.stringify(state.settings))}catch{} setAudioSettings({music:state.settings.music,sfx:state.settings.sfx}); GAME_CONFIG.haptic.enabled=state.settings.haptic; }
function loadSettings(){ try{Object.assign(state.settings,JSON.parse(localStorage.getItem('sj-settings')||'{}'))}catch{} els.musicToggle.checked=state.settings.music;els.sfxToggle.checked=state.settings.sfx;els.hapticToggle.checked=state.settings.haptic;saveSettings(); }

/* ---------- Visual novel ---------- */
function setPortrait(kind='player',expression='normal'){ els.portrait.className='portrait';els.portrait.removeAttribute('data-expression'); if(kind==='none'){els.portrait.classList.add('hidden-portrait');return} els.portrait.classList.add(kind==='advisor'?'advisor-portrait':kind==='examiner'?'examiner-portrait':'player-portrait');els.portrait.dataset.expression=expression||'normal'; updateNovelPortrait(kind,expression||'normal'); }
function completeTyping(){ if(!state.typing)return false;state.typingToken++;state.typing=false;els.dialogText.textContent=state.typingFullText;return true; }
async function typeText(text,instant=false){ const token=++state.typingToken;state.typingFullText=text;state.typing=!instant;els.dialogText.textContent='';if(instant){els.dialogText.textContent=text;state.typing=false;return} for(let i=0;i<text.length;i++){if(token!==state.typingToken)return;els.dialogText.textContent+=text[i];if(i%5===0&&state.settings.sfx)sfx('click');await sleep(state.novelSkip?1:17)}state.typing=false; }
function addHistory(speaker,text){state.dialogHistory.push({speaker,text});if(state.dialogHistory.length>80)state.dialogHistory.shift()}
function finishDialogAdvance(){if(!state.dialogAdvanceResolver)return false;const r=state.dialogAdvanceResolver;state.dialogAdvanceResolver=null;if(state.dialogAdvanceTimer)clearTimeout(state.dialogAdvanceTimer);state.dialogAdvanceTimer=null;r();return true}
function advanceNovel(){if(state.scene!=='novel'||!els.logModal.classList.contains('hidden')||!els.settingsModal.classList.contains('hidden'))return;if(completeTyping())return;finishDialogAdvance()}
function waitForDialogAdvance(){return new Promise(resolve=>{state.dialogAdvanceResolver=resolve;if(state.novelAuto){const base=state.examActive?1500:950,perChar=state.examActive?20:12;state.dialogAdvanceTimer=setTimeout(finishDialogAdvance,base+els.dialogText.textContent.length*perChar)}if(state.novelSkip)state.dialogAdvanceTimer=setTimeout(finishDialogAdvance,state.examActive?180:80)})}
async function runStory(lines,after){
  const wasRunner=state.running; if(wasRunner) state.paused=true; setScene('novel');show(els.novel);els.bg.style.filter='brightness(.72)';
  for(const line of lines){const speaker=resolveText(line.speaker),text=resolveText(line.text);els.speaker.textContent=speaker;setPortrait(line.portrait,line.expression);await typeText(text,state.novelSkip);addHistory(speaker,text);await waitForDialogAdvance()}
  finishDialogAdvance();hide(els.novel);els.bg.style.filter=''; if(wasRunner){state.paused=false;setScene('runner')} await after?.();
}

/* ---------- Faculty + major picker ---------- */
const FACULTY_ORDER=Object.values(FACULTIES);
function isFacultyLocked(id){const a=GAME_CONFIG.selection?.allowedFaculties;return Array.isArray(a)&&a.length>0&&!a.includes(id)}
function isMajorLocked(m,fid=state.facultyId){const a=GAME_CONFIG.selection?.allowedMajors;return isFacultyLocked(fid)||(Array.isArray(a)&&a.length>0&&!a.includes(m.id))}
function firstOpenMajorIndex(majors,fid){const i=majors.findIndex(m=>!isMajorLocked(m,fid));return i>=0?i:0}
function renderFacultyPicker(){
  const count=FACULTY_ORDER.length;
  state.facultyPickerIndex=(state.facultyPickerIndex+count)%count;
  const f=FACULTY_ORDER[state.facultyPickerIndex];
  els.facultyPreview.style.setProperty('--preview-color',f.color);
  applySpriteToElement(els.facultyPreviewIcon, facultyToolSprite(f.id), f.tool, 'faculty-sprite gear-preview-sprite');
  els.facultyPreviewSwatch.style.background=f.color;
  els.facultyPreviewName.textContent=f.name;
  els.facultyPreviewTool.textContent=`Academic Gear: ${f.tool}`;
  const locked=isFacultyLocked(f.id);
  els.facultyPreview.classList.toggle('is-locked',locked);
  els.facultyPreviewSkill.textContent=locked?'🔒 Belum tersedia · segera hadir':`${f.majors.length} jurusan · skill semester global`;
  els.facultyPreviewDescription.textContent=locked?'Fakultas ini masih terkunci. Untuk hadiah ini, silakan pilih Fakultas Ekonomi dan Bisnis.':f.skillDescription;
  els.facultyConfirm.disabled=locked;
  els.facultyConfirm.textContent=locked?'🔒 TERKUNCI':'LANJUT PILIH JURUSAN';
  els.facultyDots.innerHTML=FACULTY_ORDER.map((x,i)=>`<i class="${i===state.facultyPickerIndex?'active':''} ${isFacultyLocked(x.id)?'locked':''}"></i>`).join('');
}
function changeFacultyPreview(d){sfx('click');vibrate('button');state.facultyPickerIndex+=d;renderFacultyPicker()}
function renderMajorPicker(){
  const f=faculty();
  const majors=f.majors||[];
  state.majorPickerIndex=clamp(state.majorPickerIndex,0,Math.max(0,majors.length-1));
  if(majors[state.majorPickerIndex]&&isMajorLocked(majors[state.majorPickerIndex]))state.majorPickerIndex=firstOpenMajorIndex(majors,f.id);
  els.majorFacultyName.textContent=f.name;
  els.majorList.innerHTML=majors.map((m,i)=>{
    const locked=isMajorLocked(m);
    const note=locked?' · 🔒 SEGERA HADIR':(m.featured?' · PILIHAN HADIAH INI':'');
    return `<button class="major-option ${i===state.majorPickerIndex?'active':''} ${m.featured?'featured':''} ${locked?'locked':''}" data-major-index="${i}" type="button" ${locked?'disabled aria-disabled="true"':''}><span><strong>${m.name}</strong><small>${m.level}${note}</small></span><b>${locked?'🔒':(m.degree||'')}</b></button>`;
  }).join('');
  [...els.majorList.querySelectorAll('.major-option:not(.locked)')].forEach(btn=>btn.onclick=()=>{state.majorPickerIndex=Number(btn.dataset.majorIndex)||0;sfx('click');vibrate('button');renderMajorPicker()});
  if(els.majorConfirm)els.majorConfirm.disabled=!!(majors[state.majorPickerIndex]&&isMajorLocked(majors[state.majorPickerIndex]));
}
async function confirmFacultySelection(){
  const f=FACULTY_ORDER[state.facultyPickerIndex];
  if(isFacultyLocked(f.id)){sfx('wrong');return}
  state.facultyId=f.id;GAME_CONFIG.player.faculty=f.id;
  const wanted=f.majors.findIndex(m=>m.id===GAME_CONFIG.player.major&&!isMajorLocked(m,f.id));
  state.majorPickerIndex=wanted>=0?wanted:firstOpenMajorIndex(f.majors,f.id);
  applyTheme();hide(els.facultyScreen);show(els.majorScreen);setScene('major');renderMajorPicker();
}
function backToFacultySelection(){hide(els.majorScreen);show(els.facultyScreen);setScene('faculty');renderFacultyPicker()}
async function confirmMajorSelection(){
  const f=faculty(),m=f.majors[state.majorPickerIndex]||f.majors[0];
  if(isMajorLocked(m)){sfx('wrong');return}
  state.majorId=m.id;GAME_CONFIG.player.major=m.id;
  hide(els.majorScreen);applyTheme();
  await runStory(AFTER_FACULTY_STORY,startRunner);
}
async function showFacultySelection(){
  setScene('faculty');hide(els.novel,els.majorScreen);show(els.facultyScreen);
  const i=FACULTY_ORDER.findIndex(f=>f.id===state.facultyId);state.facultyPickerIndex=i>=0?i:0;renderFacultyPicker();
}

/* ---------- World rendering ---------- */
function spacedLandmarks(){
  // Centre-road buildings + side NPCs + lightweight garden props.
  const items=LANDMARKS
    .filter(p=>p.npc || p.side==='center' || p.exteriorDecor)
    .map(p=>({...p}))
    .sort((a,b)=>a.y-b.y);
  const centreProps=items.filter(p=>!p.npc && p.side==='center');
  const decorProps=items.filter(p=>p.exteriorDecor);
  const placedNpcs=[];
  for(const n of items.filter(p=>p.npc)){
    // Keep NPCs at the sides. Their bubbles remain vertically above them and never enter the road.
    n.x=n.side==='left'?17:n.side==='right'?83:(n.x||50);
    let guard=0;
    while(guard++<16){
      const clashBuilding=centreProps.find(p=>Math.abs(p.y-n.y)<P(360));
      const clashNpc=placedNpcs.find(p=>p.side===n.side && Math.abs(p.y-n.y)<P(390));
      const clashDecor=decorProps.find(p=>p.side===n.side && Math.abs(p.y-n.y)<P(185));
      if(!clashBuilding && !clashNpc && !clashDecor) break;
      n.y += P(210);
    }
    placedNpcs.push(n);
  }
  return items.sort((a,b)=>a.y-b.y);
}
function initWorldProps(){
  els.worldProps.innerHTML='';state.worldPropEls=[];state.visibleWorldProps=[];
  spacedLandmarks().forEach((p,i)=>{const sideClass=p.side?` side-${p.side}`:'';const el=document.createElement('div');el.className=`world-prop ${p.type}${sideClass}`;el.style.left=`${p.x}%`;el.style.top='0';el.style.visibility='hidden';const bubble=p.npc&&p.ambient?`<span class="npc-bubble">${p.ambient}</span>`:'';const sprite=propSpriteFor(p,i);const art=sprite ? spriteImg(sprite,p.label||p.type,p.npc?'prop-sprite npc-sprite':'prop-sprite') : p.icon;el.innerHTML=`<div class="prop-art ${sprite?'has-sprite':''}">${art}</div>${p.label?`<span class="prop-label">${p.label}</span>`:''}${bubble}`;els.worldProps.appendChild(el);state.worldPropEls.push({data:p,el,visible:false,near:false})});
  // World baru harus langsung diposisikan sebelum karakter mulai berjalan.
  state.lastWorldRenderY=-Infinity;
  state.nextPropRenderTs=0;
  renderWorld(true);
}

function cacheViewport(){
  state.viewportW = Math.max(300, els.root.clientWidth || window.innerWidth || 390);
  state.viewportH = Math.max(480, els.root.clientHeight || window.innerHeight || 844);
  // Keep the heroine visually centred so threats are readable both ahead and behind.
  state.anchorY = state.viewportH * .50;
}
function playerAnchorY(){return state.anchorY}
function renderWorld(force=false){
  const y=state.worldY;
  if(!force && Math.abs(y-state.lastWorldRenderY)<.35)return;
  state.lastWorldRenderY=y;
  const anchor=state.anchorY, h=state.viewportH;
  // v1.7.5: exterior is one direct background image.
  // No road/parallax transforms are written per frame; only gameplay props/entities move.

  // Keep visible props moving every animation frame so forward/downward travel is smooth.
  // The expensive full visibility/near scan runs at a much lower cadence.
  const now=performance.now();
  const scanProps=force || now>=state.nextPropRenderTs;
  if(scanProps){
    state.nextPropRenderTs=now+(state.moveDir!==0?90:55);
    const visibleProps=[];
    const currentZone=zoneAt(y);
    for(const o of state.worldPropEls){
      const sy=anchor+(o.data.y-y);
      const hideForInterior = (
        (!!currentZone.interior && !!o.data.exteriorDecor) ||
        // Saat berada di dalam ruangan, SEMUA gedung/gapura di tengah jalan disembunyikan
        // (bukan hanya gedung yang sedang dimasuki). Setelah keluar, otomatis muncul lagi.
        (!!currentZone.interior && (!!o.data.building || !!o.data.entry || !!o.data.exit || !!o.data.gate))
      );
      const visible=!hideForInterior && sy>-300&&sy<h+320;
      if(o.visible!==visible){
        o.visible=visible;
        o.el.style.visibility=visible?'visible':'hidden';
        o.el.style.willChange=visible?'transform':'auto';
      }
      if(visible){
        visibleProps.push(o);
        const near=(!!o.data.entry&&Math.abs(o.data.y-y)<260)||(!!o.data.npc&&Math.abs(o.data.y-y)<220);
        if(o.near!==near){o.near=near;o.el.classList.toggle('near',near)}
      }
    }
    state.visibleWorldProps=visibleProps;
  }
  for(const o of state.visibleWorldProps){
    const sy=anchor+(o.data.y-y);
    o.el.style.transform=`translate3d(-50%,${sy}px,0) translateY(-50%)`;
  }
  const p=clamp(y/WORLD.finish,0,1);
  const progress=Math.floor(p*100);
  const progWidth=(Math.floor(p*500)/5).toFixed(1);
  if(els.semesterProgress.dataset.w!==progWidth){els.semesterProgress.dataset.w=progWidth;els.semesterProgress.style.width=`${progWidth}%`}
  if(els.journeyLabel.dataset.v!==String(progress)){els.journeyLabel.dataset.v=String(progress);els.journeyLabel.textContent=`PERJALANAN ${progress}%`}
  const mode=state.postBoss?'post':(y>=W(14800)?'night':(y>=W(10800)?'sunset':'day'));
  if(mode!==state.worldVisualMode){
    state.worldVisualMode=mode;
    els.root.classList.toggle('world-sunset',mode==='sunset');
    els.root.classList.toggle('world-night',mode==='night');
    els.root.classList.toggle('post-acc',mode==='post');
  }
}
function zoneAt(y){return WORLD.zones.find(z=>y>=z.from&&y<z.to)||WORLD.zones[WORLD.zones.length-1]}
async function transitionZone(zone){
  if(state.zoneTransitioning||zone.id===state.zoneId)return;state.zoneTransitioning=true;state.paused=true;
  await fadeTo(async()=>{
    state.zoneId=zone.id;
    els.interior.classList.toggle('hidden',!zone.interior);
    applyInteriorBackground(zone);
    if(els.interiorRoomLabel) els.interiorRoomLabel.textContent=zone.interior?zone.label:'';
    els.locationLabel.textContent=zone.label;
    renderWorld(true); // immediately hide entrance inside / restore it after exiting.
  },90);
  if(zone.interior)floatText(`MASUK ${zone.label}`,playerAnchorY()-150,'xp');state.paused=false;state.zoneTransitioning=false;
  renderWorld(true);
}
function checkZone(){const z=zoneAt(state.worldY);if(z.id!==state.zoneId&&!state.zoneTransitioning)transitionZone(z)}
function semesterFromY(y){for(let i=WORLD.semesterBounds.length-1;i>=0;i--)if(y>=WORLD.semesterBounds[i])return Math.min(8,i+1);return 1}
function hasEnoughJourneyActivity(){
  // A short greeting game still needs a little participation: combat in several semesters,
  // several defeated monsters, or academic-note/task pickups all count as genuine engagement.
  return state.engagedSemesters.size>=3 || state.kills>=3 || state.tasksCompleted>=2;
}
async function antiCheatSemesterReset(){
  if(state.antiCheatResetting)return;
  state.antiCheatResetting=true;state.paused=true;setMove(0);stopSpawner();clearEntities();
  els.transitionKicker.textContent='KETAHUAN LICIK 😏';
  els.transitionSemester.textContent='BALIK KE SEMESTER 1';
  els.transitionMessage.textContent='Kuliah nggak bisa cuma lewat doang. Lawan monster atau kerjakan tugas dulu, ya!';
  show(els.transition);sfx('wrong');vibrate('damage');await sleep(1050);hide(els.transition);
  await fadeTo(async()=>{
    resetRun(true);
    state.running=true;state.paused=false;state.zoneId='outside-start';
    els.interior.classList.add('hidden');applyInteriorBackground(zoneAt(0));
    if(els.interiorRoomLabel)els.interiorRoomLabel.textContent='';
    renderWorld(true);updateHUD();
  },90);
  spawnLoop();state.antiCheatResetting=false;
}
async function unlockSemester(next){
  if(next<=state.semester||next>8||state.antiCheatResetting)return;
  if(next===8&&!hasEnoughJourneyActivity()){await antiCheatSemesterReset();return;}
  state.semester=next;state.checkpointY=WORLD.semesterBounds[next-1];captureCheckpoint();applyTheme();updateHUD();
  state.paused=true;rebuildSpawner();els.transitionKicker.textContent='SPECIAL BARU TERBUKA';els.transitionSemester.textContent=`SEMESTER ${next}`;els.transitionMessage.textContent=`${currentSpecial().name} — ${currentSpecial().description}`;show(els.transition);sfx('correct');await sleep(420);hide(els.transition);state.paused=false;
}
function checkSemester(){if(state.antiCheatResetting)return;const s=semesterFromY(state.worldY);if(s>state.semester)unlockSemester(s)}

/* ---------- Movement input ---------- */
function setMove(dir){if(dir!==0&&(!state.running||state.paused||state.finishing))return;state.moveDir=dir;els.root.classList.toggle('world-moving',dir!==0);els.player.classList.toggle('walking-manual',dir!==0);els.moveUpBtn.classList.toggle('held',dir<0);els.moveDownBtn.classList.toggle('held',dir>0);if(dir!==0)startWalkFrames();else{stopWalkFrames();updatePlayerSprite('field')}}
function bindHold(button,dir){
  const stop=()=>{if(state.moveDir===dir)setMove(0)};
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);setMove(dir)});
  button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('lostpointercapture',stop);button.addEventListener('contextmenu',e=>e.preventDefault());
}

/* ---------- Monsters & rewards ---------- */
function monsterPool(){return Object.entries(MONSTERS).filter(([,m])=>state.semester>=m.minSem)}
function chooseMonster(){const pool=monsterPool();let [id,m]=pool[Math.floor(Math.random()*pool.length)];if(state.semester>=7&&Math.random()<.28){id='thesis';m=MONSTERS.thesis}return {id,...m}}
function spawnMonster(){
  const enemyCap=2;
  if(!state.running||state.paused||state.postBoss||state.bossCleared||[...state.entities].filter(e=>e.kind==='monster').length>=enemyCap)return;
  const m=chooseMonster();
  const fromLeft=Math.random()<.5;
  const spawnX=fromLeft?(5+Math.random()*6):(89+Math.random()*6);
  const el=document.createElement('div');
  el.className=`entity monster ${m.id} ${fromLeft?'from-left':'from-right'}`;
  const monsterArt = SPRITES.monsters[m.id] ? spriteImg(SPRITES.monsters[m.id], m.name, 'monster-sprite') : `<b class="monster-mark">${m.mark}</b><i class="monster-mouth"></i>`;
  el.innerHTML=`<div class="monster-shell ${SPRITES.monsters[m.id]?'sprite-monster':''}">${monsterArt}</div><div class="monster-hp"><i></i></div><span class="monster-name">${m.name}</span>`;
  els.entityLayer.appendChild(el);
  const obj={kind:'monster',sub:m.id,name:m.name,el,worldY:state.worldY+W(300)+Math.random()*W(300),x:spawnX,targetX:50,hp:m.hp,maxHp:m.hp,speed:m.speed*WORLD_SCALE*(1+(state.semester-1)*.018),sideSpeed:m.sideSpeed*(1+(state.semester-1)*.015),damage:m.damage,xp:m.xp,points:m.points,lastHit:0,dead:false};
  state.entities.add(obj);positionEntity(obj);
}
function spawnRewardAt(worldY){
  let r=Math.random()*100,chosen=REWARDS[0];for(const it of REWARDS){if(r<it.weight){chosen=it;break}r-=it.weight}
  const el=document.createElement('div');el.className=`entity loot ${chosen.effect||chosen.id}`;el.dataset.label=chosen.label;const lootSprite=rewardSprite(chosen);el.innerHTML=lootSprite ? spriteImg(lootSprite, chosen.label, 'loot-sprite') : `<span class="loot-emoji">${chosen.icon}</span>`;els.entityLayer.appendChild(el);const obj={kind:'loot',sub:chosen.effect||chosen.id,rewardId:chosen.id,rewardName:chosen.label,el,worldY:worldY+20,x:48+Math.random()*4,dead:false};state.entities.add(obj);positionEntity(obj);
}
function positionEntity(obj){const sy=state.anchorY+(obj.worldY-state.worldY);const sx=state.viewportW*(obj.x/100);obj.screenY=sy;obj.screenX=sx;if(!obj.positioned){obj.el.style.left='0';obj.el.style.top='0';obj.positioned=true}const visible=sy>-110&&sy<state.viewportH+130&&sx>-90&&sx<state.viewportW+90;if(obj.visible!==visible){obj.visible=visible;obj.el.style.visibility=visible?'visible':'hidden'}if(visible)obj.el.style.transform=`translate3d(${sx}px,${sy}px,0) translate(-50%,-50%)`}
function removeEntity(obj){if(!obj||obj.dead)return;obj.dead=true;obj.el.remove();state.entities.delete(obj)}
function clearEntities(){state.entities.forEach(o=>o.el.remove());state.entities.clear()}
function floatText(text,y=playerAnchorY(),tone='good'){const e=document.createElement('div');e.className=`float-text combat-float ${tone}`;e.textContent=text;e.style.top=`${y}px`;els.floatLayer.appendChild(e);setTimeout(()=>e.remove(),950)}
function gainXP(amount){state.xp+=amount;let need=GAME_CONFIG.gameplay.xpPerLevel*state.level;while(state.xp>=need){state.xp-=need;state.level++;floatText(`LEVEL ${state.level}!`,playerAnchorY()-90,'xp');sfx('correct');need=GAME_CONFIG.gameplay.xpPerLevel*state.level}}
function defeatEnemy(obj){
  if(obj.dead)return;state.kills++;state.score+=obj.points;gainXP(obj.xp);floatText(`+${obj.xp} XP  •  +${obj.points} POIN`,obj.screenY,'xp');sfx('correct');const drop=Math.random()<.48;const wy=obj.worldY;removeEntity(obj);if(drop)spawnRewardAt(wy);updateHUD();
}
function createImpactEffect(x,y,special=false){
  const hit=document.createElement('div');hit.className=`attack-impact ${special?'special-impact':''}`;hit.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;hit.innerHTML='<i></i><i></i><i></i><i></i>';els.floatLayer.appendChild(hit);setTimeout(()=>hit.remove(),360);
}
function createHealEffect(x,y,amount){
  const heal=document.createElement('div');heal.className='heal-burst';heal.textContent=`♥ +${amount}`;heal.style.left=`${x}px`;heal.style.top=`${y}px`;heal.style.transform='translate(-50%,-50%)';els.floatLayer.appendChild(heal);setTimeout(()=>heal.remove(),650);
}
function fireAttackEffect(target,icon=facultyToolSprite(),special=false,onImpact){
  const startX=state.viewportW*.5,startY=playerAnchorY()-8;
  const endX=target?.screenX ?? startX;
  const endY=target?.screenY ?? (startY-130);
  const projectile=document.createElement('div');projectile.className=`attack-projectile ${special?'special-projectile':''}`; if(typeof icon==='string' && icon.includes('/')){projectile.innerHTML=spriteImg(icon,'tool','projectile-sprite')} else {projectile.textContent=icon;}
  projectile.style.transform=`translate3d(${startX}px,${startY}px,0) translate(-50%,-50%) scale(.72)`;els.floatLayer.appendChild(projectile);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{projectile.style.transform=`translate3d(${endX}px,${endY}px,0) translate(-50%,-50%) scale(${special?1.18:1})`}));
  const travel=special?220:175;
  setTimeout(()=>{createImpactEffect(endX,endY,special);onImpact?.();projectile.classList.add('spent');setTimeout(()=>projectile.remove(),90)},travel);
}
function applyDamageToEnemy(obj,damage,label='HIT!'){if(!obj||obj.dead)return;state.engagedSemesters.add(state.semester);obj.hp-=damage;obj.el.querySelector('.monster-hp i').style.width=`${clamp(obj.hp/obj.maxHp*100,0,100)}%`;floatText(label,obj.screenY,'good');obj.el.classList.remove('hit');void obj.el.offsetWidth;obj.el.classList.add('hit');sfx('hit');vibrate('enemyHit');setTimeout(()=>obj.el?.classList.remove('hit'),180);if(obj.hp<=0)defeatEnemy(obj)}
function collectReward(obj){
  if(obj.sub==='snack'){state.mental=clamp(state.mental+GAME_CONFIG.gameplay.snackHeal,0,100);floatText(`${obj.rewardName||'JAJANAN'} +${GAME_CONFIG.gameplay.snackHeal} HP`,obj.screenY,'good');createHealEffect(obj.screenX,obj.screenY,GAME_CONFIG.gameplay.snackHeal)}
  if(obj.sub==='mood'){state.mental=clamp(state.mental+GAME_CONFIG.gameplay.moodHeal,0,100);state.attackEnergy=clamp(state.attackEnergy+GAME_CONFIG.gameplay.moodEnergy,0,100);floatText(`${obj.rewardName||'MOOD BOOSTER'}!`,obj.screenY,'xp')}
  if(obj.sub==='note'){state.tasksCompleted++;state.engagedSemesters.add(state.semester);gainXP(GAME_CONFIG.gameplay.noteXP);floatText(`${obj.rewardName||'CATATAN TEMAN'} +${GAME_CONFIG.gameplay.noteXP} XP`,obj.screenY,'xp')}
  if(obj.sub==='inspiration'){state.attackEnergy=clamp(state.attackEnergy+GAME_CONFIG.gameplay.inspirationEnergy,0,100);if(!state.skillReady){state.skillReady=true;stopCooldown()}floatText(`${obj.rewardName||'INSPIRASI'}! SPECIAL READY`,obj.screenY,'xp')}
  sfx('pickup');vibrate('pickup');removeEntity(obj);updateHUD();
}
function damagePlayer(obj,timestamp){
  if(state.shield)return;if(timestamp-obj.lastHit<1100)return;obj.lastHit=timestamp;state.mental=clamp(state.mental-obj.damage,0,100);
  els.root.classList.remove('shake','damage-impact');els.player.classList.remove('player-hit');void els.root.offsetWidth;els.root.classList.add('shake','damage-impact');els.player.classList.add('player-hit');updatePlayerSprite('hurt');
  setTimeout(()=>{els.root.classList.remove('shake','damage-impact');els.player.classList.remove('player-hit');updatePlayerSprite(state.moveDir!==0?'run':'field')},360);
  sfx('damage');vibrate('damage');floatText(`-${obj.damage} HP`,playerAnchorY()-35,'bad');updateHUD();if(state.mental<=0)gameOver();
}
function enemyDistance(o){const dy=Math.abs(o.worldY-state.worldY);const dx=Math.abs((o.x??50)-50)*W(7);return Math.hypot(dy,dx)}
function nearestEnemies(limit=Infinity){return [...state.entities].filter(o=>o.kind==='monster'&&!o.dead).sort((a,b)=>enemyDistance(a)-enemyDistance(b)).slice(0,limit)}
function createAttackEffect(target,icon=facultyToolSprite(),special=false){fireAttackEffect(target,icon,special)}
function attack(){
  if(!state.running||state.paused||state.postBoss)return;if(state.attackEnergy<GAME_CONFIG.gameplay.attackCost){sfx('empty');floatText('ENERGI BELUM CUKUP',playerAnchorY()-70,'bad');return}
  state.attackEnergy-=GAME_CONFIG.gameplay.attackCost;const target=nearestEnemies(1)[0];const inRange=!!(target&&Math.abs(target.worldY-state.worldY)<=GAME_CONFIG.gameplay.attackRangeWorld&&Math.abs(target.x-50)<=GAME_CONFIG.gameplay.attackRangeSidePercent);const dmg=GAME_CONFIG.gameplay.attackDamage+Math.floor((state.level-1)/4);
  els.player.classList.remove('attacking');void els.player.offsetWidth;els.player.classList.add('attacking');stopWalkFrames();updatePlayerSprite('work');setTimeout(()=>{els.player.classList.remove('attacking');if(state.moveDir!==0)startWalkFrames();else updatePlayerSprite('field')},240);sfx('attack');vibrate('button');
  if(inRange){fireAttackEffect(target,facultyToolSprite(),false,()=>applyDamageToEnemy(target,dmg,'KERJAKAN!'))}
  else{fireAttackEffect(null,facultyToolSprite(),false);floatText('MUSUH MASIH TERLALU JAUH',playerAnchorY()-70,'bad')}
  updateHUD();
}

/* ---------- Special ---------- */
function resetTemporaryEffects(){state.shield=false;state.slowed=false;hide(els.shield);if(state.slowTimeout)clearTimeout(state.slowTimeout);if(state.shieldTimeout)clearTimeout(state.shieldTimeout);state.slowTimeout=null;state.shieldTimeout=null}
function activateSkill(){
  if(!state.running||state.paused||state.postBoss||!state.skillReady)return;const s=currentSpecial(),enemies=nearestEnemies();state.skillReady=false;sfx('skill');vibrate('button');fireAttackEffect(enemies[0],facultyToolSprite(),true);floatText(s.name.toUpperCase(),playerAnchorY()-100,'xp');
  if(s.effect==='single'&&enemies[0])applyDamageToEnemy(enemies[0],s.damage||2,s.name);
  else if(s.effect==='multi')enemies.slice(0,s.count||2).forEach(o=>applyDamageToEnemy(o,s.damage||2,s.name));
  else if(s.effect==='aoe')enemies.forEach(o=>applyDamageToEnemy(o,s.damage||1,s.name));
  else if(s.effect==='slow'){state.slowed=true;state.slowTimeout=setTimeout(()=>state.slowed=false,s.duration||4000)}
  else if(s.effect==='shield'){state.shield=true;show(els.shield);if(enemies[0]&&s.damage)applyDamageToEnemy(enemies[0],s.damage,s.name);state.shieldTimeout=setTimeout(()=>{state.shield=false;hide(els.shield)},s.duration||4200)}
  else if(s.effect==='energy'){state.attackEnergy=clamp(state.attackEnergy+(s.energy||45),0,100);if(enemies[0]&&s.damage)applyDamageToEnemy(enemies[0],s.damage,s.name)}
  else if(s.effect==='heal')state.mental=clamp(state.mental+(s.heal||20),0,100);
  else if(s.effect==='push')enemies.forEach(o=>{o.worldY+=s.power||110;o.x=clamp(o.x+(o.x<50?-12:12),3,97)});
  else if(s.effect==='convert')enemies.slice(0,s.count||1).forEach(o=>{const y=o.worldY;removeEntity(o);spawnRewardAt(y)});
  updateHUD();startCooldown(s.cooldown||8000);
}
function stopCooldown(){if(state.cooldownTimer)clearInterval(state.cooldownTimer);state.cooldownTimer=null;els.cooldown.style.width='0%'}
function startCooldown(ms){const t=performance.now();stopCooldown();state.cooldownTimer=setInterval(()=>{const p=clamp((performance.now()-t)/ms,0,1);els.cooldown.style.width=`${(1-p)*100}%`;if(p>=1){stopCooldown();state.skillReady=true}},60)}

/* ---------- Runner ---------- */
function captureCheckpoint(){state.semesterSnapshot={worldY:state.checkpointY,score:state.score,xp:state.xp,level:state.level,kills:state.kills,references:state.references,tasksCompleted:state.tasksCompleted,engagedSemesters:[...state.engagedSemesters]}}
function resetRun(full=true){
  state.mental=100;state.attackEnergy=100;state.moveDir=0;state.running=false;state.paused=false;state.bossCleared=false;state.postBoss=false;state.finishing=false;state.skillReady=true;resetTemporaryEffects();stopCooldown();clearEntities();
  if(full){state.semester=1;state.worldY=0;state.checkpointY=0;state.score=0;state.xp=0;state.level=1;state.kills=0;state.references=0;state.tasksCompleted=0;state.engagedSemesters=new Set();state.lastMilestoneSemester=1;state.zoneId='outside-start'}
  captureCheckpoint();applyTheme();renderWorld(true);updateHUD();
}
function updateHUD(force=true,now=performance.now()){
  if(!force&&now<state.nextHudTs)return;
  state.nextHudTs=now+100;
  const setText=(el,v)=>{v=String(v);if(el.dataset.v!==v){el.dataset.v=v;el.textContent=v}};
  const setWidth=(el,v)=>{const x=Math.round(v*10)/10;if(el.dataset.w!==String(x)){el.dataset.w=String(x);el.style.width=`${x}%`}};
  setWidth(els.mentalBar,clamp(state.mental,0,100));setText(els.hpLabel,Math.ceil(clamp(state.mental,0,100)));
  setWidth(els.attackEnergyBar,clamp(state.attackEnergy,0,100));setText(els.attackEnergyLabel,Math.floor(clamp(state.attackEnergy,0,100)));
  setText(els.semesterLabel,`SEM ${state.semester} / 8`);setText(els.scoreLabel,state.score);setText(els.refLabel,state.kills);setText(els.xpLabel,Math.floor(state.xp));setText(els.levelLabel,state.level);setText(els.skillName,currentSpecial()?.name||faculty().skill);
  const attackDisabled=!state.running||state.paused||state.postBoss;if(els.attackBtn.disabled!==attackDisabled)els.attackBtn.disabled=attackDisabled;if(els.toolBtn.disabled!==attackDisabled)els.toolBtn.disabled=attackDisabled;
  const z=zoneAt(state.worldY);setText(els.locationLabel,z.label);
  const critical=state.running&&state.mental>0&&state.mental<=25;els.recoveryBanner.classList.toggle('hidden',!critical);setWidth(els.recoveryBar,clamp(state.mental,0,100));
}

function spawnLoop(){
  stopSpawner();
  state.waveInProgress=false;
  state.nextWaveAt=performance.now()+1400;
  state.spawnTimer=setInterval(()=>{
    if(!state.running||state.paused||state.postBoss||state.bossCleared)return;
    const now=performance.now();
    const active=[...state.entities].filter(e=>e.kind==='monster'&&!e.dead).length;
    if(state.waveInProgress){
      if(active===0){state.waveInProgress=false;state.nextWaveAt=now+2100;}
      return;
    }
    if(active>0||now<state.nextWaveAt)return;
    state.waveInProgress=true;
    spawnMonster();
    setTimeout(()=>{
      if(!state.running||state.paused||state.postBoss)return;
      const count=[...state.entities].filter(e=>e.kind==='monster'&&!e.dead).length;
      if(count<2)spawnMonster();
    },620);
  },500);
}
function stopSpawner(){if(state.spawnTimer)clearInterval(state.spawnTimer);state.spawnTimer=null}
function rebuildSpawner(){spawnLoop()}
function gameOver(){if(!state.running)return;state.running=false;setMove(0);stopSpawner();show(els.gameover);sfx('wrong');vibrate('damage')}
async function retryCheckpoint(){
  hide(els.gameover);clearEntities();resetTemporaryEffects();state.worldY=state.semesterSnapshot?.worldY??state.checkpointY;state.score=state.semesterSnapshot?.score??state.score;state.xp=state.semesterSnapshot?.xp??state.xp;state.level=state.semesterSnapshot?.level??state.level;state.kills=state.semesterSnapshot?.kills??state.kills;state.tasksCompleted=state.semesterSnapshot?.tasksCompleted??state.tasksCompleted;state.engagedSemesters=new Set(state.semesterSnapshot?.engagedSemesters??[...state.engagedSemesters]);state.mental=100;state.attackEnergy=100;state.running=true;state.paused=false;state.moveDir=0;state.zoneId=zoneAt(state.worldY).id;els.interior.classList.toggle('hidden',!zoneAt(state.worldY).interior);applyInteriorBackground(zoneAt(state.worldY));if(els.interiorRoomLabel)els.interiorRoomLabel.textContent=zoneAt(state.worldY).interior?zoneAt(state.worldY).label:'';renderWorld(true);updateHUD();spawnLoop();
}
function runnerTick(ts=performance.now()){
  if(!state.lastTickTs)state.lastTickTs=ts;
  const elapsed=ts-state.lastTickTs;
  const dt=Math.min(.034,Math.max(.001,elapsed/1000));state.lastTickTs=ts;
  if(state.running&&!state.paused){
    let worldMoved=false;
    if(state.moveDir!==0){
      const speed=(state.moveDir>0?GAME_CONFIG.gameplay.walkSpeed:GAME_CONFIG.gameplay.backtrackSpeed)*WORLD_SCALE;
      const minY=state.postBoss?W(16050):0;
      const before=state.worldY;state.worldY=clamp(state.worldY+state.moveDir*speed*dt,minY,WORLD.finish);worldMoved=Math.abs(state.worldY-before)>.001;
      checkSemester();
      if(!state.antiCheatResetting){
        checkZone();
        if(!state.bossCleared&&state.worldY>=WORLD.bossDoor){state.worldY=WORLD.bossDoor;setMove(0);beginBossSequence()}
      }
      if(state.postBoss&&state.worldY>=WORLD.finish-30&&!state.finishing){state.finishing=true;setMove(0);showGraduation()}
    }
    state.attackEnergy=clamp(state.attackEnergy+GAME_CONFIG.gameplay.attackEnergyRegenPerSecond*dt,0,100);
    const speedFactor=state.slowed?.55:1;
    for(const obj of state.entities){
      if(obj.dead)continue;
      if(obj.kind==='monster'){
        const diff=state.worldY-obj.worldY,dir=Math.sign(diff||-1);
        obj.worldY+=dir*obj.speed*speedFactor*dt;
        // Ketika sudah masuk area pandang, monster berjalan dari sisi kiri/kanan menuju karakter secara bertahap.
        if(Math.abs(diff)<W(650)){
          const targetX=obj.targetX??50;
          const xDir=Math.sign(targetX-obj.x);
          const step=obj.sideSpeed*speedFactor*dt;
          if(Math.abs(targetX-obj.x)<=step)obj.x=targetX;else obj.x+=xDir*step;
        }
        positionEntity(obj);
        if(Math.abs(obj.worldY-state.worldY)<58&&Math.abs(obj.x-50)<8.5)damagePlayer(obj,ts);
        if(obj.sub==='sleepy'&&Math.abs(obj.worldY-state.worldY)<170)state.attackEnergy=Math.max(0,state.attackEnergy-7*dt);
      }else{positionEntity(obj);if(Math.abs(obj.worldY-state.worldY)<56)collectReward(obj)}
    }
    if(worldMoved)renderWorld(false);
    updateHUD(false,ts);
  }
  requestAnimationFrame(runnerTick);
}


const TUTORIAL_PAGES=[
  {icon:'🎓',title:'Perjalanan Singkatmu',text:'Tahan ▼ untuk maju, lepaskan untuk berhenti. Monster datang dari pinggir: tekan KERJAKAN atau SPECIAL. Perjalanan ini singkat—tujuannya sampai ke ucapan wisudamu.'}
];
function renderTutorial(){const p=TUTORIAL_PAGES[state.tutorialPageIndex];const tSrc=tutorialIconFor(p);els.tutorialIcon.innerHTML=tSrc?`<img src="${tSrc}" alt="${p.title}">`:p.icon;els.tutorialTitle.textContent=p.title;els.tutorialText.textContent=p.text;els.tutorialDots.innerHTML=TUTORIAL_PAGES.map((_,i)=>`<i class="${i===state.tutorialPageIndex?'active':''}"></i>`).join('');els.tutorialDots.classList.toggle('hidden',TUTORIAL_PAGES.length<2);const last=state.tutorialPageIndex===TUTORIAL_PAGES.length-1;els.tutorialNext.classList.toggle('hidden',last);els.tutorialStart.classList.toggle('hidden',!last)}
function showTutorial(){if(state.tutorialSeen)return Promise.resolve();state.tutorialSeen=true;state.tutorialPageIndex=0;renderTutorial();show(els.tutorial);return new Promise(resolve=>{els.tutorialStart.onclick=()=>{hide(els.tutorial);resolve()}})}
async function startRunner(){
  state.campusEntered=true;
  setScene('runner');
  hide(els.mainMenu,els.novel,els.facultyScreen,els.majorScreen,els.bossScreen,els.graduation,els.memoryScreen,els.blessingScreen);
  show(els.gameplay,els.hud);
  resetRun(true);
  if(els.sceneArt)els.sceneArt.src=SPRITES.backgrounds.campus;
  applyInteriorBackground(null);
  hide(els.interior);
  els.bg.className='layer campus-bg scene-campus';
  els.bg.style.opacity='0'; // World sudah memakai satu background; tidak ada lapisan kedua.
  initWorldProps();         // Memetakan NPC/gerbang sebelum pemain bergerak.
  renderWorld(true);
  playMusic('gameplay');
  await showTutorial();
  // FIX: v1.8.2 punya fungsi loading tetapi belum pernah memanggilnya.
  await runActionLoader();
  state.running=true;
  state.lastTickTs=performance.now();
  captureCheckpoint();
  spawnLoop();
  renderWorld(true);
  updateHUD(true);
}

/* ---------- Sidang — visual novel, bukan boss battle ---------- */
async function beginBossSequence(){
  if(state.scene==='exam'||state.bossCleared)return;
  state.running=false;stopSpawner();clearEntities();
  await runStory(PRE_BOSS_STORY,startBoss);
}
async function examLine(speaker,text,portrait='examiner',expression='normal'){
  setScene('novel');show(els.novel);hide(els.bossScreen);els.bg.style.filter='brightness(.58)';
  els.speaker.textContent=resolveText(speaker);setPortrait(portrait,expression);
  const copy=resolveText(text);await typeText(copy,state.novelSkip);addHistory(resolveText(speaker),copy);await waitForDialogAdvance();
}
function askExamChoice(q){
  return new Promise(async resolve=>{
    setScene('novel');show(els.novel);hide(els.bossScreen);els.bg.style.filter='brightness(.58)';
    els.speaker.textContent=q.examiner;setPortrait('examiner','thinking');
    await typeText(resolveText(q.question),false);addHistory(q.examiner,resolveText(q.question));
    await sleep(420);els.choices.innerHTML='';show(els.choices);
    shuffled(q.answers).forEach((answer,i)=>{
      const b=document.createElement('button');b.type='button';b.innerHTML=`<small>PILIHAN ${i+1}</small><span>${answer.text}</span>`;
      b.onclick=()=>{[...els.choices.children].forEach(x=>x.disabled=true);sfx(answer.correct?'correct':'click');if(!answer.correct){state.mental=Math.max(35,state.mental-4)}hide(els.choices);resolve(answer)};
      els.choices.appendChild(b);
    });
  });
}
async function runExamSequence(){
  state.examActive=true;playMusic('boss');state.bossQuestionIndex=0;state.mental=Math.max(60,state.mental);
  await examLine('Ketua Sidang','Silakan duduk dulu. Santai saja, kita anggap ini diskusi terakhir sebelum kamu menyelesaikan perjalanan ini.','examiner','smile');
  await examLine('{{playerName}}','Baik, Pak.','player','normal');
  await examLine('Narator','Entah kenapa, kursi di ruang sidang terasa sedikit lebih dingin dari biasanya.','none','normal');
  await examLine('{{playerName}}','Oke... tarik napas. Jangan sampai semua yang dipelajari mendadak hilang.','player','thinking');
  for(let i=0;i<BOSS_QUESTIONS.length;i++){
    const q=BOSS_QUESTIONS[i];state.bossQuestionIndex=i;
    await examLine(q.examiner,q.lead,'examiner',i===2?'smile':'normal');
    const answer=await askExamChoice(q);
    await examLine(q.examiner,answer.response,'examiner',answer.correct?'smile':'serious');
    if(i===0) await examLine('{{playerName}}',answer.correct?'Syukurlah... aman satu.':'Oke, catat. Jangan buru-buru jawab.','player',answer.correct?'happy':'thinking');
    if(i===1) await examLine('Dosen Pembimbing','Pelan-pelan saja. Kamu sudah sampai sejauh ini.','advisor','smile');
    if(i===2) await examLine('{{playerName}}','Baik, Pak... saya terima itu.','player','happy');
  }
  hide(els.choices,els.novel);els.bg.style.filter='';state.examActive=false;await bossVictory();
}
function startBoss(){setScene('exam');hide(els.gameplay,els.hud,els.bossScreen);runExamSequence()}
function updateBoss(){}
function shuffled(a){const c=[...a];for(let i=c.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[c[i],c[j]]=[c[j],c[i]]}return c}
function showBossQuestion(){}
function answerBoss(){}
function bossFloat(){}
async function bossVictory(){stopMusic();sfx('acc');vibrate('graduation');await flash();hide(els.bossScreen);state.bossCleared=true;await runStory(ACC_STORY,resumeAfterBoss)}
function retryBoss(){hide(els.bossRetry);startBoss()}
async function resumeAfterBoss(){setScene('runner');show(els.gameplay,els.hud);state.worldY=P(16060);state.postBoss=true;state.running=true;state.paused=false;state.moveDir=0;state.zoneId='post-acc';hide(els.interior);applyInteriorBackground(null);els.bg.style.opacity='.12';renderWorld(true);updateHUD();playMusic('campus');els.transitionKicker.textContent='SIDANG SELESAI';els.transitionSemester.textContent='LULUS ✓';els.transitionMessage.textContent='Satu perjalanan sudah selesai. Tinggal berjalan sebentar menuju kenangan dan momen wisudamu.';show(els.transition);await sleep(900);hide(els.transition)}

/* ---------- Epilog + Graduation ---------- */
const MEMORY_SLIDES = [
  {
    kicker:'KEBERSAMAAN',
    image:'assets/backgrounds/kebersamaan.jpg',
    text:'Dari semua hal yang datang dan pergi selama kuliah, kebersamaan selalu jadi bagian yang paling sulit dilupakan. Ada tawa di sela lelah, cerita di antara jadwal yang padat, dan teman-teman yang membuat semuanya terasa lebih ringan.'
  },
  {
    kicker:'TUGAS YANG SULIT',
    image:'assets/backgrounds/tugas.jpg',
    text:'Ada masa ketika tugas terasa tidak ada habisnya. Deadline datang bersamaan, revisi terus berdatangan, dan rasanya ingin berhenti sebentar. Tapi justru di situlah perjalanan ini dibentuk — sedikit demi sedikit, hari demi hari.'
  },
  {
    kicker:'BELAJAR DARI DOSEN',
    image:'assets/backgrounds/belajar.jpg',
    text:'Dari para dosen, bukan hanya ilmu yang didapatkan. Ada arahan, teguran, nasihat, dan pelajaran hidup yang perlahan membentuk cara berpikir, cara bertahan, dan cara melangkah lebih dewasa.'
  },
  {
    kicker:'SEBUAH PERJALANAN',
    image:'assets/backgrounds/wisuda.jpg',
    text:'Kampus ini bukan hanya tempat belajar. Ia menjadi ruang tumbuh — tempat mengenal diri sendiri, jatuh, bangkit, mencoba lagi, dan akhirnya sampai sejauh ini.'
  }
];
function setupGraduation(){
  els.gradHeadline.textContent=resolveText(GAME_CONFIG.graduation.headline);
  els.gradTitle.textContent=resolveText(GAME_CONFIG.graduation.title);
  els.graduateName.textContent=graduateDisplayName();
  if(els.graduateMajor)els.graduateMajor.textContent=`${major().name} · ${major().level}`;
  els.graduateFaculty.textContent=faculty().name;
  els.gradQuote.textContent=`“${resolveText(GAME_CONFIG.graduation.quote)}”`;
  els.gradMessage.textContent=resolveText(GAME_CONFIG.graduation.message);
  const gradChar=document.querySelector('.graduate-character');
  if(gradChar){gradChar.classList.add('sprite-grad');gradChar.style.backgroundImage=`url("${facultyTogaSprite()}")`;}
  if(GAME_CONFIG.graduation.showSender){
    show(els.gradSender);els.senderPrefix.textContent=resolveText(GAME_CONFIG.graduation.senderPrefix);
    const lines=GAME_CONFIG.graduation.senderLines||[GAME_CONFIG.graduation.senderName];
    els.senderName.innerHTML=lines.map(x=>`<span>${resolveText(x)}</span>`).join('');
  }else hide(els.gradSender);
}
function syncGraduationMusicButton(){
  if(!els.graduationMusicBtn) return;
  const status=typeof graduationMusicStatus==='function'?graduationMusicStatus():'stopped';
  els.graduationMusicBtn.textContent=status==='playing'?'❚❚ PAUSE MUSIK':'▶ PUTAR MUSIK';
  els.graduationMusicBtn.classList.toggle('playing',status==='playing');
}
async function toggleEndingMusic(){
  if(typeof toggleGraduationTrack!=='function') return;
  await unlockAudio();await toggleGraduationTrack();syncGraduationMusicButton();
}
function renderMemorySlide(index){
  const slide=MEMORY_SLIDES[index];state.memorySlideIndex=index;
  els.memoryVisual.classList.remove('zoom-a','zoom-b');void els.memoryVisual.offsetWidth;
  els.memoryVisual.style.backgroundImage=`url("${slide.image}")`;
  els.memoryVisual.classList.add(index%2?'zoom-b':'zoom-a');
  els.memoryKicker.textContent=slide.kicker;els.memoryText.textContent=slide.text;
  els.memoryDots.innerHTML=MEMORY_SLIDES.map((_,i)=>`<i class="${i===index?'active':''}"></i>`).join('');
  els.memoryNext.textContent=index===MEMORY_SLIDES.length-1?'LANJUT KE PESAN':'LANJUT';
}
function showMemoryCarousel(){
  return new Promise(resolve=>{
    setScene('memory');hide(els.gameplay,els.hud,els.novel,els.bossScreen,els.graduation,els.blessingScreen);show(els.memoryScreen);
    let i=0,timer=null,done=false;
    const next=()=>{if(done)return;clearTimeout(timer);if(i>=MEMORY_SLIDES.length-1){done=true;hide(els.memoryScreen);resolve();return}i++;renderMemorySlide(i);timer=setTimeout(next,6500)};
    els.memoryNext.onclick=next;renderMemorySlide(0);timer=setTimeout(next,6500);
  });
}
function buildBlessingContent(){
  const lines=(GAME_CONFIG.graduation.blessingLines||[]).map(x=>`<p>${resolveText(x)}</p>`).join('');
  const sender=(GAME_CONFIG.graduation.senderLines||[]).map(x=>`<strong>${resolveText(x)}</strong>`).join('');
  els.blessingName.textContent=playerNickname();
  els.blessingTrack.innerHTML=`<div class="blessing-intro">${lines}</div><div class="blessing-final"><small>AKHIR DARI SATU PERJALANAN, AWAL DARI YANG BARU</small><h2>SELAMAT ATAS KELULUSANMU</h2><h1>${graduateDisplayName()}</h1><b>${major().name} · ${major().level}</b><em>${faculty().name}</em><div class="blessing-senders"><span>${resolveText(GAME_CONFIG.graduation.senderPrefix)}</span>${sender}</div></div>`;
}
function showBlessingScroll(){
  return new Promise(resolve=>{
    setScene('blessing');state.blessingFast=false;buildBlessingContent();show(els.blessingScreen);hide(els.memoryScreen);
    els.blessingViewport.scrollTop=0;els.blessingScreen.onclick=()=>{state.blessingFast=true};
    let last=performance.now(),progress=0,finished=false;
    const baseDuration=32000;
    const step=(now)=>{
      if(finished)return;const dt=now-last;last=now;progress+=dt*(state.blessingFast?2.5:1)/baseDuration;
      const max=Math.max(0,els.blessingViewport.scrollHeight-els.blessingViewport.clientHeight);
      els.blessingViewport.scrollTop=max*clamp(progress,0,1);
      if(progress>=1){finished=true;setTimeout(()=>{hide(els.blessingScreen);resolve()},state.blessingFast?1400:3600);return}
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
async function showGraduation(){
  state.running=false;hide(els.gameplay,els.hud,els.novel,els.bossScreen);updatePlayerSprite('celebrate');
  // Musik wisuda dimulai sejak epilog (carousel kenangan), lalu terus berlanjut ke ucapan dan layar wisuda.
  playMusic('graduation');setTimeout(syncGraduationMusicButton,180);
  await showMemoryCarousel();await showBlessingScroll();
  setScene('graduation');show(els.graduation);setupGraduation();sfx('acc');startCelebration();
  els.graduation.classList.add('party-enter');setTimeout(()=>els.graduation.classList.remove('party-enter'),1800);
}
function startCelebration(){const c=els.celebrationCanvas,ctx2=c.getContext('2d'),DPR=LOW_POWER?1:Math.min(2,devicePixelRatio||1);c.width=390*DPR;c.height=844*DPR;ctx2.setTransform(DPR,0,0,DPR,0,0);const conf=[],fire=[];let last=0;function burst(){const x=45+Math.random()*300,y=80+Math.random()*330,colors=[faculty().color,'#ffd166','#fff','#ff78aa','#5ed8ff'],col=colors[Math.floor(Math.random()*colors.length)];const burstCount=LOW_POWER?18:32;for(let i=0;i<burstCount;i++){const a=Math.PI*2*i/burstCount,s=1.2+Math.random()*2.7;fire.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,col})}}function frame(t){ctx2.clearRect(0,0,390,844);if(Math.random()<(LOW_POWER ? 0.16 : 0.28))for(let i=0;i<(LOW_POWER?3:6);i++)conf.push({x:Math.random()*390,y:-8,vx:(Math.random()-.5)*1.4,vy:1.4+Math.random()*2.5,r:3+Math.random()*4,h:Math.random()*360});if(t-last>560){burst();last=t}conf.forEach(p=>{p.x+=p.vx;p.y+=p.vy;ctx2.fillStyle=`hsl(${p.h} 82% 62%)`;ctx2.fillRect(p.x,p.y,p.r,p.r*1.8)});fire.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.014;p.life-=.016;ctx2.globalAlpha=Math.max(0,p.life);ctx2.fillStyle=p.col;ctx2.fillRect(p.x,p.y,3,3);ctx2.globalAlpha=1});for(let i=conf.length-1;i>=0;i--)if(conf[i].y>860)conf.splice(i,1);for(let i=fire.length-1;i>=0;i--)if(fire[i].life<=0)fire.splice(i,1);state.celebrationRAF=requestAnimationFrame(frame)}cancelAnimationFrame(state.celebrationRAF);state.celebrationRAF=requestAnimationFrame(frame)}

/* ---------- UI/settings ---------- */
function openSettings(){show(els.settingsModal)}
function openAbout(){show(els.aboutModal);sfx('click')}
function closeAbout(){hide(els.aboutModal);sfx('click')}
function closeSettings(){hide(els.settingsModal);state.settings.music=els.musicToggle.checked;state.settings.sfx=els.sfxToggle.checked;state.settings.haptic=els.hapticToggle.checked;saveSettings();if(state.settings.music){if(state.scene==='menu')playMusic('menu');else if(state.scene==='runner')playMusic(state.postBoss?'campus':'gameplay');else if(state.scene==='exam'||state.scene==='novel')playMusic('boss');else if(state.scene==='graduation'||state.scene==='blessing')playMusic('graduation')}}
function openLog(){els.logContent.innerHTML=state.dialogHistory.map(x=>`<div class="log-entry"><b>${x.speaker}</b><br>${x.text}</div>`).join('')||'<p>Belum ada dialog.</p>';show(els.logModal)}
function pauseGame(){if(state.scene!=='runner'||!state.running)return;state.paused=true;setMove(0);show(els.pauseModal)}
function resumeGame(){state.paused=false;hide(els.pauseModal)}
function cleanup(){stopSpawner();stopCooldown();resetTemporaryEffects();if(state.dialogAdvanceTimer)clearTimeout(state.dialogAdvanceTimer);state.dialogAdvanceResolver=null;cancelAnimationFrame(state.celebrationRAF)}
async function backToMenu(){state.running=false;state.campusEntered=false;updatePlayerSprite('field');cleanup();clearEntities();stopMusic();hide(els.actionLoading,els.tutorial,els.pauseModal,els.settingsModal,els.aboutModal,els.logModal,els.gameover,els.bossRetry,els.graduation,els.memoryScreen,els.blessingScreen,els.bossScreen,els.gameplay,els.hud,els.novel,els.facultyScreen,els.majorScreen,els.transition);els.bg.className='layer campus-bg scene-gate';els.bg.style.opacity='1';show(els.mainMenu);setScene('menu');state.novelAuto=false;state.novelSkip=false;els.autoBtn.classList.remove('active');els.skipBtn.classList.remove('active');resetRun(true);playMusic('menu')}
async function beginAdventure(){await unlockAudio();state.dialogHistory=[];sfx('click');vibrate('button');playMusic('campus');await fadeTo(async()=>{hide(els.mainMenu);els.bg.className='layer campus-bg scene-gate'});await runStory(INTRO_STORY,showFacultySelection)}

function bindInput(){
  els.start.onclick=beginAdventure;els.settings.onclick=openSettings; if(els.aboutBtn)els.aboutBtn.onclick=openAbout; if(els.aboutClose)els.aboutClose.onclick=closeAbout;els.settingsClose.onclick=closeSettings;els.facultyPrev.onclick=()=>changeFacultyPreview(-1);els.facultyNext.onclick=()=>changeFacultyPreview(1);els.facultyConfirm.onclick=confirmFacultySelection;if(els.majorBack)els.majorBack.onclick=backToFacultySelection;if(els.majorConfirm)els.majorConfirm.onclick=confirmMajorSelection;
  els.tutorialNext.onclick=()=>{if(state.tutorialPageIndex<TUTORIAL_PAGES.length-1){state.tutorialPageIndex++;renderTutorial()}};
  els.pauseBtn.onclick=pauseGame;els.resumeBtn.onclick=resumeGame;els.pauseSettingsBtn.onclick=openSettings;els.menuBtn.onclick=backToMenu;els.retryBtn.onclick=retryCheckpoint;els.bossRetryBtn.onclick=retryBoss;els.attackBtn.onclick=attack;els.toolBtn.onclick=activateSkill;bindHold(els.moveUpBtn,-1);bindHold(els.moveDownBtn,1);
  els.logBtn.onclick=openLog;els.logClose.onclick=()=>hide(els.logModal);els.dialogBox.addEventListener('pointerup',advanceNovel);
  els.autoBtn.onclick=()=>{state.novelAuto=!state.novelAuto;els.autoBtn.classList.toggle('active',state.novelAuto);if(state.novelAuto&&state.dialogAdvanceResolver){if(state.dialogAdvanceTimer)clearTimeout(state.dialogAdvanceTimer);state.dialogAdvanceTimer=setTimeout(finishDialogAdvance,700)}};
  els.skipBtn.onclick=()=>{state.novelSkip=!state.novelSkip;els.skipBtn.classList.toggle('active',state.novelSkip);if(state.novelSkip){completeTyping();if(state.dialogAdvanceResolver){if(state.dialogAdvanceTimer)clearTimeout(state.dialogAdvanceTimer);state.dialogAdvanceTimer=setTimeout(finishDialogAdvance,80)}}};
  els.shareBtn.onclick=async()=>{sfx('click');await shareGraduationCard(state.facultyId,{level:state.level,kills:state.kills,score:state.score})};
  els.downloadBtn.onclick=async()=>{sfx('click');await downloadGraduationCard(state.facultyId,{level:state.level,kills:state.kills,score:state.score})};
  els.replayBtn.onclick=backToMenu;
  if(els.graduationMusicBtn) els.graduationMusicBtn.onclick=toggleEndingMusic;
  const keys=new Set();
  window.addEventListener('keydown',e=>{if(state.scene==='novel'&&[' ','Enter','ArrowRight'].includes(e.key)){e.preventDefault();advanceNovel();return}if(state.scene==='runner'){if(e.key==='ArrowDown'||e.key.toLowerCase()==='s'){e.preventDefault();keys.add('down');setMove(1)}if(e.key==='ArrowUp'||e.key.toLowerCase()==='w'){e.preventDefault();keys.add('up');setMove(-1)}if(e.key===' '||e.key.toLowerCase()==='f'){e.preventDefault();attack()}if(e.key.toLowerCase()==='e'){e.preventDefault();activateSkill()}}if(e.key==='Escape'&&state.scene==='runner')pauseGame()});
  window.addEventListener('keyup',e=>{if(e.key==='ArrowDown'||e.key.toLowerCase()==='s'){keys.delete('down');if(!keys.has('up'))setMove(0);else setMove(-1)}if(e.key==='ArrowUp'||e.key.toLowerCase()==='w'){keys.delete('up');if(!keys.has('down'))setMove(0);else setMove(1)}});
  [els.musicToggle,els.sfxToggle,els.hapticToggle].forEach(input=>input.addEventListener('change',()=>{state.settings.music=els.musicToggle.checked;state.settings.sfx=els.sfxToggle.checked;state.settings.haptic=els.hapticToggle.checked;saveSettings()}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.scene==='runner'&&state.running&&!state.paused)pauseGame()});
}

function blockSelectionAndCopy(){
  // Tidak ada kolom input teks di game ini, jadi semua seleksi/copy/menu klik-kanan/drag aman dimatikan.
  ['selectstart','copy','cut','dragstart','contextmenu'].forEach(type=>document.addEventListener(type,e=>e.preventDefault()));
  document.addEventListener('dblclick',e=>{e.preventDefault();window.getSelection?.()?.removeAllRanges()});
  document.addEventListener('selectionchange',()=>{const sel=window.getSelection?.();if(sel&&!sel.isCollapsed)sel.removeAllRanges()});
}
function init(){blockSelectionAndCopy();state.campusEntered=false;document.documentElement.classList.toggle('perf-lite',LOW_POWER);cacheViewport();window.addEventListener('resize',()=>{cacheViewport();renderWorld(true)});loadSettings();applyConfig();setupStaticSpriteScreens();bindInput();resetRun(true);runnerTick();show(els.mainMenu);hide(els.gameplay,els.hud,els.novel,els.facultyScreen,els.majorScreen,els.bossScreen,els.memoryScreen,els.blessingScreen,els.graduation,els.tutorial,els.interior,els.aboutModal,els.actionLoading);setScene('menu');
  // Splash awal dinonaktifkan; loading premium kini muncul tepat sebelum mode action dimulai.
  if($('#boot-loading')) $('#boot-loading').classList.add('hidden');
  els.start.disabled=false;
  // Lakukan preload ringan di belakang layar agar transisi berikutnya makin halus.
  Promise.allSettled(actionAssetUrls().slice(0,10).map(src=>bootLoadImage(src).catch(()=>false)));
  document.addEventListener('pointerdown',async()=>{await unlockAudio();if(state.scene==='menu'&&state.settings.music)playMusic('menu')},{once:true})}
init();
