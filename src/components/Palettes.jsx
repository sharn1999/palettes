import chroma from 'chroma-js'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import slugify from 'react-slugify'
import styled from 'styled-components'
import { fetchPalettes } from '../DB/paletteService';
import { SketchPicker } from 'react-color';


function Palettes() {

    const [myPalettes, setMyPalettes] = useState([]);
    const [paletteName, setPaletteName] = useState('');
    const [toggleColorPicker, setToggleColorPicker] = useState(false);
    const [colorPickerColor, setColorPickerColor] = useState('#fff');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await fetchPalettes();
            setMyPalettes(result);
          } catch (error) {
            console.error("Failed to fetch palettes:", error);
          }
        };
        fetchData();


      }, []);

    const handleColorChange = (color) => {
        setColorPickerColor(color.hex);
    }

    async function deletePalette(paletteName) {
        try {
          const response = await fetch(`http://localhost:3000/palettes/${paletteName}`, {
            method: 'DELETE',
          });
      
          if (!response.ok) {
            throw new Error('Не удалось удалить палитру');
          }
      
          const data = await response.json();
          console.log(data.message);

          const newArr = [];
          myPalettes.forEach(el => {
            if(el.name != paletteName){
                newArr.push(el);
            }
          })

          setMyPalettes(newArr)
        } catch (error) {
          console.error('Ошибка при удалении палитры:', error);
        }
      }


    const addPalette = async (baseColor) => {
        if(slugify(paletteName)){
            const [hue, sat, light] = chroma(baseColor).hsl();

            const analogousColors = Array.from({ length: 5 }, (_, i) => {
                const newHue = (hue + (i - 2) * 20 + 360) % 360;
                return chroma.hsl(newHue, sat, light).hex();
              });

            const newPalette = {
                id: new Date().getTime(),
                name: slugify(paletteName),
                createdAt: new Date().getTime(),
                colors: analogousColors
            }
    
            let exist = false;
    
            myPalettes.forEach(el => {
                if(el.name == slugify(paletteName)){
                    exist = true;
                }
            })
    
            if(!exist){
                try {
                    const response = await fetch('http://localhost:3000/palettes', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(newPalette),
                    });
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                    }
                    const data = await response.json();

                    console.log('Palette created:', data);
                  } catch (error) {
                    console.error('Failed to create palette:', error);
                  }
                  
                setMyPalettes([...myPalettes, newPalette])
        
                setPaletteName('')
            } else{
                alert('Палитра с таким названием уже существует!');
            }
        } else{
            alert("Вводите название на латинице!");
        }



    }

    return (
        <PalettesStyled>
            <div className="add-palette">
                <div className="input-control">
                    <input required placeholder='Создать Палитру...' value={paletteName} onChange={(e) => {
                        setPaletteName(e.target.value)
                    }} type="text"  />
                    <button onClick={() => {
                        if(paletteName){
                            setToggleColorPicker(true)
                        } else{
                            alert("Название палитры пустое!");
                        }
                    }}>+</button>
                </div>

            </div>
            {toggleColorPicker &&
                <div className="color-picker-con">
                    <div className="color-picker">
                        <SketchPicker
                            color={colorPickerColor} 
                            onChange={handleColorChange} 
                            width="400px"
                        />
                        <button className='btn-icon' onClick={() => {
                            addPalette(colorPickerColor)
                            setToggleColorPicker(!toggleColorPicker);
                        }}><i className="fa-solid fa-plus"></i> Выберите базовый цвет</button>
                    </div>
                    <div onClick={() => setToggleColorPicker(!toggleColorPicker)} className="color-picker-overlay"></div>
                </div>
            }
            
            <div className="palettes">
                {
                    myPalettes && myPalettes.map((pal, index) => {
                        return <div key={index} className="palettes-wrap">
                            <Link to={`/palette/${pal.name}`} >
                            <div className="palette">
                                {pal.colors && pal.colors.map((col, i) => {
                                    return <div key={i} 
                                        className="color"
                                        style={{backgroundColor: col}}
                                        >
                                        </div>
                                })}
                            </div>
                            <div className="palette-title">
                                <p>{pal.name}</p>
                            </div>
                        </Link>
                        <button onClick={() => {deletePalette(pal.name)}} className="btn-icon"><i className="fa-sharp fa-solid fa-trash"></i> </button>
                        </div>
                    })
                }
            </div>
        </PalettesStyled >
    )
}


