<?php

/**
 * generate-icons.php
 * -------------------------------
 * Generates a 1024x1024 source PNG from the project logo.
 * Tauri's "npx tauri icon" CLI then produces all required
 * formats (ICO, ICNS, scaled PNGs) from this source.
 *
 * Usage:  php scripts/generate-icons.php
 * Output: src-tauri/icons/icon-1024.png
 */

$iconsDir = __DIR__ . '/../src-tauri/icons';
$logoFile = __DIR__ . '/../images/logo.svg';
$outFile  = $iconsDir . '/icon-1024.png';

if (!is_dir($iconsDir)) {
    mkdir($iconsDir, 0777, true);
}

$ok = false;

/* -------------------------------------------------------------------
 * Preferred: ImageMagick (faithful SVG→PNG conversion, alpha-aware)
 * ------------------------------------------------------------------- */
if (extension_loaded('imagick')) {
    try {
        $im = new Imagick($logoFile);
        $im->setImageFormat('png');
        $im->setImageAlphaChannel(Imagick::ALPHACHANNEL_SET);
        $im->transformImageColorspace(Imagick::COLORSPACE_SRGB);
        $im->resizeImage(1024, 1024, Imagick::FILTER_LANCZOS, 1);
        $im->setImageDepth(8);
        $im->writeImage($outFile);
        $im->clear();
        echo "  Source from SVG via ImageMagick\n";
        $ok = true;
    } catch (Exception $e) {
        echo "  ImageMagick failed: " . $e->getMessage() . "\n";
    }
}

/* -------------------------------------------------------------------
 * Fallback: GD – draw a simple calculator icon
 * ------------------------------------------------------------------- */
if (!$ok && function_exists('imagecreatetruecolor')) {
    $img = imagecreatetruecolor(1024, 1024);
    imagesavealpha($img, true);
    imagealphablending($img, true);

    $bg   = imagecolorallocate($img, 59, 130, 246);   /* primary blue */
    $fg   = imagecolorallocate($img, 255, 255, 255);
    $dark = imagecolorallocate($img, 30, 41, 59);

    imagefill($img, 0, 0, $bg);

    /* White body */
    $pad = 200;
    imagefilledrectangle($img, $pad, $pad, 1024 - $pad, 1024 - $pad, $fg);

    /* Display bar */
    $bh = 60; $bp = 25;
    imagefilledrectangle($img,
        $pad + $bp, $pad + $bp,
        1024 - $pad - $bp, $pad + $bp + $bh, $bg);

    /* 3×3 button grid */
    $inner  = $pad + $bp + $bh + 30;
    $gap    = 18;
    $bw     = (1024 - 2 * $inner - 2 * $gap) / 3;

    for ($r = 0; $r < 3; $r++) {
        for ($c = 0; $c < 3; $c++) {
            $x1 = $inner + $c * ($bw + $gap);
            $y1 = $inner + $r * ($bw + $gap);
            imagefilledrectangle($img, $x1, $y1, $x1 + $bw, $y1 + $bw, $dark);
        }
    }

    /* Bottom row: wide zero button + equals */
    $ww = $bw * 2 + $gap;
    $yy = $inner + 3 * ($bw + $gap);
    imagefilledrectangle($img, $inner, $yy, $inner + $ww, $yy + $bw, $dark);
    imagefilledrectangle($img,
        $inner + $ww + $gap, $yy,
        $inner + $ww + $gap + $bw, $yy + $bw, $bg);

    imagepng($img, $outFile);
    imagedestroy($img);
    echo "  Source from GD (calculator shape)\n";
    $ok = true;
}

/* -------------------------------------------------------------------
 * Result
 * ------------------------------------------------------------------- */
if ($ok) {
    echo "\n  Done: $outFile\n";
    echo "  The workflow will run 'npx tauri icon' to produce all formats.\n";
} else {
    echo "\n  FAILED – no image library available.\n";
    exit(1);
}
