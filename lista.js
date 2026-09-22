document.addEventListener("DOMContentLoaded", function () {

  // ============================================================
  // ELEMENTOS PRINCIPALES
  // ============================================================

  const form = document.getElementById("formRegistro");

  const sendButton = document.getElementById("sendList");

  const loading = document.getElementById("loading");

  const loadingText =
    document.querySelector(".loading-text");

  const modal = document.getElementById("modal");

  const modalMensaje =
    document.getElementById("modal-mensaje");

  const cerrarModal =
    document.getElementById("cerrar-modal");

  const descargarPDF =
    document.getElementById("descargarPDF");


  // ============================================================
  // DATOS DEL ESTUDIANTE
  // ============================================================

  const estudiante =
    document.getElementById("estudiante");

  const nombreTutor =
    document.getElementById("nombreTutor");

  const parentesco =
    document.getElementById("parentesco");

  const cedulaTutor =
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
  // CÉDULA ENTREGADA
  // ============================================================

  const entregaCedula =
    document.getElementById("entregaCedula");

  const motivoContainer =
    document.getElementById("motivoContainer");

  const motivoInput =
    document.getElementById("motivo");


  // ============================================================
  // FOTOGRAFÍAS
  // ============================================================

  const fotosCedulaContainer =
    document.getElementById("fotosCedulaContainer");

  const fotoCI1Input =
    document.getElementById("fotoCI1");

  const fotoCI2Input =
    document.getElementById("fotoCI2");

  const previewCI1 =
    document.getElementById("previewCI1");

  const previewCI2 =
    document.getElementById("previewCI2");


  // ============================================================
  // VARIABLES DE FOTOGRAFÍAS
  // ============================================================

  let fotoCI1Data = "";

  let fotoCI2Data = "";


  // ============================================================
  // URL ACTUAL DE APPS SCRIPT
  // ============================================================

  const URL_APPS_SCRIPT =
    "https://script.google.com/macros/s/AKfycbx2oGydI1J6jGXKeIXLrQjd7dNEGyFk00rIaDC9doNL29hRwho4DVqwCa_T-rbBcaJKqA/exec";


  // ============================================================
  // ÚLTIMOS DATOS GUARDADOS PARA PDF
  // ============================================================

  let lastData = null;


  // ============================================================
  // MOSTRAR / OCULTAR CAMPOS SEGÚN MODALIDAD
  // ============================================================

  modalidadCobro.addEventListener("change", function () {

    const modalidad = modalidadCobro.value;


    // ----------------------------------------------------------
    // ABONO EN CUENTA
    // ----------------------------------------------------------

    if (modalidad === "ABONO EN CUENTA") {

      cuentaContainer.style.display = "block";

      numeroCuenta.required = true;

      numeroCuenta.focus();

    } else {

      cuentaContainer.style.display = "none";

      numeroCuenta.required = false;

      numeroCuenta.value = "";

    }


    // ----------------------------------------------------------
    // BILLETERA MÓVIL YASTA
    // ----------------------------------------------------------

    if (modalidad === "BILLETERA MÓVIL YASTA") {

      celularContainer.style.display = "block";

      numeroCelular.required = true;

      numeroCelular.focus();

    } else {

      celularContainer.style.display = "none";

      numeroCelular.required = false;

      numeroCelular.value = "";

    }

  });


  // ============================================================
  // LIMPIAR FOTOGRAFÍAS
  // ============================================================

  function limpiarFotosCedula() {

    fotoCI1Data = "";

    fotoCI2Data = "";

    fotoCI1Input.value = "";

    fotoCI2Input.value = "";

    previewCI1.innerHTML = "";

    previewCI2.innerHTML = "";

    fotoCI1Input.required = false;

  }


  // ============================================================
  // MOSTRAR / OCULTAR CÉDULA Y FOTOGRAFÍAS
  // ============================================================

  entregaCedula.addEventListener("change", function () {

    const valor = entregaCedula.value;


    // ----------------------------------------------------------
    // SI NO ENTREGA FOTOCOPIA
    // ----------------------------------------------------------

    if (valor === "No") {

      // Mostrar motivo
      motivoContainer.style.display = "block";

      motivoInput.required = true;


      // Mostrar fotografías
      fotosCedulaContainer.style.display = "block";

      fotoCI1Input.required = true;


    } else {

      // Ocultar motivo
      motivoContainer.style.display = "none";

      motivoInput.required = false;

      motivoInput.value = "";


      // Ocultar fotografías
      fotosCedulaContainer.style.display = "none";

      limpiarFotosCedula();

    }

  });


  // ============================================================
  // COMPRIMIR IMAGEN
  // ============================================================

  function comprimirImagen(archivo) {

    return new Promise(function (resolve, reject) {

      if (!archivo) {

        reject(
          new Error("No se seleccionó ninguna imagen.")
        );

        return;
      }


      // --------------------------------------------------------
      // VERIFICAR QUE SEA UNA IMAGEN
      // --------------------------------------------------------

      if (!archivo.type.startsWith("image/")) {

        reject(
          new Error(
            "El archivo seleccionado no es una imagen."
          )
        );

        return;
      }


      // --------------------------------------------------------
      // TAMAÑO MÁXIMO ORIGINAL
      // --------------------------------------------------------

      if (archivo.size > 10 * 1024 * 1024) {

        reject(
          new Error(
            "La imagen es demasiado grande. Seleccione una fotografía menor a 10 MB."
          )
        );

        return;
      }


      const lector = new FileReader();


      lector.onload = function (evento) {

        const imagen = new Image();


        imagen.onload = function () {

          let ancho = imagen.width;

          let alto = imagen.height;


          // ----------------------------------------------------
          // REDUCIR A MÁXIMO 1400 PX
          // ----------------------------------------------------

          const maximo = 1400;


          if (ancho > maximo || alto > maximo) {

            if (ancho > alto) {

              alto =
                Math.round(
                  alto * maximo / ancho
                );

              ancho = maximo;

            } else {

              ancho =
                Math.round(
                  ancho * maximo / alto
                );

              alto = maximo;

            }

          }


          // ----------------------------------------------------
          // CANVAS
          // ----------------------------------------------------

          const canvas =
            document.createElement("canvas");

          canvas.width = ancho;

          canvas.height = alto;


          const contexto =
            canvas.getContext("2d");


          contexto.drawImage(
            imagen,
            0,
            0,
            ancho,
            alto
          );


          // ----------------------------------------------------
          // CONVERTIR A JPEG
          // ----------------------------------------------------

          const resultado =
            canvas.toDataURL(
              "image/jpeg",
              0.70
            );


          resolve(resultado);

        };


        imagen.onerror = function () {

          reject(
            new Error(
              "No se pudo procesar la imagen."
            )
          );

        };


        imagen.src = evento.target.result;

      };


      lector.onerror = function () {

        reject(
          new Error(
            "No se pudo leer la imagen."
          )
        );

      };


      lector.readAsDataURL(archivo);

    });

  }


  // ============================================================
  // CARGAR FOTO 1
  // ============================================================

  fotoCI1Input.addEventListener(
    "change",
    async function () {

      const archivo = fotoCI1Input.files[0];


      if (!archivo) {

        fotoCI1Data = "";

        previewCI1.innerHTML = "";

        return;

      }


      previewCI1.innerHTML =
        "<p>⏳ Procesando fotografía...</p>";


      try {

        fotoCI1Data =
          await comprimirImagen(archivo);


        previewCI1.innerHTML =
          `
          <div class="preview-ci-contenedor">

            <img
              src="${fotoCI1Data}"
              alt="Vista previa C.I. 1"
            >

            <p>
              ✅ Fotografía 1 cargada correctamente.
            </p>

          </div>
          `;

      } catch (error) {

        fotoCI1Data = "";

        previewCI1.innerHTML =
          `
          <p>
            ❌ ${error.message}
          </p>
          `;

        fotoCI1Input.value = "";

      }

    }
  );


  // ============================================================
  // CARGAR FOTO 2
  // ============================================================

  fotoCI2Input.addEventListener(
    "change",
    async function () {

      const archivo = fotoCI2Input.files[0];


      if (!archivo) {

        fotoCI2Data = "";

        previewCI2.innerHTML = "";

        return;

      }


      previewCI2.innerHTML =
        "<p>⏳ Procesando fotografía...</p>";


      try {

        fotoCI2Data =
          await comprimirImagen(archivo);


        previewCI2.innerHTML =
          `
          <div class="preview-ci-contenedor">

            <img
              src="${fotoCI2Data}"
              alt="Vista previa C.I. 2"
            >

            <p>
              ✅ Fotografía 2 cargada correctamente.
            </p>

          </div>
          `;

      } catch (error) {

        fotoCI2Data = "";

        previewCI2.innerHTML =
          `
          <p>
            ❌ ${error.message}
          </p>
          `;

        fotoCI2Input.value = "";

      }

    }
  );


  // ============================================================
  // ENVÍO DEL FORMULARIO
  // ============================================================

  form.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();


      // --------------------------------------------------------
      // OBTENER DATOS
      // --------------------------------------------------------

      const estudianteValor =
        estudiante.value.trim();

      const nombreTutorValor =
        nombreTutor.value.trim();

      const parentescoValor =
        parentesco.value.trim();

      const cedulaTutorValor =
        cedulaTutor.value.trim();

      const modalidadValor =
        modalidadCobro.value.trim();

      const cuentaValor =
        numeroCuenta.value.trim();

      const celularValor =
        numeroCelular.value.trim();

      const entregaCedulaValor =
        entregaCedula.value.trim();

      const motivoValor =
        motivoInput.value.trim();


      // --------------------------------------------------------
      // VALIDACIONES
      // --------------------------------------------------------

      if (!estudianteValor) {

        alert(
          "Seleccione un estudiante."
        );

        return;

      }


      if (!nombreTutorValor) {

        alert(
          "Ingrese el nombre completo del padre, madre o tutor."
        );

        nombreTutor.focus();

        return;

      }


      if (!parentescoValor) {

        alert(
          "Seleccione el parentesco."
        );

        parentesco.focus();

        return;

      }


      if (!cedulaTutorValor) {

        alert(
          "Ingrese el número de Cédula de Identidad."
        );

        cedulaTutor.focus();

        return;

      }


      if (!modalidadValor) {

        alert(
          "Seleccione la modalidad de cobro."
        );

        modalidadCobro.focus();

        return;

      }


      // --------------------------------------------------------
      // VALIDAR CUENTA
      // --------------------------------------------------------

      if (
        modalidadValor === "ABONO EN CUENTA" &&
        !cuentaValor
      ) {

        alert(
          "Ingrese el número de cuenta del Banco Unión."
        );

        numeroCuenta.focus();

        return;

      }


      // --------------------------------------------------------
      // VALIDAR CELULAR
      // --------------------------------------------------------

      if (
        modalidadValor ===
        "BILLETERA MÓVIL YASTA"
      ) {

        if (!celularValor) {

          alert(
            "Ingrese el número de celular."
          );

          numeroCelular.focus();

          return;

        }


        if (!/^\d{8}$/.test(celularValor)) {

          alert(
            "El número de celular debe tener exactamente 8 dígitos."
          );

          numeroCelular.focus();

          return;

        }

      }


      // --------------------------------------------------------
      // VALIDAR ENTREGA CÉDULA
      // --------------------------------------------------------

      if (!entregaCedulaValor) {

        alert(
          "Seleccione si entregó la fotocopia de Cédula de Identidad."
        );

        entregaCedula.focus();

        return;

      }


      // --------------------------------------------------------
      // VALIDAR MOTIVO
      // --------------------------------------------------------

      if (
        entregaCedulaValor === "No" &&
        !motivoValor
      ) {

        alert(
          "Indique el motivo por el cual no entregó la fotocopia."
        );

        motivoInput.focus();

        return;

      }


      // --------------------------------------------------------
      // VALIDAR FOTO 1
      // --------------------------------------------------------

      if (
        entregaCedulaValor === "No" &&
        !fotoCI1Data
      ) {

        alert(
          "Debe tomar o seleccionar la Fotografía 1 de la Cédula de Identidad."
        );

        fotoCI1Input.focus();

        return;

      }


      // --------------------------------------------------------
      // FECHA
      // --------------------------------------------------------

      const fecha =
        new Date().toLocaleString(
          "es-BO",
          {
            timeZone: "America/La_Paz"
          }
        );


      // --------------------------------------------------------
      // DATOS PARA GOOGLE SHEETS
      // --------------------------------------------------------

      lastData = {

        "Estudiante":
          estudianteValor,

        "Padre/Madre/Tutor":
          nombreTutorValor,

        "Parentesco":
          parentescoValor,

        "Cédula del Tutor":
          cedulaTutorValor,

        "Modalidad de cobro":
          modalidadValor,

        "Nro. de cuenta":
          modalidadValor === "ABONO EN CUENTA"
            ? cuentaValor
            : "N/A",

        "Nro. de celular":
          modalidadValor ===
          "BILLETERA MÓVIL YASTA"
            ? celularValor
            : "N/A",

        "Cédula entregada":
          entregaCedulaValor,

        "Motivo":
          entregaCedulaValor === "No"
            ? motivoValor
            : "N/A",

        "Foto C.I. 1":
          entregaCedulaValor === "No"
            ? fotoCI1Data
            : "",

        "Foto C.I. 2":
          entregaCedulaValor === "No"
            ? fotoCI2Data
            : "",

        "Fecha":
          fecha

      };


      // --------------------------------------------------------
      // CARGANDO
      // --------------------------------------------------------

      sendButton.disabled = true;

      loading.style.display = "flex";

      if (loadingText) {

        loadingText.textContent =
          "⏳ Guardando registro...";

      }


      try {

        // ------------------------------------------------------
        // ENVIAR A APPS SCRIPT
        // ------------------------------------------------------

        const parametros =
          new URLSearchParams();

        parametros.append(
          "data",
          JSON.stringify(lastData)
        );


        const respuesta =
          await fetch(
            URL_APPS_SCRIPT,
            {
              method: "POST",
              body: parametros
            }
          );


        const texto =
          await respuesta.text();


        let resultado;


        try {

          resultado =
            JSON.parse(texto);

        } catch (error) {

          throw new Error(
            "La respuesta del servidor no tiene un formato válido."
          );

        }


        if (!resultado.success) {

          throw new Error(
            resultado.message ||
            "No se pudo guardar el registro."
          );

        }


        // ------------------------------------------------------
        // ÉXITO
        // ------------------------------------------------------

        modalMensaje.innerHTML =
          `
          <strong>✅ Registro guardado correctamente.</strong>
          <br><br>
          El registro de
          <strong>${estudianteValor}</strong>
          fue guardado correctamente.
          <br><br>
          Puede descargar el comprobante en PDF.
          `;


        modal.style.display = "flex";

        descargarPDF.style.display = "inline-block";


        // ------------------------------------------------------
        // LIMPIAR FORMULARIO
        // ------------------------------------------------------

        form.reset();


        cuentaContainer.style.display = "none";

        celularContainer.style.display = "none";

        numeroCuenta.required = false;

        numeroCelular.required = false;


        motivoContainer.style.display = "none";

        motivoInput.required = false;


        fotosCedulaContainer.style.display = "none";

        limpiarFotosCedula();


        if (loadingText) {

          loadingText.textContent =
            "⏳ Procesando...";

        }


      } catch (error) {

        console.error(error);


        alert(
          "❌ No se pudo guardar el registro.\n\n" +
          error.message
        );


      } finally {

        sendButton.disabled = false;

        loading.style.display = "none";

      }

    }
  );


  // ============================================================
  // GENERAR PDF
  // ============================================================

  descargarPDF.addEventListener(
    "click",
    function () {

      if (!lastData) {

        alert(
          "No existen datos para generar el PDF."
        );

        return;

      }


      const {
        jsPDF
      } = window.jspdf;


      const doc =
        new jsPDF();


      // --------------------------------------------------------
      // ENCABEZADO
      // --------------------------------------------------------

      doc.setFontSize(16);

      doc.text(
        "Registro de Padres y Tutores",
        105,
        20,
        {
          align: "center"
        }
      );


      doc.setFontSize(12);

      doc.text(
        "Unidad Educativa Jupapina - Segundo de Secundaria",
        105,
        29,
        {
          align: "center"
        }
      );


      doc.setFontSize(10);

      doc.text(
        "Registro y actualización para el Bono Juancito Pinto",
        105,
        37,
        {
          align: "center"
        }
      );


      // --------------------------------------------------------
      // TABLA
      // --------------------------------------------------------

      const filas = [

        [
          "Estudiante",
          lastData["Estudiante"]
        ],

        [
          "Padre/Madre/Tutor",
          lastData["Padre/Madre/Tutor"]
        ],

        [
          "Parentesco",
          lastData["Parentesco"]
        ],

        [
          "Cédula del Tutor",
          lastData["Cédula del Tutor"]
        ],

        [
          "Modalidad de cobro",
          lastData["Modalidad de cobro"]
        ],

        [
          "Nro. de cuenta",
          lastData["Nro. de cuenta"]
        ],

        [
          "Nro. de celular",
          lastData["Nro. de celular"]
        ],

        [
          "Cédula entregada",
          lastData["Cédula entregada"]
        ],

        [
          "Motivo",
          lastData["Motivo"]
        ],

        [
          "Fecha",
          lastData["Fecha"]
        ]

      ];


      doc.autoTable({

        startY: 45,

        head: [
          [
            "Campo",
            "Información"
          ]
        ],

        body: filas,

        theme: "grid",

        styles: {
          fontSize: 9
        },

        headStyles: {
          fontSize: 9
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


      // --------------------------------------------------------
      // ADVERTENCIA
      // --------------------------------------------------------

      const finalY =
        doc.lastAutoTable.finalY + 15;


      doc.setFontSize(9);


      doc.text(
        "Verifique el documento generado. Si detecta algún error, comuníquese con el asesor al 73747321.",
        20,
        finalY
      );


      // ========================================================
      // FIRMA PADRE/MADRE/TUTOR
      // ========================================================

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


      // --------------------------------------------------------
      // DESCARGAR
      // --------------------------------------------------------

      const nombreArchivo =
        lastData["Estudiante"]
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_");


      doc.save(
        "Registro_Bono_" +
        nombreArchivo +
        ".pdf"
      );

    }
  );


  // ============================================================
  // CERRAR MODAL
  // ============================================================

  cerrarModal.addEventListener(
    "click",
    function () {

      modal.style.display = "none";

      descargarPDF.style.display = "none";

    }
  );


  // ============================================================
  // CERRAR MODAL HACIENDO CLICK AFUERA
  // ============================================================

  window.addEventListener(
    "click",
    function (event) {

      if (event.target === modal) {

        modal.style.display = "none";

        descargarPDF.style.display = "none";

      }

    }
  );

});
