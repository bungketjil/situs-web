const layar = document.getElementById("layar");
const riwayat = document.getElementById("riwayat");
const tombolWadah = document.getElementById("tombolWadah");

let sekarang = "0";
let sebelumnya = null;
let operator = null;
let resetLayar = false;
let teksRiwayat = "";

function perbarui() {
  layar.textContent = sekarang;
  riwayat.textContent = teksRiwayat;
}

function hitung(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  let hasil;
  if (op === "+") hasil = a + b;
  if (op === "-") hasil = a - b;
  if (op === "×") hasil = a * b;
  if (op === "÷") {
    if (b === 0) return "Error";
    hasil = a / b;
  }
  return String(Math.round(hasil * 1e10) / 1e10);
}

function tekanAngka(nilai) {
  if (sekarang === "0" || resetLayar) {
    sekarang = nilai;
    resetLayar = false;
  } else {
    sekarang += nilai;
  }
}

function tekanTitik() {
  if (resetLayar) {
    sekarang = "0.";
    resetLayar = false;
  } else if (!sekarang.includes(".")) {
    sekarang += ".";
  }
}

function tekanOperator(nilai) {
  if (sekarang === "Error") return;

  if (operator !== null && !resetLayar) {
    sekarang = hitung(sebelumnya, sekarang, operator);
  }
  sebelumnya = sekarang;
  operator = nilai;
  resetLayar = true;
  teksRiwayat = sebelumnya + " " + operator;
}

function tekanSama() {
  if (operator === null || sekarang === "Error") return;

  teksRiwayat = sebelumnya + " " + operator + " " + sekarang + " =";
  sekarang = hitung(sebelumnya, sekarang, operator);
  operator = null;
  resetLayar = true;
}

function hapusSemua() {
  sekarang = "0";
  sebelumnya = null;
  operator = null;
  resetLayar = false;
  teksRiwayat = "";
}
function hapusSatu() {
  if (sekarang === "Error" || resetLayar) return;

  sekarang = sekarang.slice(0, -1);

  if (sekarang === "" || sekarang === "-") {
    sekarang = "0";
}
}


tombolWadah.addEventListener("click", function (e) {
  const tombol = e.target;
  const aksi = tombol.dataset.aksi;
  if (!aksi) return;

  if (aksi === "angka") tekanAngka(tombol.dataset.nilai);
  if (aksi === "titik") tekanTitik();
  if (aksi === "operator") tekanOperator(tombol.dataset.nilai);
  if (aksi === "sama") tekanSama();
  if (aksi === "hapus") hapusSemua();
  if (aksi === "mundur") hapusSatu();

  perbarui();
});

perbarui();



function efekTombol(tombol) {
  if (!tombol) return;
  tombol.classList.add("ditekan");
  setTimeout(function () {
    tombol.classList.remove("ditekan");
  }, 120);
}

function cariTombol(k) {
  if (k >= "0" && k <= "9") return document.querySelector('[data-aksi="angka"][data-nilai="' + k + '"]');
  if (k === "." || k === ",") return document.querySelector('[data-aksi="titik"]');
  if (k === "+" || k === "-") return document.querySelector('[data-aksi="operator"][data-nilai="' + k + '"]');
  if (k === "*") return document.querySelector('[data-nilai="×"]');
  if (k === "/") return document.querySelector('[data-nilai="÷"]');
  if (k === "Enter" || k === "=") return document.querySelector('[data-aksi="sama"]');
  if (k === "Backspace") return document.querySelector('[data-aksi="mundur"]');
  if (k === "Escape" || k === "c" || k === "C") return document.querySelector('[data-aksi="hapus"]');
  return null;
}

document.addEventListener("keydown", function (e) {
  const k = e.key;

  if (k >= "0" && k <= "9") tekanAngka(k);
  else if (k === "." || k === ",") tekanTitik();
  else if (k === "+" || k === "-") tekanOperator(k);
  else if (k === "*") tekanOperator("×");
  else if (k === "/") tekanOperator("÷");
  else if (k === "Enter" || k === "=") {
    e.preventDefault();
    tekanSama();
  }
  else if (k === "Backspace") hapusSatu();
  else if (k === "Escape" || k === "c" || k === "C") hapusSemua();
  else return;
    efekTombol(cariTombol(k));

  perbarui();
});