class Body{
        constructor(body_data=[]){
                if (body_data == []){
                        body_data=["body",1,
                        0,0,0,
                        0,0,0,
                        0,0,0];
                      }
                this.name=body_data[0];
                this.mass=body_data[1];
                this.position=new Point(body_data[2],body_data[3],body_data[4]);
                this.velocity=new Point(body_data[5],body_data[6],body_data[7]);
                this.acceleration=new Point(body_data[8],body_data[9],body_data[10]);
                this.orientation=new Point();
                this.angVelocity=new Point();
                this.acceleration.reset();
                this.radius=.03;
              }
};
class Point{
        constructor( position_data=[0,0,0]){
                this.x=position_data[0];
                this.y=position_data[1];
                this.z=position_data[2];
              }
        reset(){
                this.x=0;
                this.y=0;
                this.z=0;
              }
};

class Galaxy{
    constructor(){
        this.stars = [];
        this.theta = 0;
        this.dTheta = .05;
        this.maxTheta = 10;
        this.alpha = 2000;
        this.beta = 0.25;
        this.e = 2.71828182845904523536;
        this.starDensity = 1;
        while (this.theta< this.maxTheta){
            this.theta+=this.dTheta;
            var randMax = 2000/(1+this.theta/2);
            var randMin = 0-randMax;
            this.starDensity = 10/(1+this.theta/2);
            for (var i=0; i<=this.starDensity;i++){
                var xPos = this.alpha*(Math.pow(this.e,(this.beta*this.theta)))*Math.cos(this.theta);
                var yPos = this.alpha*(Math.pow(this.e,(this.beta*this.theta)))*Math.sin(this.theta);
                var xPos = xPos+ Math.random() * (randMax - randMin) + randMin;
                var yPos = yPos+Math.random() * (randMax - randMin) + randMin;
                var zPos = Math.random() * (randMax - randMin) + randMin;
                var newStar = new Star(xPos,yPos,zPos, "star", "cos");
                this.stars.push(newStar);
            }
        }
    }
}

class Star{
          constructor(xPos=30000, yPos=0, zPos=0, player="duh", aName="default"){
                this.body = new Body(["body",1,xPos,yPos,zPos,0,0,0,0,0,0]);
                this.color = [0.0,0.0,1.0];
                this.mass = 16;
                this.radius = 6.6;
                this.temp= 33000;
                this.buildrandom();
              }
            buildrandom(){
                var starrand = Math.random()*10000;
                if (starrand < 7600){
                        this.mtype();}
                if (starrand < 8800 && starrand > 7600){
                        this.ktype();}
                if (starrand < 9400 && starrand > 8800){
                        this.gtype();}
                if (starrand < 9700 && starrand > 9400){
                        this.ftype();}
                if (starrand < 9800 && starrand > 9900){
                        this.atype();}
                if (starrand < 9900 &&starrand > 9950){
                        this.btype();}
                if (starrand < 9950){
                        this.otype();}
            }
            otype(){
                this.color = [1.0,0.0,0.0];
                this.mass = 16;
                this.radius = 6.6;
                this.temp= 33000;
              }
            btype(){
                this.color = [0.5,0.5,0.8,1.0];
                this.mass = 2.1;
                this.radius = 1.8;
                this.temp= 10000;
                }
            atype(){
                this.color = [1.0,1.0,1.0,1.0];
                this.mass = 1.4;
                this.radius = 1.4;
                this.temp= 7500;
                }
            ftype(){
                this.color = [1.0,1.0,0.8,1.0];
                this.color = [1.0,0.0,0.0];
                this.mass = 1;
                this.radius = 1;
                this.temp= 6000;
                }
            gtype(){
                this.color = [1.0,1.0,0.0,1.0];
                this.mass = .8;
                this.radius = 0.9;
                this.temp= 5200;
                }
            ktype(){
                this.color = [1.0,0.2,0.2,1.0];
                this.mass = .7;
                this.radius = 0.5;
                this.temp= 3700;
                }
            mtype(){
                    this.color = [1.0,0.0,0.0,1.0];
                    this.mass = .2;
                    this.radius = .2;
                    this.temp= 2000;
                    }
}

