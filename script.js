/* =====================================================
   BLACKMACHINE
   JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const openLogin = document.getElementById("openLogin");

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const closeLogin = document.getElementById("closeLogin");
const closeRegister = document.getElementById("closeRegister");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const bookingForm = document.getElementById("bookingForm");

const serviceSelect = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");

const summaryPrice = document.getElementById("summaryPrice");

const bookingsList = document.getElementById("bookingsList");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* =====================================================
   BANCO LOCAL
===================================================== */

let users = JSON.parse(
    localStorage.getItem("blackmachine_users")
) || [];

let bookings = JSON.parse(
    localStorage.getItem("blackmachine_bookings")
) || [];

let currentUser = JSON.parse(
    localStorage.getItem("blackmachine_current_user")
) || null;


/* =====================================================
   MENU MOBILE
===================================================== */

menuBtn.addEventListener("click", () => {

    nav.classList.toggle("active");

});


document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});


/* =====================================================
   MODAIS
===================================================== */

function openModal(modal) {

    modal.classList.add("active");

}


function closeModal(modal) {

    modal.classList.remove("active");

}


openLogin.addEventListener("click", () => {

    if (currentUser) {

        logout();

    } else {

        openModal(loginModal);

    }

});


closeLogin.addEventListener("click", () => {

    closeModal(loginModal);

});


closeRegister.addEventListener("click", () => {

    closeModal(registerModal);

});


showRegister.addEventListener("click", () => {

    closeModal(loginModal);

    openModal(registerModal);

});


showLogin.addEventListener("click", () => {

    closeModal(registerModal);

    openModal(loginModal);

});


window.addEventListener("click", event => {

    if (event.target === loginModal) {
        closeModal(loginModal);
    }

    if (event.target === registerModal) {
        closeModal(registerModal);
    }

});


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* =====================================================
   CADASTRO
===================================================== */

registerForm.addEventListener("submit", event => {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("registerPassword").value;


    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {

        showToast("Este e-mail já está cadastrado.");

        return;

    }


    const newUser = {

        id: Date.now(),

        name,

        email,

        password

    };


    users.push(newUser);


    localStorage.setItem(
        "blackmachine_users",
        JSON.stringify(users)
    );


    currentUser = {

        id: newUser.id,

        name: newUser.name,

        email: newUser.email

    };


    localStorage.setItem(
        "blackmachine_current_user",
        JSON.stringify(currentUser)
    );


    registerForm.reset();

    closeModal(registerModal);

    updateLoginButton();

    renderBookings();

    showToast(
        `Bem-vindo à BLACKMACHINE, ${name}!`
    );

});


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener("submit", event => {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();


    const password =
        document.getElementById("loginPassword")
        .value;


    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );


    if (!user) {

        showToast(
            "E-mail ou senha incorretos."
        );

        return;

    }


    currentUser = {

        id: user.id,

        name: user.name,

        email: user.email

    };


    localStorage.setItem(
        "blackmachine_current_user",
        JSON.stringify(currentUser)
    );


    loginForm.reset();

    closeModal(loginModal);

    updateLoginButton();

    renderBookings();

    showToast(
        `Bem-vindo de volta, ${user.name}!`
    );

});


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    currentUser = null;

    localStorage.removeItem(
        "blackmachine_current_user"
    );

    updateLoginButton();

    renderBookings();

    showToast("Você saiu da sua conta.");

}


function updateLoginButton() {

    if (currentUser) {

        openLogin.textContent = "SAIR";

    } else {

        openLogin.textContent = "ENTRAR";

    }

}


updateLoginButton();


/* =====================================================
   SERVIÇO
===================================================== */

serviceSelect.addEventListener("change", () => {

    const value = serviceSelect.value;

    if (!value) {

        summaryPrice.textContent = "R$ 0,00";

        return;

    }


    const parts = value.split("|");

    const price = Number(parts[1]);


    summaryPrice.textContent =
        `R$ ${price.toFixed(2).replace(".", ",")}`;

});


/* =====================================================
   DATAS
===================================================== */

const today = new Date();

const year = today.getFullYear();

const month =
    String(today.getMonth() + 1)
    .padStart(2, "0");

const day =
    String(today.getDate())
    .padStart(2, "0");


dateInput.min =
    `${year}-${month}-${day}`;


/* =====================================================
   HORÁRIOS
===================================================== */

const availableTimes = [

    "09:00",
    "09:30",
    "10:00",
    "10:30",

    "11:00",
    "11:30",

    "13:00",
    "13:30",
    "14:00",
    "14:30",

    "15:00",
    "15:30",
    "16:00",
    "16:30",

    "17:00",
    "17:30",
    "18:00",
    "18:30",

    "19:00",
    "19:30"

];


