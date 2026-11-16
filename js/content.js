const INTRO_STORY = [
  { speaker:'Narator', portrait:'none', text:'Satu langkah masuk kampus, dan sebuah perjalanan baru dimulai.' },
  { speaker:'Dosen Pembimbing', portrait:'advisor', expression:'smile', text:'Selamat datang, {{playerName}}. Pilih fakultasmu dulu, lalu tentukan jurusan yang akan menjadi bagian dari perjalanan ini.' }
];

const AFTER_FACULTY_STORY = [
  { speaker:'Dosen Pembimbing', portrait:'advisor', expression:'smile', text:'Jadi kamu memilih {{major}} — {{level}}, di {{faculty}}.' },
  { speaker:'Dosen Pembimbing', portrait:'advisor', expression:'approve', text:'Academic Gear-mu adalah {{tool}}. Skill semester tetap berkembang bersama perjalanan kuliahmu.' },
  { speaker:'{{playerName}}', portrait:'player', expression:'happy', text:'Siap. Kita mulai dari Semester 1.' }
];

const PRE_BOSS_STORY = [
  { speaker:'Dosen Pembimbing', portrait:'advisor', expression:'serious', text:'{{playerName}}, kita sudah sampai di depan ruang sidang.' },
  { speaker:'Dosen Pembimbing', portrait:'advisor', expression:'smile', text:'Nggak perlu buru-buru. Dengarkan pertanyaannya, jawab dengan tenang, dan pakai bahasamu sendiri.' }
];

const ACC_STORY = [
  { speaker:'Ketua Sidang', portrait:'examiner', expression:'smile', text:'Baik. Kami rasa cukup.' },
  { speaker:'Narator', portrait:'none', text:'Beberapa detik terasa jauh lebih lama dari seharusnya.' },
  { speaker:'Ketua Sidang', portrait:'examiner', expression:'approve', text:'Berdasarkan hasil sidang hari ini... selamat. Kamu dinyatakan lulus.' },
  { speaker:'Dosen Pembimbing', portrait:'advisor', expression:'smile', text:'Akhirnya. Selamat ya, {{playerName}}.' },
  { speaker:'{{playerName}}', portrait:'player', expression:'happy', text:'Alhamdulillah... akhirnya sampai juga.' }
];
