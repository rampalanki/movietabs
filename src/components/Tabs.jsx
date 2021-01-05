import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [movieTitle, setMovieTitle] = React.useState("");
  const [releaseYear, setReleaseYear] = React.useState("");
  const [moviesList, setMoviesList] = React.useState([]);
  const [movieInfo, setMovieInfo] = React.useState({});

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const actionsArray = [
    {
      tooltip: "",
      icon: () => (
        <Button variant="contained" color="primary">
          More Info
        </Button>
      ),
      onClick: (event, rowData) => getMoreDetails(event, rowData),
    },
  ];
  const actionsArray2 = [
    {
      tooltip: "",
      icon: () => (
        <Button variant="contained" color="primary" >
          Poster
        </Button>
      ),
      onClick: (event, rowData) => getMoreDetails(event, rowData),
    },
  ];
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setMovieTitle("");
    setReleaseYear("");
    setMoviesList([]);
    setMovieInfo({});
    setValue(newValue);
  };

  const movieTitleChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const releaseYearChange = (event) => {
    setReleaseYear(event.target.value);
  };

  const getMoreDetails = (event, rowData) => {
    console.log("rowData", rowData);
    setOpen(true);
    fetch(
      `http://www.omdbapi.com/?i=${rowData.imdbID}&plot=full&apikey=d7f0f3ea`
    )
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          console.log("result", result);
          setMovieInfo(result);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getMoviesList = () => {
    fetch(
      `http://www.omdbapi.com/?s=${movieTitle}&y=${releaseYear}&apikey=d7f0f3ea`
    )
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          setMoviesList(result.Search);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <form className={classes.root} noValidate autoComplete="off">
          <div className="col-md-9 py-4">
            <TextField
              style={{ width: "100%" }}
              id="outlined-search"
              label="Movie Title"
              name="MovieTitle"
              type="text"
              onChange={movieTitleChange}
              variant="outlined"
            />
          </div>
          <div className="col-md-9 py-2">
            <TextField
              style={{ width: "100%" }}
              id="outlined-search"
              label="Release Year"
              name="ReleaseYear"
              type="text"
              variant="outlined"
              onChange={releaseYearChange}
            />
          </div>
          <div className="col-md-9 py-4">
            <Button variant="contained" color="primary" onClick={getMoviesList}>
              Submit
            </Button>
          </div>
          {moviesList && moviesList.length > 0 ? (
            <div className="dashboard">
              <MaterialTable
                title="Movie Information"
                columns={[
                  { title: "Title", field: "Title" },
                  { title: "Type", field: "Type" },
                  { title: "Year", field: "Year" },
                ]}
                data={moviesList}
                actions={actionsArray}
                options={{
                  actionsColumnIndex: -1,
                }}
              />
            </div>
          ) : null}
        </form>
        <div>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <>
              {Object.keys(movieInfo).length > 0 ? (
                <>
                  <DialogTitle id="responsive-dialog-title">
                    {`${movieInfo.Title} Movie Information`}
                  </DialogTitle>
                  <DialogContent>
                    {Object.keys(movieInfo).map((key) => {
                      return (
                        <DialogContentText>
                          <div className="row">
                            <div className="col-3 text-bold"> {key}</div>
                            <div className="col-9 text-color">
                              {typeof movieInfo[key] !== "object"
                                ? movieInfo[key]
                                : JSON.stringify(movieInfo[key])}{" "}
                            </div>
                          </div>
                        </DialogContentText>
                      );
                    })}
                    <div className="row">
                      <div className="col-3 text-bold"> Box Office</div>
                      <div className="col-9 text-color">
                        <Button variant="contained" color="primary">
                          {movieInfo["imdbRating"] > 7 ? "Hit" : "Flop"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </>
              ) : null}
            </>
          </Dialog>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <form className={`${classes.root} pb-3` } noValidate autoComplete="off">
          <div className="col-md-9 py-4">
            <TextField
              style={{ width: "100%" }}
              id="outlined-search"
              label="Movie Title"
              name="MovieTitle"
              type="text"
              onChange={movieTitleChange}
              variant="outlined"
            />
          </div>
          <div className="col-md-9 py-4">
            <TextField
              style={{ width: "100%" }}
              id="outlined-search"
              label="Release Year"
              name="ReleaseYear"
              type="text"
              variant="outlined"
              onChange={releaseYearChange}
            />
          </div>
          <div className="col-md-9 mb-3">
            <Button variant="contained" color="primary" onClick={getMoviesList}>
              Submit
            </Button>
          </div>
        </form>
        {moviesList && moviesList.length > 0 ? (
          <div className="dashboard mt-2">
            <MaterialTable
              title="Movie Information"
              columns={[
                { title: "Title", field: "Title" },
                { title: "Type", field: "Type" },
                { title: "Year", field: "Year" },
              ]}
              data={moviesList}
              actions={actionsArray2}
              options={{
                actionsColumnIndex: -1,
              }}
            />
          </div>
        ) : null}
        <div>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <>
              {Object.keys(movieInfo).length > 0 ? (
                <>
                  <DialogTitle id="responsive-dialog-title">
                    {`${movieInfo.Title} Movie Information`}
                  </DialogTitle>
                  <DialogContent>
                    <div className="pb-2">
                      <img alt={movieInfo.Title} src={movieInfo.Poster && movieInfo.Poster!=='N/A'?movieInfo.Poster:"https://in.bmscdn.com/iedb/movies/images/website/poster/large/nee-enakkaga-mattum--tamil--et00015193-24-03-2017-19-02-57.jpg"} />
                    </div>
                    {Object.keys(movieInfo).map((key) => {
                      return (
                        <DialogContentText>
                          <div className="row">
                            <div className="col-3 text-bold"> {key}</div>
                            <div className="col-9 text-color">
                              {typeof movieInfo[key] !== "object"
                                ? movieInfo[key]
                                : JSON.stringify(movieInfo[key])}{" "}
                            </div>
                          </div>
                        </DialogContentText>
                      );
                    })}
                    <div className="row">
                      <div className="col-3 text-bold"> Box Office</div>
                      <div className="col-9 text-color">
                        <Button variant="contained" color="primary">
                          {movieInfo["imdbRating"] > 7 ? "Hit" : "Flop"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </>
              ) : null}
            </>
          </Dialog>
        </div>
      </TabPanel>
    </div>
  );
}
