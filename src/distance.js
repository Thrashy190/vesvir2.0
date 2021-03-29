//detect distance from point A to point B

export function distancePointsChest(poses) {
  return poses.keypoints["5"].position.x - poses.keypoints["6"].position.x;
}
