// set token
let token = ""
let userId = ""

// registration

// input genders list
document.querySelector("#gender-list").innerHTML = genders
    .map((gender) => `<option value="${gender}" />`)
    .join("")

// input nationalities list
document.querySelector("#nationality-list").innerHTML = nationalities
    .map((nationality) => `<option value="${nationality}" />`)
    .join("")

// on registation form submission event
const register = document.querySelector("#registration-form")
register.style.display = "none"
register.addEventListener("submit", async (event) => {
    event.preventDefault()

    const {
        email,
        password,
        name,
        surname,
        gender,
        nationality,
        mobile,
        address,
    } = register.elements

    const response = await (
        await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                name: name.value,
                surname: surname.value,
                gender: gender.value,
                nationality: nationality.value,
                mobile: mobile.value,
                address: address.value,
            }),
        })
    ).json()

    if (response.token) {
        register.style.display = "none"
        login.style.display = "block"
    } else {
        const pop_up = document.querySelector("#register-response")
        pop_up.innerHTML = `<h3>${response.msg}</h3>`
        setInterval(() => {
            pop_up.innerHTML = ""
        }, 3000)
    }
})

// goes to login from register
document.querySelector("#goto-login").onclick = () => {
    register.style.display = "none"
    login.style.display = "block"
}

// login

// on login form submission event
const login = document.querySelector("#login-form")
login.addEventListener("submit", async (event) => {
    event.preventDefault()

    const { email, password } = login.elements

    const response = await (
        await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        })
    ).json()

    if (response.token) {
        login.style.display = "none"
        dashboard.style.display = "block"
        token = response.token
        userId = response.user.id
        load_dashboard()
    } else {
        const pop_up = document.querySelector("#login-response")
        pop_up.innerHTML = `<h3>${response.msg}</h3>`
        setInterval(() => {
            pop_up.innerHTML = ""
        }, 3000)
    }
})

// goes to registration from login
document.querySelector("#goto-register").onclick = () => {
    login.style.display = "none"
    register.style.display = "block"
}

// dashbaord

const dashboard = document.querySelector("#dashboard")
dashboard.style.display = "none"

async function load_dashboard() {
    // dashboard.innerHTML +=

    const date = new Date()
    const response = await (
        await fetch(`/api/v1/booking?userId=${userId}&week=${date.getTime()}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    ).json()

    const { booking } = response
    document.querySelector("#booking-list").innerHTML = booking
        .map((book) => {
            const {
                _id,
                bookingTime,
                procedure,
                locationId: { room },
            } = book

            return `<div id="${_id}">
            <h3>Procedure: ${procedure}</h3>
            <h4>Booking Time: ${bookingTime}</h4>
            <h4>Location: ${room}</h4>
        </div>`
        })
        .join("")
}