function loadAvailableTimes() {

    timeSelect.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Escolha o horário";

    timeSelect.appendChild(defaultOption);


    if (!dateInput.value) {

        return;

    }


    availableTimes.forEach(time => {

        const option =
            document.createElement("option");

        option.value = time;

        option.textContent = time;


        const alreadyBooked =
            bookings.some(booking =>

                booking.date === dateInput.value &&
                booking.time === time

            );


        if (alreadyBooked) {

            option.disabled = true;

            option.textContent =
                `${time} — indisponível`;

        }


        timeSelect.appendChild(option);

    });

}


dateInput.addEventListener(
    "change",
    loadAvailableTimes
);


/* =====================================================
   AGENDAMENTO
===================================================== */

bookingForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!currentUser) {

            showToast(
                "Faça login antes de agendar."
            );

            openModal(loginModal);

            return;

        }


        const serviceValue =
            serviceSelect.value;


        const barber =
            document.getElementById("barber").value;


        const date =
            dateInput.value;


        const time =
            timeSelect.value;


        if (
            !serviceValue ||
            !barber ||
            !date ||
            !time
        ) {

            showToast(
                "Preencha todos os campos."
            );

            return;

        }


        const parts =
            serviceValue.split("|");


        const service = parts[0];

        const price = Number(parts[1]);


        const alreadyBooked =
            bookings.some(booking =>

                booking.date === date &&
                booking.time === time

            );


        if (alreadyBooked) {

            showToast(
                "Este horário acabou de ser reservado."
            );

            loadAvailableTimes();

            return;

        }


        const booking = {

            id: Date.now(),

            userId: currentUser.id,

            client: currentUser.name,

            service,

            price,

            barber,

            date,

            time

        };


        bookings.push(booking);


        localStorage.setItem(
            "blackmachine_bookings",
            JSON.stringify(bookings)
        );


        bookingForm.reset();

        summaryPrice.textContent =
            "R$ 0,00";

        loadAvailableTimes();

        renderBookings();


        showToast(
            `Agendamento confirmado para ${formatDate(date)} às ${time}.`
        );


        document
            .getElementById("myBookings")
            ?.scrollIntoView();

    }
);


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatDate(dateString) {

    const [year, month, day] =
        dateString.split("-");

    return `${day}/${month}/${year}`;

}


/* =====================================================
   MOSTRAR AGENDAMENTOS
===================================================== */

function renderBookings() {

    if (!currentUser) {

        bookingsList.innerHTML = `
            <div class="empty-bookings">
                Faça login para visualizar seus agendamentos.
            </div>
        `;

        return;

    }


    const userBookings =
        bookings.filter(
            booking =>
                booking.userId === currentUser.id
        );


    if (userBookings.length === 0) {

        bookingsList.innerHTML = `
            <div class="empty-bookings">
                Você ainda não possui agendamentos.
            </div>
        `;

        return;

    }


    bookingsList.innerHTML =
        userBookings
        .sort((a, b) => {

            const dateA =
                new Date(`${a.date}T${a.time}`);

            const dateB =
                new Date(`${b.date}T${b.time}`);

            return dateA - dateB;

        })
        .map(booking => `

            <div class="booking-item">

                <div>

                    <h3>
                        ${booking.service}
                    </h3>

                    <p>
                        📅 ${formatDate(booking.date)}
                        &nbsp; • &nbsp;
                        ⏰ ${booking.time}
                    </p>

                    <p>
                        Barbeiro:
                        ${booking.barber}
                        &nbsp; • &nbsp;
                        R$ ${booking.price.toFixed(2).replace(".", ",")}
                    </p>

                </div>


                <button
                    class="cancel-btn"
                    onclick="cancelBooking(${booking.id})">

                    CANCELAR

                </button>

            </div>

        `)
        .join("");

}


/* =====================================================
   CANCELAR AGENDAMENTO
===================================================== */

function cancelBooking(id) {

    const confirmed =
        confirm(
            "Deseja realmente cancelar este agendamento?"
        );


    if (!confirmed) {

        return;

    }


    bookings =
        bookings.filter(
            booking => booking.id !== id
        );


    localStorage.setItem(
        "blackmachine_bookings",
        JSON.stringify(bookings)
    );


    renderBookings();

    loadAvailableTimes();

    showToast(
        "Agendamento cancelado."
    );

}


/* =====================================================
   BOTÕES DOS SERVIÇOS
===================================================== */

document.querySelectorAll(".service-btn")
.forEach(button => {

    button.addEventListener("click", () => {

        const service =
            button.dataset.service;

        const price =
            button.dataset.price;


        serviceSelect.value =
            `${service}|${price}`;


        summaryPrice.textContent =
            `R$ ${Number(price)
                .toFixed(2)
                .replace(".", ",")}`;


        document
            .getElementById("agenda")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

renderBookings();

loadAvailableTimes();
