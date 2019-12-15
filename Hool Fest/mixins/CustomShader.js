
let vertexShader = /* glsl */ `
uniform float timeDelta;
uniform float destortion;
uniform float waveFreq;

#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || ( defined( USE_NORMALMAP ) && ! defined( OBJECTSPACE_NORMALMAP ) )
	varying vec3 vViewPosition;
#endif
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>

void main() {
	#include <uv_vertex>



	// sin(timeDelta - sin(position.y) * 1.0) * destortion , 
	// 		0.0 , 
	// 		0.0  

	vec3 destort = vec3(
			(sin((position.y * waveFreq) + timeDelta) * destortion), 
			(sin((position.x * waveFreq) + cos(timeDelta)) * destortion),
			(sin((normal.z * waveFreq) + timeDelta) * destortion)
		);
	// add destortion here

	vec3 objectNormal = normal;

	objectNormal += ( destort - normal ) * 0.5;
	

	/* vec3 objectNormal = normal; */

	#ifdef USE_TANGENT
		vec3 objectTangent = vec3( tangent.xyz );
	#endif
	// #include <beginnormal_vertex>

	// #include <morphnormal_vertex>
	#ifdef USE_MORPHNORMALS
	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];
	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];
	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];
	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];
	#endif

	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	// #include <defaultnormal_vertex>
	vec3 transformedNormal = normalMatrix * objectNormal;

	#ifdef FLIP_SIDED
		transformedNormal = - transformedNormal;
	#endif
	#ifdef USE_TANGENT
		vec3 transformedTangent = normalMatrix * objectTangent;
		#ifdef FLIP_SIDED
			transformedTangent = - transformedTangent;
		#endif
	#endif

	#ifndef FLAT_SHADED
		vNormal = normalize( transformedNormal );
		#ifdef USE_TANGENT
			vTangent = normalize( transformedTangent );
			vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#endif
	#endif

	vec3 transformed = position + destort ;

	// #include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	// #include <displacementmap_vertex>
	#ifdef USE_DISPLACEMENTMAP
		transformed += normalize( objectNormal ) * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );
	#endif

	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || ( defined( USE_NORMALMAP ) && ! defined( OBJECTSPACE_NORMALMAP ) )
		vViewPosition = - mvPosition.xyz;
	#endif
}
`

let fragmentShader = /* glsl */ `

#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || ( defined( USE_NORMALMAP ) && ! defined( OBJECTSPACE_NORMALMAP ) )
	varying vec3 vViewPosition;
#endif
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <packing>
#include <uv_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
}
`

/* Vue.js Mixin */
const CustomShader = {
	data() {
		return {
			shader: {
				vertex: vertexShader,
				fragment: fragmentShader,
			}
		}
	}
}

export { CustomShader };
				


