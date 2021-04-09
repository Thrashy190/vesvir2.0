import { drawPoint } from "./utilities";

//detect distance from point A to point B
export function distancePointsChest(poses) {
  const distanceData = {
    distance: poses.keypoints["5"].position.x - poses.keypoints["6"].position.x,
    score: (poses.keypoints["5"].score + poses.keypoints["6"].score) / 2,
  };
  return distanceData;
}

export function centerChestPoint(pose) {
  try {
    const leftShoulder = {
      x: pose.keypoints["5"].position.x,
      y: pose.keypoints["5"].position.y,
      score: pose.keypoints["5"].score,
    };
    const rightShoulder = {
      x: pose.keypoints["6"].position.x,
      y: pose.keypoints["6"].position.y,
      score: pose.keypoints["6"].score,
    };
    const rightHip = {
      x: pose.keypoints["12"].position.x,
      y: pose.keypoints["12"].position.y,
      score: pose.keypoints["12"].score,
    };
    const scoreChest =
      (leftShoulder.score + rightShoulder.score + rightHip.score) / 3;

    const centerPoint = {
      x: rightShoulder.x + (rightShoulder.x - rightShoulder.x) / 2,
      y: rightShoulder.y + (rightHip.y - rightShoulder.y) / 2,
      score: scoreChest,
    };

    return centerPoint;
  } catch (error) {
    console.error(error);
    return "Iniciando proceso";
  }
}
