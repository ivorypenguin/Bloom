/* Author: Aaron Maturen
   Started On: 2011-12-15

*/

window.onload = function() {

	// the particle class
	function Particle(){
		this.x = 0;
		this.y = 0;
	
		// velocity
		this.vx = 0;
		this.vx = 0;
	
		this.time = 0; // age of phytoplankton
		this.life = 0; // lifespan of phytoplankton
		this.color = "#000000";
	
		this.setValues = function(x, y, vx, vy){
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
			this.time = 0;
			this.life = Math.floor(Math.random()*200);
		}
	
		this.setColor = function(color){
			this.color = color;
		}
	
		// render the phytoplankton
		this.render = function(){
			c.save();
			c.fillStyle = this.color;
			c.translate(this.x, this.y);
			c.beginPath();
			c.arc(0, 0, 10, 0, Math.PI*2, true); // draw a circle
			c.fill();
			c.restore();
		}
	}

	// phytoplankton extends the Particle class allowing us to overload it later
	// this is the best place to change what the phytoplankton appears like
	function Phytoplankton(x0, y0, x1, y1){
		this.x0 = x0;
		this.x1 = x1;
		this.y0 = y0;
		this.y1 = y1;
		
		this.kill = function(){
			//console.dir(this);
			this.setValues(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), 1, 1);
			this.setColor("#8a360f");
		}
		
		// overload the particle render
		// currently they're just half of the size
		this.render = function(){
			c.save();
			c.fillStyle = this.color;
			c.translate(this.x, this.y);
			c.beginPath();
			c.arc(0, 0, 5, 0, Math.PI*2, true); // draw a circle
			c.fill();
			c.restore();
		}
	}
	Phytoplankton.prototype = new Particle; // inherit from Particle

	// phytoplanktonBloom creates an array of phytoPlankton and updates their attributes
	function PhytoplanktonBloom(){
		//origin of this.phytoplankton
		this.x0;
		this.y0;
		this.x1;
		this.y1;
		this.backColor;
	
		this.n = 0;
		this.phytoplankton = [];
		this.yinertia = 0.01;
		this.xinertia = 0.01;
		
		this.init = function(n, x0, y0, x1, y1, backColor){
			this.n = n;
			this.x0 = x0;
			this.y0 = y0;
			this.x1 = x1;
			this.y1 = y1;
			this.leaderXdestination;
			this.leaderYdestination;
			this.backColor = backColor;
			this.leader = 0;
			for(var i=0; i<n; i++){
				this.phytoplankton.push(new Phytoplankton());
				this.phytoplankton[i].setValues(Math.floor(Math.random()*this.x1)+this.x0, Math.floor(Math.random()*this.y1)+this.y0, 0, 1);
			}
		}
	
		this.setPhytoplanktonColor = function(color){
			for(var i=0; i<this.phytoplankton.length; i++)this.phytoplankton[i].setColor(color);
		}
		
		this.updateLeader = function(){
			//console.log(this.leader + " " + this.phytoplankton[this.leader].life + " " + this.phytoplankton[this.leader].time);
			if (this.phytoplankton[this.leader].time >= this.phytoplankton[this.leader].life){
				this.phytoplankton[this.leader].setColor("#446644");
				this.leader = Math.floor(Math.random()*this.n);
				this.phytoplankton[this.leader].setColor("#ffffff");
				this.leaderXdestination = Math.floor(Math.random()*this.x1);
				this.leaderYdestination = Math.floor(Math.random()*this.y1);
				console.log(this.leaderXdestination + " " + this.x1);
			}
			
			if(this.leaderXdestination > this.phytoplankton[this.leader].x){
				this.phytoplankton[this.leader].x = this.phytoplankton[this.leader].x + this.phytoplankton[this.leader].vx;
			} else {
				this.phytoplankton[this.leader].x = this.phytoplankton[this.leader].x - this.phytoplankton[this.leader].vx;
			}
		
			if(this.leaderYdestination > this.phytoplankton[this.leader].y){
				this.phytoplankton[this.leader].y = this.phytoplankton[this.leader].y + this.phytoplankton[this.leader].vy;
			} else {
				this.phytoplankton[this.leader].y = this.phytoplankton[this.leader].y - this.phytoplankton[this.leader].vy;
			}
		}
		
		this.update = function(){
			this.updateLeader();
			for(var i=0; i<this.phytoplankton.length; i++) {
				if(i != this.leader){
					if (this.phytoplankton[i].time < this.phytoplankton[i].life) {
						this.phytoplankton[i].vy = this.phytoplankton[i].vy + this.yinertia;
						this.phytoplankton[i].vx = this.phytoplankton[i].vx + this.xinertia;
						if(this.phytoplankton[this.leader].x > this.phytoplankton[i].x){
							this.phytoplankton[i].x = this.phytoplankton[i].x + this.phytoplankton[i].vx;
						} else {
							this.phytoplankton[i].x = this.phytoplankton[i].x - this.phytoplankton[i].vx;
						}
					
						if(this.phytoplankton[this.leader].y > this.phytoplankton[i].y){
							this.phytoplankton[i].y = this.phytoplankton[i].y + this.phytoplankton[i].vy;
						} else {
							this.phytoplankton[i].y = this.phytoplankton[i].y - this.phytoplankton[i].vy;
						}
					} else {
						this.phytoplankton[i].kill();
					}
				} // stop omitting leader
				this.phytoplankton[i].time += 1;
			}
		}
	
		this.render = function(){
			// fill the screen with dark grey background... 
			c.fillStyle = this.backColor;
			c.fillRect (0, 0, canvas.width, canvas.height);
			
			for(var i=0; i<this.phytoplankton.length; i++)this.phytoplankton[i].render();
		}
	}

	// link our JS canvas with the element in index.html
	// we could also dynamically create the canvas with js
	// but, frankly, I didn't feel like doing it that way.
	var canvas = document.getElementById('bloom');
	
	// Force Canvas to be the full window
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	
	// If we wanted put 3d here it would use WebGL
	// I'm not that brave...
	// ...yet
	var c = canvas.getContext('2d');
	
	// make our game loop
	setInterval(draw,100);
	
	// load a new bloom
	var bloom = new PhytoplanktonBloom();
	bloom.init(50, 0, 0, canvas.width, canvas.height, "#505050");
	bloom.setPhytoplanktonColor("#446644");
	function draw(){
		c.clearRect(0, 0, canvas.width, canvas.height);
		c.fillStyle = "#505050";
		bloom.update();
		bloom.render();
	}
}






















