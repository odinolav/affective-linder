import 'date-fns';
import {format} from 'date-fns/esm'
import React, {Component} from 'react';
import './css/App.css';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import { Edit, CalendarToday, Info, Warning } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar'

import SECRET_STRINGS from './text/SecretStrings';
import STRINGS from './text/Strings';
import WAKEUP from './img/morning.jpg';
import MIDMORNING from './img/midmorning.jpg';
import AFTERNOON from './img/afternoon.jpg';
import EARLYEVENING from './img/earlyevening.jpg';
import NIGHT from './img/night.jpg';
import EMILY from './img/emily.jpg';
import PROFILE from './img/profile.jpg';

const cardImgMap = {
  'Wake Up': WAKEUP,
  'Mid-Morning': MIDMORNING,
  'Afternoon': AFTERNOON,
  'Early Evening': EARLYEVENING,
  'Night': NIGHT,
  'Name': PROFILE
}

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

const styles = theme => ({
  avatar: {
    width: 60,
    height: 60,
  },
  card: {
    width: 180,
    margin: 8
  },
  expandedCard: {
    width: 350,
    margin: 4
  },
  phoneCard: {
    width: 150,
    margin: 8
  },
  expandedPhoneCard: {
    width: '99%',
    margin: 0
  },
  media: {
    height: 120,
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(-90deg)',
  },
  appBar: {
    position: 'fixed',
    top: 'auto',
    bottom: 0
  },
  bottomAppBar: {
    position: 'static',
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emilyButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto'
  },
});

class App extends Component {

  constructor() {
    super();
    //let now = new Date();
    this.state = {
      open: false,
      daySchedule: {
        'Wake Up': {1:'',2:'',3:''},
        'Mid-Morning': {1:'',2:'',3:''},
        'Afternoon': {1:'',2:'',3:''},
        'Early Evening': {1:'',2:'',3:''},
        'Night': {1:'',2:'',3:''},
      },
      'Name_Expanded': false,
      'Wake Up_Expanded': false,
      'Mid-Morning_Expanded': false,
      'Afternoon_Expanded': false,
      'Early Evening_Expanded': false,
      'Night_Expanded': false,
      dialogBody: '',
      popupTitle: '',
      name: '',
      nameComplete: false,
      dialogActions: this.OkayDialogButton(),
      eventString: `https://calendar.google.com/calendar/r/eventedit?text=Journaling+for+Emily+Linder&location=Decorah,+IA&details=Make+sure+to+visit+odinolav.com/linder`
    }
  }

  componentWillMount() {
    let today = this.getReadableDate();
    if (localStorage['daySchedule_'+today]) {
      this.setState({
        daySchedule: JSON.parse(localStorage['daySchedule_'+today]),
        name: localStorage.name ? localStorage.name : '',
        nameComplete: localStorage.nameComplete
      });
    }
  }

  componentDidMount() {
    this.beforeUnload();
  }

  beforeUnload = () => {
    let today = this.getReadableDate();
    window.addEventListener("beforeunload", (ev) => {
       ev.preventDefault();
       localStorage['daySchedule_'+today] = JSON.stringify(this.state.daySchedule);
       localStorage['name'] = this.state.name;
       localStorage['nameComplete'] = this.state.nameComplete;
    });
   };

   getHumanDate = () => {
     return format(new Date(),'MM/dd/yyyy');
   }
   getReadableDate = () => {
     return format(new Date(),'MM_dd_yyyy');
   }

   somethingExpanded = () => {
      if (this.state['Wake Up_Expanded'] || this.state['Mid-Morning_Expanded'] || this.state['Afternoon_Expanded'] ||
          this.state['Early Evening_Expanded'] || this.state['Night_Expanded']) {
        return true;
      }
      return false;
   }

   OkayDialogButton = () => {return <Button onClick={this.handleClose} color='primary'>Okay</Button>};
   EmailDialogButton = () => {return <Button target='_blank' href={`mailto:${SECRET_STRINGS.targetEmail}?subject=Research Journal for ${this.state.name} ${this.getHumanDate()}`} onClick={this.handleClose} color='primary'>Email to Emily</Button>};

   encodeEmail = () => {
     let msg = '';
     for (let [timeOfDay, responseObj] of Object.entries(this.state.daySchedule)) {
       msg += timeOfDay + '%0A';
       for (let [header, val] of Object.entries(responseObj)) {
         if (val) {msg += `   ${STRINGS.headers[header]}%0A      ${val}%0A`;}
       }
       msg += '%0A';
     }
     return msg;
   }

