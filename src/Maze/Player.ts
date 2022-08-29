import { MazeBuilder } from "./MazeBuilder";

//maze[y][x]

export class Player {

    x: number;
    y: number;
    maze: Array<Array<Array<string>>>;
    mazeBuilder: MazeBuilder;
    onMove?: () => void;

    constructor(onMove?: () => void) {
        this.mazeBuilder = new MazeBuilder(5, 5);
        this.maze = this.mazeBuilder.maze;
        this.y = this.mazeBuilder.getEntryCoords()[0];
        this.x = this.mazeBuilder.getEntryCoords()[1];
        this.onMove = onMove;
    }

    resetPlayer() {
      this.mazeBuilder = new MazeBuilder(5, 5);
      this.maze = this.mazeBuilder.maze;
      this.y = this.mazeBuilder.getEntryCoords()[0];
      this.x = this.mazeBuilder.getEntryCoords()[1];
    }

    render(): string {
        let mazeString = "";
        for (let i = 0; i < this.maze.length; i++) {
            for(let j = 0; j < this.maze[0].length; j++) {
              if(i == this.y && j == this.x) {
                mazeString += "🟩"
              }else {
                let cell = this.maze[i][j];
                if(cell[0] == "wall") {
                    //  mazeString += "⬛"
                      mazeString += "⬜"
                      //mazeString += "■";
                    }else if(cell[0] == "door") {
                      mazeString += cell[1] == "entrance" ? "⬛" : "🚪"
                      //mazeString += String.fromCharCode(254)
                    }else {
                      mazeString += "⬛"
                     //mazeString += "⬜"
                     //mazeString += "□"
                    }
                }
            }
            mazeString += "\n";
        }
        return mazeString;
    }

    getMovingOptions(): Array<string> {
      let options: Array<string> = [];
      let newY = this.y - 1;
      if(this.mazeBuilder.inBounds(newY, this.x) && !this.mazeBuilder.isWall(newY, this.x)) {
        options.push("UP")
      }
      let newYDown = this.y + 1;
      if(this.mazeBuilder.inBounds(newYDown, this.x) && !this.mazeBuilder.isWall(newYDown, this.x))  {
        options.push("DOWN")
      }
      let newX = this.x + 1;
      if(this.mazeBuilder.inBounds(this.y, newX) && !this.mazeBuilder.isWall(this.y, newX)) {
        options.push("RIGHT")
      }
      let newXLeft = this.x - 1;
      if(this.mazeBuilder.inBounds(this.y, newXLeft) && !this.mazeBuilder.isWall(this.y, newXLeft)) {
        options.push("LEFT")
      }
      return options;
    }

    getOppositeDirection = (direction: Direction): Direction => {
      let returnDir: Direction;
      switch (direction) {
        case "UP":
          returnDir = "DOWN"
          break;
        case "DOWN":
          returnDir = "UP"
          break;
        case "RIGHT":
            returnDir = "LEFT"
            break;
        case "LEFT":
            returnDir = "RIGHT"
        break;  
      }
      return returnDir;
    }

    hasMovingOptions(lastDirection: Direction): Boolean {
      console.log(this.getMovingOptions(), "FUNC hasMovingOption")
      if(this.getMovingOptions().length == 2 && this.getMovingOptions().includes(this.getOppositeDirection(lastDirection)) && this.getMovingOptions().includes(lastDirection)) {    
        console.log("this.getMovingOptions().length == 2 && this.getMovingOptions().includes(this.getOppositeDirection(lastDirection))")
        return false;
      }else if(this.getMovingOptions().length >= 2) {
        console.log("this.getMovingOptions().length >= 2")
        return true
      }else {
        if(this.getMovingOptions()[0] == lastDirection) {
          console.log("this.getMovingOptions()[0] == lastDirection")
          return false;
        }
        
        console.log("else")
        return true;
      }
      
    }

    moveRow(direction: Direction) {
      let success = false;
        this.move(direction)
        switch (direction) {
          case "UP":
            while(!this.hasMovingOptions(direction)) {
              this.move("UP")
            }
            break;
          case "DOWN":
            while(!this.hasMovingOptions(direction)) {
              this.move("DOWN")
            }
            break;
          case "RIGHT":
              while(!this.hasMovingOptions(direction)) {
                this.move("RIGHT")
              }
              break;
          case "LEFT":
            while(!this.hasMovingOptions(direction)) {
              this.move("LEFT")
            }
          break;  
          default:
            break;
        }
      this.onMove
      return success;
    }

    move(direction: Direction): boolean {
      let success = false;
        switch (direction) {
          case "UP":
            let newY = this.y - 1;
            if(this.mazeBuilder.inBounds(newY, this.x)) {
              if(!this.mazeBuilder.isWall(newY, this.x)) {
                this.y = newY;
                success = true;
              }
            }
            break;
          case "DOWN":
            let newYDown = this.y + 1;
            if(this.mazeBuilder.inBounds(newYDown, this.x)) {
              if(!this.mazeBuilder.isWall(newYDown, this.x)) {
                this.y = newYDown;
                success = true;
              }
            }
            break;
          case "RIGHT":
              let newX = this.x + 1;
              if(this.mazeBuilder.inBounds(this.y, newX)) {
                if(!this.mazeBuilder.isWall(this.y, newX)) {
                  this.x = newX;
                  success = true;
                }
              }
              break;
          case "LEFT":
            let newXLeft = this.x - 1;
            if(this.mazeBuilder.inBounds(this.y, newXLeft)) {
              if(!this.mazeBuilder.isWall(this.y, newXLeft)) {
                this.x = newXLeft;
                success = true;
              }
            }
          break;  
          default:
            break;
        }
      this.onMove
      return success;
    }

}