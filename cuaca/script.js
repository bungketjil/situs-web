const inputKota = document.getElementById("inputKota");
const tombolCari = document.getElementById("tombolCari");
const hasil = document.getElementById("hasil");

function artiKode(kode) {
  if (kode === 0) return "Cerah";
  if (kode <= 3) return "Berawan";
  if (kode <= 48) return "Berkabut";
  if (kode <= 67) return "Hujan";
  if (kode <= 77) return "Salju";
  if (kode <= 82) return "Hujan lebat";
  return "Badai petir";
}

async function cariCuaca() {
  const kota = inputKota.value.trim();
  if (kota === "") return;

  hasil.textContent = "Memuat...";

  try {
    // 1. Ubah nama kota menjadi koordinat
    const urlKota =
      "https://geocoding-api.open-meteo.com/v1/search?count=1&language=id&name=" +
      encodeURIComponent(kota);
    const resKota = await fetch(urlKota);
    const dataKota = await resKota.json();

    if (!dataKota.results) {
      hasil.textContent = "Kota tidak ditemukan.";
      return;
    }

    const tempat = dataKota.results[0];

    // 2. Ambil cuaca berdasarkan koordinat
    const urlCuaca =
      "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
      "&latitude=" + tempat.latitude +
      "&longitude=" + tempat.longitude;
    const resCuaca = await fetch(urlCuaca);
    const dataCuaca = await resCuaca.json();
    const sekarang = dataCuaca.current;

    // 3. Tampilkan
    hasil.innerHTML =
      '<p class="kota">' + tempat.name + ", " + tempat.country + "</p>" +
      '<div class="suhu">' + Math.round(sekarang.temperature_2m) + "°C</div>" +
      "<p>" + artiKode(sekarang.weather_code) + "</p>" +
      '<div class="detail">' +
      "<span>Lembap: " + sekarang.relative_humidity_2m + "%</span>" +
      "<span>Angin: " + sekarang.wind_speed_10m + " km/j</span>" +
      "</div>";
  } catch (error) {
    hasil.textContent = "Gagal mengambil data. Cek koneksi internetmu.";
  }
}

tombolCari.addEventListener("click", cariCuaca);

inputKota.addEventListener("keydown", function (e) {
  if (e.key === "Enter") cariCuaca();
});