// canvas size
w = 500;
h = 500;

// appearance
draw_points = false;
draw_speckles = true;
draw_lines = true;
refresh_connectivity = true;
use_closest = true;
point_weight = 5;
line_weight = 5;
speckles_weight = 2;
line_color = [229, 211, 82];
bckg_color = [171, 129, 205];
speckles_color = 0;

// noise properties
noise_speed = 0.1;
freq = 0.001;

// points properties
num_vertices = 200;
points = [];
ping_pong = [];
move_speed = 1;
velocity = [];
connected = [];

// extra specles
num_speckles = 500;
speckles  = [];

function setup() {
  createCanvas(500, 500);

  // Randomly scatter points
  scatterPoints();
  scatterSpeckles();
}

function draw() {
  background(bckg_color);
  
  // t += 1;
  
  movePoints();
  
  if (draw_points) {
    strokeWeight(point_weight);
    for (i = 0; i < num_vertices; i++) {
        point(points[i].x, points[i].y);
    }
  }
  
  stroke(speckles_color);
  if (draw_speckles) {
    strokeWeight(speckles_weight);
    for (i = 0; i < num_speckles; i++) {
        point(speckles[i].x, speckles[i].y);
    }
  }
  
  stroke(line_color);
  if (draw_lines) {
    strokeWeight(line_weight);
    for (i = 0; i < num_vertices; i++) {
      closest3 = connected[i];
      if (refresh_connectivity) {
        if (use_closest) {
          closest3 = closest(i);
        }
        else {
          closest3 = topK(i);
        }
      }

      for (j = 0; j < closest3.length; j++) {
           line(closest3[j].x, closest3[j].y, points[i].x, points[i].y);
      }
    }
  }
}

// Scatter points randomly on the canvas
function scatterPoints() {
  for (i1 = 0; i1 < num_vertices; i1++) {
    points.push(createVector(random(width), random(height)));
    theta = random(1) * 2 * PI;
    velocity.push(createVector(move_speed * Math.cos(theta), move_speed * Math.sin(theta)));
    ping_pong.push(createVector(1, 1));
  }
  
  for (i1 = 0; i1 < num_vertices; i1++) {
    if (use_closest) {
      connected.push(closest(i1));
    }
    else {
      connected.push(topK(i1));
    }
  }
}

// Scatter points randomly on the canvas
function scatterSpeckles() {
  for (i1 = 0; i1 < num_speckles; i1++) {
    speckles.push(createVector(random(width), random(height)));
  }
}


function closest(point_idx) {
  min_idx = 0;
  min_d = w * h;
  for (i2 = 0; i2 < num_vertices; i2++) {
    if (i2 != point_idx) {
      d = points[point_idx].dist(points[i2]);
      if ( d < min_d) {
        min_idx = i2;
        min_d = d;
      }
    }
  }
  
  return [points[min_idx]];
}

// Find top 3 closest points in neighbouring cells
function topK(vtx_idx) {
  buffer_dist = []
  for (i3 = 0; i3 < num_vertices; i3++) {
    if (i3 != vtx_idx) {
      buffer_dist.push(points[vtx_idx].dist(points[i3]));
    }
    else {
      buffer_dist.push(w * h);
    }
  }
  
  // find k closest neighbours
  // Make a tmp buffer containing the first 3 elements of the array
  tmp = buffer_dist.slice(0, 3);
  tmp_idx = [0, 1, 2];

  // find largest element of the array
  M = argmax(tmp);

  // for all remaining elements, if one is closest than the max,
  // store it in place of the max, and recompute the max
  for (i3 = 3; i3 < buffer_dist.length; i3++) {
    if (buffer_dist[i3] < tmp[M]) {
      tmp[M] = buffer_dist[i3];
      tmp_idx[M] = i3;
      M = argmax(tmp);   
    }
  }
  
  // store the 3 closest points
  topKClosest = []
  for (i3 = 0; i3 < 3; i3++)
  {
    topKClosest.push(points[tmp_idx[i3]]);
  }
  
  return topKClosest;
}

// returns index of largest element in array of 3 values
function argmax(array) {
  if (array[0] >= array[1] && array[0] >= array[2]) {
    return 0;
  }  
  else if (array[1] >= array[2]) {
    return 1;
  }
  else {
    return 2;
  }
}


function movePoints() {
  for (i5 = 0; i5 < num_vertices; i5++) {
    points[i5].x += velocity[i5].x * ping_pong[i5].x;
    points[i5].y += velocity[i5].y * ping_pong[i5].y;
    if (points[i5].x >= width - 1) {
      ping_pong[i5].x *= -1;
      points[i5].x = width - 1;
    }
    if (points[i5].x <= 0) {
      ping_pong[i5].x *= -1;
      points[i5].x = 0;
    }
    if (points[i5].y >= height - 1) {
      ping_pong[i5].y *= -1;
      points[i5].y = height - 1;
    }
    if (points[i5].y <=  0) {
      ping_pong[i5].y *= -1;
      points[i5].y = 0;
    }
  }
}