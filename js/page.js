var selectedItem = null;
var changedItem = [];

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

function itemClick(itemId) {
    document.getElementById('layer-chair-img').style = "outline: none";
    document.getElementById('layer-sofa-img').style = "outline: none";
    document.getElementById('layer-towel-img').style = "outline: none";
    document.getElementById('layer-brown-img').style = "outline: none";
    document.getElementById('layer-pillow-img').style = "outline: none";
    document.getElementById('layer-wall-img').style = "outline: none";
    document.getElementById('layer-artwork-img').style = "outline: none";

    if(changedItem.includes('layer-chair') == false)
      drawOriginal('layer-chair');
  
    if(changedItem.includes('layer-sofa') == false)
      drawOriginal('layer-sofa');
    
    if(changedItem.includes('layer-towel') == false)
      drawOriginal('layer-towel');
    
    if(changedItem.includes('layer-brown') == false)
    drawOriginal('layer-brown');
  
    if(changedItem.includes('layer-pillow') == false)
    drawOriginal('layer-pillow');
  
    if(changedItem.includes('layer-wall') == false)
    drawOriginal('layer-wall');

    imgId = itemId + "-img";
    canId = itemId + "-can";

    var canvas = document.getElementById(canId);
    var ctx = canvas.getContext("2d");
    var img = document.getElementById(imgId);
    img.style='outline: 3px solid SlateBlue;';
    
    selectedItem = itemId;
    
    if (selectedItem == 'layer-wall')
      showMenu('wall-menu');
    else
      hideMenu('wall-menu'); ////////
      
      
    if(changedItem.includes(itemId) == true)
      return;

    canvas.left = img.left;
    canvas.top = img.top;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    
    var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = image_data.data;

    for (var i = 0; i < data.length; i += 4) {
        data[i+2] /= 2;
    }

    ctx.putImageData(image_data, 0, 0);
    
    console.log(img.src); 
}

