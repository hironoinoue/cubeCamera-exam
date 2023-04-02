import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CubeCamera } from "three";

//canvasの取得
const canvas = document.querySelector("#webgl");

//Scene
const scene = new THREE.Scene();

//Texture
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("texture/sky02.jpg");
scene.background = bgTexture;

//サイズ 【Cameraのアスペクト比とrendererのサイズ　= 画面に描画される大きさの為　→ サイズ用の変数を作成し共通化】
const sizes = {
  width: window.innerWidth, 
  height: window.innerHeight
};

//Camera (fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera( 50, sizes.width/sizes.height, 0.1, 1000 );
camera.position.set(0, 500, 1000);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
/**Canvasタグにレンダラーを追加する( bodyタグに表示する場合は　document.body.appendChild(renderer.domElement); )*/ 
canvas: canvas,
antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//envimage
const urls = [
  "./envimage/right.png",
  "./envimage/left.png",
  "./envimage/up.png",
  "./envimage/down.png",
  "./envimage/front.png",
  "./envimage/back.png",
];

const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(urls);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(800);
const cubeCamera  = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
scene.add(cubeCamera);

//objects
const material = new THREE.MeshBasicMaterial({
  envMap: cubeRenderTarget.texture,
  reflectivity: 1,
});
const geometry = new THREE.SphereGeometry(200, 50, 50);
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 100, 0);
scene.add(sphere);

//animation
const anime = () => {

  //sphere.rotation.x += 0.01;
  cubeCamera.rotation.x += 0.01;
  //sphere.rotation.y += 0.01;
  cubeCamera.rotation.y += 0.01;
  controls.update();
  cubeCamera.update(renderer, scene);
  renderer.render(scene, camera);
  window.requestAnimationFrame(anime);
};

anime();


//browser resize　ブラウザのリサイズしたら、カメラのアスペクト比とレンダラーもリサイズする
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

