🔹 Update dulu
sudo apt update && sudo apt upgrade -y
🔹 Install Docker
sudo apt install -y docker.io
🔹 Aktifkan Docker
sudo systemctl enable docker
sudo systemctl start docker

🔹 Install Docker Compose
# Install prerequisites
apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update and install
apt update
apt install -y docker-compose-plugin


4. Jalankan Project

Masuk ke folder:

cd frontend
🔥 Build & run
docker compose up -d --build
🔍 Cek container
docker ps

Harus muncul:

frontend
🌐 5. Test akses

Dari VPS lain / proxy:

curl http://IP_VPS

Monitoring Logs (INI PENTING)
🔹 Lihat log realtime
docker logs -f frontend
🔹 Lihat semua container
docker ps -a
🔹 Kalau error cek:
docker logs frontend
🔄 7. Restart / Stop
docker compose restart
docker compose down
docker compose up -d
🧹 8. Cleanup (kalau perlu)
docker system prune -a