   makeEmailMessage = () => {
     let text = '';
     let html = [];
     for (let [timeOfDay, responseObj] of Object.entries(this.state.daySchedule)) {
       text += timeOfDay + '%0A';
       html.push(<Typography key={timeOfDay} component='span' variant='h5'>{timeOfDay}</Typography>);
       for (let [header, val] of Object.entries(responseObj)) {
         if (val) {
           text += `   ${STRINGS.headers[header]}%0A      ${val}%0A`;
           html.push(
            <span key={header+timeOfDay}>
              <Typography component='span' variant='h6'>{STRINGS.headers[header]}</Typography>
              <Typography component='span' variant='body1'>{val}</Typography>
              <br /><br />
            </span>);
         }
       }
       html.push(<span key={'br'+timeOfDay}><br />————————————————————</span>);
       text += '%0A';
     }
     return {text, html};
   }

  getDate = () => {
    return (new Date()).toISOString().replace(/-|:|\.\d\d\d/g,"");
  }

  convertDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g,"");
  }

  updateEventString = () => {
    let title = 'Journaling+for+Emily';
    let details = 'Remember+to+visit+linder.odinolav.com';
    let startTime = '';
    let endTime = ''
    this.setState({
      eventString: `https://calendar.google.com/calendar/r/eventedit?dates=${startTime}/${endTime}&location&text=${title}&details=${details}`
    });
  }

  handleNameChange = event => {
    let newVal = event.target.value;
    this.setState({name: newVal, nameComplete: (newVal.length > 4 && newVal.trim().split(' ').length > 1)});
  }

  handleChangeActivity = (timeOfDay, colIndex) => event => {
    let currentDaySchedule = this.state.daySchedule;
    currentDaySchedule[timeOfDay][colIndex] =
        event.target.value.replace(/--/, '—').replace(/\(\)/, '•').replace(/:\)/, '🙂').replace(/:D/, '😃').replace(/:\(/, '😔').replace(/:o/, '😮');

    this.setState({
      daySchedule: currentDaySchedule
    });
  }

  handleExpandClick = (timeOfDay) => {
    let name = timeOfDay+'_Expanded';
    this.setState(prevState => (
      {
        [name]: !prevState[name]
      }));
  };

  showInputDescription = (title, desc) => event => {
    this.setState({
      dialogBody: <DialogContent><DialogContentText id='alert-dialog-slide-description'>{desc}</DialogContentText></DialogContent>,
      popupTitle: title,
      dialogActions: this.OkayDialogButton(),
      open: true
    });
  }

  showMailForm = () => {
    let {text, html} = this.makeEmailMessage();
    this.setState({
      dialogBody:
        <DialogContent>
          <Typography component='span' variant='body2'>Copy the following text, then submit to Emily.</Typography>
          <br /><br />
          <DialogContentText id='alert-dialog-slide-description'>
            {html}
          </DialogContentText>
        </DialogContent>,
      popupTitle: 'Submit to Emily',
      dialogActions: this.EmailDialogButton(),
      open: true
    });
  }


  openInfoBox = () => {
    this.setState({
      dialogBody:
      <DialogContent><DialogContentText id='alert-dialog-slide-description'>
        <span><Typography component='span' variant='h6'>Background</Typography>
          {STRINGS.background}
          <br/><br/>
          <Typography component='span' variant='h6'>Instructions</Typography>
          {STRINGS.instructions}</span>
      </DialogContentText></DialogContent>,
      popupTitle: 'Research Information',
      dialogActions: this.OkayDialogButton(),
      open: true
    });
  }

  openDisclaimerBox = () => {
    this.setState({
      dialogBody:
        <DialogContent><DialogContentText id='alert-dialog-slide-description'>
            {STRINGS.disclaimer}
        </DialogContentText></DialogContent>,
      popupTitle: 'Disclaimer',
      dialogActions: this.OkayDialogButton(),
      open: true
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  LinderInput = (header, timeOfDay, i, classes, text) => {
    return <TextField
      key={`in-${timeOfDay}-${header}-${i}`}
      id='outlined-controlled'
      label={header}
      multiline
      rowsMax='20'
      fullWidth
      value={text}
      placeholder={STRINGS.headerAlternates[i]}
      onChange={this.handleChangeActivity(timeOfDay, i)}
      margin='normal'
      helperText=''
      variant='outlined'
      onDoubleClick={this.showInputDescription(header, STRINGS.headerDescriptions[i])}
    />
  }

  render() {
    const isMobile = window.innerWidth < 600;
    const { classes } = this.props;
    const ds = this.state.daySchedule;
    let cardClass;
    let mainCards = [];
    for (let [timeOfDay, rowValue] of Object.entries(ds)) {
      let expanded = timeOfDay+'_Expanded';
      let complete = ds[timeOfDay][0] && ds[timeOfDay][1];
      if (this.state[expanded] && isMobile) {
        cardClass = classes.expandedPhoneCard;
      } else if (this.state[expanded]) {
        cardClass = classes.expandedCard;
      } else if (isMobile) {
        cardClass = classes.phoneCard;
      } else {
        cardClass = classes.card;
      }
      mainCards.push(
        <Card className={cardClass} key={`c-${timeOfDay}`}>
          <CardActionArea onClick={()=>this.handleExpandClick(timeOfDay)}>
            <CardMedia
              className={classes.media}
              image={cardImgMap[timeOfDay]}
              title={timeOfDay}
            />
            <CardContent>
              <Typography gutterBottom variant={isMobile ? "h6": "h5"} component="h2">{timeOfDay}</Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Chip color={complete ? 'primary' : 'secondary'} label={complete ? 'Ready' : 'Incomplete'}/>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state[expanded],
              })}
              onClick={()=>this.handleExpandClick(timeOfDay)}
              aria-expanded={this.state[expanded]}
              aria-label="Show more"
            >
              <Edit />
            </IconButton>
          </CardActions>
          <Collapse in={this.state[expanded]} timeout="auto" unmountOnExit>
          <CardContent>
            {STRINGS.headers.map((header, i) => {
              return this.LinderInput(header, timeOfDay, i, classes.textField, rowValue[i])
            })}
          </CardContent>
        </Collapse>
        </Card>
      );
    };
    // old fab href: href={`mailto:${SECRET_STRINGS.targetEmail}?subject=Research Journal for ${this.state.name} ${this.getHumanDate()}&body=${this.encodeEmail()}`}
    return (<div id='app'>
    <div id='mainarea'>
      <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'
          scroll='body'
        >
        <DialogTitle id='alert-dialog-slide-title' color='primary'>
          <Typography component='span' variant='h4' color='primary'>{this.state.popupTitle}</Typography>
        </DialogTitle>
        {this.state.dialogBody}
        {this.state.dialogActions}
      </Dialog>

      <form className={classes.container} noValidate='noValidate'>
        <Grid container className={classes.root} justify='center' alignItems='center'>

          <Card className={isMobile ? classes.phoneCard : classes.card} key='k.1'>
            <CardActionArea onClick={()=>this.handleExpandClick('Name')}>
              <CardMedia
                className={classes.media}
                image={cardImgMap['Name']}
                title='Your info'
              />
              <CardContent>
                <Typography gutterBottom variant={isMobile ? "h6": "h5"} component="h2">Profile</Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Chip color={this.state.nameComplete ? 'primary' : 'secondary'} label={this.state.nameComplete ? 'Ready' : 'Incomplete'}/>
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state['Name_Expanded'],
                })}
                onClick={()=>this.handleExpandClick('Name')}
                aria-expanded={this.state['Name_Expanded']}
                aria-label="Show more"
              >
                <Edit />
              </IconButton>
            </CardActions>
            <Collapse in={this.state['Name_Expanded']} timeout="auto" unmountOnExit>
            <CardContent>
              <TextField
                autoFocus
                name='namefield'
                id='outlined-controlled'
                multiline
                fullWidth
                rowsMax='3'
                value={this.state.name}
                placeholder='your full name'
                onChange={e => this.handleNameChange(e)}
                margin='dense'
                helperText=''
                type='text'
                variant='standard'
              />
            </CardContent>
          </Collapse>
          </Card>

          {mainCards}
        </Grid>
      </form>
    </div>

      <AppBar color="primary"
              className={(isMobile && this.somethingExpanded()) ? classes.bottomAppBar : classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {STRINGS.title}
            <Button color="inherit" aria-label="Project Info" className='mobile' onClick={this.openInfoBox}>
              <Info />
            </Button>
          </Typography>
          <Tooltip title="Send to Emily">
            <Fab
              className={classes.emilyButton}
              target='_blank'
              onClick={this.showMailForm}
              >
              <Avatar alt="Emily Linder" src={EMILY} className={classes.avatar}/>
            </Fab>
          </ Tooltip>
          <div>
            <Tooltip title="Project Info"  className='non-mobile' onClick={this.openInfoBox}>
              <Button color="inherit" aria-label="Project Info">
                <Info />
              </Button>
            </ Tooltip>
            <Tooltip title="Disclaimer" onClick={this.openDisclaimerBox}>
              <Button color="inherit" aria-label="Disclaimer">
                <Warning />
              </Button>
            </ Tooltip>
            <Tooltip title="Reminders">
              <Button color="inherit" href={this.state.eventString} target='_blank'>
                <CalendarToday />
              </Button>
            </ Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </div>);
  }
}

export default withRoot(withStyles(styles)(App));
