class Utils {
    constructor () {
    }

    static incrementar() {
        let total = 0;
        return function () {
            total++
            return total
        }
    }
    static increment = Utils.incrementar()

    static render() {
        const $name = document.getElementById('name');
        const $email = document.getElementById('email');
        const $password = document.getElementById('password');
        const $btnUser = document.getElementById('register-User');
        const $btnAdmin = document.getElementById('register-Admin');
        const $btnBooking = document.getElementById('reservar')


        document.addEventListener('DOMContentLoaded', (  ) => {

            $btnUser.addEventListener('click', (e) => {
                e.preventDefault()
                UsuarioRegular.createUser($name.value, $password.value, $email.value)
            })

            $btnAdmin.addEventListener('click', (e) => {
                e.preventDefault()
                let adminToken = prompt('escribe la clave para crear un usuario administrador:')
                Administrador.createUser($name.value, $password.value, $email.value, adminToken)
            })

            $btnBooking.addEventListener('click', (e) => {
                e.preventDefault()
                let registrado = confirm('ya estas registrado?');
                if (!registrado) {
                    console.log('debes registrarte primero');
                    return
                };
                let users = JSON.parse(localStorage.getItem('users'))
                let emailRequest = prompt("escribe el correo registrado: ")
                let checkEmail = users.find((e) => e.email === emailRequest)

                if (checkEmail === undefined) {
                    console.log('No es un correo registrado');
                    return
                };

                switch (checkEmail.token) {
                    case 'admin':
                        let decision = prompt('que accion deseas realizar? 1. reservar 2. editar una reserva 3. eliminar una reserva 4. ver reservas.');
                        switch (decision) {
                            case '1':
                                Booking.crearReserva(checkEmail.name, checkEmail.email, checkEmail.token)
                                break;
                            case '2':
                                Booking.editarReserva()
                                break;
                            case '3':
                                Booking.eliminarReserva()
                                break;
                            case '4':
                                Booking.verReservas()
                                break;

                                default:
                                break;
                        }
                        break;
                        case 'regularUser':
                            Booking.crearReserva(checkEmail.name, checkEmail.email, checkEmail.token)

                    default:
                        break;
                }

            })
        })
    }
}


class Persona {
    static users = []
    constructor(userName, password, realEmail) {
        this.id = Utils.increment();
        this.userName = userName;
        this.email = realEmail;
        this.password = password;
    }

    static createUser(userName, password, realEmail) {
        let user = new Persona(userName, password, realEmail);
        Persona.users.push(user);
        console.log(Persona.users);
    }
}

class UsuarioRegular extends Persona {

    constructor(userName, password, realEmail) {
        super(userName, password, realEmail)
        this.token = 'regularUser';
    }

    static createUser(userName, password, realEmail) {
        let user = new UsuarioRegular(userName, password, realEmail);
        if (localStorage.getItem('users')) {
            Persona.users = JSON.parse(localStorage.getItem('users'))
        }
        Persona.users.push(user);
        console.log(Persona.users);
        localStorage.setItem("users", JSON.stringify(Persona.users));
    }

}

class Administrador extends Persona {
    constructor(userName, password, realEmail) {
        super(userName, password, realEmail)
        this.token='admin'
    }

    static createUser(userName, password, realEmail, adminToken) {
        if (adminToken !== 'admin123') {
            console.log('no tienes el accesso para crear un administrador');
            return
        }
            let newAdmin = new Administrador(userName, password, realEmail);
            if (localStorage.getItem('users')) {
                Persona.users = JSON.parse(localStorage.getItem('users'))
            }
            Persona.users.push(newAdmin);
            console.log(Persona.users);
            localStorage.setItem("users", JSON.stringify(Persona.users))

    }

}

class Booking {
    static bookings = []
    constructor(name, email, date, number_guest) {
        this.id = Booking.bookings.length + 1
        this.name = name
        this.email = email
        this.date = date
        this.number_guest = number_guest || 1;
    }

    static crearReserva(name, email, token) {
        if(token === 'admin') {
            let people = Number(prompt('¿cuantas personas? '));
            let fecha = new Date(prompt('escribe la fecha de inicio (AAAA/MM/DD): '))
            let booking = new Booking(name, email, fecha, people);
            if(localStorage.getItem('bookings')) {
                Booking.bookings = JSON.parse(localStorage.getItem('bookings'))
            }
            Booking.bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(Booking.bookings))
        }
        if(token === 'regularUser') {
            let fecha = new Date(prompt('escribe la fecha de inicio (AAAA/MM/DD): '))
            let booking = new Booking(name, email, fecha);
            if(localStorage.getItem('bookings')) {
                Booking.bookings = JSON.parse(localStorage.getItem('bookings'))
            }
            this.bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(Booking.bookings))
        }
    }

    static verReservas() {
        let reservas = JSON.parse(localStorage.getItem('bookings'))
        console.log(reservas);
        reservas.forEach((element) => {
            console.log(element);
        });
        return reservas;
    };

    static editarReserva() {
        let reservas = Booking.verReservas()
        let nombreReserva = prompt('danos el email de la persona a la que esta asignada la reserva que quieres editar: ');
        let index = reservas.findIndex((e) => e.email === nombreReserva)
        let fecha = new Date(prompt('escribe la fecha de nueva (AAAA/MM/DD): '))
        reservas[index].date = fecha
        localStorage.setItem('bookings', JSON.stringify(reservas))
    }

    static eliminarReserva() {
        let reservas = Booking.verReservas()
        let id = parseInt(prompt('escribe el id de la reserva que deseas eliminar: '));
        let index = reservas.findIndex((e) => e.id === id);
        reservas.splice(index,1)
        localStorage.setItem('bookings', JSON.stringify(reservas))
    }
}

Utils.render()
