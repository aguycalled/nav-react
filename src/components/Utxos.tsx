import React, { useState } from "react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";

import nav from "../assets/NAV.png";
import xnav from "../assets/XNAV.png";

function Utxos(props: any): React.ReactElement {
  const { utxos } = props;

  return (
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
          maxHeight: 600,
          bgcolor: "background.paper",
          overflow: "scroll",
          flexGrow: 1,
        }}
      >
        {utxos
          .map((e: any) => {
            return {
              txid: e.txid,
              vout: e.vout,
              amount: e.amount,
              type: e.type,
            };
          })
          .map((el: any) => {
            return (
              <ListItem
                alignItems="flex-start"
                key={el.txid + ":" + el.vout}
                sx={{
                  paddingLeft: 4,
                }}
              >
                <ListItemAvatar>
                  <Avatar alt="Cindy Baker" src={el.type == 0x4 ? xnav : nav} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: (theme) =>
                          el.amount > 0
                            ? theme.palette.success.light
                            : theme.palette.error.light,
                      }}
                    >
                      {" "}
                      {String(el.amount / 1e8) +
                        " " +
                        (el.type == 0x4 ? "xNAV" : "NAV")}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        variant="body2"
                        color="text.primary"
                      >
                        {el.txid + " " + el.vout}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
}

export default Utxos;
