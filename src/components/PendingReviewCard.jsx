import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { browserHistory } from 'react-router';
import Firebase from '../config/firebase';



var userUID = localStorage.getItem('userUID');
var element = [];
var requestService;


const styles = {
    card: {
        minWidth: 275,
        display: 'flex',
        flexWrap: 'wrap'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};

class SimpleCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            serviceRequests: []
        }
        Firebase.database()
            .ref(`Users/${userUID}/serviceRequests`)
            .once('value', (snapshot) => {
                requestService = snapshot.val()
                for (const index in requestService) {
                    element.push(requestService[index])
                }
                this.setState({
                    serviceRequests: element
                })
            })
    }

    //const bull = <span className={classes.bullet}>•</span>;
    render() {
        const { classes } = this.props;
        const { serviceRequests } = this.state
        return (
            <Card className={classes.card}>
               
                {(serviceRequests !== []) ? serviceRequests.map((element, i) => <div className="row" key={i}> <div>
                    <CardContent>
                        <Typography className='p'>
                            {element.fixerFullName}
                            <br />
                            {element.profession}
                        </Typography>
                    </CardContent>
                </div>
                    <div>
                        <CardActions>
                            <Button size="small"
                                onClick={() =>
                                    (element.reviewStatus === 'pending') ?
                                        browserHistory.push({
                                            pathname: '/givereview',
                                            state: {
                                                'fixerUID': element.fixerUID
                                            }
                                        }) : null
                                }
                            >{(element.reviewStatus === 'pending') ? `Pending Review` : null}
                                {(element.reviewStatus === 'reviewed') ? `Reviewed` : null}
                            </Button>
                        </CardActions>
                    </div> </div>) : null}
            </Card>
        );
    }
}

SimpleCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);