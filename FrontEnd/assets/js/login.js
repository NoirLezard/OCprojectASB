const email = document.getElementById("email");
const password = document.getElementById("password");
const errorMail = document.querySelector(".error_mail");
const errorPsswd = document.querySelector(".error_psswd");

const submit = document.getElementById("submit");
const userDisconnected = document.querySelector(".user_disconnected");

/*
// FONCTION LOGIN==========================================================================
*/

function login(id) {
    console.log(id);
    errorMail.innerHTML = "";
    errorPsswd.innerHTML = "";
    // vérif email
    if (!id.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Veuillez entrer une addresse mail valide";
        errorMail.appendChild(p);
        return;
    }
    // vérif password
    if (id.password.length < 5 && !id.password.match(/^[a-zA-Z0-9]+$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Veuillez entrer un mot de passe valide";
        errorPsswd.appendChild(p);
        return;
    }
    // verif email / password
    else {
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(id)
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                // Si email / password incorrect
                if (result.error || result.message) {
                    const p = document.createElement("p");
                    p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte";
                    errorPsswd.appendChild(p);

                // Si email / password correct
                } else if (result.token) {
                    localStorage.setItem("token", result.token);
                    window.location.href = "index.html";
                }

            })
            .catch(error =>
                console.log(error));
    }
}


// Valeurs(btn submit) envoyées à la connection
submit.addEventListener("click", () => {
    let user = {
        email: email.value,
        password: password.value
    };
    login(user);
})

/*
// FONCTION LOGOUT==========================================================================
*/


userConnected();

// Déconnexion et suppression du token
function userConnected() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");

        // window.location.href = "login.html";
        
        const logOut = setTimeout(disconnected, 1000);
        const p = document.createElement("p");
        p.innerHTML = "Vous avez été déconnecté";
        userDisconnected.appendChild(p);
        return;
        
        function disconnected() {
            document.getElementById("user_disconnected").innerHTML = "veuillez vous reconnecter"
            clearTimeout(logOut);
        }
    }
}

