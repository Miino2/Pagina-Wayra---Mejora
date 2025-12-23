function resetProyectosSection() {
    // Oculta el detalle del proyecto
    document.getElementById("proyecto-detalle-section").style.display = "none";
    // Muestra la lista
    document.getElementById("proyectos-list-section").style.display = "block";
    // Muestra el menú lateral si lo ocultaste con clase hidden
    const menu = document.querySelector('.proyectos-menu');
    if (menu) menu.classList.remove('hidden');
    // Desbloquea botones si tienes esa función
    if (typeof desbloquearBotones === "function") desbloquearBotones();
    // Limpia el detalle
    document.getElementById("proyecto-detalle").innerHTML = "";
    // Cierra el modal si abierto
    const modal = document.getElementById('modal-imagen');
    if (modal) {
      modal.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
}

function resetCotizacionForm() {
  // Resetea el formulario
  const form = document.getElementById("formCotizacion");
  if (form) {
    form.reset();
  }
  // Resetea campos visuales del cajón y selects personalizados
  if (typeof entidadSeleccionada !== "undefined" && entidadSeleccionada) entidadSeleccionada.textContent = 'Seleccione...';
  if (typeof servicioSeleccionado !== "undefined" && servicioSeleccionado) servicioSeleccionado.textContent = 'Seleccione...';
  if (typeof inputEntidad !== "undefined" && inputEntidad) inputEntidad.value = '';
  if (typeof inputServicio !== "undefined" && inputServicio) inputServicio.value = '';
  if (typeof cuadradoPublica !== "undefined" && cuadradoPublica) cuadradoPublica.classList.remove('selected');
  if (typeof cuadradoPrivada !== "undefined" && cuadradoPrivada) cuadradoPrivada.classList.remove('selected');
  if (typeof cuadradoProyecto !== "undefined" && cuadradoProyecto) cuadradoProyecto.classList.remove('selected');
  if (typeof cuadradoExpediente !== "undefined" && cuadradoExpediente) cuadradoExpediente.classList.remove('selected');
  if (typeof cuadradoMantenimiento !== "undefined" && cuadradoMantenimiento) cuadradoMantenimiento.classList.remove('selected');
  if (typeof mensajeArchivo !== "undefined" && mensajeArchivo) mensajeArchivo.innerHTML = '';
  const resultado = document.getElementById('resultado');
  if (resultado) resultado.innerHTML = '';
  if (typeof validarFormulario === "function") validarFormulario();
  // Elimina los estados visuales de los inputs
  document.querySelectorAll('#formCotizacion .input-icon, #formCotizacion .input-textarea').forEach(wrapper => {
    wrapper.classList.remove('filled', 'focused', 'error');
  });
}

function resetContactoForm() {
  // Si tu formulario de contacto tiene clase "contacto-form", esto lo encuentra:
  const form = document.querySelector('.contacto-form');
  if (form) form.reset();
}

// --- Navegación entre seccione ---
function showSection(section) {
    // Ocultamos todas las secciones
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('visible'));

    // Mostramos la sección seleccionada
    const target = document.getElementById(section);
    if (target) {
        target.classList.add('visible');
      }

       // Quitar la clase `active` de todos los enlaces
    document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));

    // Agregar la clase `active` al enlace correspondiente
    const activeLink = document.querySelector(`.nav-menu a[onclick="showSection('${section}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

        // Si es la sección proyectos, hacer reset visual y cargar lista
        if (section === "proyectos") {
            resetProyectosSection(); // <--- NUEVO: siempre resetea antes
            proyectosPage = 1;
            renderProyectos();
        }
    

    // Resetea el formulario de cotización si NO estamos en la sección de cotización
    if (section !== "cotizacion") {
        resetCotizacionForm();
    }
    
    if (section !== "contacto") {
    resetContactoForm();
    }

    // Menú interno de "Quiénes Somos"
    if (section === "quienes") showQS('empresa');

    //Cambiar estilo del encabezado según sección ---
    const header = document.querySelector('header');
    if (!header) return; // seguridad

    if (section === 'inicio') {
        header.classList.remove('scrolled'); // transparente
    } else {
        header.classList.add('scrolled'); // sólido (color o fondo definido en CSS)
    }
}


// Solo inicio visible
window.onload = function () {
    showSection('inicio');
};

// -------- SLIDER CON EFECTO PUSH --------

// Seleccionamos el contenedor del slider y las imágenes
const slider = document.querySelector('.slider');
let slides = document.querySelectorAll('.slider img');
let index = 0;
const slideInterval = 4000; // Tiempo entre cada cambio

// Clonar la primera imagen y agregarla al final
const firstClone = slides[0].cloneNode(true);
slider.appendChild(firstClone);

// Actualizamos la lista de imágenes (ahora hay una extra)
slides = document.querySelectorAll('.slider img');

function changeSlide() {
    index++;
    slider.style.transition = "transform 1s ease-in-out";
    slider.style.transform = `translateX(${-index * 100}%)`;

    // Cuando llegamos al clon, saltamos a la primera imagen real sin animación
    if (index === slides.length - 1) {
        setTimeout(() => {
            slider.style.transition = "none"; // Quitamos animación temporalmente
            slider.style.transform = `translateX(0)`; // Volvemos al inicio real
            index = 0; // Reiniciamos el índice
        }, 1000); // Coincide con la duración de la transición
    }
}

// Cambiar cada 4 segundos
setInterval(changeSlide, slideInterval);

// ------ QUIENES SOMOS: menú interactivo ------
function showQS(opcion) {
    document.querySelectorAll('.qs-content').forEach(sec => sec.classList.remove('visible'));
    document.getElementById('info-' + opcion).classList.add('visible');
    document.querySelectorAll('.qs-menu button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('qs-' + opcion).classList.add('active');
}

// ------ REALIZAR COTIZACION ------
// === SCRIPT: floating label + foco + error (no toca selects) ===
document.addEventListener('DOMContentLoaded', function () {
  // seleccionar todos los wrappers .input-icon y .input-textarea
  const wrappers = document.querySelectorAll('.input-icon, .input-textarea');

  wrappers.forEach(wrapper => {
    const field = wrapper.querySelector('.field');
    if (!field) return;
    const input = field.querySelector('input, textarea');
    const label = field.querySelector('.floating');
    const err = field.querySelector('.error-message');

    // inicializar filled si hay valor (por ejemplo navegadores con autocompletado)
    if (input.value && input.value.trim() !== '') {
      wrapper.classList.add('filled');
    }

    // focus
    input.addEventListener('focus', () => {
      wrapper.classList.add('focused');
      wrapper.classList.remove('error');
      if (err) { err.style.display = ''; }
    });

    // input -> marcar filled mientras tenga contenido
    input.addEventListener('input', () => {
      if (input.value && input.value.trim() !== '') {
        wrapper.classList.add('filled');
        wrapper.classList.remove('error');
      } else {
        wrapper.classList.remove('filled');
      }
    });

    // blur -> validar y mostrar advertencia si inválido (requerido/pattern/email)
    input.addEventListener('blur', () => {
      wrapper.classList.remove('focused');

      let invalid = false;
      const isRequired = input.hasAttribute('required');
      const valueEmpty = !input.value || input.value.trim() === '';

      if (isRequired && valueEmpty) invalid = true;

      // validación email simple
      if (!invalid && input.type === 'email' && input.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(input.value)) invalid = true;
      }

      // validación pattern si existe
      if (!invalid && input.pattern && input.value) {
        try {
          const re2 = new RegExp('^' + input.pattern + '$');
          if (!re2.test(input.value)) invalid = true;
        } catch(e) {
          // si pattern inválido, no marcar
        }
      }

      if (invalid) {
        wrapper.classList.add('error');
        // mostrar error (si existe mensaje)
        if (err) {
          err.style.display = 'block';
        }
      } else {
        wrapper.classList.remove('error');
        if (err) {
          err.style.display = 'none';
        }
      }
    });

    // click en icono o label -> enfocar input
    const icon = wrapper.querySelector('.icon');
    if (icon) {
      icon.addEventListener('click', () => input.focus());
    }
    if (label) {
      label.addEventListener('click', () => input.focus());
    }
  });

  // Al enviar el form, forzar validacion y scrollear al primer error (mantener tu lógica)
  const form = document.getElementById('formCotizacion');
  if (form) {
    form.addEventListener('submit', function (e) {
      let firstError = null;
      // disparamos blur para todos los campos para forzar validacion visual
      document.querySelectorAll('.input-icon .field input, .input-textarea .field textarea').forEach(i => {
        i.focus();
        i.blur();
        const wrap = i.closest('.input-icon, .input-textarea');
        if (wrap && wrap.classList.contains('error') && !firstError) firstError = wrap;
      });
      if (firstError) {
        e.preventDefault();
        firstError.scrollIntoView({behavior:'smooth', block:'center'});
      }
    });
  }
});


// --- Selector de tipo de entidad (nuevo cajón animado) ---
const cajonEntidad = document.getElementById('cajonEntidad');
const opcionesEntidad = document.getElementById('opcionesEntidad');
const entidadSeleccionada = document.getElementById('entidadSeleccionada');
const cuadradoPublica = document.getElementById('cuadradoPublica');
const cuadradoPrivada = document.getElementById('cuadradoPrivada');
const inputEntidad = document.getElementById('inputEntidad');
const flechaEntidad = document.getElementById('flechaEntidad');

cajonEntidad.querySelector('.cajon-opcion').addEventListener('click', () => {
  cajonEntidad.classList.toggle('open');
});

opcionesEntidad.querySelectorAll('.opcion-cajon').forEach((opcion, idx) => {
  opcion.addEventListener('click', () => {
    const valor = idx === 0 ? 'Pública' : 'Privada';
    entidadSeleccionada.textContent = valor;
    inputEntidad.value = valor;
    cuadradoPublica.classList.toggle('selected', idx === 0);
    cuadradoPrivada.classList.toggle('selected', idx === 1);
    cajonEntidad.classList.remove('open');
    validarFormulario();
  });
});

document.addEventListener('click', function (e) {
  if (!cajonEntidad.contains(e.target)) {
    cajonEntidad.classList.remove('open');
  }
});

// --- Selector de tipo de servicio (nuevo cajón animado) ---
const cajonServicio = document.getElementById('cajonServicio');
const opcionesServicio = document.getElementById('opcionesServicio');
const servicioSeleccionado = document.getElementById('servicioSeleccionado');
const cuadradoProyecto = document.getElementById('cuadradoProyecto');
const cuadradoExpediente = document.getElementById('cuadradoExpediente');
const cuadradoMantenimiento = document.getElementById('cuadradoMantenimiento');
const inputServicio = document.getElementById('inputServicio');
const flechaServicio = document.getElementById('flechaServicio');

cajonServicio.querySelector('.cajon-opcion').addEventListener('click', () => {
  cajonServicio.classList.toggle('open');
});

const servicioOpciones = [
  'Formulación de Proyecto de Inversión',
  'Elaboración de Expediente Técnico',
  'Mantenimiento'
];

opcionesServicio.querySelectorAll('.opcion-cajon').forEach((opcion, idx) => {
  opcion.addEventListener('click', () => {
    const valor = servicioOpciones[idx];
    servicioSeleccionado.textContent = valor;
    inputServicio.value = valor;
    cuadradoProyecto.classList.toggle('selected', idx === 0);
    cuadradoExpediente.classList.toggle('selected', idx === 1);
    cuadradoMantenimiento.classList.toggle('selected', idx === 2);
    cajonServicio.classList.remove('open');
    validarFormulario();
  });
});

document.addEventListener('click', function (e) {
  if (!cajonServicio.contains(e.target)) {
    cajonServicio.classList.remove('open');
  }
});

// --- Validación de campos obligatorios ---
const formCotizacion = document.getElementById('formCotizacion');
const btnEnviar = document.getElementById('btnEnviar');
const camposObligatorios = [
  'nombre', 'apellido', 'dni', 'direccion',
  'contacto', 'correo', 'empresa', 'ruc', 'detalle', 'inputEntidad', 'inputServicio'
];

function validarFormulario() {
  let valid = true;
  camposObligatorios.forEach(name => {
    const field = formCotizacion.elements[name];
    if (!field || !field.value.trim() || !field.checkValidity()) valid = false;
  });
  btnEnviar.disabled = !valid;
}

// Validar en cada cambio
formCotizacion.addEventListener('input', validarFormulario);

// --- Adjuntar archivos ---
const adjuntoInput = document.getElementById('adjunto');
const mensajeArchivo = document.getElementById('mensajeArchivo');

adjuntoInput.addEventListener('change', () => {
  if (adjuntoInput.files.length > 0) {
    mensajeArchivo.innerHTML = `<span class="check">&#10003;</span> Archivo subido con éxito`;
    mensajeArchivo.style.display = 'flex';
    mensajeArchivo.style.opacity = '1';
    setTimeout(() => {
      mensajeArchivo.style.opacity = '0';
      setTimeout(() => {
        mensajeArchivo.style.display = 'none';
        mensajeArchivo.innerHTML = '';
      }, 400); // coincide con la transición de opacity
    }, 5000); // 5 segundos visible
  } else {
    mensajeArchivo.style.display = 'none';
    mensajeArchivo.innerHTML = '';
  }
});

