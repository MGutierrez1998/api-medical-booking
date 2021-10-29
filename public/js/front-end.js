// set token
let token = ""
let userId = ""
let doctorId = ""
let departments = ""
let doctor_page = 1
let location_page = 1

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
const btnNav = document.querySelector("#buttons-nav")
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

    console.log(response)

    if (response.token) {
        login.style.display = "none"
        dashboard.style.display = "block"
        btnNav.style.display = "flex"
        token = response.token
        userId = response.user.id
        if (response.user.role === "patient") {
            load_patient_dashboard()
            get_patient_history()
        } else {
            load_doctor_dashboard()
        }
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

// dashboard
const dashboard = document.querySelector("#dashboard")
dashboard.style.display = "none"

// loadds dashboard
async function load_patient_dashboard() {
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
                procedureId: { procedure, duration },
                locationId: { room },
                doctorId: {
                    userId: { name, surname },
                },
            } = book

            const date = new Date(bookingTime)

            return `<div id="dash">
            <hr>
            <table>
                
                <tr>
                  <th>Procedure</th>
                  <th>Duration</th>
                  <th>Doctor</th>
                  <th>Booking Tme</th>
                  <th>Location</th>
                </tr>
                <tr>
                  <td>${procedure}</td>
                  <td>${duration / 60000}</td>
                  <td>${name} ${surname}</td>
                  <td>${
                    date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
                }:${date.getMinutes()}${
                    date.getHours() > 12 ? "pm" : "am"
                },  ${date.getDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}</td>
                  <td>${room}</td>
                </tr>
               
              </table>
        </div>`
        })
        .join("")

    departments = await (
        await fetch(`/api/v1/department`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    ).json()

    departments = departments.department

    document.querySelector("#department-list").innerHTML += departments
        .map(
            (department) =>
                `<option value="${department._id}">${department.department}</option>`
        )
        .join("")
}

// booking form
const booking = document.querySelector("#booking-form")
const booking_list = document.querySelector("#booking-list")
const procedure_list = document.querySelector("#procedure-list")
const doctor_list = document.querySelector("#doctor-list")
const location_list = document.querySelector("#location-list")
const diagnose_list = document.querySelector("#booking-diagnose")
booking.style.display = "none"

// goes to booking form from dashboard
document.querySelector("#create-booking").onclick = () => {
    booking_list.style.display = "none"
    booking.style.display = "block"
}

// go to dashboard from booking form
document.querySelector("#goto-dashboard").onclick = () => {
    booking.style.display = "none"
    booking_list.style.display = "block"
    diagnose_list.style.display = "none"
}

// got to medical history from dashboard or booking
document.querySelector("#goto-diagnose").onclick = () => {
    booking.style.display = "none"
    booking_list.style.display = "none"
    diagnose_list.style.display = "block"
}

diagnose_list.style.display = "none"

