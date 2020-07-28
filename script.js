 window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var ctx;
    var delay = 100;
    var snakee;
    var blockSize = 30;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heighInBlocks = canvasHeight/blockSize;
    var score;
    var timeOut ;

    init();

    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display =  "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Appel([10,10]);
        score = 0 ;
        refreshCanvas();
    }

    function refreshCanvas(){
        snakee.advance();
        if(snakee.checkCollision()){
            //game Over
            gameOver();
        }else{
            if(snakee.isEatingApple(applee)){
                // le serpent a mangé la pomme
                snakee.ateApple = true ;
                score++;
                do{
                    applee.setNewApple();
                }while(applee.isOnSnake(snakee))
                
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut =  setTimeout(refreshCanvas,delay);
        }
        
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center"
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX,centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX,centreY - 120);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    function drawScore (){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center"
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore(); 
    }

    function Snake(body, direction){
        this.body = body;
        this.direction = direction ;
        this.ateApple = false ;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;   
                case "down":
                    nextPosition[1] += 1;
                    break;        
                case "up":
                    nextPosition[1] -= 1;
                    break;  
                default:
                    throw("invalid Direction");          
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;    

        };

        this.setDirection = function(newDirection){
            var allowDirection;
            switch(this.direction){
                case "left":
                case "right":
                    allowDirection = ["up","down"];
                    break;   
                case "down":
                case "up":
                    allowDirection = ["left","right"];
                    break;   
                default:
                    throw("invalid Direction");    
            }
            if(allowDirection.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };

        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            maxY = heighInBlocks - 1;
            var isNotBetHorizontal = snakeX < minX || snakeX > maxX ;
            var isNotBetVertical = snakeY < minY || snakeY > maxY ;
            if(isNotBetHorizontal || isNotBetVertical){
                wallCollision = true; 
            }

            for(var i=0; i < rest.length; i++){
                if ( snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision; 
        };

        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };

    }

    function Appel (position){

        this.position = position;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y,radius,0, Math.PI*2, true);
            ctx.fill(); 
            ctx.restore();
        };

        this.setNewApple = function(){
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heighInBlocks - 1));
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;

            for(var i = 0; i<snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };

    }
    
    function restart (){
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Appel([10,10]);
        score = 0; 
        clearTimeout(timeOut);
        refreshCanvas();
    }

    document.onkeydown = function handelkeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left"
                break;
            case 38:
                newDirection = "up"
                break;
            case 39:
                newDirection = "right"
                break;
            case 40:
                newDirection = "down"
                break;            
            case 32:
                restart();
                return;    
            default:
                return;    
        }
        snakee.setDirection(newDirection);
    }


 }
