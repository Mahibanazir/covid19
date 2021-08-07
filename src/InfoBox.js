import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

const InfoBox = ({title , cases, isRed, active, total, ...props}) => {
    return (
        <Card 
        onClick={props.onClick}
         className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
            <CardContent>
                <Typography color="textSecondary"
                 className="infobox__title">{title}
                </Typography>

                <h2 className="infoBox__cases">{cases}</h2>

                <Typography color="textSecondary"
                 className="infoBox__total">{total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
