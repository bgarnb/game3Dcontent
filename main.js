import {loadGLTF, loadAudio} from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    //initiate the AR 3 object
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/targets.mind'
    });
    const {renderer, scene, camera} = mindarThree;

//light is needed when we use 3D objects
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const raccoon = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    const mixer = new THREE.AnimationMixer(raccoon.scene);
    const action = mixer.clipAction(raccoon.animations[0]);
    action.play();

    const clock = new THREE.Clock();


    //const audioClip1 = await loadAudio('./assets/sounds/musicband-background.mp3');

    //const listener1 = new THREE.AudioListener();
    //camera.add(listener1);

    //const audio1 = new THREE.PositionalAudio(listener1);
    //raccoonAnchor.group.add(audio1);

    //audio1.setBuffer(audioClip1);
    //audio1.setRefDistance(100);
    //audio1.setLoop(true);

    //raccoonAnchor.onTargetFound = () => {
      //audio1.play();
    //}
    //raccoonAnchor.onTargetLost = () => {
      //audio1.pause();
    //}

    //second digital content (3D model with audio)
    const bear = await loadGLTF('./assets/models/musicband-bear/scene.gltf');
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    const audioClip2 = await loadAudio('./assets/sounds/musicband-background.mp3');

    const listener2 = new THREE.AudioListener();
    camera.add(listener2);

    const audio2 = new THREE.PositionalAudio(listener2);
    bearAnchor.group.add(audio2);

    audio2.setBuffer(audioClip2);
    audio2.setRefDistance(100);
    audio2.setLoop(true);

    bearAnchor.onTargetFound = () => {
      audio2.play();
    }
    bearAnchor.onTargetLost = () => {
      audio2.pause();
    }


//start the experience
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      
      //next three lines work for rotating the raccoon scene
      const delta = clock.getDelta();
      raccoon.scene.rotation.set(0, raccoon.scene.rotation.y+delta, 0);
      mixer.update(delta);


      renderer.render(scene, camera);
    });
  }
    start();
});
