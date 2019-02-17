import { IPreset } from "../presets/preset";

/**
 * @hidden
 */
export class Presets2<T> {
    private presets: IPreset<T>[] = [];

    public add(preset: IPreset<T>): void {
        this.presets.unshift(preset);
    }

    public get(): IPreset<T>[] {
        return [...this.presets];
    }
}
