'use strict';

const Code = require('code');   // assertion library
const Lab = require('lab');
const Serpentity = require('..');

const internals = {
  system: class TestSystem extends Serpentity.System {
    added(engine) {

      this.testNodes = engine.getNodes(internals.node);
      this.addedCalled = true;
      this.addedEngine = engine;
    }

    removed(engine) {

      this.testNodes = null;
      this.removedCalled = true;
      this.removedEngine = engine;
    }

    update(dt) {

      this.updateCalled = Date.now();
      this.updateDt = dt;

      for (const node of this.testNodes) {
        node.test.called = true;
        node.entity.called = true;
      }

      while (Date.now() === this.updateCalled) { /* pass some time */ }
    }
  },
  component: class TestComponent extends Serpentity.Component {
    constructor(config) {

      super(config);

      this.called = false;
    }
  },
  node: class TestNode extends Serpentity.Node {},
  delta: 10
};

// adds a component to the node
internals.node.types = {
  test: internals.component
};

const lab = exports.lab = Lab.script();

lab.experiment('loading', () => {

  lab.test('Serpentity should be exported', (done) => {

    Code.expect(typeof Serpentity).to.not.be.undefined();
    done();
  });

  lab.test('Serpentity should include the Entity class', (done) => {

    Code.expect(typeof Serpentity.Entity).to.not.be.undefined();
    done();
  });

  lab.test('Serpentity should include the Component class', (done) => {

    Code.expect(typeof Serpentity.Component).to.not.be.undefined();
    done();
  });

  lab.test('Serpentity should include the System class', (done) => {

    Code.expect(typeof Serpentity.System).to.not.be.undefined();
    done();
  });

  lab.test('Serpentity should include the Node class', (done) => {

    Code.expect(typeof Serpentity.Node).to.not.be.undefined();
    done();
  });

  lab.test('Serpentity should include the NodeCollection class', (done) => {

    Code.expect(typeof Serpentity.NodeCollection).to.not.be.undefined();
    done();
  });
});

