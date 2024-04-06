import chroma from 'chroma-js'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import slugify from 'react-slugify'
import styled from 'styled-components'
import {palette} from '../myPalettes'

function Palettes() {

    const [myPalettes, setMyPalettes] = useState(palette)
    const [paletteName, setPaletteName] = React.useState('')
    const [lsPalettes, setLsPalettes] = useState([])

    React.useEffect(() => {
        myPalettes.forEach((pal) => {
            const savedPalette = localStorage.getItem(`myPalette-${pal.name}`)
            if(!savedPalette){
                localStorage.setItem(`myPalette-${pal.name}`, JSON.stringify(pal))
            }
        })
    }, [myPalettes])

    React.useEffect(() => {
        const palettes = []

        for(let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i)
            if(key.startsWith('myPalette-')){
                const savedPalette = localStorage.getItem(key)
                if(savedPalette){
                    palettes.push(JSON.parse(savedPalette))
                }
            }
        }

        palettes.sort((a, b) => {
            return a.createdAt - b.createdAt
        })
        setLsPalettes(palettes)

    }, []); 

    const generateRandomColors = () => {
        const colors = []

        while(colors.length < 20) {
            const color = chroma.random().hex();
            if(chroma.valid(color)){
                colors.push(color)
            }
        }

        return colors
    }


    const addPalette = () => {
        const newPalette = {
            id: new Date().getTime(),
            name: slugify(paletteName),
            createdAt: new Date().getTime(),
            colors: generateRandomColors()
        }


        const key = `myPalette-${newPalette.name}`;
        const savedPalette = localStorage.getItem(key)
        if(savedPalette){
            return
        }

        localStorage.setItem(key, JSON.stringify(newPalette))

        setLsPalettes([...lsPalettes, newPalette])

        setMyPalettes([...myPalettes, newPalette])

        setPaletteName('')
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
                            addPalette()
                        } else{
                            alert("Название палитры пустое!");
                        }
                    }}>+</button>
                </div>
            </div>
            <div className="palettes">
                {
                    lsPalettes.map((pal, index) => {
                        return <Link to={`/palette/${pal.name}`} key={pal.name}>
                            <div className="palette">
                                {pal.colors.map((col, i) => {
                                    return <div key={i} 
                                        className="color"
                                        style={{backgroundColor: col}}
                                        >
                                        </div>
                                })}
                            </div>
                            <p>{pal.name}</p>
                        </Link>
                    })
                }
            </div>
        </PalettesStyled >
    )
}


const PalettesStyled = styled.div`
    position: relative;
    z-index: 5;
    .add-palette{
        padding-left: 18rem;
        padding-right: 18rem;
        padding-top: 4rem;
        padding-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
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
        a{
            text-decoration: none;
            display: inline-block;
            padding: 1rem;
            background-color: white;
            border-radius: 7px;
            box-shadow: 1px 3px 20px rgba(0,0,0, 0.2);
        }
        p{
            font-size: 1.5rem;   
            padding-top: .5rem;
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
    }
`;
export default Palettes