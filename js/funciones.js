// Mostrar u ocultar información de cultivos
function toggleInfo(btn) {
  const extra = btn.nextElementSibling;

  if (extra.style.display === "block") {
    extra.style.display = "none";
    console.log("[LOG INTERACCIÓN] Usuario ocultó información del cultivo");
  } else {
    extra.style.display = "block";
    console.log("[LOG INTERACCIÓN] Usuario abrió información del cultivo");
  }
}

// Filtro de cultivos
function filtrar(tipo) {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    if (tipo === "todos") {
      card.style.display = "block";
    } else {
      if (card.classList.contains(tipo)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
  });

  console.log("[LOG INTERACCIÓN] Usuario aplicó filtro:", tipo);
}

// Validación del formulario
document.getElementById("formulario").addEventListener("submit", function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre").value.trim();
  let celular = document.getElementById("celular").value.trim();
  let mensaje = document.getElementById("mensaje").value.trim();
  let resultado = document.getElementById("resultado");

  if (nombre === "") {
    console.log("[LOG INTERACCIÓN] Fallo: nombre vacío");
    resultado.textContent = "El nombre es obligatorio";
    return;
  }

  if (!/^[0-9]{10}$/.test(celular)) {
    console.log("[LOG INTERACCIÓN] Fallo: celular inválido");
    resultado.textContent = "El celular debe tener 10 dígitos";
    return;
  }

  if (mensaje.length < 10) {
    console.log("[LOG INTERACCIÓN] Fallo: mensaje muy corto");
    resultado.textContent = "El mensaje debe tener mínimo 10 caracteres";
    return;
  }

  console.log("[LOG INTERACCIÓN] Formulario enviado correctamente");
  resultado.textContent = "Formulario enviado con éxito ✔";
});