const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const regenerateBtn = document.getElementById("regenerateBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

async function generateEmail() {

    const sender = document.getElementById("sender").value.trim();
    const recipient = document.getElementById("recipient").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const purpose = document.getElementById("purpose").value.trim();
    const tone = document.getElementById("tone").value;
    const points = document.getElementById("points").value.trim();

    if (
        !sender ||
        !recipient ||
        !subject ||
        !purpose ||
        !points
    ) {
        alert("Please fill in all fields.");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = "⏳ Generating Email...";

    loading.innerHTML = "";
    result.innerHTML = "";

    copyBtn.style.display = "none";
    downloadBtn.style.display = "none";
    regenerateBtn.style.display = "none";

    try {

        const response = await fetch("/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                sender,
                recipient,
                subject,
                purpose,
                tone,
                points
            })

        });

        const data = await response.json();

        if (data.success) {

            result.innerHTML = marked.parse(data.message);

            copyBtn.style.display = "block";
            downloadBtn.style.display = "block";
            regenerateBtn.style.display = "block";

        } else {

            result.innerHTML =
                `<p style="color:red;">${data.message}</p>`;

        }

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<p style='color:red;'>Something went wrong.</p>";

    }

    generateBtn.disabled = false;
    generateBtn.innerHTML = "✨ Generate Email";

}

generateBtn.addEventListener("click", generateEmail);

regenerateBtn.addEventListener("click", generateEmail);

copyBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(result.innerText);

        alert("✅ Email copied successfully!");

    } catch {

        alert("Failed to copy email.");

    }

});

downloadBtn.addEventListener("click", () => {

    const options = {

        margin: 10,
        filename: "AI_Email.pdf",
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }

    };

    html2pdf().set(options).from(result).save();

});