document.getElementById('exportBtn').addEventListener('click', async () => {

    const WIDTH = 11417;
    const HEIGHT = 15264;

    const imgEl = document.querySelector('.product-preview img');
    const svgEl = document.querySelector('.print-layer');

    // load ảnh áo
    const shirtImg = new Image();
    shirtImg.crossOrigin = 'anonymous';
    shirtImg.src = imgEl.src;

    await new Promise(resolve => shirtImg.onload = resolve);

    // xóa svg
    const svgClone = svgEl.cloneNode(true);
    svgClone.setAttribute('width', WIDTH);
    svgClone.setAttribute('height', HEIGHT);
    svgClone.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgClone);

    const svgBlob = new Blob([svgStr], {
        type: 'image/svg+xml;charset=utf-8'
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    const svgImg = new Image();
    svgImg.crossOrigin = 'anonymous';

    await new Promise(resolve => {
        svgImg.onload = resolve;
        svgImg.src = svgUrl;
    });

    // CANVAS GỐC IN XƯỞNG
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Áo
    ctx.drawImage(shirtImg, 0, 0, WIDTH, HEIGHT);

    // Patch + Text
    ctx.drawImage(svgImg, 0, 0, WIDTH, HEIGHT);

    URL.revokeObjectURL(svgUrl);

    // export 
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        // MOBILE
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            window.open(url, '_blank');
        }
        // DESKTOP
        else {
            const a = document.createElement('a');
            a.href = url;
            a.download = ((name || 'print-shirt').toUpperCase()) + '.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

    }, 'image/png');


});
