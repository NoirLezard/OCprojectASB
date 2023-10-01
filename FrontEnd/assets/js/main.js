/////////////////////////////////////////////////////
// >>> PROJECT Sophie Bluel
/////////////////////////////////////////////////////

/*
// VIEW GALLERY==================================================================
*/

// Init section projets
function initSectionProjects() {
    sectionProjects.innerHTML = "";
}

let data = null;
let id;
showProjects(data, null);



// BTN FILTERS
const btnAllCat = document.querySelector(".btn-filter-cat-null");
const btnCat1 = document.querySelector(".btn-filter-cat-1");
const btnCat2 = document.querySelector(".btn-filter-cat-2");
const btnCat3 = document.querySelector(".btn-filter-cat-3");

const sectionProjects = document.querySelector(".gallery");



// FILTRES
/*
0.Tous les projets
1.Objets
2.Appartements
3.Hôtels & restaurants
*/
btnAllCat.addEventListener("click", () => {
    showProjects(data, null);
})

btnCat1.addEventListener("click", () => {
    showProjects(data, 1);
})

btnCat2.addEventListener("click", () => {
    showProjects(data, 2);
})

btnCat3.addEventListener("click", () => {
    showProjects(data, 3);
})


// Token USER 
const token = localStorage.getItem("token");
const userActive = document.querySelector(".user-active");

// Affichage du panneau admin mode
adminPanel()
function adminPanel() {
    document.querySelectorAll(".admin_mode").forEach(a => {
        if (token === null) {
            return;
        }
        else {
            a.removeAttribute("aria-hidden")
            a.removeAttribute("style")
            userActive.innerHTML = "<a href='./login.html'>logout</a>";
        }
    });
}


// Récupération des projets via JSON
async function showProjects(data, id) {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        data = await response.json();
    }
    catch {
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Une erreur est survenue lors de la récupération des projets<br><br>Veuillez rafraichir la page<br><br><br>Si le problème persiste, contacter l'administrateur du site";
        sectionProjects.appendChild(p);
        await new Promise(resolve => setTimeout(resolve, 60000));
        window.location.href = "index.html";
    }

    initSectionProjects()

    // Filtre les résultats
    if ([1, 2, 3].includes(id)) {
        data = data.filter(data => data.categoryId == id);
    }

    // Ajout de la class active sur button filter
    document.querySelectorAll(".btn-filter").forEach(btn => {
        btn.classList.remove("btn-filter--active");
    })
    document.querySelector(`.btn-filter-cat-${id}`).classList.add("btn-filter--active");

    if (data.length === 0 || data === undefined) {
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Aucun projet à afficher <br>Toutes nos excuses pour la gêne occasionnée";
        sectionProjects.appendChild(p);
        return;
    }

    // Affichage des projets
    if (id === null || [1, 2, 3].includes(id)) {
        for (let i = 0; i < data.length; i++) {

            const figure = document.createElement("figure");
            sectionProjects.appendChild(figure);
            figure.classList.add(`js-project-${data[i].id}`); // Ajout ID project 
            const img = document.createElement("img");
            img.src = data[i].imageUrl;
            img.alt = data[i].title;
            figure.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.innerHTML = data[i].title;
            figure.appendChild(figcaption);
        }
    }
}


/*
// ADMIN MODAL vIEW GALLERY==================================================================
*/

// Init modal section projets
function initModalSectionProjects() {
    modalSectionProjects.innerHTML = "";
}


// Ouverture de la modal
let modal = null;
let dataAdmin;
const modalSectionProjects = document.querySelector(".admin-view-projects");

const openmodal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))

    // Affiche les projets dans la modal
    modalProjects(); 
    setTimeout(() => {
        modal.style.display = null
        modal.removeAttribute("aria-hidden")
        modal.setAttribute("aria-modal", "true")
    }, 25);
    // Bouttons ouverture modal projet
    document.querySelectorAll(".js-modal-project").forEach(a => {
        a.addEventListener("click", openmodalProject)
    });
    // fermeture modal
    modal.addEventListener("click", closemodal)
    modal.querySelector(".js-modal-close").addEventListener("click", closemodal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)

};


