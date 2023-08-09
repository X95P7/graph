//helpful stats
var windowPXLength = window.innerWidth;
var windowPXHeight = window.innerHeight;
var canvas;
var canvasWidth = 0.6; //in percenatges
var canvasHeight = 1;
var ctx;

//Simple functions for editng website

var leftTxtBox;
var rightTxtBox;
var c = 0;

//Graph varibles
var graphMem =[];
var pointMem = [];

//Lines
var horizontalLineDensity = 5;
var verticleLineDensity = 5;
var lineColor = "#999999";

function pushRight(content,ele){
		rightTxtBox.appendChild(createElement(ele,"r" + rightTxtBox.childElementCount, "l", content));
}

function pushLeft(content,ele){
		leftTxtBox.appendChild(createElement(ele,"l" + leftTxtBox.childElementCount, "l", content));
}

function editRight(id, replacement){
	document.getElementById("r" + id).innerHTML = replacement;
}

function editLeft(id, replacement){
	document.getElementById("l" + id).innerHTML = replacement;
}

function getRight(id){
	return document.getElementById("r" + id).innerHTML;
}

function getLeft(id){
	return document.getElementById("l" + id).innerHTML;
}


function createElement(type, id, classType, content){
	var para = document.createElement(type);
		para.id = id;
		para.className = classType; 	
		para.innerHTML = content;
	return para;
}


function basePrint(){  //test
	pushLeft("cow" , "p");
	pushRight("hello right" , "p");
}


//Math funtions

//Resizes for format changes
function pTpG(pres, w){ //wanted precentage vaule, width(t) of height(f);
	var val;
	pres = pres /100;
		if(w == true || w == "w"){
		val = pres * canvas.width;
		}
		else{
			val = pres * canvas.height; 
		}
	return val;
}

//graph drawers
function drawMain(){
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	
	changeGraphLine();
	graphManager();
	drawPoints();
}

function changeGraphLine(){
	horizontalLineDensity = document.getElementById("inputGraphLinesHorizontal").value; 
	verticleLineDensity = document.getElementById("inputGraphLinesVerticle").value;
	lineColor = document.getElementById("inputGraphLinesColor").value;
	lineThinkness = document.getElementById("inputGraphLinesThinkness").value;
	maxY = document.getElementById("inputGraphLinesYMax").value;
	maxX = document.getElementById("inputGraphLinesXMax").value;
	minY = document.getElementById("inputGraphLinesYMin").value;
	minX = document.getElementById("inputGraphLinesXMin").value;
	drawGrid(minX, minY, maxX, maxY, horizontalLineDensity, verticleLineDensity, lineThinkness, lineColor);
}

