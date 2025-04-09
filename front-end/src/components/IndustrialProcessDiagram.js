import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IndustrialProcessDiagram = () => {
  // Хэмжүүрийн утгуудыг хадгалах state
  const [values, setValues] = useState({
    t1: '436.1',
    t2: '436.4',
    p1: '38.0',
    p2: '65.2',
    t3: '656',
    t4: '507',
    p3: '-0.12',
    t5: '403',
    flow1: '836',
    press1: '108',
    press2: '-32',
    t6: '397',
    p4: '-0.52',
    t7: '262',
    o2: '0.0',
    press3: '130',
    t8: '34',
    t9: '167',
    t10: '141',
    t11: '54'
  });

  // Хугацааны цувааны өгөгдөл
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  
  // Симуляц ажиллаж байгаа эсэх
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  
  // Симуляцийн хурд (мс)
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  
  // Таймерын ref
  const simulationTimerRef = useRef(null);
  
  // Хугацааны тоолуур
  const [timeCounter, setTimeCounter] = useState(0);

  // График дээр харуулах параметр сонгох
  const [selectedParams, setSelectedParams] = useState(['t1', 'p1']);

  // Input өөрчлөгдөх үед дуудагдах handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Симуляц эхлүүлэх/зогсоох
  const toggleSimulation = () => {
    if (isSimulationRunning) {
      clearInterval(simulationTimerRef.current);
    } else {
      simulationTimerRef.current = setInterval(runSimulation, simulationSpeed);
    }
    setIsSimulationRunning(!isSimulationRunning);
  };

  // Симуляцийн тооцоо
  const runSimulation = () => {
    // Шинэ хугацааны цэг нэмэх
    const newTimePoint = new Date().toLocaleTimeString();
    setTimeCounter(prev => prev + 1);
    
    // Бодит системд суурилсан симуляцийн тооцоо
    // Энд бид температур, даралтын хэлбэлзлийг симуляци хийж байна
    const t1Fluctuation = parseFloat(values.t1) + (Math.random() * 4 - 2); // cd  -2 to +2 хооронд хэлбэлзэнэ
    const t2Fluctuation = parseFloat(values.t2) + (Math.random() * 4 - 2);
    const p1Fluctuation = parseFloat(values.p1) + (Math.random() * 1 - 0.5); // -0.5 to +0.5 хооронд хэлбэлзэнэ
    const p2Fluctuation = parseFloat(values.p2) + (Math.random() * 1 - 0.5);
    
    // Температур өсөхөд даралт ч бас өснө (энгийн физикт суурилсан)
    const t3Fluctuation = parseFloat(values.t3) + (Math.random() * 8 - 4);
    const t4Correlation = t3Fluctuation * 0.8 + (Math.random() * 6 - 3);
    
    // Температурт хамааруулан даралтыг тооцох (P = nRT/V формулд суурилсан)
    const p3Correlation = (t3Fluctuation / parseFloat(values.t3)) * parseFloat(values.p3) + (Math.random() * 0.05 - 0.025);
    
    // Бусад хамааралтай өгөгдлүүдийг тооцох
    const t5Fluctuation = parseFloat(values.t5) + (Math.random() * 5 - 2.5);
    const flow1Fluctuation = parseFloat(values.flow1) + (Math.random() * 20 - 10);
    
    // Шинэ утгуудыг шинэчлэх
    const newValues = {
      ...values,
      t1: t1Fluctuation.toFixed(1),
      t2: t2Fluctuation.toFixed(1),
      p1: p1Fluctuation.toFixed(1),
      p2: p2Fluctuation.toFixed(1),
      t3: t3Fluctuation.toFixed(0),
      t4: t4Correlation.toFixed(0),
      p3: p3Correlation.toFixed(2),
      t5: t5Fluctuation.toFixed(0),
      flow1: flow1Fluctuation.toFixed(0),
    };
    
    // State шинэчлэх
    setValues(newValues);
    
    // График өгөгдөл нэмэх (сүүлийн 30 цэгийг хадгалах)
    setTimeSeriesData(prevData => {
      const newData = [...prevData, {
        time: newTimePoint,
        timeCounter,
        t1: parseFloat(newValues.t1),
        t2: parseFloat(newValues.t2),
        p1: parseFloat(newValues.p1),
        p2: parseFloat(newValues.p2),
        t3: parseFloat(newValues.t3),
        t4: parseFloat(newValues.t4),
        p3: parseFloat(newValues.p3),
        t5: parseFloat(newValues.t5),
        flow1: parseFloat(newValues.flow1),
      }];
      
      // Сүүлийн 30 цэгийг хадгалах
      if (newData.length > 30) {
        return newData.slice(-30);
      }
      return newData;
    });
  };

  // Параметр сонголт өөрчлөх
  const handleParamSelection = (param) => {
    setSelectedParams(prev => {
      if (prev.includes(param)) {
        return prev.filter(p => p !== param);
      } else {
        if (prev.length < 4) { //   Хамгийн ихдээ 4 параметр сонгох
          return [...prev, param];
        }
        return prev;
      }
    });
  };

  // Симуляцийн хурд өөрчлөх
  const changeSimulationSpeed = (speed) => {
    setSimulationSpeed(speed);
    if (isSimulationRunning) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = setInterval(runSimulation, speed);
    }
  };

  // Компонент устах үед таймер устгах
  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, []);

  // Хэмжүүрийн утгын хайрцгийн загвар
  const inputStyle = {
    width: '40px',
    height: '16px',
    backgroundColor: 'red',
    color: 'white',
    border: '1px solid #990000',
    textAlign: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '1px'
  };

  const labelStyle = {
    fontSize: '10px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'red',
    padding: '1px 3px',
    marginRight: '2px'
  };

  // Өнгөний массив
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff'];

  // Container size reduced from 1900x1100 to 1200x700
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '1400px',
      height: '700px', 
      backgroundColor: 'white', 
      overflow: 'auto',
      margin: '0 auto' // Center the container
    }}>
      {/* Фон зураг */}
      <img 
        src="/BoilerSystemimage.png" 
        alt="Industrial Process Diagram" 
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, objectFit: 'contain' }}
      />
      
      {/* Симуляцийн удирдлагын самбар */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '8px',
        borderRadius: '5px',
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Зуухны симулятор</h3>
        <button 
          onClick={toggleSimulation}
          style={{
            padding: '4px 8px',
            backgroundColor: isSimulationRunning ? '#ff0000' : '#00aa00',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            marginBottom: '8px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {isSimulationRunning ? 'Симуляц зогсоох' : 'Симуляц эхлүүлэх'}
        </button>
      </div>
      
      {/* График хэсэг */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 100,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '8px',
        borderRadius: '5px',
        width: '320px',
        height: '250px'
      }}>
        <h3 style={{ margin: '0 0 5px 0', textAlign: 'center', fontSize: '14px' }}>Хэмжилтийн хэлбэлзэл</h3>
        
        <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <button
            onClick={() => handleParamSelection('t1')}
            style={{
              padding: '2px 6px',
              backgroundColor: selectedParams.includes('t1') ? '#ff0000' : '#555',
              border: 'none',
              borderRadius: '3px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            T1
          </button>
          <button
            onClick={() => handleParamSelection('t2')}
            style={{
              padding: '2px 6px',
              backgroundColor: selectedParams.includes('t2') ? '#00ff00' : '#555',
              border: 'none',
              borderRadius: '3px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            T2
          </button>
          <button
            onClick={() => handleParamSelection('p1')}
            style={{
              padding: '2px 6px',
              backgroundColor: selectedParams.includes('p1') ? '#0000ff' : '#555',
              border: 'none',
              borderRadius: '3px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            P1
          </button>
          <button
            onClick={() => handleParamSelection('p2')}
            style={{
              padding: '2px 6px',
              backgroundColor: selectedParams.includes('p2') ? '#ff00ff' : '#555',
              border: 'none',
              borderRadius: '3px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            P2
          </button>
          <button
            onClick={() => handleParamSelection('t3')}
            style={{
              padding: '2px 6px',
              backgroundColor: selectedParams.includes('t3') ? '#aa7700' : '#555',
              border: 'none',
              borderRadius: '3px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            T3
          </button>
          <button
            onClick={() => handleParamSelection('flow1')}
            style={{
              padding: '2px 6px',
              backgroundColor: selectedParams.includes('flow1') ? '#007777' : '#555',
              border: 'none',
              borderRadius: '3px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Flow
          </button>
        </div>
        
        {timeSeriesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeCounter" />
              <YAxis />
              <Tooltip />
              <Legend />
              
              {selectedParams.includes('t1') && (
                <Line 
                  type="monotone" 
                  dataKey="t1" 
                  stroke="#ff0000" 
                  name="T1" 
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              
              {selectedParams.includes('t2') && (
                <Line 
                  type="monotone" 
                  dataKey="t2" 
                  stroke="#00ff00" 
                  name="T2" 
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              
              {selectedParams.includes('p1') && (
                <Line 
                  type="monotone" 
                  dataKey="p1" 
                  stroke="#0000ff" 
                  name="P1" 
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              
              {selectedParams.includes('p2') && (
                <Line 
                  type="monotone" 
                  dataKey="p2" 
                  stroke="#ff00ff" 
                  name="P2" 
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              
              {selectedParams.includes('t3') && (
                <Line 
                  type="monotone" 
                  dataKey="t3" 
                  stroke="#aa7700" 
                  name="T3" 
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              
              {selectedParams.includes('flow1') && (
                <Line 
                  type="monotone" 
                  dataKey="flow1" 
                  stroke="#007777" 
                  name="Flow" 
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', fontSize: '12px' }}>
            <p>Симуляцийг эхлүүлж хэмжилтийн өгөгдөл цуглуулна уу</p>
          </div>
        )}
      </div>
      
      {/* Хэмжүүрийн утгууд - positions adjusted for the smaller container */}
      <div style={{ position: 'absolute', top: 10, right: 35, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T-1</span>
          <input type="text" name="t1" value={values.t1} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T-2</span>
          <input type="text" name="t2" value={values.t2} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>P-1</span>
          <input type="text" name="p1" value={values.p1} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>P-2</span>
          <input type="text" name="p2" value={values.p2} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Position adjustments for all other input fields */}
      <div style={{ position: 'absolute', bottom: 280, left: 260, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t11" value={values.t11} onChange={handleChange} style={inputStyle} />
        </div>
      </div>
      
      {/* Furnace area inputs */}
      <div style={{ position: 'absolute', top: 150, left: 700, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t3" value={values.t3} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 150, left: 770, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t4" value={values.t4} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Pressure inputs */}
      <div style={{ position: 'absolute', top: 220, left: 730, zIndex: 2, display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>P</span>
          <input type="text" name="p3" value={values.p3} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t5" value={values.t5} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Flow inputs near the process equipment */}
      <div style={{ position: 'absolute', top: 320, left: 670, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>F</span>
          <input type="text" name="flow1" value={values.flow1} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Pressure inputs */}
      <div style={{ position: 'absolute', top: 238, left: 670, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>P</span>
          <input type="text" name="press1" value={values.press1} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 270, left: 640, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>P</span>
          <input type="text" name="press2" value={values.press2} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Right side heat exchanger inputs */}
      <div style={{ position: 'absolute', top: 290, right: 490, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t6" value={values.t6} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 335, right: 538, zIndex: 2, display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>P</span>
          <input type="text" name="p4" value={values.p4} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t7" value={values.t7} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Bottom inputs */}
      <div style={{ position: 'absolute', bottom: 330, right: 490, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>O2</span>
          <input type="text" name="o2" value={values.o2} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 270, right: 490, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>P</span>
          <input type="text" name="press3" value={values.press3} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 290, right: 390, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t8" value={values.t8} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 250, right: 390, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t9" value={values.t9} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 220, right: 390, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1px 0' }}>
          <span style={labelStyle}>T</span>
          <input type="text" name="t10" value={values.t10} onChange={handleChange} style={inputStyle} />
        </div>
      </div>
    </div>
  );
};

export default IndustrialProcessDiagram;