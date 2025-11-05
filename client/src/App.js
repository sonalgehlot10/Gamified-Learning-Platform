import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import adImage from './images/ww4logo.png';
// import { useRef } from 'react';
import discoverylogo from "./images/discoverylogo.png";
import natgeologo from "./images/natgeologo.png";
import codelogo from "./images/codelogo-2.png";
import billlogo from "./images/billlogo.png"
import khanlogo from "./images/khanlogo.png";
import historylogo from "./images/historylogo.png";
import ww1logo from "./images/ww1logo.png"
import ww2logo from "./images/ww2logo.png"
import ww3logo from "./images/ww3logo.png"
import ww4logo from './images/ww4logo.png';
import ww5logo from "./images/ww5logo.png";
import audio1 from "./audios/sample_audio1.mp3";
import audio2 from "./audios/sample_audio2.mp3";
import audio3 from "./audios/sample_audio3.mp3";
import audio4 from "./audios/sample_audio4.mp3";
import { doSignInWithGoogle, doSignOut } from './firebase/auth';
import { useAuth } from './contexts/authContext';




const socket = io(process.env.LOCAL_SERVER_API);


const genCategories = ['Business', 'Philosophy', 'Geography', 'Science'];
const proCategories = ['SocialMedia', 'UX', 'Finance', 'MentalHealth'];

