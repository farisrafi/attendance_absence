# Installasi project
- Clone project ini dengan mengcopy url yang ada di project

## Running project
- Pertama ketikan docker-compose up --build -d pada command promt setelah proses clone project. Kemudian ketikan docker logs attendance-api -f untuk melihat apakah container sudah berjalan.
- Setelah menjalankan docker-compose up, package-package(express js, redis,database,elasticsearch,dll) yang dibutuhkan akan terinstall secara otomatis pada docker. Sebelumnya service docker harus active atau nyala terlebih dahulu. Untuk database sudah disinkronisasi di file server.js
Harusnya sudah diterinstall berserta datanya testing untuk postgresql dan datanya
- Kemudian import dokumentasi api (Testing_Api.postman_collection.json) dan project bisa dijalankan sebagaimana mestinya