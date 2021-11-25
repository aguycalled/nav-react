import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import React from "react";

import SplitButton from "./elements/SplitButton";

export default function Swap(props: any): React.ReactElement {
  const { addresses, balance, onSend, wallet, network } = props;
  const [available, setAvailable] = React.useState(balance.nav.confirmed / 1e8);
  const [from, setFrom] = React.useState("nav");
  const [to, setTo] = React.useState("xnav");
  const [amount, setAmount] = React.useState<number | undefined>(undefined);
  const [errorAmount, setErrorAmount] = React.useState(false);

  if (!addresses["spending"]) return <Typography>Loading</Typography>;

  let navAddress = Object.keys(addresses["spending"]["public"])[0];
  for (const i in addresses["spending"]["public"]) {
    if (!addresses["spending"]["public"][i].used) {
      navAddress = i;
      break;
    }
  }

  let xNavAddress = Object.keys(addresses["spending"]["private"])[0];
  for (const i in addresses["spending"]["private"]) {
    if (!addresses["spending"]["private"][i].used) {
      xNavAddress = i;
      break;
    }
  }

  const [destination, setDestination] = React.useState(xNavAddress);

  return (
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
        Swap
      </Typography>
      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          borderRadius: 1,
          mt: 2,

          p: 2,
          pt: 4,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            m: (theme) => theme.spacing(0, 1, 1, 1),
          }}
        >
          <Stack spacing={2}>
            <Typography>From:</Typography>

            <Select
              id="network"
              value={from}
              fullWidth
              onChange={(e) => {
                if (e.target.value == "nav") {
                  if (amount == balance.xnav.confirmed / 1e8)
                    setAmount(balance.nav.confirmed / 1e8);
                  setAvailable(balance.nav.confirmed / 1e8);
                  setTo("xnav");
                  setDestination(xNavAddress);
                } else if (e.target.value == "xnav") {
                  if (amount == balance.nav.confirmed / 1e8)
                    setAmount(balance.xnav.confirmed / 1e8);
                  setAvailable(balance.xnav.confirmed / 1e8);
                  setTo("nav");
                  setDestination(navAddress);
                }
                setFrom(e.target.value);
              }}
              displayEmpty
            >
              <MenuItem key="nav" value="nav">
                NAV ({balance.nav.confirmed / 1e8} available)
              </MenuItem>
              <MenuItem key="xnav" value="xnav">
                xNAV ({balance.xnav.confirmed / 1e8} available)
              </MenuItem>
            </Select>

            <Typography>To:</Typography>
            <Select
              id="network"
              value={to}
              fullWidth
              onChange={(e) => {
                if (e.target.value == "nav") {
                  if (amount == balance.xnav.confirmed / 1e8)
                    setAmount(balance.nav.confirmed / 1e8);
                  setAvailable(balance.nav.confirmed / 1e8);
                  setFrom("xnav");
                  setDestination(xNavAddress);
                } else if (e.target.value == "xnav") {
                  if (amount == balance.nav.confirmed / 1e8)
                    setAmount(balance.xnav.confirmed / 1e8);
                  setAvailable(balance.xnav.confirmed / 1e8);
                  setFrom("nav");
                  setDestination(navAddress);
                }
                setTo(e.target.value);
              }}
              displayEmpty
            >
              <MenuItem key="nav" value="nav">
                NAV ({balance.nav.confirmed / 1e8} available)
              </MenuItem>
              <MenuItem key="xnav" value="xnav">
                xNAV ({balance.xnav.confirmed / 1e8} available)
              </MenuItem>
            </Select>

            <TextField
              autoComplete="off"
              id="amount"
              label="Amount"
              placeholder="The amount to swap"
              fullWidth
              error={errorAmount}
              InputLabelProps={{
                shrink: true,
              }}
              value={amount}
              onChange={(e) => {
                const am = parseFloat(e.target.value);
                if (am > 0 && am <= available) {
                  setAmount(am);
                  setErrorAmount(false);
                } else {
                  setErrorAmount(true);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      onClick={() => {
                        setAmount(available);
                      }}
                    >
                      MAX
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Box>
        <Box
          sx={{
            m: (theme) => theme.spacing(2, 1, 1, 1),
          }}
        >
          <Button
            onClick={async () => {
              if (!errorAmount && destination && amount) {
                await onSend(from, destination, amount * 1e8);
              }
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
