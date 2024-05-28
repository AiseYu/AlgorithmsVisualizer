import React, { useState } from 'react';


function Edge({source , destination , weight}){
    
    


    return(
        <>
        <svg height={destination.y - source.y} width={destination.x - source.x}>
            <line x1={source.x} y1={source.y} x2={destination.x} y2={destination.y} style={{ stroke: 'red', strokeWidth: 2, position:'absolute' }}  />
        </svg>
        </>

    );
}

export default Edge;