// gets patient medical history
async function get_patient_history() {
    const response = await (
        await fetch(`/api/v1/diagnose?userId=${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    ).json()

    diagnose_list.innerHTML = response.diagnose
        .map((diagnose) => {
            const {
                bookingId: {
                    procedureId: { procedure },
                },
                issue,
                outcome,
                recommendation,
            } = diagnose

            return `<div>
                <h2>Procedure: ${procedure}</h2>
                <h3>Issue: ${issue}</h3>
                <h3>Outcome: ${outcome}</h3>
                <h3>Recommendation: ${recommendation}</h3>
            </div>`
        })
        .join("")
}

// reloads booking form if department changes
const department_list = document.querySelector("#department-list")
department_list.onchange = async () => {
    const chosenDepartment = department_list.value

    const procedures = departments.filter((department) => {
        if (chosenDepartment === department._id) {
            return department.procedures
        }
    })[0]

    procedure_list.innerHTML =
        `<option value="" disabled selected>
                                    Choose Procedure
                                </option>` +
        procedures.procedures
            .map((procedure) => {
                return `<option value="${procedure._id}">${procedure.procedure}</option>`
            })
            .join("")

    const doctors = await (
        await fetch(`/api/v1/doctor?departmentId=${chosenDepartment}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    ).json()

    doctor_list.innerHTML =
        `<option value="" disabled selected>Choose Doctor</option>` +
        doctors.doctor.map((doctor) => {
            const {
                _id,
                userId: { name, surname },
            } = doctor
            return `<option value="${_id}">Dr. ${name} ${surname}</option>`
        })

    const locations = await (
        await fetch(`/api/v1/location?departmentId=${chosenDepartment}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    ).json()

    location_list.innerHTML =
        `<option value="" disabled selected>Choose Location</option>` +
        locations.location.map((location) => {
            const { _id, room } = location
            return `<option value="${_id}">${room}</option>`
        })
}

// loads more doctor
document.querySelector("#next-doctor").onclick = async () => {
    const chosenDepartment = department_list.value

    doctor_page += 1
    const doctors = await (
        await fetch(
            `/api/v1/doctor?departmentId=${chosenDepartment}&page=${doctor_page}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )
    ).json()

    if (doctors.count === 0) {
        doctor_page = 0
    }
    doctor_list.innerHTML =
        `<option value="" disabled selected>Choose Doctor</option>` +
        doctors.doctor.map((doctor) => {
            const {
                _id,
                userId: { name, surname },
            } = doctor
            return `<option value="${_id}">Dr. ${name} ${surname}</option>`
        })
}

// loads more locations
document.querySelector("#next-location").onclick = async () => {
    const chosenDepartment = department_list.value

    location_page += 1
    const locations = await (
        await fetch(
            `/api/v1/location?departmentId=${chosenDepartment}&page=${location_page}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )
    ).json()

    if (locations.count === 0) {
        location_page = 0
    }
    location_list.innerHTML =
        `<option value="" disabled selected>Choose Location</option>` +
        locations.location.map((location) => {
            const { _id, room } = location
            return `<option value="${_id}">${room}</option>`
        })
}

// handles submit booking form
booking.addEventListener("submit", async (event) => {
    event.preventDefault()
    const { procedureId, doctorId, locationId, bookingTime, description } =
        booking.elements

    let timestamp = new Date(bookingTime.value)
    timestamp = timestamp.getTime()

    const response = await (
        await fetch("/api/v1/booking", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                procedureId: procedureId.value,
                doctorId: doctorId.value,
                locationId: locationId.value,
                bookingTime: timestamp,
                description: description.value.trim(),
            }),
        })
    ).json()

    if (response.msg) {
        const pop_up = document.querySelector("#booking-response")
        pop_up.innerHTML = `<h3>${response.msg}</h3>`
        setInterval(() => {
            pop_up.innerHTML = ""
        }, 3000)
    } else {
        const date = new Date()
        const response = await (
            await fetch(
                `/api/v1/booking?userId=${userId}&week=${date.getTime()}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
        ).json()
        document.querySelector("#booking-list").innerHTML = response.booking
            .map((book) => {
                const {
                    _id,
                    bookingTime,
                    procedureId: { procedure },
                    locationId: { room },
                    doctorId: {
                        userId: { name, surname },
                    },
                } = book

                console.log(book)

                return `<div id="${_id}">
                            <h3>Procedure: ${procedure}</h3>
                            <h4>Doctor: ${name} ${surname}</h4>
                            <h4>Booking Time: ${bookingTime}</h4>
                            <h4>Location: ${room}</h4>
                        </div>`
            })
            .join("")

        booking.style.display = "none"
        booking_list.style.display = "block"
    }
})

