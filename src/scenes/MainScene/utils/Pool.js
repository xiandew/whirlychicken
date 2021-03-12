// Ref: https://blog.ourcade.co/posts/2020/phaser-3-optimization-object-pool-basic/

import Phaser from "../../../libs/phaser-full.min";

class Pool extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        const defaults = {
            classType: Phaser.GameObjects.Image,
            maxSize: -1
        };

        super(scene, Object.assign(defaults, config));
    }

    spawn(x = 0, y = 0, key = this.defaultKey, frame = this.defaultFrame) {
        const spawnExisting = this.countActive(false) > 0;

        const obj = this.get(x, y, key, frame);

        if (spawnExisting) {
            obj.setVisible(true);
            obj.setActive(true);
            obj.world && obj.world.add(obj.body);
        }

        return obj;
    }

    despawn(obj) {
        this.killAndHide(obj);

        obj.alpha = 1;
        obj.scale = 1;
        obj.removeInteractive();
        obj.world && obj.world.remove(obj.body);
    }

    initializeWithSize(size) {
        if (this.getLength() > 0 || size <= 0) {
            return;
        }

        this.createMultiple({
            key: this.defaultKey,
            frame: this.defaultFrame,
            quantity: size,
            visible: false,
            active: false
        });
    }
}

Phaser.GameObjects.GameObjectFactory.register('pool', function (config) {
    return this.updateList.add(new Pool(this.scene, config));
});
