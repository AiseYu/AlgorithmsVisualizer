import React, {useState} from "react";
import './sorting.css'

function Sorting(){
    const [arr , setArr]  = useState([]);
    const [arrSize , setSize] = useState(document.getElementById('arrSize'));
    const [comparisions , setComparisions] = useState(0);

    const resetArray = () => {
        let array = []
        updateSize();
        for(let i = 0 ;i< arrSize;  i++){
            array.push({id: i , value: randomInt(10 , 500)});
        }
        setArr(array);
       
    }

    // const mergeSort = async (array) => {
    //     console.log()
    //     if (array.length === 1) return array;
    //     const mid = Math.floor(array.length /2);
    //     const leftArr =  await mergeSort(array.slice(0 , mid));
    //     const rightArr = await mergeSort(array.slice(mid , array.length));
    //     let sortedArr = array;
        
    //     let l=0;
    //     let r=0;
    //     let x;
        
    //     while ( l < leftArr.length && r < rightArr.length){
    //         console.log(sortedArr)
    //         if (leftArr[l].value <= rightArr[r].value){
    //             l++;
    //         }
    //         else{
    //             x = sortedArr.splice(r,1);
    //             sortedArr = sortedArr.splice(l , 0, x);
    //             r++;
    //         }

    //     }
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    
    //     while ( l < leftArr.length) sortedArr.push(leftArr[l++]);
    //     while ( r < rightArr.length) sortedArr.push(rightArr[r++]);
        
    //     return sortedArr;
    
    // };
    const mergeSort = async (arr) => {
        const n = arr.length;
        let compare = 0;
        for (let currSize = 1; currSize < n; currSize = 2 * currSize) {
          for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * currSize) {
            const mid = Math.min(leftStart + currSize -1, n - 1);
            const rightEnd = Math.min(leftStart + 2 * currSize - 1, n - 1);
            compare += await merge(arr, leftStart, mid, rightEnd);
          }
        }
        setComparisions(compare);
      };
      
      // Merge Function
      const merge = async (arr, leftStart, mid, rightEnd) => {
        const leftEnd = mid;
        const rightStart = mid+1;
        let color1 = 'white';
        let color2 = 'rgb(13, 255, 0)';
        // if (arr[leftEnd] <= arr[rightStart]) {
        //   return;
        // }
        
        let tempArr = [];
    
        let left = leftStart;
        let right = rightStart;
        const arrayBars = document.getElementsByClassName('arrElement');
        let comparisionCount =0;
        for(let i = leftStart ; i<= rightEnd; i++){
            const bar1 = arrayBars[i].style;
            bar1.backgroundColor = color1;
        }
        
        await new Promise((resolve) => setTimeout(resolve, 300));
        while (left <= leftEnd && right <= rightEnd){
            comparisionCount= comparisionCount+1;
            if (arr[left].value <= arr[right].value) {
            tempArr.push(arr[left++].value);
            } else {
            tempArr.push(arr[right++].value);
            }
        }
        
        while (left <= leftEnd) {
          tempArr.push(arr[left++].value);
        }
        
        while (right <= rightEnd) {
          tempArr.push(arr[right++].value);
        }
    
        for (let i = leftStart, j = 0; i <= rightEnd; i++, j++) {
          arr[i].value = tempArr[j];
        }
        for(let i = leftStart ; i<= rightEnd; i++){
            const bar1 = arrayBars[i].style;
            bar1.backgroundColor = color2;
        }
        
        setArr([...arr]);
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        for(let i =0 ; i<arr.length ; i++){
            const bar1 = arrayBars[i].style;
            bar1.backgroundColor = 'rgb(153, 0, 255)';
        }
        return comparisionCount;
        
    };

    const updateSize = () => {
        let x = document.getElementById("arrSize").value;
        setSize(x);
    }
    
    const sortArr = async () => {
        await mergeSort(arr);
        
    }

    
    
    return(
        <>
        <div>
        <div className="sortingInterface">
            <button onClick={resetArray}>RESET ARRAY</button>
            <button onClick={sortArr}>MERGE SORT</button>
            
            <div className="slider"><label for= "arrSize">ARRAY SIZE</label><input type="range" min="16" max="180" id="arrSize" onChange={resetArray}></input></div>
            <h5>Comparisions {comparisions}</h5>
            <h5>Number of Elements: {arrSize}</h5>
        </div>
        <div className="arrContainer">{arr.map((item , idx)=> 
            (<div className = "arrElement" key= {idx} style={{height : `${item.value}px`, width: `${Math.floor(400/arrSize)}px` , transition: 'height 0.5s' , left: `${50+ item.id*(Math.floor(400/arrSize)+1)}px`}}></div>)
            )}
        
        </div>
        </div>
        </>
        
    );
}

export default Sorting

function randomInt(min , max){
    return Math.floor(Math.random()*(max - min + 1)+ min);
}   

