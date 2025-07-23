# Намери PID на процеса, който слуша на порт 8080
$pid = netstat -ano | findstr :8080 | Select-String -Pattern "LISTENING" | ForEach-Object {
    ($_ -split "\s+")[-1]
}

if ($pid) {
    Write-Host "Открит е процес на порт 8080 с PID $pid. Спирам процеса..."
    taskkill /PID $pid /F
} else {
    Write-Host "Няма процес на порт 8080."
} 