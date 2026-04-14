#!/bin/bash
# Download curated free 4K Mexican food photos from Unsplash and Pexels
# All images are free for commercial use (Unsplash License / Pexels License)
#
# Usage: ./download_photos.sh
# Requires: curl
#
# NOTE: Unsplash source URLs auto-redirect to the image CDN at full resolution.
# Format: https://unsplash.com/photos/{photo-id}/download?force=true

set -euo pipefail

PHOTO_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Downloading photos to: $PHOTO_DIR"
echo ""

download_photo() {
    local filename="$1"
    local url="$2"
    local description="$3"

    if [ -f "$PHOTO_DIR/$filename" ]; then
        echo "[SKIP] $filename already exists"
        return
    fi

    echo "[DOWNLOADING] $description -> $filename"
    if curl -L -s -o "$PHOTO_DIR/$filename" "$url"; then
        local size
        size=$(du -h "$PHOTO_DIR/$filename" | cut -f1)
        echo "[OK] $filename ($size)"
    else
        echo "[FAIL] $filename - download failed"
        rm -f "$PHOTO_DIR/$filename"
    fi
}

echo "=== TACOS ==="
download_photo "tacos-01.jpg" \
    "https://unsplash.com/photos/5mpht0M5H0E/download?force=true" \
    "Three tacos on a plate (Unsplash)"

download_photo "tacos-02.jpg" \
    "https://unsplash.com/photos/aZOqcEK2KuQ/download?force=true" \
    "Taco on plate by Herson Rodriguez (Unsplash)"

echo ""
echo "=== PUPUSAS ==="
echo "[INFO] Pupusas are rare on free stock sites. Try these manually:"
echo "  - https://unsplash.com/s/photos/pupusas"
echo "  - https://www.freepik.com/free-photos-vectors/pupusas"
echo "  - https://www.vecteezy.com/free-photos/pupusas"

echo ""
echo "=== BURRITOS ==="
download_photo "burritos-01.jpg" \
    "https://unsplash.com/photos/burrito/download?force=true" \
    "Burrito (Unsplash)"

echo "[INFO] Browse more at: https://unsplash.com/s/photos/burrito"

echo ""
echo "=== QUESADILLAS ==="
echo "[INFO] Browse and download from:"
echo "  - https://unsplash.com/s/photos/quesadilla"
echo "  - https://www.pexels.com/search/quesadilla/"
echo "  - https://pixabay.com/images/search/quesadilla/"

echo ""
echo "=== SOPES ==="
echo "[INFO] Browse and download from:"
echo "  - https://www.pexels.com/search/sopes/"
echo "  - https://www.freepik.com/free-photos-vectors/mexican-sopes"

echo ""
echo "=== MOJARRA FRITA (Whole Fried Fish) ==="
download_photo "mojarra-frita-01.jpg" \
    "https://unsplash.com/photos/Sz0sTpO8U6g/download?force=true" \
    "Fried fish with lemon on plate (Unsplash)"

download_photo "mojarra-frita-02.jpg" \
    "https://unsplash.com/photos/R2H4asDtjvY/download?force=true" \
    "Fried fish on black ceramic plate (Unsplash)"

echo ""
echo "=== POLLO FRITO (Fried Chicken Plate) ==="
download_photo "pollo-frito-01.jpg" \
    "https://unsplash.com/photos/zE8wKvGPcDg/download?force=true" \
    "Plate of fried chicken (Unsplash)"

download_photo "pollo-frito-02.jpg" \
    "https://unsplash.com/photos/688FcyEGZJg/download?force=true" \
    "Fried chicken with rice, salad & sauce (Unsplash)"

download_photo "pollo-frito-03.jpg" \
    "https://unsplash.com/photos/oOTceVp6i3U/download?force=true" \
    "Fried chicken on white ceramic plate (Unsplash)"

echo ""
echo "=== CALDOS (Pollo, Res) ==="
download_photo "caldo-01.jpg" \
    "https://unsplash.com/photos/3d5RQY3JuDc/download?force=true" \
    "Jarritos & Caldo de Res (Unsplash)"

echo "[INFO] More caldo photos at:"
echo "  - https://www.dreamstime.com/photos-images/caldo-de-res.html"
echo "  - https://www.dreamstime.com/photos-images/caldo-soup.html"

echo ""
echo "=== HORCHATA ==="
download_photo "horchata-01.jpg" \
    "https://unsplash.com/photos/horchata/download?force=true" \
    "Horchata (Unsplash)"

echo "[INFO] More horchata photos at:"
echo "  - https://www.pexels.com/search/horchata/"
echo "  - https://www.pexels.com/photo/traditional-mexican-horchata-drink-with-rice-and-cinnamon-34384845/"

echo ""
echo "=== AGUAS FRESCAS ==="
echo "[INFO] Browse and download from:"
echo "  - https://unsplash.com/s/photos/watermelon-juice"
echo "  - https://unsplash.com/s/photos/tropical-drinks"
echo "  - https://unsplash.com/s/photos/mexican-drinks"

echo ""
echo "=== MEXICAN COKE ==="
download_photo "mexican-coke-01.jpg" \
    "https://unsplash.com/photos/fNIw0QHxbWI/download?force=true" \
    "Coca-Cola glass bottle on white table (Unsplash)"

download_photo "mexican-coke-02.jpg" \
    "https://unsplash.com/photos/6ztrgaqQzpQ/download?force=true" \
    "Glass bottle beside glass with ice cubes (Unsplash)"

download_photo "mexican-coke-03.jpg" \
    "https://unsplash.com/photos/c5nkO3hvRAg/download?force=true" \
    "Coca-Cola truck in Oaxaca, Mexico (Unsplash)"

echo ""
echo "================================"
echo "Download complete!"
echo "Check $PHOTO_DIR for downloaded files."
echo ""
echo "For items marked [INFO], visit the URLs manually to select"
echo "the best photos for your needs."
echo "================================"
