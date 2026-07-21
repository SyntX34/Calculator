<?php
/**
 * Generate app icons for Tauri from the logo SVG.
 * Falls back to creating a simple calculator icon if SVG conversion isn't available.
 *
 * Usage: php scripts/generate-icons.php
 * Output: src-tauri/icons/ with all required PNG icon sizes
 */

$iconsDir = __DIR__ . '/../src-tauri/icons';
$logoPath = __DIR__ . '/../images/logo.svg';

if (!is_dir($iconsDir)) {
    mkdir($iconsDir, 0755, true);
}

// Required Tauri icon sizes (PNG only)
$sizes = [
    '32x32.png'       => 32,
    '128x128.png'     => 128,
    '128x128@2x.png'  => 256,
    'icon.png'        => 512,
];

$generated = false;

// --- Try ImageMagick (best quality) ---
if (extension_loaded('imagick')) {
    try {
        $imagick = new Imagick($logoPath);
        $imagick->setImageFormat('png');
        $imagick->resizeImage(1024, 1024, Imagick::FILTER_LANCZOS, 1);
        $imagick->writeImage($iconsDir . '/icon-1024.png');
        $imagick->clear();
        echo "Generated source from SVG via ImageMagick\n";
        $generated = true;
    } catch (Exception $e) {
        echo "ImageMagick failed: " . $e->getMessage() . "\n";
    }
}

// --- Fallback: draw a calculator icon with GD ---
if (!$generated && function_exists('imagecreatetruecolor')) {
    $img = imagecreatetruecolor(1024, 1024);
    $bg   = imagecolorallocate($img, 59, 130, 246); // #3b82f6
    $fg   = imagecolorallocate($img, 255, 255, 255);
    $dark = imagecolorallocate($img, 30, 41, 59);

    imagefill($img, 0, 0, $bg);

    // White rounded-square body
    $pad = 200;
    imagefilledrectangle($img, $pad, $pad, 1024 - $pad, 1024 - $pad, $fg);

    // Display bar
    $barH = 60;
    $barPad = 25;
    imagefilledrectangle($img,
        $pad + $barPad, $pad + $barPad,
        1024 - $pad - $barPad, $pad + $barPad + $barH,
        $bg
    );

    // Button grid (3 rows x 3 cols)
    $inner  = $pad + $barPad + $barH + 30;
    $btnGap = 18;
    $btnW   = (1024 - 2 * $inner - 2 * $btnGap) / 3;
    for ($r = 0; $r < 3; $r++) {
        for ($c = 0; $c < 3; $c++) {
            $bx = $inner + $c * ($btnW + $btnGap);
            $by = $inner + $r * ($btnW + $btnGap);
            imagefilledrectangle($img, $bx, $by,
                $bx + $btnW, $by + $btnW, $dark);
        }
    }

    // Bottom row: wider buttons
    $btnWide = ($btnW * 2 + $btnGap);
    $by = $inner + 3 * ($btnW + $btnGap);
    imagefilledrectangle($img,
        $inner, $by,
        $inner + $btnWide, $by + $btnW,
        $dark
    );
    imagefilledrectangle($img,
        $inner + $btnWide + $btnGap, $by,
        $inner + $btnWide + $btnGap + $btnW, $by + $btnW,
        $bg
    );

    imagepng($img, $iconsDir . '/icon-1024.png');
    imagedestroy($img);
    echo "Generated source from GD (calculator shape)\n";
    $generated = true;
}

// --- Resize to all required sizes ---
if ($generated) {
    $src = imagecreatefrompng($iconsDir . '/icon-1024.png');
    if (!$src) {
        echo "ERROR: Could not read source icon\n";
        exit(1);
    }

    foreach ($sizes as $file => $size) {
        $dst = imagescale($src, $size, $size);
        if ($dst) {
            imagepng($dst, "$iconsDir/$file");
            imagedestroy($dst);
            echo "  $file  ({$size}x{$size})\n";
        }
    }
    imagedestroy($src);
    echo "\n✓ Icons generated in src-tauri/icons/\n";
} else {
    echo "\n⚠ No image library available. Creating placeholder.\n";
    $img = imagecreatetruecolor(32, 32);
    $bg = imagecolorallocate($img, 59, 130, 246);
    imagefill($img, 0, 0, $bg);
    imagepng($img, "$iconsDir/32x32.png");
    imagedestroy($img);
    echo "Created 32x32 placeholder\n";
}
