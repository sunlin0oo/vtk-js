import * as macro from '../../../macro';
import ViewNode from '../../SceneGraph/ViewNode';

// ----------------------------------------------------------------------------
// vtkWebGLPolyDataMapper methods
// ----------------------------------------------------------------------------

export function webGLRenderer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWebGLRenderer');

  // Builds myself.
  publicAPI.build = (prepass) => {
    if (prepass) {
      if (!model.renderable) {
        return;
      }

      // make sure we have a camera
      // if (!model.renderable.isActiveCameraCreated()) {
      //   model.renderable.resetCamera();
      // }

      publicAPI.prepareNodes();
      publicAPI.addMissingNodes(model.renderable.getActors());
      publicAPI.removeUnusedNodes();
    }
  };


  // Renders myself
  publicAPI.render = (prepass) => {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkWebGLRenderWindow').getContext();
      publicAPI.clear();
    } else {
      // else
    }
  };

  publicAPI.clear = () => {
    let clearMask = 0;
    const gl = model.context;

    if (! model.renderable.getTransparent()) {
      const background = model.renderable.getBackground();
      model.context.clearColor(background[0], background[1], background[2], 1.0);
      clearMask |= gl.COLOR_BUFFER_BIT;
    }

    if (!model.renderable.getPreserveDepthBuffer()) {
      gl.clearDepth(1.0);
      clearMask |= gl.DEPTH_BUFFER_BIT;
      gl.depthMask(true);
    }

    gl.colorMask(true, true, true, true);
    gl.clear(clearMask);

    gl.enable(gl.DEPTH_TEST);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  context: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  ViewNode.extend(publicAPI, model);

  // Build VTK API
  macro.get(publicAPI, model, ['shaderCache']);

  macro.setGet(publicAPI, model, [
    'context',
  ]);

  // Object methods
  webGLRenderer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