class GridSystem{
         constructor(bodies=[]){
                this.count = bodies.length;
                this.player=0;
                this.names = [""];
                this.mass= [0.0];
                this.rad = [0.0];
                this.pos = [[0.0,0.0,0.0]];
                this.ori = [[0.0,0.0,0.0]];
                this.vel = [[0.0,0.0,0.0]];
                this.acc = [[0.0,0.0,0.0]];
                this.allocated =1;
                this.collisions = [];
                this.removed=[];
                for (var i = 0; i<this.count; i++){
                      this.addSpace();
                      }
                var i = 0
                for (body in bodies){
                        if (body.name == "player"){
                                this.player = i;
                              }
                        this.insertBody(body, i)
                        i+=1;
                      }
                for(var i =0; i< this.count; i++){
                        this.printBody(i)
                      }
         }
         getPlayerIndex() {
                var i=0;
                var lasti = 0;
                for (var name in this.names){
                        if (name == "player"){
                                this.player = i;
                                lasti=i;
                                return i;
                              }
                        else{
                                i+=1;
                              }
                }
                return i;
              }



         insertBody(body, i){
                this.names[i] = body.name;
                this.mass[i] = body.mass;
                this.rad[i] = body.radius;
                this.pos[i][0] = body.position.x;
                this.pos[i][1] = body.position.y;
                this.pos[i][2] = body.position.z;

                this.ori[i][0] = body.orientation.x;
                this.ori[i][1] = body.orientation.y;
                this.ori[i][2] = body.orientation.z;

                this.vel[i][0] = body.velocity.x;
                this.vel[i][1] = body.velocity.y;
                this.vel[i][2] = body.velocity.z;

                this.acc[i][0] = body.acceleration.x;
                this.acc[i][1] = body.acceleration.y;
                this.acc[i][2] = body.acceleration.z;
              }

         moveBody(source,dest){
                this.names[dest]=this.names[source];
                this.mass[dest]=this.mass[source];
                this.rad[dest]=this.rad[source];
                this.pos[dest]=this.pos[source];
                this.ori[dest]=this.ori[source];
                this.vel[dest]=this.vel[source];
                this.acc[dest]=this.acc[source];
                this.names[source]="OLD";
}

         removeBody( i){
                if(i != this.player){
                        if (i == this.count -1){
                                var foo=1;
                              }
                        else{
                                this.moveBody(this.count-1, i);}
                        this.count -=1;
                        this.getPlayerIndex();

                    }
                  }

         resetAcc(){
              for (var i = 0; i<this.count; i++){
                    this.acc[i] = [0.0,0.0,0.0];
                  }
                  }

         addSpace(){
                this.allocated +=1;
                this.names.push("");
                this.mass.push(0.0);
                this.rad.push(0.0);
                this.pos.push([0.0,0.0,0.0]);
                this.ori.push([0.0,0.0,0.0]);
                this.vel.push([0.0,0.0,0.0]);
                this.acc.push([0.0,0.0,0.0]);
              }
}

