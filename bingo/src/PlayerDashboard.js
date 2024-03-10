import { useParams } from "react-router-dom";
import "./index.css";
import { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import axios from "axios";

export default function PlayerDashboard() {
  const { gameCode } = useParams();
  const [bingoCards, setBingoCards] = useState([]);
  const [, setGameBoard] = useState();
  const [numberArray, setNumberArray] = useState([]);

  const generateCard = () => {
    axios
      .get(`http://www.hyeumine.com/getcard.php?bcode=${gameCode}`)
      .then((res) => {
        const randomColor = getRandomColor();
        const cardData = res.data.card;
          const playcard = {
            playcard_token: res.data.playcard_token,
            color: randomColor,
            winStatus: -1,
            card: Object.keys(cardData).map((key) => ({
              letter: key,
              values: cardData[key].map((number) => ({
                number,
                isRolled: numberArray.includes(number),
              })),
            })),
          };
          axios
            .get(
              `http://www.hyeumine.com/checkwin.php?playcard_token=${playcard.playcard_token}`
            )
            .then((result) => {
              playcard.winStatus = result.data;
              setBingoCards((prevCards) => [...prevCards, playcard]);
            })
      })
  };

  const checkWin = (playcardToken) => {
    axios
      .get(`http://www.hyeumine.com/checkwin.php?playcard_token=${playcardToken}`)
      .then((res) => {
        const updatedCards = bingoCards.map((bingoCard) => {
          if (bingoCard.playcard_token === playcardToken) {
            return {
              ...bingoCard,
              winStatus: res.data,
              card: bingoCard.card.map((column) => ({
                ...column,
                values: column.values.map((value) => ({
                  ...value,
                  isRolled: numberArray.includes(value.number),
                })),
              })),
            };
          }
          return bingoCard;
        });
        setBingoCards(updatedCards);
      })
  };
  

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`http://www.hyeumine.com/bingodashboard.php?bcode=${gameCode}`)
        .then((res) => {
          setGameBoard(res.data);
          const regex =
            /<button[^>]*class="btn btn-success"[^>]*>(\d+)<\/button>/g;
          const matches = res.data.match(regex);
          const numbers = matches
            ? matches.map((match) =>
                parseInt(match.replace(/<\/?[^>]+(>|$)/g, ""), 10)
              )
            : [];
          const numberArray =
            numbers && numbers.length ? numbers : Array(25).fill(0);
          setNumberArray(numberArray);
        })
        .catch((error) => {
          console.error("Error fetching game data:", error);
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameCode]);

  const handleGetAnotherCard = () => {
    generateCard();
    console.log(bingoCards);
  };

  const getRandomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <div className="App">
      <h2>Game Code: {gameCode}</h2>
      <Button
        variant="contained"
        sx={{
          height: "55px",
          marginLeft: "10px",
          backgroundColor: "#32937c",
          "&:hover": {
            backgroundColor: "#61992f",
          },
        }}
        onClick={handleGetAnotherCard}
        disabled={gameCode.trim() === ""}
      >
        Get Another Card
      </Button>
      <Grid container spacing={2}>
        {bingoCards.map((bingoCard, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <div
              className="bingo-card-wrapper"
              style={{
                border: `5px solid ${bingoCard.color}`,
                color: bingoCard.color,
              }}
            >
              <img src="/bingo_logo.png" alt="bingo logo" />
              <p>Playcard token: </p>
              <h3>{bingoCard.playcard_token}</h3>
              {bingoCard.winStatus === 1 ? <p>Bingo! You won!</p> : null}
              <div className="bingo-card">
                {bingoCard.card.map((column, columnIndex) => (
                  <div className="bingo-column" key={columnIndex}>
                    <div
                      className="bingo-cell"
                      style={{
                        border: `1px solid ${bingoCard.color}`,
                        color: bingoCard.color,
                      }}
                    >
                      {column.letter}
                    </div>
                    {Array.isArray(column.values) &&
                      column.values.map((value, index) => (
                        <div
                          className="bingo-cell"
                          key={index}
                          style={{
                            border: `1px solid ${bingoCard.color}`,
                            color: value.isRolled ? "white" : bingoCard.color,
                            backgroundColor: value.isRolled
                              ? "#06361b"
                              : "white",
                          }}
                        >
                          {value.number}
                        </div>
                      ))}
                  </div>
                ))}
              </div>

              <Button
                variant="contained"
                sx={{
                  height: "55px",
                  marginTop: "10px",
                  backgroundColor: "#61992f",
                  "&:hover": {
                    backgroundColor: "#2b4613",
                  },
                }}
                onClick={() => checkWin(bingoCard.playcard_token)}
                disabled={gameCode.trim() === ""}
              >
                Check Win
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