function drawGrid(minX, minY, maxX, maxY, horDensity, vertDensity, thinkness,  color){
	
	var xRange = maxX - minX;
	var yRange = maxY - minY;
	
	console.log(xRange);
	
	
	ctx.beginPath();
	
					
				//find (0,0) on the canvas
					var canvasXZeroCord = pTpG(100 * ((0 - minX) / xRange), "w");
					var canvasYZeroCord = pTpG(100-(100 * ((0 - minY) / yRange)), "h");
					
				//draws up and down lines	
				//draw orgin line
					ctx.beginPath();
					ctx.strokeStyle = color
					ctx.lineWidth = pTpG(0.45,"w");
					ctx.moveTo(canvasXZeroCord, 0);
					ctx.lineTo(canvasXZeroCord, pTpG(100,"h"));
					ctx.stroke();
					
					//determinee font size
					var fontValuatorY = pTpG((9 / (1 + Math.pow(2.71, 0.2 * ((yRange / vertDensity) - 2)))) + 1,"w");
					var fontValuatorX = pTpG((9 / (1 + Math.pow(2.71, 0.2 * ((xRange / horDensity) - 2)))) + 1,"w");
					pushLeft("\nFont sizes: \n Y: " + fontValuatorY + "\n X:" + fontValuatorX);
					var fontValuator;
						if(fontValuatorY < fontValuatorX){
						fontValuator = fontValuatorY;
					}
						else{
						fontValuator = fontValuatorX;
					}	
					
					ctx.font = fontValuator + "px Georgia";
					
					
					//draw  right of orgin
					var xDistance = pTpG(100 * (horDensity / xRange), "w") ;
						for(var i = 0; i <= Math.round(Math.abs(maxX) / horDensity); i++){
							var xCord = canvasXZeroCord + (i * xDistance);
							ctx.beginPath();
							ctx.strokeStyle = color
							ctx.lineWidth = pTpG(0.17,"w");
							ctx.moveTo(xCord, 0);
							ctx.lineTo(xCord, pTpG(100,"h"));
							ctx.fillText(horDensity * i, xCord + 0.5 * fontValuatorX, canvasYZeroCord - fontValuatorY * 0.4);
							ctx.stroke();
						}
				//draw  left of orgin
				for(var i = 1; i <= Math.round(Math.abs(minX) / horDensity); i++){
							var xCord = canvasXZeroCord - (i * xDistance);
							ctx.beginPath();
							ctx.strokeStyle = color
							ctx.lineWidth = pTpG(0.17,"w");
							ctx.moveTo(xCord, 0);
							ctx.lineTo(xCord, pTpG(100,"h"));
							ctx.fillText(-1 * horDensity * i, xCord + 0.5 * fontValuatorX, canvasYZeroCord - fontValuatorY * 0.4);
							ctx.stroke();
						}
						
				//draws horizontal lines	
			
				//draw orgin line
					ctx.beginPath();
					ctx.strokeStyle = color
					ctx.lineWidth = pTpG(0.45,"w");
					ctx.moveTo(0, canvasYZeroCord);
					ctx.lineTo(pTpG(100,"w"), canvasYZeroCord);
					ctx.stroke();
					
					
				//draw above orgin
					var yDistance = pTpG(100 * (vertDensity / yRange), "h") ;
						for(var i = 1; i <= Math.round(Math.abs(maxY) / vertDensity); i++){
							var yCord = canvasYZeroCord - (i * yDistance);
							ctx.beginPath();
							ctx.strokeStyle = color
							ctx.lineWidth = pTpG(0.17,"w");
							ctx.moveTo(0,yCord);
							ctx.lineTo(pTpG(100,"w"),yCord);
							ctx.fillText(vertDensity * i, canvasXZeroCord + 0.34 * fontValuatorX, yCord - fontValuatorY * 0.4);
							ctx.stroke();
						}
				//draw below orgin
				for(var i = 1; i <= Math.round(Math.abs(minY) / vertDensity); i++){
							var yCord = canvasYZeroCord + (i * yDistance);
							ctx.beginPath();
							ctx.strokeStyle = color
							ctx.lineWidth = pTpG(0.17,"w");
							ctx.moveTo(0,yCord);
							ctx.lineTo(pTpG(100,"w"),yCord);
							ctx.fillText(-1 * vertDensity * i, canvasXZeroCord + 0.34 * fontValuatorX, yCord - fontValuatorY * 0.4);
							ctx.stroke();
						}
	
}

function cordPoint(x,y){
	
	maxY = document.getElementById("inputGraphLinesYMax").value;
	maxX = document.getElementById("inputGraphLinesXMax").value;
	minY = document.getElementById("inputGraphLinesYMin").value;
	minX = document.getElementById("inputGraphLinesXMin").value;
	
	var xRange = maxX - minX;
	var yRange = maxY - minY;
	
	var trueX = pTpG(100 * ((x - minX) / xRange), "w");
	var trueY = pTpG(100-(100 * ((y - minY) / yRange)), "h");
	
	return [trueX,trueY];
}

