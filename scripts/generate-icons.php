<?php
/**
 * Generate app icons for Tauri.
 * Ensures all PNGs are RGBA (required by Tauri) and creates icon.ico for Windows.
 *
 * Usage: php scripts/generate-icons.php
 * Output: src-tauri/icons/
 */

$iconsDir = __DIR__ . '/../src-tauri/icons';
$logoPath = __DIR__ . '/../images/logo.svg';

if (!is_dir($iconsDir)) {
    mkdir($iconsDir, 0755, true);
}

// Required Tauri icon sizes
// Note: Tauri v1 needs icon.ico on Windows for the resource file
$sizes = [
    '32x32.png'       => 32,
    '128x128.png'     => 128,
    '128x128@2x.png'  => 256,
    'icon.png'        => 512,
];

$generated = false;
$source1024 = $iconsDir . '/icon-1024.png';

if (extension_loaded('imagick')) {
    try {
        $imagick = new Imagick($logoPath);
        $imagick->setImageFormat('png');
        // Ensure RGBA color space
        $imagick->setImageAlphaChannel(Imagick::ALPHACHANNEL_SET);
        $imagick->transformImageColorspace(Imagick::COLORSPACE_SRGB);
        $imagick->resizeImage(1024, 1024, Imagick::FILTER_LANCZOS, 1);
        $imagick->setImageDepth(8);
        $imagick->writeImage($source1024);
        $imagick->clear();
        echo "Source from SVG via ImageMagick\n";
        $generated = true;
    } catch (Exception $e) {
        echo "ImageMagick failed: " . $e->getMessage() . "\n";
    }
}

if (!$generated && function_exists('imagecreatetruecolor')) {
    $img = imagecreatetruecolor(1024, 1024);
    imagesavealpha($img, true);
    imagealphablending($img, true);

    $bg   = imagecolorallocate($img, 59, 130, 246);
    $fg   = imagecolorallocate($img, 255, 255, 255);
    $dark = imagecolorallocate($img, 30, 41, 59);

    imagefill($img, 0, 0, $bg);

    $pad = 200;
    imagefilledrectangle($img, $pad, $pad, 1024 - $pad, 1024 - $pad, $fg);

    $barH = 60;
    $barPad = 25;
    imagefilledrectangle($img, $pad + $barPad, $pad + $barPad,
        1024 - $pad - $barPad, $pad + $barPad + $barH, $bg);

    $inner  = $pad + $barPad + $barH + 30;
    $btnGap = 18;
    $btnW   = (1024 - 2 * $inner - 2 * $btnGap) / 3;

    for ($r = 0; $r < 3; $r++) {
        for ($c = 0; $c < 3; $c++) {
            $bx = $inner + $c * ($btnW + $btnGap);
            $by = $inner + $r * ($btnW + $btnGap);
            imagefilledrectangle($img, $bx, $by, $bx + $btnW, $by + $btnW, $dark);
        }
    }

    $btnWide = $btnW * 2 + $btnGap;
    $by = $inner + 3 * ($btnW + $btnGap);
    imagefilledrectangle($img, $inner, $by, $inner + $btnWide, $by + $btnW, $dark);
    imagefilledrectangle($img, $inner + $btnWide + $btnGap, $by,
        $inner + $btnWide + $btnGap + $btnW, $by + $btnW, $bg);

    imagepng($img, $source1024);
    imagedestroy($img);
    echo "Source from GD (calculator shape)\n";
    $generated = true;
}

if ($generated) {
    $src = @imagecreatefrompng($source1024);
    if (!$src) {
        echo "ERROR: Could not read source icon\n";
        exit(1);
    }

    // Ensure source has alpha
    imagesavealpha($src, true);
    imagealphablending($src, true);

    $icoPngData = '';
    $icnsPngData = '';

    foreach ($sizes as $file => $size) {
        $dst = imagescale($src, $size, $size);
        if ($dst) {
            imagesavealpha($dst, true);
            imagealphablending($dst, false);
            imagepng($dst, "$iconsDir/$file");
            imagedestroy($dst);
            echo "  $file  ({$size}x{$size})\n";

            // Capture 256px for .ico, 512px for .icns
            if ($size === 256) {
                $icoPngData = file_get_contents("$iconsDir/$file");
            }
            if ($size === 512) {
                $icnsPngData = file_get_contents("$iconsDir/$file");
            }
        }
    }
    imagedestroy($src);

    if (!empty($icoPngData)) {
        $pngSize = strlen($icoPngData);
        $ico  = pack('vvv', 0, 1, 1);                     // header
        $ico .= pack('CCCCvvV', 0, 0, 0, 0, 1, 32, $pngSize, 22); // entry
        $ico .= $icoPngData;
        file_put_contents("$iconsDir/icon.ico", $ico);
        echo "  icon.ico  ($pngSize bytes)\n";
    }

    if (!empty($icnsPngData)) {
        $pngSize = strlen($icnsPngData);
        $totalSize = 8 + 8 + $pngSize; // header + entry + png
        // ICNS header: magic 'icns' + 4-byte big-endian total size
        $icns  = pack('a4N', 'icns', $totalSize);
        // Icon entry: type 'ic07' (128x128 PNG) + 4-byte big-endian entry size + PNG data
        // We use 'ic07' but embed 512px PNG — macOS scales it
        $entrySize = 8 + $pngSize;
        $icns .= pack('a4N', 'ic07', $entrySize);
        $icns .= $icnsPngData;
        file_put_contents("$iconsDir/icon.icns", $icns);
        echo "  icon.icns  ($pngSize bytes PNG in ICNS container)\n";
    }

    echo "\n✓ Icons generated in src-tauri/icons/\n";
} else {
    echo "\n⚠ No image library available. Creating placeholder.\n";
    $img = imagecreatetruecolor(32, 32);
    imagesavealpha($img, true);
    $bg = imagecolorallocate($img, 59, 130, 246);
    imagefill($img, 0, 0, $bg);
    imagepng($img, "$iconsDir/32x32.png");
    imagedestroy($img);
    echo "Created 32x32 placeholder\n";
}
