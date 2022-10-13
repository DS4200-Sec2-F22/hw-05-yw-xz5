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


for (let i = 0; i < circles.length; i++) {
	circles[i].addEventListener("click", circleClicked);
}

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

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
            .range([0, VIS_WIDTH]); 

    const Y_SCALE = d3.scaleLinear() 
            .domain([0, (MAX_Y)]) // add some padding  
            .range([VIS_HEIGHT,0]);

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
            .attr("id", (d) => { return "(" + d.x + "," + d.y + ")"; })
            .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) // use x for cx
            .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); }) // use y for cy
            .attr("r", 10)  // set r 
            .attr("fill", "blue")
            .attr("class", "circle"); // fill by color
    
    FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
            "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE).ticks(5)) 
            .attr("font-size", '20px'); 

    // Add an y-axis to the vis  
    FRAME1.append('g')  // g is a general SVG
        .attr('transform', "translate(" + MARGINS.left +
            "," + (MARGINS.bottom) +")") 
        .call(d3.axisLeft(Y_SCALE).ticks(5))
            .attr('font-size', '20px');

    FRAME1.selectAll(".circle").on("click", circleClicked);

    function addPoint() {
        console.log(1);
        X = document.getElementById('x-value');
        cx = X.options[X.selectedIndex].text;
    
        Y = document.getElementById('y-value');
        cy = Y.options[Y.selectedIndex].text;
    
        // let newPoint = {"x": cx, "y": cy};
        // let newData = [newPoint];
    
        // console.log(newData[0].x)
    
        data.push({'x': cx, 'y': cy});

        FRAME1.selectAll('.circle')
            .remove()
        FRAME1.selectAll('circle')
            .data(data) // passed from .then  
            .enter()      
            .append("circle")  
                .attr("id", (d) => { return "(" + d.x + "," + d.y + ")"; })
                .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left);}) 
                .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top);}) 
                .attr("r", 10)
                .attr("fill", "blue")
                .attr("class", "circle")
                    .on("click", circleClicked);
    
    }
    
    d3.select("#button").on("click", addPoint);

    

}); // .then is closed here 


const VIS_W = FRAME_WIDTH - MARGINS.left - MARGINS.right;
const VIS_H = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom; 

const FRAME2 = d3.select("#vis2")
                .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame"); 


function build_bar_chart() {
    d3.csv("data/bar-data.csv").then((data) => {

        const MAX_Y = d3.max(data, (d) => { return parseInt(d.amount); });

        // X scale
        const X_SCALE = d3.scaleBand() // for categorical data 
                            .range([0, VIS_W])
                            .domain(data.map(d => d.category))
                            .padding(0.2); 
        // Add X axis
        FRAME2.append("g")
                .attr("transform", "translate(" + MARGINS.left +
                    "," + (VIS_H + MARGINS.top) + ")")
                .call(d3.axisBottom(X_SCALE));  

        // Y scale 
        const Y_SCALE = d3.scaleLinear()
                            .domain([0, MAX_Y])
                            .range([VIS_H, 0]); 

        // Add Y axis 
        FRAME2.append("g")
                .attr("transform", "translate(" + MARGINS.left +
                    "," + MARGINS.top + ")")
                .call(d3.axisLeft(Y_SCALE));  

        // Add bars 
        FRAME2.selectAll("bars")
                .data(data)
                .enter()
                .append("rect")
                    .attr("x", (d) => {
                        // x pos depends on category 
                        return (X_SCALE(d.category) + MARGINS.left); 
                    })
                    .attr("y", (d) => {
                        // start of rect depends on value 
                        return (Y_SCALE(d.amount) + MARGINS.top);
                    })
                    .attr("height", (d) => {
                        // height of bar should be height of vis - value
                        return (VIS_H - Y_SCALE(d.amount));
                    })
                    .attr("width", X_SCALE.bandwidth())
                    .attr("fill", "blue") // width comes from X_SCALE for free
                    .attr("class", "bar"); 


                    const TOOLTIP = d3.select("#vis2")
                    .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
        // on mouseover, make opaque 
        TOOLTIP.style("opacity", 1); 
        console.log("mouseover");
  
    }

    function handleMousemove(event, d) {
    // position the tooltip and fill in information 
        TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
            .style("left", (event.pageX + 10) + "px") //add offset from mouse
            .style("top", (event.pageY - 50) + "px"); 
        console.log("mousemove");
    }

    function handleMouseleave(event, d) {
        // on mouseleave, make transparant again 
        TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
        .on("mouseover", handleMouseover)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave);  
    })
}

build_bar_chart();