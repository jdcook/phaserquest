export default interface IPhysics {
    // let scene call init after being added to physics group, so that we can access the body (not available in constructor)
    initPhysics(): void;
}
