import axios from 'axios';
import { useEffect, useState } from 'react'; 

export default function Dashboard() {
  const [gameBoard, setGameBoard] = useState();

  useEffect(() => {
    axios.get("http://www.hyeumine.com/bingodashboard.php?bcode=ksFWEKc8")
  .then(res => { setGameBoard(res.data); })
  },[]);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: gameBoard }} />
    </>
  );
}