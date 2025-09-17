document.addEventListener("DOMContentLoaded", () => {
  // Elementos UI
  const form = document.getElementById("formRegistro");
  const sendButton = document.getElementById("sendList");
  const loading = document.getElementById("loading");
  const modal = document.getElementById("modal");
  const modalMensaje = document.getElementById("modal-mensaje");
  const cerrarModal = document.getElementById("cerrar-modal");
  const descargarPDF = document.getElementById("descargarPDF");

  // Campos del formulario (según tu HTML)
  const estudianteSelect = document.getElementById("estudiante");
  const nombreTutorInput = document.getElementById("nombreTutor");
  const parentescoSelect = document.getElementById("parentesco");
  const cedulaTutorInput = document.getElementById("cedulaTutor"); // input text
  const entregaCedulaSelect = document.getElementById("entregaCedula"); // select Sí/No
  const motivoContainer = document.getElementById("motivoContainer");
  const motivoInput = document.getElementById("motivo");

  // URL para enviar (reemplaza por tu Web App si corresponde)
  const urlSheetBest = "https://api.sheetbest.com/sheets/48d2338d-5018-406b-b2fd-2e7ce6761d55";
  let lastData = null;

  // Mostrar/ocultar motivo cuando seleccionen "No"
  if (entregaCedulaSelect && motivoContainer && motivoInput) {
    entregaCedulaSelect.addEventListener("change", () => {
      if (entregaCedulaSelect.value === "No") {
        motivoContainer.style.display = "block";
        motivoInput.required = true;
        motivoInput.focus();
      } else {
        motivoContainer.style.display = "none";
        motivoInput.required = false;
        motivoInput.value = "";
      }
    });
  }

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Leer valores
    const estudiante = estudianteSelect ? estudianteSelect.value.trim() : "";
    const nombreTutor = nombreTutorInput ? nombreTutorInput.value.trim() : "";
    const parentesco = parentescoSelect ? parentescoSelect.value.trim() : "";
    const cedulaTutor = cedulaTutorInput ? cedulaTutorInput.value.trim() : "";
    const entregaCedula = entregaCedulaSelect ? entregaCedulaSelect.value : "";
    const motivo = motivoInput ? motivoInput.value.trim() : "";

    // Validaciones
    if (!estudiante) { alert("⚠️ Seleccione un estudiante."); return; }
    if (!nombreTutor) { alert("⚠️ Ingrese el nombre completo del padre, madre o tutor."); nombreTutorInput.focus(); return; }
    if (!parentesco) { alert("⚠️ Seleccione el parentesco."); parentescoSelect.focus(); return; }
    if (!cedulaTutor) { alert("⚠️ Ingrese el número de cédula del padre/madre/tutor."); cedulaTutorInput.focus(); return; }
    if (!entregaCedula) { alert("⚠️ Indique si entregó la fotocopia de la Cédula de Identidad."); entregaCedulaSelect.focus(); return; }
    if (entregaCedula === "No" && !motivo) { alert("⚠️ Por favor indique el motivo."); motivoInput.focus(); return; }

    // Mostrar spinner y bloquear botón
    loading.style.display = "flex";
    sendButton.disabled = true;
    sendButton.style.opacity = "0.6";

    // Preparar objeto a enviar
    lastData = {
      Estudiante: estudiante,
      "Padre/Madre/Tutor": nombreTutor,
      Parentesco: parentesco,
      "Cédula del Tutor": cedulaTutor,
      "Cédula entregada": entregaCedula,
      Motivo: entregaCedula === "No" ? motivo : "N/A",
      Fecha: new Date().toLocaleString("es-BO", { timeZone: "America/La_Paz" })
    };

    try {
      // Si tienes una URL válida, envía
      if (urlSheetBest && urlSheetBest.trim() !== "") {
        const res = await fetch(urlSheetBest, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lastData)
        });
        if (!res.ok) throw new Error(`Respuesta no OK (${res.status})`);
      }

      // Mostrar modal de éxito y habilitar descarga
      modalMensaje.textContent = "✅ ¡Formulario enviado correctamente!";
      modal.style.display = "flex";
      descargarPDF.style.display = "inline-block";

      // Limpiar formulario
      form.reset();
      motivoContainer.style.display = "none";
      motivoInput.required = false;

    } catch (err) {
      console.error(err);
      modalMensaje.textContent = "❌ Error: " + (err.message || err);
      modal.style.display = "flex";
      descargarPDF.style.display = "none";
    } finally {
      loading.style.display = "none";
      sendButton.disabled = false;
      sendButton.style.opacity = "1";
    }
  });

  // Descargar PDF con datos en orden legible
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

      // Construir filas en el orden deseado
      const tableBody = [
        ["Estudiante", lastData.Estudiante || ""],
        ["Padre/Madre/Tutor", lastData["Padre/Madre/Tutor"] || ""],
        ["Parentesco", lastData.Parentesco || ""],
        ["Cédula del Tutor", lastData["Cédula del Tutor"] || ""],
        ["Cédula entregada", lastData["Cédula entregada"] || ""],
        ["Motivo", lastData.Motivo || ""],
        ["Fecha y Hora", lastData.Fecha || ""]
      ];

      doc.autoTable({
        startY: 40,
        head: [["Campo", "Valor"]],
        body: tableBody,
        styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        columnStyles: { 1: { cellWidth: "auto" } }
      });

      const fileName = `Registro_${(lastData.Estudiante || "sin_nombre").replace(/\s+/g, "_")}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error(err);
      alert("Error al generar PDF: " + (err.message || err));
    }
  });

  // Cerrar modal
  if (cerrarModal) {
    cerrarModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});