// render doctor dashboard
async function load_doctor_dashboard() {
    const { doctor } = await (
        await fetch(`/api/v1/doctor?userId=${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    ).json()

    const date = new Date()
    const response = await (
        await fetch(
            `/api/v1/booking?doctorId=${doctor[0]._id}&week=${date.getTime()}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )
    ).json()

    booking_list.innerHTML = response.booking
        .map((book) => {
            const {
                _id,
                bookingTime,
                procedureId: { procedure, duration },
                locationId: { room },
                userId: { name, surname },
            } = book

            const date = new Date(bookingTime)

            return `<div id="${_id}">
                        <h3>Procedure: ${procedure}</h3>
                        <h5>Duration: ${duration / 60000} mins</h5>
                        <h4>Patient: ${name} ${surname}</h4>
                        <h4>Booking Time: ${
                            date.getHours() > 12
                                ? date.getHours() - 12
                                : date.getHours()
                        }:${date.getMinutes()}${
                date.getHours() > 12 ? "pm" : "am"
            },  ${date.getDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}</h4>
                        <h4>Location: ${room}</h4>
                        <button type="button" class="diagnose" value="${_id}">Diagnose Patient</button>
                    </div>`
        })
        .join("")

    document.querySelector("#create-booking").style.display = "none"
    document.querySelector("#goto-diagnose").style.display = "none"

    document
        .querySelector(".diagnose")
        .addEventListener("click", async function (event) {
            event.preventDefault()
            const bookingId = this.value

            booking_list.style.display = "none"
            document.querySelector("#booking-diagnose").style.display = "block"

            const book = await (
                await fetch(`/api/v1/booking/${bookingId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
            ).json()

            if (book.booking) {
                const {
                    doctorId: {
                        userId: { name: doctorName, surname: doctorSurname },
                    },
                    locationId: { room },
                    procedureId: { procedure },
                    userId: {
                        name: patientName,
                        surname: patientSurname,
                        _id: patient_id,
                    },
                } = book.booking

                document.querySelector("#booking-diagnose").innerHTML = `<div>
                        <div>
                            <p>This procedure of ${procedure} is being conducted by Dr. ${doctorName} ${doctorSurname} on the patient ${patientName} ${patientSurname} at room ${room}</p>
                            <form id="diagnose-form">
                                <div id="diagnose-response"></div>
                                <input type="hidden" name="userId" value="${patient_id}" />
                                <input type="hidden" name="bookingId" value="${bookingId}" />
                                <div>
                                    <label for="issue">
                                        <strong>Issue</strong>
                                    </label>
                                    <textarea
                                        id="diagnose-issue"
                                        name="issue"
                                        rows="4"
                                        cols="50"
                                        maxlength="100"
                                        placeholder="Add Issue"
                                        required
                                    >
                                    </textarea>
                                </div>
                                <div>
                                    <label for="outcome">
                                        <strong>Outcome</strong>
                                    </label>
                                    <textarea
                                        id="diagnose-outcome"
                                        name="outcome"
                                        rows="4"
                                        cols="50"
                                        maxlength="100"
                                        placeholder="Add outcome"
                                        required
                                    >
                                    </textarea>
                                </div>
                                <div>
                                    <label for="recommendation">
                                        <strong>Recommendation</strong>
                                    </label>
                                    <textarea
                                        id="diagnose-recommendation"
                                        name="recommendation"
                                        rows="4"
                                        cols="50"
                                        maxlength="100"
                                        placeholder="Add Recommendation"
                                        required
                                    >
                                    </textarea>
                                </div>
                                <div>
                                    <button type="submit" id="diagnose-submit">
                                        Save Diagnoses
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>`

                const diagnose = document.querySelector("#diagnose-form")
                diagnose.addEventListener("submit", async (event) => {
                    event.preventDefault()

                    const {
                        userId,
                        bookingId,
                        issue,
                        outcome,
                        recommendation,
                    } = diagnose.elements

                    const response = await (
                        await fetch("/api/v1/diagnose", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId: userId.value,
                                bookingId: bookingId.value,
                                issue: issue.value.trim(),
                                outcome: outcome.value.trim(),
                                recommendation: recommendation.value.trim(),
                            }),
                        })
                    ).json()

                    if (response.msg) {
                        const pop_up =
                            document.querySelector("#diagnose-response")
                        pop_up.innerHTML = `<h3>This booking's diagnoses has already been saved</h3>`
                        setInterval(() => {
                            pop_up.innerHTML = ""
                        }, 3000)
                    } else {
                        document.querySelector(
                            "#booking-diagnose"
                        ).style.display = "none"
                        document.querySelector("#booking-list").style.display =
                            "block"
                    }
                })
            }
        })
}
