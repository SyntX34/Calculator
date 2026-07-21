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
        // Generate a proper BMP-based ICO that Windows RC can process
        $icoImg = @imagecreatefrompng($iconsDir . '/128x128.png');
        if (!$icoImg) {
            echo "  icon.ico  SKIPPED - could not read 128x128.png\n";
        } else {
            $icoW = imagesx($icoImg);
            $icoH = imagesy($icoImg);
            imagesavealpha($icoImg, true);

            // Extract BGRA pixel data (bottom-up for BMP)
            $xorData = '';
            $andMaskBits = [];
            for ($y = $icoH - 1; $y >= 0; $y--) {
                for ($x = 0; $x < $icoW; $x++) {
                    $rgb = imagecolorat($icoImg, $x, $y);
                    $b = ($rgb >> 16) & 0xFF;
                    $g = ($rgb >> 8) & 0xFF;
                    $r = $rgb & 0xFF;
                    $a = ($rgb >> 24) & 0xFF;
                    // XOR mask: BGRA, alpha 0=opaque 255=transparent
                    $xorData .= pack('CCCC', $b, $g, $r, 255 - $a);
                    // AND mask: 0=opaque 1=transparent
                    $andMaskBits[] = ($a >= 128) ? 1 : 0;
                }
                // Pad XOR row to 4 bytes
                $padLen = (4 - ($icoW * 4) % 4) % 4;
                $xorData .= str_repeat("\x00", $padLen);
            }

            // Build AND mask (1-bit per pixel, bottom-up, padded to 4 bytes)
            $andRowBytes = (int)ceil($icoW / 8);
            $andRowPadded = (int)ceil($andRowBytes / 4) * 4;
            $andData = '';
            for ($y = 0; $y < $icoH; $y++) {
                $row = '';
                for ($x = 0; $x < $icoW; $x++) {
                    $bitIdx = $y * $icoW + $x;
                    $byteIdx = intdiv($x, 8);
                    $bitPos = 7 - ($x % 8);
                    if (!isset($row[$byteIdx])) $row[$byteIdx] = 0;
                    if ($andMaskBits[$bitIdx]) {
                        $row[$byteIdx] = chr(ord($row[$byteIdx]) | (1 << $bitPos));
                    }
                }
                $row = str_pad($row, $andRowPadded, "\x00");
                $andData .= $row;
            }

            $xorSize = strlen($xorData);
            $andSize = strlen($andData);
            $bmpHeaderSize = 40;
            $icoDataSize = $bmpHeaderSize + $xorSize + $andSize;

            // BITMAPINFOHEADER
            $bmp = pack('V3v2V6',
                $bmpHeaderSize,    // biSize
                $icoW,             // biWidth
                $icoH * 2,         // biHeight (double for ICO XOR+AND)
                1,                 // biPlanes
                32,                // biBitCount
                0,                 // biCompression (BI_RGB)
                $xorSize,          // biSizeImage
                0, 0, 0, 0         // biXPelsPerMeter, biYPelsPerMeter, biClrUsed, biClrImportant
            );

            $offset = 6 + 16; // ICONDIR + 1 ICONDIRENTRY
            $ico  = pack('vvv', 0, 1, 1);
            $ico .= pack('CCCCvvV', $icoW, $icoH, 0, 0, 1, 32, $icoDataSize, $offset);
            $ico .= $bmp . $xorData . $andData;

            file_put_contents("$iconsDir/icon.ico", $ico);
            imagedestroy($icoImg);
            echo "  icon.ico  (BMP-based, {$icoW}x{$icoH}, $icoDataSize bytes)\n";
        }
    }

    if (!empty($icnsPngData)) {
        $pngSize = strlen($icnsPngData);
        $totalSize = 8 + 8 + $pngSize; // header + entry + png
        // ICNS header: magic 'icns' + 4-byte big-endian total size
        $icns  = pack('a4N', 'icns', $totalSize);
        // Icon entry: type 'ic09' (512x512 PNG) + 4-byte big-endian entry size + PNG data
        $entrySize = 8 + $pngSize;
        $icns .= pack('a4N', 'ic09', $entrySize);
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
