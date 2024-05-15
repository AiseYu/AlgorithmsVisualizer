import React, { useState } from 'react';

function Node({


}){

    return(
        <>
        <svg height={size} width={size}>
        <circle r={size/2} cx={size/2} cy={size/2} fill="red" />
        </svg>
        </>

    );
}

export default Node;