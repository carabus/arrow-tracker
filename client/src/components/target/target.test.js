import React from "react";
import { mount } from "enzyme";

import Target from "./target";

function mockCanvas(window) {
  window.HTMLCanvasElement.prototype.getContext = function() {
    return {
      fillRect: function() {},
      clearRect: function() {},
      getImageData: function(x, y, w, h) {
        return {
          data: new Array(w * h * 4)
        };
      },
      putImageData: function() {},
      createImageData: function() {
        return [];
      },
      setTransform: function() {},
      resetTransform: function() {},
      drawImage: function() {},
      save: function() {},
      fillText: function() {},
      restore: function() {},
      beginPath: function() {},
      moveTo: function() {},
      lineTo: function() {},
      closePath: function() {},
      stroke: function() {},
      translate: function() {},
      scale: function() {},
      rotate: function() {},
      arc: function() {},
      fill: function() {},
      measureText: function() {
        return { width: 0 };
      },
      transform: function() {},
      rect: function() {},
      clip: function() {}
    };
  };

  window.HTMLCanvasElement.prototype.toDataURL = function() {
    return "";
  };
}

describe("<Target/>", () => {
  beforeEach(() => {
    const window = document.defaultView;
    mockCanvas(window);
  });

  const arrows = [{ coordinates: { x: 1, y: 1 }, score: 8 }];
  const createArrow = jest.fn();

  it("Renders without crashing", () => {
    mount(<Target arrows={arrows} createArrow={createArrow} />);
  });
});