const App = () => {
  const [questions, setQuestions] = useState([]);
  // const [category, setCategory] = useState('General');
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // const [selectedCategories, setSelectedCategories] = useState(['History']);
  const [selectedCategories, setSelectedCategories] = useState(['Business']);
  // const [cursors, setCursors] = useState({});
  // const username = useRef(`User_${Math.random().toString(36).substring(2, 6)}`);
  const [isPro, setIsPro] = useState(false);
  const { currentUser, userLoggedIn } = useAuth()
  // const [ userSolvedQuestions, setUserSolvedQuestions ] = useState(0);
  const [ userSolvedQuestions, setUserSolvedQuestions ] = useState([]);
  const [language, setLanguage] = useState('en');

  const [cards, setCards] = useState([]);



  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/api/questions', {
          params: { categories: selectedCategories.join(',') },
        });
        console.log('Fetched questions:', res.data); 
        setQuestions(res.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };



    const fetchSolvedState = async () => {
      try {
        const res = await axios.get('/api/solved');
        const solvedData = res.data || [];
        
        setSolvedQuestions(solvedData.map(item => item.questionId));
  
        const initialSelectedAnswers = {};
        solvedData.forEach(({ questionId, selectedAnswer }) => {
          initialSelectedAnswers[questionId] = selectedAnswer;
        });
        
        setSelectedAnswers(initialSelectedAnswers);
  
      } catch (error) {
        console.error('Error fetching solved state:', error);
      }
    };

    const fetchCards = async () => {
      try {
        const res = await axios.get('/api/cards', {
          params: { category: selectedCategories.join(',') },
        });
        setCards(res.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchQuestions();
    fetchSolvedState();
    fetchCards();

    socket.on('updateSolved', (data) => {
      setSolvedQuestions((prevState) => {
        if (!prevState.includes(data.questionId)) {
          return [...prevState, data.questionId];
        }
        return prevState;
      });
    });


    const fetchInitialQuestions = async () => {
      try {
        const res = await axios.get('/api/questions', {
          params: { categories: selectedCategories.join(',') },
        });
        setQuestions(res.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchInitialQuestions();

    socket.on('newQuestion', (newQuestion) => {
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    });

    return () => {
      socket.off('updateSolved');
      socket.off('newQuestion');
    };

  }, [selectedCategories]);

  // useEffect(() => {
  //   const handleMouseMove = (event) => {
  //     const { clientX, clientY } = event;
  //     socket.emit('cursorMove', { x: clientX, y: clientY, username: username.current });
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);

  //   socket.on('cursorsUpdate', (newCursors) => {
  //     setCursors(newCursors);
  //   });

  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //     socket.off('cursorsUpdate');
  //   };
  // }, []);



  // useEffect(() => {
  //   const fetchUserSolvedQuestions = async (userId) => {
  //     try {
  //       const res = await axios.get(`/api/user-progress/${userId}`);
  //       setUserSolvedQuestions(res.data.solvedQuestions.length || 0);
  //     } catch (error) {
  //       console.error('Error fetching user solved questions:', error);
  //     }
  //   };
  
  //   if (userLoggedIn && currentUser?.uid) {
  //     fetchUserSolvedQuestions(currentUser.uid);
  //   }
  // }, [userLoggedIn, currentUser]);

  useEffect(() => {
    const fetchUserSolvedQuestions = async (userId) => {
      try {
        const res = await axios.get(`/api/user-progress/${userId}`);
        setUserSolvedQuestions(res.data.solvedQuestions.map(q => q.questionId) || []);


      } catch (error) {
        console.error('Error fetching user solved questions:', error);
      }
    };

    if (userLoggedIn && currentUser?.uid) {
      fetchUserSolvedQuestions(currentUser.uid);

    }
  }, [userLoggedIn, currentUser]);


  socket.on('connect', () => {
    console.log('Connected to server');
  });

 

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };




 

  const handleAnswerChange = async (questionId, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });

    const question = questions.find(q => q._id === questionId);
    if (optionIndex === question.correct && !userSolvedQuestions.includes(questionId)) {
      socket.emit('solveQuestion', { questionId });

      if (userLoggedIn) {
        socket.emit('solveQuestion', { questionId, userId: currentUser.uid });
        setUserSolvedQuestions(prev => [...prev, questionId]);
      } else if (proCategories.includes(question.category)) {
        doSignInWithGoogle();
      }
    }
  };
  

  const labelImages = {
    "History": historylogo,
    "Natural Science": natgeologo,
    "Mathematics": codelogo,
    "Biology": natgeologo,
    "Geography": natgeologo,
    "Politics": khanlogo,
    "Number Theory": codelogo,
    "Classic": billlogo,
    "Dystopian": ww2logo,
    "Poetry": ww1logo,
    "American Literature": ww2logo,
    "Modernism": ww3logo,
    "Space Exploration": ww5logo,
    "20th Century": ww5logo,
    "Science": discoverylogo,
    "Finance": ww4logo,
    "UI Design": khanlogo,
    "MentalHealth": billlogo,
    "Philosophy": khanlogo,
    "Social Media": ww1logo,
    "SciFi": ww5logo,
    "Ethics": ww3logo
  };

  const audioFiles = {
    "audio1": audio1,
    "audio2": audio2,
    "audio3": audio3,
    "audio4": audio4,
  }

  const handleToggleChange = () => {
    if (!userLoggedIn && !isPro) {
      // Prompt login if switching to Pro and not logged in
      doSignInWithGoogle().then(() => setIsPro(true));
    } else {
      setIsPro(!isPro);
      setSelectedCategories([]);
    }
    // setIsPro(!isPro);
    // setSelectedCategories([]);

    if(!isPro) {
      setSelectedCategories(['SocialMedia'])
    } else {
      setSelectedCategories(['Business'])
    }
    
  };
  const displayedCategories = isPro ? proCategories : genCategories;

  

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : '';
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    console.log('Language changed to:', event.target.value); 
  };

  
  



  return (
    <div className="app-container">
      {/* Navigation bar */}
      <div className="navbar">
        <div className="nav-left">
          <div>
            <span className="solved-counter">Comm: </span>
            <span className="count">{`${solvedQuestions.length}`}</span>
          </div>
          

          {userLoggedIn && (
            <>
              <div>
              <span className="solved-counter">{getFirstName(currentUser.displayName)}: </span>
              <span className="count">{`${userSolvedQuestions.length}`}</span>

              </div>
              

              {/* <span>Solved by {getFirstName(currentUser.displayName)}: {userSolvedQuestions}</span> */}
            </>
          )}


          

        </div>
        {/* <div className="nav-center"> */}
          
        <div className="nav-center">
          <div className="button b2" id="button-10" >
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={isPro} 
              // onClick={handleToggleChange}  
              onChange={handleToggleChange}
            />
            <div className="knobs">
              <span className={!isPro ? 'active' : ''}>Gen</span>
            </div>
            <div className="layer"></div>
          </div>

          <div className="category-checkboxes">
            {/* {categoriesList.map((category) => ( */}
            {displayedCategories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>

          {/* <div className="dropdown">
            <button className='dropdown-btn'>Categories</button>
            <div className="dropdown-content">
              {displayedCategories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div> */}

        </div>

        <div className="nav-right">
          

          {userLoggedIn ? (
            <>
              <button className='login-logout' onClick={doSignOut}>Logout</button>
            </>
          ) : (
            <button className='login-logout' onClick={doSignInWithGoogle}>Login</button>
          )}
          
          <div className='menu'>
            <button className='menu-btn'>Menu</button>
            <div className='menu-content'>

            <div>
              <h3>Language</h3>
              <div className="language-toggle">
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    // checked={language === 'en'}
                    onChange={handleLanguageChange}
                  />
                  English
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="hinglish"
                    // checked={language === 'hinglish'}
                    onChange={handleLanguageChange}
                  />
                  Hinglish
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="gujlish"
                    // checked={language === 'gujlish'}
                    onChange={handleLanguageChange}
                  />
                  Gujlish
                </label>
              </div>

            </div>
            

            <div>
              <h3>Categories</h3>
                {displayedCategories.map((category) => (
                  <label key={category}>
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
            </div>

              

              

            </div>

              

          </div>

          <div className="dropdown">
            <button className='dropdown-btn'>Categories</button>
            <div className="dropdown-content">
              {displayedCategories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>


          <div className="language-dropdown">
            <button className="language-dropdown-btn">Language</button>
            <div className="language-dropdown-content">
            <div className="language-toggle">
              <label>
                <input
                  type="radio"
                  name="language"
                  value="en"
                  // checked={language === 'en'}
                  onChange={handleLanguageChange}
                />
                English
              </label>
              <label>
                <input
                  type="radio"
                  name="language"
                  value="hinglish"
                  // checked={language === 'hinglish'}
                  onChange={handleLanguageChange}
                />
                Hinglish
              </label>
              <label>
                <input
                  type="radio"
                  name="language"
                  value="gujlish"
                  // checked={language === 'gujlish'}
                  onChange={handleLanguageChange}
                />
                Gujlish
              </label>
            </div>
            </div>
          </div>
          
          
        </div>
         

        
      </div>

      


      {/* Grid container */}
      <div className="grid-container">
        
        {cards.map((card) => (
          
          <div key={card._id} className="card-item">
            <p>{card.title}</p>
            <p><span style={{fontWeight: 'bold'}}>Core Concept: <br></br></span>{card.content}</p>
            <br></br>

            {audioFiles[card.audioLabels] && (
              <audio style={{width: '180px'}} controls>
                <source src={audioFiles[card.audioLabels]} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

          </div>
        ))}

        {questions.map((q) => {
          const labels = q.labels || []; 
          const imageUrl = labels.find(label => labelImages[label]) ? labelImages[labels.find(label => labelImages[label])] : adImage;
          const isSolved = userLoggedIn ? userSolvedQuestions.includes(q._id) : solvedQuestions.includes(q._id);

          return (
            
            <div key={q._id} className={`grid-item ${isSolved ? 'correct' : ''}`} style={{ backgroundColor: isSolved && userLoggedIn ? '#97E59F' : '' }}>
              
              <p>
                {q.question && q.question[language]
                  ? q.question[language]
                  : 'Question not available in selected language'}
              </p>
              <div className="ad-banner">
                <img src={imageUrl} alt="Advertisement" />
              </div>
              {q.options.map((option, index) => (
                <label key={index}>
                  <input
                    className="radio-input"
                    type="radio"
                    name={`question-${q._id}`}
                    checked={selectedAnswers[q._id] === index}
                    onChange={() => handleAnswerChange(q._id, index)}
                  />
                  <span className="custom-radio" />
                  {option}
                </label>
              ))}
            </div>
       
          );
        })}
      </div>
    </div>
  );

};


export default App;


