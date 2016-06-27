Typer Problem

1. Sebutkan library apa saja yang dipakai, website library itu dimana, dan dokumentasi library itu ada dimana.

Library 	| Website										| Dokumentasi
------------|-----------------------------------------------|---------------------------------------------
jquery		| [jquery.com](https://jquery.com/) 			| [api.jquery.com](https://api.jquery.com/)
jquery-ui	| [jqueryui.com](https://jqueryui.com/) 		| [api.jqueryui.com](https://api.jqueryui.com/)
underscore	| [underscorejs.org](http://underscorejs.org/)	| [underscorejs.org](http://underscorejs.org/)
backbone	| [backbonejs.org](http://backbonejs.org/)		| [backbonejs.org](http://backbonejs.org/)
bootstrap	| [getbootstrap.com](https://getbootstrap.com/)	| [getbootstrap.com](https://getbootstrap.com/)


2. Aplikasi itu 'laggy'. Kenapa? Bagaimana cara membuat animasi lebih 'smooth'?

	karena delay `setInterval` terlalu tinggi, frame rate rendah (10 fps) sehingga tidak nyaman untuk mata dan menimbulkan kesan patah-patah/laggy.
	Jika delay diturunkan di kisaran 40ms (25 fps), animasi akan berjalan lebih halus.
	Alternatif lain adalah mengganti `setInterval` dengan `requestAnimationFrame` atau menggunakan CSS transform.

3. Aplikasi itu tidak akan jalan di salah satu 3 browser populer (Chrome, Firefox, Internet Explorer)? Kenapa? Solusinya hanya menghapus satu character di code, character yang mana?

	Ditest dengan:
	  - firefox-aurora 49 di Archlinux
	  - chromium 51 di Archlinux
	  - IE 11 di Windows 7
	Lancar tanpa hambatan.

4. Implementasikan tombol Start, Stop, Pause, dan Resume.

	[Sudah](0db62eacbbd112ebea78225c9ec432e470fb448d)

5. Ketika ukuran window dirubah, susunan huruf yang 'terbentur' batas window menjadi tidak 1 baris. Benarkan.

	[Sudah](fa6bd9a9a28a8dc6dffe6d9091e00f732e99391b)

6. Implementasikan sistem score.

	[Sudah](d68f3a3255a47f632e8ae68e9b2a5769dbead1a8)

7. Implementasikan hukuman berupa pengurangan nilai bila salah ketik.

	[Sudah](d68f3a3255a47f632e8ae68e9b2a5769dbead1a8)

[Live test @ jsbin](http://output.jsbin.com/hakilin)

