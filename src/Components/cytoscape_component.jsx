import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import automove from 'cytoscape-automove';
import CytoscapeComponent from 'react-cytoscapejs';

//cytoscape.use( automove );
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class CytoscapeGraph1 extends Component {
    constructor(props) {
        super(props);
        this.cy=''
        this.state={
            data:3
        }
        this.rerenderbruh = this.rerenderbruh.bind(this)
    }

    componentDidMount(){
        sleep(5000).then(() => {
            console.log('Hello world');
            this.cy.add([{ data: { id: '3', label: 'Node 3' }, position: { x: 100, y: 100 } },
            { data: { source: '1', target: '3'} }])
            this.cy.automove({
                nodesMatching: this.cy.$('#1'),
                reposition: { x1: 350, x2: 450, y1: 100, y2: 200 }
            });
            this.cy.$('#1').position({ x: 400, y: 150 });
            //this.cy.autoselectify(false);
            this.cy.panningEnabled(false)
        })
    }
    rerenderbruh(){
        var count=this.state.data+1
        this.cy.add([{ data: { id: String(count), label: 'Node '+String(count) }, position: { x: 100, y: 100 } },
            { data: { source: String(this.state.data), target: String(count),} }])
        this.setState({data:this.state.data+1});
    }
    
    render() {
        const elements = [
            { data: { id: '1', label: 'Node 1' }, position: { x: 0, y: 0 } },
            { data: { id: '2', label: 'Node 2' }, position: { x: 100, y: 0 } },
            { data: { source: '1', target: '2', label: 'Edge from Node1 to Node2' } }
        ];
        console.log(this.state.data)
        return(
            <div>
                <CytoscapeComponent 
                    elements={elements} 
                    style={{ width: '50%', height: '50%', position: 'absolute' }} 
                    cy={(cyRef)=>{this.cy=cyRef}} 
                />
                <h1>{this.state.data}</h1>
                <button onClick = {this.rerenderbruh} style={{position:'relative'}}>TrustME</button>
            </div>
        )
    }
}
export default CytoscapeGraph1;