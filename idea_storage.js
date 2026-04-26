
export class Idea {

    constructor (title, description) {
        this._title = title;
        this._description = description;
        this._freeText = "";
    }

    get title () { return this._title; }

    get description () { return this._description; }

    get freeText () { return this._freeText; }

    set freeText (newText) { this._freeText = newText; }
}

export class IdeaStorage {

    constructor () {
        this._init();
    }

    _init () {
        this._nextIdeaId = 0;

        this._ideas = {}; // Dict[int, Idea]
    }

    forceSync () {
        this._init();
        this._loadFromStorage();
    }

    addIdea (idea) {

        this._ideas[this._nextIdeaId++] = idea;
        
        this._dumpToStorage();
    }

    getIdea (ideaId) {
        // TODO: add check for the id
        return this._ideas[ideaId];
    }

    updateIdea (ideaId, newIdea) {
        
        // TODO: add check for the id
        this._ideas[ideaId] = newIdea;

        this._dumpToStorage();
    }

    getIdeaIds () { return Object.keys(this._ideas); }

    deleteIdea (ideaId) {
        
        // TODO: add check for the id
        delete this._ideas[ideaId];
        
        this._dumpToStorage();
    }

    _dumpToStorage () {
        window.localStorage.setItem("ideas", JSON.stringify(this._ideas));
    }

    _loadFromStorage () {
        let ideas = {};
        let loadedIdeasJSON = window.localStorage.getItem("ideas");            
        if (loadedIdeasJSON != null) {
                    
            let ideasObj = JSON.parse(loadedIdeasJSON);
            if (ideasObj === null) {
                console.log("Error while parsing stored ideas data");                
                return;
            }
                        
            for (const [ideaId, idea] of Object.entries(ideasObj) ) {                                                                                        
                ideas[ideaId] = Object.assign(new Idea(), idea);
            }
            
            this._ideas = ideas;
            if (Object.keys(this._ideas).length > 0){
                this._nextIdeaId = Math.max(...Object.keys(ideas)) + 1;        
            }                
        }
        else {
            console.log("No ideas on local storage were found");
        }
    }
}