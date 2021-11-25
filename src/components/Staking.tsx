import React, { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from "@material-ui/core";

import { ExpandMoreOutlined } from "@material-ui/icons";

import staking from "../assets/earn_staking.png";
import swap from "../assets/swap_xnav.png";
import nav from "../assets/NAV.png";
import xnav from "../assets/XNAV.png";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function Staking(props: any): React.ReactElement {
  const { addresses, onAddNode, onOpenNode } = props;

  const [pageNumber, setPageNumber] = useState(1);

  const { height, width } = useWindowDimensions();

  const itemsCount = Math.floor((height - 390) / 70);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            m: 4,
            mb: 2,
            maxWidth: "100%",
            wordWrap: "break-word",
            textAlign: "center",
          }}
          variant={"h4"}
        >
          Staking
        </Typography>

        <Box
          sx={{
            maxWidth: 800,
            width: "90%",
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
            mt: 2,
            alignSelf: "center",
          }}
        >
          <List
            sx={{
              maxWidth: 800,
              bgcolor: "background.paper",
              overflow: "scroll",
              flexGrow: 1,
            }}
          >
            {Object.keys(addresses.staking)
              .slice((pageNumber - 1) * itemsCount, pageNumber * itemsCount)
              .map((el: any) => {
                return addresses.staking[el].staking ? (
                  <>
                    <ListItem
                      alignItems="flex-start"
                      key={
                        addresses.staking[el].label
                          ? addresses.staking[el].label.address
                          : el
                      }
                      sx={{
                        paddingLeft: 4,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar alt={nav} src={nav} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.success.light,
                              fontSize: "14px",
                            }}
                          >
                            {addresses.staking[el].label
                              ? addresses.staking[el].label.name
                              : el}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{
                                display: "inline",
                                fontSize: "12px",
                                width: "10",
                                textOverflow: "hidden",
                              }}
                              variant="body2"
                              color="text.primary"
                            >
                              {el.substr(0, 10)}...
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              float: "right",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                paddingRight: 0,
                                textAlign: "right",
                                fontSize: "12px",
                              }}
                              color="text.secondary"
                              variant="body2"
                            >
                              {addresses.staking[el].staking.confirmed / 1e8}
                              {" NAV"}
                            </Typography>
                            <Button
                              variant={"text"}
                              onClick={() => {
                                const obj = addresses.staking[el];
                                if (!addresses.staking[el].label) {
                                  obj.label = { name: el, address: el };
                                }
                                onOpenNode(obj);
                              }}
                              sx={{ width: "auto" }}
                            >
                              Manage
                            </Button>
                          </Box>
                        }
                        secondary={<React.Fragment></React.Fragment>}
                      />
                    </ListItem>
                  </>
                ) : (
                  <> </>
                );
              })}
          </List>
        </Box>
        <Pagination
          sx={{ mt: 2, mx: "auto" }}
          count={Math.ceil(history.length / itemsCount)}
          variant="outlined"
          shape="rounded"
          onChange={(event: React.ChangeEvent<unknown>, value: number) => {
            setPageNumber(value);
          }}
        />
        <Box
          sx={{
            maxWidth: 800,
            width: "90%",
            alignSelf: "center",
          }}
        >
          <Button sx={{ width: "auto", float: "right" }} onClick={onAddNode}>
            Add Staking Node
          </Button>
        </Box>

        <Box sx={{}}></Box>
      </Box>
    </>
  );
}

export default Staking;
