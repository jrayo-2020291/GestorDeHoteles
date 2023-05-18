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
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1,
                    hoverBackgroundColor:'#339FFF',
                    borderRadius:2
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
                    
                },
            });
        }
    }, [data]);

    return (
        <>
        <main>
          <div style={{ margin: '5% 20% 0 20%' }}>
            <h1 className='title'>Top hoteles más solicitados</h1>
            <canvas ref={chartRef}></canvas>
          </div>
        </main>
        </>
    );
};