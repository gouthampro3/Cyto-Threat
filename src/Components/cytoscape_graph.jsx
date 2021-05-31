import React, { Component, ReactFragment } from 'react';

//materialUI
import { styled, sizing } from '@material-ui/core/styles';
import { Paper, Grid, Box, Card, CardContent, Typography, TextField, Button, Select, MenuItem,InputLabel,FormControl, FormGroup  } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

//formik
import {Formik, Field} from 'formik';

//cytoscape
import cytoscape from 'cytoscape';
import automove from 'cytoscape-automove';
import CytoscapeComponent from 'react-cytoscapejs';

import FormikAutocomplete from './formik_autocomplete'
import NodesList from './node_table';
import Data from '../Data/data.json';
import '../Styles/cytoscape_graph.css';

//use cytoscape with automove
cytoscape.use(automove);

const GraphCard = styled(Card)({
    textAlign: 'center',
    color: 'black',
    height: '70vh',
    backgroundColor:'white',
});

const BorderedBox = styled(Box)({
    borderStyle:'dashed'
});

const SeButton = styled(Button)({
    backgroundColor:"#36C746",
    marginTop:"5px",
    marginBotton:"5px"
});

const SelectControl = styled(Select)({
    minWidth:150
});

const StyledFormControl = styled(FormControl)({
    marginRight:"5px"
});
const flexContainer = {
    display: 'flex',
};

class CytoscapeGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addnode:0,
            addedge:0,
            elements:[],
            nodesList:{}
        };
        
        this.numEdges=1;
        this.cy = ''
        this.coordinates = ''
        this.numNodes = { 'users': 0, 'se_it': 0, 'se_managed': 0, 'external': 0, }
        this.getCoordinatesOfGrids = this.getCoordinatesOfGrids.bind(this)
        this.makeGraph = this.makeGraph.bind(this)
        this.placeNodeOrEdge = this.placeNodeOrEdge.bind(this)
        this.handleAddNodeButton = this.handleAddNodeButton.bind(this)
        this.handleAddEdgeButton = this.handleAddEdgeButton.bind(this)
    }

    // Gets 2d coordinates of Grids for automove to position components in them. 
    getCoordinatesOfGrids() {
        let coordinates = { 'users': {}, 'se_it': {}, 'se_managed': {}, 'external': {}, }
        for (var paper in coordinates) {
            coordinates[paper] = (document.getElementById(paper).getBoundingClientRect()).toJSON();
        }
        this.coordinates = coordinates
    }

    placeNodeOrEdge(obj) {
        console.log(this.state.nodesList)
        var tempList
        if (obj.group == 'nodes') {
            let temp_coods = this.coordinates[obj.data.category]
            obj['position'] = {
                'x': temp_coods.left + temp_coods.width / 2,
                'y': temp_coods.top + (this.numNodes[obj.data.category] + 1) * 100
            }
            this.cy.add(obj)
            this.cy.automove({
                nodesMatching: this.cy.$("#" + obj.data.id),
                reposition: {
                    x1: temp_coods.x + (temp_coods.width / 20),
                    x2: temp_coods.x + temp_coods.width - (temp_coods.width / 20),
                    y1: temp_coods.y + (temp_coods.height / 20),
                    y2: temp_coods.y + temp_coods.height - (temp_coods.height / 20),
                }
            });
            this.numNodes[obj.data.category]++
            obj.data['edges']=[]

            tempList=this.state.nodesList
            tempList[JSON.stringify(obj.data.id)]=obj.data
            this.setState({nodesList:tempList})
        }
        else {
            this.numEdges++
            this.cy.add(obj)
            tempList=this.state.nodesList
            tempList[JSON.stringify(obj.data.source)].edges.push(obj.data.target)
            tempList[JSON.stringify(obj.data.target)].edges.push(obj.data.source)
            this.setState({nodesList:tempList})
        }
        return 0;
    }

    // Sets the behaviour of the referenced cy object. Will run only once
    makeGraph() {
        this.cy.panningEnabled(false)

        //there to fillin test data
        /*
        for (var i = 0; i < this.state.elements.length; i++) {
            this.placeNodeOrEdge(this.state.elements[i])
        }*/

        this.cy.style()
            .selector('node')
            .style('background-color', '#e91e63')
            .selector('edge')
            .style({
                'width': 3,
                'line-color': '#01579b'
            })
            .update();

        return 0;
    }

    handleAddNodeButton(){
        if(this.state.addnode===1){
            this.setState({addnode:0})
        }
        else if(this.state.addnode===0){
            this.setState({addnode:1})
        }
    }
    handleAddEdgeButton(){
        if(this.state.addedge===1){
            this.setState({addedge:0})
        }
        else if(this.state.addedge===0){
            this.setState({addedge:1})
        }
    }

    componentDidMount() {
        // To remove the example nodes that cytoscape-react creates
        this.cy.remove(this.cy.nodes())
        this.getCoordinatesOfGrids()
        this.makeGraph()
    }

    render() {
        /*  For debugging
        if(this.cy!==''){
            console.log(this.cy.json())
        } */
        const flatProps ={
            options:[]
        }
        if(this.state.addedge===1){
            for (var i=0;i<this.state.elements.length;i++){
                if(this.state.elements[i].group==='nodes'){
                    flatProps.options.push(this.state.elements[i].data.id)
                }
            }
        }
        return (
            <Box m={2}>
                <Box fontWeight="fontWeightBold" fontSize={30} position='relative'>
                    <Grid container spacing={1} position='relative'>
                        <Grid item xs={3}>
                            <BorderedBox border={2} borderColor='#36C746'>
                                <GraphCard id="users" elevation={5}>
                                    <CardContent>
                                        <Typography style={{'backgroundColor':'#36C746','color':'white'}} variant="h5" component="h2">
                                            Users
                                        </Typography>
                                    </CardContent>
                                </GraphCard>
                            </BorderedBox>
                        </Grid>
                        <Grid item xs={3}>
                            <BorderedBox border={2} borderColor='#36C746'>
                                <GraphCard id="se_it" elevation={5}>
                                    <CardContent>
                                        <Typography style={{'backgroundColor':'#36C746','color':'white'}} variant="h5" component="h2">
                                            SE/IT
                                        </Typography>
                                    </CardContent>
                                </GraphCard>
                            </BorderedBox>
                        </Grid>
                        <Grid item xs={3}>
                            <BorderedBox border={2} borderColor='#36C746'>
                                <GraphCard id="se_managed" elevation={5}>
                                    <CardContent>
                                        <Typography style={{'backgroundColor':'#36C746','color':'white'}} variant="h5" component="h2">
                                            SE Managed
                                        </Typography>
                                    </CardContent>
                                </GraphCard>
                            </BorderedBox>
                        </Grid>
                        <Grid item xs={3}>
                            <BorderedBox border={2} borderColor='#36C746'>
                                <GraphCard id="external" elevation={5}>
                                    <CardContent>
                                        <Typography style={{'backgroundColor':'#36C746','color':'white'}} variant="h5" component="h2">
                                            External
                                        </Typography>
                                    </CardContent>
                                </GraphCard>
                            </BorderedBox>
                        </Grid>
                    </Grid>
                    <CytoscapeComponent
                        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                        cy={(cyRef) => { this.cy = cyRef }}
                    />
                </Box>
                <Box>
                    <Box my={1}>
                        <Grid container spacing={1}>
                            <Grid item >
                                <SeButton variant="contained" onClick={this.handleAddNodeButton}>Add Node</SeButton>
                            </Grid>
                            <Grid item >
                                <SeButton variant="contained" onClick={this.handleAddEdgeButton}>Add Edge</SeButton>
                            </Grid>
                        </Grid>
                    </Box>
                    { (this.state.addnode===1) ?<Formik
                                                    initialValues={{ 'id': '', 'label':'','category':'','type':'','scope':'', 'remark':'' }}
                                                    onSubmit = {
                                                        (values,actions)=>{
                                                            var temp_ele = this.state.elements
                                                            temp_ele.push({'data':values,'group':'nodes'})
                                                            this.placeNodeOrEdge({'data':values,'group':'nodes'})
                                                            actions.resetForm()
                                                            this.setState(({elements:temp_ele}))
                                                        }
                                                    }
                                                >
                                                    {props=>(
                                                        <form style={flexContainer}>
                                                            <FormGroup row={true}>
                                                                <StyledFormControl>
                                                                    <TextField width="80%" label="Id" type='text' onChange={props.handleChange} value={props.values.id} name="id" variant= "outlined" required/>
                                                                </StyledFormControl>
                                                                <StyledFormControl>
                                                                    <TextField label="Label" type='text' onChange={props.handleChange} value={props.values.label} name="label" variant= "outlined" required/>
                                                                </StyledFormControl>
                                                                <StyledFormControl>
                                                                    <TextField label="User Type" type='text' onChange={props.handleChange} value={props.values.type} name="type" variant= "outlined" required/>
                                                                </StyledFormControl>
                                                                <StyledFormControl required>
                                                                    <InputLabel id="category-label">Category</InputLabel>
                                                                    <SelectControl width="80%" id="category" labelId  = "category-label" onChange={props.handleChange} value={props.values.category} name="category" >
                                                                        <MenuItem value="users">Users</MenuItem>
                                                                        <MenuItem value="se_it">SE/IT</MenuItem>
                                                                        <MenuItem value="se_managed">SE Managed</MenuItem>
                                                                        <MenuItem value="external">External</MenuItem>
                                                                    </SelectControl>
                                                                </StyledFormControl>
                                                                <StyledFormControl required>
                                                                    <InputLabel id="category-label2">Scope</InputLabel>
                                                                    <SelectControl labelWidth={5} id="scope" labelId="category-label2" onChange={props.handleChange} value={props.values.scope} name="scope">
                                                                        <MenuItem value="in_scope">In Scope</MenuItem>
                                                                        <MenuItem value="out_of_scope">Out of Scope</MenuItem>
                                                                    </SelectControl>
                                                                </StyledFormControl>
                                                                <StyledFormControl>
                                                                    <TextField label="remark" type='text' onChange={props.handleChange} value={props.values.remark} name="remark" variant= "outlined" required/>
                                                                </StyledFormControl>
                                                                <SeButton variant="contained" onClick={props.handleSubmit}>Submit</SeButton>
                                                            </FormGroup>
                                                        </form>
                                                    )}
                                                </Formik>
                                                : null
                    }
                    {
                        (this.state.addedge===1)?<Formik
                                                    initialValues={{ 'id':'','source': '', 'target':'','label':''}}
                                                    onSubmit = {
                                                        (values,actions)=>{
                                                            values.id=this.numEdges
                                                            var temp_ele = this.state.elements
                                                            temp_ele.push({'data':values,'group':'edges'})
                                                            this.placeNodeOrEdge({'data':values,'group':'edges'})
                                                            this.setState(({elements:temp_ele}))
                                                            actions.resetForm()
                                                        }
                                                    }
                                                >
                                                    {props=>(
                                                        <form style={flexContainer}>
                                                            <FormGroup row={true}>
                                                                <StyledFormControl required>
                                                                    <Field component={FormikAutocomplete} label="Srouce"
                                                                        options={flatProps.options}
                                                                        value={props.values.source}
                                                                        name="source"
                                                                        textFieldProps={{ fullWidth: true,label:'Source' }}
                                                                    />
                                                                </StyledFormControl>
                                                                <StyledFormControl required>
                                                                    <Field component={FormikAutocomplete} label="Target"
                                                                        options={flatProps.options}
                                                                        value={props.values.source}
                                                                        name="target"
                                                                        textFieldProps={{ fullWidth: true,label:'Target' }}
                                                                    />
                                                                </StyledFormControl>
                                                                <StyledFormControl required>
                                                                    <TextField label="Label" type='text' onChange={props.handleChange} value={props.values.label} name="label" variant= "outlined" required/>
                                                                </StyledFormControl>
                                                                <SeButton variant="contained" onClick={props.handleSubmit}>Submit</SeButton>
                                                            </FormGroup>
                                                        </form>
                                                    )}
                                                </Formik>
                                                :null
                    }
                </Box>
                <Box marginTop={2}>
                    <NodesList elements={this.state.nodesList}/>
                </Box>
            </Box>

        );
    }
}

export default CytoscapeGraph;