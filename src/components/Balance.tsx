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

function Balance(props: any): React.ReactElement {
  const {
    balances,
    history,
    syncProgress,
    pendingQueue,
    onSwap,
    onStake,
    onDotNav,
  } = props;

  const [hideWarning, setHideWarning] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const { height, width } = useWindowDimensions();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const itemsCount = Math.floor((height - 390) / 70);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      {syncProgress < 100 && syncProgress >= 0 ? (
        <>
          <Typography sx={{ width: "100", textAlign: "center", p: 2 }}>
            Synchronizing...{" "}
            {pendingQueue > 0 ? `${pendingQueue} transactions left.` : ""}
          </Typography>
          <LinearProgress
            variant={syncProgress == 0 ? "indeterminate" : "determinate"}
            value={syncProgress}
            sx={{ backgroundColor: "background.paper" }}
          ></LinearProgress>
        </>
      ) : (
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
          Home
        </Typography>
      )}

      {syncProgress < 100 && syncProgress >= 0 && !hideWarning && (
        <Alert
          sx={{
            maxWidth: 400,
            alignSelf: "center",
            px: 4,
            mt: 2,
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          severity={"warning"}
          onClick={() => {
            setHideWarning(true);
          }}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          The wallet is currently syncing, the balances won't be accurate.
          <Box sx={{ textAlign: "right", fontSize: 10 }}>
            Click to hide warning
          </Box>
        </Alert>
      )}
        <img src={"data:image/jpeg;base64,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"}>
      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 1,
          p: 1,
          mt: 2,
          alignSelf: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box sx={{ padding: 1 }}>
            <Box
              sx={{
                color: "text.primary",
                fontSize: 18,
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {(
                (balances.nav.confirmed + balances.nav.pending) /
                1e8
              ).toLocaleString()}
            </Box>
            <Box
              sx={{
                color: "success.dark",
                fontSize: 12,
                verticalAlign: "sub",
              }}
            />
            <Box
              sx={{
                color: "info.dark",
                fontWeight: "medium",
                mx: 0.5,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Public NAV
            </Box>
          </Box>

          <Box sx={{ padding: 1 }}>
            <Box
              sx={{
                color: "text.secondary",
                fontSize: 18,
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {(
                (balances.xnav.confirmed + balances.xnav.pending) /
                1e8
              ).toLocaleString()}
            </Box>
            <Box
              sx={{
                color: "success.dark",
                fontSize: 12,
                verticalAlign: "sub",
              }}
            />
            <Box
              sx={{
                color: "info.dark",
                fontWeight: "medium",
                mx: 0.5,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Private xNAV
            </Box>
          </Box>

          <Box sx={{ padding: 1 }}>
            <Box
              sx={{
                color: "text.secondary",
                fontSize: 18,
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {(
                (balances.staked.confirmed + balances.staked.pending) /
                1e8
              ).toLocaleString()}
            </Box>
            <Box
              sx={{
                color: "success.dark",
                fontSize: 12,
                verticalAlign: "sub",
              }}
            />
            <Box
              sx={{
                color: "info.dark",
                fontWeight: "medium",
                mx: 0.5,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Staking NAV
            </Box>
          </Box>

          <Box
            sx={{
              padding: 1,
              marginLeft: "auto",
            }}
          >
            <Box
              sx={{
                color: "text.secondary",
                fontSize: 18,
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              <div>
                <IconButton
                  aria-controls="basic-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <ExpandMoreOutlined />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    sx={{ padding: 1, px: 4 }}
                    onClick={() => {
                      onSwap();
                      handleClose();
                    }}
                  >
                    Swap NAV/xNAV
                  </MenuItem>
                  <MenuItem
                    sx={{ padding: 1, px: 4 }}
                    onClick={() => {
                      onStake();
                      handleClose();
                    }}
                  >
                    Staking
                  </MenuItem>
                  <MenuItem
                    sx={{ padding: 1, px: 4 }}
                    onClick={() => {
                      onDotNav();
                      handleClose();
                    }}
                  >
                    dotNav
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
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
          {history
            .slice((pageNumber - 1) * itemsCount, pageNumber * itemsCount)
            .map((el: any) => {
              return (
                <>
                  <ListItem
                    alignItems="flex-start"
                    key={el.id}
                    sx={{
                      paddingLeft: 4,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={el.type == "xnav" ? xnav : nav}
                        src={el.type == "xnav" ? xnav : nav}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: (theme) =>
                              el.amount > 0
                                ? theme.palette.success.light
                                : theme.palette.error.light,
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          {String(el.amount / (el.type == "nft" ? 1 : 1e8)) +
                            " " +
                            (el.type == "xnav"
                              ? "xNAV"
                              : el.type == "token" || el.type == "nft"
                              ? el.token_name
                              : "NAV")}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline", fontSize: "12px" }}
                            variant="body2"
                            color="text.primary"
                          >
                            {el.type == "nav"
                              ? "NAV"
                              : el.type == "xnav"
                              ? "xNAV"
                              : el.type == "nft"
                              ? "NFT"
                              : el.type == "token"
                              ? "Private Token"
                              : "Staking"}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{
                              paddingRight: 4,
                              textAlign: "right",
                              fontSize: "12px",
                            }}
                            color="text.secondary"
                            variant="body2"
                          >
                            {new Date(el.timestamp * 1000).toLocaleString()}{" "}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{
                              paddingRight: 4,
                              textAlign: "right",
                              fontSize: "12px",
                            }}
                            color="text.secondary"
                            variant="body2"
                          >
                            {el.confirmed ? "Confirmed" : "Pending"}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </>
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

      <Box sx={{}}></Box>
    </Box>
  );
}

export default Balance;