// class soPhysics:
//         constructor(aSystem, maxMark=100000, dt=.02):
//                 self.dt=dt
//                 self.system = aSystem
//                 self.gridSystem = GridSystem(aSystem.bodies)
//                 self.maxMark=maxMark
//                 self.fitness=self.system.evaluate()
//                 self.sumFit=self.fitness
//                 self.t=0
//                 self.count=1
//                 self.collisions=[]
//
//         collisionDetected(self, player, names, mass,
//                               pos, vel, acc, rad, ith, jth):
//                 if (names[jth]!="player" and
//                     names[ith]!="player"):
//                         self.combineBodies(player, names, mass, pos,
//                                            vel, acc, rad, ith, jth)
//
//
//         combineBodies(self, player, names, mass,
//                               pos, vel, acc, rad, ith, jth):
//                 pos[jth][0] = (pos[ith][0]*mass[ith] + pos[jth][0]*mass[jth])/((mass[ith]+mass[jth]))
//                 pos[jth][1] = (pos[ith][1]*mass[ith] + pos[jth][1]*mass[jth])/((mass[ith]+mass[jth]))
//                 pos[jth][2] = (pos[ith][2]*mass[ith] + pos[jth][2]*mass[jth])/((mass[ith]+mass[jth]))
//
//                 vel[jth][0] = (((mass[ith]*vel[ith][0])+(mass[jth]*vel[jth][0])/((mass[ith]+mass[jth]))))
//                 vel[jth][1] = (((mass[ith]*vel[ith][1])+(mass[jth]*vel[jth][1])/((mass[ith]+mass[jth]))))
//                 vel[jth][2] = (((mass[ith]*vel[ith][2])+(mass[jth]*vel[jth][2])/((mass[ith]+mass[jth]))))
//
//                 mass[jth] = mass[ith] + mass[jth]
//                 mass[ith] = 0.00000000000000000000000000000000000000000000000001
//                 pos[ith][0]=10
//                 pos[ith][1]=10
//                 pos[ith][2]=10
//
//                 vel[ith][0]=0
//                 vel[ith][1]=0
//                 vel[ith][2]=0
//                 names[ith]= "DELETED"
//                 self.gridSystem.collisions.append(jth)
//                 self.gridSystem.removed.append(ith)
//                 self.gridSystem.getPlayerIndex()
//
//         evaluateStep(self):
//                 self.accelerateCuda()
//                 for body in self.system.bodies:
//                         self.calculate_velocity(body,self.dt)
//                         self.calculate_position(body,self.dt)
//                         body.acceleration.reset()
//                         self.sumFit+=self.system.evaluate()
//                         self.t+=self.dt
//                 self.count+=1
//
//         evaluate(self):
//                 self.t=0
//                 self.count=1
//                 self.accelerateCuda()
//                 self.sumFit=0
//                 while self.count<self.maxMark:
//                         self.evaluateStep()
//                 self.fitness = self.system.evaluate()
//                 self.avgStability = self.sumFit/self.count
//                 return self.avgStability
//
//         accGravSingle(self, player, names, mass,
//                           pos, vel, acc, rad, ith, jth):
//                 d_x = pos[jth][0] - pos[ith][0]
//                 d_y = pos[jth][1] - pos[ith][1]
//                 d_z = pos[jth][2] - pos[ith][2]
//                 radius = d_x**2 + d_y**2 + d_z**2
//                 rad2 = math.sqrt(radius)
//                 grav_mag = 0.0;
//
//                 if (rad2 > rad[ith]+rad[jth]):
//                         grav_mag = G/((radius+epsilon)**(3.0/2.0))
//                         grav_x=grav_mag*d_x
//                         grav_y=grav_mag*d_y
//                         grav_z=grav_mag*d_z
//
//                         acc[ith][0] +=grav_x*mass[jth]
//                         acc[ith][1] +=grav_y*mass[jth]
//                         acc[ith][2] +=grav_z*mass[jth]
//
//                         acc[jth][0] +=grav_x*mass[ith]
//                         acc[jth][1] +=grav_y*mass[ith]
//                         acc[jth][2] +=grav_z*mass[ith]
//                 else:
//                         grav_mag = 0
//                         self.collisionDetected(player, names, mass, pos,
//                                                vel, acc, rad, ith, jth)
//
//         accelerateCuda(self):
//                 G=2.93558*10**-4
//                 epsilon = 0.01
//                 for i in range(0,self.gridSystem.count):
//                         if(self.gridSystem.names[i] != 'DELETED'):
//                                 for j in range(0,i):
//                                         if(self.gridSystem.names[j] != 'DELETED'):
//                                                 self.accGravSingle(self.gridSystem.player,
//                                                                    self.gridSystem.names,
//                                                                    self.gridSystem.mass,
//                                                                    self.gridSystem.pos,
//                                                                    self.gridSystem.vel,
//                                                                    self.gridSystem.acc,
//                                                                    self.gridSystem.rad,
//                                                                    i, j)
//                 self.calVelPosCuda()
//                 self.gridSystem.resetAcc()
//                 for i in range(0,self.gridSystem.count):
//                         if self.gridSystem.names[i]=="DELETED":
//                                 self.gridSystem.removeBody(i)
//                 self.gridSystem.collisions = []
//
//         calVelPosCuda(self):
//                 for i in range(0,self.gridSystem.count):
//                         self.gridSystem.vel[i][0]+=self.dt*self.gridSystem.acc[i][0]
//                         self.gridSystem.vel[i][1]+=self.dt*self.gridSystem.acc[i][1]
//                         self.gridSystem.vel[i][2]+=self.dt*self.gridSystem.acc[i][2]
//
//                         self.gridSystem.pos[i][0]+=self.dt*self.gridSystem.vel[i][0]
//                         self.gridSystem.pos[i][1]+=self.dt*self.gridSystem.vel[i][1]
//                         self.gridSystem.pos[i][2]+=self.dt*self.gridSystem.vel[i][2]
// class System(object):
//         constructor( seed=1, starcount=1,
//                      bodycount=1, abodyDistance=.5, abodySpeed=0.03):
//                 random.seed = seed
//                 self.seed = seed
//                 self.star = Star()
//                 self.starCount=starcount
//                 self.bodyCount= bodycount
//                 self.bodies=[]
//                 self.bodyDistance = abodyDistance
//                 self.bodySpeed = abodySpeed
//                 if seed !=0:
//                         self.build()
//                 else:
//                         self.buildSol()
//                 print "bodyCount: "+`len(self.bodies)`
//                 self.stability = 0.5 - self.evaluate()
//                 self.printed=False
//                 self.avgStability=0.5 - self.evaluate()
//         makeDefault(self):
//                 System(1,1,32,.5,.03)
//         moveToStar(self):
//                 for body in self.bodies:
//                         body.position.x += self.star.body.position.x
//                         body.position.y += self.star.body.position.y
//                         body.position.z += self.star.body.position.z
//         getStar(self, body_data):
//                 body_data.append(random.uniform(.4,1))
//                 for j in range(0,2):
//                         body_data.append(0.0)
//                 body_data.append(0.0)
//                 for j in range(0,2):
//                         body_data.append(0.0)
//                 body_data.append(0.0)
//                 return body_data
//
//         getSymPlanets(self):
//                 body_data=[]
//                 body_data.append("body_X")
//                 body_data.append(random.uniform(.000001,.4))
//
//                 if quadrantVar > 0:
//                         body_data.append(random.uniform(0,self.bodyDistance))
//                         body_data.append(random.uniform(0,self.bodyDistance))
//                         body_data.append(0.0)
//                         body_data.append(random.uniform(0,self.bodySpeed))
//                         body_data.append(random.uniform(-self.bodySpeed,0))
//                         body_data.append(0.0)
//
//                 if quadrantVar< 0:
//                         body_data.append(random.uniform(-self.bodyDistance,0))
//                         body_data.append(random.uniform(-self.bodyDistance,0))
//                         body_data.append(0.0)
//                         body_data.append(random.uniform(-self.bodySpeed,0))
//                         body_data.append(random.uniform(0,self.bodySpeed))
//                         body_data.append(0.0)
//
//         getDirectedPlanet(self):
//                 quadrantVar =1
//                 body_data=[]
//                 body_data.append("body_X")
//                 body_data.append(random.uniform(.000001,.01))
//
//                 if quadrantVar > 0:
//                         body_data.append(random.uniform(0,self.bodyDistance))
//                         body_data.append(random.uniform(0,self.bodyDistance))
//                         body_data.append(random.uniform(0,self.bodyDistance/64))
//                 if quadrantVar< 0:
//                         body_data.append(random.uniform(-self.bodyDistance,0))
//                         body_data.append(random.uniform(-self.bodyDistance,0))
//                         body_data.append(random.uniform(-self.bodyDistance/64,0))
//
//                 if quadrantVar > 0:
//                         body_data.append(random.uniform(0,self.bodySpeed))
//                         body_data.append(random.uniform(-self.bodySpeed,0))
//                         body_data.append(random.uniform(0,self.bodySpeed/32))
//                 if quadrantVar < 0:
//                         body_data.append(random.uniform(-self.bodySpeed,0))
//                         body_data.append(random.uniform(0,self.bodySpeed))
//                         body_data.append(random.uniform(-self.bodySpeed/32),0)
//
//
//
//                 return body_data
//
//         getPlanet(self, body_data):
//                 body_data.append(random.uniform(.000001,.01))
//                 for j in range(0,2):
//                         body_data.append(random.uniform(-self.bodyDistance,self.bodyDistance))
//                 body_data.append(0.0)
//                 for j in range(0,2):
//                         body_data.append(random.uniform(-self.bodySpeed,self.bodySpeed))
//                 body_data.append(0.0)
//                 return body_data
//
//         buildSol(self):
//                 self.bodies=[]
//                 body_data=["Sol",1,0,0,0,0,0,0,0,0,0]
//                 self.bodies.append(Body(body_data))
//                 body_data=["Earth",0.000003,0,1,0,.04,0,0,0,0,0]
//                 self.bodies.append(Body(body_data))
//
//         build(self):
//                 for i in range(0,self.bodyCount):
//                         if i < self.starCount:
//                                 self.addStar()
//                         else:
//                                 self.addSinglePlanet()
//         addStar(self):
//                 body_data = self.getStar(["star"])
//                 body = Body(body_data)
//                 self.bodies.append(body)
//         reverseBody(self, adata):
//                 bdata = adata
//                 bdata[2]= 0 - adata[2]
//                 bdata[3]= 0 - adata[3]
//                 bdata[4]= 0 - adata[4]
//                 bdata[5]= 0 - adata[5]
//                 bdata[6]= 0 - adata[6]
//                 bdata[7]= 0 - adata[7]
//                 return bdata
//
//         addSinglePlanet(self):
//                 print "adding Body"
//                 body_data = self.getDirectedPlanet()
//                 aBody = Body(body_data)
//                 bBody = Body(self.reverseBody(body_data))
//                 otherBodies = []
//                 otherBodies.append(self.bodies[0])
//                 otherBodies.append(aBody)
//                 otherBodies.append(bBody)
//                 fitness = self.evaluateN(otherBodies)
//                 while fitness<.1 or fitness>1:
//                         print "testing configuration"
//                         adata = self.getDirectedPlanet()
//                         aBody = Body(adata)
//                         bdata = self.reverseBody(adata)
//                         bBody = Body(bdata)
//                         otherBodies = []
//                         otherBodies.append(self.bodies[0])
//                         otherBodies.append(aBody)
//                         otherBodies.append(bBody)
//                         fitness=self.evaluateN(otherBodies)
//                 self.bodies.append(aBody)
//                 self.bodies.append(bBody)
//                 return aBody
//
//         addPlanet(self):
//                 print "adding body"
//                 body_data = []
//                 body_data.append("body_X")
//                 body_data = self.getPlanet(body_data)
//                 aBody = Body(body_data)
//                 self.bodies.append(aBody)
//                 print "new stability"
//                 print self.evaluate()
//                 while self.evaluate()>1:
//                         self.bodies.pop()
//                         self.addPlanet()
//                 return
//
//
//         evaluate(self):
//                 kinetic=0.0
//                 potential=0.0
//                 G=2.93558*10**-4
//                 for body in self.bodies:
//                         vel = body.velocity
//                         vel_sq = (vel.x**2 + vel.y**2 + vel.z**2)
//                         kinetic += 0.5*body.mass*vel_sq
//                 for i in range(0,len(self.bodies)):
//                         current_body=self.bodies[i]
//                         current_position=current_body.position
//                         for j in range(0,i):
//                                 other_body=self.bodies[j]
//                                 other_position=other_body.position
//                                 d_x=(other_position.x-current_position.x)
//                                 d_y=(other_position.y-current_position.y)
//                                 d_z=(other_position.z-current_position.z)
//                                 radius = (d_x**2 + d_y**2 + d_z**2)**(0.5)
//                                 if radius >0 :
//                                         potential -= G*current_body.mass*other_body.mass/radius
//                 try:
//                         return abs(kinetic/potential)
//                 except:
//                         return 100
//         evaluateN(self, somebodies):
//                 tempSys = System()
//                 tempSys.bodies = somebodies
//                 tempEval = soPhysics(tempSys,1000000,.01)
//                 return tempEval.sumFit
//
//         evaluateBodies(self, someBodies):
//                 kinetic=0.0
//                 potential=0.0
//                 G=2.93558*10**-4
//                 for body in someBodies:
//                         vel = body.velocity
//                         vel_sq = (vel.x**2 + vel.y**2 + vel.z**2)
//                         kinetic += 0.5*body.mass*vel_sq
//                 for i in range(0,len(someBodies)):
//                         current_body=someBodies[i]
//                         current_position=current_body.position
//                         for j in range(0,i):
//                                 other_body=someBodies[j]
//                                 other_position=other_body.position
//                                 d_x=(other_position.x-current_position.x)
//                                 d_y=(other_position.y-current_position.y)
//                                 d_z=(other_position.z-current_position.z)
//                                 radius = (d_x**2 + d_y**2 + d_z**2)**(0.5)
//                                 if radius >0 :
//                                         potential -= G*current_body.mass*other_body.mass/radius
//                 try:
//                         return abs(kinetic/potential)
//                 except:
//                         return 100.0
//         bodies(self):
//                 return self.bodies