function colorChange()
{
  if(selectedItem == null)
    return;
    color = document.getElementById("colorPicker").value;

    imgId = selectedItem + "-img";
    canId = selectedItem + "-can";

    var canvas = document.getElementById(canId);
    var ctx = canvas.getContext("2d");
    var img = document.getElementById(imgId);

    canvas.left = img.left;
    canvas.top = img.top;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = image_data.data;
    colorValue = hexToRgb(color);
    r = parseInt(colorValue.split(",")[0]);
    g = parseInt(colorValue.split(",")[1]);
    b = parseInt(colorValue.split(",")[2]);

    maxR = 0;
    maxG = 0;
    maxB = 0;
    minR = 255;
    minG = 255;
    minB = 255;

    for (var i = 0; i < data.length; i += 4) {
      if (data[i] > maxR)
        maxR = data[i];
      
      if (data[i] < minR)
        minR = data[i];

      if (data[i+1] > maxG)
        maxG = data[i+1];
      if (data[i+1] < minG)
          minG = data[i+1];

      if (data[i+2] > maxB)
        maxB = data[i+2];
      if (data[i+2] < minB)
          minB = data[i+2];
    }

    for (var i = 0; i < data.length; i += 4) {
        aver = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = aver* r/((maxR+minR))*0.9;//(255-maxR);
        data[i+1] = aver* g/((maxG+minG))*0.9;//(255-maxG);
        data[i+2] = aver* b/((maxB+minB))*0.9;//(255-maxB);
    }

    ctx.putImageData(image_data, 0, 0);

    changedItem.push(selectedItem);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return r+","+g+","+b;//return 23,14,45 -> reformat if needed
    } 
    return null;
  }

  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function uploadArtwork()
  {
    var path = document.getElementById('uploadFile').files[0].name;
    path = "img/"+path;

    divId = "layer-artwork";
    imgId = "layer-artwork-img";
    canId = "layer-artwork-can";

    var canvas = document.getElementById(canId);
    var img = document.getElementById(imgId);
    var div = document.getElementById(divId);
    img.src = path;
  }

  
  function takeshot() {
    html2canvas(document.body).then((canvas) => {
      let a = document.createElement("a");
      
      var tempCanvas = document.createElement("canvas"),
      tCtx = tempCanvas.getContext("2d");
      tempCanvas.width = 1000;
      tempCanvas.height = 618;
      tCtx.drawImage(canvas,0,0);

      a.download = (new Date).toISOString() + ".png";
      a.href = tempCanvas.toDataURL("image/png");
      a.click();
    });
  }

  function cropCancel()
  {
    document.getElementById('crop-div').style.display = 'none';
    document.getElementById('crop-menu').style.display = 'none';
  }

  function openCropMenu()
  {
    document.getElementById('crop-div').style.display = 'block';
    document.getElementById('crop-menu').style.display = 'block';
    closeNav();
  }

  function positionValueChanged()
  {
    x = document.getElementById('x_val');
    y = document.getElementById('y_val');
    w = document.getElementById('w_val');
    h = document.getElementById('h_val');

    if (parseInt(w.value) + parseInt(x.value) > 1001) {
      w.value = 1001 - x.value;
    }
    
    if (parseInt(h.value) + parseInt(y.value) > 619) {
      h.value = 619 - y.value;
    }

    cropArea = document.getElementById('crop-area-div');
    cropArea.style.left = x.value+"px";
    cropArea.style.top = y.value+"px";
    cropArea.style.width = w.value+"px";
    cropArea.style.height = h.value+"px";
  }

  function cropSave()
  {
    cropCancel();

    x = document.getElementById('x_val');
    y = document.getElementById('y_val');
    w = document.getElementById('w_val');
    h = document.getElementById('h_val');

    html2canvas(document.body).then((canvas) => {
      let a = document.createElement("a");
      
      var tempCanvas = document.createElement("canvas"),
      tCtx = tempCanvas.getContext("2d");
      tempCanvas.width = parseInt(w.value);
      tempCanvas.height = parseInt(h.value);
      tCtx.drawImage(canvas, 1-parseInt(x.value), 1-parseInt(y.value));

      a.download = (new Date).toISOString() + ".png";
      a.href = tempCanvas.toDataURL("image/png");
      a.click();
    });
  }

  function drawOriginal(itemId)
  {
    imgId = itemId + "-img";
    canId = itemId + "-can";

    var canvas = document.getElementById(canId);
    var ctx = canvas.getContext("2d");
    var img = document.getElementById(imgId);
    canvas.left = img.left;
    canvas.top = img.top;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

    
function backClick() {
  document.getElementById('layer-chair-img').style = "outline: none";
  document.getElementById('layer-sofa-img').style = "outline: none";
  document.getElementById('layer-towel-img').style = "outline: none";
  document.getElementById('layer-brown-img').style = "outline: none";
  document.getElementById('layer-pillow-img').style = "outline: none";
  document.getElementById('layer-wall-img').style = "outline: none";
  document.getElementById('layer-artwork-img').style = "outline: none";

  if(changedItem.includes('layer-chair') == false)
    drawOriginal('layer-chair');

  if(changedItem.includes('layer-sofa') == false)
    drawOriginal('layer-sofa');
  
  if(changedItem.includes('layer-towel') == false)
    drawOriginal('layer-towel');
  
  if(changedItem.includes('layer-brown') == false)
  drawOriginal('layer-brown');

  if(changedItem.includes('layer-pillow') == false)
  drawOriginal('layer-pillow');

  if(changedItem.includes('layer-wall') == false)
  drawOriginal('layer-wall');

  if(changedItem.includes('layer-artwork') == false)
  drawOriginal('layer-artwork');

  hideMenu('wall-menu');
  }

  function selectStyle(styleId)
  {
    path = "img/walls/wall-"+styleId+".png";

    divId = "layer-wall";
    imgId = "layer-wall-img";
    canId = "layer-wall-can";

    var canvas = document.getElementById(canId);
    var img = document.getElementById(imgId);
    var div = document.getElementById(divId);
    img.src = path;
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  function hideMenu(menuId)
  {
    document.getElementById(menuId).style.display = "none";
  }
  function showMenu(menuId)
  {
    document.getElementById(menuId).style.display = "block";
  }