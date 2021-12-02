
let container, container_w, container_h;

let block_w, block_h;
let cols, rows;
let blocks = [];

let pixels_per_frame = 7;
let fps = 25;

let c, ctx, img, imgdata;
let url = './images/sunflower.jpg';

let slideInProgress = false;

let go_right = document.getElementById('go_right');

window.onload = function() {
  
  container = document.getElementById('container');

  
  c = document.createElement('canvas');
  ctx = c.getContext('2d');
  img = document.createElement('img');
  
  img.onload = function() {
    c.width = img.width;
    c.height = img.height;
    ctx.drawImage(img, 0, 0);
    imgdata = ctx.getImageData(0, 0, c.width, c.height);
    console.log(imgdata);
    
    /* WHEN WE GET A NEW IMAGE */
    
    // SIZE THE CONTAINER
    container.style.width = window.innerWidth*0.8;
    container.style.height = window.innerWidth*0.8*(imgdata.height/imgdata.width);
    container_w = container.getBoundingClientRect().right - container.getBoundingClientRect().left;
    container_h = container.getBoundingClientRect().bottom - container.getBoundingClientRect().top;
    
    // GET THE NUMBER OF COLS AND ROWS
    cols = Math.floor(imgdata.width / 100);
    rows = Math.floor(imgdata.height / 100);
    
    // BLOCK WIDTH
    block_w = container_w / cols;
    block_h = container_h / rows;
    
    /* WHEN WE GET A NEW IMAGE */
    
    // in here
    
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
        
        // feed imgdata
        
        // INITIALIZE AS ORIGIN = CURRENT
        let block = new Block(imgdata, x, y, x, y, block_w, block_h, cols, rows);
        container.appendChild(block.el);
        blocks.push(block);
        
        }
      }
    
  }
  
  img.src = url;
  
  
  
  go_right.addEventListener('click', function() {
    goLeft(2);
  });



  
  
}


function Block(imgdata, original_x, original_y, current_x, current_y, w, h, cols, rows) {

  this.el = document.createElement('div');
  this.el.style.position = 'absolute';
  this.el.style.border = '1px solid #999';
  this.el.style.fontFamily = 'calibri';

  this.origin = {
    'x':original_x,
    'y':original_y
  };

  this.current = {
    'x':current_x,
    'y':current_y
  }

  this.w = w;
  this.h = h;

  this.rows = rows;
  this.cols = cols;

  this.top = this.current.y*this.h;
  this.left = (this.current.x%this.cols)*this.w;
  
  // READY TO EXTRACT
  this.imgdata = imgdata;
  let c = document.createElement('canvas');
  let ctx = c.getContext('2d');
  c.width = imgdata.width;
  c.height = imgdata.height;
  ctx.putImageData(this.imgdata, 0, 0);
  
  // EXRACT
  let sw = imgdata.width / this.cols;
  let sh = imgdata.height / this.rows;
  let sx = this.origin.x * sw;
  let sy = this.origin.y * sh;
  let block_imgdata = ctx.getImageData(sx, sy, sw, sh);
  console.log(block_imgdata);
  
  c.width = block_imgdata.width;
  c.height = block_imgdata.height;
  ctx.putImageData(block_imgdata, 0, 0);
  
  let data_url = c.toDataURL();
  let img = document.createElement('img');
  img.src = data_url;
  img.width = this.w;
  img.height = this.h;
  
  this.el.appendChild(img);




  this.el.style.width = this.w;
  this.el.style.height = this.h;
  this.el.style.top = this.top; 
  this.el.style.left = this.left;

  // this.el.innerHTML = '<p>O : (' + this.origin.y + ', ' + this.origin.x + ')</p><p>C : (' + this.current.y +', ' + this.current.x + ')';

  

  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  // let touchRow = this.current.y;
  // let touchCol = this.current.x;

  this.handleGesture = function() {
    let dx = Math.abs(touchEndX-touchStartX);
    let dy = Math.abs(touchEndY-touchStartY);
    
    if (dx > dy) {
      if (touchEndX > touchStartX) {
        
        // RIGHT
        // slides.innerHTML = '<p>right</p>';
        // slides.innerHTML += '<p>' + this.current.y + '</p>';
        goRight(this.current.y);
      
      } else {
        
        // LEFT
        // slides.innerHTML = '<p>left</p>';
        // slides.innerHTML += '<p>' + this.current.y + '</p>';
        goLeft(this.current.y);
        
      }
    } else {
      if (touchEndY > touchStartY) {
        // down
        event.preventDefault();
        // alert('down');
        slides.innerHTML = '<p>down</p>';
        slides.innerHTML += '<p>' + this.current.x + '</p>';
      } else {
        // up
        // alert('up');
        slides.innerHTML = '<p>up</p>';
        slides.innerHTML += '<p>' + this.current.x + '</p>';
      }
    }
  }.bind(this);
  
  this.el.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  })

  this.el.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    this.handleGesture();
  }.bind(this))


}

