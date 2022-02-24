import {  React,useEffect,useState } from "react";
import Axios from 'axios';
import './Pokemon.css';

function Pokemon(props){

    const [sprite, setSprite] = useState(props.sprites.front_default);
    const [viewingShiny, setViewingShiny] = useState(false);
    const [viewingMale, setViewingMale] = useState(true);
    const [abilityData, setAbilityData] = useState();
    const [abilityShowing, setAbilityShowing] = useState('');
    const [showingMoves, setShowingMoves] = useState(false);
    const [move, setMove] = useState();
    const [showingModal, setShowingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(props ===  null){
            setIsLoading(true);
        }
        else{
            setIsLoading(false);
        }
    }, [props])

    //very slow need to make faster
    const toggleGender = () => {
            if(viewingMale && viewingShiny){
                setViewingMale(false);
                setSprite(props.sprites.front_shiny_female);
            }
            else if(viewingMale && !viewingShiny){
                setViewingMale(false);
                setSprite(props.sprites.front_female);
            }
            else if(!viewingMale && viewingShiny){
                setViewingMale(true);
                setSprite(props.sprites.front_shiny);
            }
            if(!viewingMale && !viewingShiny){
                setViewingMale(true);
                setSprite(props.sprites.front_default);
            }
    }
    //very slow need to make faster
    const toggleShiny = () => {
        if(!viewingShiny && viewingMale){
            setViewingShiny(true);
            setSprite(props.sprites.front_shiny);
        }
        else if(viewingShiny && viewingMale){
            setViewingShiny(false);
            setSprite(props.sprites.front_default);
        }
        else if(!viewingShiny && !viewingMale){
            setViewingShiny(true);
            setSprite(props.sprites.front_shiny_female);
        }
        else if(viewingShiny && !viewingMale){
            setViewingShiny(false);
            setSprite(props.sprites.front_female);
        }
    }

    const fetchAbilities = (url, id) => {
        if(id !== abilityShowing){
            Axios.get(url)
            .then(function(response){
                setAbilityData(response.data);
                setAbilityShowing(id);
            })
        }
    }

    const fetchCorrectLangauge = () => {
        for(let i = 0; i <= abilityData.effect_entries.length; i++){
            if(abilityData.effect_entries[i].language.name === "en"){
                return <p className='ability-text'>{abilityData.effect_entries[i].effect}</p>;
            }
        }
    }

    const toggleShowMoves = (e) => {
        e.preventDefault();
        if(showingMoves){
            setShowingMoves(false);
        }
        else if(!showingMoves){
            setShowingMoves(true);
        }
    }

    const modalPopup = (props, e) => {
        e.preventDefault();
        for(let i = 0; i < props.moves.length; i++){
            if(e.target.id === props.moves[i].move.name){
                Axios.get(props.moves[i].move.url)
                .then(function(response){
                    setMove(response.data);
                    setShowingModal(true);
                })
            }
        }
    }

    if(!isLoading){
    return(
        <div className='pokemon-container-div'>

        {/* Modal for onClick from move list */}
        <div className='modal' style={ showingModal ? {display: 'block'} : {display: 'none'}}>
            <div className='modal-content'>
                <span className='close-modal-btn' onClick={e => setShowingModal(false)}>Close</span>
                <p className='modal-p'>{move && move.name}</p>
                <p className='modal-p'>{move && move.effect_entries[0].effect.replace("$effect_chance", move && move.effect_chance)}</p>
                <p className='modal-p'>Accuracy: {move && move.accuracy}</p>
                <p className='modal-p'>Power: {move && move.power ? move.power : '00'}</p>
                <p className='modal-p'>PP: {move && move.pp}</p>
            </div>
        </div>
        {/* -------------------------------- */}

            <input className='back-btn' type='button' value='<' onClick={props.changeState}/>
            <h3 className='pokemon-name'>{props.name}</h3>

            <div className='pokemon-flex-container'>
                <div className="pokemon-sprite-container">
                    <img className='pokemon-image' alt={props.name + ' image'} src={sprite}/><br/>
                    {props.types && props.types.map(types => <p className='pokemon-type' key={types.type.name} id={types.type.name}>{types.type.name}</p>)}
                </div>

                <div className='pokemon-stats-container'>
                {/* multiply by 0.10 to get actual numeric values that arent correct in the API, then convert to  imperial*/}
                    <p>Height: {((props.height * 0.10) * 3.2).toFixed(1)}"</p>
                    <p>Weight: {((props.weight * 0.10) * 2.2).toFixed(1)} lbs</p>
                    <p>{props.stats[0].stat.name}: {props.stats[0].base_stat}</p>
                    <p>{props.stats[1].stat.name}: {props.stats[1].base_stat}</p>
                    <p>{props.stats[2].stat.name}: {props.stats[2].base_stat}</p>
                    <p>{props.stats[3].stat.name}: {props.stats[3].base_stat}</p>
                    <p>{props.stats[4].stat.name}: {props.stats[4].base_stat}</p>
                    <p>{props.stats[5].stat.name}: {props.stats[5].base_stat}</p>
                </div>
            </div>

            <div className='toggle-btn-flex-container'>
                <div className='shiny-gender-btn-container'>
                    {props.sprites.front_shiny && <button className='toggle-btn' onClick={() => toggleShiny()}>{viewingShiny ? 'View Non-Shiny' : 'View Shiny'}</button>}
                    {props.sprites.front_female && <button className='toggle-btn' onClick={() => toggleGender()}>{viewingMale ? 'View Female' : 'View Male'}</button>}
                </div>

                <div className='ability-btn-container'>
                    {props && props.abilities.map(item =>
                        <button className='ability-btn' key={item.ability.name} id={item.ability.name} onClick={e => fetchAbilities(item.ability.url, e.target.id)}>{item.ability.name}▼</button>)}
                        {abilityData && <div>{fetchCorrectLangauge()}</div>}
                </div>
            </div>

            <button className='toggle-btn move-list-btn' onClick={e => toggleShowMoves(e)}>{showingMoves ? 'Hide Move List' : 'Show Move List'}</button>
            <div className='dropdown-div' style={ showingMoves ? {visibility: 'visible', height: 'auto'} : {visibility: 'hidden', height: '0px', overflow: 'hidden'}}>
                <ul className='dropdown-ul'>
                    {props && props.moves.map(movesObject => <li className='dropdown-item' id={movesObject.move.name} key={movesObject.move.name} onClick={e => modalPopup(props, e)}>{movesObject.move.name}</li>)}
                </ul>
            </div>
        </div>
    );
    }
    else{
        <h1>Loading some PokeData...</h1>
    }
}

export default Pokemon;