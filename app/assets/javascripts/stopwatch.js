$(document).ready( function()
{
  var offset, clock, interval, inspectionTime;

  var running = false;
  var finished = false;
  var inspection = false;
  var inspectionRunning = false;
  var defaultInspectionTime = 15;
  var useCtrl = false;

  var ctrlDownCount = 0;
  var ctrlReady = false;

  // Start is on key up
  // Stop is on key down
  $(document).keyup(function(e) 
  {
    if (e.keyCode == 17 && ctrlDownCount != 0)
    {
      ctrlDownCount -= 1;
      console.log(ctrlDownCount);
    }

    if (finished)
    {
      finished = false;
      return;
    }

    var valid = false; 

    if (!useCtrl)
    {
      valid = e.keyCode == 32 && !running;  
    }
    else
    {
      valid = ctrlReady && !running;
    }

    if (valid) 
    {
      reset();

      if (inspection && !inspectionRunning)
      {
        console.log("start inspection");
        startInspection();
        inspectionRunning = true;
        ctrlReady = false;
      }
      else
      {
        console.log("start time");
        clearInterval(interval);
        interval = null;
        start();
        inspectionRunning = false;
        running = true;
        ctrlReady = false;
      }      
    }
  });

  $(document).keydown(function(e)
  {
    if (!finished && e.keyCode == 17)
    {
      if (ctrlDownCount < 2)
      {
        ctrlDownCount += 1;
      }

      if (ctrlDownCount >= 2 && !running)
      {
        ctrlReady = true;
      }
      console.log(ctrlDownCount);
    }

    var valid = false;

    if (!useCtrl)
    {
      valid = e.keyCode == 32 && running;  
    }
    else
    {
      valid = ctrlDownCount >= 2 && running;
    }

    if (valid)
    {
      console.log("stopping");
      stop();
      running = false;
      inspectionRunning = false;
      finished = true;
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
      ctrlDownCount = 0;
      console.log("CTRL");
    }
  });

  function start() {
    ctrlDownCount = 0;
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update);
      render();
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    ctrlDownCount = 0;
    render();
  }

  function update() {
    clock += delta();
    render();
  }

  function render() {
    var time = clock / 1000;
    $("#cube-time").text(time.toFixed(3));
  }

  function startInspection() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(updateInspection, 1000);
      inspectionTime = defaultInspectionTime;
      renderInspection();
    }
  }

  function updateInspection() {
    inspectionTime -= delta() / 1000;

    if (inspectionTime > 0)
    {
      renderInspection();
    }
    else
    {
      console.log("inspection ran out");
      clearInterval(interval);
      interval = null;
      start();
      inspectionRunning = false;
      running = true;
    }
  }  

  function renderInspection() {
    $("#cube-time").text(Math.round(inspectionTime));
  }

  function delta() {
    var now = Date.now();
    var d = now - offset;

    offset = now;
    return d;
  }
});