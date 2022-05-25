// For functions that are for convenience

// Splits the term to a more readable format
function termToText(term){
    const termElements = term.split("/");
    let term_msg = "";

    if(termElements[0] === 'l'){
        term_msg += "1st Semester of A.Y. 20" + termElements[1] + "-20" + termElements[2]; 
    }else{
        term_msg += "2nd Semester of A.Y. 20" + termElements[1] + "-20" + termElements[2]; 
    }

}

module.exports={termToText}