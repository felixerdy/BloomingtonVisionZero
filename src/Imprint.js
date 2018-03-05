import React, { Component } from 'react';
import 'bootstrap';
import $ from 'jquery'; 

class Imprint extends Component {

    toggle() {
        $(this.refs.modal).modal().show()
    }

    render() {
        return (
            <div className="modal fade" ref='modal'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">About</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" >&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        Submission for the <a href='https://opendata-contest.splashthat.com/'>Open Data Challenge</a> by <a href='https://www.mapbox.com/'>Mapbox</a> and <a href='https://bloomington.in.gov/'>City of Bloomington</a>.
                        Of course: <a href="https://github.com/felixerdy/BloomingtonVisionZero">open source</a> <span style={{color:'#e74c3c'}}>&hearts;</span> 
                        <br />
                        <br />
                        Developed by Felix Erdmann
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal">Okay!</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Imprint;