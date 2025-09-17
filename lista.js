document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRegistro");
  const sendButton = document.getElementById("sendList");
  const loading = document.getElementById("loading");
  const modal = document.getElementById("modal");
  const modalMensaje = document.getElementById("modal-mensaje");
  const cerrarModal = document.getElementById("cerrar-modal");
  const descargarPDF = document.getElementById("descargarPDF");

  const estudianteSelect = document.getElementById("estudiante");
  const nombreTutorInput = document.getElementById("nombreTutor");
  const cedulaTutorInput = document.getElementById("cedulaTutor");
  const entregaCedulaSelect = document.getElementById("entregaCedula");
  const motivoContainer = document.getElementById("motivoContainer");
  const motivoInput = document.getElementById("motivo");

  const urlSheetBest = "https://api.sheetbest.com/sheets/48d2338d-5018-406b-b2fd-2e7ce6761d55";
  let lastData = null;

  // Mostrar/ocultar motivo si se selecciona "No"
  entregaCedulaSelect.addEventListener("change", () => {
    if (entregaCedulaSelect.value === "No") {
      motivoContainer.style.display = "block";
      motivoInput.required = true;
    } else {
      motivoContainer.style.display = "none";
      motivoInput.required = false;
      motivoInput.value = "";
    }
  });

  // Evento submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const estudiante = estudianteSelect.value.trim();
    const nombreTutor = nombreTutorInput.value.trim();
    const cedulaTutor = cedulaTutorInput.value.trim();
    const entregaCedula = entregaCedulaSelect.value;
    const motivo = motivoInput.value.trim();

    // Validaciones
    if (!estudiante) { alert("⚠️ Seleccione un estudiante."); return; }
    if (!nombreTutor) { alert("⚠️ Ingrese el nombre completo del padre, madre o tutor."); return; }
    if (!cedulaTutor) { alert("⚠️ Ingrese el número de cédula del padre, madre o tutor."); return; }
    if (!entregaCedula) { alert("⚠️ Indique si entregó la fotocopia de su Cédula de Identidad."); return; }
    if (entregaCedula === "No" && !motivo) { alert("⚠️ Por favor indique el motivo."); return; }

    // Mostrar spinner y deshabilitar botón
    loading.style.display = "flex";
    sendButton.disabled = true;
    sendButton.style.opacity = "0.6";

    // Preparar datos para Google Sheets
    lastData = {
      Estudiante: estudiante,
      "Padre/Madre/Tutor": nombreTutor,
      "Cédula del Tutor": cedulaTutor,
      "Cédula entregada": entregaCedula,
      Motivo: entregaCedula === "No" ? motivo : "N/A",
      Fecha: new Date().toLocaleString("es-BO", { timeZone: "America/La_Paz" })
    };

    try {
      if (urlSheetBest !== "") {
        const res = await fetch(urlSheetBest, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lastData)
        });
        if (!res.ok) throw new Error("Error al enviar datos a Google Sheets.");
      }

      // Mostrar modal de éxito
      modalMensaje.textContent = "✅ ¡Formulario enviado correctamente!";
      modal.style.display = "flex";
      descargarPDF.style.display = "inline-block";

      // Reset formulario
      form.reset();
      motivoContainer.style.display = "none";

    } catch (error) {
      modalMensaje.textContent = "❌ " + error.message;
      modal.style.display = "flex";
      descargarPDF.style.display = "none";
    } finally {
      loading.style.display = "none";
      sendButton.disabled = false;
      sendButton.style.opacity = "1";
    }
  });

  // Descargar PDF
  descargarPDF.addEventListener("click", () => {
    if (!lastData) return;

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Encabezado
      doc.setFontSize(14);
      doc.text("Registro de Padres y Tutores", 20, 20);
      doc.setFontSize(11);
      doc.text("Unidad Educativa Jupapina - Segundo de Secundaria", 20, 28);

      // Tabla de datos
      const tableBody = Object.entries(lastData).map(([key, value]) => [key, value]);
      doc.autoTable({
        startY: 40,
        head: [["Campo", "Valor"]],
        body: tableBody,
        styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        columnStyles: { 1: { cellWidth: "auto" } }
      });

      doc.save(`Registro_${lastData.Estudiante}.pdf`);
    } catch (err) {
      alert("Error al generar PDF: " + err.message);
    }
  });

  // Cerrar modal
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
});
