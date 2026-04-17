const deviceName = "TheSwagbook";
const userName = "Karl";
const altName = "Virus-Chan";
var name = userName;
var scripts = [];
var hasAdminPrivileges = false;
var hasCatPicture = false;
var catPath;
var changeColor;

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }
}

class Location extends Scene {

    getCommandLine(message) {
        if(!message) {
            return "";
        } else if(this.locationData.Type == "Directory") {
            return `[${name}@${deviceName} ${this.locationData.Name}]$ ${message}`;
        } else {
            return `${message}`;
        }
    }

    create(key) {
        this.locationData = this.engine.storyData.Locations[key];
        if(this.locationData.Type == "Image") {
            this.engine.showImage(this.locationData.Path);
            catPath = this.locationData.Path;
            hasCatPicture = true;
        }

        this.engine.show(this.getCommandLine(this.locationData.Body)); 

        if(this.locationData.Type == "Script" && !scripts.includes(key)) {
            scripts.push(key);
        }

        if(key === "changeColor.js") {
            changeColor = document.createElement("script");
            changeColor.onload = () => {};
            changeColor.src = this.locationData.Path;
        }

        
        if(this.locationData.Choices != undefined) { 
            if(key == "terminal") for(let choice of this.locationData.Choices) {
                if(choice.Text === "rm -rf /") {
                    if(hasAdminPrivileges) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                } else this.engine.addChoice(choice.Text, choice);
            } else for(let choice of this.locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice); 
            }
            if(key == "Backdoor") {
                for(let choice of this.locationData.Scripts) {
                    if(scripts.find((script) => { return script === choice.Text;}) != undefined) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                }
            } 
            if(hasCatPicture) {
                this.engine.addChoice("cats.jpg", {Target:key, IsImage:true});
            }
        } else {
            //Finished the game by deleting the OS
            window.close();
        }
    }

    handleChoice(choice) {
        if(choice) {
            let command;
            if(choice.IsImage === true) {
                this.engine.showImage(catPath);
            } else if(this.locationData.Type == "Directory") {
                switch(this.engine.storyData.Locations[choice.Target].Type) {
                case "Directory":
                    command = `cd ${choice.Text}`;
                    break;
                case "Script":
                    command = `./${choice.Text}`;
                    break;
                default:
                    command = `${choice.Text}`;
                    break;
                }
            } else if(this.locationData.Type == "Backdoor") {
                switch(choice.Text) {
                case "changeName.sh":
                    command = choice.Effect.replace("\\bname$", name);
                    name = altName;
                    break;
                case "cool.sh":
                    command = choice.Effect.replace("\\bname$", name);
                    hasAdminPrivileges = true;
                    break;
                case "changeColor.js":
                    command = choice.Effect;
                    document.head.appendChild(changeColor);
                    break;
                }
            } else command = `${choice.Text}`;
            this.engine.show(this.getCommandLine(command));
            //Only the win condition has no target
            if(choice.Target === undefined) window.close();
            this.engine.gotoScene(Location, choice.Target);
        } else {
            //Finished the game by deleting the OS
            window.close();
        }
    }
}

Engine.load(Start, 'myStory.json');