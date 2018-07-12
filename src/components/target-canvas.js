import React from "react";
import target from "../images/target.png";

export default class TargetCanvas extends React.Component {
  constructor(props) {
    super(props);
    console.log("CANVAS CONSTRUCTOR");
    this.myRef = React.createRef();
  }

  componentDidMount() {
    console.log("CANVAS DID MOUNT", this.props.arrows);
    this.initTarget();
  }

  componentDidUpdate() {
    console.log("CANVAS DID UPDATE", this.props.arrows);
    //initTarget(this.myRef.current, this.props.arrows, this.props.createArrow);
  }

  render() {
    console.log("CANVAS RENDER");
    return <canvas ref={this.myRef} width="300" height="300" />;
  }

  canvas = {};
  arrows = [];
  callback = this.props.createArrow;

  centerPoint = { x: 150, y: 150 };
  touchCursorOffset = 100;
  targetScoreRange = [
    {
      minRadius: 0,
      maxRadius: 15,
      invert: false,
      points: 10
    },
    {
      minRadius: 16,
      maxRadius: 30,
      invert: false,
      points: 9
    },
    {
      minRadius: 31,
      maxRadius: 45,
      invert: false,
      points: 8
    },
    {
      minRadius: 46,
      maxRadius: 60,
      invert: false,
      points: 7
    },
    {
      minRadius: 61,
      maxRadius: 75,
      invert: false,
      points: 6
    },
    {
      minRadius: 76,
      maxRadius: 90,
      invert: false,
      points: 5
    },
    {
      minRadius: 91,
      maxRadius: 105,
      invert: true,
      points: 4
    },
    {
      minRadius: 106,
      maxRadius: 120,
      invert: true,
      points: 3
    },
    {
      minRadius: 121,
      maxRadius: 135,
      invert: false,
      points: 2
    },
    {
      minRadius: 136,
      maxRadius: 150,
      invert: false,
      points: 1
    }
  ];
  cursorPos = {};
  context = {};
  pointsOnTarget = [];
  zoom = 0.5;
  zoomFactor;
  iw;
  ih;
  base_image;

  initTarget() {
    this.canvas = this.myRef.current;
    this.context = this.canvas.getContext("2d");
    this.makeBase();
  }
  /*
  calculateScore(position) {
      let distanceFromCenter = Math.trunc(
        Math.sqrt(
          Math.pow(centerPoint.x - position.x, 2) +
            Math.pow(centerPoint.y - position.y, 2)
        )
      );

      let score = targetScoreRange.find(
        item =>
          distanceFromCenter <= item.maxRadius &&
          distanceFromCenter >= item.minRadius
      );

      return score
        ? { score: score.points, isInverted: score.invert }
        : { score: 0, isInverted: false };
    }

    drawDot(position, fill) {
      context.fillStyle = fill;
      context.beginPath();
      context.arc(position.x, position.y, 2, 0, 2 * Math.PI);
      context.fill();
    }

    handleMouseUp(e) {
      const pos = getMousePos(canvas, e);
      const newArrow = generatePointOnTarget(pos, false);
      pointsOnTarget.push(newArrow);
      callback(newArrow);
      doCanvas();
    }

    handleTouchEnd(event) {
      const newArrow = generatePointOnTarget(cursorPos, true);
      pointsOnTarget.push(newArrow);
      callback(newArrow);
      doCanvas();
    }

    generatePointOnTarget(zoomedCoordinates, isTouch) {
      const normalCoordinates = isTouch
        ? {
            x: (zoomedCoordinates.x - zoomedCoordinates.x * zoom) * 2,
            y: (zoomedCoordinates.y - 25 - zoomedCoordinates.y * zoom + 25) * 2
          }
        : {
            x: (zoomedCoordinates.x - zoomedCoordinates.x * zoom) * 2,
            y: (zoomedCoordinates.y - zoomedCoordinates.y * zoom) * 2
          };

      const score = calculateScore(normalCoordinates);
      console.log(score);
      return {
        point: normalCoordinates,
        isInverted: score.isInverted,
        score: score.score
      };
    }
*/
  // re-draw target with all entered points
  doCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(
      this.base_image,
      0,
      0,
      this.iw * this.zoom,
      this.ih * this.zoom
    );
    /*
      arrows.forEach(arrow =>
        drawDot(
          arrow.arrowCoordinates,
          arrow.isInverted ? "#FFFFFF" : "#000000"
        )
      );
      pointsOnTarget.forEach(point =>
        drawDot(point.point, point.isInverted ? "#FFFFFF" : "#000000")
      );
      */
  }
  /*
    // show zoomed canvas on desktop
    handleMouseMove(e) {
      var pos = getMousePos(canvas, e);
      handleZoom(pos);
    }

    // get position of mouse cursor
    getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }
    // show zoomed canvas on mobile
    handleTouchMove(e) {
      console.log("moving");
      // Ignore multi touch events
      if (e.touches.length > 1) {
        return;
      }
      var pos = getTouchPos(canvas, e);
      handleZoom(pos, true);
    }

    // get position for touch event
    getTouchPos(canvas, event) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }

    // display zoomed target
    handleZoom(pos, isTouch) {
      var x = pos.x;
      var y = pos.y;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const y1 = isTouch
        ? -y * zoomFactor + touchCursorOffset
        : -y * zoomFactor;
      context.drawImage(base_image, -x * zoomFactor, y1, iw, ih);
      if (isTouch) {
        // draw cursor for touch
        cursorPos = { x, y: y - touchCursorOffset };
        drawDot(cursorPos, "#39ff14");
      }

      arrows.forEach(arrow => {
        const newX = -x * zoomFactor + arrow.arrowCoordinates.x * 2;
        const newY = -y * zoomFactor + arrow.arrowCoordinates.y * 2;
        drawDot(
          { x: newX, y: isTouch ? newY + touchCursorOffset : newY },
          arrow.isInverted ? "#FFFFFF" : "#000000"
        );
      });

      pointsOnTarget.forEach(point => {
        const newX = -x * zoomFactor + point.point.x * 2;
        const newY = -y * zoomFactor + point.point.y * 2;
        drawDot(
          { x: newX, y: isTouch ? newY + touchCursorOffset : newY },
          point.isInverted ? "#FFFFFF" : "#000000"
        );
      });
    }
*/
  makeBase() {
    this.base_image = new Image();
    this.base_image.src = target;

    this.base_image.onload = () => {
      this.iw = 600;
      this.ih = 600;
      this.canvas.width = this.iw * this.zoom;
      this.canvas.height = this.ih * this.zoom;
      this.zoomFactor = (600 - 600 * this.zoom) / this.canvas.width;
      this.doCanvas();
      //redraw canvas at default zoom
      this.canvas.addEventListener("mouseout", this.doCanvas, false);
      // show zoomed canvas
      //canvas.addEventListener("mousemove", handleMouseMove, false);
      // draw dot
      //canvas.addEventListener("mouseup", handleMouseUp, false);
      //show zoomed canvas mobile
      /*canvas.addEventListener(
          "touchmove",
          throttle(handleTouchMove, 16),
          true
        );
        // draw dot
        canvas.addEventListener("touchend", handleTouchEnd, false);*/
    };
    /*
    throttle(cb, delay) {
      var timesUp = true;
      return function(event) {
        if (!timesUp) return;
        setTimeout(function() {
          timesUp = true;
        }, delay);

        timesUp = false;
        cb(event);
      };
    }
   */
  }
}
