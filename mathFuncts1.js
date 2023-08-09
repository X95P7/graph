function graphManager(){
	var list = document.getElementById("graphInputs");

	var nodeCount = list.childNodes.length;
		
	if(document.getElementById("graphInput" + nodeCount).value != ""){
		
		var paraNode = document.createElement("p");
		paraNode.id = "graph" + (nodeCount + 1);
		//textbox
		var node = document.createElement("input");
		node.type = "text";
		node.onchange = function() {drawMain()};
		node.id = "graphInput" + (nodeCount + 1);
		//colorbox
		var colorNode = document.createElement("input");
		colorNode.type = "color";
		pointColorInput1.value = "#303030";
		colorNode.onchange = function() {drawMain()};
		colorNode.id = "graphColorInput" + (nodeCount + 1);
		
		paraNode.appendChild(node);
		paraNode.appendChild(colorNode);
		
		document.getElementById("graphInputs").appendChild(paraNode);
		
	}
	
	for(var i = 0; i < nodeCount; i++){
		var equation = document.getElementById("graphInput" + (i+1)).value;
		var color = document.getElementById("graphColorInput" + (i+1)).value;
		console.log(color);
		var solvedEquation = functionBreakDown(equation);
		pushRight(solvedEquation, "p");
		drawGraph(solvedEquation, getXRange() / 200, color, pTpG(0.4,"w"));
		
	}
}

function functionBreakDown(equation){
	var spliceHere = equation.indexOf("=");
	var left = equation.slice(0,spliceHere);
	var right = equation.slice(spliceHere);
	
	var symbolListLeft = breakList(left);
	var symbolListRight = breakList(right);
	console.log(symbolListLeft);
	
	var simplifyListLeft = simplifyList(symbolListLeft);
	var simplifyListRight = simplifyList(symbolListRight);
	//at this point there are only +'s and -'s but like terms are still seperated, this is not a problem though 
	return [simplifyListLeft, simplifyListRight] ;
}
//functionBreakDown("33*x^2+12^2*3=")
//para test breakList("(x+4)(x-2)") functionBreakDown("(x+4)(x-2)=y")
//breakList("(x+4)(x-2)(x+2)")
function breakList(equation){
	var equationList = [];
	var paraCount = 0;
	var paraIndex;
			//goes through each char in the equation andn determines what type of object it should be, for numbers it skips chars until the whole number is in its object
			for(var j = 0; j < equation.length; j++){
				//equationList[equationList.length];
				//symbols
				if(/([()\^\-*+/!|])+/g.test(equation.charAt(j)) == true){
					console.log("sybm");
					//paraenthase control
					if(equation.charAt(j) == "("){
						console.log("para");
						var openCount = 1;
						var closeCount = 0;
						var k = j + 1;
						
						while(openCount != closeCount || k > equation.length){
							if(equation.charAt(k) == "("){
								openCount++;
							}
							if(equation.charAt(k) == ")"){
								closeCount++;
							}
							console.log(k);
							k++;
						} 
						if(!(k > equation.length)){
							//add multpiplication sign if needed   
							if(equationList.length >= 1 && (equationList[equationList.length - 1][1][0] == "num" || equationList[equationList.length - 1][1][0] == "var" || equation.charAt(j-1) == ")")){
								equationList[equationList.length] = ["*",["symb",0,0,""]];
							}
							
						var paraString = breakList(equation.slice(j+1,k-1));
						console.log(paraString)
						equationList[equationList.length] = [paraString,["para",1,1,""]];
						j += k - 1 - j;
						}
						else{
							console.log("paras not closed");
						}
					}

					//other symbols
					else{
						console.log("other");
					equationList[equationList.length] = [equation.charAt(j),["symb",0,0,""]];
					}
				}	
				//numbers
				else if(/([0-9])+/g.test(equation.charAt(j)) == true){
					var numString = "";
					console.log("num");
						while(/([0-9.])+/g.test(equation.charAt(j)) == true && j < equation.length){
							numString = numString + equation.charAt(j);
							j++;
						}
						equationList[equationList.length] = [numString,["num",1 ,numString,""]];
						j--;
				}
				//varibles
				else if(/([a-z])+/g.test(equation.charAt(j)) == true){
						//makes sure varible coeffiecents work wihtout * sign
						console.log("var");
						if(equationList.length >= 1 && equationList[equationList.length - 1][1][0] == "num"){
							equationList[equationList.length] = ["*",["symb",0,0,""]];
						}
					equationList[equationList.length] = [equation.charAt(j),["var",1,1,""]];
				}
				else{
					console.log("error: bad charachter");
				}
			console.log(equationList[equationList.length]);
		}
console.log(equationList);
return equationList;
}

