import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import React from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const HowItWorksPage = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        How It Works
      </Typography>
      <Typography variant="subtitle1" paragraph textAlign="center">
        Get started with SettlEase in just a few simple steps.
      </Typography>
      <List sx={{ maxWidth: "800px", margin: "0 auto" }}>
        <ListItem>
          <ListItemIcon>
            <PlayArrowIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                Connect your Google Account for a seamless onboarding experience.
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PlayArrowIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                Search for any type of place you'd like to explore in your new city – gyms, restaurants, museums, and more!
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PlayArrowIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                Discover hidden gems and save your favorite places to build your perfect SettlEase.
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default HowItWorksPage;
