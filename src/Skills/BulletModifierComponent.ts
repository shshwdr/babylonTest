 import { Component } from "../ComponentSystem";
export class BulletModifierComponent extends Component {
    getDamageMultiplier(): number {
        return 1.5;
    }
}