import React from "react";

export type PersonCardType = {
    name: string;
    text: string;
    image: string;
  }

export type CardBodyType = {
    name: string;
    text: string;
  }
export type CardHeaderType = {
    image: string;
  }

const CardHeader =(props: CardHeaderType) => {   
      return (
        <header style={{}} id={props.image} className="card-header">
             <div className="">
                 <h4 className="absolute font-normal text-xl text-gray-300 opacity-90 pl-2 pt-2 z-1">Founder</h4>
                  <img className="rounded-xl"src={props.image} />
             </div>
        </header>
      )
    }

  const CardBody = (props: CardBodyType) => {
      return (
        <div className="p-2">                 
          <h2 className="font-normal text-2xl text-gray-600">{props.name}</h2>          
          <p className="body-content">{props.text}</p>          
        
        </div>
      )
  }
  
  const PersonCard = (props: PersonCardType) => {
      return (
        <article className="w-56 shadow-2xl rounded-xl m-2">
          <CardHeader image={props.image}/>
          <CardBody name={props.name} text={props.text}/>
        </article>
      )
  }
export default PersonCard;