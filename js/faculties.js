const GLOBAL_SEMESTER_SKILLS = [
  { name:'Belajar Dasar', effect:'single', damage:2, cooldown:5200, description:'Mulai memahami ritme kuliah dan menyelesaikan satu tantangan terdekat.' },
  { name:'Belajar Cepat', effect:'multi', damage:2, count:2, cooldown:6000, description:'Mulai terbiasa: dua masalah bisa ditangani sekaligus.' },
  { name:'Manajemen Tugas', effect:'energy', energy:46, damage:1, cooldown:6800, description:'Mengatur prioritas, memulihkan energi, lalu lanjut mengerjakan.' },
  { name:'Berpikir Kritis', effect:'slow', duration:4200, cooldown:7600, description:'Membaca situasi lebih tenang sehingga tekanan terasa lebih lambat.' },
  { name:'Problem Solving', effect:'multi', damage:3, count:3, cooldown:8200, description:'Masalah besar dipecah menjadi langkah-langkah yang bisa diselesaikan.' },
  { name:'Analisis Data', effect:'shield', duration:4500, damage:1, cooldown:9000, description:'Data membantu mengambil keputusan dan memberi perlindungan sementara.' },
  { name:'Final Project', effect:'aoe', damage:2, cooldown:9800, description:'Fokus tugas akhir mengenai seluruh tekanan akademik di sekitar.' },
  { name:'Academic Mastery', effect:'aoe', damage:3, cooldown:11000, description:'Semua pengalaman delapan semester menyatu menjadi kemampuan terakhir.' }
];

const FACULTIES = {
  education: {
    id:'education',
    name:'Fakultas Keguruan dan Ilmu Pendidikan',
    shortName:'FKIP',
    color:'#808381',
    tool:'Buku & Pointer',
    icon:'📚',
    skill:'Belajar Dasar',
    skillDescription:'Skill semester dibuat global; fakultas menentukan identitas dan Academic Gear.',
    specialAttacks: GLOBAL_SEMESTER_SKILLS,
    majors:[
      { id:'pendidikan-masyarakat', name:'Pendidikan Masyarakat', level:'S1', degree:'S.Pd.' },
      { id:'pendidikan-bahasa-indonesia', name:'Pendidikan Bahasa Indonesia', level:'S1', degree:'S.Pd.' },
      { id:'pendidikan-bahasa-inggris', name:'Pendidikan Bahasa Inggris', level:'S1', degree:'S.Pd.' },
      { id:'pendidikan-matematika', name:'Pendidikan Matematika', level:'S1', degree:'S.Pd.' }
    ]
  },
  economics: {
    id:'economics',
    name:'Fakultas Ekonomi dan Bisnis',
    shortName:'FEB',
    color:'#572B00',
    tool:'Market Trend',
    icon:'📈',
    skill:'Belajar Dasar',
    skillDescription:'Academic Gear FEB memakai grafik bullish–bearish: panah hijau naik dan merah turun.',
    specialAttacks: GLOBAL_SEMESTER_SKILLS,
    majors:[
      { id:'ekonomi-pembangunan', name:'Ekonomi Pembangunan', level:'S1', degree:'S.E.' },
      { id:'manajemen', name:'Manajemen', level:'S1', degree:'S.M.', featured:true },
      { id:'akuntansi', name:'Akuntansi', level:'S1', degree:'S.Ak.' },
      { id:'perbankan-keuangan', name:'Perbankan dan Keuangan', level:'D3', degree:'A.Md.Keu.' }
    ]
  },
  engineering: {
    id:'engineering',
    name:'Fakultas Teknik',
    shortName:'FT',
    color:'#002B82',
    tool:'Laptop',
    icon:'💻',
    skill:'Belajar Dasar',
    skillDescription:'Academic Gear Teknik adalah laptop untuk desain, simulasi, coding, analisis, dan proyek.',
    specialAttacks: GLOBAL_SEMESTER_SKILLS,
    majors:[
      { id:'teknik-sipil', name:'Teknik Sipil', level:'S1', degree:'S.T.' },
      { id:'teknik-elektro', name:'Teknik Elektro', level:'S1', degree:'S.T.' },
      { id:'informatika', name:'Informatika', level:'S1', degree:'S.Kom.' },
      { id:'sistem-informasi', name:'Sistem Informasi', level:'S1', degree:'S.Kom.' }
    ]
  },
  agriculture: {
    id:'agriculture',
    name:'Fakultas Pertanian',
    shortName:'FP',
    color:'#02812C',
    tool:'Bio Seed',
    icon:'🧬',
    skill:'Belajar Dasar',
    skillDescription:'Academic Gear Pertanian berupa benih + daun + DNA; modern dan tidak memakai alat pertanian.',
    specialAttacks: GLOBAL_SEMESTER_SKILLS,
    majors:[
      { id:'agroteknologi', name:'Agroteknologi', level:'S1', degree:'S.P.' },
      { id:'agribisnis', name:'Agribisnis', level:'S1', degree:'S.P.' },
      { id:'teknologi-pangan', name:'Teknologi Pangan / Hasil Pertanian', level:'S1', degree:'S.T.P.' }
    ]
  },
  socialPolitics: {
    id:'socialPolitics',
    name:'Fakultas Ilmu Sosial dan Ilmu Politik',
    shortName:'FISIP',
    color:'#D88200',
    tool:'Megafon',
    icon:'📣',
    skill:'Belajar Dasar',
    skillDescription:'Academic Gear FISIP tetap megafon sebagai simbol gagasan, komunikasi, dan suara publik.',
    specialAttacks: GLOBAL_SEMESTER_SKILLS,
    majors:[
      { id:'ilmu-politik', name:'Ilmu Politik', level:'S1', degree:'S.Sos.' },
      { id:'hukum-bisnis', name:'Hukum Bisnis', level:'S1', degree:'S.H.' }
    ]
  }
};
