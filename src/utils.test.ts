import { Box3, Vector3 } from "three";
import { directionBoxesOverlap } from "./utils";
import { Direction } from "./Types";
import { TowerConstants } from "./constants";

describe("directionBoxesOverlap", () => {

    describe("X Direction Overlaps", () => {
        const y = { min: 31.5, max: 32.5 }
        const z = { min: 3.04, max: 3.75 }

        it('should return DIRECTION.POSITIVE_X when box1 is to the left of box2', () => {
            const lastBox = new Box3(new Vector3(3.07, y.min, z.min), new Vector3(3.61, y.max, z.max))
            const stackBox = new Box3(new Vector3(3.4, y.max, z.min), new Vector3(3.94, y.max + TowerConstants.BOX_HEIGHT, z.max))
            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.POSITIVE_X)

        })

        it('should return DIRECTION.NEGATIVE_X when box1 is to the right of box2', () => {


            const lastBox = new Box3(new Vector3(3.4, y.min, z.min), new Vector3(3.94, y.max, z.max))
            const stackBox = new Box3(new Vector3(3.07, y.max, z.min), new Vector3(3.61, y.max + TowerConstants.BOX_HEIGHT, z.max))

            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.NEGATIVE_X)

        })

    })

    describe("Z Direction Overlaps", () => {
        const y = { min: 31.5, max: 32.5 }
        const x = { min: 3.04, max: 3.75 }

        it('should return DIRECTION.POSITIVE_Z when box1 is in front of box2', () => {
            const zLastBox = { min: 3.07, max: 3.61 }
            const zStackBox = { min: 3.4, max: 3.94 }

            const lastBox = new Box3(new Vector3(x.min, y.min, zLastBox.min), new Vector3(x.max, y.max, zLastBox.max))
            const stackBox = new Box3(new Vector3(x.min, y.max, zStackBox.min), new Vector3(x.max, y.max + TowerConstants.BOX_HEIGHT, zStackBox.max))
            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.POSITIVE_Z)
        })

        it('should return DIRECTION.NEGATIVE_Z when box1 is behind box2', () => {
            const zLastBox = { min: 3.4, max: 3.94 }
            const zStackBox = { min: 3.07, max: 3.61 }

            const lastBox = new Box3(new Vector3(x.min, y.min, zLastBox.min), new Vector3(x.max, y.max, zLastBox.max))
            const stackBox = new Box3(new Vector3(x.min, y.max, zStackBox.min), new Vector3(x.max, y.max + TowerConstants.BOX_HEIGHT, zStackBox.max))
            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.NEGATIVE_Z)
        })

    })

    it('should return DIRECTION.NONE when boxes are not overlapping', () => {
        const y = { min: 31.5, max: 32.5 }
        const x = { min: 3.04, max: 3.75 }
        const z = { min: 3.04, max: 3.75 }
        const lastBox = new Box3(new Vector3(x.min, y.min, z.min), new Vector3(x.max, y.max, z.max))
        const stackBox = new Box3(new Vector3(x.min, y.max, z.min), new Vector3(x.max, y.max + TowerConstants.BOX_HEIGHT, z.max))
        expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.NONE)
    })

    describe("Box missed in all directions", () => {

        const y = { min: 31.5, max: 32.5 }
        const x = { min: 3.04, max: 3.75 }
        const z = { min: 3.04, max: 3.75 }
        it('should return DIRECTION.ALL when stack box is not touching in positive x direction, i.e. missed', () => {
            const lastBox = new Box3(new Vector3(x.min, y.min, z.min), new Vector3(x.max, y.max, z.max))
            const stackBox = new Box3(new Vector3(x.max, y.max, z.min), new Vector3(x.max + 20, y.max + TowerConstants.BOX_HEIGHT, z.max))
            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.ALL)
        })
        it('should return DIRECTION.ALL when stack box is not touching in negative x direction, i.e. missed', () => {
            const lastBox = new Box3(new Vector3(x.min, y.min, z.min), new Vector3(x.max, y.max, z.max))
            const stackBox = new Box3(new Vector3(x.min - 20, y.max, z.min), new Vector3(x.min - 23, y.max + TowerConstants.BOX_HEIGHT, z.max))
            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.ALL)
        })

        it('should return DIRECTION.ALL when stack box is not touching in positive z direction, i.e. missed', () => {
            const lastBox = new Box3(new Vector3(x.min, y.min, z.min), new Vector3(x.max, y.max, z.max))
            const stackBox = new Box3(new Vector3(x.min, y.max, z.max), new Vector3(x.max, y.max + TowerConstants.BOX_HEIGHT, z.max + 20))
            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.ALL)
        }
        )
        it('should return DIRECTION.ALL when stack box is not touching in negative z direction, i.e. missed', () => {
            const lastBox = new Box3(new Vector3(x.min, y.min, z.min), new Vector3(x.max, y.max, z.max))
            const stackBox = new Box3(new Vector3(x.min, y.max, z.min - 20), new Vector3(x.max, y.max + TowerConstants.BOX_HEIGHT, z.min - 23))
            expect(directionBoxesOverlap(lastBox, stackBox)).toEqual(Direction.ALL)
        })
    })
})