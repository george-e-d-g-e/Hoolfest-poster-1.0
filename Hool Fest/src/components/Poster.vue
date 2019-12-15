<template>
	<div 
		id="world" 
		ref="world" 
	>				       
	</div>
</template>

<script>
	import * as THREE from "three";

	//console.log(THREE.ShaderChunk);
	// Monkey Patch the fog 
	console.log(THREE.ShaderChunk.fog_vertex);
	// THREE.ShaderChunk.fog_vertex = `
	// 	#ifdef USE_FOG
	// 		vec4 WorldFogPosition = modelMatrix * vec4(position, 1.0);
	// 		fogDepth = -WorldFogPosition.y ;
	// 	#endif
	// `;

	// -mvPosition.z * 0.1 TODO add in fog Depth

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	// import { CreateAnimationClip } from '@/mixins/CreateAnimationClip.js';
	import { CustomShader } from '@/mixins/CustomShader.js';
	
	// import * as Stats from 'stats.js';
	// import * as dat from 'dat.gui';

    const windowHalfX = window.innerWidth / 2;
	const windowHalfY = window.innerHeight / 2;
	// gui: new dat.GUI(),
	export default{
		name: "Poster",
		mixins: [ CustomShader ],
		data: function() {
			return{
				scene: {}, 
				camera: {}, 
				renderer: {}, 
				object:{},
				controls:{
					freq: 0.6,
					mag: 0.4,
					time: 0.5,
				}, 
				orbitControls: {},
				clock:{},
				customMat:{},
				uniforms: {},
				pointLight: {},
				mouse: {
					position: {
						x: 0,
						y: 0
					}
				},
				updateCamera: false,
				infoActive: false,
				showInfo: false,
				rendered: false,
				blob: {},
				timewarp: 0,
				updateMat: true,
				uvMap: {},
				background: {},
				rtTexture: {},
				lightColour: {},
				directionalLight: {},
				box: {},

			}
		},
		mounted: function() {
			// Runs when DOM loaded
		    this.init();
			this.animate();
		},
		methods: {
			init() {

				this.rtTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType } );

				// Keep track of scope
				let self = this;

				// Clock
				this.clock = new THREE.Clock();

				// Scene
				this.scene = new THREE.Scene();
				this.scene.background = new THREE.Color( 0x000000);
				//console.log(this.scene.fog);

				let fogColour = new THREE.Color(0x000000);
				let near = 10;
				let far = 45; 
				this.scene.fog = new THREE.Fog(fogColour, near, far );

				// Camera
				this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 1, 1000 );
      			this.camera.position.set( 0, 0, 10 );
      			this.camera.setFocalLength(12);
					
				// Globle Material 
				let material = new THREE.MeshPhysicalMaterial( {
					color: 0x222222,
					emissive: 0x000000,
					roughness: 0.9,
					metalness: 0.9,
					reflectivity: 1.0,
					clearCoat: 0.0,
					clearCoatRoughness: 0.1,
				} );

				let customUniforms = {
					timeDelta: 	{type: 'f', value: 0},
					destortion: {type: 'f', value: 1.7},
					waveFreq: 	{type: 'f', value: 2.3},
				};

				let uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.normal.uniforms, customUniforms]);

				// Create Material
				let m = new THREE.ShaderMaterial( {
						uniforms: 		uniforms,
						vertexShader: 	this.shader.vertex,
						fragmentShader: this.shader.fragment,
					}
				 );

				// Create Geometry
				let geometry = new THREE.SphereBufferGeometry( 5, 62, 62 );
				//var geometry = new THREE.CylinderBufferGeometry( 5, 5, 10, 62, 62 );
				//geometry = new THREE.BoxBufferGeometry( 62, 62, 62 );
				// Create Mesh
				this.blob = new THREE.Mesh( geometry, m );
				//this.blob.material.side = THREE.DoubleSide;
				
				this.scene.add( this.blob );

				geometry = new THREE.SphereBufferGeometry( 20, 62, 62 );
				this.background = new THREE.Mesh( geometry, material );
				console.log(this.background);
				this.background.material.side = THREE.BackSide;
				// this.background.material.fog = true;
				//this.scene.add( this.background );

				geometry = new THREE.BoxBufferGeometry(50, 50, 5 );

				let box = new THREE.Mesh( geometry, material.clone() );
				box.rotateY(Math.PI/4);
				box.rotateX(Math.PI/8);
				box.position.x = -20;
				box.position.y = 0;
				box.position.z = -10;
				box.material.side =  THREE.FrontSide; //defualt
				this.box = box.clone();
				this.scene.add( this.box );

				box.rotateY(-Math.PI);
				box.rotateX(-Math.PI/16);
				box.position.x = 30;
				box.position.y = 0;
				box.position.z = 5;
				this.scene.add( box.clone());
				
				// Lighting
				let ambientLight = new THREE.AmbientLight( 0xffffff, 1.0);
     			this.scene.add( ambientLight );
     			//Create a DirectionalLight and turn on shadows for the light
     			this.lightColour = new THREE.Color(0,0,0,1);
				this.directionalLight = new THREE.DirectionalLight( this.lightColour, 2.0, 100 );
				this.directionalLight.position.set( 0, 0, 10 ); 	//default; light shining from top
				//directionalLight.castShadow = true;            // default false
				this.scene.add( this.directionalLight );

				this.pointLight = new THREE.PointLight( 0xffffff, 10.0, 50 );
				this.pointLight.position.set( 0, 0,0 );
				//this.pointLight.castShadow = true;            // default false
				this.scene.add( this.pointLight );

     			// Renderer
     			this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      			this.renderer.setSize( window.innerWidth, window.innerHeight );
      			this.renderer.setClearColor( 0xffffff );
      			this.renderer.setPixelRatio( window.devicePixelRatio );
      			//this.renderer.shadowMap.enabled = true;
      			//this.renderer.debug.checkShaderErrors = true;

      			//this.renderer.gammaOutput = true;
				//this.renderer.gammaFactor = 2.2;

				//this.renderer.shadowMap.enabled = true;
				//this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
				this.renderer.domElement.id = "fog";
     			this.$refs.world.appendChild( this.renderer.domElement );			
							

				window.addEventListener( 'resize', this.onResize, false );
				document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );


			},

			animate(){
				requestAnimationFrame( this.animate );
				this.render();
		    },

		    render(){
		    	let delta =  this.clock.getDelta();
		    	this.timewarp += delta;
		    	this.blob.material.uniforms.timeDelta.value = this.timewarp * this.controls.time;
		    	this.blob.rotateY(delta * 0.015);
		    	//this.blob.rotateX(Math.sin(this.timewarp)*(delta * 0.01));
		    	//this.blob.rotateZ(delta * 0.01);
		    	this.blob.material.uniforms.destortion.value = this.controls.mag;
		    	this.blob.material.uniforms.waveFreq.value = this.controls.freq;



		    	// Change shape
		    	let mx = THREE.Math.mapLinear(this.mouse.position.x, 0, windowHalfX * 2, 0, 2) + 1;
		    	let my = THREE.Math.mapLinear(this.mouse.position.y, 0, windowHalfY * 2, 0, 2) + 1;
		    	//this.blob.material.uniforms.destortion.value += 0.01 * (mx - this.blob.material.uniforms.destortion.value);
		    	//this.blob.material.uniforms.waveFreq.value += 0.01 * (my - this.blob.material.uniforms.waveFreq.value);

		    	//this.background.material.uniforms.timeDelta.value = this.timewarp * 0.5;
		    	//this.background.material.uniforms.destortion.value = this.guiContorls.backgroundMag;
		    	//this.background.material.uniforms.waveFreq.value = this.guiContorls.backgroundFreq;

		    	// Move camera
		    	//this.camera.position.x = ( (mx * 2) - 1 ); 
		    	mx = (mx - 2.0) * 0.5;
		    	my = (my - 2.0) * 0.2;

		    	let targetX = 0 * Math.cos(mx) + 15 * Math.sin(mx);
		    	let targetZ = 15 * Math.cos(mx) - 0 * Math.sin(mx);

		    	this.camera.position.y = 0;
		        this.camera.position.x += 0.05 * (targetX - this.camera.position.x);
		        this.camera.position.z += 0.05 * (targetZ - this.camera.position.z);
		    	//my = (my - 1.0) * 2;
		    	//console.log(mx);
		    	var x = this.camera.position.x;
		        var z = this.camera.position.z;

		        this.camera.lookAt(0,0,0);

		    	this.renderer.setRenderTarget( this.rtTexture );
				this.renderer.clear();
				this.renderer.render( this.scene, this.camera );

				this.renderer.setRenderTarget( null );
				this.renderer.render( this.scene, this.camera );

				// Get light Colour
				let read = new Float32Array( 4 );
				//this.renderer.readRenderTargetPixels( this.rtTexture, windowHalfX + this.mouse.position.x, windowHalfY - this.mouse.position.y, 1, 1, read );
				this.renderer.readRenderTargetPixels( this.rtTexture, windowHalfX, windowHalfY, 1, 1, read );
				this.lightColour = new THREE.Color(read[0], read[1], read[2], read[3]);
				//this.directionalLight.color = this.lightColour;
				this.pointLight.color = this.lightColour;
		    },

			onResize() {
				//let w = document.body;
				//this.camera.aspect = w.clientWidth /  w.clientHeight;
				//this.camera.updateProjectionMatrix();
				//this.renderer.setSize(  w.clientWidth,  w.clientHeight );

				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize( window.innerWidth, window.innerHeight );
    		},

    		onDocumentMouseMove( event ) {
				this.mouse.position.x = ( event.clientX - windowHalfX );
				this.mouse.position.y = ( event.clientY - windowHalfY );
			},

		}
	}
