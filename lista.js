document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // ELEMENTOS DE LA INTERFAZ
  // ============================================================

  const form = document.getElementById("formRegistro");
  const sendButton = document.getElementById("sendList");
  const loading = document.getElementById("loading");

  const modal = document.getElementById("modal");
  const modalMensaje = document.getElementById("modal-mensaje");
  const cerrarModal = document.getElementById("cerrar-modal");
  const descargarPDF = document.getElementById("descargarPDF");


  // ============================================================
  // CAMPOS DEL FORMULARIO
  // ============================================================

  const estudianteSelect =
    document.getElementById("estudiante");

  const nombreTutorInput =
    document.getElementById("nombreTutor");

  const parentescoSelect =
    document.getElementById("parentesco");

  const cedulaTutorInput =
    document.getElementById("cedulaTutor");


  // ============================================================
  // MODALIDAD DE COBRO
  // ============================================================

  const modalidadCobro =
    document.getElementById("modalidadCobro");

  const cuentaContainer =
    document.getElementById("cuentaContainer");

  const numeroCuenta =
    document.getElementById("numeroCuenta");

  const celularContainer =
    document.getElementById("celularContainer");

  const numeroCelular =
    document.getElementById("numeroCelular");


  // ============================================================
  // ENTREGA DE CÉDULA
  // ============================================================

  const entregaCedulaSelect =
    document.getElementById("entregaCedula");

  const motivoContainer =
    document.getElementById("motivoContainer");

  const motivoInput =
    document.getElementById("motivo");


  // ============================================================
  // URL DE GOOGLE APPS SCRIPT
  // ============================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbwOknPj0zHhF6Bx0pviaXQQuoDuvckndtlP_CjJU1aabPXQ_2bVAdRGGG9STi3B2ieqww/exec";


  // ============================================================
  // VARIABLE PARA EL PDF
  // ============================================================

  let lastData = null;


  // ============================================================
  // MOSTRAR / OCULTAR CUENTA O CELULAR
  // ============================================================

  if (
    modalidadCobro &&
    cuentaContainer &&
    numeroCuenta &&
    celularContainer &&
    numeroCelular
  ) {

    modalidadCobro.addEventListener("change", function () {

      // ----------------------------------------------------------
      // OCULTAR AMBOS CAMPOS
      // ----------------------------------------------------------

      cuentaContainer.style.display = "none";
      celularContainer.style.display = "none";


      // ----------------------------------------------------------
      // QUITAR OBLIGATORIEDAD
      // ----------------------------------------------------------

      numeroCuenta.required = false;
      numeroCelular.required = false;


      // ----------------------------------------------------------
      // LIMPIAR CAMPOS
      // ----------------------------------------------------------

      numeroCuenta.value = "";
      numeroCelular.value = "";


      // ----------------------------------------------------------
      // ABONO EN CUENTA
      // ----------------------------------------------------------

      if (this.value === "ABONO EN CUENTA") {

        cuentaContainer.style.display = "block";

        numeroCuenta.required = true;

        setTimeout(() => {
          numeroCuenta.focus();
        }, 100);
      }


      // ----------------------------------------------------------
      // BILLETERA MÓVIL YASTA
      // ----------------------------------------------------------

      if (this.value === "BILLETERA MÓVIL YASTA") {

        celularContainer.style.display = "block";

        numeroCelular.required = true;

        setTimeout(() => {
          numeroCelular.focus();
        }, 100);
      }

    });
  }


  // ============================================================
  // MOSTRAR / OCULTAR MOTIVO
  // ============================================================

  if (
    entregaCedulaSelect &&
    motivoContainer &&
    motivoInput
  ) {

    entregaCedulaSelect.addEventListener("change", () => {

      if (entregaCedulaSelect.value === "No") {

        motivoContainer.style.display = "block";

        motivoInput.required = true;

        setTimeout(() => {
          motivoInput.focus();
        }, 100);

      } else {

        motivoContainer.style.display = "none";

        motivoInput.required = false;

        motivoInput.value = "";
      }

    });
  }


  // ============================================================
  // ENVÍO DEL FORMULARIO
  // ============================================================

  if (form) {

    form.addEventListener("submit", async (e) => {

      e.preventDefault();


      // ========================================================
      // LEER DATOS
      // ========================================================

      const estudiante =
        estudianteSelect
          ? estudianteSelect.value.trim()
          : "";

      const nombreTutor =
        nombreTutorInput
          ? nombreTutorInput.value.trim()
          : "";

      const parentesco =
        parentescoSelect
          ? parentescoSelect.value.trim()
          : "";

      const cedulaTutor =
        cedulaTutorInput
          ? cedulaTutorInput.value.trim()
          : "";

      const modalidad =
        modalidadCobro
          ? modalidadCobro.value.trim()
          : "";

      const cuenta =
        numeroCuenta
          ? numeroCuenta.value.trim()
          : "";

      const celular =
        numeroCelular
          ? numeroCelular.value.trim()
          : "";

      const entregaCedula =
        entregaCedulaSelect
          ? entregaCedulaSelect.value
          : "";

      const motivo =
        motivoInput
          ? motivoInput.value.trim()
          : "";


      // ========================================================
      // VALIDACIONES
      // ========================================================

      if (!estudiante) {

        alert("⚠️ Seleccione un estudiante.");

        if (estudianteSelect) {
          estudianteSelect.focus();
        }

        return;
      }


      if (!nombreTutor) {

        alert(
          "⚠️ Ingrese el nombre completo del padre, madre o tutor."
        );

        if (nombreTutorInput) {
          nombreTutorInput.focus();
        }

        return;
      }


      if (!parentesco) {

        alert("⚠️ Seleccione el parentesco.");

        if (parentescoSelect) {
          parentescoSelect.focus();
        }

        return;
      }


      if (!cedulaTutor) {

        alert(
          "⚠️ Ingrese el número de cédula del padre/madre/tutor."
        );

        if (cedulaTutorInput) {
          cedulaTutorInput.focus();
        }

        return;
      }


      if (!modalidad) {

        alert(
          "⚠️ Seleccione la modalidad de cobro."
        );

        if (modalidadCobro) {
          modalidadCobro.focus();
        }

        return;
      }


      // ========================================================
      // VALIDAR CUENTA
      // ========================================================

      if (
        modalidad === "ABONO EN CUENTA" &&
        !cuenta
      ) {

        alert(
          "⚠️ Ingrese el N.º de cuenta del Banco Unión."
        );

        if (numeroCuenta) {
          numeroCuenta.focus();
        }

        return;
      }


      // ========================================================
      // VALIDAR CELULAR YASTA
      // ========================================================

      if (
        modalidad === "BILLETERA MÓVIL YASTA" &&
        !celular
      ) {

        alert(
          "⚠️ Ingrese el N.º de celular de la Billetera Móvil YASTA."
        );

        if (numeroCelular) {
          numeroCelular.focus();
        }

        return;
      }


      // Validar que el celular tenga 8 dígitos
      if (
        modalidad === "BILLETERA MÓVIL YASTA" &&
        !/^\d{8}$/.test(celular)
      ) {

        alert(
          "⚠️ El N.º de celular debe tener exactamente 8 dígitos."
        );

        if (numeroCelular) {
          numeroCelular.focus();
        }

        return;
      }


      // ========================================================
      // VALIDAR CÉDULA
      // ========================================================

      if (!entregaCedula) {

        alert(
          "⚠️ Indique si entregó la fotocopia de la Cédula de Identidad."
        );

        if (entregaCedulaSelect) {
          entregaCedulaSelect.focus();
        }

        return;
      }


      // ========================================================
      // VALIDAR MOTIVO
      // ========================================================

      if (
        entregaCedula === "No" &&
        !motivo
      ) {

        alert(
          "⚠️ Por favor indique el motivo de la no entrega."
        );

        if (motivoInput) {
          motivoInput.focus();
        }

        return;
      }


      // ========================================================
      // FECHA Y HORA
      // ========================================================

      const fecha =
        new Date().toLocaleString(
          "es-BO",
          {
            timeZone: "America/La_Paz"
          }
        );


      // ========================================================
      // CREAR OBJETO DE DATOS
      // ========================================================

      lastData = {

        "Estudiante":
          estudiante,

        "Padre/Madre/Tutor":
          nombreTutor,

        "Parentesco":
          parentesco,

        "Cédula del Tutor":
          cedulaTutor,

        "Modalidad de cobro":
          modalidad,

        "Nro. de cuenta":
          modalidad === "ABONO EN CUENTA"
            ? cuenta
            : "N/A",

        "Nro. de celular":
          modalidad === "BILLETERA MÓVIL YASTA"
            ? celular
            : "N/A",

        "Cédula entregada":
          entregaCedula,

        "Motivo":
          entregaCedula === "No"
            ? motivo
            : "N/A",

        "Fecha":
          fecha
      };


      // ========================================================
      // MOSTRAR CARGANDO
      // ========================================================

      if (loading) {
        loading.style.display = "flex";
      }

      if (sendButton) {

        sendButton.disabled = true;

        sendButton.style.opacity = "0.6";

        sendButton.style.cursor = "not-allowed";
      }


      // ========================================================
      // ENVIAR A GOOGLE APPS SCRIPT
      // ========================================================

      try {

        if (
          !URL_APPS_SCRIPT ||
          URL_APPS_SCRIPT.includes("PEGAR_AQUI")
        ) {

          throw new Error(
            "No se configuró la URL de Google Apps Script."
          );
        }


        const datosEnviar =
          new URLSearchParams();

        datosEnviar.append(
          "data",
          JSON.stringify(lastData)
        );


        const respuesta =
          await fetch(
            URL_APPS_SCRIPT,
            {
              method: "POST",
              body: datosEnviar
            }
          );


        // ======================================================
        // LEER RESPUESTA
        // ======================================================

        let resultado = null;

        try {

          resultado =
            await respuesta.json();

        } catch (error) {

          console.log(
            "Respuesta recibida sin JSON:",
            error
          );
        }


        if (!respuesta.ok) {

          throw new Error(
            "El servidor respondió con error: " +
            respuesta.status
          );
        }


        if (
          resultado &&
          resultado.success === false
        ) {

          throw new Error(
            resultado.message ||
            "No se pudo guardar el registro."
          );
        }


        // ======================================================
        // ÉXITO
        // ======================================================

        modalMensaje.textContent =
          "✅ ¡Formulario enviado y guardado correctamente!";

        modal.style.display = "flex";

        descargarPDF.style.display =
          "inline-block";


        // ======================================================
        // LIMPIAR FORMULARIO
        // ======================================================

        form.reset();


        // Ocultar cuenta

        if (cuentaContainer) {

          cuentaContainer.style.display =
            "none";
        }


        if (numeroCuenta) {

          numeroCuenta.required = false;

          numeroCuenta.value = "";
        }


        // Ocultar celular

        if (celularContainer) {

          celularContainer.style.display =
            "none";
        }


        if (numeroCelular) {

          numeroCelular.required = false;

          numeroCelular.value = "";
        }


        // Ocultar motivo

        if (motivoContainer) {

          motivoContainer.style.display =
            "none";
        }


        if (motivoInput) {

          motivoInput.required = false;

          motivoInput.value = "";
        }


      } catch (err) {

        console.error(
          "Error al enviar:",
          err
        );

        modalMensaje.textContent =
          "❌ No se pudo guardar el formulario.\n\n" +
          (err.message || err);

        modal.style.display = "flex";

        descargarPDF.style.display =
          "none";

      } finally {

        // ======================================================
        // QUITAR CARGANDO
        // ======================================================

        if (loading) {

          loading.style.display =
            "none";
        }

        if (sendButton) {

          sendButton.disabled = false;

          sendButton.style.opacity = "1";

          sendButton.style.cursor =
            "pointer";
        }

      }

    });
  }


  // ============================================================
  // DESCARGAR PDF
  // ============================================================

  if (descargarPDF) {

    descargarPDF.addEventListener(
      "click",
      () => {

        if (!lastData) {

          alert(
            "No existen datos para generar el PDF."
          );

          return;
        }


        try {

          const { jsPDF } =
            window.jspdf;

          const doc =
            new jsPDF();


          // ====================================================
          // ENCABEZADO
          // ====================================================

          doc.setFontSize(14);

          doc.text(
            "Registro de Padres y Tutores",
            20,
            20
          );


          doc.setFontSize(11);

          doc.text(
            "Unidad Educativa Jupapina - Tercero de Secundaria",
            20,
            28
          );


          doc.setFontSize(10);

          doc.text(
            "Registro y actualización para el Bono Juancito Pinto",
            20,
            35
          );


          // ====================================================
          // TABLA
          // ====================================================

          const tableBody = [

            [
              "Estudiante",
              lastData.Estudiante || ""
            ],

            [
              "Padre/Madre/Tutor",
              lastData["Padre/Madre/Tutor"] || ""
            ],

            [
              "Parentesco",
              lastData.Parentesco || ""
            ],

            [
              "Cédula del Tutor",
              lastData["Cédula del Tutor"] || ""
            ],

            [
              "Modalidad de cobro",
              lastData["Modalidad de cobro"] || ""
            ],

            [
              "N.º de cuenta",
              lastData["Nro. de cuenta"] || "N/A"
            ],

            [
              "N.º de celular",
              lastData["Nro. de celular"] || "N/A"
            ],

            [
              "Cédula entregada",
              lastData["Cédula entregada"] || ""
            ],

            [
              "Motivo",
              lastData.Motivo || ""
            ],

            [
              "Fecha y Hora",
              lastData.Fecha || ""
            ]

          ];


          // ====================================================
          // GENERAR TABLA
          // ====================================================

          doc.autoTable({

            startY: 43,

            head: [
              [
                "Campo",
                "Valor"
              ]
            ],

            body: tableBody,

            styles: {

              fontSize: 10,

              cellPadding: 3,

              overflow: "linebreak"

            },

            headStyles: {

              fillColor: [
                41,
                128,
                185
              ],

              textColor: [
                255,
                255,
                255
              ],

              halign: "center"

            },

            columnStyles: {

              0: {
                cellWidth: 55
              },

              1: {
                cellWidth: 125
              }

            }

          });


          // ====================================================
          // PIE DEL DOCUMENTO
          // ====================================================
          const finalY =
            doc.lastAutoTable.finalY + 15;

          doc.setFontSize(9);

          doc.text(
            "Verifique el documento generado. Si detecta algún error, comuníquese con el asesor al 73747321.",
            20,
            finalY
          );


          // ====================================================
          // FIRMA PADRE/MADRE/TUTOR
          // ====================================================

          const firmaY =
            finalY + 25;

          doc.setFontSize(10);

          doc.line(
            65,
            firmaY,
            145,
            firmaY
          );

          doc.text(
            "FIRMA PADRE/MADRE/TUTOR",
            105,
            firmaY + 7,
            {
              align: "center"
            }
          );


          // ====================================================
          // NOMBRE DEL ARCHIVO
          // ====================================================

          const nombreArchivo =
            (
              lastData.Estudiante ||
              "sin_nombre"
            )
              .replace(/\s+/g, "_")
              .replace(
                /[^a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ_-]/g,
                ""
              );


          const fileName =
            `Registro_Bono_Juancito_Pinto_${nombreArchivo}.pdf`;


          // ====================================================
          // GUARDAR PDF
          // ====================================================

          doc.save(fileName);


        } catch (err) {

          console.error(
            "Error al generar PDF:",
            err
          );

          alert(
            "❌ Error al generar PDF: " +
            (err.message || err)
          );

        }

      }
    );
  }


  // ============================================================
  // CERRAR MODAL
  // ============================================================

  if (cerrarModal) {

    cerrarModal.addEventListener(
      "click",
      () => {

        modal.style.display =
          "none";

      }
    );
  }


  // ============================================================
  // CERRAR MODAL AL HACER CLIC FUERA
  // ============================================================

  if (modal) {

    modal.addEventListener(
      "click",
      (e) => {

        if (e.target === modal) {

          modal.style.display =
            "none";

        }

      }
    );
  }

});
