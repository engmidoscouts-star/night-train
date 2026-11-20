/**
 * Starlight Express V5 - procedural cinematic graphics
 * No paid assets. Models and textures are built locally with Three.js.
 */
export function upgradeTrain(ctx) {
  const {
    THREE: T, scene, renderer, locomotive, cars, interior, moon,
    smoke, glowSprites, metal, trim, glowWindowMat, dark, wood,
    corridorLength, makeCanvasTexture
  } = ctx;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.48;

  const gold = new T.MeshStandardMaterial({color:0xd9ae72,metalness:.78,roughness:.24});
  const brightGold = new T.MeshStandardMaterial({color:0xffde9c,metalness:.55,roughness:.25});
  const burgundy = new T.MeshStandardMaterial({color:0x34152f,metalness:.35,roughness:.3});
  const plum = new T.MeshStandardMaterial({color:0x321941,metalness:.55,roughness:.26});
  const lacquer = new T.MeshStandardMaterial({color:0x24142e,metalness:.77,roughness:.22});
  const copper = new T.MeshStandardMaterial({color:0xbd7d55,metalness:.65,roughness:.32});
  const ivory = new T.MeshStandardMaterial({color:0xffe5bc,emissive:0xff9d68,emissiveIntensity:.6,roughness:.34});
  const glass = new T.MeshStandardMaterial({color:0xffe4ac,emissive:0xffb980,emissiveIntensity:.8,side:T.DoubleSide});
  const velvet = new T.MeshStandardMaterial({color:0x5c205f,roughness:.92});
  const roseGold = new T.MeshStandardMaterial({color:0xf3c4a4,metalness:.7,roughness:.27});
  metal.color.setHex(0x2d173b);
  metal.metalness=.68;
  trim.color.setHex(0xb88968);
  glowWindowMat.emissive.setHex(0xffaf65);
  glowWindowMat.color.setHex(0xffe4b4);

  function bx(parent,w,h,d,x,y,z,mat) {
    const m = new T.Mesh(new T.BoxGeometry(w,h,d),mat);
    m.position.set(x,y,z);
    parent.add(m);
    return m;
  }
  function cylinder(parent,r1,r2,height,x,y,z,mat,rotX=0,rotY=0) {
    const m = new T.Mesh(new T.CylinderGeometry(r1,r2,height,32,1),mat);
    m.rotation.set(rotX,rotY,0);
    m.position.set(x,y,z);
    parent.add(m);
    return m;
  }
  function sphere(parent,r,x,y,z,mat,scale=null) {
    const m=new T.Mesh(new T.SphereGeometry(r,20,14),mat);
    m.position.set(x,y,z);
    if(scale)m.scale.set(...scale);
    parent.add(m);
    return m;
  }
  function rod(parent,from,to,thick,mat){
    const a=new T.Vector3(...from),b=new T.Vector3(...to),delta=b.clone().sub(a);
    const m=new T.Mesh(new T.CylinderGeometry(thick,thick,delta.length(),9),mat);
    m.position.copy(a).addScaledVector(delta,.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());
    parent.add(m);
    return m;
  }
  function glowTexture(){
    const c=document.createElement('canvas');c.width=c.height=128;
    const x=c.getContext('2d');
    const grad=x.createRadialGradient(64,64,2,64,64,64);
    grad.addColorStop(0,'rgba(255,252,232,1)');
    grad.addColorStop(.17,'rgba(255,190,214,.65)');
    grad.addColorStop(.48,'rgba(215,105,255,.16)');
    grad.addColorStop(1,'rgba(180,70,255,0)');
    x.fillStyle=grad;x.fillRect(0,0,128,128);
    return new T.CanvasTexture(c);
  }
  const softGlow=glowTexture();
  function halo(parent,x,y,z,w,h,color=0xffa6ed,opacity=.85){
    const material=new T.SpriteMaterial({map:softGlow,color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false,depthTest:true});
    const s=new T.Sprite(material);s.position.set(x,y,z);s.scale.set(w,h,1);parent.add(s);return s;
  }

  // A luminous moon with a large, translucent halo and distant nebulae
  halo(scene,moon.position.x,moon.position.y,moon.position.z,35,35,0xffbbe8,.42);
  halo(scene,-42,31,-80,58,24,0xab6dea,.19);
  halo(scene,55,30,-125,78,40,0x746ddb,.19);

  // Night-sky ground and mountain silhouettes provide depth below the train.
  const ground=new T.Mesh(new T.PlaneGeometry(300,300),new T.MeshStandardMaterial({color:0x120b24,roughness:1}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.84;scene.add(ground);
  const hillMat=[0x201330,0x2b1740,0x3c204f].map(color=>new T.MeshBasicMaterial({color,transparent:true,opacity:.9}));
  for(let n=0;n<28;n++){
    const side=n%2?-1:1;
    const h=5+(n*13%11);
    const width=8+(n*17%13);
    const mesh=new T.Mesh(new T.ConeGeometry(width,h,3),hillMat[n%3]);
    mesh.position.set(side*(23+(n*7%48)),h/2-.7,-75+n*5.2);
    mesh.rotation.y=n*.87;
    scene.add(mesh);
  }
  for(let i=0;i<125;i++){
    const p=new T.Mesh(new T.IcosahedronGeometry(.06+(i%4)*.035,0),
      new T.MeshBasicMaterial({color:i%3===0?0xffc9ed:0xd4b9ff,transparent:true,opacity:.5}));
    p.position.set((i%2?1:-1)*(4+(i*37%110)*.47),.4+(i*13%40)*.1,(i*29%150)-76);
    scene.add(p);
  }
  // Station-like platform with glowing antique lamps alongside the train.
  const platform=new T.Group();scene.add(platform);
  bx(platform,3.9,.38,57,6.6,-.59,-5.6,new T.MeshStandardMaterial({color:0x2a1b3a,roughness:.85}));
  bx(platform,.1,.07,57,4.7,-.33,-5.6,gold);
  bx(platform,.1,.07,57,8.55,-.33,-5.6,gold);
  const lampObjects=[];
  for(let z=-27;z<=19;z+=11.5){
    cylinder(platform,.11,.13,4.8,7.9,2.0,z,lacquer);
    bx(platform,.75,.9,.75,7.9,4.67,z,gold);
    bx(platform,.58,.6,.58,7.9,4.67,z,ivory);
    sphere(platform,.35,7.9,5.28,z,gold,[1,.36,1]);
    lampObjects.push(halo(platform,7.9,4.68,z,4.8,5.8,0xffddaf,.65));
  }

  // Hide original blocky locomotive silhouette while retaining the smoke particles.
  locomotive.children.slice(0,10).forEach(child=>child.visible=false);
  const wheelParts=[];
  const loco=new T.Group();locomotive.add(loco);
  bx(loco,4.05,.58,8.5,0,.62,0,lacquer);
  bx(loco,3.8,.35,8.3,0,1.05,0,gold);
  bx(loco,4.1,2.9,2.95,0,2.7,-2.8,plum);
  bx(loco,4.45,.22,3.4,0,4.35,-2.8,gold);
  bx(loco,4.2,.18,3.7,0,4.56,-2.8,lacquer);
  for(const side of [-1,1]){
    bx(loco,.06,1.2,1.42,side*2.06,3.05,-2.85,glass);
    bx(loco,.11,1.35,.08,side*2.11,3.05,-2.85,gold);
    bx(loco,.1,.09,1.55,side*2.11,3.72,-2.85,gold);
    bx(loco,.12,1.22,.11,side*2.13,3.02,-2.06,gold);
  }
  // Cylindrical boiler, copper bands, headlight and tapered smokestack.
  cylinder(loco,1.41,1.41,5.65,0,2.52,.94,plum,Math.PI/2);
  cylinder(loco,1.31,1.31,5.8,0,2.52,.94,burgundy,Math.PI/2);
  for(const z of [-1.55,-.65,.4,1.5,2.9,3.56]){
    const ring=new T.Mesh(new T.TorusGeometry(1.34,.046,9,44),gold);
    ring.position.set(0,2.52,z);
    loco.add(ring);
  }
  cylinder(loco,1.43,1.43,.3,0,2.52,3.88,lacquer,Math.PI/2);
  cylinder(loco,1.5,1.5,.15,0,2.52,4.10,gold,Math.PI/2);
  cylinder(loco,1.32,1.32,.06,0,2.52,4.22,burgundy,Math.PI/2);
  const headlamp=sphere(loco,.42,0,2.62,4.40,ivory,[1,1,.35]);
  halo(loco,0,2.6,4.6,4.5,4.5,0xffdc9d,.72);
  const headPoint=new T.PointLight(0xffd399,22,20);headPoint.position.set(0,2.5,4.5);loco.add(headPoint);
  cylinder(loco,.36,.44,1.15,0,4.36,2.05,lacquer);
  cylinder(loco,.52,.44,.18,0,5.0,2.05,gold);
  cylinder(loco,.45,.56,.25,0,5.16,2.05,plum);
  cylinder(loco,.58,.58,.13,0,5.33,2.05,gold);
  sphere(loco,.32,0,4.17,.5,brightGold,[1,.35,1]);
  // Side steps, railings and buffer guard
  for(const side of [-1,1]){
    bx(loco,.36,.13,3.2,side*2.18,.95,-2.2,gold);
    rod(loco,[side*2.18,1.06,-3.7],[side*2.18,3.8,-3.7],.045,gold);
    rod(loco,[side*2.18,3.8,-3.7],[side*2.18,3.8,-2.1],.04,gold);
  }
  for(let i=-2;i<=2;i++){
    rod(loco,[i*.42,.75,4.15],[i*.6,.16,4.85],.08,brightGold);
  }
  bx(loco,3.15,.24,.35,0,.67,4.52,plum);
  // Wheels are circular with rims, hub and animated spokes instead of solid blocks.
  function ornateWheel(parent,x,y,z,r){
    const spin=new T.Group();spin.position.set(x,y,z);parent.add(spin);
    const tire=new T.Mesh(new T.TorusGeometry(r,.105,10,32),lacquer);
    tire.rotation.y=Math.PI/2;spin.add(tire);
    const rim=new T.Mesh(new T.TorusGeometry(r-.105,.045,8,32),gold);
    rim.rotation.y=Math.PI/2;spin.add(rim);
    cylinder(spin,.19,.19,.2,0,0,0,brightGold,0,0).rotation.z=Math.PI/2;
    for(let k=0;k<10;k++){
      const a=Math.PI*2*k/10;
      rod(spin,[0,0,0],[0,Math.sin(a)*r*.84,Math.cos(a)*r*.84],.036,gold);
    }
    wheelParts.push(spin);
  }
  for(const side of [-1,1]){
    for(const [z,r] of [[-3.2,.56],[-1.8,.78],[.0,.89],[1.75,.89],[3.25,.7]]){
      ornateWheel(loco,side*2.02,.12,z,r);
    }
    rod(loco,[side*2.2,.17,-1.8],[side*2.2,.17,1.75],.06,copper);
  }

  // Richly detailed coaches: arched lighted windows, embossed trim, roof vaults.
  function windowShape(w,h){
    const sh=new T.Shape();
    const half=w/2,bot=-h*.51,shoulder=h*.22,top=h*.52;
    sh.moveTo(-half,bot);sh.lineTo(half,bot);sh.lineTo(half,shoulder);
    sh.quadraticCurveTo(half,top,0,top);sh.quadraticCurveTo(-half,top,-half,shoulder);sh.closePath();
    return sh;
  }
  function exteriorWindow(parent,side,z){
    const g=new T.Group();g.position.set(side*2.16,2.10,z);
    g.rotation.y=side*Math.PI/2;parent.add(g);
    const border=new T.Mesh(new T.ShapeGeometry(windowShape(1.23,1.73)),gold);g.add(border);
    const pane=new T.Mesh(new T.ShapeGeometry(windowShape(1.035,1.49)),glass);
    pane.position.z=.018;g.add(pane);
    const bar=bx(g,.035,1.40,.028,0,-.06,.035,gold);
    bx(g,1.13,.04,.04,0,-.43,.04,brightGold);
    sphere(g,.055,-.48,-.55,.05,brightGold);
    sphere(g,.055,.48,-.55,.05,brightGold);
  }
  function roof(parent){
    const sh=new T.Shape();
    sh.moveTo(-2.24,0);sh.lineTo(2.24,0);sh.lineTo(2.24,.12);
    sh.quadraticCurveTo(1.58,.8,0,.9);sh.quadraticCurveTo(-1.58,.8,-2.24,.12);
    sh.closePath();
    const m=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:9.38,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:2,curveSegments:18}),plum);
    m.position.set(0,3.33,-4.69);parent.add(m);
    for(const side of [-1,1]){
      bx(parent,.09,.085,9.3,side*2.14,3.37,0,gold);
      for(let z=-4;z<=4;z+=2){
        bx(parent,.035,.08,4.2,0,4.17,z,brightGold);
      }
    }
    return m;
  }
  function canvasSign(text){
    return makeCanvasTexture((ctx,w,h)=>{
      const gr=ctx.createLinearGradient(0,0,w,0);
      gr.addColorStop(0,'#e4aa64');gr.addColorStop(.5,'#fff1c4');gr.addColorStop(1,'#ce895a');
      ctx.clearRect(0,0,w,h);
      ctx.font='bold 52px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=gr;ctx.fillText(text,w/2,h/2, w*.92);
      ctx.strokeStyle='#3d1b38';ctx.lineWidth=2;ctx.strokeText(text,w/2,h/2,w*.92);
    },760,116);
  }
  const signTexture=canvasSign('STARLIGHT  EXPRESS');
  for(let i=0;i<cars.length;i++){
    const coach=cars[i];
    // Hide featureless original roof box; retain body so cabins remain recognizable.
    if(coach.children[1])coach.children[1].visible=false;
    // Original opaque windows are replaced with custom arched glass.
    for(const obj of coach.children){ if(obj.isMesh&&obj.geometry.type==='BoxGeometry' && obj.geometry.parameters.width===.06) obj.visible=false; }
    roof(coach);
    for(const side of [-1,1]){
      bx(coach,.07,.095,9.1,side*2.125,3.08,0,gold);
      bx(coach,.085,.08,9.1,side*2.125,.85,0,gold);
      bx(coach,.07,.08,9.1,side*2.12,.46,0,brightGold);
      for(let k=-2;k<=2;k++)exteriorWindow(coach,side,k*1.45);
      const name=new T.Mesh(new T.PlaneGeometry(3.3,.51),new T.MeshBasicMaterial({map:signTexture,transparent:true,side:T.DoubleSide,depthWrite:false}));
      name.position.set(side*2.173,.78,0);
      name.rotation.y=side*Math.PI/2;coach.add(name);
      for(let z=-3.9;z<=3.9;z+=1.95){
        bx(coach,.085,2.12,.065,side*2.147,2.0,z,copper);
      }
    }
    // Gold carriage doors, handles and front/rear boarding steps
    for(const end of [-1,1]){
      const z=end*4.48;
      bx(coach,1.55,2.33,.065,0,1.63,z,gold);
      bx(coach,1.31,2.11,.085,0,1.63,z+end*.043,plum);
      bx(coach,.85,.72,.11,0,2.05,z+end*.11,glass);
      sphere(coach,.09,.49,1.52,z+end*.13,brightGold);
      bx(coach,1.65,.13,.45,0,.28,z+end*.25,gold);
      bx(coach,1.45,.09,.45,0,.06,z+end*.58,lacquer);
    }
    // Decorative side skirts and visible suspension and bogies
    bx(coach,3.35,.45,7.45,0,.48,0,lacquer);
    for(const p of coach.children.slice(-4)){ if(p.geometry?.type==='CylinderGeometry')p.visible=false; }
    for(const side of [-1,1]){
      for(const z of [-3,3])ornateWheel(coach,side*1.88,.10,z,.65);
      bx(coach,.09,.3,1.7,side*1.9,.36,3.0,lacquer);
      bx(coach,.09,.3,1.7,side*1.9,.36,-3.0,lacquer);
    }
    for(const z of [-4.1,4.1]){
      sphere(coach,.12,0,.53,z,brightGold);
    }
    // small upper marker lights
    const marker=new T.PointLight(0xffa4cb,4,6);
    marker.position.set(0,3.4,0);coach.add(marker);
  }

  // Interior: patterned runner, ceiling cornices, brass lamps, wood paneling,
  // decorative curtains, tufted velvet couches and warm picture lighting.
  const runnerTexture=makeCanvasTexture((ctx,w,h)=>{
    ctx.fillStyle='#391d46';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#b57b9a';ctx.lineWidth=9;
    ctx.strokeRect(24,10,w-48,h-20);
    for(let y=0;y<h+60;y+=75){
      ctx.fillStyle='#bc7da5';
      ctx.beginPath();ctx.moveTo(w/2,y-22);ctx.lineTo(w/2+34,y+8);ctx.lineTo(w/2,y+39);ctx.lineTo(w/2-34,y+8);ctx.closePath();ctx.fill();
    }
  },400,700);
  runnerTexture.wrapS=T.RepeatWrapping;runnerTexture.wrapT=T.RepeatWrapping;
  runnerTexture.repeat.set(1,14);
  const runner=new T.Mesh(new T.PlaneGeometry(1.22,corridorLength-.2),new T.MeshStandardMaterial({map:runnerTexture,roughness:.9}));
  runner.rotation.x=-Math.PI/2;runner.position.set(0,.015,-corridorLength/2+5.3);
  interior.add(runner);
  for(const side of [-1,1]){
    bx(interior,.045,.11,corridorLength-.15,side*.67,.035,-corridorLength/2+5.3,gold);
    bx(interior,.055,.08,corridorLength,side*2.16,.31,-corridorLength/2+5.3,gold);
    bx(interior,.065,.11,corridorLength,side*2.15,3.4,-corridorLength/2+5.3,brightGold);
  }
  const innerWindowGlow=new T.MeshBasicMaterial({color:0xffbfdb,transparent:true,opacity:.72,side:T.DoubleSide});
  for(let i=0;i<4;i++){
    const base=-i*10.6;
    for(let section=0;section<3;section++){
      for(const side of [-1,1]){
        const z=base+3.3-section*3.05;
        // velvet curtain panels frame the window edges, without hiding memories
        for(const k of [-1,1]){
          bx(interior,.14,1.62,.19,side*2.055,2.04,z+k*.72,velvet);
          bx(interior,.1,.1,.22,side*2.035,1.66,z+k*.72,gold);
        }
        bx(interior,.45,.09,1.95,side*2.02,1.20,z,gold);
        // transparent blue-pink view strip hints at nightscape beyond glass
        const pane=bx(interior,.014,1.25,1.30,side*2.175,2.05,z,innerWindowGlow);
      }
    }
    for(let s=-1;s<=1;s+=2){
      for(const zOffset of [1.65,-1.75]){
        // Additional pleats and button details make the plain benches plush.
        bx(interior,.86,.14,1.75,s*1.35,.77,base+zOffset,velvet);
        for(const dz of [-.62,-.22,.22,.62]){
          sphere(interior,.06,s*1.3,.82,base+zOffset+dz,roseGold,[1,.4,1]);
        }
      }
      // An upholstered carriage table along the wall
      bx(interior,.75,.09,.7,s*1.48,1.03,base-.08,copper);
      cylinder(interior,.055,.07,.55,s*1.48,.75,base-.08,gold);
      sphere(interior,.1,s*1.48,1.18,base-.08,ivory,[1,.55,1]);
    }
    for(const zOff of [3.0,.2,-2.6]){
      // Arched ceiling ribs / decorative golden framing
      bx(interior,4.25,.075,.10,0,3.59,base+zOff,gold);
      for(const side of [-1,1])bx(interior,.10,.32,.10,side*2.08,3.46,base+zOff,gold);
    }
    const hanging=new T.PointLight(0xffd6ba,8,8);
    hanging.position.set(0,3.35,base);interior.add(hanging);
  }
  // Soft star motes in the interior: low count for mobile performance.
  for(let i=0;i<34;i++){
    const s=sphere(interior,.014+(i%3)*.008,(Math.sin(i*17)*.6),1.3+(i%7)*.28,-(i*1.09)%corridorLength,
      new T.MeshBasicMaterial({color:i%2?0xffc2f1:0xfff1c5}));
  }
  const locoRing=halo(loco,0,4.25,2,3.3,2.1,0xffa46e,.18);
  return {
    update(timeMs,mode){
      const t=timeMs*.001;
      for(const wheel of wheelParts)wheel.rotation.x=t*.12;
      // Clouds of smoke drift gently above the locomotive.
      smoke.forEach((p,i)=>{
        const m=p.mesh;
        const phase=(t*.31+i*.125)%1;
        m.position.set(Math.sin(t*.8+i)*.26,5.4+phase*4,2.05+phase*.35);
        m.scale.setScalar(.7+phase*2.3);
        m.material.opacity=.15*(1-phase);
      });
      // One animated moving light band, rather than an intense bloom pass.
      magentaFill.intensity=75+8*Math.sin(t*.85);
      locoRing.material.opacity=.18+.04*Math.sin(t*1.8);
    }
  };
}
