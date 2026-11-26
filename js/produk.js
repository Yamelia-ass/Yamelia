/* =========================================================
   DAFTAR PRODUK CAMELIA

   CARA MENAMBAH SEPATU BARU (3 langkah):
   1. Taruh foto di images/produk/heels  atau  images/produk/flatshoes
      Nama file: huruf kecil, tanpa spasi, contoh  heels-7.jpg
   2. Salin SATU baris produk di bawah, tempel di bawah baris terakhir
   3. Ganti nama, harga, gambar, dan warna. Pastikan "id" belum dipakai.
      Tiap baris produk harus diakhiri koma, kecuali yang terakhir.

   Keterangan:
   id        : harus berbeda untuk tiap produk
   kategori  : "heels" atau "flatshoes"
   harga     : angka saja tanpa titik (175000 = Rp175.000)
   tinggiHak : tinggi hak, contoh "9 cm"
   label     : tulisan kecil di foto ("Baru", "Terlaris"), kosongkan "" jika tidak perlu
   gambar    : 1 foto untuk produk ini (nama file harus PERSIS sama)
   warna     : daftar pilihan warna. Cukup tulis nama warnanya.
               Warna yang dikenal otomatis: Hitam, Putih, Putih Tulang, Krem, Nude, Cokelat,
               Marun, Merah, Pink, Blush, Biru, Navy, Hijau, Abu-abu, Emas, Perak, Kuning, Ungu.
               Warna lain tetap bisa dipakai: tulis { nama: "Tosca", kode: "#40b5ad" }
   ukuran    : (opsional) ukuran: [36, 38, 39] jika stok hanya ukuran tertentu.
               Tanpa baris ini = semua ukuran 36-40.
   ========================================================= */

const PRODUK = [
  /* ---------- HEELS ---------- */
  { id: "heels-1", nama: "Heels Anindya", kategori: "heels", harga: 189000, tinggiHak: "8 cm", label: "Baru",
    gambar: "images/produk/heels/heels-1.jpg",
    deskripsi: "Pumps runcing dengan detail renda yang elegan. Cocok untuk pesta dan acara spesial.",
    warna: ["Putih", "Krem", "Hitam"] },

  { id: "heels-2", nama: "Heels Dewi", kategori: "heels", harga: 185000, tinggiHak: "7 cm", label: "",
    gambar: "images/produk/heels/heels-2.jpg",
    deskripsi: "Pumps runcing dengan gesper kecil di sisi. Tampil tegas dan rapi untuk kerja.",
    warna: ["Hitam", "Marun"] },

  { id: "heels-3", nama: "Heels Sekar", kategori: "heels", harga: 205000, tinggiHak: "10 cm", label: "Terlaris",
    gambar: "images/produk/heels/heels-3.jpg",
    deskripsi: "Sandal heels bertali silang dengan ujung kotak yang modern.",
    warna: ["Hitam", "Nude"] },

  { id: "heels-4", nama: "Heels Ratna", kategori: "heels", harga: 195000, tinggiHak: "9 cm", label: "",
    gambar: "images/produk/heels/heels-4.jpg",
    deskripsi: "Slingback stiletto mengilap dengan hak ramping.",
    warna: ["Marun", "Hitam"] },

  { id: "heels-5", nama: "Heels Larasati", kategori: "heels", harga: 199000, tinggiHak: "9 cm", label: "",
    gambar: "images/produk/heels/heels-5.jpg",
    deskripsi: "Slingback runcing berbahan renda dengan aksen emas di tali.",
    warna: ["Hitam", "Putih Tulang"] },

  { id: "heels-6", nama: "Heels Kirana", kategori: "heels", harga: 175000, tinggiHak: "9 cm", label: "",
    gambar: "images/produk/heels/heels-6.jpg",
    deskripsi: "Block heel dengan tali di pergelangan kaki. Hak tebal, stabil, nyaman dipakai berdiri lebih lama.",
    warna: ["Putih", "Hitam", "Nude"] },

  /* ---------- FLATSHOES ---------- */
  { id: "flat-1", nama: "Flatshoes Nadira", kategori: "flatshoes", harga: 129000, tinggiHak: "1 cm", label: "",
    gambar: "images/produk/flatshoes/flatshoes-1.jpg",
    deskripsi: "Mary Jane motif kotak-kotak yang manis, ringan dan empuk untuk harian.",
    warna: ["Pink", "Biru"] },

  { id: "flat-2", nama: "Flatshoes Melati", kategori: "flatshoes", harga: 135000, tinggiHak: "1 cm", label: "",
    gambar: "images/produk/flatshoes/flatshoes-2.jpg",
    deskripsi: "Balet mengilap dengan hiasan mutiara kecil di bagian depan.",
    warna: ["Pink", "Putih", "Nude"] },

  { id: "flat-3", nama: "Flatshoes Rania", kategori: "flatshoes", harga: 155000, tinggiHak: "3 cm", label: "",
    gambar: "images/produk/flatshoes/flatshoes-3.jpg",
    deskripsi: "Balet hitam mengilap dengan pita dan hak kecil yang nyaman untuk kerja.",
    warna: ["Hitam", "Marun"] },

  { id: "flat-4", nama: "Flatshoes Gendis", kategori: "flatshoes", harga: 139000, tinggiHak: "1,5 cm", label: "Baru",
    gambar: "images/produk/flatshoes/flatshoes-4.jpg",
    deskripsi: "Model Mary Jane mengilap dengan tali di punggung kaki dan pita kecil.",
    warna: ["Marun", "Hitam", "Pink"] },

  { id: "flat-5", nama: "Flatshoes Wulan", kategori: "flatshoes", harga: 149000, tinggiHak: "1 cm", label: "Terlaris",
    gambar: "images/produk/flatshoes/flatshoes-5.jpg",
    deskripsi: "Flatshoes ujung kotak dua warna dengan pita hitam yang manis.",
    warna: ["Krem", "Putih"] },

  { id: "flat-6", nama: "Flatshoes Ayunda", kategori: "flatshoes", harga: 145000, tinggiHak: "1 cm", label: "",
    gambar: "images/produk/flatshoes/flatshoes-6.jpg",
    deskripsi: "Balet lembut dengan pita kecil, tampil rapi dan nyaman seharian.",
    warna: ["Blush", "Hitam", "Putih"] }
];
