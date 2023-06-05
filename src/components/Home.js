import React, { useEffect, useState } from "react";
import './Home.css';
import Menu from './Menu';
import welcomePic from "../images/welcometitle.png";

export default function HomePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("https://organizer-7cc95-default-rtdb.firebaseio.com/articles/.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        setArticles(data.articles); 
      })
  }, [])

  return (
    <div>
      <Menu></Menu>
      <img src={welcomePic} alt="welcome" className='welcomePic'></img>
      <div className='welcomeTxt'>Here you can see some articles, feel free to choose and read one to learn more organization tips!</div>
      <div className='item-container'>
        {articles.map((article, index) => (
          <div className='art' key={index} data-testid="articles" onClick={() => window.location.assign(article.url)}>
            <h3 data-testid="title">
              {article.title.length > 30 ? `${article.title.substring(0, 30)}...` : article.title}
            </h3>
            <p data-testid="desc">{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}