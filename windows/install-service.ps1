#Requires -RunAsAdministrator
# Clock Years 24/7: registers a Scheduled Task that starts the server at logon
# and restarts it within a minute if it ever crashes. Run once, in an
# Administrator PowerShell, from the repo root:
#   .\windows\install-service.ps1
# Undo: Unregister-ScheduledTask -TaskName ClockYears -Confirm:$false
$ErrorActionPreference = "Stop"
Set-Location (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "..")

$node = (Get-Command node -ErrorAction Stop).Source
if (-not (Test-Path node_modules)) {
  Write-Host "[+] Installing dependencies..."
  npm install
}
if (-not (Test-Path .env)) {
  Write-Host "[+] Creating .env from .env.example"
  Copy-Item .env.example .env
}
if (-not (Test-Path .output/server/index.mjs)) {
  Write-Host "[+] Building the production server..."
  $env:NITRO_PRESET = "node-server"
  npm run build
}

$action = New-ScheduledTaskAction -Execute $node `
  -Argument ".output/server/index.mjs" -WorkingDirectory (Get-Location).Path
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -RestartCount 999 `
  -RestartInterval (New-TimeSpan -Minutes 1) -StartWhenAvailable
Register-ScheduledTask -TaskName "ClockYears" `
  -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Start-ScheduledTask -TaskName "ClockYears"
Write-Host "[+] Clock Years runs 24/7: http://localhost:8080 (starts at logon, restarts on crash)"
