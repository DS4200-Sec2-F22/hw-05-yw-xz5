let circles = document.getElementsByTagName('circle');

function circleClicked(circle) {
    clicked = document.getElementById(circle.target.id);
    let textDiv = document.getElementById("last-selected");
	if (clicked.classList.contains("selected")) {
		clicked.classList.remove("selected");
	}
	else {
		clicked.classList.add("selected");
	}
	textDiv.innerHTML = "Last point clicked: \<br\>" + circle.target.id;

}

function addPoint() {
    X = document.getElementById('x-value');
    cx = X.options[X.selectedIndex].text;

    Y = document.getElementById('y-value');
    cy = Y.options[Y.selectedIndex].text;

    var newP = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    newP.id = "(" + cx + "," + cy + ")";
    newP.setAttribute('cx', 40*cx + 50);
    newP.setAttribute('cy', 440 - 40*cy);
    newP.setAttribute('r', 10);
    newP.addEventListener("click", circleClicked);

    frame = document.getElementById('frame');
    frame.appendChild(newP)

}

for (let i = 0; i < circles.length; i++) {
	circles[i].addEventListener("click", circleClicked);
}

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// Next, open file 
d3.csv("data/scatter-data.csv").then((data) => { 

  // d3.csv parses a csv file 
  // .then() passes the data parsed from the file to a function
  // in the body of this function is where you will build your 
  // vis 

  // let's check our data
  console.log(data); //Notice this data has 3 columns
                      // to access data in a column, use .

  // add our circles with styling 
  FRAME1.selectAll("circle") 
      .data(data) // this is passed from  .then()
      .enter()  
      .append("circle")
        .attr("cx", (d) => { return d.x; }) // use x for cx
        .attr("cy", (d) => { return d.y; }) // use y for cy
        .attr("r", 10)  // set r 
        .attr("fill", "blue"); // fill by color

}); // .then is closed here 
