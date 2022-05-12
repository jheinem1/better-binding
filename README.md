# Better Binding

A better binding for Roact!

```typescript
rightCardProps: CardProps = {
    visible: new BetterBinding<boolean>(false),
    position: new BetterBinding(new UDim2()),
    title: new BetterBinding(""),
    description: new BetterBinding(""),
    image: new BetterBinding<number | undefined>(undefined),
    groupID: new BetterBinding<number | undefined>(undefined),
    focusedMotor: new SingleMotor(0),
};
```

```typescript
interface CardComponentProps {
    visible: Roact.Binding<boolean>;
    position: Roact.Binding<UDim2>;
    title: Roact.Binding<string>;
    description: Roact.Binding<string>;
    image: Roact.Binding<number | undefined>;
    groupID: Roact.Binding<number | undefined>;
    focusedMotor: SingleMotor;
}
```

Instead of returning an annoying tuple with a separate function to set the value, you can just use the `BetterBinding`. The `BetterBinding` class implements `Roact.Binding`, so you can use it just like a normal binding with Roact components!

This was pulled from one of my old projects, and it's pretty useful if you don't like dealing with regular bindings.