import React from 'react'
import TopCategory from './TopCategory'
import MostPlayedGames from './MostPlayed'
import FriendsPanel from './FriendsPanel'
import GameDashboard from './GameDashboard'

export default function BodyFirst() {
  return (
    <div className='body-one'>

        <div>
            <TopCategory />
            <MostPlayedGames />
        </div>
    </div>
  )
}