</script>

<style scoped>

.artwork-button{
	position: fixed;
    top: calc( 100vh);
    left: 0px;
    color: black;
    padding: 10px 50px;
    text-align: left;
    line-height: 0.5em;
    cursor: pointer;
    font-size: 1em;
    opacity: 0;
    transition: top 0.5s, opacity 0.5s;
}

.artwork-button.show{
    top: calc( 100vh - 100px);
    opacity: 0.5;
}

.artwork-button.show:hover{
    opacity: 1;
}

.artwork-button.active{
	top: 50px;
	opacity: 1;
}


.artwork-button:before {
    content: "^";
    font-size: 50px;
    position: absolute;
    opacity: 0.5;
    transition: transform 0.5s, opacity 0.5s;
    transform: translate(-35px, 53px) rotate(0deg);
}

.artwork-button:hover:before{
	opacity: 1.0;
	 transform: translate(-35px, 27px) rotate(0deg);
}

.artwork-button.active:before {
	opacity: 0.5;
    transform: translate(-35px, 25px) rotate(-180deg);
}

.artwork-button.active:hover:before {
	opacity: 1.0;
    transform: translate(-35px, 39px) rotate(-180deg);
}

.artwork-button.active .artwork-title{
	font-size: 1em;
}

.artwork-button.active .artwork-name{
	font-size: 3em;
}

.artwork-title{
	font-size: 1em;
	transition: font-size 0.5s;
}

.artwork-name{
	font-size: 1.5em;
	transition: font-size 0.5s;
}

.artwork-info{
	margin-top: 2em;
	font-size: 16px;
    max-width: 400px;
    text-align: justify;
    opacity: 0;
    line-height: 1em;
    position: relative;
    top: 100px;
    transition:  top 0.5s 0.2s, opacity 0.5s 0.2s;
}

.artwork-button.active .artwork-info{
	opacity: 1;
	top: 0px;
}

button.cta{
	border: 2px solid black;
    background-color: rgba(255,255,255,0);
    margin: 2em 0px;
    color: black;
    padding: 14px 28px;
    font-size: 16px;
    cursor: pointer;
    position: relative;
    top: 100px;
    opacity: 0;
    transition: top 0.5s 0.4s, opacity 0.5s 0.4s;
}

.artwork-button.active button{
	opacity: 1;
	top: 0px;
}

button.cta:hover{
	background: black;
	color: white;
}



</style>