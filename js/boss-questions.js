const BOSS_QUESTIONS = [
  {
    examiner:'Penguji',
    lead:'Saya mulai dari yang sederhana dulu, ya.',
    question:'Kalau target sebuah tim tidak tercapai, menurut kamu apa yang pertama kali perlu dilakukan seorang manajer?',
    answers:[
      { text:'Evaluasi penyebabnya dulu, lalu sesuaikan strategi.', correct:true, response:'Ya. Pahami sumber masalahnya dulu sebelum menentukan tindakan berikutnya.' },
      { text:'Langsung ganti semua anggota tim.', correct:false, response:'Bisa terlalu cepat. Sebelum mengganti orang, kita perlu tahu dulu akar masalahnya.' },
      { text:'Tunggu saja, mungkin selesai sendiri.', correct:false, response:'Kalau hanya menunggu, masalahnya bisa makin besar. Evaluasi tetap perlu dilakukan.' }
    ]
  },
  {
    examiner:'Penguji',
    lead:'Oke. Sekarang soal kerja tim.',
    question:'Kalau ada satu anggota tim yang performanya menurun, pendekatan yang paling masuk akal apa?',
    answers:[
      { text:'Cari tahu penyebabnya dan komunikasikan solusi bersama.', correct:true, response:'Nah, itu. Komunikasi dan pemahaman situasi biasanya jadi langkah awal yang lebih sehat.' },
      { text:'Diamkan saja supaya belajar sendiri.', correct:false, response:'Kadang orang memang perlu ruang, tapi sebagai tim kita tetap perlu komunikasi.' },
      { text:'Langsung keluarkan dari kelompok.', correct:false, response:'Itu keputusan besar. Lebih baik pahami kondisinya dulu sebelum mengambil langkah sejauh itu.' }
    ]
  },
  {
    examiner:'Ketua Sidang',
    lead:'Baik. Pertanyaan terakhir, santai saja.',
    question:'Setelah lulus nanti... kamu masih akan bilang “nanti dulu” kalau ada deadline?',
    answers:[
      { text:'Saya akan mencoba lebih disiplin.', correct:true, response:'Jawaban yang aman. Saya catat sebagai niat baik.' },
      { text:'Tidak janji, Pak.', correct:true, response:'Setidaknya jujur. Semoga praktiknya lebih baik dari jawabannya.' },
      { text:'Deadline adalah bagian dari kehidupan.', correct:true, response:'...Saya tidak bisa membantah itu.' }
    ]
  }
];
