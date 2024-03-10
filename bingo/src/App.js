import "./App.css";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

function App() {
  const [gameCode, setGameCode] = useState("");

  const getGameCode = (e) => {
    setGameCode(e.target.value)
  };

  return (
    <>
      <div className="App">
        <div className="Bingo-Logo">
          <img src="/bingo_logo.png" alt="bingo logo" />
        </div>
        <TextField
          id="game-code"
          label="Game Code"
          sx={{ 
          width: "340px",
          }}
          onChange={
            getGameCode
          }
        ></TextField>
        <Link to={`/bingo/play/${gameCode}`}>
        <Button variant="contained" sx={{ 
          height: "55px",
          marginLeft: "10px",
          backgroundColor: "#32937c",
          "&:hover": {
            backgroundColor: "#61992f",
          }
          }}
          disabled={gameCode.trim() === ""}>
          {" "}
          Enter Game{" "}
        </Button>
        </Link>
      </div>
    </>
  );
}

export default App;