// --- Cancelar formulario ---
document.getElementById('btnCancelar').addEventListener('click', () => {
  formCotizacion.reset();
  entidadSeleccionada.textContent = 'Seleccione...';
  servicioSeleccionado.textContent = 'Seleccione...';
  inputEntidad.value = '';
  inputServicio.value = '';
  cuadradoPublica.classList.remove('selected');
  cuadradoPrivada.classList.remove('selected');
  cuadradoProyecto.classList.remove('selected');
  cuadradoExpediente.classList.remove('selected');
  cuadradoMantenimiento.classList.remove('selected');
  if (mensajeArchivo) mensajeArchivo.innerHTML = '';
  validarFormulario();
});

// --- Enviar la cotización al servidor PHP usando AJAX ---
formCotizacion.addEventListener("submit", function(e) {
    e.preventDefault(); // ← evita recargar la página

    const mensajeEstado = document.getElementById("mensaje-estado");

    mensajeEstado.textContent = "Enviando...";
    mensajeEstado.style.color = "#333";

    btnEnviar.disabled = true;

    const datos = new FormData(formCotizacion);

    fetch("enviar_cotizacion.php", {
        method: "POST",
        body: datos
    })
    .then(async (response) => {
        const ct = response.headers.get("content-type") || "";

        // --- Si el servidor NO devuelve JSON, mostrar error en pantalla ---
        if (!ct.includes("application/json")) {
            const texto = await response.text();
            throw new Error("Respuesta inesperada del servidor: " + texto);
        }

        return response.json();
    })
    .then((data) => {
        if (data.status === "success") {
            mensajeEstado.innerHTML =
                "<p style='color: green; font-weight: bold;'>¡Gracias! Tu solicitud fue enviada correctamente.</p>";

            formCotizacion.reset(); // limpia formulario
        } else {
            mensajeEstado.innerHTML =
                "<p style='color: red;'>Hubo un problema al enviar. Inténtelo nuevamente.</p>";
        }
    })
    .catch((error) => {
        mensajeEstado.innerHTML =
            "<p style='color: red;'>Error: " + error.message + "</p>";
    })
    .finally(() => {
        btnEnviar.disabled = false;
    });
});

