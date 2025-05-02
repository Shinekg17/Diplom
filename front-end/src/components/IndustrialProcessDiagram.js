import React, { useState } from 'react';

const IndustrialProcessDiagram = () => {
  // График дээр харуулах параметр сонгох
  const [selectedParams, setSelectedParams] = useState(['t1', 'p1', 'percentage']);

  // Температурын өгөгдлүүдийн анхны утга
  const initialTemperatureData = [
    { id: 't288', value: 288, position: { top: 67, left: 280 }, label: 'T' },
    { id: 't381', value: 381, position: { top: 87, left: 280 }, label: 'T' },
    { id: 't366', value: 366, position: { top: 107, left: 280 }, label: 'T' },
    { id: 't292', value: 292, position: { top: 67, left: 322 }, label: 'T' },
    { id: 't275', value: 275, position: { top: 87, left: 322 }, label: 'T' },
    { id: 't54', value: 54, position: { top: 400, left: 270 }, label: 'T' },
    { id: 't275', value: 56, position: { top: 485, left: 425 }, label: 'T' },
  ];

  // Даралтын өгөгдлийн анхны утга
  const initialPressureData = [
    { id: 'p41_9', value: 41.9, position: { top: 75, left: 421 }, label: 'P' }
  ];

  // Хувь хэмжээний өгөгдлийн анхны утга (зурагт харагдсан 100% утга)
  const initialPercentageData = [
    { id: 'percent14', value: 14, position: { top: 465, left: 265 }, label: '%' },
    { id: 'percent-1', value: -1, position: { top: 550, left: 120 }, label: '%' },
    { id: 'percent98', value: 98, position: { top: 590, left: 190  }, label: '%' },
    { id: 'percent37', value: 37, position: { top: 590, left: 240 }, label: '%' },
    { id: 'percent1', value: 1, position: { top: 558, left: 420 }, label: '%' },
    { id: 'percent94', value: 94, position: { top: 314, left: 375 }, label: '%' },
    { id: 'percent0', value: 0, position: { top: 200, left: 530 }, label: '%' },
    { id: 'percent0', value: 0, position: { top: 62, left: 706 }, label: '%' },
    { id: 'percent100', value: 100, position: { top: 63, left: 810 }, label: '%' },
    { id: 'percen58', value: 58, position: { top: 308, left: 865 }, label: '%' },
    { id: 'percent100', value: 100, position: { top: 308, left: 930 }, label: '%' },
    { id: 'percent93', value: 93, position: { top: 348, left: 880 }, label: '%' },
    { id: 'percent55', value: 55, position: { top: 415, left: 910 }, label: '%' }
  ];

  // Шинээр нэмсэн хүснэгт панелийн өгөгдөл - Эхний хуучин загвар
  const initialPanelData = [
    {
      id: 'panel5a',
      title: 'ПСУ 5A',
      readings: [
        { label: 'Hz', value: 9 },
        { label: 'A', value: 5.2 }
      ],
      position: { top: 400, left: 105 }
    },
    {
      id: 'panel5b',
      title: 'ПСУ 5Б',
      readings: [
        { label: 'Hz', value: 0 },
        { label: 'A', value: -0.0 }
      ],
      position: { top: 400, left: 165 }
    }
  ];

  // Шинэ загварын хүснэгт панел - Зурагт харагдсан шинэ загвар
  const initialNewPanelData = [
    {
      id: 'newpanel1',
      title: '',
      rows: [
        { 
          cells: [
            { label: 'C', value: '27', color: 'red',},
            { label: 'ШБ M', value: '', color: 'white' }, 
            { label: 'C', value: '29', color: 'red' }
          ]
        },
        { 
          cells: [
            { label: 'A', value: '41', color: 'white' },
            { label: 'A', value: '42', color: 'white' },
            { label: 'V', value: '6286', color: 'white' }
          ]
        }
      ],
      position: { top: 460, left: 105 }
    }
  ];

  // Шинээр нэмсэн дижитал дэлгэцийн өгөгдөл (зурагт харагдсанаар)
  const initialDigitalPanelData = [
    {
      id: 'digitalpanel1',
      rows: [
        {
          cells: [
            { label: 'C', value: 40, labelColor: '#d00' },
            { label: 'C', value: 56, labelColor: '#d00' }
          ]
        },
        {
          cells: [
            { label: 'A', value: 130, labelColor: '#00a' },
            { label: 'V', value: 399, labelColor: '#060' }
          ]
        }
      ],
      position: { top: 520, left: 445 }
    }
  ];

  // Шинээр нэмсэн хяналтын панел (зураг дахь хүснэгттэй ижил)
  const initialControlPanelData = {
    id: 'controlPanel',
    rows: [
      {
        cells: [
          { label: 'C', value: '49', color: 'red' },
          { label: 'ДС', color: 'white' },
          { label: 'C', value: '44', color: 'red' }
        ]
      },
      {
        cells: [
          { label: 'A', value: '-2', color: 'lightblue' },
          { label: 'A', value: '23', color: 'lightblue' },
          { label: 'V', value: '6261', color: 'lightblue' }
        ]
      },
      {
        cells: [
          { label: 'ММ/С', value: '1.2', color: 'red' },
          { label: 'ММ/С', value: '0.8', color: 'red' }
        ]
      }
    ],
    position: { top: 470, left: 950 }
  };

  const CPanelData = {
    rows: [
      {
        cells: [
          { label: 'C', value: 32, labelColor: '#d00' },
          { label: 'C', value: 34, labelColor: '#d00' }
        ]
      },
      {
        cells: [
          { label: 'A', value: 61, labelColor: '#8ad' },
          { label: 'V', value: 399, labelColor: '#8ad' }
        ]
      }
    ]
  };

  // Температурын өгөгдлүүдийг state-д хадгалах
  const [temperatureData, setTemperatureData] = useState(initialTemperatureData);
  
  // Даралтын өгөгдлүүдийг state-д хадгалах
  const [pressureData, setPressureData] = useState(initialPressureData);
  
  // Хувь хэмжээний өгөгдлүүдийг state-д хадгалах
  const [percentageData, setPercentageData] = useState(initialPercentageData);
  
  // Шинээр нэмсэн панел өгөгдлийг state-д хадгалах
  const [panelData, setPanelData] = useState(initialPanelData);
  
  // Шинэ загварын панел өгөгдлийг state-д хадгалах
  const [newPanelData, setNewPanelData] = useState(initialNewPanelData);
  
  // Дижитал дэлгэцийн панел өгөгдлийг state-д хадгалах
  const [digitalPanelData, setDigitalPanelData] = useState(initialDigitalPanelData);
  
  // Шинээр нэмсэн хяналтын панел өгөгдлийг state-д хадгалах
  const [controlPanelData, setControlPanelData] = useState(initialControlPanelData);
  
  // Засварлах горимд байгаа эсэх
  const [editMode, setEditMode] = useState(false);
  
  // Засварлаж байгаа утгыг хадгалах
  const [editValues, setEditValues] = useState({});

  const [CpanelData, CsetPanelData] = useState(CPanelData);

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
      
      const updatedPercentData = percentageData.map(item => ({
        ...item,
        value: editValues[item.id] !== undefined ? Number(editValues[item.id]) : item.value
      }));
      
      // Шинээр нэмсэн панел өгөгдлийг шинэчлэх
      const updatedPanelData = panelData.map(panel => {
        return {
          ...panel,
          readings: panel.readings.map(reading => {
            const editKey = `${panel.id}_${reading.label}`;
            return {
              ...reading,
              value: editValues[editKey] !== undefined ? Number(editValues[editKey]) : reading.value
            };
          })
        };
      });
      
      // Шинэ загварын панел өгөгдлийг шинэчлэх
      const updatedNewPanelData = newPanelData.map(panel => {
        return {
          ...panel,
          rows: panel.rows.map((row, rowIndex) => {
            return {
              ...row,
              cells: row.cells.map((cell, cellIndex) => {
                const editKey = `${panel.id}_row${rowIndex}_cell${cellIndex}`;
                return {
                  ...cell,
                  value: editValues[editKey] !== undefined ? editValues[editKey] : cell.value
                };
              })
            };
          })
        };
      });
      
      // Дижитал дэлгэцийн панел өгөгдлийг шинэчлэх
      const updatedDigitalPanelData = digitalPanelData.map(panel => {
        return {
          ...panel,
          rows: panel.rows.map((row, rowIndex) => {
            return {
              ...row,
              cells: row.cells.map((cell, cellIndex) => {
                const editKey = `${panel.id}_row${rowIndex}_cell${cellIndex}`;
                return {
                  ...cell,
                  value: editValues[editKey] !== undefined ? Number(editValues[editKey]) : cell.value
                };
              })
            };
          })
        };
      });
      
      // Шинээр нэмсэн хяналтын панел өгөгдлийг шинэчлэх
      const updatedControlPanelData = {
        ...controlPanelData,
        rows: controlPanelData.rows.map((row, rowIndex) => {
          return {
            ...row,
            cells: row.cells.map((cell, cellIndex) => {
              const editKey = `${controlPanelData.id}_row${rowIndex}_cell${cellIndex}`;
              return {
                ...cell,
                value: editValues[editKey] !== undefined ? editValues[editKey] : cell.value
              };
            })
          };
        })
      };
      
      setTemperatureData(updatedTempData);
      setPressureData(updatedPressData);
      setPercentageData(updatedPercentData);
      setPanelData(updatedPanelData);
      setNewPanelData(updatedNewPanelData);
      setDigitalPanelData(updatedDigitalPanelData);
      setControlPanelData(updatedControlPanelData);
    } else {
      // Засварлах горим руу орохдоо одоогийн утгуудыг edit values руу хуулах
      const currentValues = {};
      temperatureData.forEach(item => {
        currentValues[item.id] = item.value;
      });
      pressureData.forEach(item => {
        currentValues[item.id] = item.value;
      });
      percentageData.forEach(item => {
        currentValues[item.id] = item.value;
      });
      
      // Шинээр нэмсэн панел өгөгдлийг edit values руу нэмэх
      panelData.forEach(panel => {
        panel.readings.forEach(reading => {
          const editKey = `${panel.id}_${reading.label}`;
          currentValues[editKey] = reading.value;
        });
      });
      
      // Шинэ загварын панел өгөгдлийг edit values руу нэмэх
      newPanelData.forEach(panel => {
        panel.rows.forEach((row, rowIndex) => {
          row.cells.forEach((cell, cellIndex) => {
            const editKey = `${panel.id}_row${rowIndex}_cell${cellIndex}`;
            currentValues[editKey] = cell.value;
          });
        });
      });
      
      // Дижитал дэлгэцийн панел өгөгдлийг edit values руу нэмэх
      digitalPanelData.forEach(panel => {
        panel.rows.forEach((row, rowIndex) => {
          row.cells.forEach((cell, cellIndex) => {
            const editKey = `${panel.id}_row${rowIndex}_cell${cellIndex}`;
            currentValues[editKey] = cell.value;
          });
        });
      });
      
      // Шинээр нэмсэн хяналтын панел өгөгдлийг edit values руу нэмэх
      controlPanelData.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, cellIndex) => {
          const editKey = `${controlPanelData.id}_row${rowIndex}_cell${cellIndex}`;
          currentValues[editKey] = cell.value;
        });
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
    padding: '2px 3px',
    fontWeight: 'bold',
    fontSize: '8px'
  };

  const valueStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    padding: '2px 5px',
    fontWeight: 'bold',
    fontSize: '8px',
    marginLeft: '1px',
    minWidth: '20px',
    textAlign: 'center'
  };

  // Хувь хэмжээний дэлгэцийн стиль (зурагт харагдсанаар ногоон дэвсгэр дээр)
  const percentageDisplayStyle = {
    backgroundColor: 'green',
    color: 'white',
    padding: '1px 1px',
    fontWeight: 'bold',
    fontSize: '10px',
    marginLeft: '1px',
    minWidth: '20px',
    textAlign: 'center',
    border: '1px solid black'
  };

  const inputStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    border: '1px solid yellow',
    padding: '1px 3px',
    fontWeight: 'bold',
    fontSize: '10px',
    marginLeft: '1px',
    width: '40px',
    textAlign: 'center'
  };

  // Хувь хэмжээний оролтын стиль
  const percentageInputStyle = {
    ...inputStyle,
    backgroundColor: 'green',
    color: 'white',
    border: '1px solid white'
  };

  // Шинээр нэмсэн панелийн стиль
  const panelContainerStyle = {
    border: '2px solid #009a00',
    backgroundColor: '#007a00',
    width: '55px',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10
  };

  const panelTitleStyle = {
    backgroundColor: '#006a00',
    color: 'white',
    padding: '2px 4px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px'
  };

  const panelRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #008a00'
  };

  const panelLabelStyle = {
    backgroundColor: 'red',
    color: 'white',
    padding: '1px',
    width: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px'
  };

  const panelValueStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    padding: '1px',
    width: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px'
  };

  const panelInputStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    border: '1px solid yellow',
    padding: '1px',
    width: '28px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px'
  };

  // Шинэ загварын панелийн стиль
  const newPanelContainerStyle = {
    border: '1px solid #035e03',
    backgroundColor: 'green',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
    padding: '1px'
  };

  const newPanelRowStyle = {
    display: 'flex',
    width: '100%'
  };

  const newPanelCellStyle = (color) => ({
    display: 'flex',
    flexDirection: 'column',
    margin: '1px'
  });

  const newPanelLabelStyle = (color) => ({
    backgroundColor: color || 'red',
    color: 'black',
    padding: '1px 1px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px',
    minWidth: '15px'
  });

  const newPanelValueStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    padding: '1px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px',
    minWidth: '30px'
  };

  const newPanelInputStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    border: '1px solid yellow',
    padding: '1px',
    width: '35px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px'
  };

  // Дижитал дэлгэцийн панел стиль
  const digitalPanelContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid black',
    overflow: 'hidden',
    backgroundColor: 'green',
    padding: '2px',
    position: 'absolute',
    zIndex: 10
  };
  
  const digitalPanelRowStyle = {
    display: 'flex',
    width: '100%'
  };
  
  const digitalPanelCellContainerStyle = {
    display: 'flex',
    margin: '1px',
    alignItems: 'center'
  };
  
  const digitalPanelLabelStyle = (color) => ({
    backgroundColor: color,
    color: 'white',
    padding: '2px 4px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    width: '16px',
    height: '14px'
  });
  
  const digitalPanelValueStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    padding: '2px 10px',
    minWidth: '20px',
    height: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontSize: '10px',
    marginLeft: '2px'
  };
  
  const digitalPanelInputStyle = {
    backgroundColor: 'black',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '2px 1px',
    width: '20px',
    height: '20px',
    fontWeight: 'bold',
    marginLeft: '2px',
  };

  // Шинээр нэмсэн хяналтын панелийн стиль
  const controlPanelContainerStyle = {
    border: '2px solid black',
    backgroundColor: 'green',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
    width: '180px'
  };

  const controlPanelRowStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    borderBottom: '1px solid black'
  };

  const getLabelColorStyle = (color) => {
    if (color === 'red') {
      return { backgroundColor: '#d00' };
    } else if (color === 'lightblue') {
      return { backgroundColor: '#8ad' };
    } else if (color === 'white') {
      return { 
        backgroundColor: 'white',
        color: 'black'
      };
    }
    return { backgroundColor: color };
  };

  const controlPanelLabelStyle = (color) => ({
    ...getLabelColorStyle(color),
    color: color === 'white' ? 'black' : 'white',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25px',
    fontSize: '10px',
    margin: '1px'
  });

  const controlPanelValueStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25px',
    fontSize: '10px',
    margin: '2px'
  };

  const controlPanelCellContainerStyle = {
    display: 'flex',
    margin: '1px',
    flexGrow: 1
  };

  const controlPanelInputStyle = {
    backgroundColor: 'black',
    color: 'yellow',
    border: '1px solid yellow',
    width: '55px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '10px',
    margin: '1px'
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
          style={item.label === '%' ? percentageInputStyle : inputStyle}
          step="0.1"
        />
      ) : (
        <div style={item.label === '' ? percentageDisplayStyle : valueStyle}>
          {item.value}{item.label === '' ? '' : ''}
        </div>
      )}
    </div>
  );

  // Шинээр нэмсэн панел элемент үүсгэх функц
  const renderPanel = (panel) => (
    <div
      key={panel.id}
      style={{
        ...panelContainerStyle,
        top: `${panel.position.top}px`,
        left: `${panel.position.left}px`
      }}
    >
      <div style={panelTitleStyle}>{panel.title}</div>
      {panel.readings.map((reading, index) => (
        <div key={index} style={panelRowStyle}>
          <div style={panelLabelStyle}>{reading.label}</div>
          {editMode ? (
            <input
              type="number"
              value={editValues[`${panel.id}_${reading.label}`] || ""}
              onChange={(e) => handleValueChange(`${panel.id}_${reading.label}`, e.target.value)}
              style={panelInputStyle}
              step="0.1"
            />
          ) : (
            <div style={panelValueStyle}>
              {reading.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Шинэ загварын панел элемент үүсгэх функц
  const renderNewPanel = (panel) => (
    <div
      key={panel.id}
      style={{
        ...newPanelContainerStyle,
        top: `${panel.position.top}px`,
        left: `${panel.position.left}px`
      }}
    >
      {panel.rows.map((row, rowIndex) => (
        <div key={rowIndex} style={newPanelRowStyle}>
          {row.cells.map((cell, cellIndex) => (
            <div key={cellIndex} style={newPanelCellStyle(cell.color)}>
              <div style={newPanelLabelStyle(cell.color)}>{cell.label}</div>
              {editMode ? (
                <input
                  type="text"
                  value={editValues[`${panel.id}_row${rowIndex}_cell${cellIndex}`] || ""}
                  onChange={(e) => handleValueChange(`${panel.id}_row${rowIndex}_cell${cellIndex}`, e.target.value)}
                  style={newPanelInputStyle}
                />
              ) : (
                <div style={newPanelValueStyle}>
                  {cell.value}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  
  // Дижитал дэлгэцийн панел элемент үүсгэх функц
  const renderDigitalPanel = (panel) => (
    <div
      key={panel.id}
      style={{
        ...digitalPanelContainerStyle,
        top: `${panel.position.top}px`,
        left: `${panel.position.left}px`
      }}
    >
      {panel.rows.map((row, rowIndex) => (
        <div key={rowIndex} style={digitalPanelRowStyle}>
          {row.cells.map((cell, cellIndex) => (
            <div key={cellIndex} style={digitalPanelCellContainerStyle}>
              <div style={digitalPanelLabelStyle(cell.labelColor)}>{cell.label}</div>
              {editMode ? (
                <input
                  type="number"
                  value={editValues[`${panel.id}_row${rowIndex}_cell${cellIndex}`] || ""}
                  onChange={(e) => handleValueChange(`${panel.id}_row${rowIndex}_cell${cellIndex}`, e.target.value)}
                  style={digitalPanelInputStyle}
                />
              ) : (
                <div style={digitalPanelValueStyle}>
                  {cell.value}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // Шинээр нэмсэн хяналтын панел элемент үүсгэх функц
  const renderControlPanel = (panel) => (
    <div
      key={panel.id}
      style={{
        ...controlPanelContainerStyle,
        top: `${panel.position.top}px`,
        left: `${panel.position.left}px`
      }}
    >
      {panel.rows.map((row, rowIndex) => (
        <div key={rowIndex} style={controlPanelRowStyle}>
          {row.cells.map((cell, cellIndex) => (
            <div key={cellIndex} style={controlPanelCellContainerStyle}>
              <div style={controlPanelLabelStyle(cell.color)}>
                {cell.label}
              </div>
              {editMode ? (
                <input
                  type="text"
                  value={editValues[`${panel.id}_row${rowIndex}_cell${cellIndex}`] || ""}
                  onChange={(e) => handleValueChange(`${panel.id}_row${rowIndex}_cell${cellIndex}`, e.target.value)}
                  style={controlPanelInputStyle}
                />
              ) : (
                <div style={controlPanelValueStyle}>
                  {cell.value}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
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
      
      {/* Хувь хэмжээний өгөгдлүүдийг харуулах */}
      {percentageData.map(renderDataItem)}
      
      {/* Шинээр нэмсэн панелийг харуулах */}
      {panelData.map(renderPanel)}
      
      {/* Шинэ загварын панелийг харуулах */}
      {newPanelData.map(renderNewPanel)}
      
      {/* Дижитал дэлгэцийн панелийг харуулах */}
      {digitalPanelData.map(renderDigitalPanel)}
      
      {/* Шинээр нэмсэн хяналтын панелийг харуулах */}
      {renderControlPanel(controlPanelData)}
      
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
