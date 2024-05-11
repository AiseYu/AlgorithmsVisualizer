import React, {useState} from "react";
import './sorting.css'
import { useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from "react-chartjs-2";


function Sorting(){

    const [arr , setArr]  = useState([]);
    const [arrSize , setSize] = useState(document.getElementById('arrSize'));
    const [comparisions , setComparisions] = useState(0);
    const [sortType , setSortType] = useState();
    const [speed , setSpeed] = useState(10);
    const [TimeTaken , setTimeTaken] = useState(0);



    //CHART
    const [data , setData] = useState({
        labels: [],
        datasets: [
            {
            label: 'MERGE SORT',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
            },
            {
            label: 'QUICK SORT',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 0, 192)',
            tension: 0.1
            },
            {
                label: 'BUBBLE SORT',
                data: [],
                fill: false,
                borderColor: 'rgb(200, 0, 0)',
                tension: 0.1
            },
        ],
        });
    


    const sortSimulate = () =>{
        let array1 = [];
        let array2 = [];
        let array3 = [];

        let TimeTaken = 0;
        let mergeSortData = [];
        let quickSortData  = [];
        let bubbleSortData = [];
        let label_array = [];
        

        for(let i=10 ; i<=400; i+=10){
            label_array.push(i);

            for( let j= 0 ; j< i ; j+=1){
                array1.push(randomInt(10, 500));
                array2.push(randomInt(10, 500));
                array3.push(randomInt(10, 500));
            }

            TimeTaken = measureTimeTaken(mergeSort2, array1);
            mergeSortData = [...mergeSortData , TimeTaken];
            

            TimeTaken = measureTimeTaken(quickSort2, array2);
            quickSortData = [...quickSortData ,TimeTaken];
            
            TimeTaken = measureTimeTaken(bubbleSort2, array3);
            bubbleSortData = [...bubbleSortData , TimeTaken];
            
        }
        const newData = {
            labels: label_array,
            datasets: [
                {
                label: 'MERGE SORT',
                data: mergeSortData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
                },
                {
                label: 'QUICK SORT',
                data: quickSortData,
                fill: false,
                borderColor: 'rgb(75, 0, 192)',
                tension: 0.1
                },
                {
                    label: 'BUBBLE SORT',
                    data: bubbleSortData,
                    fill: false,
                    borderColor: 'rgb(200, 0, 0)',
                    tension: 0.1
                },
            ],
        };

        return newData;
        
    }


    const updateChart = () => {
        const x = sortSimulate();
        setData(x);
    }

    

    


    

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );
      
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'TIME(ms) vs NUMBER OF ELEMENTS',
          },
        },
      };



    
      
      
      
    

    

    

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


    //BUBBLE SORT

    const bubbleSort = async (arr) => {
        const n = arr.length;
        let swapped;
        let arrayBars = document.getElementsByClassName('arrElement');
        let block;
        let fixed;

        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                    block = arrayBars[i].style;
                    block.backgroundColor = "white";
                    block = arrayBars[i+1].style;
                    block.backgroundColor = "white";
                await new Promise((resolve) => setTimeout(resolve , 4000*(1/speed)));
                if (arr[i].value > arr[i + 1].value) {

                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                    ;
                }
                setArr([...arr]);
                    block = arrayBars[i].style;
                    block.backgroundColor = "rgb(13, 255, 0)";
                    block = arrayBars[i+1].style;
                    block.backgroundColor = "rgb(13, 255, 0)";
                await new Promise((resolve) => setTimeout(resolve , 4000*(1/speed)));
                    block = arrayBars[i].style;
                    block.backgroundColor = "rgb(153, 0, 255)";
                    block = arrayBars[i+1].style;
                    block.backgroundColor = "rgb(153, 0, 255)";
                
            }
            
        } while (swapped);
        
        
    };

    

    
    

    //QUICK SORT
    const partition = async (arr, low, high ) => {

        let pivot = arr[high].value;
        let i = low - 1;
        let arrayBars = document.getElementsByClassName('arrElement');
        let block;

        //FOR BLOCK COLOUR
        for(let k = low ; k < high ; k++){
            let block  = arrayBars[k].style;
            block.backgroundColor = 'white';
        }
        block = arrayBars[high].style;
        block.backgroundColor = 'red';
    
        await new Promise((resolve) => setTimeout(resolve , 4000*(1/speed)));

        let temp;

        for (let j = low; j < high; j++) {
            setComparisions(prevComparisions =>  prevComparisions +1)
            if (arr[j].value < pivot) {
                i++;
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp; 
            }
        }
        temp = arr[i+1];
        arr[i+1] = arr[high];
        arr[high] = temp;

        for(let k = low ; k <= high ; k++){
            let block  = arrayBars[k].style;
            block.backgroundColor = 'rgb(13, 255, 0)';
        }
        block = arrayBars[i+1].style;
        block.backgroundColor = 'red';

        setArr([...arr]);

        await new Promise((resolve) => setTimeout(resolve, 5000*(1/speed)));
        

        for(let k = low ; k < high ; k++){
            let block  = arrayBars[k].style;
            block.backgroundColor = 'rgb(153, 0, 255)';
        }
        block = arrayBars[high].style;
        block.backgroundColor = 'rgb(153, 0, 255)';

        return [i + 1 ];
    };
    
    const quickSort = async (arr, low, high ) => {
        if (low < high){
            let [pi ] = await partition(arr, low, high );
            await quickSort(arr, low, pi - 1 );
            await quickSort(arr, pi + 1, high );
            console.log(arr);
        } 
        
        
    };

    //MERGE SORT

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
        
        await new Promise((resolve) => setTimeout(resolve, 4000*(1/speed)));
        while (left <= leftEnd && right <= rightEnd){
            comparisionCount= comparisionCount+1;
            if (arr[left].value <= arr[right].value) {
            tempArr.push(arr[left++]);
            } else {
            tempArr.push(arr[right++]);
            }
        }
        
        while (left <= leftEnd) {
            tempArr.push(arr[left++]);
        }
        
        while (right <= rightEnd) {
            tempArr.push(arr[right++]);
        }

        for (let i = leftStart, j = 0; i <= rightEnd; i++, j++) {
            arr[i] = tempArr[j];
        }
        for(let i = leftStart ; i<= rightEnd; i++){
            const bar1 = arrayBars[i].style;
            bar1.backgroundColor = color2;
        }
        
        setArr([...arr]);
        await new Promise((resolve) => setTimeout(resolve, 8000*(1/speed)));
        
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
    
    const changeSortType = () => {
        let x =  document.getElementById("sortType").value;
        setSortType(x);
    }

    const sortArr = async () => {
        let TimeElapsed = 0 ;
        const TempArr = arr.map(item => item.value);
        console.log(TempArr);
        setComparisions(0);
        setTimeTaken(0);
        if (sortType === "s1"){
            await mergeSort(arr);

            
            TimeElapsed = measureTimeTaken(mergeSort2 , TempArr);
            setTimeTaken(TimeElapsed);
            
        }
        else if(sortType === "s2"){
            await quickSort(arr, 0 , arr.length -1);

            
            TimeElapsed = measureTimeTaken(quickSort2 , TempArr);
            setTimeTaken(TimeElapsed);
            
        }
        else if(sortType === "s3"){
            await bubbleSort(arr);
        }
        
    }



    

    useEffect(() => {
        changeSortType();
    }, []);



    const [isChartOpen, setIsChartOpen] = useState(true);

    const toggleChart = () => {
        setIsChartOpen(!isChartOpen);
    };



    //INFO CARD

    let InfoCard ;

    if(sortType === "s1"){
        InfoCard =(
            <div className="InfoMain">
                <div className="InfoColor" id= "ic1" ></div> <p className="InfoLabel">Under Comparision</p>
                <div className="InfoColor" id= "ic2" ></div> <p className="InfoLabel">Not Under Comparision</p>
                <div className="InfoColor" id= "ic3" ></div> <p className="InfoLabel">After Sorting Subarray</p>
            </div>
        ); 
    }

    else if(sortType === "s2"){
        InfoCard =(
            <div className="InfoMain">
                <div className="InfoColor" id= "ic4" ></div> <p className="InfoLabel">Pivot Element</p>
                <div className="InfoColor" id= "ic5" ></div> <p className="InfoLabel">Selected Subarray</p>
                <div className="InfoColor" id= "ic6" ></div> <p className="InfoLabel">Not Under Selection</p>
                <div className="InfoColor" id= "ic7" ></div> <p className="InfoLabel">After Partition</p>

            </div>
        ); 
    }
    else if(sortType === "s3"){
        InfoCard =(
            <div className="InfoMain">
                <div className="InfoColor" id= "ic4" ></div> <p className="InfoLabel">Fixed Element</p>
                <div className="InfoColor" id= "ic5" ></div> <p className="InfoLabel">Selected Pair</p>
                <div className="InfoColor" id= "ic6" ></div> <p className="InfoLabel">Not Selected</p>
                <div className="InfoColor" id= "ic7" ></div> <p className="InfoLabel">After Comparision</p>
            </div>
        ); 
    }

    const changeSpeed = () => {
        let x = document.getElementById("speed").value;
        setSpeed(x);
    }

    return(
        <>
        <div className="container">
        
        <div className="sortingInterface">
        <div className="slider"><label htmlFor= "arrSize">ARRAY SIZE</label><input type="range" min="16" max="180" id="arrSize" onChange={resetArray} onMouseLeave={resetArray}></input></div>
        <div className="slider"><label htmlFor= "arrSize">ANIMATION SPEED</label><input type="range" min="10" max="100" id="speed" onChange={changeSpeed}></input></div>
            <label for="cars">Choose a Sorting Algorithm: </label>
            <select name="Sorting Type" id="sortType" onChange={changeSortType}>
                <option value="s1">Merge Sort</option>
                <option value="s2">Quick Sort</option>
                <option value="s3">Bubble Sort</option>
                <option value="s4">Selection Sort</option>
            </select>

            <button onClick={resetArray}>RESET ARRAY</button>
            <button onClick={sortArr}>START SORT</button>
            <button onClick={updateChart}>UPDATE CHART</button>
            <button onClick={toggleChart}>TOGGLE CHART</button>
            

            
            
            <div className="DataCard">
                <h4>Comparisions: {comparisions}</h4>
                <h4>Number of Elements: {arrSize}</h4>
                <h4>Time Elapsed(micro seconds): {TimeTaken*1000}</h4>
            </div>
            
            
        </div>
        <div className="arrContainer">
            {isChartOpen ? 
            <>
            {InfoCard}
            {arr.map((item , idx)=> 
            (<div className = "arrElement" id={item.id} key= {idx} style={{height : `${item.value}px`, width: `${Math.floor(400/arrSize)}px` , transition: 'height 0.4s' , left: `${50+ idx*(Math.floor(400/arrSize)+1)}px`}}></div>)
            )}
            </> 
            
            : 
            
            <div>
                <Line data = {data} options={options}/>
            </div> 
            }
            
        </div>
        </div>

        
        
        
        </>
    );
}

export default Sorting

function randomInt(min , max){
    return Math.floor(Math.random()*(max - min + 1)+ min);
}   

function replaceTuple(array, attribute, value, newTuple) {
    return array.map(item => {
      
      if (item[attribute] === value) {
        
        return newTuple;
      }
      return item;
    });
}


function mergeSort2(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge2(mergeSort2(left), mergeSort2(right));
}

function merge2(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function quickSort2(arr) {
    
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else if (arr[i] > pivot) {
            right.push(arr[i]);
        }
    }

    return [...quickSort2(left), pivot, ...quickSort2(right)];
}

function bubbleSort2(arr){
    const n = arr.length;
        let swapped;
        
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                    
                if (arr[i] > arr[i + 1]) {

                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                }
                  

            }
        
        } while (swapped);
        return arr;
}

function measureTimeTaken(func, ...args) {

    const startTime = performance.now();
    
    func(...args);

    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    return timeTaken;
}