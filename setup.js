
let imgdata;

let container;
let container_w;
let container_h;

let block_w;
let block_h;
let cols = 5;
let rows = 5;
let blocks = [];


let slideInProgress = false;

let go_right = document.getElementById('go_right');

window.onload = function() {
  
  container = document.getElementById('container');
  container_w = container.getBoundingClientRect().right - container.getBoundingClientRect().left;
  container_h = container.getBoundingClientRect().bottom - container.getBoundingClientRect().top;
  
  block_w = container_w / cols;
  block_h = container_h / rows;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
    
    // INITIALIZE AS ORIGIN = CURRENT
    let block = new Block(x, y, x, y, block_w, block_h, cols, rows);
    container.appendChild(block.el);
    blocks.push(block);
    
    }
  }
  
  go_right.addEventListener('click', function() {
    goLeft(2);
  });

  let url = './images/sunflower.jpg';
}


function Block(original_x, original_y, current_x, current_y, w, h, cols, rows) {

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

  this.el.style.width = this.w;
  this.el.style.height = this.h;
  this.el.style.top = this.top; 
  this.el.style.left = this.left;

  this.el.innerHTML = '<p>O : (' + this.origin.y + ', ' + this.origin.x + ')</p><p>C : (' + this.current.y +', ' + this.current.x + ')';

  

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

  let block = new Block(origin_x, origin_y, current_x, current_y, block_w, block_h, cols, rows);
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
    
    dx += -7;
    
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
        arr[i].el.innerHTML = '<p>O : (' + arr[i].origin.y + ', ' + arr[i].origin.x + ')</p><p>C : (' + arr[i].current.y +', ' + arr[i].current.x + ')';

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
    
  }, 1000/20);
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

  let block = new Block(origin_x, origin_y, current_x, current_y, block_w, block_h, cols, rows);
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
    
    dx += 7;
    
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
        arr[i].el.innerHTML = '<p>O : (' + arr[i].origin.y + ', ' + arr[i].origin.x + ')</p><p>C : (' + arr[i].current.y +', ' + arr[i].current.x + ')';

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
    
  }, 1000/20);
  
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