// --- Enviar cotizacion de formulario ---
//-- formCotizacion.addEventListener("submit", function(e) {
//--  e.preventDefault();

//--  const resultado = document.getElementById("resultado");
//--  const form = e.target;

  // Recoge los datos (asegúrate que los nombres de los campos coincidan)
//--  const datos = {
//--    nombre: form.nombre.value,
//--    apellido: form.apellido.value,
//--    dni: form.dni.value,
//--    direccion: form.direccion.value,
//--    contacto: form.contacto.value,
//--    correo: form.correo.value,
//--    tipo_entidad: form.tipo_entidad.value,
//--    empresa: form.empresa.value,
//--    ruc: form.ruc.value,
//--    tipo_servicio: form.tipo_servicio.value,
//--    detalle: form.detalle.value
//--  };

  // Intenta cargar la plantilla
//--  fetch('plantillas/solicitud_wayra.docx')
//--    .then(response => {
//--      if (!response.ok) {
//--        throw new Error("Error HTTP " + response.status);
//--      }
//--      return response.arrayBuffer();
//--    })
    // usar [ y ] en vez de { y } para que los datos se generen en la plantilla word
//--    .then(content => {
//--      const zip = new window.PizZip(content);
//--      const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: '[[', end: ']]' } });
//--      doc.setData(datos);

//--      try {
//--        doc.render();
//--      } catch (error) {
//--        resultado.innerHTML = "<span style='color:red'>Error al procesar plantilla.<br>¿Los campos tienen el formato correcto (ejemplo: {{nombre}})?</span>";
//--        console.error(error);
//--        return;
//--      }

//--      const blob = doc.getZip().generate({
//--        type: "blob",
//--        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//--      });

//--      const url = window.URL.createObjectURL(blob);
//--      const a = document.createElement('a');
//--      a.href = url;
//--      a.download = "solicitud_generada.docx";
//--      a.click();
//--      window.URL.revokeObjectURL(url);

      // Descargar PDF
//--      doc.save("solicitud_generada.pdf");

//--      resultado.innerHTML = "<span style='color:green'>Documento generado con éxito.</span>";

      // Ahora sí, limpia el formulario
//--      form.reset();
//--      entidadSeleccionada.textContent = 'Seleccione...';
//--      servicioSeleccionado.textContent = 'Seleccione...';
//--      inputEntidad.value = '';
//--      inputServicio.value = '';
//--      cuadradoPublica.classList.remove('selected');
//--      cuadradoPrivada.classList.remove('selected');
//--      cuadradoProyecto.classList.remove('selected');
//--      cuadradoExpediente.classList.remove('selected');
//--      cuadradoMantenimiento.classList.remove('selected');
//--      if (mensajeArchivo) mensajeArchivo.innerHTML = '';
//--      validarFormulario();

      // Alerta (opcional)
//--      alert('¡Cotización enviada correctamente!');
//--    })
//--    .catch((err) => {
//--  resultado.innerHTML = "<span style='color:red'>No se pudo cargar la plantilla Word.<br>" 
//--    + (err.message || err) + "<br>" + (err.stack || '') + "</span>";
//--  console.error("Error en fetch/generación:", err);
//--});
//--});

// Botón cancelar
document.getElementById('btnCancelar').addEventListener('click', function () {
  document.getElementById('formCotizacion').reset();
  document.getElementById('resultado').innerHTML = '';
});

// --- Mostrar formulario solo al pulsar banner ---
function mostrarFormularioCotizacion() {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('visible'));
  document.getElementById('cotizacion').classList.add('visible');
}

// ------ CONTACTO ------
function enviarFormulario(e) {
    e.preventDefault();
    alert("¡Gracias por contactarnos! Pronto responderemos su mensaje.");
    e.target.reset();
}

