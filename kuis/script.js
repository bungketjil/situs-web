const soal = [
  {
    tanya: "Bahasa apa yang mengatur tampilan (warna dan tata letak) website?",
    pilihan: ["HTML", "CSS", "JavaScript", "Git"],
    jawaban: 1
  },
  {
    tanya: "Kata kunci mana yang membuat variabel yang nilainya bisa berubah?",
    pilihan: ["const", "let", "function", "return"],
    jawaban: 1
  },
  {
    tanya: "Method apa yang dipakai untuk mengambil data dari API?",
    pilihan: ["push()", "slice()", "fetch()", "toggle()"],
    jawaban: 2
  },
  {
    tanya: "Perintah Git mana yang menyimpan 'foto' kondisi kode beserta catatan?",
    pilihan: ["git init", "git commit", "git push", "git add"],
    jawaban: 1
  },
  {
    tanya: "Bangsa mana yang dijuluki bangsa terkuat di muka bumi?",
    pilihan: ["Yunani", "Mongol", "Rongawi", "Viking"],
    jawaban: 2
  },
];

const elProgres = document.getElementById("progres");
const elPertanyaan = document.getElementById("pertanyaan");
const elPilihan = document.getElementById("pilihan");
const elUmpanBalik = document.getElementById("umpanBalik");
const elWaktu = document.getElementById("waktu");
const elRekor = document.getElementById("rekor");
const tombolLanjut = document.getElementById("tombolLanjut");

const BATAS_WAKTU = 10;

let urutan = [];
let nomor = 0;
let skor = 0;
let sudahMenjawab = false;
let sisaWaktu = BATAS_WAKTU;
let pewaktu = null;

// ---------- 1. Acak (Fisher-Yates) ----------
function acak(daftar) {
  const salinan = daftar.slice();
  for (let i = salinan.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const sementara = salinan[i];
    salinan[i] = salinan[j];
    salinan[j] = sementara;
  }
  return salinan;
}

// ---------- 3. Skor tertinggi ----------
function ambilRekor() {
  try {
    return parseInt(localStorage.getItem("rekorKuis")) || 0;
  } catch (e) {
    return 0;
  }
}

function simpanRekor(nilai) {
  try {
    localStorage.setItem("rekorKuis", nilai);
  } catch (e) {}
}

function tampilkanRekor() {
  elRekor.textContent = "Skor tertinggi: " + ambilRekor();
}

// ---------- 2. Timer ----------
function mulaiWaktu() {
  clearInterval(pewaktu);
  sisaWaktu = BATAS_WAKTU;
  perbaruiWaktu();

  pewaktu = setInterval(function () {
    sisaWaktu--;
    perbaruiWaktu();
    if (sisaWaktu <= 0) {
      clearInterval(pewaktu);
      waktuHabis();
    }
  }, 1000);
}

function perbaruiWaktu() {
  elWaktu.textContent = "Waktu: " + sisaWaktu + " detik";
  elWaktu.classList.toggle("genting", sisaWaktu <= 3);
}

function waktuHabis() {
  if (sudahMenjawab) return;
  sudahMenjawab = true;

  const s = urutan[nomor];
  const semuaOpsi = elPilihan.querySelectorAll(".opsi");
  semuaOpsi[s.jawaban].classList.add("benar");
  elUmpanBalik.textContent = "Waktu habis!";
  tampilkanTombolLanjut();
}

// ---------- Alur kuis ----------
function mulaiKuis() {
  urutan = acak(soal);
  nomor = 0;
  skor = 0;
  tampilkanRekor();
  tampilkanSoal();
}

function tampilkanSoal() {
  const s = urutan[nomor];
  sudahMenjawab = false;

  elProgres.textContent = "Soal " + (nomor + 1) + " dari " + urutan.length;
  elPertanyaan.textContent = s.tanya;
  elUmpanBalik.textContent = "";
  elPilihan.innerHTML = "";
  tombolLanjut.classList.add("sembunyi");

  s.pilihan.forEach(function (teks, index) {
    const tombol = document.createElement("button");
    tombol.className = "opsi";
    tombol.textContent = teks;
    tombol.addEventListener("click", function () {
      jawab(index, tombol);
    });
    elPilihan.appendChild(tombol);
  });

  mulaiWaktu();
}

function tampilkanTombolLanjut() {
  tombolLanjut.textContent =
    nomor === urutan.length - 1 ? "Lihat hasil" : "Lanjut";
  tombolLanjut.classList.remove("sembunyi");
}

function jawab(index, tombol) {
  if (sudahMenjawab) return;
  sudahMenjawab = true;
  clearInterval(pewaktu);

  const s = urutan[nomor];
  const semuaOpsi = elPilihan.querySelectorAll(".opsi");

  if (index === s.jawaban) {
    skor++;
    tombol.classList.add("benar");
    elUmpanBalik.textContent = "Benar!";
  } else {
    tombol.classList.add("salah");
    semuaOpsi[s.jawaban].classList.add("benar");
    elUmpanBalik.textContent = "Kurang tepat.";
  }

  tampilkanTombolLanjut();
}

function tampilkanHasil() {
  clearInterval(pewaktu);
  elWaktu.textContent = "";
  elProgres.textContent = "Selesai";
  elPertanyaan.textContent = "Skormu: " + skor + " dari " + urutan.length;
  elPilihan.innerHTML = "";

  if (skor > ambilRekor()) {
    simpanRekor(skor);
    elUmpanBalik.textContent = "Rekor baru! 🎉";
  } else {
    elUmpanBalik.textContent = "";
  }

  tampilkanRekor();
  tombolLanjut.textContent = "Ulangi";
  tombolLanjut.classList.remove("sembunyi");
}

tombolLanjut.addEventListener("click", function () {
  if (tombolLanjut.textContent === "Ulangi") {
    mulaiKuis();
    return;
  }

  nomor++;
  if (nomor < urutan.length) {
    tampilkanSoal();
  } else {
    tampilkanHasil();
  }
});

mulaiKuis();