function simplifyList(equation){
		console.log(equation);
		//para Check
		for(var k = 0; k < equation.length; k++){
				if(equation[k][1][0] == "para"){
					console.log("simp Para");
					equation[k]  = [simplifyList(equation[k][0]),["para",1,1,""]]; 
					if(equation[k][0].length == 1){
						equation[k] = equation[k][0][0];
					}
				}
		}
		
		var specialSymbols = ["^","!","/","*","+","-"];
			for(var i = 0; i < specialSymbols.length; i++){
					for(var j = 0; j < equation.length; j++){
						if(equation[j][0] == specialSymbols[i]){
							//skip add and sub fails
							var fair = true;
							//skip para multii
							var fair2 = true;
							if(i == 0){
								equation = pow(equation, j);
							}
							else if(i == 1){
								equation = factorial(equation, j);
							}
							else if(i == 2){
								equation = divide(equation,  j);
							}
							else if(i == 3){
								[equation,fair] = multiply(equation, j);
							}
							else if(i == 4){
								[equation,fair] = add(equation, j);
							}
							else if(i == 5){
								[equation,fair] = subtract(equation, j);
							}
							if(fair){i--;}
							//if(!fair2){j++;}
						}
					}
				}
				console.log(equation);
		return equation;
	
} 

	
	function pow(equation,index){
		console.log("run power");
		if(equation[index + 1][1][0] == "num"){
			if(equation[index - 1][1][0] == "num"){
				equation[index - 1][0] = Math.pow(equation[index - 1][0],equation[index + 1][0]);
				equation[index - 1][1][2] = equation[index - 1][0];
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
			else if(equation[index - 1][1][0] == "var"){
				equation[index - 1][1][1] *= equation[index + 1][0];
				
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
			else{
				console.log("power function prooblem");
			}
		}
		else{
			console.log("power function problem 2");
		}
		return equation;
	}
	
	function factorial(equation, index){
		//not implimentated, intend to use taylor series
		return equation;
	}
	
	function multiply(equation, index){
		console.log("run muult");
		var fairRun = true;
		if(equation[index + 1][1][0] == "num"){
			if(equation[index - 1][1][0] == "num"){
				//both numbers
				equation[index - 1][0] = equation[index - 1][0] * equation[index + 1][0];  
				equation[index - 1][1][2] = equation[index - 1][0];
				
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
			else if(equation[index - 1][1][0] == "var"){
				//var times num
				equation[index - 1][1][2] *= equation[index + 1][0]; 
				
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
			else{
				console.log("multi function prooblem");
			}
		}
		else{ 
			if(equation[index + 1][1][0] == "var" && (equation[index - 1][1][0] == "num")){
				//num times var
				equation[index + 1][1][2] *= equation[index- 1][0]; 
				
				var fisrtHalf = equation.slice(0, index - 1);
				var secondHalf = equation.slice(index + 1);
				equation = fisrtHalf.concat(secondHalf);
			}
			else{
			if(!(equation[index + 1][1][0] == "para" || (equation[index - 1][1][0] == "para"))){
			console.log("multi function problem 2");
			fairRun = false;
			console.log(equation);
			}
			else{
				console.log("multi function skiipped");
				fairRun = false;
			}
			}
		}
		return [equation,fairRun];
	}
	
	function divide(equation, index){
		console.log("run divide");
		if(equation[index + 1][1][0] == "num"){
			if(equation[index - 1][1][0] == "num"){
				//both numbers
				equation[index - 1][0] = equation[index - 1][0] / equation[index + 1][0];  
				equation[index - 1][1][2] = equation[index - 1][0];
				
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
			else if(equation[index - 1][1][0] == "var"){
				//var divide num
				equation[index - 1][1][2] /= equation[index + 1][0]; 
				
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
			else{
				console.log("multi function prooblem");
			}
		}
		else{ 
			if(equation[index + 1][1][0] == "var" && (equation[index - 1][1][0] == "num")){
				//num times var
				equation[index + 1][1][2] /= equation[index- 1][0]; 
				
				var fisrtHalf = equation.slice(0, index - 1);
				var secondHalf = equation.slice(index + 1);
				equation = fisrtHalf.concat(secondHalf);
			}
			else{
			console.log("multi function problem 2");
			}
		}
		return equation;
	}
	
	function add(equation, index){
		console.log("run add");
		var fairRun = true;
		if(equation[index + 1][1][0] == "num" && equation[index - 1][1][0] == "num"){
				equation[index - 1][0] = parseFloat(equation[index - 1][0]) + parseFloat(equation[index + 1][0]);
				equation[index - 1][1][2] = equation[index - 1][0];
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
		else if(equation[index + 1][1][0] == "var" && equation[index - 1][1][0] == "var" && equation[index + 1][1][1] == equation[index - 1][1][1]){
					equation[index - 1][1][2] = equation[index - 1][1][2] + equation[index + 1][1][2];
					var fisrtHalf = equation.slice(0, index);
					var secondHalf = equation.slice(index + 2);
					equation = fisrtHalf.concat(secondHalf);
			}
		else{
				fairRun = false;
			}
			
		return [equation,fairRun];
	}
	
	function subtract(equation, index){
		var fairRun = true;
		if(equation[index + 1][1][0] == "num" && equation[index - 1][1][0] == "num"){
				equation[index - 1][0] = equation[index - 1][0] - equation[index + 1][0];
				equation[index - 1][1][1] = equation[index - 1][0];
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
		else if(equation[index + 1][1][0] == "var" && equation[index - 1][1][0] == "var" && equation[index + 1][1][1] == equation[index - 1][1][1]){
				equation[index - 1][1][2] = equation[index - 1][1][2] - equation[index + 1][1][2];
				var fisrtHalf = equation.slice(0, index);
				var secondHalf = equation.slice(index + 2);
				equation = fisrtHalf.concat(secondHalf);
			}
		else{
			fairRun = false;
		}
			
		return [equation,fairRun];
	}
	//replaces all equation varibles with name "varValue" to num objects of value replaceValue
	//testt varToNumOf(functionBreakDown("(x+4)(x-2)=y")[0],"x",5,true)
	function varToNumOf(equation, varValue, replaceValue,saver){
		console.log("varNum");
		console.log(equation);
		var buildBack;
		if(saver){ buildBack = JSON.parse(JSON.stringify(equation));}
		var index = [];
		for(var i = 0; i < equation.length; i++){
			
			//buildBack[buildBack.length] = equation[i];
				index[index.length] = i;
			
			if(equation[i][1][0] == "para"){
				console.log("everY");
				equation[i] = [varToNumOf(equation[i][0],varValue,replaceValue,false)[0], ["para",1,1,""]];
			}
			else if(equation[i][0] == varValue){
				var numCalc = Math.pow(replaceValue * parseFloat(equation[i][1][2]),parseFloat(equation[i][1][1]));
				
				equation[i] = [numCalc,["num",1,numCalc,""]];
			}
		}
		console.log("done")
		console.log(equation);
		return [equation, buildBack, index];
	}
	
	