// ------ NUESTROS PROYECTOS: interfaz y contenido ------
const proyectosData = [
    {
        tipo: "N°1",
        nombre: "Mejoramiento de la capacidad resolutiva del Puesto <br> de Salud de Huayo nivel I-I",
        fecha: "2015 | Proyecto de Inversion",
        img: "proyectos_Imagenes/proyecto1.jpg",
        detalle: {
            tipo: "Proyecto de Inversion",
            nombre: "Mejoramiento de la capacidad resolutiva del Puesto de Salud de Huayo Nivel I-1 y Puesto de Salud de Ratchay Nivel I-1 Distrito de Curpahuasi, Provincia de Grau, Apurímac",
            entidad: "Municipalidad Distrital de Curpahuasi",
            año: "08/05/2015",
            monto: "S/ 3,029,062.00",
            cui: "2300790",
            situacion: "Viable",
            imgs: ["proyectomuestra1/muestrap1-1.jpg","proyectomuestra1/muestrap1-2.jpg","proyectomuestra1/muestrap1-3.jpg","proyectomuestra1/muestrap1-4.jpg","proyectomuestra1/muestrap1-5.jpg","proyectomuestra1/muestrap1-6.jpg"]
        }
    },
    {
        tipo: "N°2",
        nombre: "Creacion de local cultural para el desarrollo de <br> actividades en Nahuinlla",
        fecha: "2017 | Expediente Tecnico",
        img: "proyectos_Imagenes/proyecto2.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Creacion de local cultural para la el desarrollo de actividades socioculturalles multiples del centro poblado de Ñahuinlla del distrito de Coyllurqui, provincia de Cotabambas, Apurimac",
            entidad: "Municipalidad Provincial de Cotabambas Tambobamba",
            año: "10/05/2017",
            monto: "S/ 1,321,959.00",
            cui: "2300812",
            situacion: "Concluido",
            imgs: ["proyectomuestra2/muestrap2-1.jpg","proyectomuestra2/muestrap2-2.jpg","proyectomuestra2/muestrap2-3.jpg","proyectomuestra2/muestrap2-4.jpg","proyectomuestra2/muestrap2-5.jpg","proyectomuestra2/muestrap2-6.jpg"]
        }
    },
    {
        tipo: "N°3",
        nombre: "Mejoramiento de los servicios de educacion inicial <br> y primaria en Tumire",
        fecha: "2017 | Expediente Tecnico",
        img: "proyectos_Imagenes/proyecto3.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento de los servicios de educacion inicial y primaria de la comunidad de Tumire, distrito de Yanaca, provincia de Aymaraes, Apurimac",
            entidad: "Municipalidad Distrital de Yanaca",
            año: "15/07/2017",
            monto: "S/ 3,815,653.00",
            cui: "2300665",
            situacion: "En evaluacion en Pronied",
            imgs: ["proyectomuestra3/muestrap3-1.jpg","proyectomuestra3/muestrap3-2.jpg","proyectomuestra3/muestrap3-3.jpg","proyectomuestra3/muestrap3-4.jpg","proyectomuestra3/muestrap3-5.jpg","proyectomuestra3/muestrap3-6.jpg"]
        }
    },
    {
        tipo: "N°4",
        nombre: "Mejoramiento servicio de seguridad vecinal y <br> comunal en Chalhuahuacho",
        fecha: "2017 | Expediente Tecnico",
        img: "proyectos_Imagenes/proyecto4.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento y ampliacion del servicio de seguridad vecinal y comunal en el distrito de Chalhuahuacho, Cotabambas, Apurimac",
            entidad: "Municipalidad Distrital de Chalhuahuacho",
            año: "07/11/2017",
            monto: "S/ 3,924,462.64",
            cui: "2381287",
            situacion: "Concluido",
            imgs: ["proyectomuestra4/muestrap4-1.jpg","proyectomuestra4/muestrap4-2.jpg","proyectomuestra4/muestrap4-3.jpg","proyectomuestra4/muestrap4-4.jpg","proyectomuestra4/muestrap4-5.jpg","proyectomuestra4/muestrap4-6.jpg"]
        }
    },
    {
        tipo: "N°5",
        nombre: "Mejoramiento servicio educativo Erasmo Delgado <br> Vivanco en Tambobamba",
        fecha: "2019 | Proyecto de Inversion",
        img: "proyectomuestra5/proyecton5.jpg",
        detalle: {
            tipo: "Proyecto de Inversion",
            nombre: "Mejoramiento y ampliacion del servicio educativo de la institucion educativa integrada Erasmo Delgado Vivanco, distrito Tambobamba, provincia Cotabambas, departamento Apurimac",
            entidad: "Municipalidad Provincial de Cotabambas",
            año: "22/03/2019",
            monto: "S/ 17,397,220.97",
            cui: "2449271",
            situacion: "Viable",
            imgs: ["proyectomuestra5/muestrap5-1.jpg","proyectomuestra5/muestrap5-2.jpg","proyectomuestra5/muestrap5-3.jpg","proyectomuestra5/muestrap5-4.jpg","proyectomuestra5/muestrap5-5.jpg","proyectomuestra5/muestrap5-6.jpg"]
        }
    },
    {
        tipo: "N°6",
        nombre: "Mejoramiento institucion educativa primaria Cesar <br> Vallejo en Haquira",
        fecha: "2019 | Expediente Tecnico",
        img: "proyectomuestra6/proyecton6.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento y ampliacion de los servicios de educacion primaria de la institucion educativa Cesar Vallejo, distrito de Haquira, provincia de Cotabambas, departamento de Apurimac",
            entidad: "Municipalidad Provincial de Cotabambas",
            año: "25/10/2019",
            monto: "S/ 266,782.89",
            cui: "2440037",
            situacion: "Aprobado",
            imgs: ["proyectomuestra6/muestrap6-1.jpg","proyectomuestra6/muestrap6-2.jpg","proyectomuestra6/muestrap6-3.jpg","proyectomuestra6/muestrap6-4.jpg","proyectomuestra6/muestrap6-5.jpg","proyectomuestra6/muestrap6-6.jpg"]
        }
    },
    {
        tipo: "N°7",
        nombre: "Mejoramiento servicio educativo Erasmo Delgado <br> Vivanco en Tambobamba",
        fecha: "2019 | Expediente Tecnico",
        img: "proyectomuestra7/proyecton7.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento y ampliacion del servicio educativo de la institucion educativa integrada Erasmo Delgado Vivanco, distrito Tambobamba, provincia Cotabambas, departamento Apurimac",
            entidad: "Municipalidad Provincial de Cotabambas",
            año: "25/10/2019",
            monto: "S/ 13,709,582.52",
            cui: "2449485",
            situacion: "Viable",
            imgs: ["proyectomuestra7/muestrap7-1.jpg","proyectomuestra7/muestrap7-2.jpg","proyectomuestra7/muestrap7-3.jpg","proyectomuestra7/muestrap7-4.jpg","proyectomuestra7/muestrap7-5.jpg","proyectomuestra7/muestrap7-6.jpg"]
        }
    },
    {
        tipo: "N°8",
        nombre: "Adecuacion y acondicionamiento del centro de <br> salud de Progreso",
        fecha: "2019 | Ejecucion de Mantenimiento",
        img: "proyectomuestra8/proyeton8.png",
        detalle: {
            tipo: "Ejecucion de Mantenimiento",
            nombre: "Adecuacion y acondicionamiento de infraestructura: cambio de cubiertas, techos, falso cielo, pintura, resane de mueros, instalaciones sanitarias del Centro de Salud de Progreso, Micro Red de Salud Progreso, Red de Salud Grau, Apurimac",
            entidad: "Red de Salud Grau",
            año: "05/12/2019",
            monto: "----------",
            cui: "----------",
            situacion: "Concluido",
            imgs: ["proyectomuestra8/muestrap8-1.jpg","proyectomuestra8/muestrap8-2.jpg","proyectomuestra8/muestrap8-3.jpg","proyectomuestra8/muestrap8-4.jpg","proyectomuestra8/muestrap8-5.jpg","proyectomuestra8/muestrap8-6.jpg"]
        }
    },
    {
        tipo: "N°9",
        nombre: "Mejoramiento de la I.E.P. N°54636 Escorio y la <br> I.E.P. N°54660 Ccahanhuiere",
        fecha: "2019 | Expediente Tecnico",
        img: "proyectos_Imagenes/proyecto9.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento de los servicios educativos de la I.E.P. N° 54636 Escohorno y la I.E.P. N°54660 Ccahanhuiere de las localidades de Ccahuanhuire y Escohorno del distrito de progreso, Provincia Grau, Apurímac",
            entidad: "Municipalidad Provincial de Grau",
            año: "23/12/2019",
            monto: "S/ 4,407,670.89",
            cui: "2460964",
            situacion: "Concluido",
            imgs: ["proyectomuestra9/muestrap9-1.jpg","proyectomuestra9/muestrap9-2.jpg","proyectomuestra9/muestrap9-3.jpg","proyectomuestra9/muestrap9-4.jpg","proyectomuestra9/muestrap9-5.jpg","proyectomuestra9/muestrap9-6.jpg"]
        }
    },
    {
        tipo: "N°10",
        nombre: "Mejoramiento institucion educativa N°50659 del <br> centro poblado Pisaccasca",
        fecha: "2020 | Expediente Tecnico",
        img: "proyectomuestra10/proyecton10.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento de los servicios de educacion primaria en la institucion educativa N°50659 del centro poblado de Pisaccasa en el distrito de Mara, provincia de Cotabambas, Apurimac",
            entidad: "Municipalidad Distrital de Mara",
            año: "10/01/2020",
            monto: "S/ 3,845,077.07",
            cui: "2419942",
            situacion: "Viable",
            imgs: ["proyectomuestra10/muestrap10-1.jpg","proyectomuestra10/muestrap10-2.jpg","proyectomuestra10/muestrap10-3.jpg","proyectomuestra10/muestrap10-4.jpg","proyectomuestra10/muestrap10-5.jpg","proyectomuestra10/muestrap10-6.jpg"]
        }
    },
    {
        tipo: "N°11",
        nombre: "Mejoramiento de la I.E.P. N°54310 Las Mercedes de <br> Pampamarca",
        fecha: "2020 | Proyecto de Inversion",
        img: "proyectos_Imagenes/proyecto11.jpg",
        detalle: {
            tipo: "Proyecto de Inversion",
            nombre: "Mejoramiento y ampliación del servicio educativo de la I.E.P. N° 54310 Las Mercedes de Pampamarca, del distrito Cotaruse, provincia Aymaraes, departamento de Apurímac ",
            entidad: "Municipalidad Distrital de Cotaruse",
            año: "31/07/2020",
            monto: "S/ 9,996,814.49",
            cui: "2487772",
            situacion: "Viable",
            imgs: ["proyectomuestra11/muestrap11-1.jpg","proyectomuestra11/muestrap11-2.jpg","proyectomuestra11/muestrap11-3.jpg","proyectomuestra11/muestrap11-4.jpg","proyectomuestra11/muestrap11-5.jpg","proyectomuestra11/muestrap11-6.jpg"]
        }
    },
    {
        tipo: "N°12",
        nombre: "Mejoramiento de la I.E.P. N°54198 Virgen Inmaculada <br> Concepcion",
        fecha: "2020 | Expediente Tecnico",
        img: "proyectomuestra12/proyecton12.jpg",
        detalle: {
            titulo: "Local Cultural Nahuinlla",
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento y ampliacion de los servicios educativos de la I.E.P. 54198 Virgen Inmaculada Concepción del distrito de Ranracancha - provincia de Chincheros, departamento de Apurimac",
            entidad: "Municaplidad Distrital de Ranracancha",
            año: "03/12/2020",
            monto: "S/ 6,717,873.00",
            cui: "2340037",
            situacion: "Aprobado bajo resolucion",
            imgs: ["proyectomuestra12/muestrap12-1.jpg","proyectomuestra12/muestrap12-2.jpg","proyectomuestra12/muestrap12-3.jpg","proyectomuestra12/muestrap12-4.jpg","proyectomuestra12/muestrap12-5.jpg","proyectomuestra12/muestrap12-6.jpg"]
        }
    },
    {
        tipo: "N°13",
        nombre: "Mejoramiento del Instituto de Educacion Superior <br> Tecnologico Publico de Chincheros",
        fecha: "2021 | Expediente Tecnico",
        img: "proyectomuestra13/proyecton13.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento del servicio educativo, para el fortalecimiento de las capacidades de aprendizaje de los estudiantes del Instituto de Educación Superior Tecnológico Público de Chincheros, distrito de Chincheros, provincia de Chincheros, Apurimac",
            entidad: "Sub Region Chincheros",
            año: "25/06/2021",
            monto: "S/ 8,877,755.28",
            cui: "2470252",
            situacion: "Viable",
            imgs: ["proyectomuestra13/muestrap13-1.jpg","proyectomuestra13/muestrap13-2.jpg","proyectomuestra13/muestrap13-3.jpg","proyectomuestra13/muestrap13-4.jpg","proyectomuestra13/muestrap13-5.jpg","proyectomuestra13/muestrap13-6.jpg"]
        }
    },
     {
        tipo: "N°14",
        nombre: "Elaboracion ficha tecnica del Camal Municipal del <br> distrito de Antabamba",
        fecha: "2021 | Proyecto de Inversion",
        img: "proyectos_Imagenes/proyecto14.jpg",
        detalle: {
            tipo: "Proyecto de Inversion",
            nombre: "Servicio de consultoria para la elaboracion del estudio de preinversion a nivel de ficha tecnica simplificada y/o estandar denominado mejoramiento y ampliacion del servicio del Camal Municipal del distrito de Antabamba, provincia de Antabamba, region Apurimac",
            entidad: "Municipalidad Provincial de Antabamba",
            año: "21/09/2021",
            monto: "S/ 5,258,607.95",
            cui: "2538696",
            situacion: "Viable",
            imgs: ["proyectomuestra14/muestrap14-1.jpg","proyectomuestra14/muestrap14-2.jpg","proyectomuestra14/muestrap14-3.jpg","proyectomuestra14/muestrap14-4.jpg","proyectomuestra14/muestrap14-5.jpg","proyectomuestra14/muestrap14-6.jpg"]
        }
    },
    {
        tipo: "N°15",
        nombre: "Contratacion del servicio medico; en el (la) EE.SS. <br> Bellavista",
        fecha: "2022 | Ejecucion de Mantenimiento",
        img: "proyectomuestra15/proyecto15.jpg",
        detalle: {
            tipo: "Ejecucion de Mantenimiento",
            nombre: "Contratacion del centro medicio; en el (la) EE.SS. Bellavista, distrito Abancay, provincia Abancay, deparamento Apurimac",
            entidad: "Direccion Regional de Salud Apurimac",
            año: "20/06/2022",
            monto: "----------",
            cui: "----------",
            situacion: "Ejecutado",
            imgs: ["proyectomuestra15/muestrap15-1.jpg","proyectomuestra15/muestrap15-2.jpg","proyectomuestra15/muestrap15-3.jpg","proyectomuestra15/muestrap15-4.jpg","proyectomuestra15/muestrap15-5.jpg","proyectomuestra15/muestrap15-6.jpg"]
        }
    },
    {
        tipo: "N°16",
        nombre: "Mejoramiento y acondicionamiento del almacen <br> de la Direccion Regional de Salud Apurimac",
        fecha: "2022 | Ejecucion de Mantenimiento",
        img: "proyectomuestra16/proyecton16.jpg",
        detalle: {
            tipo: "Ejecucion de Mantenimiento",
            nombre: "Mejoramiento y acondionamiento de los ambientes: servicios de mantenimiento del almacen especializado de la Direccion de medicamentos, insumos y drogas - Direccion Regional de Salud Apurimac",
            entidad: "Direccion Regional de Salud",
            año: "19/10/2022",
            monto: "----------",
            cui: "----------",
            situacion: "Ejecutado",
            imgs: ["proyectomuestra16/muestrap16-1.jpg","proyectomuestra16/muestrap16-2.jpg","proyectomuestra16/muestrap16-3.jpg","proyectomuestra16/muestrap16-4.jpg","proyectomuestra16/muestrap16-5.jpg","proyectomuestra16/muestrap16-6.jpg"]
        }
    },
    {
        tipo: "N°17",
        nombre: "Mejoramiento del puesto de salud I-1 en la <br> localidad de Silco",
        fecha: "2023 | Expediente Tecnico",
        img: "proyectomuestra17/proyecton17.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento del puesto de salud de categoria I-1 en la localidad de Silco del distrito de Juan Espinoza Medrano, provincia de Antabamba, depatamento de Apurimac",
            entidad: "Municipalidad Distrital de Juan Espinoza Medrano ",
            año: "04/08/2023",
            monto: "S/ 1,857,338.32",
            cui: "2494828",
            situacion: "Viable",
            imgs: ["proyectomuestra17/muestrap17-1.jpg","proyectomuestra17/muestrap17-2.jpg","proyectomuestra17/muestrap17-3.jpg","proyectomuestra17/muestrap17-4.jpg","proyectomuestra17/muestrap17-5.jpg","proyectomuestra17/muestrap17-6.jpg"]
        }
    },
    {
        tipo: "N°18",
        nombre: "Mejoramiento del servicio de educacion inicial en <br> I.E. 251 Nueva Jeruslen",
        fecha: "2023 | Expediente Tecnico",
        img: "proyectos_Imagenes/proyecto18.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento del servicio de educacion inicial en I.E N°251 Nueva Jeruslen del Centro Poblado de Huamburque del Distrito del el Porvenir, Chincheros, Apurimac ",
            entidad: "Municipalidad Distrital el Porvenir Vraem",
            año: "20/12/2023",
            monto: "S/ 5,165,056.03",
            cui: "2585912",
            situacion: "Viable",
            imgs: ["proyectomuestra18/muestrap18-1.jpg","proyectomuestra18/muestrap18-2.jpg","proyectomuestra18/muestrap18-3.jpg","proyectomuestra18/muestrap18-4.jpg","proyectomuestra18/muestrap18-5.jpg","proyectomuestra18/muestrap18-6.jpg"]
        }
    },
    {
        tipo: "N°19",
        nombre: "Creacion del servicio en los centros de promocion <br> y vigilancia comunal en Sabaino",
        fecha: "2024 | Proyecto de Inversion",
        img: "proyectos_Imagenes/proyecto19.jpg",
        detalle: {
            tipo: "Proyecto de Inversion",
            nombre: "Creacion del servicio de atención de salud básicos en centros de promocion y vigilancia comunal del ciudada integral de la madre y del niño en el distrito de Sabaino, provincia de Antabamba, departamento de Apurimac",
            entidad: "Municipalidad Distrital de Sabaino",
            año: "31/01/2024",
            monto: "S/ 3,599,790.55",
            cui: "2616955",
            situacion: "Viable",
            imgs: ["proyectomuestra19/muestrap19-1.jpg","proyectomuestra19/muestrap19-2.jpg","proyectomuestra19/muestrap19-3.jpg","proyectomuestra19/muestrap19-4.jpg","proyectomuestra19/muestrap19-5.jpg","proyectomuestra19/muestrap19-6.jpg"]
        }
    },
    {
        tipo: "N°20",
        nombre: "Mejoramiento de los servicios de salud I-2 San Mateo",
        fecha: "2024 | Proyecto de Inversion",
        img: "proyectomuestra20/proyecton20.jpg",
        detalle: {
            tipo: "Proyecto de Inversion",
            nombre: "Mejoramiento de los servicios de salud I-2 San Mateo distrito de Tintay provincia de Aymaraes, departamento de Apurimac",
            entidad: "Municipalidad Distrital de Tintay",
            año: "12/02/2024",
            monto: "S/ 6,937,198.66",
            cui: "2642844",
            situacion: "Viable",
            imgs: ["proyectomuestra20/muestrap20-1.jpg","proyectomuestra20/muestrap20-2.jpg","proyectomuestra20/muestrap20-3.jpg","proyectomuestra20/muestrap20-4.jpg","proyectomuestra20/muestrap20-5.jpg","proyectomuestra20/muestrap20-6.jpg"]
        }
    },
    {
        tipo: "N°21",
        nombre: "Mejoramiento de la oferta de servicios educativos <br> N°1007, N°860 y N°1006",
        fecha: "2024 | Expediente Tecnico",
        img: "proyectos_Imagenes/proyecto21.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento de la oferta de servicios educativos de las I.E. de las iniciales N°1007 Yurac Rumi en el CP Ñahuinlla, N° 860 Huancuire en la Huancuire y la N°1006 Totora en la CC de Huancuire distrito de Coyllurqui, provincia de Cotabambas, deparamento de Apurimac",
            entidad: "Municipalidad Distrital de Coyllurqui",
            año: "08/08/2024",
            monto: "S/ 6,999,382.04",
            cui: "2475650",
            situacion: "Viable",
            imgs: ["proyectomuestra21/muestrap21-1.jpg","proyectomuestra21/muestrap21-2.jpg","proyectomuestra21/muestrap21-3.jpg","proyectomuestra21/muestrap21-4.jpg","proyectomuestra21/muestrap21-5.jpg","proyectomuestra21/muestrap21-6.jpg"]
        }
    },
    {
        tipo: "N°22",
        nombre: "Mantenimiento preventivo y correctivo del P.S. Calcauso",
        fecha: "2024 | Ejecucion de Mantenimiento",
        img: "proyectos_Imagenes/proyecto22.jpg",
        detalle: {
            tipo: "Ejecucion de Mantenimiento",
            nombre: "Mantenimiento preventivo y correctivo del P.S. Calcauso, Red de Salud Antabamba",
            entidad: "Red de Salud de Antabamba",
            año: "20/08/2024",
            monto: "----------",
            cui: "----------",
            situacion: "Ejecutado",
            imgs: ["proyectomuestra22/muestrap22-1.jpg","proyectomuestra22/muestrap22-2.jpg","proyectomuestra22/muestrap22-3.jpg","proyectomuestra22/muestrap22-4.jpg","proyectomuestra22/muestrap22-5.jpg","proyectomuestra22/muestrap22-6.jpg"]
        }
    },
    {
        tipo: "N°23",
        nombre: "Mejoramiento del servicio de salud basico en <br> Piscoya distrito de Pocohuanca",
        fecha: "2025 | Expediente Tecnico",
        img: "proyectomuestra23/proyecton23.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento del servicio de atencion de salud basico en Piscoya del distrito de Pocohuanca de la provincia de Aymaraes del departamento de Apurimac ",
            entidad: "Municipalidad Distrital de Pocohuanca",
            año: "12/02/2025",
            monto: "S/ 4,490,861.92",
            cui: "2660191",
            situacion: "Viable",
            imgs: ["proyectomuestra23/muestrap23-1.jpg","proyectomuestra23/muestrap23-2.jpg","proyectomuestra23/muestrap23-3.jpg","proyectomuestra23/muestrap23-4.jpg","proyectomuestra23/muestrap23-5.jpg","proyectomuestra23/muestrap23-6.jpg"]
        }
    },
    {
        tipo: "N°24",
        nombre: "Mejoramiento del servicio de salud basico en <br> Vilcaro distrito de Coyllurqui",
        fecha: "2025 | Expediente Tecnico",
        img: "proyectomuestra24/proyecton24.jpg",
        detalle: {
            tipo: "Expediente Tecnico",
            nombre: "Mejoramiento del servicio de atencion de salud basico en Vilcaro del distrito de Coyllurqui de la provincia de Cotabambas del departamento de Apurimac ",
            entidad: "Municipalidad Distrital de Coyllurqui",
            año: "12/04/2025",
            monto: "S/ 3,730,915.36",
            cui: "2657761",
            situacion: "Viable",
            imgs: ["proyectomuestra24/muestrap24-1.jpg","proyectomuestra24/muestrap24-2.jpg","proyectomuestra24/muestrap24-3.jpg","proyectomuestra24/muestrap24-4.jpg","proyectomuestra24/muestrap24-5.jpg","proyectomuestra24/muestrap24-6.jpg"]
        }
    },
