// Ref: https://blog.ourcade.co/posts/2020/phaser-3-optimization-object-pool-basic/

import Phaser from "../../../libs/phaser-full.min";

export const KEY_CRATE = 'crate'

class Crate extends Phaser.Physics.Matter.Image {
    constructor(scene, x, y, key) {
        super(scene.matter.world, x, y, key)
    }
}

export default class CratePool extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        const defaults = {
            classType: Crate,
            maxSize: -1
        }

        super(scene, Object.assign(defaults, config))
    }

    spawn(x = 0, y = 0, key = KEY_CRATE) {
        const spawnExisting = this.countActive(false) > 0

        const crate = this.get(x, y, KEY_CRATE)

        if (spawnExisting) {
            crate.setVisible(true)
            crate.setActive(true)
            crate.world.add(crate.body)
        }

        return crate
    }

    despawn(crate) {
        this.killAndHide(crate)

        crate.alpha = 1
        crate.scale = 1
        crate.removeInteractive()
        crate.world.remove(crate.body)
    }

    initializeWithSize(size) {
        if (this.getLength() > 0 || size <= 0) {
            return
        }

        this.createMultiple({
            key: KEY_CRATE,
            quantity: size,
            visible: false,
            active: false
        })
    }
}

// put this above `export { KEY_GRAIN }`
Phaser.GameObjects.GameObjectFactory.register('cratePool', function () {
    // @ts-ignore
    return this.updateList.add(new CratePool(this.scene));
})
export {
    KEY_CRATE as KEY_GRAIN
}