// console.log = function() {}

$(document).ready( function()
{
  var offset, clock, interval, inspectionTime;

  var running = false;
  var finished = false;
  var inspection = false;
  var inspectionRunning = false;
  var defaultInspectionTime = 15;
  var useCtrl = false;

  var ctrlLeftDown = false, ctrlRightDown = false;
  var ctrlReady = false;

  // Start is on key up
  // Stop is on key down
  $(document).keyup(function(e) 
  {
    var ctrlWasDown = BothCtrlDown();

    // Get Key Events
    var isSpaceUp = e.keyCode == 32;
    if (e.keyCode == 17)
    {
      HandleCtrl(e, false);
    }

    if (finished)
    {
      console.log("finished");
      finished = false;
      return;
    }

    var readyToBegin = false;
    if (useCtrl)
    {
      readyToBegin = !running && ctrlWasDown;
    }
    else
    {
      readyToBegin = !running && isSpaceUp;
    }

    if (readyToBegin) 
    {
      console.log("valid keyup");
      reset();

      if (inspection && !inspectionRunning)
      {
        console.log("start inspection");
        startInspection();
        inspectionRunning = true;
      }
      else
      {
        console.log("start time");
        clearInterval(interval);
        interval = null;
        startTimer();
        inspectionRunning = false;
        running = true;
      }      
    }
  });

  $(document).keydown(function(e)
  {
    // Get Key Events
    var isSpaceDown = e.keyCode == 32;
    if (e.keyCode == 17)
    {
      HandleCtrl(e, true);
    }    

    // Check if stop should occur
    var stopReady = false;

    if (useCtrl)
    {
      stopReady = running && BothCtrlDown();
    }
    else
    {
      stopReady = running && isSpaceDown;
    }

    if (stopReady)
    {
      console.log("stopping");
      stopTimer();
      running = false;
      inspectionRunning = false;
      finished = true;
      $("#scramble").text(GetScramble());
    }
  });

  $('#inspection-switch').change(function() 
  {
    if ($(this).is(":checked")) 
    {
      inspection = true;
    }
    else
    {
      inspection = false;
    }

    console.log("inspection is " + inspection); 
  });

  $('input[type=radio][name=cube-input]').change(function() {
    if (this.value == '1') {
      useCtrl = false;
      console.log("Spacebar");
    }
    else if (this.value == '2') {
      useCtrl = true;
      console.log("CTRL");
    }
  });

  // Main Timer functions

  function startTimer() {
    if (!running)
    {
      offset = Date.now();
      interval = setInterval(updateTimer);
      updateTimer();
    }   
  }

  function stopTimer() {
    if (running) {
      clearInterval(interval);
    }
  }

  function reset() {
    clock = 0;
    $("#cube-time").text(clock.toFixed(3));
  }

  function updateTimer() {
    clock += delta();
    var time = clock / 1000;
    $("#cube-time").text(time.toFixed(3));
  }

  function delta() {
    var now = Date.now();
    var d = now - offset;

    offset = now;
    return d;
  }

  // Inspection functions

  function startInspection() {
    if (!running && !inspectionRunning) {
      offset   = Date.now();
      interval = setInterval(updateInspection, 1000);
      inspectionTime = defaultInspectionTime;
      updateInspection();
    }
  }

  function updateInspection() {
    inspectionTime -= delta() / 1000;

    if (inspectionTime > 0)
    {
      $("#cube-time").text(Math.round(inspectionTime));
    }
    else
    {
      console.log("inspection ran out");
      clearInterval(interval);
      interval = null;
      startTimer();
      inspectionRunning = false;
      running = true;
    }
  }  

  // CTRL Functions

  function HandleCtrl(e, isKeyDown)
  {
    if (event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT)
    {
      console.log("left ctrl is " + isKeyDown);
      ctrlLeftDown = isKeyDown;
    } else if (event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT)
    {
      console.log("right ctrl is " + isKeyDown);
      ctrlRightDown = isKeyDown;
    }
  }

  function BothCtrlDown()
  {
    return ctrlLeftDown && ctrlRightDown;
  }
});