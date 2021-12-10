import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ContentCopyIcon from "@material-ui/icons/ContentCopy";
import { Box, Input, Paper, Tab, Tabs, TextField } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import Receive from "./Receive";
import Send from "./Send";

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function OpenNode(props: any) {
  const {
    open,
    onClose,
    onRename,
    error,
    nodeData,
    walletAddresses,
    bitcore,
    network,
    wallet,
    onSend,
    utxos,
    history,
  } = props;

  const balanceSpending = props.balance;

  if (!wallet) return <></>;

  if (!walletAddresses["spending"]) return <Typography>Loading</Typography>;
  let spending = Object.keys(walletAddresses["spending"]["public"])[0];
  if (!spending) return <Typography>Loading</Typography>;
  for (const i in walletAddresses["spending"]["public"]) {
    if (!walletAddresses["spending"]["public"][i].used) {
      spending = i;
      break;
    }
  }

  if (!nodeData) return <div></div>;

  const handleClose = onClose;

  const coldStaking = bitcore.Address.fromBuffers(
    [
      new Buffer([bitcore.Networks[network].coldstaking]),
      bitcore.Address(nodeData.label.address).toBuffer().slice(1),
      bitcore.Address(spending).toBuffer().slice(1),
    ],
    network,
    "coldstaking"
  );

  const addresses: any = { spending: { public: {} } };
  if (coldStaking.toString())
    addresses.spending.public[coldStaking.toString()] = { used: 0 };

  const balance = {
    staked: walletAddresses["staking"][nodeData.label.address]["staking"],
    nav: { confirmed: 0, pending: 0 },
    xnav: { confirmed: 0, pending: 0 },
  };

  const [tabValue, setTabValue] = React.useState(0);

  const oneDay = 24 * 60 * 60;
  const today = Math.floor(Date.now() / 1000);

  const stakingStats: any = {};
  let totalStaked = 0;
  let totalStaked30d = 0;

  for (const h in history) {
    const diffDays = Math.round(
      Math.abs((today - history[h].timestamp) / oneDay)
    );

    if (
      history[h].pos == 1 &&
      history[h].addresses_in &&
      history[h].addresses_in.staking.indexOf(nodeData.label.address) != -1
    ) {
      if (diffDays < 30) {
        if (!stakingStats[diffDays]) stakingStats[diffDays] = 0;
        stakingStats[diffDays] += history[h].amount;
        totalStaked30d += history[h].amount;
      }
      totalStaked += history[h].amount;
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {nodeData.label.name ? nodeData.label.name : nodeData.label.address}
        </BootstrapDialogTitle>
        <DialogContent
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <Tabs
              value={tabValue}
              onChange={(a: any, b: any) => {
                handleChange(a, b);
              }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Staking Node"
            >
              <Tab label="Info" />
              <Tab label="Receiving Address" />
              <Tab label="Stake" />
              <Tab label="Unstake" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Typography sx={{ mb: 2 }}>
                Address: {nodeData.label.address}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Staking balance:{" "}
                {(walletAddresses["staking"][nodeData.label.address]["staking"]
                  .confirmed +
                  walletAddresses["staking"][nodeData.label.address]["staking"]
                    .pending) /
                  1e8}{" "}
                NAV
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Total staked: {totalStaked / 1e8} NAV
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Total staked 30 days: {totalStaked30d / 1e8} NAV
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Average per day:{" "}
                {Object.keys(stakingStats).length
                  ? totalStaked30d / Object.keys(stakingStats).length / 1e8
                  : 0}{" "}
                NAV
              </Typography>
              {Object.keys(stakingStats).length > 1 ? (
                <Typography sx={{ mb: 2 }}>
                  Estimated yearly return:{" "}
                  {walletAddresses["staking"][nodeData.label.address]["staking"]
                    .confirmed +
                    walletAddresses["staking"][nodeData.label.address][
                      "staking"
                    ].pending >
                    0 && Object.keys(stakingStats).length
                    ? (
                        ((totalStaked30d / Object.keys(stakingStats).length) *
                          36500) /
                        (walletAddresses["staking"][nodeData.label.address][
                          "staking"
                        ].confirmed +
                          walletAddresses["staking"][nodeData.label.address][
                            "staking"
                          ].pending)
                      ).toFixed(2)
                    : 0}
                  {"%"}
                </Typography>
              ) : (
                <></>
              )}

              <Button
                sx={{ width: "auto", display: "none" }}
                onClick={() => {
                  onRename(
                    nodeData.label.address,
                    nodeData.label.name
                      ? nodeData.label.name
                      : nodeData.label.address
                  );
                }}
              >
                Change label
              </Button>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Receive hideTitle={true} addresses={addresses}></Receive>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Send
                wallet={wallet}
                network={network}
                balance={balanceSpending}
                onSend={(a: any, b: any, c: any, d: any, e: any) => {
                  onSend(a, b, c, d, e);
                  handleClose();
                }}
                hideTo={true}
                destination={coldStaking.toString()}
                hideTitle={true}
              ></Send>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Send
                wallet={wallet}
                network={network}
                balance={balance}
                onSend={(a: any, b: any, c: any, d: any, e: any) => {
                  onSend(a, b, c, d, e);
                  handleClose();
                }}
                utxoType={0x2}
                address={nodeData.label.address}
                destination={spending}
                hideTitle={true}
                hideFrom={true}
              ></Send>
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
