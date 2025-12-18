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
    svgClone.setAttribute('viewBox', '0 0 11417 15264');

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgClone);
    const svgBlob = new Blob([svgStr], {
        type: 'image/svg+xml;charset=utf-8'
    });

    const svgUrl = URL.createObjectURL(svgBlob);
    const svgImg = new Image();

    await new Promise(resolve => {
        svgImg.onload = resolve;
        svgImg.src = svgUrl;
    });

    // canvas
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(shirtImg, 0, 0, WIDTH, HEIGHT);

    ctx.drawImage(svgImg, 0, 0, WIDTH, HEIGHT);

    URL.revokeObjectURL(svgUrl);

    // export
    canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (name || 'print-shirt').toUpperCase() + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, 'image/png');
});
