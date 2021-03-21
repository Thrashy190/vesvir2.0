import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

/**
 * GraphicsEngine class for running BabylonJS
 * and rendering 3D rigged character on it
 */

const bones = {
  0: 'all',
  1: 'all_inner',
  2: 'all_inner_inner',
  3: 'waist',
  4: 'low_torso',
  5: 'middle_torso',
  6: 'top_torso',
  7: 'neck',
  8: 'right_eyelid',
  9: 'left_eyelid',
  10: 'right_eye',
  11: 'left_eye',
  12: 'right_torso',
  13: 'right_shoulder',
  14: 'right_elbow',
  15: 'right_wrist',
  16: 'right_thumb',
  17: 'right_thumb_middle',
  18: 'right_thumb_tip',
  19: 'right_index',
  20: 'right_index_middle',
  21: 'right_index_tip',
  22: 'right_middle',
  23: 'right_middle_middle',
  24: 'right_middle_tip',
  25: 'right_ring',
  26: 'right_ring_middle',
  27: 'right_ring_tip',
  28: 'right_pinky',
  29: 'right_pinky_middle',
  30: 'right_pinky_tip',
  31: 'left_torso',
  32: 'left_shoulder',
  33: 'left_elbow',
  34: 'left_wrist',
  35: 'left_thumb',
  36: 'left_thumb_middle',
  37: 'left_thumb_tip',
  38: 'left_index',
  39: 'left_index_middle',
  40: 'left_index_tip',
  41: 'left_middle',
  42: 'left_middle_middle',
  43: 'left_middle_tip',
  44: 'left_ring',
  45: 'left_ring_middle',
  46: 'left_ring_tip',
  47: 'left_pinky',
  48: 'left_pinky_middle',
  49: 'left_pinky_tip',
  50: 'right_leg',
  51: 'right_kneel',
  52: 'right_ankle',
  53: 'right_foot',
  54: 'left_leg',
  55: 'left_kneel',
  56: 'left_ankle',
  57: 'left_foot_fingers',
};
export default class GraphicsEngine {
  /**
   * the class constructor
   * @param {HTMLCanvasElement} _canvas
   * @param {Joints} _joints
   */
  constructor(_canvas, _joints) {
    this.canvas = _canvas;
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.displayLoadingUI();
    this.engine.loadingUIText = 'Bablyon 3D Loading ...';
    this.joints = _joints;
    this.initScene();
    this.engine.hideLoadingUI();
  }

  /**
   * Initialez the scene, creates the character
   * and defines how should joints of the character be updated
   */
  initScene() {
    BABYLON.Animation.AllowMatricesInterpolation = true;
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
    const camera = this.setCamera();
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      'headSphere',
      { diameter: 0.001 },
      this.scene
    );
    const torsoSphere = BABYLON.MeshBuilder.CreateSphere(
      'torsoSphere',
      { diameter: 1 },
      this.scene
    );
    BABYLON.SceneLoader.ImportMesh(
      '',
      './assets/',
      'camisaG.glb',
      this.scene,
      (newMeshes, particleSystems, skeletons) => {
        const mesh = newMeshes[0];
        const skeleton = skeletons[0];
        mesh.scaling = new BABYLON.Vector3(3, 3, 3);
        mesh.position = new BABYLON.Vector3(0, 0, 0);
        mesh.rotation.y = 90;

        /** Head movement tracking */
        // const head_bone = skeleton.bones[7];

        const right_shoulder_bone = skeleton.bones[10];
        console.log('right_shoulder_bone', right_shoulder_bone);
        const right_arm_bone = skeleton.bones[12];
        console.log('right_arm_bone', right_arm_bone);
        const left_shoulder_bone = skeleton.bones[5];
        console.log('left_shoulder_bone', left_shoulder_bone);
        const left_arm_bone = skeleton.bones[7];
        console.log('left_arm_bone', left_arm_bone);
        const torso_bone = skeleton.bones[3];
        console.log('torso_bone', torso_bone);

        /** Head movement tracking */

        // const headLookAtCtl = new BABYLON.BoneLookController(
        //   mesh,
        //   head_bone,
        //   sphere.position,
        //   { adjustYaw: Math.PI * 0.5, adjustRoll: Math.PI * 0.5 }
        // );

        const torsoLookAtCtl = new BABYLON.BoneLookController(
          mesh,
          torso_bone,
          torsoSphere.position,
          { adjustYaw: Math.PI * 0.5, adjustRoll: Math.PI * 0.5 }
        );

        this.scene.registerBeforeRender(() => {
          const { data } = this.joints;

          //console.log('head coords', data.head);
          sphere.position.x = 0 + data.head.x;
          sphere.position.y = 6 + data.head.y;
          sphere.position.z = 5;

          //console.log('torso coords', data.torso);
          // t += 0.02;
          // torsoSphere.position.x = 2 * Math.sin(t);
          torsoSphere.position.x = 0 - data.torso.x;
          torsoSphere.position.y = 5;
          torsoSphere.position.z = 5;

          // headLookAtCtl.update();
          torsoLookAtCtl.update();

          right_shoulder_bone.rotation = new BABYLON.Vector3(
            0,
            1.5 * data.rightShoulder,
            0
          );
          right_arm_bone.rotation = new BABYLON.Vector3(0, data.rightElbow, 0);
          left_shoulder_bone.rotation = new BABYLON.Vector3(
            0,
            -1.5 * data.leftShoulder,
            0
          );
          left_arm_bone.rotation = new BABYLON.Vector3(0, -data.leftElbow, 0);
        });
      }
    );
  }

  /** BabylonJS render function that is called every frame */
  render() {
    const self = this;
    this.engine.runRenderLoop(() => {
      const self = this;
      if (self.scene) self.scene.render();
    });
  }

  /** Sets up 3d virtual cam for the scene */
  setCamera() {
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      0,
      1,
      20,
      BABYLON.Vector3.Zero(),
      this.scene
    );
    camera.setTarget(new BABYLON.Vector3(0, 4, 0));
    camera.setPosition(new BABYLON.Vector3(0, 6, 12));
    camera.attachControl(this.canvas, true);
    const light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.7;
    return camera;
  }
}