// Génère les projets dans la modal
async function modalProjects() {
    const response = await fetch('http://localhost:5678/api/works');
    dataAdmin = await response.json();
    initModalSectionProjects()
    for (let i = 0; i < dataAdmin.length; i++) {

        const div = document.createElement("div");
        div.classList.add("gallery__item-modal");
        modalSectionProjects.appendChild(div);

        const img = document.createElement("img");
        img.src = dataAdmin[i].imageUrl;
        img.alt = dataAdmin[i].title;
        div.appendChild(img);

        const p = document.createElement("p");
        div.appendChild(p);
        p.classList.add(dataAdmin[i].id, "js-delete-work");


        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can");
        p.appendChild(icon);
    }
    deleteWork()
}
// Ouverture modal
document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openmodal)
});


// stopPropagation modal
const stopPropagation = function (e) {
    e.stopPropagation()
};
//  Fermeture modal
const closemodal = function (e) {
    e.preventDefault()
    if (modal === null) return


    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")

    modal.querySelector(".js-modal-close").removeEventListener("click", closemodal)

    // Fermeture modal 300ms 
    window.setTimeout(function () {
        modal.style.display = "none"
        modal = null
        initModalSectionProjects()
    }, 300)
};



/*
// SUPPRESSION D'UN PROJET
*/

// Suppression (Event listener) ID projects
function deleteWork() {
    let btnDelete = document.querySelectorAll(".js-delete-work");
    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", deleteProjects);
    }
}

// Supprimer le projet
async function deleteProjects() {

    await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })

        .then(response => {
            console.log(response)
            // Token good
            if (response.status === 204) {
                console.log("Token client " + token + " SUPPRESION DU PROJET " + this.classList[0])
                refreshPage(this.classList[0])
            }
            // Token error
            else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à supprimer ce projet, veuillez vous connecter")
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            console.log(error)
        })
}

// Refresh modal projects sans recharger la page
async function refreshPage(i) {
    modalProjects(); 

    // supprime le projet de la gallery
    const project = document.querySelector(`.js-project-${i}`);
    project.style.display = "none";
}


/*
// MODAL +AJOUT PROJET==================================================================
*/

// Ouverture du modal project
let modalProject = null;
const openmodalProject = function (e) {
    e.preventDefault()
    modalProject = document.querySelector(e.target.getAttribute("href"))

    modalProject.style.display = null
    modalProject.removeAttribute("aria-hidden")
    modalProject.setAttribute("aria-modal", "true")

    // Fermeture modal project
    modalProject.addEventListener("click", closemodalProject)
    modalProject.querySelector(".js-modal-close").addEventListener("click", closemodalProject)
    modalProject.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)

    modalProject.querySelector(".js-modal-return").addEventListener("click", backTomodal)
};


// Fermeture du modal project
const closemodalProject = function (e) {
    if (modalProject === null) return

    modalProject.setAttribute("aria-hidden", "true")
    modalProject.removeAttribute("aria-modal")

    modalProject.querySelector(".js-modal-close").removeEventListener("click", closemodalProject)
    modalProject.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)

    modalProject.style.display = "none"
    modalProject = null

    closemodal(e)
};

// Retour au modal view gallery
const backTomodal = function (e) {
    e.preventDefault()
    modalProject.style.display = "none"
    modalProject = null
    modalProjects(dataAdmin)
};

/*
//  AJOUT D'UN PROJET
*/

const btnAddProject = document.querySelector(".js-add-work");
btnAddProject.addEventListener("click", addWork);

async function addWork(event) {
    event.preventDefault();

    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const image = document.querySelector(".js-image").files[0];


    if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Merci de choisir une catégorie valide");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                alert("Projet ajouté");
                modalProjects(dataAdmin);
                backTomodal(event);
                showProjects(data, null);

            } else if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                window.location.href = "login.html";
            }
        }

        catch (error) {
            console.log(error);
        }
    }
}