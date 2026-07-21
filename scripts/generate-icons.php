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

    $icoPngData = ''; // Largest PNG data for the .ico file

    foreach ($sizes as $file => $size) {
        $dst = imagescale($src, $size, $size);
        if ($dst) {
            imagesavealpha($dst, true);
            imagealphablending($dst, false);
            imagepng($dst, "$iconsDir/$file");
            imagedestroy($dst);
            echo "  $file  ({$size}x{$size})\n";

            // Capture 256px version for .ico (max resolution the format officially supports)
            if ($size === 256) {
                $icoPngData = file_get_contents("$iconsDir/$file");
            }
        }
    }
    imagedestroy($src);

    // ICO file wrapping the PNG data (Windows 10+ supports PNG in ICO)
    if (!empty($icoPngData)) {
        $icoPath = "$iconsDir/icon.ico";
        $pngSize = strlen($icoPngData);
        $offset  = 6 + 16; // header + 1 directory entry

        $ico  = pack('vvv', 0, 1, 1);              // ICONDIR: reserved, type=ico, count=1
        $ico .= pack('CCCCvvV',                     // ICONDIRENTRY
            0,      // width (0 = 256)
            0,      // height (0 = 256)
            0,      // colors
            0,      // reserved
            1,      // color planes
            32,     // bits per pixel
            $pngSize,
            $offset
        );
        $ico .= $icoPngData;

        file_put_contents($icoPath, $ico);
        echo "  icon.ico  (generated from " . strlen($icoPngData) . " bytes PNG)\n";
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
