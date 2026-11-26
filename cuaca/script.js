const inputKota = document.getElementById("inputKota");
const tombolCari = document.getElementById("tombolCari");
const tombolLokasi = document.getElementById("tombolLokasi");
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

function namaHari(tanggal, index) {
  if (index === 0) return "Hari ini";
  if (index === 1) return "Besok";
  return new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long"
  });
}

function namaLengkap(tempat) {
  return [tempat.name, tempat.admin3, tempat.admin2, tempat.admin1]
    .filter(Boolean)
    .filter(function (nilai, i, arr) {
      return arr.indexOf(nilai) === i;
    })
    .join(", ");
}

async function cariCuaca() {
  const kota = inputKota.value.trim();
  if (kota === "") return;

  hasil.textContent = "Memuat...";

  try {
    const url =
      "https://geocoding-api.open-meteo.com/v1/search?count=10&language=id&name=" +
      encodeURIComponent(kota);
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) {
      hasil.textContent = "Lokasi tidak ditemukan.";
      return;
    }

    tampilkanDaftar(data.results);
  } catch (error) {
    hasil.textContent = "Gagal mengambil data. Cek koneksi internetmu.";
  }
}

function tampilkanDaftar(daftar) {
  hasil.innerHTML = "";

  const judul = document.createElement("p");
  judul.textContent = "Pilih lokasi:";
  hasil.appendChild(judul);

  daftar.forEach(function (tempat) {
    const tombol = document.createElement("button");
    tombol.className = "pilihan-lokasi";
    tombol.textContent = namaLengkap(tempat) + " (" + tempat.country + ")";
    tombol.addEventListener("click", function () {
      tampilkanCuaca(tempat, namaLengkap(tempat));
    });
    hasil.appendChild(tombol);
  });
}

async function tampilkanCuaca(tempat, namaTampil) {
  hasil.textContent = "Memuat...";

  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      "&timezone=auto&forecast_days=3" +
      "&latitude=" + tempat.latitude +
      "&longitude=" + tempat.longitude;
    const res = await fetch(url);
    const data = await res.json();
    const sekarang = data.current;
    const harian = data.daily;

    let html =
      '<p class="kota">' + namaTampil + "</p>" +
      '<div class="suhu">' + Math.round(sekarang.temperature_2m) + "°C</div>" +
      "<p>" + artiKode(sekarang.weather_code) + "</p>" +
      '<div class="detail">' +
      "<span>Lembap: " + sekarang.relative_humidity_2m + "%</span>" +
      "<span>Angin: " + sekarang.wind_speed_10m + " km/j</span>" +
      "</div>" +
      '<div class="prakiraan">';

    harian.time.forEach(function (tanggal, i) {
      html +=
        '<div class="hari">' +
        "<span>" + namaHari(tanggal, i) + "</span>" +
        "<span>" + artiKode(harian.weather_code[i]) + "</span>" +
        "<span>" + Math.round(harian.temperature_2m_min[i]) + "° / " +
        Math.round(harian.temperature_2m_max[i]) + "°</span>" +
        "</div>";
    });

    html += "</div>";
    hasil.innerHTML = html;
  } catch (error) {
    hasil.textContent = "Gagal mengambil data. Cek koneksi internetmu.";
  }
}

function pakaiLokasiSaya() {
  if (!navigator.geolocation) {
    hasil.textContent = "Browser ini tidak mendukung lokasi.";
    return;
  }

  hasil.textContent = "Mencari lokasimu...";

  navigator.geolocation.getCurrentPosition(
    function (posisi) {
      tampilkanCuaca(
        { latitude: posisi.coords.latitude, longitude: posisi.coords.longitude },
        "Lokasimu saat ini"
      );
    },
    function () {
      hasil.textContent = "Izin lokasi ditolak atau lokasi tidak ditemukan.";
    }
  );
}

tombolCari.addEventListener("click", cariCuaca);
tombolLokasi.addEventListener("click", pakaiLokasiSaya);

inputKota.addEventListener("keydown", function (e) {
  if (e.key === "Enter") cariCuaca();
});