//tecla alt + 124 para |
];

// --- Estado de paginación ---
let proyectosPage = 1;
let proyectosShow = 10;

// --- Filtros y renderizado ---
let paginaActual = 1;
let proyectosFiltrados = proyectosData; // Lista que se actualiza con el filtro

/* util: extraer año de cadenas como "2015 | Proyecto de Inversion" o "08/05/2015" */
function extractYear(fechaStr) {
  if (!fechaStr) return "";
  const m = fechaStr.match(/(\d{4})/);
  return m ? m[1] : "";
}

/* util: escape simple para evitar inyección en inserciones innerHTML */
function escapeHtml(text){
  if(!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------------------------
   Renderizado de tarjetas (usa VIDEO en cada tarjeta, overlay sobre el video)
   --------------------------- */
function renderProyectos(data = proyectosFiltrados, pagina = 1) {
    const container = document.getElementById("proyectos-list");
    const showCount = parseInt(document.getElementById("proyectos-show").value, 10);
    const start = (pagina - 1) * showCount;
    const end = Math.min(start + showCount, data.length)

    container.innerHTML = "";

    for (let i = start; i < end; i++) {
        const p = data[i];

        const card = document.createElement("div");
        card.className = "proyecto-card";
        // guardamos el índice global relativo a la lista filtrada para openProyectoDetalle
        const idx = i;
        card.onclick = () => openProyectoDetalle(idx);

        // Wrapper con video (USAMOS VIDEO en todas las tarjetas como pediste)
        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";

        const video = document.createElement("video");
        video.className = "proyecto-media";
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        // Tu video por defecto; puedes cambiar la ruta si usas otro archivo.
        const source = document.createElement("source");
        source.src = "videos/stop_motion_construction.mp4";
        source.type = "video/mp4";
        video.appendChild(source);

        // Si quisieras por proyecto usar distintos videos, añade p.video y reemplaza source.src = p.video;
        wrapper.appendChild(video);

        // Overlay visible (igual que Tarjeta Nº1)
        const overlay = document.createElement("div");
        overlay.className = "card-overlay";

        const year = extractYear(p.fecha || (p.detalle && p.detalle.año) || "");
        const titleText = (p.detalle && p.detalle.tipo) ? p.detalle.tipo : (p.nombre ? p.nombre.replace(/<br>/g, " ") : "");
        const subText = (p.detalle && p.detalle.nombre) ? p.detalle.nombre : (p.nombre ? p.nombre.replace(/<br>/g, " ") : "");

        overlay.innerHTML = `
          <div class="card-info">
            <h3 class="project-title">${escapeHtml(titleText)}</h3>
            <span class="year-badge">${escapeHtml(year)}</span>
          </div>
          <p class="project-sub">${escapeHtml(subText)}</p>
        `;
        wrapper.appendChild(overlay);

        card.appendChild(wrapper);
        container.appendChild(card);

        // Opcional: marcar la primera tarjeta de la página como "featured"
        if (i === start) {
          card.classList.add('featured');
        }
    }

    renderPaginacion(data, pagina);
}

function renderPaginacion(data, pagina) {
    const pagination = document.getElementById("proyectos-pages");
    const showCount = parseInt(document.getElementById("proyectos-show").value, 10);
    const totalPages = Math.max(1, Math.ceil(data.length / showCount));

    pagination.innerHTML = "";
    if (totalPages <= 1) return;
    
      const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.innerHTML = "&#10094;";
    if (pagina <= 1) prevBtn.classList.add("disabled");
    else prevBtn.onclick = () => { paginaActual = pagina - 1; renderProyectos(data, paginaActual); };
    pagination.appendChild(prevBtn);

    // Helper para crear botones
    const createPageButton = (n) => {
        const btn = document.createElement("button");
        btn.className = "page-btn" + (n === pagina ? " active" : "");
        btn.textContent = n;
        if (n === pagina) btn.disabled = true;
        else btn.onclick = () => { paginaActual = n; renderProyectos(data, paginaActual); };
        return btn;
    };

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pagination.appendChild(createPageButton(i));
    } else {
        // always show first two
        pagination.appendChild(createPageButton(1));
        pagination.appendChild(createPageButton(2));

        let start = Math.max(3, pagina - 1);
        let end = Math.min(totalPages - 2, pagina + 1);

        if (start > 3) {
            const e = document.createElement("span");
            e.className = "page-ellipsis";
            e.textContent = "...";
            pagination.appendChild(e);
        }

        for (let p = start; p <= end; p++) {
            pagination.appendChild(createPageButton(p));
        }

        if (end < totalPages - 2) {
            const e = document.createElement("span");
            e.className = "page-ellipsis";
            e.textContent = "...";
            pagination.appendChild(e);
        }

        pagination.appendChild(createPageButton(totalPages - 1));
        pagination.appendChild(createPageButton(totalPages));
    }

    // Next
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.innerHTML = "&#10095;";
    if (pagina >= totalPages) nextBtn.classList.add("disabled");
    else nextBtn.onclick = () => { paginaActual = pagina + 1; renderProyectos(data, paginaActual); };
    pagination.appendChild(nextBtn);
}

/* ---------------------------
   Filtros y Show
   --------------------------- */
function renderProyectosFiltrados(filtro = null) {
    if (!filtro) proyectosFiltrados = proyectosData;
    else proyectosFiltrados = proyectosData.filter(p => (p.fecha || "").includes(filtro));
    paginaActual = 1;
    renderProyectos(proyectosFiltrados, paginaActual);
}

// --- Detalle de proyecto tipo ficha ---
function openProyectoDetalle(idx) {
    // idx es relativo a la lista filtrada
    const p = proyectosFiltrados[idx];
    const detalle = p.detalle || {};

    // Oculta la lista y muestra el detalle tipo ficha
    document.getElementById("proyectos-list-section").style.display = "none";
    const detalleSection = document.getElementById("proyecto-detalle-section");
    detalleSection.style.display = "block";

    // Oculta el menu lateral (lo quitamos visualmente)
    const menu = document.querySelector('.proyectos-menu');
    if (menu) menu.classList.add('hidden');

    // Construir layout con imagen principal, info y miniaturas
    let html = `
      <div style="margin-bottom:14px;">
        <button class="volver-btn custom" id="volverFicha">VOLVER</button>
      </div>
      <div class="proyecto-detalle-layout">
        <div class="left-col">
          <div class="proyecto-main-photo" id="mainPhotoContainer">
            <img id="proyectoMainImg" src="${detalle.imgs && detalle.imgs[0] ? detalle.imgs[0] : ''}" alt="Imagen principal">
          </div>
        </div>
        <div class="proyecto-info">
          <h2>(${escapeHtml(detalle.tipo || p.tipo || '')})</h2>
          <div class="info-row"><div class="label">NOMBRE DEL PROYECTO</div><div class="value">${escapeHtml(detalle.nombre || '')}</div></div>
          <div class="info-row"><div class="label">ENTIDAD CONTRATANTE</div><div class="value">${escapeHtml(detalle.entidad || '')}</div></div>
          <div class="info-row"><div class="label">AÑO</div><div class="value">${escapeHtml(detalle.año || '')}</div></div>
          <div class="info-row"><div class="label">MONTO DE INVERSION</div><div class="value">${escapeHtml(detalle.monto || '')}</div></div>
          <div class="info-row"><div class="label">CUI</div><div class="value">${escapeHtml(detalle.cui || '')}</div></div>
          <div class="info-row"><div class="label">SITUACION</div><div class="value">${escapeHtml(detalle.situacion || '')}</div></div>
        </div>
      </div>

      <div class="proyecto-thumbs" id="proyectoThumbs">
    `;

    // generar miniaturas (usa hasta 8 o detalle.imgs.length)
    const imgs = detalle.imgs || [];
    const thumbsToShow = imgs.length ? imgs.slice(0, 8) : [];
    thumbsToShow.forEach((src, i) => {
      html += `
        <div class="thumb" data-index="${i}">
          <img src="${src}" alt="Imagen ${i+1}">
          <div class="caption">Imagen ${String(i+1).padStart(2,'0')}</div>
        </div>
      `;
    });
    html += `</div>`;

    document.getElementById("proyecto-detalle").innerHTML = html;

    // bloquear botones (si aún quieres bloquear funcionalidad)
    bloquearBotones();

    // comportamiento del boton volver
    const volverBtn = document.getElementById('volverFicha');
    if (volverBtn) {
      volverBtn.addEventListener('click', () => {
        volverAListaProyectos();
      });
    }

    // Asignar eventos: miniaturas -> swap con principal
    const mainImg = document.getElementById('proyectoMainImg');
    const thumbNodes = document.querySelectorAll('#proyectoThumbs .thumb img');

    thumbNodes.forEach((thumbImg, idxThumb) => {
      thumbImg.addEventListener('click', (e) => {
        // swap src entre thumb y main
        const temp = mainImg.src;
        mainImg.src = thumbImg.src;
        thumbImg.src = temp;
        // actualizar datos del modal
        prepararModalData();
      });

      // abrir modal desde miniatura (doble click opcional)
      thumbImg.addEventListener('dblclick', () => {
        activarModalImagenes(); // prepara modal
        const modal = document.getElementById('modal-imagen');
        const modalImg = modal.querySelector('#imagen-modal');
        modalImg.src = thumbImg.src;
        modal.classList.add('open');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      });
    });

    // abrir modal al click en imagen principal
    mainImg.addEventListener('click', () => {
      activarModalImagenes(); // prepara modal con el conjunto actual de miniaturas
      const modal = document.getElementById('modal-imagen');
      const modalImg = modal.querySelector('#imagen-modal');
      modalImg.src = mainImg.src;
      modal.classList.add('open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    });

    // preparar modal con las imgs actuales (ponerlas en data en el modal)
    prepararModalData();
}

function prepararModalData() {
  const imgs = Array.from(document.querySelectorAll('#proyectoThumbs .thumb img')).map(i => i.src);
  // incluir la imagen principal al inicio si no está
  const main = document.getElementById('proyectoMainImg');
  if (main && main.src) {
    if (!imgs.includes(main.src)) imgs.unshift(main.src);
  }
  // guardamos en el atributo data en el modal
  let modal = document.getElementById('modal-imagen');
  if (modal) {
    modal.dataset.imgs = JSON.stringify(imgs);
  }
}

// --- Función para abrir el modal al hacer clic en imágenes ---
function activarModalImagenes() {
  // asegura que el modal esté en body (lo creamos en HTML estático idealmente)
  let modal = document.getElementById('modal-imagen');
  if (!modal) {
    // crear si no existe (fallback)
    modal = document.createElement('div');
    modal.id = 'modal-imagen';
    modal.innerHTML = `
      <div class="modal-contenido">
        <span class="cerrar-modal" aria-label="Cerrar">&times;</span>
        <a class="prev" aria-label="Anterior">&#10094;</a>
        <img id="imagen-modal" src="" alt="Vista ampliada">
        <a class="next" aria-label="Siguiente">&#10095;</a>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const cerrar = modal.querySelector('.cerrar-modal');
  const prevBtn = modal.querySelector('.prev');
  const nextBtn = modal.querySelector('.next');
  const modalImg = modal.querySelector('#imagen-modal');

  // asegurar listeners sin duplicados
  if (cerrar) cerrar.replaceWith(cerrar.cloneNode(true));
  if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));
  if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));

  const cerrarFresh = modal.querySelector('.cerrar-modal');
  const prevFresh = modal.querySelector('.prev');
  const nextFresh = modal.querySelector('.next');

  // lectura de las imágenes guardadas
  function getModalImages() {
    try {
      const data = modal.dataset.imgs ? JSON.parse(modal.dataset.imgs) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
  }

  let indice = 0;
  function showByIndex(i) {
    const arr = getModalImages();
    if (!arr.length) return;
    if (i < 0) i = arr.length - 1;
    if (i >= arr.length) i = 0;
    indice = i;
    modalImg.src = arr[indice];
  }

  // prev/next handlers
  prevFresh.addEventListener('click', (e) => { e.stopPropagation(); showByIndex(indice - 1); });
  nextFresh.addEventListener('click', (e) => { e.stopPropagation(); showByIndex(indice + 1); });

  // cerrar
  cerrarFresh.addEventListener('click', () => {
    modal.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  });

  // cerrar clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  });

  // teclado
  document.onkeydown = function(e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') showByIndex(indice - 1);
    if (e.key === 'ArrowRight') showByIndex(indice + 1);
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  };

  // Si el modal ya tiene una imagen cargada (abrimos desde main o thumbs), aseguramos que indice coincida
  const currentSrc = modalImg && modalImg.src ? modalImg.src : null;
  if (currentSrc) {
    const arr = getModalImages();
    const pos = arr.indexOf(currentSrc);
    if (pos >= 0) indice = pos;
    else {
      // agregar al principio si no existe
      arr.unshift(currentSrc);
      modal.dataset.imgs = JSON.stringify(arr);
      indice = 0;
    }
  }
}

/* ---------------------------
   Volver a lista / bloqueo de botones
   --------------------------- */
function volverAListaProyectos() {
    document.getElementById("proyecto-detalle-section").style.display = "none";
    document.getElementById("proyectos-list-section").style.display = "block";

    // mostrar nuevamente el menú lateral
    const menu = document.querySelector('.proyectos-menu');
    if (menu) menu.classList.remove('hidden');

    desbloquearBotones();

    // Limpiar contenido detalle
    document.getElementById("proyecto-detalle").innerHTML = "";

    // cerrar modal si abierto
    const modal = document.getElementById('modal-imagen');
    if (modal) {
      modal.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    // volver a renderizar la lista en la pagina actual
    renderProyectos(proyectosFiltrados, paginaActual || 1);
}

function bloquearBotones() {
    const botones = document.querySelectorAll('.proyectos-menu button');
    botones.forEach(boton => { boton.classList.add('disabled'); boton.disabled = true; });
}
function desbloquearBotones() {
    const botones = document.querySelectorAll('.proyectos-menu button');
    botones.forEach(boton => { boton.classList.remove('disabled'); boton.disabled = false; });
}


/* ---------------------------
   Listeners y setup inicial
   --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Botón activo por defecto
    setActiveButton("proyectos-title");

    // render inicial
    paginaActual = 1;
    renderProyectos(proyectosFiltrados, paginaActual);

    // listeners de filtro (mantengo tus clases de botones)
    const btnProy = document.querySelector(".proyectos-title");
    const btnExp = document.querySelector(".expediente-title");
    const btnMan = document.querySelector(".mantenimiento-title");
    const btnInv = document.querySelector(".inversion-title");

    if (btnProy) btnProy.addEventListener("click", () => { setActiveButton("proyectos-title"); renderProyectosFiltrados(); });
    if (btnExp) btnExp.addEventListener("click", () => { setActiveButton("expediente-title"); renderProyectosFiltrados("Expediente Tecnico"); });
    if (btnMan) btnMan.addEventListener("click", () => { setActiveButton("mantenimiento-title"); renderProyectosFiltrados("Mantenimiento"); });
    if (btnInv) btnInv.addEventListener("click", () => { setActiveButton("inversion-title"); renderProyectosFiltrados("Proyecto de Inversion"); });

    const showSelect = document.getElementById("proyectos-show");
    if (showSelect) {
      showSelect.addEventListener("change", () => {
          paginaActual = 1;
          renderProyectos(proyectosFiltrados, paginaActual);
      });
    }
});

/* marca active en el menú lateral */
function setActiveButton(className) {
    document.querySelectorAll(".proyectos-menu button").forEach(btn => btn.classList.remove("active"));
    const el = document.querySelector("." + className);
    if (el) el.classList.add("active");
}


