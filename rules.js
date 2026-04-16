const userName = "Karl@TheSwagbook";

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
        if(this.locationData.Type == "Directory") {
            return `[${userName} ${this.locationData.Name}]$ ${message}`;
        }
        else {
            return `${message}`;
        }
    }

    create(key) {
        this.locationData = this.engine.storyData.Locations[key];
        this.engine.show(this.getCommandLine(this.locationData.Body)); 
        
        if(this.locationData.Choices != undefined) { 
            for(let choice of this.locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice); 
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            let command;
            if(this.locationData.Type == "Directory") {
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
            }
            else command = `${choice.Text}`;
            this.engine.show(this.getCommandLine(command));
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');