// Mostrar u ocultar informacion de cultivos
function toggleInfo(btn) {
  const extra = btn.nextElementSibling;

  if (extra.style.display === "block") {
    extra.style.display = "none";
    console.log("[LOG INTERACCION] Usuario oculto informacion del cultivo");
  } else {
    extra.style.display = "block";
    console.log("[LOG INTERACCION] Usuario abrio informacion del cultivo");
  }
}

// Filtro de cultivos
function filtrar(tipo) {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    if (tipo === "todos" || card.classList.contains(tipo)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  console.log("[LOG INTERACCION] Usuario aplico filtro:", tipo);
}

// Validacion del formulario
document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const celular = document.getElementById("celular").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const resultado = document.getElementById("resultado");

  if (nombre === "") {
    console.log("[LOG INTERACCION] Fallo: nombre vacio");
    resultado.textContent = "El nombre es obligatorio";
    return;
  }

  if (!/^[0-9]{10}$/.test(celular)) {
    console.log("[LOG INTERACCION] Fallo: celular invalido");
    resultado.textContent = "El celular debe tener 10 digitos";
    return;
  }

  if (mensaje.length < 10) {
    console.log("[LOG INTERACCION] Fallo: mensaje muy corto");
    resultado.textContent = "El mensaje debe tener minimo 10 caracteres";
    return;
  }

  console.log("[LOG INTERACCION] Formulario enviado correctamente");
  resultado.textContent = "Formulario enviado con exito";
});

// Asistente de la pagina
const assistantState = {
  lastTopic: "",
};

