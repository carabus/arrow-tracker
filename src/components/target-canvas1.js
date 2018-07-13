import React from "react";
import target from "../images/target.png";

export default class TargetCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    console.log("CANVAS DID MOUNT", this.props.arrows);
    initTarget(this.myRef.current, this.props.arrows, this.props.createArrow);
  }

  componentDidUpdate() {
    console.log("CANVAS DID UPDATE", this.props.arrows);
    //initTarget(this.myRef.current, this.props.arrows, this.props.createArrow);
  }

  render() {
    console.log("CANVAS RENDER");
    return <canvas ref={this.myRef} width="300" height="300" />;
  }
}

function initTarget(canvas, arrows, callback) {
  const centerPoint = { x: 150, y: 150 };
  const touchCursorOffset = 100;
  const targetScoreRange = [
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
  var cursorPos = {};
  var context = canvas.getContext("2d"),
    zoom = 0.5,
    zoomFactor,
    iw,
    ih,
    base_image;
  var pointsOnTarget = [];

  function calculateScore(position) {
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

  function drawDot(position, fill) {
    context.fillStyle = fill;
    context.beginPath();
    context.arc(position.x, position.y, 2, 0, 2 * Math.PI);
    context.fill();
  }

  function handleMouseUp(e) {
    const pos = getMousePos(canvas, e);
    const newArrow = generatePointOnTarget(pos, false);
    pointsOnTarget.push(newArrow);
    callback(newArrow);
    doCanvas();
  }

  function handleTouchEnd(event) {
    const newArrow = generatePointOnTarget(cursorPos, true);
    pointsOnTarget.push(newArrow);
    callback(newArrow);
    doCanvas();
  }

  function generatePointOnTarget(zoomedCoordinates, isTouch) {
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

  // re-draw target with all entered points
  function doCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(base_image, 0, 0, iw * zoom, ih * zoom);
    arrows.forEach(arrow =>
      drawDot(arrow.arrowCoordinates, arrow.isInverted ? "#FFFFFF" : "#000000")
    );
    pointsOnTarget.forEach(point =>
      drawDot(point.point, point.isInverted ? "#FFFFFF" : "#000000")
    );
  }
  // show zoomed canvas on desktop
  function handleMouseMove(e) {
    var pos = getMousePos(canvas, e);
    handleZoom(pos);
  }

  // get position of mouse cursor
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  // show zoomed canvas on mobile
  function handleTouchMove(e) {
    console.log("moving");
    // Ignore multi touch events
    if (e.touches.length > 1) {
      return;
    }
    var pos = getTouchPos(canvas, e);
    handleZoom(pos, true);
  }

  // get position for touch event
  function getTouchPos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };
  }

  // display zoomed target
  function handleZoom(pos, isTouch) {
    var x = pos.x;
    var y = pos.y;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const y1 = isTouch ? -y * zoomFactor + touchCursorOffset : -y * zoomFactor;
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

  function makeBase() {
    base_image = new Image();
    base_image.src = target;
    base_image.onload = function() {
      iw = 600;
      ih = 600;
      canvas.width = iw * zoom;
      canvas.height = ih * zoom;
      zoomFactor = (600 - 600 * zoom) / canvas.width;
      doCanvas();
      //redraw canvas at default zoom
      canvas.addEventListener("mouseout", doCanvas, false);
      // show zoomed canvas
      canvas.addEventListener("mousemove", handleMouseMove, false);
      // draw dot
      canvas.addEventListener("mouseup", handleMouseUp, false);
      //show zoomed canvas mobile
      canvas.addEventListener("touchmove", throttle(handleTouchMove, 16), true);
      // draw dot
      canvas.addEventListener("touchend", handleTouchEnd, false);
    };
  }

  function throttle(cb, delay) {
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
  makeBase();
}
