import { StackingBox } from "../Types";
import { TowerConstants } from "../constants";

type FakeTowerBoxesOptions =
    { start: { level: number, width: number, length: number } }

export const createFakeTowerBoxes: (count: number, options: FakeTowerBoxesOptions) => Array<StackingBox> = (count, options) => {
    return Array.from({ length: count }, (_, i) => {
        return {
            position: [3 + i * .2, i + options.start.level, 3],
            args: [options.start.width ?? TowerConstants.START_DIMENSIONS.width, 1, options.start.length ?? TowerConstants.START_DIMENSIONS.length],
            color: `hsl(${i * 36}, 100%, 50%)`,
        }
    })
}