const assistantKnowledge = {
  feria: {
    title: "Feria Digital El Progreso",
    summary:
      "Es una pagina comunitaria para mostrar cultivos, galeria, logros escolares, contacto y acceso con inicio de sesion.",
    sections: [
      "Inicio de sesion",
      "Cultivos y productos",
      "Galeria de fotos",
      "Logros escolares",
      "Contacto",
    ],
  },
  products: {
    banano: {
      category: "fruta",
      summary:
        "El banano es un cultivo tropical importante para la economia local y de exportacion.",
      detail: "Se produce en clima calido y es uno de los productos destacados de la vereda.",
    },
    cafe: {
      category: "grano",
      summary:
        "El cafe es uno de los principales productos de la vereda y se cultiva en montanas.",
      detail: "Se reconoce por su alta calidad y hace parte de la identidad productiva local.",
    },
    cacao: {
      category: "hortaliza",
      summary:
        "El cacao es base para chocolate artesanal y tiene gran valor en mercados nacionales.",
      detail: "Es uno de los cultivos mas representativos de la pagina y de la feria.",
    },
    mango: {
      category: "fruta",
      summary:
        "El mango es una fruta dulce y jugosa muy consumida en la region.",
      detail: "Se cultiva en climas calidos y es apreciado por su sabor y vitaminas.",
    },
    guayaba: {
      category: "fruta",
      summary:
        "La guayaba es una fruta tradicional usada en jugos y dulces.",
      detail: "Es resistente y se adapta bien a diferentes suelos.",
    },
  },
  categories: {
    frutas: ["Banano", "Mango", "Guayaba"],
    granos: ["Cafe"],
    hortalizas: ["Cacao"],
  },
  achievements: [
    "Huerta escolar sostenible con tomate, lechuga y cilantro, enfocada en alimentacion saludable y practicas agricolas sostenibles.",
    "Participacion en la Feria Agricola Municipal con muestras de cafe, banano y cacao.",
    "Proyecto de investigacion sobre mejores condiciones de cultivo del cacao.",
    "Campana ambiental Vereda Limpia para promover reciclaje y cuidado del agua.",
  ],
  contact: {
    whatsapp: "573233320426",
    message:
      "Puedes usar el formulario de contacto o escribir por WhatsApp al numero 3233320426.",
  },
  auth: {
    message:
      "La pagina tiene inicio de sesion con Firebase. Desde esa seccion puedes iniciar sesion, crear cuenta y luego habilitar el formulario de contacto.",
  },
  gallery: {
    message:
      "La galeria muestra imagenes de cultivos como cacao, banano, cafe, guayaba y mango.",
  },
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function appendAssistantMessage(author, text) {
  const body = document.getElementById("aiBody");
  const message = document.createElement("p");
  const label = document.createElement("strong");

  label.textContent = author === "user" ? "Tu: " : "IA: ";
  message.appendChild(label);
  message.appendChild(document.createTextNode(text));
  body.appendChild(message);
  body.scrollTop = body.scrollHeight;
}

function setAssistantWelcome() {
  const body = document.getElementById("aiBody");
  body.innerHTML = "";

  [
    "Hola, soy el asistente de la Feria Digital.",
    "Puedo ayudarte con cultivos, contacto, galeria, logros escolares, navegacion e inicio de sesion.",
    "Prueba preguntas como: que productos hay, como crear cuenta, cual es el WhatsApp o que logros tiene la escuela.",
  ].forEach((text) => appendAssistantMessage("assistant", text));
}

function getAllProductsSummary() {
  const productNames = Object.keys(assistantKnowledge.products).map((name) => {
    const product = assistantKnowledge.products[name];
    return `${capitalize(name)} (${product.category})`;
  });

  return `En la pagina aparecen estos productos: ${productNames.join(", ")}.`;
}

function getAchievementsSummary() {
  return `Los logros destacados son: ${assistantKnowledge.achievements.join(" ")}`;
}

function getSectionsSummary() {
  return `La pagina esta organizada en estas secciones: ${assistantKnowledge.feria.sections.join(", ")}.`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

function findProduct(text) {
  const productEntries = Object.entries(assistantKnowledge.products);
  return productEntries.find(([name]) => text.includes(name));
}

function resolveAssistantReply(rawText) {
  const text = normalizeText(rawText);

  if (!text) {
    return "Escribe una pregunta y con gusto te ayudo con la informacion de la pagina.";
  }

  if (includesAny(text, ["hola", "buenas", "buen dia", "saludos"])) {
    assistantState.lastTopic = "welcome";
    return "Hola. Puedo ayudarte con productos, logros escolares, contacto, galeria e inicio de sesion.";
  }

  if (includesAny(text, ["gracias", "muchas gracias"])) {
    return "Con gusto. Si quieres, tambien te puedo resumir toda la pagina o explicarte una seccion especifica.";
  }

  if (includesAny(text, ["que puedes hacer", "en que ayudas", "ayuda", "como funcionas"])) {
    assistantState.lastTopic = "help";
    return "Puedo responder preguntas sobre los cultivos, los logros escolares, la galeria, el contacto, el WhatsApp, la navegacion y el inicio de sesion con Firebase.";
  }

  if (includesAny(text, ["que es esta pagina", "de que trata", "que hay en la pagina", "resumen de la pagina"])) {
    assistantState.lastTopic = "page";
    return `${assistantKnowledge.feria.summary} ${getSectionsSummary()}`;
  }

  if (includesAny(text, ["secciones", "navegacion", "navegar", "donde esta"])) {
    assistantState.lastTopic = "sections";
    return getSectionsSummary();
  }

  if (includesAny(text, ["producto", "productos", "cultivo", "cultivos", "que venden", "que hay"])) {
    const matchedProduct = findProduct(text);

    if (matchedProduct) {
      const [name, product] = matchedProduct;
      assistantState.lastTopic = name;
      return `${capitalize(name)}: ${product.summary} ${product.detail}`;
    }

    assistantState.lastTopic = "products";
    return `${getAllProductsSummary()} Si quieres, tambien te cuento mas sobre banano, cafe, cacao, mango o guayaba.`;
  }

  if (includesAny(text, ["fruta", "frutas"])) {
    assistantState.lastTopic = "frutas";
    return `En la categoria de frutas estan ${assistantKnowledge.categories.frutas.join(", ")}.`;
  }

  if (includesAny(text, ["grano", "granos"])) {
    assistantState.lastTopic = "granos";
    return `En granos aparece ${assistantKnowledge.categories.granos.join(", ")}.`;
  }

  if (includesAny(text, ["hortaliza", "hortalizas"])) {
    assistantState.lastTopic = "hortalizas";
    return `En hortalizas aparece ${assistantKnowledge.categories.hortalizas.join(", ")}.`;
  }

  const matchedProduct = findProduct(text);
  if (matchedProduct) {
    const [name, product] = matchedProduct;
    assistantState.lastTopic = name;
    return `${capitalize(name)}: ${product.summary} ${product.detail}`;
  }

  if (includesAny(text, ["logro", "logros", "escuela", "colegio", "institucion", "proyecto", "proyectos"])) {
    assistantState.lastTopic = "achievements";
    return getAchievementsSummary();
  }

  if (includesAny(text, ["galeria", "fotos", "imagenes", "imagenes de la pagina"])) {
    assistantState.lastTopic = "gallery";
    return assistantKnowledge.gallery.message;
  }

  if (includesAny(text, ["contacto", "whatsapp", "telefono", "numero", "celular"])) {
    assistantState.lastTopic = "contact";
    return `${assistantKnowledge.contact.message} El enlace de WhatsApp esta en la seccion de contacto.`;
  }

  if (includesAny(text, ["sesion", "login", "iniciar sesion", "crear cuenta", "registro", "firebase", "acceso"])) {
    assistantState.lastTopic = "auth";
    return `${assistantKnowledge.auth.message} Si el acceso no funciona, abre la pagina desde localhost o un hosting, no con doble clic al archivo.`;
  }

  if (includesAny(text, ["formulario", "mensaje", "enviar mensaje"])) {
    assistantState.lastTopic = "form";
    return "El formulario de contacto pide nombre, celular de 10 digitos y un mensaje de al menos 10 caracteres. Solo se habilita cuando el usuario inicia sesion.";
  }

  if (includesAny(text, ["y tambien", "y que mas", "amplia", "mas informacion"]) && assistantState.lastTopic) {
    if (assistantState.lastTopic === "products") {
      return "Puedo ampliarte producto por producto: banano, cafe, cacao, mango y guayaba.";
    }

    if (assistantState.lastTopic === "achievements") {
      return "Los logros combinan trabajo agricola, investigacion escolar, participacion comunitaria y cuidado ambiental.";
    }

    if (assistantState.lastTopic === "auth") {
      return "Despues de iniciar sesion o crear cuenta, el formulario de contacto queda disponible para enviar mensajes.";
    }
  }

  return "Puedo ayudarte mejor si preguntas por cultivos, logros escolares, galeria, contacto, WhatsApp, navegacion o el inicio de sesion.";
}

function responderIA() {
  const input = document.getElementById("aiInput");
  const rawText = input.value.trim();

  if (!rawText) {
    return;
  }

  appendAssistantMessage("user", rawText);
  appendAssistantMessage("assistant", resolveAssistantReply(rawText));

  input.value = "";
  console.log("[IA] Pregunta:", rawText);
}

// abrir y cerrar IA
function toggleIA() {
  const panel = document.getElementById("aiPanel");
  const shouldOpen = panel.style.display !== "flex";

  panel.style.display = shouldOpen ? "flex" : "none";

  if (shouldOpen) {
    document.getElementById("aiInput").focus();
  }
}

function initAssistant() {
  const input = document.getElementById("aiInput");
  setAssistantWelcome();

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      responderIA();
    }
  });
}

document.addEventListener("DOMContentLoaded", initAssistant);
