import { IdeaStorage, Idea } from "./idea_storage.js"

const tabsElem = document.querySelector(".tabs");
document.getElementById("add-idea").addEventListener("click", openAddIdeaForm);

let gIdeaStorage = new IdeaStorage();
// const newIdea = new Idea("הכותרת שלי", "תקציר מנהלים שלי");
// newIdea.freeText = "This is my free text";
// gIdeaStorage.addIdea(newIdea);

function closeAllTabs() {
    for (let tabElem of tabsElem.children) {
        tabElem.classList.remove("active");
    }
}

function openIdeasTab() {

    document.getElementById("ideas-tab").classList.add("active");

    for (let subTabElem of document.querySelector(".ideas-container").children) {
        subTabElem.classList.add("hidden");
    }

    const numIdeas = gIdeaStorage.getIdeaIds().length;
    document.getElementById("num-items").innerHTML = `${numIdeas} רעיונות`;

    if (numIdeas < 1) {
        document.querySelector(".empty-ideas").classList.remove("hidden");
    }
    else {
        drawIdeas();
        document.querySelector(".ideas-list").classList.remove("hidden");
    }
}

function drawIdeas() {

    const ideasList = document.querySelector(".ideas-list");
    ideasList.innerHTML = "";

    for (const ideaId of gIdeaStorage.getIdeaIds()) {

        const idea = gIdeaStorage.getIdea(ideaId);

        const li = document.createElement("li");
        li.classList.add("idea-elem");

        /*
        When declaring the javascript script as moudle we can't call methods 
        from HTML attributes so we decompose the following HTML to javascript methods
        */
        // li.innerHTML = `
        //     <span id="idea-title">${idea.title}</span>
        //     <span>
        //         <button class="list-btn" id="edit-btn" title="ערוך" onclick="removeIdea(${ideaId})"><i class="fa-regular fa-pen-to-square"></i></button>
        //         <button class="list-btn" id="delete-btn" title="מחק" onclick="openEditIdeaForm(${ideaId})"><i class="fa-regular fa-trash-can"></i></button>
        //     </span>
        // `;

        const spanTitle = document.createElement("span");
        spanTitle.classList.add("idea-title");
        spanTitle.innerHTML = idea.title;
        li.appendChild(spanTitle);

        const spanButtons = document.createElement("span");

        const editBtnElem = document.createElement("button");
        editBtnElem.classList.add("list-btn");
        editBtnElem.id = "edit-btn";
        editBtnElem.title = "ערוך";
        editBtnElem.addEventListener("click", () => { openEditIdeaForm(ideaId) });
        const editIconElm = document.createElement("i");
        editIconElm.classList.add("fa-regular");
        editIconElm.classList.add("fa-pen-to-square");
        editBtnElem.appendChild(editIconElm);
        spanButtons.appendChild(editBtnElem);

        const deleteBtnElem = document.createElement("button");
        deleteBtnElem.classList.add("list-btn");
        deleteBtnElem.id = "delete-btn";
        deleteBtnElem.title = "מחק";
        deleteBtnElem.addEventListener("click", () => { removeIdea(ideaId) });
        const deleteIconElm = document.createElement("i");
        deleteIconElm.classList.add("fa-regular");
        deleteIconElm.classList.add("fa-trash-can");
        deleteBtnElem.appendChild(deleteIconElm);

        spanButtons.appendChild(deleteBtnElem);


        li.appendChild(spanButtons);

        ideasList.appendChild(li);
    }
}

function removeIdea(ideaId) {

    // TODO: add confirmation message

    gIdeaStorage.deleteIdea(ideaId);
    openIdeasTab();
}

function openIdeaFormsAux() {
    if (!document.getElementById("ideas-tab").classList.contains("active")) {

        closeAllTabs();

        openIdeasTab();
    }

    for (let subTabElem of document.querySelector(".ideas-container").children) {
        subTabElem.classList.add("hidden");
    }
}

function openAddIdeaForm() {

    openIdeaFormsAux();

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.querySelector(".new-idea-container").classList.remove("hidden");
}

function openEditIdeaForm(ideaId) {

    openIdeaFormsAux();

    document.querySelector(".edit-idea-container").classList.remove("hidden");

    const idea = gIdeaStorage.getIdea(ideaId);

    document.getElementById("idea-title").innerHTML = idea.title;
    document.getElementById("idea-description").innerHTML = idea.description;

    document.getElementById("free-text").value = idea.freeText;


    const onSave = (e) => {

        e.preventDefault();

        idea.freeText = document.getElementById("free-text").value;

        gIdeaStorage.updateIdea(ideaId, idea);

        document.getElementById("edit-idea-form").removeEventListener("submit", onSave);

        openIdeasTab();
    };

    document.getElementById("edit-idea-form").addEventListener("submit", onSave);
}

document.getElementById("new-idea-form").addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        const titleElm = document.getElementById("title");
        const descriptionElm = document.getElementById("description");

        const newIdea = new Idea(titleElm.value, descriptionElm.value);
        gIdeaStorage.addIdea(newIdea);

        titleElm.value = "";
        descriptionElm.value = "";

        openIdeasTab();
    }
);

document.getElementById("abort-idea-btn").addEventListener(
    "click",
    (e) => {
        e.preventDefault();
        openIdeasTab();
    }
);

document.getElementById("abort-edit-btn").addEventListener(
    "click",
    (e) => {
        e.preventDefault();
        openIdeasTab();
    }
);

window.onload = () => {

    gIdeaStorage.forceSync();

    openIdeasTab();
}