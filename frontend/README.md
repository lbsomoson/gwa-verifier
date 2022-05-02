# Frontend

## Core Contributors
* Niels Arias [@neilsarias](https://github.com/neilsarias/)
* Jean Joachim Baldopeña [@Baldopena](https://github.com/Baldopena/)
* Myka Miranda [@mdmiranda](https://github.com/mdmiranda/)
* Lea Marie Somoson [@xxyangxx](https://github.com/xxyangxx/)

## Guidelines
### Running the Application
For first time run, use the command `npm install` then `npm start`. Otherwise, just use `npm start`.


### Importing Files
#### Example Patterns
* Example#1: creating basic component and importing it
```// src/components/Component1.js
import React from "react";

class Component1 extends React.Component {

    render() {
        return <h1>I am a simple component</h1>
    }
}

export default Component1;
```
```// src/pages/SamplePage.js
import React from "react";
// to use Component1, we import them
import Component1 from "components/Component1";

class SamplePage extends React.Component {
    render() {
        return (
            <p>Inside the sample page<p>
            <Component1 />
        )
    }
}

export default SamplePage;
```

* Example#2: creating a component with separate style using [css modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)
```
/* We create two files, one index.js file and one css file 
src/components/BasicButton/BasicButton.module.css */

.button {
	padding: 5px 10px;
	/* ... styles go here */
}

.ghost-button {
	border: 1px solid #f91;
	background: none;
	/* ... styles go here */
}
```
```
// src/components/BasicButton/index.jsx
import React from "react";
import styles from "./BasicButton.module.css";

function BasicButton() {
	return (
		<button className={styles.button}>I am a button</button>
		/*
      for multiple styles, here's a reference https://stackoverflow.com/questions/33949469/using-css-modules-how-do-i-define-more-than-one-style-name
    */
	);
}

export default BasicButton;
// and then we import the component just like in Example#1
```
### Routing
- Here are the routes to be expected
    - /
    - /main

