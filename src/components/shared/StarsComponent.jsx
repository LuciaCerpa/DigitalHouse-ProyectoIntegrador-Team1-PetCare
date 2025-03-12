import React from 'react'
import Star from "/icons/Star.svg"

export const StarsComponent = ({rating}) => {
  return (
    <div style={{ display: 'flex', gap: '0px' }}>
        {Array.from({ length: rating }, (_, index) => (
        <img key={index} src={Star} alt="Star" width={20} height={20} />
      ))}
    </div>
  )
}
