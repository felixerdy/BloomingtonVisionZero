import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap';
import $ from 'jquery'; 


// https://stackoverflow.com/a/32922725/5660646
$(document).on('click', '.dropdown-menu', e => {
    e.stopPropagation();
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
