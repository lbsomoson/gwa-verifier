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



function createNotes(errors, allErrors, sheet_names, index){
    let notes_msg = 'Notes: '
    if(errors.length){
        allErrors[sheet_names[index]] = errors
        for(let count=0; count<errors.length; count++){
            if(count === (errors.length)-1){
                notes_msg += errors[count]
            }else{
                notes_msg += errors[count] + ", "
            }

        }
    }else{
        notes_msg = 'Notes: None'
    }

    return notes_msg
}

function listFileErrors(allErrors, all_err_msg, filename_err_msg, err_msg_arr){
    if(Object.keys(allErrors).length){
        console.log("Errors on the following files:")
        Object.keys(allErrors).forEach((key) => {
            let err_msg = key + ": ";
            for(let i=0; i<allErrors[key].length; i++){
                if(i === (allErrors[key].length)-1){
                    err_msg += allErrors[key][i]
                }else{
                    err_msg += allErrors[key][i] + ", "
                }
    
            }
            console.log(err_msg);
            all_err_msg.push(err_msg);
        })
    }else{
        let err_msg = "No warnings";
        all_err_msg.push(err_msg);
    }
    filename_err_msg.push(all_err_msg);
    err_msg_arr.push(filename_err_msg);
}



module.exports={termToText, createNotes, listFileErrors}