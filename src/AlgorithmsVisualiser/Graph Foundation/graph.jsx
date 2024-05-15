import Space from "./space";
import React, { useState } from 'react';

function Graph(){

    const [buttonValue, setButtonValue] = useState('');

    const handleButtonClick = (value) => {
        setButtonValue(value);
    };
    
    return(

        <>
        <div>
            <button onClick={()=>handleButtonClick("s1")}>NODE</button>
            <button onClick={()=>handleButtonClick("s2")}>EDGE</button>
            <button onClick={()=>handleButtonClick("s3")}>ERASE</button>
            <Space/>
        
        </div>
        </>

    );
}

export default Graph;