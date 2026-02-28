  //this is input component, for users to type in ingrediant and will trigger callback
  // onSearch when submitted
  
  //brings in the useState from react library, can track the text typed
  import { useState } from 'react';


//Calls onSearch on input submission, 
  function SearchBar({ onSearch }) {
    const [input, setInput] = useState(''); //stores the user input, starts empty


//Run when form submited
    const handleSubmit = (e) => {
      e.preventDefault(); //stops browser from reloading page
      if (input.trim()) onSearch(input); //sends input value to parent
    };

//creates the form with the button 
    return (
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter ingredients (e.g. chicken, garlic, lemon)"
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    );
  }

//allows this SearchBar to be used by other files
  export default SearchBar;