'use strict';

let test = function test (Serpentity) {

  /* eslint no-console: 0 */

  /////////////////
  // Load the stuff
  /////////////////
  console.log('\n## Loading');
  console.log('Serpentity: ' + (typeof Serpentity !== 'undefined' ? 'LOAD OK' : 'FAIL'));
  console.log('Serpentity.Entity: ' + (typeof Serpentity !== 'undefined' && Serpentity.Entity ? 'LOAD OK' : 'FAIL'));
  console.log('Serpentity.Component: ' + (typeof Serpentity !== 'undefined' && Serpentity.Component ? 'LOAD OK' : 'FAIL'));
  console.log('Serpentity.System: ' + (typeof Serpentity !== 'undefined' && Serpentity.System ? 'LOAD OK' : 'FAIL'));
  console.log('Serpentity.Node: ' + (typeof Serpentity !== 'undefined' && Serpentity.Node ? 'LOAD OK' : 'FAIL'));
  console.log('Serpentity.NodeCollection: ' + (typeof Serpentity !== 'undefined' && Serpentity.NodeCollection ? 'LOAD OK' : 'FAIL'));

  //////////////////////
  // Create test classes
  //////////////////////
  console.log('\n## Creating Test Classes');
  let TestSystem = class TestSystem extends Serpentity.System {
    added (engine) {
      this.testNodes = engine.getNodes(TestNode);
      console.log('Engine is serpentity: ' + (engine instanceof Serpentity ? 'OK' : 'FAIL'));
      console.log('System added callback: EXEC OK');
    }

    removed (engine) {
      this.testNodes = null;
      console.log('Engine is serpentity: ' + (engine instanceof Serpentity ? 'OK' : 'FAIL'));
      console.log('System removed callback: EXEC OK');
    }

    update (dt) {
      this.testNodes.forEach(function (node) {
        console.log('Running Node: ' + (node.test.testMessage === 'test' ? 'SYSTEM OK' : 'FAIL'));
      });
      console.log('dt is number: ' + (typeof dt === 'number' ? 'OK' : 'FAIL'));
      console.log('System update callback: EXEC OK');
    }
  };
  let testSystem = new TestSystem();

  let LowProTestSystem = class LowProTestSystem extends Serpentity.System {
    added (engine) {
      this.testNodes = engine.getNodes(TestNode);
      console.log('Engine is serpentity: ' + (engine instanceof Serpentity ? 'OK' : 'FAIL'));
      console.log('System added callback: EXEC OK');
    }

    removed (engine) {
      this.testNodes = null;
      console.log('Engine is serpentity: ' + (engine instanceof Serpentity ? 'OK' : 'FAIL'));
      console.log('System removed callback: EXEC OK');
    }

    update (dt) {
      this.testNodes.forEach(function (node) {
        console.log('Running Low Priority Node: ' + (node.test.testMessage === 'test' ? 'SYSTEM OK' : 'FAIL'));
      });
      console.log('dt is number: ' + (typeof dt === 'number' ? 'OK' : 'FAIL'));
      console.log('System update callback: EXEC OK');
    }
  };
  let lowProTestSystem = new LowProTestSystem();
  console.log('LowProTestSystem: CREATE OK');

  let MidProTestSystem = class MidProTestSystem extends Serpentity.System {
    added (engine) {
      this.testNodes = engine.getNodes(TestNode);
      console.log('Engine is serpentity: ' + (engine instanceof Serpentity ? 'OK' : 'FAIL'));
      console.log('System added callback: EXEC OK');
    }

    removed (engine) {
      this.testNodes = null;
      console.log('Engine is serpentity: ' + (engine instanceof Serpentity ? 'OK' : 'FAIL'));
      console.log('System removed callback: EXEC OK');
    }

    update (dt) {
      this.testNodes.forEach(function (node) {
        console.log('Running Mid Priority Node: ' + (node.test.testMessage === 'test' ? 'SYSTEM OK' : 'FAIL'));
      });
      console.log('dt is number: ' + (typeof dt === 'number' ? 'OK' : 'FAIL'));
      console.log('System update callback: EXEC OK');
    }
  };
  var midProTestSystem = new MidProTestSystem();
  console.log('MidProTestSystem: CREATE OK');


  let TestComponent = class TestComponent extends Serpentity.Component {
    constructor (config) {
      super(config);

      this.testMessage = this.testMessage || 'test';
    }
  };
  console.log('TestComponent: CREATE OK');

  let TestNode = class TestNode extends Serpentity.Node {};
  TestNode.types = {
    test : TestComponent
  };
  console.log('TestNode: CREATE OK');

  console.log('\n## Adding system to the engine');

  let engine = new Serpentity();
  console.log('engine: CREATE OK');

  engine.addSystem(testSystem, 0);

  console.log('\n## Running update without any entities');
  engine.update(10);

  console.log('\n## Adding system to the engine and updating');
  let entity = new Serpentity.Entity();
  entity.addComponent(new TestComponent());
  engine.addEntity(entity);
  engine.update(10);

  console.log('\n## Adding Low Priority System');
  engine.addSystem(lowProTestSystem, 10);
  engine.update(10);

  console.log('\n## Adding Mid Priority System');
  engine.addSystem(midProTestSystem, 5);
  engine.update(10);

  console.log('\n## Removing the system and readding');
  engine.removeSystem(testSystem);
  engine.update(10);
  engine.addSystem(testSystem, 0);
  engine.update(10);

  console.log('\n## Adding a second entity');
  entity = new Serpentity.Entity();
  entity.addComponent(new TestComponent());
  engine.addEntity(entity);
  engine.update(10);

  console.log('\n## Removing  entity');
  engine.removeEntity(entity);
  engine.update(10);

  console.log('\n## Removing  system');
  engine.removeSystem(testSystem);
  engine.update(10);

};

if (typeof require === 'function') {
  let Serpentity = require('serpentity');
  test(Serpentity);
} else {
  window.addEventListener('load', function () {
    test(window.Serpentity);
  });
}

