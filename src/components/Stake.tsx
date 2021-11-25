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

export default function Stake(props: any): React.ReactElement {
  const { addresses, balance, onSend, wallet, network } = props;
  const [available, setAvailable] = React.useState(balance.nav.confirmed / 1e8);
  const [from, setFrom] = React.useState("nav");
  const [to, setTo] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [errorDest, setErrorDest] = React.useState(false);
  const [errorAmount, setErrorAmount] = React.useState(false);

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
        Send
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
                  setAvailable(balance.nav.confirmed / 1e8);
                } else if (e.target.value == "xnav") {
                  setAvailable(balance.xnav.confirmed / 1e8);
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
            <TextField
              autoComplete="off"
              id="destination"
              label="Destination"
              placeholder="The address to send the coins to"
              fullWidth
              error={errorDest}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                if (wallet.bitcore.Address.isValid(e.target.value)) {
                  setTo(e.target.value);
                  setErrorDest(false);
                } else {
                  console.log(
                    wallet.bitcore.Address.getValidationError(e.target.value)
                  );
                  setErrorDest(true);
                }
              }}
            />

            <TextField
              autoComplete="off"
              id="amount"
              label="Amount"
              placeholder="The amount to send"
              fullWidth
              error={errorAmount}
              InputLabelProps={{
                shrink: true,
              }}
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
                    <Typography>MAX</Typography>
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
              if (!errorDest && !errorAmount && to && amount) {
                await onSend(from, to, amount * 1e8);
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
