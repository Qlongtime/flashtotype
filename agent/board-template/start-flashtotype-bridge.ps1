param(
  [string]$Token = "",
  [int]$Port = 4777,
  [ValidateSet("exec", "app-server")]
  [string]$Provider = "exec",
  [ValidateSet("read-only", "workspace-write")]
  [string]$Sandbox = "read-only",
  [string]$Cwd = ""
)

$ErrorActionPreference = "Stop"

function New-BridgeToken {
  $bytes = New-Object byte[] 24
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $rng.GetBytes($bytes)
  } finally {
    $rng.Dispose()
  }
  return [Convert]::ToBase64String($bytes).TrimEnd("=").Replace("+", "-").Replace("/", "_")
}

function Resolve-DefaultCwd {
  $scriptDir = (Resolve-Path -LiteralPath $PSScriptRoot).Path
  $leaf = Split-Path -Leaf $scriptDir
  $parent = Split-Path -Parent $scriptDir
  $parentLeaf = Split-Path -Leaf $parent
  $grandParent = Split-Path -Parent $parent
  $grandParentLeaf = Split-Path -Leaf $grandParent

  if ($leaf -eq "output" -and $parentLeaf -eq "current" -and $grandParentLeaf -eq "flashtotype-workspace") {
    return (Resolve-Path -LiteralPath (Join-Path $scriptDir "..\..\..")).Path
  }

  if ($leaf -eq "board-template" -and $parentLeaf -eq "agent") {
    return (Resolve-Path -LiteralPath (Join-Path $scriptDir "..\..")).Path
  }

  return (Get-Location).Path
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is required to run the Flashtotype Codex bridge. Install Node.js, then rerun this script."
}

$codexCommand = Get-Command codex -ErrorAction SilentlyContinue
if (-not $codexCommand) {
  throw "Codex CLI is required. Install and authenticate Codex, then rerun this script."
}

$codexBin = if ($codexCommand.Source) { $codexCommand.Source } else { $codexCommand.Path }

if (-not $Token) {
  $Token = New-BridgeToken
}

if (-not $Cwd) {
  $Cwd = Resolve-DefaultCwd
}

$bridge = Join-Path $PSScriptRoot "flashtotype-codex-bridge.mjs"
if (-not (Test-Path -LiteralPath $bridge)) {
  throw "Could not find flashtotype-codex-bridge.mjs beside this start script."
}

Write-Host "Starting Flashtotype Codex bridge..."
Write-Host "Working directory: $Cwd"
Write-Host "Local URL: http://127.0.0.1:$Port"
Write-Host "Token: $Token"
Write-Host "Keep this terminal open while using Generate in the Flashtotype board."

node $bridge --port $Port --provider $Provider --sandbox $Sandbox --cwd $Cwd --token $Token --codex-bin $codexBin
