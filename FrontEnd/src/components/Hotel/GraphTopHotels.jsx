import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 
import axios from 'axios'

export const GraphTopHotels = () => {
    const chartRef = useRef(null); // Referencia al componente de gráfica
    const [data, setData] = useState(null); //datos grafica
    let chartInstance = null; // inicializarla
    const token = localStorage.getItem('token')
    let nombres = []
    let datos = []
    //


    const getTopHotels = async()=>{
        try{
          const { data } = await axios('http://localhost:3100/hotel/getTop', {
            headers: {
              'Authorization': token
            }
          })
          console.log(data.hotels)
          for(let i=0; i<data.hotels.length ;i++){
            nombres.push(data.hotels[i].name)
            datos.push(data.hotels[i].counter)
          }
        }catch(err){
          console.error(err)
        }
      }


      useEffect(() => getTopHotels, [])
   


    //
   

    useEffect(() => {
        const chartData = {
            labels: nombres,
            datasets: [
                {
                    label: 'Presiona para ver',
                    data: datos,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 1,
                },
            ],
        };

        setData(chartData); //envio datos de grafica
    }, []);

    useEffect(() => {
        
        if (chartInstance) {
            chartInstance.destroy();
        }
        if (chartRef.current && data) {
            chartInstance = new Chart(chartRef.current, {
                type: 'bar',
                data: data,
                options: {
                    // Opciones vaicas
                },
            });
        }
    }, [data]);

    return (
        <>
        <h1 className='title'>Top hoteles más solicitados</h1>
            <canvas ref={chartRef}></canvas>
        </>
    );
};