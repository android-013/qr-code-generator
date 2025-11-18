
    // Grab DOM elements
    const qrDataInput   = document.getElementById("qrData");
    const dotShapeSel   = document.getElementById("dotShape");
    const cornerShapeSel = document.getElementById("cornerShape");
    const fgColorInput  = document.getElementById("fgColor");
    const bgColorInput  = document.getElementById("bgColor");
    const generateBtn   = document.getElementById("generateBtn");
    const downloadBtn   = document.getElementById("downloadBtn");
    const errorBox      = document.getElementById("error");
    const qrWrapper     = document.getElementById("qrWrapper");

    let qrCode;
    let hasValidQR = false;

    function showError(msg) {
      errorBox.textContent = msg || "";
    }

    function clearError() {
      errorBox.textContent = "";
    }

    // Initialize QRCodeStyling once
    function initQr() {
      if (qrCode) return;

      qrCode = new QRCodeStyling({
        width: 256,
        height: 256,
        type: "canvas",           // keep it canvas-based
        data: "https://your-link.com",
        margin: 8,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "Q"
        },
        dotsOptions: {
          type: "rounded",
          color: "#22c55e"
        },
        cornersSquareOptions: {
          type: "square",
          color: "#22c55e"
        },
        cornersDotOptions: {
          type: "dot",
          color: "#22c55e"
        },
        backgroundOptions: {
          color: "#020617"
        }
      });

      // Remove placeholder and append canvas
      qrWrapper.innerHTML = "";
      qrCode.append(qrWrapper);
    }

    function generateQR() {
      const text = qrDataInput.value.trim();
      const dotShape = dotShapeSel.value;
      const cornerShape = cornerShapeSel.value;
      const fgColor = fgColorInput.value || "#22c55e";
      const bgColor = bgColorInput.value || "#020617";

      clearError();

      if (!text) {
        showError("Enter a URL or some text first.");
        downloadBtn.disabled = true;
        hasValidQR = false;
        return;
      }

      // Slight hint, not strict validation
      if (!/^https?:\/\//i.test(text)) {
        showError("Tip: add http:// or https:// so scanners treat it as a link.");
      }

      initQr();

      // Map "none" corner to not styling corners at all
      const cornerType = cornerShape === "none" ? undefined : cornerShape;

      qrCode.update({
        data: text,
        dotsOptions: {
          type: dotShape,
          color: fgColor
        },
        cornersSquareOptions: {
          type: cornerType,
          color: fgColor
        },
        cornersDotOptions: {
          type: cornerType ? "dot" : undefined,
          color: fgColor
        },
        backgroundOptions: {
          color: bgColor
        }
      });

      hasValidQR = true;
      downloadBtn.disabled = false;
    }

    function downloadQR() {
      if (!hasValidQR || !qrCode) return;

      qrCode.download({
        name: "styled-qr",
        extension: "png"
      });
    }

    generateBtn.addEventListener("click", function (e) {
      e.preventDefault();
      generateQR();
    });

    downloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      downloadQR();
    });

    // Hit Enter on URL input to generate
    qrDataInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        generateQR();
      }
    });