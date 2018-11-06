import React from "react";

export default class Target extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.context = this.canvasRef.current.getContext("2d");
    this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
    this.renderTargetAndArrows();
  }

  componentDidMount() {
    this.context = this.canvasRef.current.getContext("2d");
    this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
    this.context.resetTransform();
    this.renderTargetAndArrows();
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        width={this.canvasSizePx}
        height={this.canvasSizePx}
        onMouseEnter={() => {
          this.context.scale(this.maxZoom, this.maxZoom);
          this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
          this.renderTargetAndArrows();
        }}
        onMouseOut={() => {
          this.context.resetTransform();
          this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
          this.renderTargetAndArrows();
        }}
        onMouseUp={event => this.handleMouseUp(event)}
        onMouseMove={throttle(event => this.handleMouseMove(event), 16)}
        onTouchMove={throttle(event => this.handleTouchMove(event), 16)}
        onTouchEnd={event => this.handleTouchEnd(event)}
        onTouchStart={event => {
          this.context.resetTransform();
          this.context.scale(this.maxZoom, this.maxZoom);
          this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
          const pos = this.getTouchPos(this.canvasRef.current, event);
          this.context.translate(-pos.x / 2, -pos.y / 2);
          this.renderTargetAndArrows();
        }}
      />
    );
  }

  targetScoreRange = [
    {
      arrowColor: "black",
      color: "#ffc107",
      maxRadius: 7,
      points: 10,
      strokeColor: "black",
      strokeWidth: 0.5
    },
    {
      arrowColor: "black",
      color: "#ffc107",
      maxRadius: 15,
      points: 10,
      strokeColor: "black"
    },
    {
      arrowColor: "black",
      color: "#ffc107",
      maxRadius: 30,
      points: 9,
      strokeColor: "black"
    },
    {
      arrowColor: "black",
      color: "#dc3545",
      maxRadius: 45,
      points: 8,
      strokeColor: "black"
    },
    {
      arrowColor: "black",
      color: "#dc3545",
      maxRadius: 60,
      points: 7,
      strokeColor: "black"
    },
    {
      arrowColor: "black",
      color: "#17a2b8",
      maxRadius: 75,
      points: 6,
      strokeColor: "black"
    },
    {
      arrowColor: "black",
      color: "#17a2b8",
      maxRadius: 90,
      points: 5,
      strokeColor: "black"
    },
    {
      arrowColor: "white",
      color: "black",
      maxRadius: 105,
      points: 4,
      strokeColor: "white"
    },
    {
      arrowColor: "white",
      color: "black",
      maxRadius: 120,
      points: 3,
      strokeColor: "black"
    },
    {
      arrowColor: "black",
      color: "white",
      maxRadius: 135,
      points: 2,
      strokeColor: "black"
    },
    {
      arrowColor: "black",
      color: "white",
      maxRadius: 150,
      points: 1,
      strokeColor: "black"
    }
  ].reverse();
  context;
  touchPos;
  maxZoom = 2;
  canvasSizePx = 300;
  touchMove = false;
  centerPoint = { x: this.canvasSizePx / 2, y: this.canvasSizePx / 2 };
  touchCursorOffset = this.canvasSizePx / 3;

  getTargetScoreByPosition(position) {
    let distanceFromCenter = Math.trunc(
      Math.sqrt(
        Math.pow(this.centerPoint.x - position.x, 2) +
          Math.pow(this.centerPoint.y - position.y, 2)
      )
    );
    for (let i = this.targetScoreRange.length - 1; i >= 0; i--) {
      const target = this.targetScoreRange[i];
      if (distanceFromCenter <= target.maxRadius) {
        return target;
      }
    }
    return null;
  }

  drawArrow(position, fill) {
    let score;
    if (fill) {
      this.context.fillStyle = fill;
    } else {
      score = this.getTargetScoreByPosition(position);
      this.context.fillStyle = score ? score.arrowColor : "";
    }
    this.context.beginPath();
    this.context.arc(position.x, position.y, 2, 0, 2 * Math.PI);
    this.context.fill();
  }

  handleMouseUp(e) {
    const pos = this.getMousePos(this.canvasRef.current, e);
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
    this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
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

    const score = this.getTargetScoreByPosition(normalCoordinates);
    return {
      point: normalCoordinates,
      score: score ? score.points : 0
    };
  }

  renderTargetAndArrows() {
    this.targetScoreRange.forEach(score => {
      this.context.fillStyle = score.color;
      this.context.strokeStyle = score.strokeColor;
      this.context.lineWidth = score.strokeWidth || 1.0;
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
    // bulls eye
    this.context.fillStyle = "black";
    this.context.beginPath();
    this.context.arc(this.centerPoint.x, this.centerPoint.y, 1, 0, 2 * Math.PI);
    this.context.fill();

    this.props.arrows.forEach(arrow => this.drawArrow(arrow.coordinates));
  }

  // show zoomed canvas and pan it with cursor
  handleMouseMove(event) {
    this.context.resetTransform();
    this.context.scale(this.maxZoom, this.maxZoom);
    this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
    const pos = this.getMousePos(this.canvasRef.current, event);
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
    this.context.clearRect(0, 0, this.canvasSizePx, this.canvasSizePx);
    const pos = this.getTouchPos(this.canvasRef.current, e);
    this.touchPos = { x: pos.x, y: pos.y - this.touchCursorOffset };
    this.context.translate(-this.touchPos.x / 2, -this.touchPos.y / 2);
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
