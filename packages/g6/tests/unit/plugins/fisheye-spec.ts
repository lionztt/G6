import { Graph } from '../../../src/index';

const container = document.createElement('div');
document.querySelector('body').appendChild(container);

const createGraph = (plugins) => {
  return new Graph({
    container,
    width: 500,
    height: 500,
    type: 'graph',
    data: {
      nodes: [
        { id: 'node1', data: { x: 100, y: 100 } },
        { id: 'node2', data: { x: 200, y: 200 } },
      ],
      edges: [{ id: 'edge1', source: 'node1', target: 'node2', data: {} }],
    },
    node: {
      labelShape: {
        text: {
          fields: ['id'],
          formatter: (model) => {
            return model.id;
          },
        },
      },
    },
    modes: {
      default: ['brush-select'],
    },
    plugins,
  });
};

describe('fisheye-plugin', () => {
  it('fisheye with default config', (done) => {
    const graph = createGraph(['fisheye']);
    graph.on('afterlayout', (e) => {
      const fisheyeDiv = document.getElementsByClassName(
        'g6-component-fisheye',
      )?.[0];
      expect(fisheyeDiv).not.toBe(undefined);

      graph.emit('pointermove', { client: { x: 100, y: 100 } });
      const node0 = graph.getAllNodesData()[0];
      const node1 = graph.getAllNodesData()[1];

      expect(node0.data.x).toEqual(100);
      expect(node0.data.y).toEqual(100);
      expect(node1.data.x).toEqual(246.44660940672625);
      expect(node1.data.y).toEqual(246.44660940672625);

      graph.emit('pointermove', { client: { x: 200, y: 200 } });
      expect(node0.data.x).toEqual(53.55339059327375);
      expect(node0.data.y).toEqual(53.55339059327375);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      const { plugin: fisheyePlugin } =
        graph.pluginController.pluginMap.get('fisheye1');
      fisheyePlugin.clear();
      expect(node0.data.x).toEqual(100);
      expect(node0.data.y).toEqual(100);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      graph.destroy();
      done();
    });
  });

  it('fisheye with click and wheel to adjust r and drag to adjust d', (done) => {
    const fisheye = {
      key: 'fisheye1',
      type: 'fisheye',
      trigger: 'click',
      scaleRBy: 'wheel',
      scaleDBy: 'drag',
    };
    const graph = createGraph([fisheye]);
    graph.on('afterlayout', (e) => {
      graph.emit('click', { client: { x: 100, y: 100 } });
      const node0 = graph.getAllNodesData()[0];
      const node1 = graph.getAllNodesData()[1];

      expect(node0.data.x).toEqual(100);
      expect(node0.data.y).toEqual(100);
      expect(node1.data.x).toEqual(246.44660940672625);
      expect(node1.data.y).toEqual(246.44660940672625);

      graph.emit('click', { client: { x: 200, y: 200 } });
      expect(node0.data.x).toEqual(53.55339059327375);
      expect(node0.data.y).toEqual(53.55339059327375);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      // wheel to adjust the radius

      const { plugin: fisheyePlugin } =
        graph.pluginController.pluginMap.get('fisheye1');
      expect(fisheye.options.r).toEqual(300);

      graph.emit('wheel', { canvas: { x: 200, y: 200 }, deltaY: 120 });
      expect(fisheyePlugin.options.r).toEqual(315.7894736842105);

      graph.emit('wheel', { canvas: { x: 200, y: 200 }, deltaY: -120 });
      expect(fisheyePlugin.options.r).toEqual(300);

      // drag to adjust the magnify coefficient
      expect(fisheyePlugin.options.d).toEqual(1.5);
      graph.emit('pointerdown', {
        client: { x: 200, y: 200 },
      });
      graph.emit('pointermove', { client: { x: 250, y: 250 } });
      graph.emit('pointerup', {
        client: { x: 250, y: 250 },
      });
      expect(fisheyePlugin.options.d).toEqual(1.6);
      expect(node0.data.x).toEqual(51.78827985608831);
      expect(node0.data.y).toEqual(51.78827985608831);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      fisheyePlugin.clear();
      expect(node0.data.x).toEqual(100);
      expect(node0.data.y).toEqual(100);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      graph.destroy();
      done();
    });
  });

  it('fisheye with click and drag to adjust r and wheel to adjust d', (done) => {
    const fisheye = {
      key: 'fisheye1',
      type: 'fisheye',
      trigger: 'click',
      scaleRBy: 'drag',
      scaleDBy: 'wheel',
    };
    const graph = createGraph([fisheye]);
    graph.on('afterlayout', (e) => {
      graph.emit('click', { client: { x: 100, y: 100 } });
      const node0 = graph.getAllNodesData()[0];
      const node1 = graph.getAllNodesData()[1];

      expect(node0.data.x).toEqual(100);
      expect(node0.data.y).toEqual(100);
      expect(node1.data.x).toEqual(246.44660940672625);
      expect(node1.data.y).toEqual(246.44660940672625);

      graph.emit('click', { client: { x: 200, y: 200 } });
      expect(node0.data.x).toEqual(53.55339059327375);
      expect(node0.data.y).toEqual(53.55339059327375);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      // drag to adjust the radius
      const { plugin: fisheyePlugin } =
        graph.pluginController.pluginMap.get('fisheye1');
      expect(fisheyePlugin.options.r).toEqual(300);
      graph.emit('pointerdown', {
        client: { x: 200, y: 200 },
      });
      graph.emit('pointermove', { client: { x: 250, y: 250 } });
      graph.emit('pointerup', {
        client: { x: 250, y: 250 },
      });
      expect(fisheyePlugin.options.r).toEqual(315.7894736842105);

      // wheel to adjust the magnify coefficient
      expect(fisheyePlugin.options.d).toEqual(1.5);
      graph.emit('wheel', { canvas: { x: 200, y: 200 }, deltaY: 120 });
      expect(fisheyePlugin.options.d).toEqual(1.6);

      graph.emit('wheel', { canvas: { x: 200, y: 200 }, deltaY: -120 });
      expect(fisheyePlugin.options.d).toEqual(1.5);
      expect(node0.data.x).toEqual(50.45623787117094);
      expect(node0.data.y).toEqual(50.45623787117094);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      fisheyePlugin.clear();
      expect(node0.data.x).toEqual(100);
      expect(node0.data.y).toEqual(100);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      graph.destroy();
      done();
    });
  });

  it('fisheye with drag, updateParams', (done) => {
    const fisheye = {
      key: 'fisheye1',
      type: 'fisheye',
      trigger: 'drag',
    };
    const graph = createGraph([fisheye]);
    graph.on('afterlayout', (e) => {
      graph.emit('click', { client: { x: 100, y: 100 } });
      const node0 = graph.getAllNodesData()[0];
      const node1 = graph.getAllNodesData()[1];
      graph.emit('pointerdown', {
        client: { x: 100, y: 100 },
      });
      graph.emit('pointermove', { client: { x: 200, y: 200 } });
      expect(node0.data.x).toEqual(53.55339059327375);
      expect(node0.data.y).toEqual(53.55339059327375);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      const { plugin: fisheyePlugin } =
        graph.pluginController.pluginMap.get('fisheye1');
      fisheyePlugin.updateParams({
        d: 3,
        r: 100,
      });
      expect(fisheyePlugin.options.r).toEqual(100);
      expect(fisheyePlugin.options.r2).toEqual(10000);
      expect(fisheyePlugin.options.d).toEqual(3);

      fisheyePlugin.clear();
      expect(node0.data.x).toEqual(100);
      expect(node0.data.y).toEqual(100);
      expect(node1.data.x).toEqual(200);
      expect(node1.data.y).toEqual(200);

      graph.destroy();
      done();
    });
  });
});
