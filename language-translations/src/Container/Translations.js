import React,{ useState, useEffect } from "react";
import { Button, TextField, NativeSelect,Container } from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
import  './Translations.css'
import axios from 'axios';


const Translations = () => {

    const [inputText,setInputText]=useState('')
    const [detectedLanguageKey,setdetectedLanguageKey]=useState('')
    const [languagesList,setlanguagesList]=useState([])
    const [selectedLanguage,setSelectedLanguage]= useState([])
    const [resultText,setResultText]= useState([])


    useEffect(()=>{
        axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                setlanguagesList(response.data)
            })
        
    },[])



    const getLanguageSource = () =>{
        axios.post(`https://libretranslate.de/detect`, {
            q: inputText
        })
            .then((response) => {
                setdetectedLanguageKey(response.data[0].language)
            })
    }
    
    const languageKey =(selectedLanguage) =>{

        setSelectedLanguage(selectedLanguage.target.value);
    }

    const translateText = () => {
        setdetectedLanguageKey('en')
        if(inputText){
            axios.post(`https://libretranslate.de/detect`, {
                q: inputText
            })
                .then((response) => {
                    setdetectedLanguageKey(response.data[0].language)
                }).then(()=>{
                let data = {
                    q : inputText,
                    source: detectedLanguageKey,
                    target: selectedLanguage
                }
                axios.post(`https://libretranslate.de/translate`, data)
                .then((response) => {
                    setResultText(response.data.translatedText)
                })})
            
         
        }
         
     }
    


  return (
    <>
    <Container maxWidth='sm' className='container'> 
      <div className="header">
        <h1>Language Translations</h1>
      </div>
      <div className="translate=body">
        <TextField fullWidth label="Enter Translation text here" className="input-text" onChange={(e)=>setInputText(e.target.value)}/>
        <NativeSelect className='select-dropdown' onChange={languageKey}><option>Please select language</option>{languagesList.map(item=><option value={item.code}>{item.name}</option>)}
        </NativeSelect>
        <TextField fullWidth placeholder="Translated Text" className="translated-text" value={resultText} />
        <Button variant="contained" size="large" onClick={translateText}>
          <TranslateIcon/>Translate
        </Button>
      </div>
      </Container>
    </>
  );
};

export default Translations;
