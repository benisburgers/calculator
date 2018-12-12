
  let digitsArray = [];
  let digitsString = "";
  let displayOutput = "";
  let pressedButtonsArray = [];
  let pressedButtonsString = "";
  let visibleArray = [];
  let visibleText = "";
  let result = "";
  let displayTextWidth;
  let numberOfCharacters;
  let pixelsPerCharacter;
  let numberOfVisibleCharacters;
  let outerDivWidth
  let ellipsis = String.fromCharCode(8230)

//Measure display width (outerDivWidth) when loading or resizing window//
  window.onload = function() {
    outerDivWidth = document.getElementById("outerDiv").offsetWidth - 20;
  };

  window.onresize = function() {
    outerDivWidth = document.getElementById("outerDiv").offsetWidth - 20;
    limitDisplayDigits();
  };

//Convert pressed keyboard button to character, and run respective function (see bellow)//
  document.onkeypress = function(event) {
  let pressedKey = event.which || event.keyCode;
  let convertedKey = String.fromCharCode(pressedKey);
  if (/[0123456789]/.test(convertedKey)) {
    clickNumberButton(convertedKey)
  }
  if (convertedKey == "+") {
    clickOperationButton('+','+');
  }
  if (convertedKey == "-") {
    clickOperationButton('-','-');
  }
  if (convertedKey == "*") {
    clickOperationButton('*','×')
  }
  if (convertedKey == "/") {
    clickOperationButton('/','÷');
  };
  if (convertedKey == "=") {
    equate();
  }
};


function clickNumberButton(button) {
  //User has pressed "=" just before//
  if (pressedButtonsArray[pressedButtonsArray.length-1] == "=") {
    //Restart equation//
    pressedButtonsArray = [];
    pressedButtonsArray.push(button);
    pressedButtonsString = pressedButtonsArray.join("");

    visibleArray = [];
    visibleArray.push(button);
    visibleText = visibleArray.join("");

    document.getElementById("displayText").innerHTML = visibleText;
    limitDisplayDigits();
  }
  //Equation hasn't happened//
  else {
    //Continue with existing equation//
    pressedButtonsArray.push(button);
    pressedButtonsString = pressedButtonsArray.join("");

    visibleArray.push(button);
    visibleText = visibleArray.join("");

    document.getElementById("displayText").innerHTML = visibleText;
    limitDisplayDigits();
  }
}

function clickOperationButton(button, symbol) {
  //Only add operationButton to equation if bellow conditions are met://
    // equation must include at least one character AND previously entered character must be a number//
    // OR the currently entered button must be a "-" AND the previously entered character must NOT be a minus//
  if (pressedButtonsArray.length > 0 && (/[0123456789=]/.test(pressedButtonsArray[pressedButtonsArray.length-1])) || (button == "-" && pressedButtonsArray[pressedButtonsArray.length-1] !== "-")) {
    //If the previously entered character was "=", i.e equation has been execution, restart equation//
    if (pressedButtonsArray[pressedButtonsArray.length-1] == "=") {
      pressedButtonsArray = [];
      pressedButtonsArray.push(result, button);
      pressedButtonsString = pressedButtonsArray.join("");

      visibleArray = [];
      visibleArray.push(result, symbol);
      visibleText = visibleArray.join("");

      document.getElementById("displayText").innerHTML = visibleText;
      limitDisplayDigits();
    }
    //Else continue current equation
    else {
      pressedButtonsArray.push(button);
      pressedButtonsString = pressedButtonsArray.join("");

      visibleArray.push(symbol);
      visibleText = visibleArray.join("");

      document.getElementById("displayText").innerHTML = visibleText;
      limitDisplayDigits();
    }
  }
}

function equate() {
  //Only run equate() if there have been more than 0 entered characters AND the previously entered character is a number//
  if (pressedButtonsArray.length > 0 && (/[0123456789]/.test(pressedButtonsArray[pressedButtonsArray.length-1]))) {
    pressedButtonsArray.push("=");
    result = eval(pressedButtonsString);
    pressedButtonsString = result.toString();

    visibleArray.push("=");
    visibleText = result.toString();

    document.getElementById("displayText").innerHTML = visibleText;
    limitDisplayDigits("equation");
  }
}

function del() {
  //if previously entered character is "=", restart equation, i.e. cancel
  if (pressedButtonsArray[pressedButtonsArray.length-1] == "=") {
    pressedButtonsArray = [];
    pressedButtonsString = "";

    visibleArray = [];
    visibleText = "";
    result = "";

    document.getElementById("displayText").innerHTML = "";
    limitDisplayDigits();
  }
  else {
    //remove previously entered character//
    pressedButtonsArray.splice(-1,1);
    pressedButtonsString = pressedButtonsArray.join("");

    visibleArray.splice(-1,1)
    visibleText = visibleArray.join("");

    document.getElementById("displayText").innerHTML = visibleText;
    limitDisplayDigits();
  }
}

function cancel() {
  //restart equation, i.e. empty arrays//
  pressedButtonsArray = [];
  pressedButtonsString = "";
  visibleArray = [];
  visibleText = "";
  result = "";

  limitDisplayDigits();
  document.getElementById("displayText").innerHTML = "";
}

function limitDisplayDigits(type) {
  //Take into consideration padding//
  //Measure how wide the display is//
  outerDivWidth = document.getElementById("outerDiv").offsetWidth - 20;

  //Masure how wide the div containing the characters is//
  displayTextWidth = document.getElementById("displayText").offsetWidth;
  //How many characters have been written?//
  numberOfCharacters = visibleText.length;
  //How wide is the average character?//
  pixelsPerCharacter = displayTextWidth/numberOfCharacters;
  //How many characters fit into the display?//
  numberOfVisibleCharacters = Math.floor(outerDivWidth / pixelsPerCharacter);
  //search for e in visibleText//
  whereIsE = visibleText.indexOf("e")


  //If previously entred button was "="//
  //The whole whereIsE procedure ensures that e is always displayed as part of the solution even on small displays//
  if (type == "equation") {
    //If more characters have been typed than can be displayed...//
    if (numberOfCharacters > numberOfVisibleCharacters) {
      //check whether number e (mathemtical constant) exists in solution//
        //if not.../
      if (whereIsE == "-1") {
        //Replace the last character in visibleText with ellipsis ("…") and convert to displayText//
        displayText = visibleText.slice(0,numberOfVisibleCharacters-1) + ellipsis;
        document.getElementById("displayText").innerHTML = displayText;
      }
      else {
        //If 'e' does exist in solution//
        //howLongIsE equals the number of characters following e + e itself//
        howLongIsE = numberOfCharacters - whereIsE
        //Create string with first few characters from visibleText and all characters after and including e, //
        // while ensuring that displayText does not numberOfVisibleCharacters//
        displayText = visibleText.slice(0,numberOfVisibleCharacters-howLongIsE) + visibleText.slice(-howLongIsE)
        document.getElementById("displayText").innerHTML = displayText;
        console.log("Theres an e")
      }
    }
    else {
      displayText = visibleText.slice(0,numberOfVisibleCharacters)
      document.getElementById("displayText").innerHTML = displayText;
    }
  }
  else {
    displayText = visibleText.slice(-numberOfVisibleCharacters)
    document.getElementById("displayText").innerHTML = displayText;
  }
}