lab.experiment('Engine Tests', () => {

  lab.beforeEach((done) => {

    this.engine = new Serpentity();

    this.regularSystem = new internals.system();
    this.highPrioritySystem = new internals.system();
    this.lowPrioritySystem = new internals.system();

    this.firstEntity = new Serpentity.Entity();
    this.firstEntity.addComponent(new internals.component());
    this.secondEntity = new Serpentity.Entity();
    this.secondEntity.addComponent(new internals.component());
    this.emptyEntity = new Serpentity.Entity();

    // Add entity before the systems
    this.engine.addEntity(this.firstEntity);

    this.engine.addSystem(this.regularSystem, 100);
    this.engine.addSystem(this.highPrioritySystem, 0);
    this.engine.addSystem(this.lowPrioritySystem, 1000);

    // Add entity after the systems
    this.engine.addEntity(this.secondEntity);
    this.engine.addEntity(this.emptyEntity);

    done();
  });

  lab.test('Engine should call added callback on added systems', (done) => {

    // Ensure the added callback is being called
    Code.expect(this.regularSystem.addedCalled).to.be.true();
    Code.expect(this.highPrioritySystem.addedCalled).to.be.true();
    Code.expect(this.lowPrioritySystem.addedCalled).to.be.true();

    done();
  });

  lab.test('Engine should send the engine instance in added callback', (done) => {

    // Ensure the added callback is sending the engine
    Code.expect(this.regularSystem.addedEngine instanceof Serpentity).to.be.true();
    Code.expect(this.highPrioritySystem.addedEngine instanceof Serpentity).to.be.true();
    Code.expect(this.lowPrioritySystem.addedEngine instanceof Serpentity).to.be.true();

    done();
  });

  lab.test('Engine should not add duplicate systems', (done) => {

    const originalSystemsLength = this.engine.systems.length;
    const added = this.engine.addSystem(this.regularSystem, 0);
    const newSystemsLength = this.engine.systems.length;

    // Ensure we don't add the same system twice
    Code.expect(added).to.be.false();
    Code.expect(originalSystemsLength).to.be.equal(newSystemsLength);

    done();
  });

  lab.test('Engine should call update callback on added systems', (done) => {

    this.engine.update(internals.delta);

    // Ensure update function called
    Code.expect(!!this.regularSystem.updateCalled).to.be.true();
    Code.expect(!!this.highPrioritySystem.updateCalled).to.be.true();
    Code.expect(!!this.lowPrioritySystem.updateCalled).to.be.true();

    done();
  });

  lab.test('Engine should call update callback in the order of priorities', (done) => {

    this.engine.update(internals.delta);

    // Ensure order of priorities
    Code.expect(this.regularSystem.updateCalled).to.be.lessThan(this.lowPrioritySystem.updateCalled);
    Code.expect(this.regularSystem.updateCalled).to.be.greaterThan(this.highPrioritySystem.updateCalled);

    done();
  });

  lab.test('Engine should send the delta in the update callback', (done) => {

    this.engine.update(internals.delta);

    // Ensure delta is being sent
    Code.expect(this.regularSystem.updateDt).to.be.equal(internals.delta);
    Code.expect(this.highPrioritySystem.updateDt).to.be.equal(internals.delta);
    Code.expect(this.lowPrioritySystem.updateDt).to.be.equal(internals.delta);

    done();
  });

  lab.test('System remove callback', (done) => {

    const originalSystemLength = this.engine.systems.length;
    const originalRemoved = this.engine.removeSystem(this.lowPrioritySystem);
    const intermediateSystemLength = this.engine.systems.length;
    const finalRemoved = this.engine.removeSystem(this.lowPrioritySystem);
    const finalSystemLength = this.engine.systems.length;
    this.engine.update(internals.delta);

    // Check for return value 
    Code.expect(originalRemoved).to.be.true();
    Code.expect(finalRemoved).to.be.false();

    // Confirm that only removed if found by checking length of systems
    // array
    Code.expect(originalSystemLength).to.be.above(intermediateSystemLength);
    Code.expect(finalSystemLength).to.be.equal(intermediateSystemLength);

    // Ensure callback is sent
    Code.expect(!!this.regularSystem.removedCalled).to.be.false();
    Code.expect(!!this.highPrioritySystem.removedCalled).to.be.false();
    Code.expect(!!this.lowPrioritySystem.removedCalled).to.be.true();

    // Ensure update is no longer sent
    Code.expect(!!this.regularSystem.updateCalled).to.be.true();
    Code.expect(!!this.highPrioritySystem.updateCalled).to.be.true();
    Code.expect(!!this.lowPrioritySystem.updateCalled).to.be.false();

    done();
  });

  lab.test('Entity node selection', (done) => {

    this.engine.update(internals.delta);

    // Ensure component is called for each entity
    Code.expect(!!this.firstEntity._components[0].called).to.be.true();
    Code.expect(!!this.secondEntity._components[0].called).to.be.true();

    // Ensure entity not in node collection not called
    Code.expect(!!this.firstEntity.called).to.be.true();
    Code.expect(!!this.secondEntity.called).to.be.true();
    Code.expect(!!this.emptyEntity.called).to.be.false();

    done();
  });

  lab.test('Entity node removal', (done) => {

    this.engine.removeEntity(this.secondEntity);
    this.engine.update(internals.delta);

    Code.expect(!!this.firstEntity._components[0].called).to.be.true();
    Code.expect(!!this.secondEntity._components[0].called).to.be.false();

    Code.expect(!!this.firstEntity.called).to.be.true();
    Code.expect(!!this.secondEntity.called).to.be.false();
    Code.expect(!!this.emptyEntity.called).to.be.false();

    done();
  });

  lab.test('Entity should not add duplicate components', (done) => {
    const originalComponentsLength = this.secondEntity._components.length;
    const result = this.secondEntity.addComponent(new internals.component());
    const newComponentsLength = this.secondEntity._components.length;

    Code.expect(result).to.be.false();
    Code.expect(originalComponentsLength).to.be.equal(newComponentsLength);

    done();
  });

  lab.test('Entity should allow access to components by class', (done) => {
    const firstComponent = this.firstEntity.getComponent(internals.component);
    const emptyComponent = this.emptyEntity.getComponent(internals.component);

    Code.expect(firstComponent instanceof internals.component).to.be.true();
    Code.expect(emptyComponent).to.be.equal(undefined);

    done();
  });

  lab.test('Engine should not add duplicate entities', (done) => {
    const originalEntitiesLength = this.engine.entities.length;
    const added = this.engine.addEntity(this.firstEntity);
    const finalEntitiesLength = this.engine.entities.length;

    Code.expect(added).to.be.false();

    Code.expect(originalEntitiesLength).to.be.equal(finalEntitiesLength);
    done();
  });

  lab.test('Engine should remove entities', (done) => {

    const originalEntityLength = this.engine.entities.length;
    const originalRemoved = this.engine.removeEntity(this.firstEntity);
    const intermediateEntityLength = this.engine.entities.length;
    const finalRemoved = this.engine.removeEntity(this.firstEntity);
    const finalEntityLength = this.engine.entities.length;
    this.engine.update(internals.delta);

    // Check for return value 
    Code.expect(originalRemoved).to.be.true();
    Code.expect(finalRemoved).to.be.false();

    // Confirm that only removed if found by checking length of systems
    // array
    Code.expect(originalEntityLength).to.be.above(intermediateEntityLength);
    Code.expect(finalEntityLength).to.be.equal(intermediateEntityLength);

    // Ensure callback is sent
    Code.expect(!!this.firstEntity.called).to.be.false();
    Code.expect(!!this.secondEntity.called).to.be.true();

    done();
  });
});