function drawPoints(){
	for(var i = 0; i < pointMem.length; i++){
		
		var xPoint = pointMem[i][0];
		var yPoint = pointMem[i][1];
		var [xPointInCanvas, yPointInCanvas] = cordPoint(xPoint,yPoint);

		
		ctx.beginPath();
		ctx.arc(xPointInCanvas, yPointInCanvas, pointMem[i][2], 0, 2 * Math.PI);
		ctx.fillStyle = pointMem[i][3];
		ctx.fill();
		pushRight("Point drawn at (" + xPoint + "," + yPoint + ")","p");

	}
}
//cord is from the cordpoint function
function drawPoint(cord,color){
		ctx.beginPath();
		ctx.arc(cord[0], cord[1], 5, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
		pushRight("Point drawn at (" + cord[0] + "," + cord[1] + ")","p");
}

//cordA and cordB are from the cordpoint function
function drawLine(cordA, cordB, color, strokeWeight){
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = strokeWeight;
	ctx.moveTo(cordA[0], cordA[1]);
	ctx.lineTo(cordB[0], cordB[1]);
	ctx.stroke();
	pushRight("Line drawn from (" + cordA[0] + "," + cordA[1] + ")" + " to (" + cordB[0] + "," + cordB[1] + ")" ,"p");
}
//equation is gotten from the graph manager
//test with 
function drawGraph(equationFull, stepSize, color, strokeWeight ){
	var maxX = document.getElementById("inputGraphLinesXMax").value;
	var minX = document.getElementById("inputGraphLinesXMin").value;
	var xRange = maxX - minX;
	var stepCount = xRange / stepSize;

	//get first step 
	var replacerBase = parseFloat(minX);
	var equationBase = equationFull[0];
	var reworkedEquationBase = varToNumOf(equationBase,"x",parseFloat(replacerBase),true);
	console.log(reworkedEquationBase);
	var calculatedEquationBase = simplifyList(reworkedEquationBase[0]);
	var previousStep = cordPoint(replacerBase,calculatedEquationBase[0][0]);

	for(var j = 0 ; j <= reworkedEquationBase[2].length; j++){
				equationBase[reworkedEquationBase[2][j]] = reworkedEquationBase[1][j];
			}
	
	if(equationFull[1] = ["y",["var", 1 , 1, ""]]){
		for(var i = 0; i < stepCount; i++){
			var replacer = (parseFloat(minX) + (i * stepSize));
			var equation = equationFull[0];
			var reworkedEquation = varToNumOf(equation,"x",parseFloat(replacer),true);
			var calculatedEquation = simplifyList(reworkedEquation[0]);
			var cordPoint_ = cordPoint(replacer, calculatedEquation[0][0]);
			console.log(reworkedEquation);
			drawLine(previousStep, cordPoint_ , color, strokeWeight);
			previousStep = cordPoint_;
			for(var j= 0 ; j < reworkedEquation[2].length; j++){
				equation[reworkedEquation[2][j]] = reworkedEquation[1][j];
			}
		}
	}
	
	
}

function pointManager(){
	var list = document.getElementById("pointInputs");

	var nodeCount = list.childNodes.length;
		
	if(document.getElementById("pointInput" + nodeCount).value != ""){
		
		var paraNode = document.createElement("p");
		paraNode.id = "point" + (nodeCount + 1);
		//textbox
		var node = document.createElement("input");
		node.type = "text";
		node.onchange = function() {pointManager()};
		node.id = "pointInput" + (nodeCount + 1);
		//colorbox
		var colorNode = document.createElement("input");
		colorNode.type = "color";
		pointColorInput1.value = "#303030";
		colorNode.onchange = function() {pointManager()};
		colorNode.id = "pointColorInput" + (nodeCount + 1);
		
		paraNode.appendChild(node);
		paraNode.appendChild(colorNode);
		
		document.getElementById("pointInputs").appendChild(paraNode);
		
	}
	
	for(var i = 0; i < nodeCount; i++){
		var txt = document.getElementById("pointInput" + (i+1)).value.replace(/[()a-z]/g,"");
		var spliceHere = txt.indexOf(",");
		pointMem[i] = [];
		pointMem[i][0] = txt.slice(0,spliceHere);
		pointMem[i][1] = txt.slice(spliceHere + 1);
		pointMem[i][2] = pTpG(0.5,"w");
		pointMem[i][3] = document.getElementById("pointColorInput" + (i + 1)).value;
	}
	drawPoints();
	
}

//background stat updates
function resizeCanvasG(){
	windowPXLength = window.innerWidth;
    windowPXHeight = window.innerHeight;
	
	canvas.width =  canvasWidth * windowPXLength;  //percent of screen to be taken up
	canvas.height = canvasHeight *  windowPXHeight;
	
	//redraw static graph 
	drawMain();
	//function xxx here
}

function changeGraphDimensions(){
	canvasWidth = document.getElementById("inputGraphWidth").value / 100; //in percenatges
	canvasHeight = document.getElementById("inputGraphHeight").value / 100;
	resizeCanvasG();
	document.getElementById("graphSizeInfo").innerHTML = "Width: " + Math.floor(canvasWidth * 100)  + "% Height: " + Math.floor(canvasHeight * 100) + "%";
}

//window loaders
function onLoad(){
	//change proportions for qol
	window.addEventListener('resize', resizeCanvasG, false);
	window.addEventListener('orientationchange', resizeCanvasG, false); 
	
	//get document elements
	canvas = document.getElementById("gCanvas");
	canvas.width =  canvasWidth * windowPXLength;  
	canvas.height = canvasHeight *  windowPXHeight;
	ctx = canvas.getContext("2d");
	leftTxtBox = document.getElementById("left-txt"); 
	rightTxtBox = document.getElementById("right-txt");
	console.log("main");
	drawMain();
} 

function getXRange(){
	var maxX = document.getElementById("inputGraphLinesXMax").value;
	var minX = document.getElementById("inputGraphLinesXMin").value;
	
	var xRange = maxX - minX;
	return xRange;
}

