import React from "react";

export default class Target extends React.Component {
  setCanvasRef = element => {
    this.canvas = element;
    this.initCanvas();
  };

  componentDidUpdate() {
    // context changes with props referesh
    this.context = this.canvas.getContext("2d");
  }

  render() {
    return <canvas ref={this.setCanvasRef} width="300" height="300" />;
  }

  targetScoreRange = [
    {
      color: "#ffc107",
      minRadius: 0,
      maxRadius: 15,
      invert: false,
      points: 10
    },
    {
      color: "#ffc107",
      minRadius: 16,
      maxRadius: 30,
      invert: false,
      points: 9
    },
    {
      color: "#dc3545",
      minRadius: 31,
      maxRadius: 45,
      invert: false,
      points: 8
    },
    {
      color: "#dc3545",
      minRadius: 46,
      maxRadius: 60,
      invert: false,
      points: 7
    },
    {
      color: "#17a2b8",
      minRadius: 61,
      maxRadius: 75,
      invert: false,
      points: 6
    },
    {
      color: "#17a2b8",
      minRadius: 76,
      maxRadius: 90,
      invert: false,
      points: 5
    },
    {
      color: "black",
      minRadius: 91,
      maxRadius: 105,
      invert: true,
      points: 4
    },
    {
      color: "black",
      minRadius: 106,
      maxRadius: 120,
      invert: true,
      points: 3
    },
    {
      color: "white",
      minRadius: 121,
      maxRadius: 135,
      invert: false,
      points: 2
    },
    {
      color: "white",
      minRadius: 136,
      maxRadius: 150,
      invert: false,
      points: 1
    }
  ].reverse();
  context;
  touchPos;
  maxZoom = 2;
  canvasSizePx = 300;
  touchMove = false;
  centerPoint = { x: this.canvasSizePx / 2, y: this.canvasSizePx / 2 };
  touchCursorOffset = this.canvasSizePx / 3;

  initCanvas() {
    this.canvas.width = this.canvasSizePx;
    this.canvas.height = this.canvasSizePx;
    this.context = this.canvas.getContext("2d");
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.resetTransform();
    this.renderTargetAndArrows();

    //redraw canvas at default zoom
    this.canvas.addEventListener(
      "mouseout",
      () => {
        this.context.resetTransform();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderTargetAndArrows();
      },
      false
    );

    this.canvas.addEventListener(
      "mouseenter",
      () => {
        this.context.scale(this.maxZoom, this.maxZoom);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderTargetAndArrows();
      },
      false
    );

    // show zoomed canvas
    this.canvas.addEventListener(
      "mousemove",
      throttle(event => this.handleMouseMove(event), 16),
      false
    );

    // draw arrow
    this.canvas.addEventListener(
      "mouseup",
      event => this.handleMouseUp(event),
      false
    );

    this.canvas.addEventListener(
      "touchstart",
      (event) => {
        this.context.resetTransform();
        this.context.scale(this.maxZoom, this.maxZoom);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const pos = this.getTouchPos(this.canvas, event);
        this.context.translate(-pos.x / 2, -pos.y / 2);
        this.renderTargetAndArrows();
      },
      false
    );

    this.canvas.addEventListener(
      "touchmove",
      throttle(event => this.handleTouchMove(event), 16),
      true
    );

    this.canvas.addEventListener(
      "touchend",
      event => this.handleTouchEnd(event),
      false
    );
  }

  calculateScore(position) {
    let distanceFromCenter = Math.trunc(
      Math.sqrt(
        Math.pow(this.centerPoint.x - position.x, 2) +
          Math.pow(this.centerPoint.y - position.y, 2)
      )
    );

    let score = this.targetScoreRange.find(
      item =>
        distanceFromCenter <= item.maxRadius &&
        distanceFromCenter >= item.minRadius
    );

    return score
      ? { score: score.points, isInverted: score.invert }
      : { score: 0, isInverted: false };
  }

  drawArrow(position, fill) {
    this.context.fillStyle = fill;
    this.context.beginPath();
    this.context.arc(position.x, position.y, 2, 0, 2 * Math.PI);
    this.context.fill();
  }

  handleMouseUp(e) {
    const pos = this.getMousePos(this.canvas, e);
    const newArrow = this.generateArrowOnTarget(pos, false);
    this.props.createArrow(newArrow);
  }

  handleTouchEnd(event) {
    event.preventDefault();
    if (this.touchMove) {
      // don't trigger shots on ghost clicks, touch devices must pan a bit first
      const newArrow = this.generateArrowOnTarget(this.touchPos, true);
      this.props.createArrow(newArrow);
    }
    this.touchMove = false;
    this.touchPos = null;
    this.context.resetTransform();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderTargetAndArrows();
  }

  generateArrowOnTarget(zoomedCoordinates, isTouch) {
    // all arrows are added in zoomed target, so we adjust position
    const normalCoordinates = isTouch
      ? {
          x: (zoomedCoordinates.x - zoomedCoordinates.x / this.maxZoom) * 2,
          y:
            (zoomedCoordinates.y -
              this.touchCursorOffset / this.maxZoom -
              zoomedCoordinates.y / this.maxZoom +
              this.touchCursorOffset / this.maxZoom) *
            2
        }
      : {
          x: (zoomedCoordinates.x - zoomedCoordinates.x / this.maxZoom) * 2,
          y: (zoomedCoordinates.y - zoomedCoordinates.y / this.maxZoom) * 2
        };

    const score = this.calculateScore(normalCoordinates);
    return {
      point: normalCoordinates,
      isInverted: score.isInverted,
      score: score.score
    };
  }

  renderTargetAndArrows() {
    this.targetScoreRange.forEach(score => {
      this.context.fillStyle = score.color;
      this.context.strokeStyle = "black"; // TODO make parameter
      this.context.beginPath();
      this.context.arc(
        this.centerPoint.x,
        this.centerPoint.y,
        score.maxRadius,
        0,
        2 * Math.PI,
        false
      );
      this.context.fill();
      this.context.stroke();
    });
    this.props.arrows.forEach(arrow =>
      this.drawArrow(
        arrow.coordinates,
        arrow.isInverted ? "#FFFFFF" : "#000000"
      )
    );
  }

  // show zoomed canvas and pan it with cursor
  handleMouseMove(event) {
    this.context.resetTransform();
    this.context.scale(this.maxZoom, this.maxZoom);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const pos = this.getMousePos(this.canvas, event);
    this.context.translate(-pos.x / 2, -pos.y / 2);
    this.renderTargetAndArrows();
  }

  // show zoomed canvas on mobile
  handleTouchMove(e) {
    // this is to prevent scrolling on iOS
    e.preventDefault();
    // Ignore multi touch events
    if (e.touches.length > 1) {
      return;
    }
    this.touchMove = true;
    this.context.resetTransform();
    this.context.scale(this.maxZoom, this.maxZoom);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const pos = this.getTouchPos(this.canvas, e);
    this.touchPos = {x: pos.x, y: pos.y - this.touchCursorOffset};
    this.context.translate(-this.touchPos.x / 2, -this.touchPos.y / 2 );
    this.renderTargetAndArrows();
    // draw crosshair for touch input
    this.drawArrow(this.touchPos, "#39ff14");
  }

  // get position of mouse cursor
  getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  // get position for touch event
  getTouchPos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };
  }
}

function throttle(cb, delay) {
  let timesUp = true;
  return function(event) {
    if (!timesUp) return;
    setTimeout(function() {
      timesUp = true;
    }, delay);

    timesUp = false;
    cb(event);
  };
}
