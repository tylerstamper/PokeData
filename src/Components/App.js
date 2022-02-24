import { React, useEffect, useState } from 'react';
import './App.css';
import facepalm from '../Assets/picard-facepalm.jpg';
import Axios from 'axios';
import Pokemon from './Pokemon/Pokemon';

function App(){
    const [query, setQuery] = useState();
    const [data, setData] = useState();
    const [individualData, setIndividualData] = useState();
    const [page, setPage] = useState(1);
    const [showing, setShowing] = useState('table');

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = (arg) =>{
        if(arg === undefined && !data){
            Axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20`)
            .then(function(response){
                setData(response.data);
                console.log('setData with axios');
                
            })
            .catch(function(error){
                console.log(error);
            })
        }
        else if(arg === 'right'){
            Axios.get(data.next)
            .then(function(response){
                setData(response.data);
                setPage(page + 1);
                console.log('paginated right and setData with axios');
            })
            .catch(function(error){
                console.log(error);
            })
        }
        else if(arg === 'left' && data.previous !== null){
            Axios.get(data.previous)
            .then(function(response){
                setData(response.data);
                setPage(page - 1);
                console.log('paginated left and setData with axios');
            })
            .catch(function(error){
                console.log(error);
            })
        }
        else{
            setShowing('table')
        }
    }

    const fetchIndividualData = (query) => {
        Axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`)
        .then(function(response){
            setIndividualData(response.data);
            setShowing('pokemon');
            console.log('setIndividualData with axios');
        }).catch(function(error){
            setShowing('error');
        })
    }

    const changeState = () => {
        fetchData();
    }

    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let lowerCaseQuery = query.toLowerCase();
        fetchIndividualData(lowerCaseQuery);
    }


    if(showing === 'table'){
        return(
            <>
                <h1 className='h1-title'>PokeData</h1>
    
                <form className='form-container' onSubmit={e => handleSubmit(e)}>
                    <input className='form-input' placeholder='Enter Pokemon Name..' onChange={e => handleChange(e)}/>
                </form>
    
    
                <div className='flex-pagination-container'>
                    {data && data.results.map(item => 
                        <div id={item.name} key={item.name} className='paginated-list-container' onClick={e => fetchIndividualData(e.target.id)}>
                            <img id={item.name} className='pokemon-sprite' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.substr(33).replaceAll("/", "")}.png`}/>
                            <p id={item.name} className='paginated-list-name'>{item.name}</p>
                        </div>
                    )}
                </div>
                <div className='paginate-button-container'>
                    <button className='paginate-button' onClick={e => fetchData('left')} disabled={page === 1 ? true : false}>Previous</button>
                    <button className='paginate-button' onClick={e => fetchData('right')}>Next</button>
                </div>
            </>
        );
    } else if(data && showing === 'pokemon'){
        return(
            <>
                <h1 className='h1-title'>PokeData</h1>
    
                <form className='form-container' onSubmit={e => handleSubmit(e)}>
                    <input className='form-input' placeholder='Enter Pokemon Name..' onChange={e => handleChange(e)}/>
                </form>
    
    
                <Pokemon {...individualData} changeState={changeState} setShowing={setShowing}/>
            </>
        );
    } else if(showing === 'error'){
        return(
            <div className='error-div'>
                <button onClick={changeState} className='error-back-btn'>Go Back</button>
                <h1 className='error-h1'>Uh Oh.. Invalid Search Term</h1>
                <p className='error-p'>Your Search Query was: <span>{query}</span></p>
                <p className='error-p'>If this is a valid search term, The pokemon you are looking for may not yet be in the data used.</p>
                <img className='error-img' src={facepalm} alt='captain picard facepalm'/>
            </div>
        );
    }

    

}

export default App;
