const params = new URLSearchParams(window.location.search);
const name = params.get('name');

const text = document.getElementById('printName');
const bg = document.getElementById('nameBg');

// Các control điều chỉnh
const posX = document.getElementById('posX');
const posY = document.getElementById('posY');
const longPosX = document.getElementById('longPosX');
const longPosY = document.getElementById('longPosY');
const fontFamily = document.getElementById('fontFamily');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const strokeColor = document.getElementById('strokeColor');
const fontWeight = document.getElementById('fontWeight');

// Cấu hình
const SHORT_LIMIT = 13; // Giới hạn ký tự ngắn
const paddingX = 60; // Khoảng đệm ngang
const paddingY = 30; // Khoảng đệm dọc
const baseFontSize = 160; // Cỡ chữ mặc định
const minFontSize = 110; // Cỡ chữ nhỏ nhất
const maxPatchWidth = 1800; // Chiều rộng tối đa của patch

// Vị trí ban đầu (tên ngắn <= 13 ký tự)
let initialX = 1921;
let initialY_1line = 7781; // Vị trí cho 1 dòng
let initialY_2lines = 7648; // Vị trí cho 2+ dòng

// Vị trí cho tên dài (> 13 ký tự)
let longX = 1912;
let longY_1line = 7781;
let longY_2lines = 7648;

// Cập nhật giá trị hiển thị – Tên ngắn
posX.addEventListener('input', () => {
    document.getElementById('posXValue').textContent = posX.value;
    initialX = parseInt(posX.value);
    updateName();
});

posY.addEventListener('input', () => {
    document.getElementById('posYValue').textContent = posY.value;
    const newY = parseInt(posY.value);
    const diff = newY - initialY_1line;
    initialY_1line = newY;
    initialY_2lines = 7648 + diff;
    updateName();
});

// Cập nhật giá trị hiển thị – Tên dài
longPosX.addEventListener('input', () => {
    document.getElementById('longPosXValue').textContent = longPosX.value;
    longX = parseInt(longPosX.value);
    updateName();
});

longPosY.addEventListener('input', () => {
    document.getElementById('longPosYValue').textContent = longPosY.value;
    const newY = parseInt(longPosY.value);
    const diff = newY - longY_1line;
    longY_1line = newY;
    longY_2lines = 7648 + diff;
    updateName();
});

// Các control chung
fontWeight.addEventListener('input', () => {
    document.getElementById('fontWeightValue').textContent = fontWeight.value;
    text.setAttribute('font-weight', fontWeight.value);
    updateName();
});

fontFamily.addEventListener('change', () => {
    text.setAttribute('font-family', fontFamily.value);
    updateName();
});

textColor.addEventListener('input', () => {
    text.setAttribute('fill', textColor.value);
});

bgColor.addEventListener('input', () => {
    bg.setAttribute('fill', bgColor.value);
});

strokeColor.addEventListener('input', () => {
    bg.setAttribute('stroke', strokeColor.value);
});

// Hàm cập nhật tên
function updateName() {
    if (!name) {
        bg.style.display = 'none';
        text.style.display = 'none';
        return;
    }

    bg.style.display = 'block';
    text.style.display = 'block';

    const upperName = name.toUpperCase();

    // reset text
    text.innerHTML = '';
    text.setAttribute('font-size', baseFontSize);
    text.setAttribute('font-weight', fontWeight.value);
    text.setAttribute('font-family', fontFamily.value);
    text.setAttribute('fill', textColor.value);
    text.setAttribute('text-anchor', 'middle');

    // Xác định baseX
    const baseX = upperName.length <= SHORT_LIMIT ? initialX : longX;

    // CHIA DÒNG: 20 KÝ TỰ / DÒNG
    const MAX_PER_LINE = 20;
    let lines = [];

    for (let i = 0; i < upperName.length; i += MAX_PER_LINE) {
        lines.push(upperName.slice(i, i + MAX_PER_LINE));
    }

    // Xác định vị trí Y dựa trên số dòng
    let patchY;
    if (upperName.length <= SHORT_LIMIT) {
        patchY = lines.length === 1 ? initialY_1line : initialY_2lines;
    } else {
        patchY = lines.length === 1 ? longY_1line : longY_2lines;
    }

    // TẠO TSPAN tạm để đo
    lines.forEach((line, i) => {
        const tspan = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'tspan'
        );

        tspan.textContent = line;
        tspan.setAttribute('x', baseX);

        if (i === 0) {
            tspan.setAttribute('y', 0);
        } else {
            tspan.setAttribute('dy', '1.15em');
        }

        text.appendChild(tspan);
    });

    requestAnimationFrame(() => {
        let fontSize = baseFontSize;
        let box = text.getBBox();

        // thu nhỏ nếu quá rộng
        while (
            box.width + paddingX * 2 > maxPatchWidth &&
            fontSize > minFontSize
        ) {
            fontSize--;
            text.setAttribute('font-size', fontSize);
            box = text.getBBox();
        }

        // Tính toán kích thước patch
        const patchWidth  = box.width + paddingX * 2;
        const patchHeight = box.height + paddingY * 2;

        // Đặt patch ở vị trí patchY
        bg.setAttribute('x', baseX - patchWidth / 2);
        bg.setAttribute('y', patchY);
        bg.setAttribute('width', patchWidth);
        bg.setAttribute('height', patchHeight);

        // Tính toán vị trí text để căn giữa trong patch
        // Text Y = patch Y + padding top + khoảng cách từ top của text box đến baseline
        const textY = patchY + paddingY - box.y;

        // Cập nhật lại tất cả tspan với vị trí Y đúng
        const tspans = text.querySelectorAll('tspan');
        tspans.forEach((tspan, i) => {
            if (i === 0) {
                tspan.setAttribute('y', textY);
            }
            // dy giữ nguyên cho các dòng sau
        });
    });
}

// Khởi tạo
updateName();