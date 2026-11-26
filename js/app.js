/* =========================================================
   CAMELIA - Fungsi toko
   Biasanya file ini TIDAK perlu diubah.
   Ubah data di js/pengaturan.js dan js/produk.js saja.
   ========================================================= */
(function () {
  "use strict";

  const KUNCI_SIMPAN = "camelia-keranjang";
  const $ = (id) => document.getElementById(id);

  /* ---------- Cek file data ---------- */
  if (typeof PENGATURAN === "undefined" || typeof PRODUK === "undefined") {
    $("daftarProduk").innerHTML =
      "<p>Produk gagal dimuat. Periksa tanda koma, kurung, dan kutip di js/produk.js atau js/pengaturan.js.</p>";
    return;
  }

  /* ---------- Rapikan data produk ----------
     Warna boleh ditulis nama saja ("Hitam"). Foto cukup 1 per produk (gambar). */
  const KODE_WARNA = {
    "hitam": "#2b2528", "putih": "#f4f1ec", "putih tulang": "#e9dfd0", "krem": "#efe6d3",
    "nude": "#d3a58c", "cokelat": "#8a5a44", "coklat": "#8a5a44", "marun": "#7d1f35",
    "merah": "#c0262d", "pink": "#e79bb0", "blush": "#e8c4c4", "biru": "#5b86c4",
    "navy": "#1f2d54", "hijau": "#4f7a5a", "abu-abu": "#9a9598", "emas": "#c9a24a",
    "perak": "#c3c3c8", "kuning": "#e8c64a", "ungu": "#7d5aa6"
  };
  PRODUK.forEach((p) => {
    p.warna = (p.warna || []).map((w) => typeof w === "string"
      ? { nama: w, kode: KODE_WARNA[w.toLowerCase()] || "#cccccc" }
      : { kode: KODE_WARNA[String(w.nama).toLowerCase()] || "#cccccc", ...w });
    if (!p.gambar && p.warna[0] && p.warna[0].gambar) p.gambar = p.warna[0].gambar;
  });

  /* ---------- Fungsi bantu ---------- */
  const rupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");
  const angkaCm = (n) => n.toLocaleString("id-ID", { minimumFractionDigits: 1 });
  const aman = (teks) =>
    String(teks).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cariProduk = (id) => PRODUK.find((p) => p.id === id);
  const cariWarna = (produk, nama) => produk.warna.find((w) => w.nama === nama);
  const semuaUkuran = PENGATURAN.tabelUkuran.map((u) => u.ukuran);
  const ukuranTersedia = (p) => p.ukuran || semuaUkuran;
  const namaKategori = (id) => (PENGATURAN.kategori.find((k) => k.id === id) || { nama: id }).nama;
  const fotoProduk = (p, w) => (w && w.gambar) || p.gambar;

  function nomorWa() {
    let n = String(PENGATURAN.nomorWhatsApp);
    if (/[a-z]/i.test(n)) return "";
    n = n.replace(/\D/g, "");
    if (n.startsWith("0")) n = "62" + n.slice(1);
    return n.length >= 10 ? n : "";
  }

  /* Gambar yang tidak ditemukan diganti kotak berisi nama file */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName !== "IMG" || img.dataset.gagal || !img.getAttribute("src")) return;
    img.dataset.gagal = "1";
    const nama = aman(img.getAttribute("src").split("/").pop());
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<rect width="400" height="400" fill="#f3cbd3"/><g font-family="Arial" text-anchor="middle" fill="#24191c">' +
      '<text x="200" y="190" font-size="22">Foto belum ada</text><text x="200" y="225" font-size="17">' + nama + "</text></g></svg>";
    img.src = "data:image/svg+xml," + encodeURIComponent(svg);
  }, true);

  function pasangFoto(img, src, alt) {
    delete img.dataset.gagal;
    img.src = src;
    img.alt = alt;
  }

  /* ---------- Dialog ---------- */
  function buka(dialog) {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("terkunci");
  }
  document.querySelectorAll("dialog").forEach((d) => {
    d.addEventListener("close", () => {
      if (!document.querySelector("dialog[open]")) document.body.classList.remove("terkunci");
    });
    d.addEventListener("click", (e) => {
      if (e.target.closest("[data-tutup]")) return d.close();
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
      }
    });
  });

  /* ---------- Menu HP ---------- */
  const tombolMenu = $("tombolMenu");
  function aturMenu(terbuka) {
    $("menu").classList.toggle("buka", terbuka);
    tombolMenu.setAttribute("aria-expanded", terbuka);
    tombolMenu.setAttribute("aria-label", terbuka ? "Tutup menu" : "Buka menu");
  }
  tombolMenu.addEventListener("click", () => aturMenu(!$("menu").classList.contains("buka")));
  $("menu").addEventListener("click", (e) => { if (e.target.tagName === "A") aturMenu(false); });

  /* ---------- Daftar produk ---------- */
  let kategoriAktif = "semua";

  function tampilkanKategori() {
    const daftar = [{ id: "semua", nama: "Semua" }, ...PENGATURAN.kategori];
    $("saringKategori").innerHTML = daftar.map((k) =>
      `<button type="button" data-kategori="${aman(k.id)}" aria-pressed="${k.id === kategoriAktif}">${aman(k.nama)}</button>`
    ).join("");
  }

  function tampilkanProduk() {
    const hasil = PRODUK.filter((p) =>
      (kategoriAktif === "semua" || p.kategori === kategoriAktif));

    $("daftarProduk").innerHTML = hasil.map((p) => `
      <article class="produk">
        <button type="button" class="produk-foto" data-produk="${aman(p.id)}" aria-label="Pilih ${aman(p.nama)}">
          <img src="${aman(fotoProduk(p))}" alt="${aman(p.nama)}" loading="lazy">
          ${p.label ? `<span class="label">${aman(p.label)}</span>` : ""}
        </button>
        <h3>${aman(p.nama)}</h3>
        <p class="info">${aman(namaKategori(p.kategori))}${p.tinggiHak ? ", hak " + aman(p.tinggiHak) : ""}</p>
        <p class="harga">${rupiah(p.harga)}</p>
        <div class="titik-warna" aria-label="Warna: ${aman(p.warna.map((w) => w.nama).join(", "))}">
          ${p.warna.map((w) => `<span class="titik" style="background:${aman(w.kode)}" title="${aman(w.nama)}"></span>`).join("")}
        </div>
        <button type="button" class="tombol tombol-utama" data-produk="${aman(p.id)}">Pilih sepatu</button>
      </article>`).join("");

    $("produkKosong").hidden = hasil.length > 0;
    $("produkKosong").textContent = "Belum ada sepatu di kategori ini.";
  }

  $("saringKategori").addEventListener("click", (e) => {
    const t = e.target.closest("[data-kategori]");
    if (!t) return;
    kategoriAktif = t.dataset.kategori;
    tampilkanKategori();
    tampilkanProduk();
  });
  $("daftarProduk").addEventListener("click", (e) => {
    const t = e.target.closest("[data-produk]");
    if (t) bukaPilihan(t.dataset.produk);
  });

  /* ---------- Tabel ukuran ---------- */
  const barisUkuran = () => PENGATURAN.tabelUkuran.map((u) =>
    `<tr data-ukuran="${u.ukuran}"><td>${u.ukuran}</td><td>${angkaCm(u.min)} – ${angkaCm(u.maks)} cm</td></tr>`).join("");

  $("formUkur").addEventListener("submit", (e) => {
    e.preventDefault();
    const cm = Number($("panjangKaki").value.trim().replace(",", "."));
    const hasil = $("hasilUkur");
    const tabel = PENGATURAN.tabelUkuran;
    document.querySelectorAll("#tabelUtama tr").forEach((r) => r.classList.remove("cocok"));
    if (!cm || cm < 10 || cm > 40) {
      hasil.textContent = "Isi panjang kaki dalam cm, contoh 23,8.";
      return;
    }
    const bulat = Math.round(cm * 10) / 10;
    // kaki yang jauh lebih pendek dari ukuran terkecil tidak disarankan
    const cocok = bulat >= tabel[0].min - 0.5 && tabel.find((u) => bulat <= u.maks);
    if (cocok) {
      hasil.textContent = `Ukuran yang disarankan: ${cocok.ukuran}`;
      document.querySelector(`#tabelUtama tr[data-ukuran="${cocok.ukuran}"]`).classList.add("cocok");
    } else {
      hasil.textContent = "Panjang kaki ini di luar tabel. Tanyakan ke admin lewat WhatsApp.";
    }
  });

  /* ---------- Pilih sepatu bertahap ---------- */
  let pilihan = null; // { produk, tahap, warna, ukuran, jumlah }

  function bukaPilihan(id) {
    const produk = cariProduk(id);
    pilihan = { produk, tahap: 0, warna: null, ukuran: null, jumlah: 1 };
    $("namaPilih").textContent = produk.nama;
    $("hargaPilih").textContent = rupiah(produk.harga);
    $("deskripsiPilih").textContent = produk.deskripsi || "";
    pasangFoto($("fotoPilih"), fotoProduk(produk), produk.nama);
    tampilkanTahap();
    buka($("jendelaProduk"));
    $("jendelaProduk").scrollTop = 0;
  }

  // jumlah pasang yang sama persis dan sudah ada di keranjang
  function sudahDiKeranjang() {
    const ada = keranjang.find((i) => i.id === pilihan.produk.id && i.warna === pilihan.warna && i.ukuran === pilihan.ukuran);
    return ada ? ada.jumlah : 0;
  }

  function tampilkanTahap() {
    const { produk, tahap, warna, ukuran } = pilihan;
    const panel = $("panelPilih");
    $("salahPilih").textContent = "";
    $("jendelaProduk").classList.toggle("lanjutan", tahap > 0);
    [...$("penandaTahap").children].forEach((li, i) => {
      li.className = i < tahap ? "selesai" : i === tahap ? "aktif" : "";
    });

    if (tahap === 0) {
      panel.innerHTML = `<h3>Mau warna apa?</h3><div class="pilihan">${produk.warna.map((w) => `
        <button type="button" class="opsi" data-warna="${aman(w.nama)}" aria-pressed="${w.nama === warna}">
          <span class="titik" style="background:${aman(w.kode)}"></span>${aman(w.nama)}
        </button>`).join("")}</div>`;
    } else if (tahap === 1) {
      const ada = ukuranTersedia(produk);
      panel.innerHTML = `<h3>Pilih ukuran</h3><div class="pilihan">${semuaUkuran.map((u) => `
        <button type="button" class="opsi" data-ukuran="${u}" aria-pressed="${u === ukuran}" ${ada.includes(u) ? "" : "disabled"}>${u}</button>`).join("")}</div>
        <details><summary>Lihat tabel ukuran (cm)</summary>
          <div class="bingkai-tabel"><table class="tabel">
            <thead><tr><th>Ukuran</th><th>Panjang kaki</th></tr></thead><tbody>${barisUkuran()}</tbody>
          </table></div>
        </details>`;
    } else {
      const sisa = PENGATURAN.maksimalJumlah - sudahDiKeranjang();
      pilihan.jumlah = Math.min(pilihan.jumlah, Math.max(sisa, 1));
      const n = pilihan.jumlah;
      panel.innerHTML = `<h3>Mau beli berapa pasang?</h3>
        <div class="jumlah">
          <button type="button" data-ubah="-1" aria-label="Kurangi" ${n <= 1 ? "disabled" : ""}>−</button>
          <output>${n}</output>
          <button type="button" data-ubah="1" aria-label="Tambah" ${n >= sisa ? "disabled" : ""}>+</button>
        </div>
        <dl class="rincian">
          <dt>Warna</dt><dd>${aman(warna)}</dd>
          <dt>Ukuran</dt><dd>${ukuran}</dd>
          <dt>Subtotal</dt><dd>${rupiah(produk.harga * n)}</dd>
        </dl>`;
      if (sisa <= 0) {
        $("salahPilih").textContent = `Pilihan ini sudah ${PENGATURAN.maksimalJumlah} pasang di keranjang (batas maksimal).`;
      }
    }

    $("tahapKembali").textContent = "Kembali";
    $("tahapKembali").hidden = tahap === 0;
    $("tahapLanjut").textContent = tahap === 2 ? "Tambah ke keranjang" : "Lanjut";
    $("tahapLanjut").disabled = tahap === 2 && sudahDiKeranjang() >= PENGATURAN.maksimalJumlah;
  }

  function tampilkanBerhasil() {
    const { produk, warna, ukuran, jumlah } = pilihan;
    pilihan.tahap = 3;
    [...$("penandaTahap").children].forEach((li) => (li.className = "selesai"));
    $("panelPilih").innerHTML = `<div class="berhasil" role="status">
      <h3>Masuk keranjang</h3>
      <p>${aman(produk.nama)}, ${aman(warna)}, ukuran ${ukuran}, ${jumlah} pasang.</p></div>`;
    $("tahapKembali").hidden = false;
    $("tahapKembali").textContent = "Belanja lagi";
    $("tahapLanjut").textContent = "Lihat keranjang";
    $("tahapLanjut").focus();
  }

  $("panelPilih").addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.warna) {
      pilihan.warna = t.dataset.warna;
      pasangFoto($("fotoPilih"), fotoProduk(pilihan.produk, cariWarna(pilihan.produk, pilihan.warna)),
        `${pilihan.produk.nama} warna ${pilihan.warna}`);
    } else if (t.dataset.ukuran) {
      pilihan.ukuran = Number(t.dataset.ukuran);
    } else if (t.dataset.ubah) {
      pilihan.jumlah += Number(t.dataset.ubah);
      tampilkanTahap();
      const lagi = $("panelPilih").querySelector(`[data-ubah="${t.dataset.ubah}"]:not(:disabled)`);
      if (lagi) lagi.focus();
      return;
    }
    $("panelPilih").querySelectorAll(".opsi").forEach((o) => o.setAttribute("aria-pressed", o === t));
    $("salahPilih").textContent = "";
  });

  $("tahapKembali").addEventListener("click", () => {
    if (pilihan.tahap === 3) return $("jendelaProduk").close();
    pilihan.tahap -= 1;
    tampilkanTahap();
  });

  $("tahapLanjut").addEventListener("click", () => {
    const { tahap, warna, ukuran } = pilihan;
    if (tahap === 3) {
      $("jendelaProduk").close();
      return bukaKeranjang();
    }
    if (tahap === 0 && !warna) return ($("salahPilih").textContent = "Pilih warna dulu.");
    if (tahap === 1 && !ukuran) return ($("salahPilih").textContent = "Pilih ukuran dulu.");
    if (tahap < 2) {
      pilihan.tahap += 1;
      return tampilkanTahap();
    }
    tambahKeKeranjang();
    tampilkanBerhasil();
  });

  /* ---------- Keranjang ---------- */
  let keranjang = muatKeranjang();

  function muatKeranjang() {
    try {
      const data = JSON.parse(localStorage.getItem(KUNCI_SIMPAN)) || [];
      // buang barang yang produk, warna, atau ukurannya sudah tidak ada
      return data.filter((i) => {
        const p = cariProduk(i.id);
        return p && cariWarna(p, i.warna) && ukuranTersedia(p).includes(i.ukuran) &&
          Number.isInteger(i.jumlah) && i.jumlah > 0;
      });
    } catch (e) {
      return [];
    }
  }

  function simpanKeranjang() {
    try { localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(keranjang)); } catch (e) { /* abaikan */ }
  }

  const totalHarga = () => keranjang.reduce((t, i) => t + cariProduk(i.id).harga * i.jumlah, 0);
  const totalPasang = () => keranjang.reduce((t, i) => t + i.jumlah, 0);

  function tambahKeKeranjang() {
    const { produk, warna, ukuran, jumlah } = pilihan;
    const ada = keranjang.find((i) => i.id === produk.id && i.warna === warna && i.ukuran === ukuran);
    if (ada) ada.jumlah = Math.min(ada.jumlah + jumlah, PENGATURAN.maksimalJumlah);
    else keranjang.push({ id: produk.id, warna, ukuran, jumlah });
    simpanKeranjang();
    tampilkanKeranjang();
  }

  function tampilkanKeranjang() {
    $("jumlahKeranjang").textContent = totalPasang();
    $("bawahKeranjang").hidden = keranjang.length === 0;
    $("totalKeranjang").textContent = rupiah(totalHarga());

    if (!keranjang.length) {
      $("isiKeranjang").innerHTML = `<div class="kosong-keranjang">
        <p>Keranjang masih kosong.</p>
        <button type="button" class="tombol tombol-utama" data-belanja>Pilih sepatu</button></div>`;
      return;
    }
    $("isiKeranjang").innerHTML = keranjang.map((i, n) => {
      const p = cariProduk(i.id);
      return `<div class="item">
        <img src="${aman(fotoProduk(p, cariWarna(p, i.warna)))}" alt="">
        <div>
          <h3>${aman(p.nama)}</h3>
          <p>Warna ${aman(i.warna)}, ukuran ${i.ukuran}</p>
          <p><strong>${rupiah(p.harga * i.jumlah)}</strong></p>
          <div class="item-bawah">
            <div class="jumlah">
              <button type="button" data-baris="${n}" data-ubah="-1" aria-label="Kurangi" ${i.jumlah <= 1 ? "disabled" : ""}>−</button>
              <output>${i.jumlah}</output>
              <button type="button" data-baris="${n}" data-ubah="1" aria-label="Tambah" ${i.jumlah >= PENGATURAN.maksimalJumlah ? "disabled" : ""}>+</button>
            </div>
            <button type="button" class="hapus" data-hapus="${n}">Hapus</button>
          </div>
        </div>
      </div>`;
    }).join("");
  }

  function keTahap(nama) {
    const judul = { Keranjang: "Keranjang", Data: "Data penerima", Periksa: "Periksa pesanan" };
    Object.keys(judul).forEach((k) => ($("tahap" + k).hidden = k !== nama));
    $("judulLaci").textContent = judul[nama];
  }

  function bukaKeranjang() {
    tampilkanKeranjang();
    keTahap("Keranjang");
    buka($("laciKeranjang"));
  }

  $("bukaKeranjang").addEventListener("click", bukaKeranjang);

  $("isiKeranjang").addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if ("belanja" in t.dataset) {
      $("laciKeranjang").close();
      $("koleksi").scrollIntoView();
      return;
    }
    if (t.dataset.hapus !== undefined) keranjang.splice(Number(t.dataset.hapus), 1);
    else if (t.dataset.ubah) keranjang[Number(t.dataset.baris)].jumlah += Number(t.dataset.ubah);
    simpanKeranjang();
    tampilkanKeranjang();
  });

  /* ---------- Data pembeli dan kirim WhatsApp ---------- */
  const formData = $("tahapData");
  const isian = (nama) => formData.elements[nama].value.trim();

  $("keData").addEventListener("click", () => { $("salahData").textContent = ""; keTahap("Data"); });
  $("dataKembali").addEventListener("click", () => keTahap("Keranjang"));
  $("periksaKembali").addEventListener("click", () => keTahap("Data"));

  formData.addEventListener("submit", (e) => {
    e.preventDefault();
    let salah = null;
    if (!isian("nama")) salah = ["nama", "Isi nama penerima."];
    else if (!/^\+?[\d\s-]+$/.test(isian("hp")) || isian("hp").replace(/\D/g, "").length < 9)
      salah = ["hp", "Isi nomor HP yang benar, minimal 9 angka."];
    else if (isian("alamat").length < 10) salah = ["alamat", "Isi alamat lengkap."];

    if (salah) {
      $("salahData").textContent = salah[1];
      formData.elements[salah[0]].focus();
      return;
    }
    $("salahData").textContent = "";
    tampilkanPeriksa();
    keTahap("Periksa");
  });

  function susunPesan() {
    const baris = keranjang.map((i, n) => {
      const p = cariProduk(i.id);
      return `${n + 1}. ${p.nama}\n   Warna: ${i.warna}\n   Ukuran: ${i.ukuran}\n   Jumlah: ${i.jumlah} pasang\n   Harga: ${rupiah(p.harga)}\n   Subtotal: ${rupiah(p.harga * i.jumlah)}`;
    });
    return [
      `Halo ${PENGATURAN.namaToko}, saya mau pesan:`, "",
      baris.join("\n\n"), "",
      `*Total: ${rupiah(totalHarga())}* (${totalPasang()} pasang, belum termasuk ongkir)`, "",
      "*Data penerima*",
      `Nama: ${isian("nama")}`,
      `No. HP: ${isian("hp")}`,
      `Alamat: ${isian("alamat")}`,
      isian("catatan") ? `Catatan: ${isian("catatan")}` : null,
      "", "Mohon info ongkir dan cara pembayarannya. Terima kasih."
    ].filter((b) => b !== null).join("\n");
  }

  function tampilkanPeriksa() {
    $("isiPeriksa").innerHTML = `
      <div class="bingkai-tabel">
        <table class="tabel tabel-pesanan">
          <thead><tr><th>Sepatu</th><th class="tengah">Uk.</th><th class="tengah">Jml</th><th class="kanan">Subtotal</th></tr></thead>
          <tbody>${keranjang.map((i) => {
            const p = cariProduk(i.id);
            return `<tr><td><strong>${aman(p.nama)}</strong><br>${aman(i.warna)}</td><td class="tengah">${i.ukuran}</td>
              <td class="tengah">${i.jumlah}</td><td class="kanan">${rupiah(p.harga * i.jumlah)}</td></tr>`;
          }).join("")}</tbody>
          <tfoot><tr><td colspan="2">Total</td><td class="tengah">${totalPasang()}</td><td class="kanan">${rupiah(totalHarga())}</td></tr></tfoot>
        </table>
      </div>
      <p class="catatan">Total belum termasuk ongkir.</p>
      <div class="data-penerima">
        <h3>Dikirim ke</h3>
        <p>${aman(isian("nama"))} (${aman(isian("hp"))})</p>
        <p>${aman(isian("alamat"))}</p>
        ${isian("catatan") ? `<p>Catatan: ${aman(isian("catatan"))}</p>` : ""}
      </div>`;

    $("salahKirim").textContent = "";
    const nomor = nomorWa();
    if (nomor) $("kirimWa").href = `https://wa.me/${nomor}?text=${encodeURIComponent(susunPesan())}`;
    else $("kirimWa").href = "#";
  }

  $("kirimWa").addEventListener("click", (e) => {
    if (!nomorWa()) {
      e.preventDefault();
      $("salahKirim").textContent = "Nomor WhatsApp toko belum diisi. Pemilik toko: isi di js/pengaturan.js.";
    }
  });

  $("kosongkan").addEventListener("click", () => {
    if (!confirm("Kosongkan semua isi keranjang?")) return;
    keranjang = [];
    simpanKeranjang();
    tampilkanKeranjang();
    keTahap("Keranjang");
  });

  /* ---------- Isi awal halaman ---------- */
  function isiHalaman() {
    pasangFoto($("fotoUtama"), PENGATURAN.fotoUtama, "Model memakai sepatu " + PENGATURAN.namaToko);

    if (PENGATURAN.galeri.length) {
      $("daftarGaleri").innerHTML = PENGATURAN.galeri.map((g) => `
        <figure><img src="${aman(g.gambar)}" alt="${aman(g.keterangan)}" loading="lazy">
        <figcaption>${aman(g.keterangan)}</figcaption></figure>`).join("");
    } else {
      $("galeri").hidden = true;
    }

    $("tabelUtama").innerHTML = barisUkuran();

    const ig = PENGATURAN.instagram.replace("@", "");
    $("kontakIg").href = "https://instagram.com/" + encodeURIComponent(ig);
    $("teksIg").textContent = "@" + ig;
    $("kontakEmail").href = "mailto:" + PENGATURAN.email;
    $("teksEmail").textContent = PENGATURAN.email;
    const nomor = nomorWa();
    if (nomor) {
      $("kontakWa").href = "https://wa.me/" + nomor;
      $("teksWa").textContent = "+" + nomor;
    } else {
      $("teksWa").textContent = "Nomor belum diisi";
    }

    $("tahun").textContent = new Date().getFullYear();
    tampilkanKategori();
    tampilkanProduk();
    tampilkanKeranjang();
  }

  isiHalaman();
})();
