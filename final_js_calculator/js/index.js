$(document).ready(function() {

	var screenMemory = "0",
		memoryAll = "0",
		priorOperator,
		currentOperator;
	
	
	function updateFields() {
			$(".result").html(screenMemory);
		$(".memory").html(memoryAll);
	}

	function clearAll() {
			screenMemory = "0";
			memoryAll = "0",
			updateFields();
}	
	
	function trimHangingDecimals() {
			if(memoryAll.length !==0 && memoryAll.lastIndexOf(".") === memoryAll.length-1){
			memoryAll = memoryAll.slice(0, memoryAll.lastIndexOf("."));
			$(".memory").html(memoryAll);	
	}
}	
	
	function totalCharLength() {	
	if(screenMemory.length > 11 || memoryAll.length > 39){
		screenMemory = "0";
		memoryAll = "maximum length exceeded";
		updateFields();
	}
}
	
	// ??? HERE HERE HERE..
	
	function loopEquation() {
		
		// if an operator is used after an equation is solved, clear memory and append the output to the current operator..
		
		if(memoryAll.indexOf("=") !== -1){	
			console.log(memoryAll.indexOf("=") !== -1);
			memoryAll = memoryAll.slice(memoryAll.lastIndexOf(" "),memoryAll.length) + currentOperator;
			
			$(".result").html(currentOperator);
			$(".memory").html(memoryAll);
			}
	}
	
	function autoClear() {
		if(memoryAll.indexOf("=") !== -1){
			memoryAll = "";
			screenMemory = "";
		} else if(screenMemory === "0"){
			screenMemory = "";
			memoryAll = screenMemory;
		} else if(memoryAll === "-0"){
			screenMemory = "-";
			memoryAll = screenMemory;
		}
	}
	
	updateFields(); // UPDATE ON PAGE LOAD..
	
	// CLEAR BUTTON..
	
		$(".clear").click(function(){
		clearAll();
	});
	
	// HANDLES PERCENT INPUTS..

	$(".percent").click(function(){
		trimHangingDecimals();

		if(Number.isInteger(parseInt(memoryAll.slice(-1)))){
			if(memoryAll.lastIndexOf("(") === -1){
			screenMemory = parseInt(screenMemory) * 0.01;
			memoryAll = memoryAll.slice(0, memoryAll.lastIndexOf(" ") + 1) + screenMemory; 
			updateFields();
			totalCharLength();
			} else {
			screenMemory = parseInt(screenMemory) * 0.01;
			memoryAll = memoryAll.slice(0, memoryAll.lastIndexOf(" ") + 1) + "(" + screenMemory; 
			updateFields();
			totalCharLength();
			}
		}
	});
	
	// SOLVES THE EQUATION..
	
 $(".equals").click(function() { // evaluate the equation using your magical powers..
	 trimHangingDecimals();
	 	// account for any open parenthesis..
    if (memoryAll.lastIndexOf("(") > memoryAll.lastIndexOf(")")) {
      memoryAll += ")";
    }
    var simplifiedScreen = Math.round(eval(memoryAll) * 100) / 100,
      simplifiedMemoryAll = memoryAll + " = " + Math.round(eval(memoryAll) * 100) / 100;

    if (Number.isInteger(parseInt(memoryAll.slice(-1))) ||
      memoryAll.slice(-1) === ")") {
      // make sure there isn't an operator hanging..
      if (simplifiedScreen.toString().length < 11 ||
        simplifiedMemoryAll.toString().length < 39) {

        // make sure result does not fall off screen..
				
				screenMemory = simplifiedScreen.toString();
				memoryAll = simplifiedMemoryAll;
				updateFields();
				totalCharLength();
        //memoryAll += " = " + Math.round(eval(memoryAll) * 100) / 100;

      } else {
        screenMemory = "0";
        memoryAll = "maximum length exceeded";
        $(".result").html(0);
        $(".memory").html(memoryAll);
      }
    }
  });
	
	
	// HANDLES APPLICATION OF OPERATORS..
	
$(".operator").click(function() { // if an operator is clicked..
	   currentOperator = $(this).attr("value"); //
		 loopEquation();
		 trimHangingDecimals(); 
	
	if (Number.isInteger(parseInt(memoryAll.slice(-1)))) {
		// check if last value in memory was an integer..
	
		if (currentOperator !== priorOperator) {
			// check if last operator is not equal to current operator AND...
			$(".result").html(currentOperator);

			if(memoryAll.lastIndexOf("(") > memoryAll.lastIndexOf(" ")){
				memoryAll = memoryAll + ")" + currentOperator;
				$(".memory").html(memoryAll);			
				totalCharLength();
			}
		} else {
			screenMemory = ""; // clear display
			$(".result").html(currentOperator);
			if(memoryAll.lastIndexOf("(") > memoryAll.lastIndexOf(" ")){
				memoryAll = memoryAll + ")" + currentOperator;
				$(".memory").html(memoryAll);
			}
		}
	}
	if (Number.isInteger(parseInt(memoryAll.slice(-1)))) {

		$(".memory").html(memoryAll + currentOperator);
		memoryAll += currentOperator; // update equation to be evaluated..
	}
	priorOperator = currentOperator; // update last operator to be checked..
	screenMemory = "";
});
	
	
// Where integers 0-9 are handeled..

$(".number").click(function() {
	var buttonVal = $(this).attr("value"), // ex: 3, 5, 7...
		operator = $(".operator").attr("value"),
		atIndex = memoryAll.lastIndexOf(" ") + 1;
		autoClear();

	if(Number.isInteger(parseInt(buttonVal))){
			screenMemory += buttonVal;
			memoryAll += buttonVal;
			updateFields();
			totalCharLength();
		 }	
});
	
	// Where Decimals are handeled..
	
	$(".decimal").click(function(){
		var decimal = $(this).attr("value");
		totalCharLength();
		
		if(memoryAll === ""){
			screenMemory = "0.";
			memoryAll = "0.";
			updateFields();
		}	
		
		if(screenMemory.indexOf(".") === -1){
			screenMemory += decimal;
			memoryAll += decimal;
			updateFields();
		}
	});
	
	// CONVERTS BETWEEN POSITIVE AND NEGATIVE..
	
	$(".plusMinus").click(function(){
		console.log(screenMemory, memoryAll);
		
		var atIndex = memoryAll.lastIndexOf(" ") + 1;
		// the index of last space in "memoryAll"...
		
		if(Number.isInteger(parseInt(screenMemory))){
		
		if (screenMemory === "0" && memoryAll === "0") {
			screenMemory = "-0";
			memoryAll = screenMemory;
			updateFields();
			
		} else if(screenMemory === "-0" && memoryAll === "-0"){			
			// screenMemory is "0" purley for display pursposes. It is converted back to an empty string..
			screenMemory = "0";
			memoryAll = screenMemory;
			updateFields();		
			
		} else if(memoryAll !== "0") {
		
			if (screenMemory.indexOf("-") === -1 && memoryAll.indexOf("-") !== 0) { // converts TO NEGATIVE..
				//console.log(atIndex, memoryAll.slice(0, atIndex) + memoryAll.slice(atIndex));
				screenMemory = "-" + screenMemory;
				memoryAll = memoryAll.slice(0, atIndex) + screenMemory;
				updateFields();

			} else if (screenMemory.indexOf("-") !== -1) { // ..converts BACK..			
				screenMemory = screenMemory.slice(1);
				memoryAll = memoryAll.slice(0, atIndex) + screenMemory;
				updateFields();
			}
		}
		}		
	});
	
});