function goLeft(dpx) {

  if (slideInProgress) {
    return;
  } else {
    slideInProgress = true;
  }
  
  // GET ALL THE BLOCKS WE KNOW WE NEED TO SLIDE OVER
  let arr = [];
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].current.y === dpx) {
      arr.push(blocks[i]);
    }
  }
  console.log(arr);

  // SORT BY CURRENT X
  arr.sort(function(a, b) {
    return a.current.x - b.current.x;
  })
  console.log(arr);

  // ORIGIN & CURRENT
  let origin_x = arr[0].origin.x;
  let origin_y = dpx;
  let current_x = cols;
  let current_y = dpx;
  
  // let block_imgdata = ctx.getImageData(x, y, block_w, block_h);
  let block = new Block(arr[0].imgdata, origin_x, origin_y, current_x, current_y, block_w, block_h, cols, rows);
  container.appendChild(block.el);
  blocks.push(block);
  arr.push(block);
    
    console.log(Math.random);
    
  // sort based on current x
  arr.sort(function(a, b) {
    return a.current.x - b.current.x;
  })
  
  // now animate to make it move to the right
  
  let dx = 0;
  let animate = window.setInterval(function() {
    
    dx += -pixels_per_frame;
    
    for (let i = 0; i < arr.length; i++) {
      arr[i].left = (arr[i].current.x)*arr[i].w + dx;
      arr[i].el.style.left = arr[i].left + 'px';
    }
    
    if (dx <= -block_w) {
      
      // STOP ANIMATION
      window.clearInterval(animate);
      
      // UPDATE OBJ AND CONSTRAIN POS
      for (let i = 0; i < arr.length; i++) {
        
        arr[i].current.x--; // decrement by 1
        arr[i].current.y;
        
        arr[i].top = (arr[i].current.y)*arr[i].h;
        arr[i].left = (arr[i].current.x)*arr[i].w;

        arr[i].el.style.top = arr[i].top; 
        arr[i].el.style.left = arr[i].left;
        // arr[i].el.innerHTML = '<p>O : (' + arr[i].origin.y + ', ' + arr[i].origin.x + ')</p><p>C : (' + arr[i].current.y +', ' + arr[i].current.x + ')';

      }
      
      // DELETE OBJECT
      for (let i = blocks.length-1; i > 0; i--) {
        if (blocks[i].current.x < 0) {
          blocks[i].el.remove();
          blocks.splice(i, 1);
        }
      }
      for (let i = arr.length-1; i > 0; i--) {
        if (arr[i].current.x < 0) {
          console.log('hi');
          arr.splice(i, 1);
        }
      }
      console.log(arr);

      slideInProgress = false;

    }
    
  }, 1000/fps);
}

function goRight(dpx) {
  
  if (slideInProgress) {
    return;
  } else {
    slideInProgress = true;
  }
  
  // GET ALL THE BLOCKS WE KNOW WE NEED TO SLIDE OVER
  let arr = [];
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].current.y === dpx) {
      arr.push(blocks[i]);
    }
  }
  console.log(arr);

  // SORT BY CURRENT X
  arr.sort(function(a, b) {
    return a.current.x - b.current.x;
  })
  console.log(arr);
  
  // ORIGIN & CURRENT
  let origin_x = arr[arr.length-1].origin.x;
  let origin_y = dpx;
  let current_x = -1;
  let current_y = dpx;

  // let block_imgdata = ctx.getImageData(x, y, block_w, block_h);
  let block = new Block(arr[arr.length-1].imgdata, origin_x, origin_y, current_x, current_y, block_w, block_h, cols, rows);
  container.appendChild(block.el);
  blocks.push(block);
  arr.push(block);
    
  // sort based on current x
  arr.sort(function(a, b) {
    return a.current.x - b.current.x;
  })
  
  // now animate to make it move to the right
  
  let dx = 0;
  let goRight = window.setInterval(function() {
    
    dx += pixels_per_frame;
    
    for (let i = 0; i < arr.length; i++) {
      
      // take the currentx
      arr[i].left = (arr[i].current.x%arr[i].cols)*arr[i].w + dx;
      arr[i].el.style.left = arr[i].left + 'px';

    }
    
    if (dx >= block_w) {
      
      // STOP ANIMATION
      window.clearInterval(goRight);
      
      // UPDATE OBJ AND CONSTRAIN POS
      for (let i = 0; i < arr.length; i++) {
        
        arr[i].current.x++; // increment by 1
        arr[i].current.y;
        
        arr[i].top = arr[i].current.y*arr[i].h;
        arr[i].left = (arr[i].current.x)*arr[i].w;

        arr[i].el.style.top = arr[i].top; 
        arr[i].el.style.left = arr[i].left;
        // arr[i].el.innerHTML = '<p>O : (' + arr[i].origin.y + ', ' + arr[i].origin.x + ')</p><p>C : (' + arr[i].current.y +', ' + arr[i].current.x + ')';

      }
      
      // DELETE OBJECT
      for (let i = blocks.length-1; i > 0; i--) {
        if (blocks[i].current.x >= blocks[i].cols) {
          blocks[i].el.remove();
          blocks.splice(i, 1);
        }
      }
      for (let i = arr.length-1; i > 0; i--) {
        if (arr[i].current.x >= arr[i].cols) {
          console.log('hi');
          arr.splice(i, 1);
        }
      }
      console.log(arr);

      slideInProgress = false;

    }
    
  }, 1000/fps);
  
}



// do everything inside window.onload

// slice the img up and into nxn parts, and save the img datas
// each gets an img tag, and a div parent
// container is relative
// divs are absolute, relative to parent




// but this function is async
// i want to make it a promise, so that i can do getImageData(src).then()

async function getImageData(src) {
  
  let c = document.createElement('canvas');
  let ctx = c.getContext('2d');
  let img = document.createElement('img');
  
  img.onload = await function() {
    c.width = img.width;
    c.height = img.height;
    ctx.drawImage(img, 0, 0);
    let imgdata = ctx.getImageData(0, 0, c.width, c.height);
    return imgdata;
  }
  
  img.src = src;
  
}