const PalettesStyled = styled.div`
    position: relative;
    z-index: 5;
    .btn-generate{
        outline: none;
        cursor: pointer;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        white-space: nowrap;
        border-radius: 7px;
        color: white;
        background: #7263F3;
        transition: all 0.3s ease-in-out;
        margin-top: 20px
    }
    .add-palette{
        padding-left: 18rem;
        padding-right: 18rem;
        padding-top: 4rem;
        padding-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 50%;
        margin: 0 auto;
        transition: all .3s ease;
        input, button{
            font-family: inherit;
            font-size: inherit;
            outline: none;
            border: none;
        }
        .input-control{
            position: relative;
            width: 100%;
            box-shadow: 1px 4px 15px rgba(0,0,0,0.12);
            input{
                width: 100%;
                padding: .5rem 1rem;
                border-radius: 7px;
                &::placeholder{
                    color: #7263F3;
                    opacity: 0.3;
                }
            }
            button{
                position: absolute;
                right: -1px;
                top: 50%;
                transform: translateY(-51%);
                padding: 2px 1rem;
                cursor: pointer;
                font-size: 2rem;
                height: 100%;
                border-radius: 7px;
                background-color: #7263F3;
                color: white;
                transition: all .3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: sans-serif;
                &:hover{
                    background-color: #5A4ED1;
                }
            }
        }
    }
    .palettes{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        grid-gap: 25px;
        padding: 2rem 18rem;
        transition: all .3s ease;
        .palettes-wrap{
            position: relative;
            margin-bottom: 20px;
            &:hover{
                .btn-icon{
                    top: -36px;
                }
            }
            .btn-icon{
                outline: none;
                cursor: pointer;
                font-size: 1.5rem;
                border: none;
                position: absolute;
                top: -10px;
                right: 0px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.5rem 1rem;
                border-radius: 7px;
                color: white;
                background: #A855F7;
                z-index: 0;
                transition: all 0.3s ease-in-out;
                &:hover{
                    background: #0D0B33;
                    top: -36px;
                }
            }
        }
        a{
            text-decoration: none;
            display: inline-block;
            padding: 1rem;
            background-color: white;
            border-radius: 7px;
            box-shadow: 1px 3px 20px rgba(0,0,0, 0.2);
            position: relative;
            z-index: 1;
            width: 100%;
        }
        p{
            font-size: 1.5rem;   
            display: inline-block;
            color: #000;
            font-weight: 500;
        }
        .palette{
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            width: 100%;
            height: 250px;
            .color{
                width: 100%;
                height: 100%;
            }
        }

        .palette-title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: .5rem;
        }

    }
    .color-picker-con{
        .sketch-picker{
            box-shadow: 3px 3px 15px rgba(0,0,0, 0.5) !important;
        }
        .color-picker{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 11;
            button{
                display: flex;
                align-items: center;
                gap: .5rem;
                box-shadow: 2px 2px 15px rgba(0,0,0,0.5);
            }
        }

        .color-picker-overlay{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0, 0.8);
            z-index: 10;
        }
        .btn-icon{
            outline: none;
            cursor: pointer;
            font-size: 1.5rem;
            border: none;
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: .5rem 1rem;
            border-radius: 7px;
            color: white;
            background: #A855F7;
            transition: all 0.3s ease-in-out;
            margin-right: 10px;
            &:hover{
                background: #0D0B33;
            }
        }
`;
export default Palettes