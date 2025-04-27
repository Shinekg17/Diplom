import React, { useState } from 'react';

const IndustrialProcessDiagram = () => {
  // График дээр харуулах параметр сонгох
  const [selectedParams, setSelectedParams] = useState(['t1', 'p1']);

  // Температурын өгөгдлүүдийн анхны утга
  const initialTemperatureData = [
    { id: 't288', value: 288, position: { top: 67, left: 280 }, label: 'T' },
    { id: 't381', value: 381, position: { top: 87, left: 280 }, label: 'T' },
    { id: 't366', value: 366, position: { top: 107, left: 280 }, label: 'T' },
    { id: 't292', value: 292, position: { top: 67, left: 340 }, label: 'T' },
    { id: 't275', value: 275, position: { top: 87, left: 340 }, label: 'T' }
  ];
  
  // Даралтын өгөгдлийн анхны утга
  const initialPressureData = [
    { id: 'p41_9', value: 41.9, position: { top: 75, left: 421 }, label: 'P' }
  ];

  // Температурын өгөгдлүүдийг state-д хадгалах
  const [temperatureData, setTemperatureData] = useState(initialTemperatureData);
  
  // Даралтын өгөгдлүүдийг state-д хадгалах
  const [pressureData, setPressureData] = useState(initialPressureData);
  
  // Засварлах горимд байгаа эсэх
  const [editMode, setEditMode] = useState(false);
  
  // Засварлаж байгаа утгыг хадгалах
  const [editValues, setEditValues] = useState({});

  // Параметр сонголт өөрчлөх
  const handleParamSelection = (param) => {
    setSelectedParams(prev => {
      if (prev.includes(param)) {
        return prev.filter(p => p !== param);
      } else {
        if (prev.length < 4) { // Хамгийн ихдээ 4 параметр сонгох
          return [...prev, param];
        }
        return prev;
      }
    });
  };

  // Засварлах горим руу шилжүүлэх
  const toggleEditMode = () => {
    if (editMode) {
      // Засварлах горимоос гарахдаа өөрчлөлтүүдийг хадгалах
      const updatedTempData = temperatureData.map(item => ({
        ...item,
        value: editValues[item.id] !== undefined ? Number(editValues[item.id]) : item.value
      }));
      
      const updatedPressData = pressureData.map(item => ({
        ...item,
        value: editValues[item.id] !== undefined ? Number(editValues[item.id]) : item.value
      }));
      
      setTemperatureData(updatedTempData);
      setPressureData(updatedPressData);
    } else {
      // Засварлах горим руу орохдоо одоогийн утгуудыг edit values руу хуулах
      const currentValues = {};
      temperatureData.forEach(item => {
        currentValues[item.id] = item.value;
      });
      pressureData.forEach(item => {
        currentValues[item.id] = item.value;
      });
      setEditValues(currentValues);
    }
    setEditMode(!editMode);
  };

  // Засварлаж байгаа утгыг өөрчлөх
  const handleValueChange = (id, newValue) => {
    setEditValues(prev => ({
      ...prev,
      [id]: newValue
    }));
  };

  // Өгөгдлийн стиль 
  const dataBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10
  };

  const labelStyle = {
    backgroundColor: 'red',
    color: 'white',
    padding: '2px 5px',
    fontWeight: 'bold',
    fontSize: '12px',
    borderRadius: '2px'
  };

  const valueStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    padding: '2px 5px',
    fontWeight: 'bold',
    fontSize: '12px',
    marginLeft: '1px',
    minWidth: '40px',
    textAlign: 'center'
  };

  const inputStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    border: '1px solid yellow',
    padding: '1px 4px',
    fontWeight: 'bold',
    fontSize: '12px',
    marginLeft: '1px',
    width: '40px',
    textAlign: 'center'
  };

  // Өгөгдлийн элемент үүсгэх функц
  const renderDataItem = (item) => (
    <div 
      key={item.id}
      style={{
        ...dataBoxStyle,
        top: `${item.position.top}px`,
        left: `${item.position.left}px`
      }}
    >
      <div style={labelStyle}>{item.label}</div>
      {editMode ? (
        <input
          type="number"
          value={editValues[item.id] || ""}
          onChange={(e) => handleValueChange(item.id, e.target.value)}
          style={inputStyle}
          step="0.1"
        />
      ) : (
        <div style={valueStyle}>{item.value}</div>
      )}
    </div>
  );

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '1700px',
      height: '700px', 
      backgroundColor: 'white', 
      overflow: 'auto',
      margin: '0 auto' // Center the container
    }}>
      {/* Фон зураг */}
      <img 
        src="/boilersystem.png" 
        alt="Industrial Process Diagram" 
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, objectFit: 'contain' }}
      />
      
      {/* Температурын өгөгдлүүдийг харуулах */}
      {temperatureData.map(renderDataItem)}
      
      {/* Даралтын өгөгдлүүдийг харуулах */}
      {pressureData.map(renderDataItem)}
      
      {/* Засварлах товчлуур */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
        <button 
          onClick={toggleEditMode}
          style={{
            backgroundColor: editMode ? '#ff5555' : '#55aa55',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {editMode ? 'Хадгалах' : 'Утга Засах'}
        </button>
      </div>
    </div>
  );
};

export default IndustrialProcessDiagram;