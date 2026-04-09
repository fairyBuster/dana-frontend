$backendDomain = Read-Host "Masukkan domain backend"
if (-not $backendDomain -or $backendDomain.Trim() -eq "") { throw "Domain backend wajib diisi" }
$backendScheme = Read-Host "Skema backend (http/https, default https)"
if (-not $backendScheme -or $backendScheme.Trim() -eq "") { $backendScheme = "https" }
$allowedIpsRaw = Read-Host "Daftar IP proxy yang diizinkan (pisahkan dengan koma atau spasi). Sertakan 127.0.0.1 dan ::1 jika perlu"
$allowedIps = ($allowedIpsRaw -replace ",", " ") -replace "\s+", " "
$env:BACKEND_DOMAIN = $backendDomain.Trim()
$env:BACKEND_SCHEME = $backendScheme.Trim()
$env:ALLOWED_IPS = $allowedIps.Trim()
docker compose -f "$PSScriptRoot\docker-compose.yml" up -d --build
