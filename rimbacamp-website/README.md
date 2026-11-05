# RimbaCamp — Website Penyewaan Alat Camping

Project pembelajaran Web Programming (HTML, CSS, JavaScript) untuk tugas Task 01, Task 02, dan Task 03.

## Fitur demo
- Katalog perlengkapan camping.
- Pencarian produk, filter kategori, dan pengurutan harga.
- Cek ketersediaan berdasarkan rentang tanggal dan jumlah alat.
- Form pemesanan online.
- Riwayat pesanan berdasarkan nomor WhatsApp.
- Dashboard admin untuk melihat pesanan dan mengubah status.
- Responsive untuk desktop, tablet, dan mobile.

## Teknologi
- HTML5 semantic.
- CSS3 (Flexbox, Grid, media queries).
- JavaScript vanilla.
- localStorage untuk menyimpan data demo pada browser.

> Catatan: Ini adalah prototype front-end. Belum memakai database/server, autentikasi admin, payment gateway, atau WhatsApp API. Data pesanan tersimpan di browser masing-masing.

## Cara menjalankan di VS Code
1. Ekstrak ZIP project.
2. Buka VS Code.
3. Pilih **File → Open Folder**, lalu pilih folder `rimbacamp-website`.
4. Buka `index.html`.
5. Jalankan dengan ekstensi **Live Server** (klik kanan `index.html` → Open with Live Server), atau buka file `index.html` langsung di browser.

## Pemetaan tugas
### Task 01 — Build the HTML Structure
File utama: `index.html`
- Struktur semantic: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Bagian halaman: hero, katalog, cara sewa, riwayat pesanan, dashboard admin, dan form pemesanan.

### Task 02 — Style & Responsive
File utama: `css/style.css`
- Variabel warna dan typography.
- Layout menggunakan CSS Grid dan Flexbox.
- Media query untuk layar tablet dan HP.
- Navigasi mobile dan tabel yang dapat digeser horizontal.

### Task 03 — Refine the Interface
File utama: `js/app.js` dan penyempurnaan HTML/CSS.
- Pencarian, filter, dan pengurutan produk.
- Perhitungan durasi dan total biaya.
- Pengecekan stok pada tanggal sewa.
- Simpan pesanan ke localStorage.
- Riwayat pesanan dan dashboard admin.
- Pengujian responsive serta perbaikan tampilan.

## Pembagian kerja 3 anggota
Contoh pembagian agar file yang dikerjakan tidak saling bertabrakan:

| Anggota | Tanggung jawab | File utama |
|---|---|---|
| Anggota 1 | Task 01: struktur dan semantic HTML | `index.html` |
| Anggota 2 | Task 02: styling, warna, layout, responsive | `css/style.css` |
| Anggota 3 | Task 03: interaksi, validasi, pengujian, review | `js/app.js`, `README.md` |

Koordinasikan nama ID dan class HTML sebelum anggota 2 dan 3 mulai bekerja. Merge pekerjaan secara berurutan: HTML → CSS → JavaScript/refinement.

## Alur GitHub untuk 3 anggota

### A. Anggota 1 sebagai pemilik repository
1. Buat repository baru di GitHub, misalnya `website-penyewaan-alat-camping`.
2. Atur visibility sesuai arahan dosen (misalnya Public jika diminta).
3. Tambahkan anggota 2 dan 3 melalui **Settings → Collaborators → Add people**.
4. Di terminal VS Code, dari folder project jalankan:

```bash
git init
git add .
git commit -m "chore: initialize RimbaCamp project"
git branch -M main
git remote add origin https://github.com/USERNAME/website-penyewaan-alat-camping.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub pemilik repository.

### B. Setiap anggota clone repository
Jalankan satu kali:

```bash
git clone https://github.com/USERNAME/website-penyewaan-alat-camping.git
cd website-penyewaan-alat-camping
```

### C. Buat branch masing-masing
Anggota 1:

```bash
git switch -c task-01-html
```

Anggota 2:

```bash
git switch -c task-02-css
```

Anggota 3:

```bash
git switch -c task-03-refinement
```

Kerjakan hanya file sesuai pembagian agar konflik lebih sedikit.

### D. Simpan dan push pekerjaan
Setelah selesai, setiap anggota menjalankan:

```bash
git add .
git commit -m "feat: menyelesaikan bagian tugas"
git push -u origin NAMA-BRANCH
```

Contoh untuk anggota 2:

```bash
git add css/style.css
git commit -m "style: add responsive camping rental layout"
git push -u origin task-02-css
```

### E. Gabungkan pekerjaan ke main
1. Buka repository di GitHub.
2. Klik **Compare & pull request** pada branch anggota.
3. Buat Pull Request (PR) dengan deskripsi perubahan.
4. Anggota lain melakukan review.
5. Pemilik repository klik **Merge pull request**.
6. Merge berurutan: `task-01-html`, `task-02-css`, lalu `task-03-refinement`.
7. Setelah semua PR masuk, setiap anggota memperbarui salinan lokal:

```bash
git switch main
git pull origin main
```

Jika ingin lanjut mengerjakan perubahan, buat branch baru dari `main` yang sudah terbaru.

## Checklist sebelum demo
- [ ] Halaman HTML tampil dan struktur semantic jelas.
- [ ] CSS konsisten dan layout rapi.
- [ ] Website dapat dibuka di desktop dan HP.
- [ ] Tidak ada horizontal overflow pada tampilan utama.
- [ ] Pencarian dan filter produk berfungsi.
- [ ] Form pemesanan dapat divalidasi.
- [ ] Riwayat pesanan muncul setelah pemesanan.
- [ ] Admin dapat mengubah status pesanan.
- [ ] Semua anggota sudah push branch.
- [ ] Semua Pull Request sudah di-merge ke `main`.
- [ ] Demo dijalankan dari branch `main`.

## Catatan pengujian
Untuk menguji alur pemesanan:
1. Buka katalog.
2. Pilih **Sewa sekarang** pada salah satu produk.
3. Isi nama, nomor WhatsApp, tanggal mulai dan selesai, serta jumlah alat.
4. Klik **Kirim pemesanan**.
5. Periksa bagian Riwayat Pesanan.
6. Periksa Dashboard Admin dan ubah status pesanan.
7. Muat ulang halaman untuk memastikan data demo tetap tersimpan di browser yang sama.
