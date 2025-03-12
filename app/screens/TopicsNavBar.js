import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

const topics = ["Culture", "Social", "Sports", "Technology", "Travel"];

const TopicsNavBar = ({ onTopicSelect }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    onTopicSelect(topics[newValue]); // Pass selected topic to parent
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        {topics.map((topic, index) => (
          <Tab key={index} label={topic} />
        ))}
      </Tabs>
    </Box>
  );
};

export default TopicsNavBar;
