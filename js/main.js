if ( WEBVR.isAvailable() === false ) {
	document.body.appendChild( WEBVR.getMessage() );
}

var floor;
var camera, scene, renderer;
var controls;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
	var element = document.body;
	var pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			controls.enabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	};
	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	};

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.style.display = 'none';
	
	// Ask the browser to lock the pointer
	element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
	element.requestPointerLock();

	instructions.addEventListener( 'click', function ( event ) {
		instructions.style.display = 'none';
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();
	}, false );
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

init();
animate();

function init() {
	map_w = 2000;
	map_d = 2000; 
	curr_x = Math.random() * map_w / 2 - map_w / 4;
	curr_z = Math.random() * map_d / 2 - map_d / 4;
	explode_height = Math.random() * 600 + 300;

	// === LOOK: Setup camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set(0, 200, 0);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xefd1b5, 0.001 );

	// === LOOK: Setup light
	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );
	
	// === LOOK: Get pointer lock controls
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	
	// Setup floor
	geometry = new THREE.PlaneGeometry( map_w, map_d, 40, 40 );
	geometry.rotateX( - Math.PI / 2 );

	// Perlin Noise Generation
	height_data = generateHeight( map_w, map_d );
	geometry.vertices.forEach(function (v) { 
		v.y = height_data[(v.x + map_w / 2) + (v.z + map_d / 2) * map_d]
	});

	// Floor TEXTURE
	var grass_texture = new THREE.TextureLoader().load('textures/grass.png');
	material = new THREE.MeshBasicMaterial({map: grass_texture});
	floor = new THREE.Mesh( geometry, material );
	scene.add( floor );

	// === Setup renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	selecting = false;

	// make cube
	var cube_v = new THREE.BoxBufferGeometry( 10, 10, 10 );
	var cube_material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
	cube_mesh = new THREE.Mesh( cube_v, cube_material );
	scene.add( cube_mesh );
	cube_mesh.position.set(curr_x, 150, curr_z);

	// make sparks
	spark_list = [];
	vel_list = [];
	for (var i = 0; i < 30; i++) {
		temp_spark_v = new THREE.BoxBufferGeometry( 10, 10, 10 );
		temp_spark_m = new THREE.MeshBasicMaterial( { color: 0xffffff });
		spark_list.push(new THREE.Mesh( temp_spark_v, temp_spark_m ));
		scene.add( spark_list[i] );
		spark_list[i].position.set(-150, 700, -300);
		vel_list.push([0, 0, 0]);
	}
}

function animate() {
	requestAnimationFrame( animate );
	
	cube_mesh.rotation.x += 0.05;
	cube_mesh.rotation.y += 0.1;

	cube_mesh.position.y += 3; 
	if (cube_mesh.position.y > explode_height) {
		for (var i = 0; i < 30; i++) {
			spark_list[i].position.set(cube_mesh.position.x, explode_height, cube_mesh.position.z);
			vel_list[i] = [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3];
			spark_list[i].material.color.setHex(Math.random() * 255, Math.random() * 255, Math.random() * 255);
		}
		explode_height = Math.random() * 600 + 300;
		cube_mesh.position.y = 150;
		cube_mesh.position.x = Math.random() * map_w / 2 - map_w / 4;
		cube_mesh.position.z = Math.random() * map_d / 2 - map_d / 4;

	}
	for (var i = 0; i < 30; i++) {
		spark_list[i].position.x += vel_list[i][0];
		spark_list[i].position.y += vel_list[i][1];
		spark_list[i].position.z += vel_list[i][2];
	}

	renderer.render( scene, camera );
}

function generateHeight( width, height ) {
	var size = width * height, data = new Uint8Array( size ),
	perlin = new ImprovedNoise(), quality = 1, z = 0;
	for ( var j = 0; j < 4; j ++ ) {
		for ( var i = 0; i < size; i ++ ) {
			var x = i % width, y = ~~ ( i / width );
			data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
		}
		quality *= 5;
	}
	return data;
}