import Roact, { Binding } from "@rbxts/roact";

export class BetterBinding<T> implements Binding<T> {
    setter: (value: T) => void;
    binding: Binding<T>;
    onChange = new Array<(value: T) => void>();
    constructor(protected value: T) {
        [this.binding, this.setter] = Roact.createBinding<T>(value);
        // the following spaghetti code is brought to you by roact's type handing
        let bindingType: unknown;
        let bindingImpl: unknown;
        for (const [k, _] of this.binding as unknown as Map<unknown, unknown>) {
            switch (tostring(k)) {
                case "RoactType":
                    bindingType = k;
                    break;
                case "BindingImpl":
                    bindingImpl = k;
                    break;
            }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this[bindingType] = this.binding[bindingType];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this[bindingImpl] = this.binding[bindingImpl];
    }
    setValue(value: T): void {
        if (value !== this.value) this.setter(value);
        this.updateValue();
        this.onChange.forEach((callback) => callback(value));
        this.onChange.clear();
    }
    getValue(): T {
        this.updateValue();
        return this.value;
    }
    /** updates the cached value of the binding (should not need to be called unless binding is modified directly) */
    updateValue(): void {
        this.value = this.binding.getValue();
    }
    map<U>(predicate: (value: T) => U): Roact.Binding<U> {
        return this.binding.map(predicate);
    }
    /** Returns a promise that is resolved when the binding is changed. WARNING: using timeout may add some overhead */
    async changed(timeout?: number): Promise<T> {
        return new Promise((resolve: (value: T) => void, reject, onCancel) => {
            const callback = (value: T) => resolve(value);
            let active = true;
            onCancel(() => {
                active = false;
                const index = this.onChange.indexOf(callback);
                if (index !== -1) this.onChange.remove(index);
            });
            this.onChange.push(callback);
            if (timeout !== undefined)
                task.delay(timeout, () => {
                    if (active) {
                        const index = this.onChange.indexOf(callback);
                        if (index !== -1) {
                            this.onChange.remove(index);
                            reject();
                        }
                    }
                });
        });
    }
}
