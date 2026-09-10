/* Three.js hero — starfield + icosahedron + rings */
(function(){
  try{
    if(typeof THREE==='undefined') return;
    var canvas=document.getElementById('bg3d');
    if(!canvas) return;
    var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setSize(innerWidth,innerHeight);
    var scene=new THREE.Scene();
    scene.fog=new THREE.FogExp2(0x06060d,0.028);
    var cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,200);
    cam.position.set(0,0,14);

    // stars
    var N=900,pos=new Float32Array(N*3),col=new Float32Array(N*3);
    var palette=[[0.39,0.4,0.95],[0.66,0.33,0.97],[0.13,0.83,0.93],[0.2,0.9,0.6]];
    for(var i=0;i<N;i++){
      pos[i*3]=(Math.random()-.5)*70;pos[i*3+1]=(Math.random()-.5)*44;pos[i*3+2]=(Math.random()-.5)*50-6;
      var c=palette[Math.floor(Math.random()*palette.length)];
      col[i*3]=c[0];col[i*3+1]=c[1];col[i*3+2]=c[2];
    }
    var sg=new THREE.BufferGeometry();
    sg.setAttribute('position',new THREE.BufferAttribute(pos,3));
    sg.setAttribute('color',new THREE.BufferAttribute(col,3));
    var stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.14,vertexColors:true,transparent:true,opacity:.9}));
    scene.add(stars);

    // core icosahedron
    var group=new THREE.Group();group.position.set(5.4,0.6,-2);scene.add(group);
    var ico=new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.6,1),
      new THREE.MeshBasicMaterial({color:0x6366f1,wireframe:true,transparent:true,opacity:.55})
    );
    group.add(ico);
    var inner=new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5,0),
      new THREE.MeshBasicMaterial({color:0xa855f7,wireframe:true,transparent:true,opacity:.7})
    );
    group.add(inner);
    var ring1=new THREE.Mesh(new THREE.TorusGeometry(3.6,.02,8,120),new THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:.5}));
    ring1.rotation.x=Math.PI/2.4;group.add(ring1);
    var ring2=new THREE.Mesh(new THREE.TorusGeometry(4.3,.015,8,120),new THREE.MeshBasicMaterial({color:0xe879f9,transparent:true,opacity:.35}));
    ring2.rotation.x=Math.PI/1.7;ring2.rotation.y=.5;group.add(ring2);

    // floating cubes
    var cubes=[];
    for(var j=0;j<14;j++){
      var s=.18+Math.random()*.4;
      var m=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),
        new THREE.MeshBasicMaterial({color:j%2?0x6366f1:0x22d3ee,wireframe:true,transparent:true,opacity:.5}));
      m.position.set((Math.random()-.5)*36,(Math.random()-.5)*20,-4-Math.random()*10);
      m.userData={rx:(Math.random()-.5)*.02,ry:(Math.random()-.5)*.02};
      scene.add(m);cubes.push(m);
    }

    scene.add(new THREE.AmbientLight(0xffffff,.6));
    var mx=0,my=0;
    addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5);});
    addEventListener('resize',function(){cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
    if(innerWidth<1020){group.position.set(0,-4.5,-4);group.scale.setScalar(.8);}

    var t=0;
    (function anim(){
      requestAnimationFrame(anim);t+=.008;
      ico.rotation.y+=.0035;ico.rotation.x+=.0012;
      inner.rotation.y-=.005;inner.rotation.x+=.002;
      ring1.rotation.z+=.003;ring2.rotation.z-=.002;
      stars.rotation.y+=.0004;
      cubes.forEach(function(c){c.rotation.x+=c.userData.rx;c.rotation.y+=c.userData.ry;c.position.y+=Math.sin(t*2+c.position.x)*.004;});
      group.position.y=.6+Math.sin(t*1.4)*.35;
      cam.position.x+=(mx*2.2-cam.position.x)*.04;
      cam.position.y+=(-my*1.4-cam.position.y)*.04;
      cam.lookAt(0,0,0);
      renderer.render(scene,cam);
    })();
  }catch(e){/* silent fallback to CSS orbs */}
})();
