import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody,TableCell,TableContainer, TableHead, TableRow, Tab  } from '@material-ui/core';
import {Paper} from '@material-ui/core'

const useStyles = makeStyles({
    table: {
      minWidth: 650
    },
    head:{
        backgroundColor:"#36C746",
    }
});

export default function NodesList(props){
    const classes = useStyles();
    var data=[];
    if(props.elements.length!==0){
        data=Object.values(props.elements)
    }
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table}>
                <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Scope</TableCell>
                        <TableCell>C1</TableCell>
                        <TableCell>C2</TableCell>
                        <TableCell>C3</TableCell>
                        <TableCell>C4</TableCell>
                        <TableCell>C5</TableCell>
                        <TableCell>Remarks</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        (data.length===0)?null
                                        :data.map((row)=>{
                                            var tempEdges=[]
                                            var count=0;
                                            for(var j=0;j<row.edges.length;j++){
                                                tempEdges.push(<TableCell key={count.toString()}>{row.edges[j]}</TableCell>)
                                                count++
                                            }
                                            for(var j=0;j<5-row.edges.length;j++){
                                                tempEdges.push(<TableCell key={count.toString()} >-</TableCell>)
                                                count++
                                            }
                                            console.log(tempEdges)
                                            return (
                                                <TableRow key ={row.id}>
                                                    <TableCell>{row.id}</TableCell>
                                                    <TableCell>{row.label}</TableCell>
                                                    <TableCell>{row.type}</TableCell>
                                                    <TableCell>{row.scope}</TableCell>
                                                    {tempEdges.map(edge=>(edge))}
                                                    <TableCell>{row.remark}</TableCell>
                                                </TableRow>
                                            )
                                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

