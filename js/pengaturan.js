/* =========================================================
   PENGATURAN TOKO CAMELIA
   Ubah isi di antara tanda kutip "..." saja.
   ========================================================= */

const PENGATURAN = {
  namaToko: "Camelia",

  /* NOMOR WHATSAPP PESANAN  <-- ISI DI SINI
     Awali dengan 62, tanpa +, spasi, atau strip.
     Contoh: nomor 0812-3456-7890 ditulis "6281234567890" */
  nomorWhatsApp: "087789160085",

  /* Username Instagram tanpa tanda @ */
  instagram: "cameliastore",

  email: "cameliastore@gmail.com",

  /* Foto model di bagian paling atas (rasio tegak 4:5) */
  fotoUtama: "images/produk/heels/heels-5.jpg",

  /* Galeri foto model (dinonaktifkan) */
  galeri: [],

  /* Kategori produk. "id" dipakai di js/produk.js */
  kategori: [
    { id: "heels", nama: "Heels" },
    { id: "flatshoes", nama: "Flatshoes" }
  ],

  /* Tabel ukuran: panjang telapak kaki dalam cm.
     Angka ini perkiraan umum, sesuaikan dengan ukuran dari supplier. */
  tabelUkuran: [
    { ukuran: 36, min: 22.5, maks: 23.0 },
    { ukuran: 37, min: 23.1, maks: 23.5 },
    { ukuran: 38, min: 23.6, maks: 24.0 },
    { ukuran: 39, min: 24.1, maks: 24.5 },
    { ukuran: 40, min: 24.6, maks: 25.0 }
  ],

  /* Batas jumlah pasang untuk satu pilihan */
  maksimalJumlah: 20
};
