import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginBottom: '5vh',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexShrink: 0,
    },
    accordionSummary: {
        background: '#e88d72',
        color: '#543855',
    }
}));

export default function Error(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1bh-content' id='panel1bh-header' className={classes.accordionSummary}>
                    <Typography className={classes.heading}>Error(s)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ul>
                            {props.errors.map(error => <li>{error}</li>)}
                        </ul>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
