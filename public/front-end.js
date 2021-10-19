// set token
let token = ""

// registration

// input genders list
const register_gender_list = document.querySelector("#gender-list")
let gender_options = ""
genders.forEach((gender) => {
    gender_options += `<option value="${gender}" />`
})
register_gender_list.innerHTML = gender_options

// input nationalities list
const register_nationality_list = document.querySelector("#nationality-list")
let nationality_options = ""
nationalities.forEach((nationality) => {
    nationality_options += `<option value="${nationality}" />`
})
register_nationality_list.innerHTML = nationality_options

// on registation form submission event
const register = document.querySelector("#registration-form")
register.style.display = "none"
register.addEventListener("submit", async function (event) {
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
login.addEventListener("submit", async function (event) {
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
