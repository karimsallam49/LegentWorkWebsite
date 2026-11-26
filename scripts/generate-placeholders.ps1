# Generates placeholder PNG assets for the Legend ProteK site.
# Replace these with real brand assets when available.
Add-Type -AssemblyName System.Drawing

$base = Join-Path $PSScriptRoot '..\public\assets'
New-Item -ItemType Directory -Force -Path "$base\cars" | Out-Null

$gold = [System.Drawing.Color]::FromArgb(212, 175, 55)
$lightGold = [System.Drawing.Color]::FromArgb(253, 230, 138)

function New-DarkImage($path, $w, $h, $label, [bool]$transparent = $false) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAlias'

  if (-not $transparent) {
    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect,
      ([System.Drawing.Color]::FromArgb(10, 10, 12)),
      ([System.Drawing.Color]::FromArgb(30, 25, 12)), 35
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    # subtle gold diagonal accent
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 212, 175, 55)), 3
    $g.DrawLine($pen, ($w * 0.15), ($h * 0.85), ($w * 0.85), ($h * 0.15))
    $pen.Dispose()
  }

  if ($label) {
    $size = [Math]::Max(10, [Math]::Min($w, $h) / 9)
    $font = New-Object System.Drawing.Font 'Arial', $size, ([System.Drawing.FontStyle]::Bold)
    $tb = New-Object System.Drawing.SolidBrush $gold
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = 'Center'
    $sf.LineAlignment = 'Center'
    $g.DrawString($label, $font, $tb, (New-Object System.Drawing.RectangleF 0, 0, $w, $h), $sf)
    $font.Dispose(); $tb.Dispose(); $sf.Dispose()
  }

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

# Cursor: small gold diamond pointer
$bmp = New-Object System.Drawing.Bitmap 32, 32
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$pts = @(
  (New-Object System.Drawing.Point 4, 2),
  (New-Object System.Drawing.Point 4, 26),
  (New-Object System.Drawing.Point 12, 19),
  (New-Object System.Drawing.Point 17, 29),
  (New-Object System.Drawing.Point 21, 27),
  (New-Object System.Drawing.Point 16, 17),
  (New-Object System.Drawing.Point 26, 17)
)
$brush = New-Object System.Drawing.SolidBrush $gold
$g.FillPolygon($brush, $pts)
$bmp.Save("$base\cursor.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $brush.Dispose()

# Logos
New-DarkImage "$base\logo.png" 520 160 'LEGEND PROTEK' $true
New-DarkImage "$base\logo-icon.png" 256 256 'LP' $true

# Hero poster
New-DarkImage "$base\bgd.png" 1920 1080 'LEGEND PROTEK'

# App screen
New-DarkImage "$base\app-screen-2.png" 420 880 'LEGEND PROTEK APP'

# Fleet cars
$cars = @(
  '1_Kinetics_Drive_in_Car_Photo_Studi.png|PORSCHE 911 CARRERA',
  '2_A_Sleek_Modern_Luxury_Black_Car_On.png|PORSCHE CAYMAN GT4',
  '3_Sleek_Black_Ferrari_812_superfast.png|FERRARI 812 SF',
  '4_Photograph_porsche_medium_close_up.png|PORSCHE 911 GT3',
  '5_luxury_sport_car_in_dark_studio_with.png|PORSCHE 911 TURBO',
  '6_300_Luxury_Car_Studio_Shot_Stock.png|FERRARI ROMA',
  '7_lamborghini_dark.png|LAMBORGHINI SVJ',
  '8_mercedes_dark.png|MERCEDES AMG GT',
  '9_rollsroyce_dark.png|ROLLS ROYCE PHANTOM',
  '10_bmw_dark.png|BMW M8 COMPETITION'
)
foreach ($c in $cars) {
  $parts = $c -split '\|'
  New-DarkImage "$base\cars\$($parts[0])" 1200 800 $parts[1]
}

Write-Output 'Placeholder assets generated in public/assets'
