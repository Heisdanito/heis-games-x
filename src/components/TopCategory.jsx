import {useEffect, useState} from "react";
import "./css/GameCard.css";

// imported images
import { ImagesURlEndpoint } from "../../backend/api/data_endpoit";
//from database 
import getNewGame from "../../backend/api/new_Game";
import { useNavigate } from "react-router-dom";
  //data from databse
  const card = await getNewGame();
  // debuging purpose
  // console.log(card)

  
  const GhostRunnerCard = () => {

  const [ isloading , SetLoading ] = useState(true)
  
  //time count
  let coundown = 1000;
  
  const loadCount = setInterval(() => {
    if(card !== null ){
      SetLoading(true)
      clearInterval(loadCount)
      // console.log('stop loading')
    }
  }, coundown)
  const nav = useNavigate();

    return(
    <>
    <div className="gr-card">
      <div className="gr-accent-line" />
      <div className="gr-left">
        <div>
          <span className="gr-badge">New</span>
          <h2 className="gr-title">
            {
              card.game
            }
          </h2>
          <p className="gr-price">
            {
              card.category
            }
          </p>
        </div>
        <div className="gr-actions">
          <button className="gr-btn-buy"
            onClick={() => nav(`/game/${card.id}`) }
          >Get Now</button>
        </div>
      </div>
      <div className="gr-img-wrap">
        <img
          src={`${ImagesURlEndpoint.topBanner}${card.img_url}`}
          width={500}
          height={290}
        />
        <div className="gr-img-fade" />
      </div>
    </div>
    </>
    )
  

};

export default GhostRunnerCard;