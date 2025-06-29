import { useState } from "react";

function Header({name}){
    return (
        <h1>Belajar React Bersama {name ? name : "JACK"}</h1>
    );
}
function App(){
    const [likes, setLikes] = useState(0);
    
    function HandleLikes(){
        setLikes(likes + 1);
    }

    return(
        <div>
            <Header name={"Crot"}/>
            <Header/>
            <h1>Hello World</h1>
            <p>Belajar React</p>
            <p>Like = {likes}</p>
            <button onClick={HandleLikes}>Tambah likes</button>
        </div>
    );  
}

export default App;