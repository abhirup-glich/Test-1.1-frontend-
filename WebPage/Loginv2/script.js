const API_BASE = "https://test-1-1-9b4x.onrender.com";

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function registerStudent() {
  const roll = document.getElementById("roll").value.trim();
  const name = document.getElementById("name").value.trim();
  const course = document.getElementById("course").value.trim();

  const center = document.getElementById("centerImage").files[0];
  const left = document.getElementById("leftImage").files[0];
  const right = document.getElementById("rightImage").files[0];

  const status = document.getElementById("status");

  if (!roll || !name || !course || !center || !left || !right) {
    status.innerText = "❌ Please fill all fields and upload 3 images.";
    return;
  }

  status.innerText = "⏳ Registering student...";

  try {
    const payload = {
      roll,
      name,
      course,
      images: {
        center: await readImage(center),
        left: await readImage(left),
        right: await readImage(right)
      }
    };

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.status === "success") {
      status.innerText = "✅ Student registered successfully.";
    } else {
      status.innerText = "❌ Registration failed.";
    }

  } catch (err) {
    status.innerText = "❌ Server error.";
  }
}
