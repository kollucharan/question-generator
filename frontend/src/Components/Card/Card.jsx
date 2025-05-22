
import './Card.css';
export default function Card({ image, description, header }) {


    return (

        <div className='card-down'>
            <div>
                <img src={image} alt='dummy.png' />
                <h1>{header}</h1>
            </div>


            <p> {description}</p>

        </div>

    )

}
