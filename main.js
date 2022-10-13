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
    // find max X
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });

    // find max Y
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE = d3.scaleLinear() 
            .domain([0, (MAX_X)]) // add some padding  
            .range([0, FRAME_WIDTH]); 

    const Y_SCALE = d3.scaleLinear() 
            .domain([0, (MAX_Y)]) // add some padding  
            .range([FRAME_HEIGHT,0]);

  // d3.csv parses a csv file 
  // .then() passes the data parsed from the file to a function
  // in the body of this function is where you will build your 
  // vis 

  // let's check our data
    console.log(1);
    console.log(MAX_X); //Notice this data has 3 columns
                      // to access data in a column, use .

  // add our circles with styling 
    FRAME1.selectAll("circle") 
            .data(data) // this is passed from  .then()
            .enter()  
            .append("circle")
            .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) // use x for cx
            .attr("cy", (d) => { return (Y_SCLAE(d.y) + MARGINS.top); }) // use y for cy
            .attr("r", 10)  // set r 
            .attr("fill", "blue")
            .attr("class", "circle"); // fill by color
    
    FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
            "," + (FRAME_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE).ticks(4)) 
            .attr("font-size", '20px'); 

    // Add an y-axis to the vis  
    FRAME1.append('g')  // g is a general SVG
        .attr('transform', "translate(" + MARGINS.left +
            "," + (MARGINS.bottom) +")") 
        .call(d3.axisLeft(Y_SCALE).ticks(4))
            .attr('font-size', '20px');

    FRAME1.selectAll(".circle").on("click", circleClicked);

}); // .then is closed here 
