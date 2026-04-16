import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAifncmLARpA9Ljk749dQGV1ymFD8IeGJA",
  authDomain: "feria-digital-47f29.firebaseapp.com",
  projectId: "feria-digital-47f29",
  storageBucket: "feria-digital-47f29.firebasestorage.app",
  messagingSenderId: "486566869894",
  appId: "1:486566869894:web:5ea6d2b381e90c998d0a07"
};

const configKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const authEstado = document.getElementById("authEstado");
const authUsuario = document.getElementById("authUsuario");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");
const btnLogout = document.getElementById("btnLogout");
const contactoAviso = document.getElementById("contactoAviso");
const contactoCampos = document.querySelectorAll("#formulario input, #formulario textarea, #formulario button");
let isProcessingAuth = false;
const isLocalFile = window.location.protocol === "file:";

const isFirebaseConfigured = configKeys.every((key) => {
  const value = firebaseConfig[key];
  return typeof value === "string" && value.trim() !== "" && !value.startsWith("REEMPLAZA_");
});

function updateStatus(message, state = "info") {
  authEstado.textContent = message;
  authEstado.dataset.state = state;
}

function setLoginButtonsDisabled(disabled) {
  btnLogin.disabled = disabled;
  btnRegister.disabled = disabled;
}

function setAuthProcessing(processing) {
  isProcessingAuth = processing;
  btnLogin.disabled = processing;
  btnRegister.disabled = processing;
  btnLogout.disabled = processing;
}

function setContactoDisponible(disponible) {
  contactoCampos.forEach((campo) => {
    campo.disabled = !disponible;
  });

  contactoAviso.style.display = disponible ? "none" : "block";
}

function clearCredentials() {
  authPassword.value = "";
}

function validateFields() {
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();

  if (!email || !password) {
    updateStatus("Completa correo y contrasena.", "error");
    return null;
  }

  if (password.length < 6) {
    updateStatus("La contrasena debe tener al menos 6 caracteres.", "error");
    return null;
  }

  return { email, password };
}

function getFriendlyError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Ese correo ya esta registrado.";
    case "auth/invalid-email":
      return "El correo no tiene un formato valido.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Correo o contrasena incorrectos.";
    case "auth/operation-not-allowed":
      return "Activa el proveedor Email/Password en Firebase Authentication.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Espera un momento e intenta de nuevo.";
    case "auth/network-request-failed":
      return "No hay conexion con Firebase. Revisa internet y vuelve a intentar.";
    default:
      return "No se pudo completar la autenticacion.";
  }
}

function showFirebaseConnectionHelp(message, state = "error") {
  setAuthProcessing(false);
  setLoginButtonsDisabled(true);
  setContactoDisponible(false);
  updateStatus(message, state);
  authUsuario.textContent = "Firebase no se pudo conectar correctamente.";
}

if (isLocalFile) {
  showFirebaseConnectionHelp(
    "Abre esta pagina desde localhost o un hosting. Si la abres con doble clic, Firebase puede bloquear el inicio de sesion.",
    "warning"
  );
} else if (!isFirebaseConfigured) {
  updateStatus("Falta configurar Firebase en js/firebase-auth.js.", "warning");
  setLoginButtonsDisabled(true);
  setContactoDisponible(false);
} else {
  try {
    updateStatus("Revisando sesion...", "info");
    setContactoDisponible(false);
    setAuthProcessing(true);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const authInitTimeout = window.setTimeout(() => {
      if (isProcessingAuth) {
        showFirebaseConnectionHelp(
          "No se pudo establecer conexion con Firebase. Revisa internet, el dominio autorizado y que la pagina este abierta desde localhost o un hosting."
        );
      }
    }, 6000);

    authForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isProcessingAuth || btnLogin.disabled) {
        return;
      }

      btnLogin.click();
    });

    btnLogin.addEventListener("click", async () => {
      if (isProcessingAuth) {
        return;
      }

      const credentials = validateFields();
      if (!credentials) {
        return;
      }

      setAuthProcessing(true);
      updateStatus("Verificando acceso...", "info");

      try {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        clearCredentials();
        updateStatus("Inicio de sesion correcto.", "success");
      } catch (error) {
        updateStatus(getFriendlyError(error), "error");
      } finally {
        setAuthProcessing(false);
      }
    });

    btnRegister.addEventListener("click", async () => {
      if (isProcessingAuth) {
        return;
      }

      const credentials = validateFields();
      if (!credentials) {
        return;
      }

      setAuthProcessing(true);
      updateStatus("Creando cuenta...", "info");

      try {
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        clearCredentials();
        updateStatus("Cuenta creada e inicio de sesion activo.", "success");
      } catch (error) {
        updateStatus(getFriendlyError(error), "error");
      } finally {
        setAuthProcessing(false);
      }
    });

    btnLogout.addEventListener("click", async () => {
      if (isProcessingAuth) {
        return;
      }

      setAuthProcessing(true);
      updateStatus("Cerrando sesion...", "info");

      try {
        await signOut(auth);
        updateStatus("Sesion cerrada.", "info");
      } catch (error) {
        updateStatus(getFriendlyError(error), "error");
      } finally {
        setAuthProcessing(false);
      }
    });

    onAuthStateChanged(auth, (user) => {
      window.clearTimeout(authInitTimeout);
      const authenticated = Boolean(user);

      isProcessingAuth = false;
      btnLogout.hidden = !authenticated;
      authEmail.disabled = authenticated;
      authPassword.disabled = authenticated;
      btnLogout.disabled = false;
      setLoginButtonsDisabled(authenticated);
      setContactoDisponible(authenticated);

      if (authenticated) {
        authUsuario.textContent = `Sesion activa: ${user.email}`;
        if (authEstado.dataset.state !== "success") {
          updateStatus("Sesion activa.", "success");
        }
        return;
      }

      authUsuario.textContent = "No has iniciado sesion.";
      authEmail.disabled = false;
      authPassword.disabled = false;
      btnLogout.disabled = false;
      updateStatus("Inicia sesion o crea una cuenta.", "info");
    });
  } catch (error) {
    showFirebaseConnectionHelp(
      "Firebase no se pudo iniciar. Revisa tu configuracion, el dominio autorizado y que Email/Password este activado."
    );
    console.error(error);
  }
}
