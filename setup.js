
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
    goRight(2);
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


  let touchstartX = 0
  let touchendX = 0

  //const slider = document.getElementById('slider')

  function handleGesture() {
    if (touchendX < touchstartX) {
      goRight(2);
    }
    if (touchendX > touchstartX) {
      goRight(2);
    }
  }

  this.el.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
  })

  this.el.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    handleGesture()
  })


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
    let block = new Block(arr[arr.length-1].origin.x, dpx, -1, dpx, block_w, block_h, cols, rows);
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
    
    dx += 5;
    
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
        
        arr[i].current.x++;
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



