import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom';
import { palette } from '../myPalettes';
import { SketchPicker } from 'react-color';

import arrow from '../img/arrow.svg';

const del = <i className='fa-sharp fa-solid fa-trash'></i>
const brush = <i className='fa-solid fa-brush'></i>
const paletteIcon = <i className='fa-solid fa-palette'></i>

function Palette() {
    const { id } = useParams();
    const initialPalette = palette.find(pal => pal.name === id);
    
    const [myPalette, setMyPalette] = useState(() => {
        const savedPalette = localStorage.getItem(`myPalette-${id}`)
        return savedPalette ? JSON.parse(savedPalette) : initialPalette
    });
    const [toRgb, setToRgb] = useState('hex');
    const [toggleColorPicker, setToggleColorPicker] = useState(false);
    const [colorPickerColor, setColorPickerColor] = useState('#fff');
    const [currentColor, setCurrentColor] = useState('');
    const [showCurrentColor, setShowCurrentColor] = useState(false);
    const [randomText, setRandomText]  = useState('');

    const copyTexts = ['Paste Me!', 'Copied!','Oh Paste Me','Already Copied!', 'Nice!', 'Okay!', 'Done!', 'Good Choice!', 'Right One!'];
    

    useEffect(() => {
        localStorage.setItem(`myPalette-${id}`, JSON.stringify(myPalette))
    }, [myPalette])

    const toggleToRGB = (e) => {
        if(e.target.value == 'rgb'){
            setToRgb('rgb')
        } else{
            setToRgb('hex')
        }
    }

    const converToRGB = (hex) => {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);

        return `rgb(${r}, ${g}, ${b})`
    }

    const handleColorChange = (color) => {
        setColorPickerColor(color.hex);
    }

    const handleFullColorClick = (event) => {
        setCurrentColor(event);
        setShowCurrentColor(true);

        setTimeout(() => {
            setShowCurrentColor(false);
            setTimeout(() => {
                
            }, 300);
        }, 700)
    }

    const createColor = () => {

        const newColors = [...myPalette.colors]
        if(newColors.length < 20){
            newColors.push(colorPickerColor)
            setMyPalette({...myPalette, colors: newColors})
        }else{
            alert('You can only add 20 colors to a palette');
        }
    }

    const handleCopyToClipboard = (e) => {
        const text = e.target.innerText;
        navigator.clipboard.writeText(text)
    }

    const deleteColor = (index) => {
        const newColors = [...myPalette.colors]
        newColors.splice(index, 1)
        setMyPalette({...myPalette, colors: newColors})
    }

    const clear = () => {
        setMyPalette({...myPalette, colors: []});
    }

    const generateRandomText = () => {
        return copyTexts[Math.floor(Math.random() * copyTexts.length)];
    }


    return (
        <PaletteStyled arrow={arrow}>
            <div className="header-items">
                <div className="link-con">
                    <Link to={'/'}>&larr;&nbsp; Назад</Link>
                </div>
                <div className="select-type">
                    <select value={toRgb} onChange={toggleToRGB}>
                        <option value="hex">HEX</option>
                        <option value="rgb">RGB</option>
                    </select>
                </div>
                <div className="right">
                    <button onClick={() => {
                        setToggleColorPicker(!toggleColorPicker)
                    }} className="btn-icon">
                        {paletteIcon}
                    </button>
                    <button className="btn-icon" onClick={() => {clear()}}>{brush} </button>
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
                            createColor();
                        }}><i className="fa-solid fa-plus"></i> Добавить</button>
                    </div>
                    <div onClick={() => setToggleColorPicker(!toggleColorPicker)} className="color-picker-overlay"></div>
                </div>
            }
            <div className="colors">
                {myPalette.colors.map((color, index) => {
                    return <div style={{background: color}} 
                    key={index} 
                    className="full-color" 
                    onClick={(e) => {
                        handleCopyToClipboard(e)
                        handleFullColorClick(e.target.style.backgroundColor);
                        setRandomText(generateRandomText())
                    }}>
                        <div className="colors-text">
                            Выбрать
                        </div>
                        <h4>
                            {toRgb === 'hex' ? color : converToRGB(color)}
                        </h4>
                        <button className="btn-icon" onClick={() => {
                            deleteColor(index);
                        }}>{del} </button>
                    </div>
                })}
            </div>

            {currentColor && <div className={`current-color ${showCurrentColor ? '' : 'hide'}`} style={{backgroundColor: currentColor}}>
                <div className="text">
                    <h3>{randomText}</h3>
                </div>
            </div>
            }
        </PaletteStyled>
    )
}

const PaletteStyled = styled.div`
    position: relative;
    z-index: 5;
    width: 100%;
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
    .header-items{
        height: 6vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem;
        background-color: #fff;
        .link-con{
            a{
                text-decoration: none;
                font-family: inherit;
                font-size: inherit;
                color: #000;
                font-weight: 500;
                width: 50%;
            }
        }
        select{
            font-family: inherit;
            font-size: inherit;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            outline: none;
            color: #fff;
            background-color: #000;
            cursor: pointer;
            background:  url(${props => props.arrow}) no-repeat right;
            background-color: #fff;
            background-position-x: calc(100% - 8px);
            appearance: none;
            width: 90px;
            height: 38px;
            border-radius: 4px;
            border: 1px solid #BBC0C8;
            cursor: pointer;
            padding-left: 10px;
            color: #131313;
        }

        .right{
            display: flex;
            align-items: center;
            gap: 0.8rem;
            button:last-child{
                background-color: red;
            }
        }
    }
    .current-color{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0);
        transition: all 0.3s ease-in-out;
        animation: show 0.3s ease-in-out forwards;
        .text{
            background: rgba(255, 255, 255, 0.26);
            padding: 2rem 6rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 5px 0 rgba(0,0,0,0.09);
            h3{
                text-align: center;
                font-size: 5rem;
                color: white;
                font-weight: 700;
                text-transform: uppercase;
                text-shadow: 3px 5px 7px rgba(0,0,0, 0.1);
            }
        }

        @keyframes show {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes hide {
            from {
                transform: scale(1);
                opacity: 1;
            }
            to {
                transform: scale(0);
                opacity: 0;
            }
        }
    }
    .hide {
        animation: hide 0.3s ease-in-out forwards;
        transition: all 0.3s ease-in-out;
        transform: scale(1);
    }
    .colors{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: 100%;
        height: 94vh;
        position: relative;
        .full-color{
            cursor: pointer;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: end;
            .btn-icon{
                margin-top: 10px
            }
            &:hover {
                .colors-text{
                    opacity: 1;
                }
            }
            .colors-text{
                position: absolute;
                top:50%;
                left:50%;
                transform:translate(-50%, -50%);
                opacity: 0;
                transition: all .3s;
                border: 2px solid hsla(0,0%,100%,.7);
                color: hsla(0,0%,100%,.7);
                border-radius: 7px;
                padding: 10px;
                text-transform: uppercase;
                pointer-events: none;
            }
            h4{
                font-size: 1.2rem;
                color: #fff;
                text-transform: uppercase;
                font-weight: 700;
                text-shadow: 3px 3px 1px rgba(0,0,0, 0.2);
                pointer-events: none;
                position: absolute;
                bottom: 10px;
                right: 10px
            }
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
            z-index: 1;
        }
    }
`

export default Palette